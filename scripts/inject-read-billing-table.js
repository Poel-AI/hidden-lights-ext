/**
 * Runs in page. Reads ALL billing table rows into structured JSON.
 * Uses known positional columns for core fields, plus extracts ALL
 * remaining columns dynamically so the AI can reference any column.
 *
 * Sets window.__billingTableData = { headers: [...], keys: [...], rows: [...], totalRows }
 * or { error: string }.
 */
(function () {
  function getText(el) {
    if (!el) return '';
    var a = el.querySelector('a.vcard, a.overflow-hidden');
    if (a) return (a.textContent || '').trim();
    return (el.textContent || '').trim();
  }

  function cellText(tds, idx) {
    if (idx < 0 || idx >= tds.length) return '';
    return getText(tds[idx]) || (tds[idx].textContent || '').replace(/\s+/g, ' ').trim();
  }

  function findTable() {
    var tables = document.querySelectorAll('table');
    for (var i = 0; i < tables.length; i++) {
      var t = tables[i];
      var header = t.querySelector('thead th, tr th');
      if (header && (t.textContent || '').includes('Date') && (t.textContent || '').includes('Time')) {
        return t;
      }
    }
    return document.querySelector('table') || null;
  }

  function getHeaderLabel(th) {
    if (!th) return '';
    var clone = th.cloneNode(true);
    var menus = clone.querySelectorAll('ul.dropdown-menu, ul[role="menu"]');
    for (var i = 0; i < menus.length; i++) menus[i].parentNode.removeChild(menus[i]);
    var toggle = clone.querySelector('a[data-toggle="dropdown"]');
    if (toggle) {
      var t = (toggle.textContent || '').trim();
      if (t) return t;
    }
    var spans = clone.querySelectorAll('span[path]');
    for (var i = 0; i < spans.length; i++) {
      var s = (spans[i].textContent || '').trim();
      if (s) return s;
    }
    var text = (clone.textContent || '').replace(/\s+/g, ' ').trim();
    return text;
  }

  function toKey(label, idx) {
    if (!label) return 'col' + idx;
    var k = label
      .replace(/&nbsp;/g, ' ')
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .trim()
      .replace(/\s+(.)/g, function (_, c) { return c.toUpperCase(); })
      .replace(/^\w/, function (c) { return c.toLowerCase(); });
    return k || 'col' + idx;
  }

  var table = findTable();
  if (!table) {
    window.__billingTableData = { error: 'No billing table found.' };
    return;
  }

  var headerRow = table.querySelector('tr');
  var ths = headerRow ? headerRow.querySelectorAll('th') : [];
  var rawHeaders = [];
  var rawKeys = [];
  var usedKeys = {};
  for (var h = 0; h < ths.length; h++) {
    var label = getHeaderLabel(ths[h]);
    rawHeaders.push(label);
    var key = toKey(label, h);
    if (usedKeys[key]) {
      var suffix = 2;
      while (usedKeys[key + suffix]) suffix++;
      key = key + suffix;
    }
    usedKeys[key] = true;
    rawKeys.push(key);
  }

  var tbody = table.querySelector('tbody');
  if (!tbody) {
    window.__billingTableData = { error: 'No tbody found in billing table.' };
    return;
  }

  var trs = Array.from(tbody.querySelectorAll('tr')).filter(function (tr) {
    return tr.querySelectorAll('td').length >= 6;
  });

  var KNOWN = {
    6: 'date', 7: 'time', 8: 'client', 9: 'payor', 10: 'providers',
    11: 'labels', 12: 'serviceAuth', 13: 'location',
    14: 'hrs', 15: 'units', 16: 'billedRate'
  };

  var rows = [];
  for (var i = 0; i < trs.length; i++) {
    var tr = trs[i];
    var tds = tr.querySelectorAll('td');
    var n = tds.length;
    var row = { idx: i };

    for (var knownIdx in KNOWN) {
      var ci = parseInt(knownIdx, 10);
      row[KNOWN[knownIdx]] = cellText(tds, ci);
    }

    var dateCell = (tds.length > 6 ? tds[6].textContent || '' : '').trim();
    var dateMatch = dateCell.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
    if (dateMatch) row.date = dateMatch[0];

    var hasAgreed = n >= 29;
    if (hasAgreed && n > 17) row.agreedRate = cellText(tds, 17);
    row.owed = cellText(tds, n - 2);
    row.paid = cellText(tds, n - 3);
    row.adj = cellText(tds, n - 4);
    row.prAmt = cellText(tds, n - 5);
    if (hasAgreed) {
      row.billedCharges = cellText(tds, n - 8);
      row.agreedCharges = cellText(tds, n - 7);
      row.calcAdj = cellText(tds, n - 6);
    } else {
      row.billedCharges = cellText(tds, n - 6);
    }

    for (var c = 0; c < n; c++) {
      var dynKey = c < rawKeys.length ? rawKeys[c] : 'col' + c;
      if (!row.hasOwnProperty(dynKey)) {
        row[dynKey] = cellText(tds, c);
      }
    }

    rows.push(row);
  }

  window.__billingTableData = {
    headers: rawHeaders,
    keys: rawKeys,
    rows: rows,
    totalRows: trs.length
  };
})();
