/**
 * Injected into the timesheet page. Finds the notes table (tbody.MuiTableBody-root with tr rows),
 * finds the row whose title cell contains the given date and name, and clicks that row.
 * Set window.__noteMatchDate and window.__noteMatchName before injecting (or use defaults).
 * Loose matching: case-insensitive, collapsed spaces.
 * Result: window.__clickNoteByDateNameResult = { success, clicked, matchedText, error? }
 */
(function () {
  var dateStr = (typeof window.__noteMatchDate === 'string' && window.__noteMatchDate.trim())
    ? window.__noteMatchDate.trim()
    : '03/17/2026';
  var nameStr = (typeof window.__noteMatchName === 'string' && window.__noteMatchName.trim())
    ? window.__noteMatchName.trim()
    : 'Molly Egan';

  function normalize(s) {
    return (s || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function findNotesTableBody() {
    var tbody = document.querySelector('tbody.MuiTableBody-root');
    if (tbody && tbody.querySelectorAll('tr.MuiTableRow-root').length > 0) return tbody;
    tbody = document.querySelector('tbody');
    if (tbody && tbody.querySelectorAll('tr').length > 0) return tbody;
    return null;
  }

  /** Canonical MM/DD/YYYY for comparison (handles 4/1/2026 vs 04/01/2026). */
  function canonMdY(s) {
    if (!s || typeof s !== 'string') return '';
    var m = s.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!m) return '';
    var mo = parseInt(m[1], 10);
    var day = parseInt(m[2], 10);
    var y = m[3];
    if (mo < 1 || mo > 12 || day < 1 || day > 31) return '';
    return String(mo).padStart(2, '0') + '/' + String(day).padStart(2, '0') + '/' + y;
  }

  /** Session date encoded at end of note title (Name column), not "Date created". */
  function extractTrailingDateFromNoteTitle(titleText) {
    var m = (titleText || '').trim().match(/(\d{1,2}\/\d{1,2}\/\d{4})\s*$/);
    return m ? m[1] : '';
  }

  /**
   * Text from the Name column only (never full row — row includes "Date created" and would false-match).
   */
  function getNoteTitleCellText(row) {
    var cells = row.querySelectorAll('td');
    for (var i = 0; i < cells.length; i++) {
      var p = cells[i].querySelector('p.MuiTypography-body1, p.jss22251, p');
      if (!p) continue;
      var t = (p.textContent || '').trim();
      if (t.length > 15 && /\b97153\b|\b97155\b|\b\d{5}\s+\S/.test(t)) return t;
      if (t.length > 20 && t.indexOf('97153') !== -1) return t;
    }
    return '';
  }

  function rowMatchesDateAndName(row, datePart, namePart) {
    var title = getNoteTitleCellText(row);
    if (!title) return false;
    var nTitle = normalize(title);
    var nName = normalize(namePart);
    var nDateCanon = canonMdY(typeof datePart === 'string' ? datePart.trim() : '');
    if (!nDateCanon && !nName) return false;
    if (nName && nTitle.indexOf(nName) === -1) return false;
    if (!nDateCanon) return true;
    var titleDate = extractTrailingDateFromNoteTitle(title);
    if (!titleDate) return false;
    return canonMdY(titleDate) === nDateCanon;
  }

  function findMatchingRow(tbody, datePart, namePart) {
    var rows = tbody.querySelectorAll('tr.MuiTableRow-root, tr');
    for (var i = 0; i < rows.length; i++) {
      if (rowMatchesDateAndName(rows[i], datePart, namePart)) return rows[i];
    }
    return null;
  }

  function humanClick(el) {
    if (!el) return;
    var rect = el.getBoundingClientRect();
    var x = rect.left + rect.width / 2;
    var y = rect.top + rect.height / 2;
    var opts = { bubbles: true, cancelable: true, view: window, clientX: x, clientY: y };
    el.dispatchEvent(new MouseEvent('mousedown', opts));
    el.dispatchEvent(new MouseEvent('mouseup', opts));
    el.dispatchEvent(new MouseEvent('click', opts));
  }

  var tbody = findNotesTableBody();
  if (!tbody) {
    window.__clickNoteByDateNameResult = { success: false, clicked: 0, error: 'Notes table not found. Open Select existing note first.' };
    return;
  }
  var row = findMatchingRow(tbody, dateStr, nameStr);
  if (!row) {
    window.__clickNoteByDateNameResult = { success: false, clicked: 0, matchedText: dateStr + ' ' + nameStr, error: 'No note row matching date "' + dateStr + '" and name "' + nameStr + '" found.' };
    return;
  }
  function findSelectButton() {
    var buttons = document.querySelectorAll('button.MuiButton-root.MuiButton-containedPrimary, button.MuiButton-contained');
    for (var i = 0; i < buttons.length; i++) {
      var label = buttons[i].querySelector('.MuiButton-label');
      if (label && (label.textContent || '').trim().toUpperCase() === 'SELECT') return buttons[i];
    }
    return null;
  }

  try {
    humanClick(row);
    window.__clickNoteByDateNameResult = { success: true, clicked: 1, matchedText: dateStr + ' ' + nameStr };
    setTimeout(function () {
      var selectBtn = findSelectButton();
      if (selectBtn) humanClick(selectBtn);
    }, 200);
  } catch (e) {
    window.__clickNoteByDateNameResult = { success: false, clicked: 0, matchedText: dateStr + ' ' + nameStr, error: e.message || 'Click failed.' };
  }
})();
