/**
 * Runs in page. Finds billing table, parses rows, groups by client,
 * detects overlapping time ranges per date for 97155 and 97153 only.
 * Sets window.__overlaps97155Result.
 */
(function () {
  const COL = { DATE: 6, TIME: 7, CLIENT: 8, PAYOR: 9, PROVIDERS: 10, SERVICE_AUTH: 12 };

  /** Service codes to include for 97155 overlap check (substring match). */
  var OVERLAP_97155_CODE_SUBSTRINGS = ['97155', '97153'];

  /**
   * Allowed payor substrings (case-insensitive). A row's payor text must contain
   * at least one of these to be included (unless *). Reads from window.__97155AllowedPayors.
   */
  var ALLOWED_PAYOR_SUBSTRINGS = (Array.isArray(window.__97155AllowedPayors) && window.__97155AllowedPayors.length)
    ? window.__97155AllowedPayors
    : [];

  /** Blocked payor substrings — checked first; matching rows are excluded. window.__97155BlockedPayors */
  var BLOCKED_PAYOR_SUBSTRINGS = (Array.isArray(window.__97155BlockedPayors) && window.__97155BlockedPayors.length)
    ? window.__97155BlockedPayors
    : [];

  function is97155OverlapServiceRow(serviceAuth) {
    if (!serviceAuth || typeof serviceAuth !== 'string') return false;
    var s = serviceAuth.trim();
    var lower = s.toLowerCase();
    if (lower.includes('97153') && lower.includes('direct non billable')) return false;
    return OVERLAP_97155_CODE_SUBSTRINGS.some(function (code) {
      return s.includes(code);
    });
  }

  function payorFilterIncludesAll(substrings) {
    if (!Array.isArray(substrings)) return false;
    return substrings.some(function (sub) {
      return String(sub || '').trim() === '*';
    });
  }

  var EMPTY_PAYOR_SENTINEL = '(empty payor)';

  function listAllowsEmptyPayor(substrings) {
    return Array.isArray(substrings) && substrings.some(function (sub) {
      return String(sub || '').trim() === EMPTY_PAYOR_SENTINEL;
    });
  }

  function isBlockedPayor(payorText) {
    if (!BLOCKED_PAYOR_SUBSTRINGS.length) return false;
    var p = typeof payorText === 'string' ? payorText.trim() : '';
    if (!p.length && listAllowsEmptyPayor(BLOCKED_PAYOR_SUBSTRINGS)) return true;
    if (!p.length) return false;
    var lower = p.toLowerCase();
    return BLOCKED_PAYOR_SUBSTRINGS.some(function (sub) {
      var t = String(sub || '').trim();
      if (!t.length || t === EMPTY_PAYOR_SENTINEL) return false;
      return lower.includes(t.toLowerCase());
    });
  }

  function isAllowedPayor(payorText) {
    if (payorFilterIncludesAll(ALLOWED_PAYOR_SUBSTRINGS)) return true;
    var p = typeof payorText === 'string' ? payorText.trim() : '';
    if (!p.length) return listAllowsEmptyPayor(ALLOWED_PAYOR_SUBSTRINGS);
    var lower = p.toLowerCase();
    return ALLOWED_PAYOR_SUBSTRINGS.some(function (sub) {
      var t = String(sub || '').trim();
      if (t === '*' || t === EMPTY_PAYOR_SENTINEL) return false;
      return lower.includes(t.toLowerCase());
    });
  }

  /**
   * After blacklist: either allowed, or "unknown" (on neither list in strict mode).
   * When allow list is *, unknown is impossible unless payor is empty string.
   */
  function payorDisposition(payorRaw) {
    var payor = typeof payorRaw === 'string' ? payorRaw.trim() : '';
    var displayKey = payor.length ? payor : '(empty payor)';
    if (isBlockedPayor(payor)) return { kind: 'blocked', displayKey: displayKey };
    if (payorFilterIncludesAll(ALLOWED_PAYOR_SUBSTRINGS)) return { kind: 'allowed', displayKey: displayKey };
    if (isAllowedPayor(payor)) return { kind: 'allowed', displayKey: displayKey };
    return { kind: 'unknown', displayKey: displayKey };
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
    window.__overlaps97155Result = { error: 'No billing table found.' };
    return;
  }

  const rows = Array.from(tbody.querySelectorAll('tr')).filter(tr => tr.querySelectorAll('td').length >= 13);
  const totalTableRows = rows.length;
  var entries = [];
  var skippedBlacklistRows = 0;
  var skippedUnknownPayorRows = 0;
  var unknownPayorEntries = {};
  for (var i = 0; i < rows.length; i++) {
    var tr = rows[i];
    var tds = tr.querySelectorAll('td');
    if (tds.length <= COL.SERVICE_AUTH) continue;
    var dateCell = (tds[COL.DATE].textContent || '').trim();
    var dateMatch = dateCell.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
    var date = dateMatch ? dateMatch[0] : dateCell;
    var timeStr = (tds[COL.TIME].textContent || '').trim();
    var range = parseTimeRange(timeStr);
    if (!range) continue;
    /** Zero-length rows (e.g. 4:07–4:07p) are not real appointments — skip for overlap scan. */
    if (range.endMinutes <= range.startMinutes) continue;
    var client = getText(tds[COL.CLIENT]) || (tds[COL.CLIENT].textContent || '').trim();
    var payor = (tds[COL.PAYOR].textContent || '').trim();
    var provider = getText(tds[COL.PROVIDERS]) || (tds[COL.PROVIDERS].textContent || '').trim();
    var serviceAuth = getText(tds[COL.SERVICE_AUTH]) || (tds[COL.SERVICE_AUTH].textContent || '').trim();
    if (!is97155OverlapServiceRow(serviceAuth)) continue;
    var disp = payorDisposition(payor);
    if (disp.kind === 'blocked') {
      skippedBlacklistRows++;
      continue;
    }
    var parsedEntry = {
      date,
      time: timeStr,
      startMinutes: range.startMinutes,
      endMinutes: range.endMinutes,
      client,
      payor,
      provider,
      serviceAuth,
      rowId: tr.id || ''
    };
    if (disp.kind === 'unknown') {
      // Collect for overlap-checking below; don't ask unless the payor actually has concurrences
      if (!unknownPayorEntries[disp.displayKey]) unknownPayorEntries[disp.displayKey] = [];
      unknownPayorEntries[disp.displayKey].push(parsedEntry);
      continue;
    }
    entries.push(parsedEntry);
  }

  // Build a client+date index over allowed entries so we can check unknown-payor rows against them
  var allowedByClientDate = {};
  for (var ae = 0; ae < entries.length; ae++) {
    var ck = (entries[ae].client || '(no client)') + '|' + entries[ae].date;
    if (!allowedByClientDate[ck]) allowedByClientDate[ck] = [];
    allowedByClientDate[ck].push(entries[ae]);
  }

  // Only surface an unknown payor for classification if at least one of its rows overlaps
  // with another row (allowed or unknown) in the same client+date bucket.
  var unknownPayors = Object.keys(unknownPayorEntries).sort().filter(function (payorKey) {
    var ues = unknownPayorEntries[payorKey];
    for (var ui = 0; ui < ues.length; ui++) {
      var ck = (ues[ui].client || '(no client)') + '|' + ues[ui].date;
      // Check against allowed-payor entries for same client+date
      var peers = allowedByClientDate[ck] || [];
      for (var pi = 0; pi < peers.length; pi++) {
        if (overlaps(ues[ui], peers[pi])) return true;
      }
      // Check against other rows of the same unknown payor in the same client+date bucket
      for (var uj = ui + 1; uj < ues.length; uj++) {
        if (ues[ui].client === ues[uj].client && ues[ui].date === ues[uj].date && overlaps(ues[ui], ues[uj])) return true;
      }
    }
    return false;
  });

  // Count unknown-payor rows held back from overlap results until classified (not on allow or block list).
  for (var upk in unknownPayorEntries) {
    skippedUnknownPayorRows += unknownPayorEntries[upk].length;
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

  window.__overlaps97155Result = {
    overlappingGroups: overlappingGroups,
    totalRows: entries.length,
    totalTableRows: totalTableRows,
    uniqueClients: Object.keys(byClient).length,
    skippedBlacklistRows: skippedBlacklistRows,
    skippedUnknownPayorRows: skippedUnknownPayorRows,
    unknownPayors: unknownPayors,
    skippedPayorRows: skippedBlacklistRows + skippedUnknownPayorRows,
    allowedPayors: ALLOWED_PAYOR_SUBSTRINGS,
    blockedPayors: BLOCKED_PAYOR_SUBSTRINGS
  };
})();
