/**
 * Runs in page. Finds billing table, parses rows, groups by client,
 * detects overlapping time ranges per date, sets window.__overlapsResult.
 * Only considers rows whose service code includes one of the overpay codes below.
 */
(function () {
  const COL = { DATE: 6, TIME: 7, CLIENT: 8, PAYOR: 9, PROVIDERS: 10, SERVICE_AUTH: 12 };

  /** Service codes to include for overlap check (substring match). Add more as needed. */
  const OVERPAY_SERVICE_CODE_SUBSTRINGS = ['92507', '97153'];

  function isOverpayServiceRow(serviceAuth) {
    if (!serviceAuth || typeof serviceAuth !== 'string') return false;
    const s = serviceAuth.trim();
    return OVERPAY_SERVICE_CODE_SUBSTRINGS.some(function (code) {
      return s.includes(code);
    });
  }

  function parseTimeToMinutes(s) {
    if (!s || typeof s !== 'string') return null;
    s = s.trim().toLowerCase().replace(/\s+(cst|cdt|est|edt|pst|pdt|utc)$/i, '').trim();
    const hasP = /p|pm/.test(s);
    const hasA = /a|am/.test(s);
    const num = s.replace(/[^\d]/g, '');
    if (!num.length) return null;
    let h, m;
    if (num.length <= 2) {
      h = parseInt(num, 10);
      m = 0;
    } else {
      h = parseInt(num.slice(0, -2), 10);
      m = parseInt(num.slice(-2), 10);
    }
    if (h === 12 && hasA) h = 0;
    else if (h !== 12 && hasP) h += 12;
    return h * 60 + m;
  }

  function parseTimeRange(timeStr) {
    if (!timeStr || typeof timeStr !== 'string') return null;
    const clean = timeStr.trim().replace(/\s+(cst|cdt|est|edt|pst|pdt|utc)$/i, '').trim();
    const dash = clean.indexOf('-');
    if (dash === -1) return null;
    const startStr = clean.slice(0, dash).trim();
    const endStr = clean.slice(dash + 1).trim();
    let start = parseTimeToMinutes(startStr);
    let end = parseTimeToMinutes(endStr);
    if (start == null || end == null) return null;
    var endLower = endStr.toLowerCase();
    var startLower = startStr.toLowerCase();
    var endHasP = /p|pm/.test(endLower);
    var startHasP = /p|pm/.test(startLower);
    var endHasA = /a|am/.test(endLower);
    var startHasA = /a|am/.test(startLower);
    if (endHasP && !startHasP && !startHasA && start < 12 * 60 && end >= 12 * 60) start += 12 * 60;
    if (startHasP && !endHasP && !endHasA && end < 12 * 60 && start >= 12 * 60) end += 12 * 60;
    if (end < start) end += 24 * 60;
    return { startMinutes: start, endMinutes: end };
  }

  function overlaps(a, b) {
    return a.startMinutes < b.endMinutes && b.startMinutes < a.endMinutes;
  }

  function getText(el) {
    if (!el) return '';
    const a = el.querySelector('a.vcard, a.overflow-hidden');
    if (a) return (a.textContent || '').trim();
    return (el.textContent || '').trim();
  }

  function findTable() {
    const tables = document.querySelectorAll('table');
    for (const t of tables) {
      const header = t.querySelector('thead th, tr th');
      if (header && (t.textContent || '').includes('Date') && (t.textContent || '').includes('Time')) {
        const tbody = t.querySelector('tbody');
        if (tbody && tbody.querySelectorAll('tr').length > 0) return tbody;
      }
    }
    return document.querySelector('table tbody') || null;
  }

  const tbody = findTable();
  if (!tbody) {
    window.__overlapsResult = { error: 'No billing table found.' };
    return;
  }

  const rows = Array.from(tbody.querySelectorAll('tr')).filter(tr => tr.querySelectorAll('td').length >= 13);
  const totalTableRows = rows.length;
  const entries = [];
  for (const tr of rows) {
    const tds = tr.querySelectorAll('td');
    if (tds.length <= COL.SERVICE_AUTH) continue;
    const dateCell = (tds[COL.DATE].textContent || '').trim();
    const dateMatch = dateCell.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
    const date = dateMatch ? dateMatch[0] : dateCell;
    const timeStr = (tds[COL.TIME].textContent || '').trim();
    const range = parseTimeRange(timeStr);
    if (!range) continue;
    /** Zero-length rows (e.g. 4:07–4:07p) are not real appointments — skip for overlap scan. */
    if (range.endMinutes <= range.startMinutes) continue;
    const client = getText(tds[COL.CLIENT]) || (tds[COL.CLIENT].textContent || '').trim();
    const payor = (tds[COL.PAYOR].textContent || '').trim();
    const provider = getText(tds[COL.PROVIDERS]) || (tds[COL.PROVIDERS].textContent || '').trim();
    const serviceAuth = getText(tds[COL.SERVICE_AUTH]) || (tds[COL.SERVICE_AUTH].textContent || '').trim();
    if (!isOverpayServiceRow(serviceAuth)) continue;
    entries.push({
      date,
      time: timeStr,
      startMinutes: range.startMinutes,
      endMinutes: range.endMinutes,
      client,
      payor,
      provider,
      serviceAuth,
      rowId: tr.id || ''
    });
  }

  const byClient = {};
  for (const e of entries) {
    const key = e.client || '(no client)';
    if (!byClient[key]) byClient[key] = [];
    byClient[key].push(e);
  }

  /** Pairwise overlaps with a positive time window (avoids chain merges with no common intersection). */
  function mergeOverlapGroups(dateEntries) {
    const n = dateEntries.length;
    const groups = [];
    const seen = new Set();
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const a = dateEntries[i];
        const b = dateEntries[j];
        if (!overlaps(a, b)) continue;
        const overlapStart = Math.max(a.startMinutes, b.startMinutes);
        const overlapEnd = Math.min(a.endMinutes, b.endMinutes);
        if (overlapEnd <= overlapStart) continue;
        const key = [a.rowId || 'i' + i, b.rowId || 'j' + j].sort().join('|');
        if (seen.has(key)) continue;
        seen.add(key);
        groups.push([a, b]);
      }
    }
    return groups;
  }

  const overlappingGroups = [];
  for (const [client, clientEntries] of Object.entries(byClient)) {
    const byDate = {};
    for (const e of clientEntries) {
      const d = e.date;
      if (!byDate[d]) byDate[d] = [];
      byDate[d].push(e);
    }
    for (const [date, dateEntries] of Object.entries(byDate)) {
      const groups = mergeOverlapGroups(dateEntries);
      for (const entries of groups) {
        overlappingGroups.push({ client, date, entries });
      }
    }
  }

  window.__overlapsResult = { overlappingGroups, totalRows: entries.length, totalTableRows, uniqueClients: Object.keys(byClient).length };
})();
