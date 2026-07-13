/**
 * Opens "Select existing session note" (MUI Autocomplete), chooses a list option
 * containing 97153 when multiple exist, then in the dialog selects the table row
 * whose text contains the configured snippet and clicks Select.
 *
 * Optional: window.__backupNoteRowSnippet (default "03/25/2026 Haley Kline").
 * Result: window.__selectExistingSessionNoteFlowResult = { success, error?, debug? }
 */
(function () {
  var SCRIPT_TAG = '[inject-select-existing-session-note-flow]';
  var CODE_MARKER = '97153';
  var ROW_SNIPPET =
    typeof window.__backupNoteRowSnippet === 'string' && window.__backupNoteRowSnippet.trim()
      ? window.__backupNoteRowSnippet.trim()
      : '03/25/2026 Haley Kline';

  /** Hidden Talents: false = do not type into Session Note Names modal filter; wait for rows until MAX_MS. */
  var ENABLE_MODAL_FILTER_SEARCH = false;

  var POLL_MS = 3000;
  /** Overall cap before failing — notes can take up to ~2.5 minutes to appear; panel poll matches this. */
  var MAX_MS = 150000;
  var ROW_MATCH_WAIT_BEFORE_SEARCH_MS = 500;
  var SEARCH_ROUND_POST_ENTER_WAIT_MS = 3000;
  var SEARCH_ROUND_POST_CLEAR_WAIT_MS = 5000;
  var SEARCH_ROUND_MAX = 3;
  var SEARCH_ROUND_TOTAL_WINDOW_MS = 25000;
  var COMBO_REOPEN_INTERVAL_MS = 450;

  window.__selectExistingSessionNoteFlowResult = null;
  var t0 = Date.now();
  var stepCounter = 0;

  function stepLog(label, data) {
    stepCounter += 1;
    var elapsed = Date.now() - t0;
    var tag = 'STEP ' + stepCounter + ' @' + elapsed + 'ms — ' + label;
    if (data !== undefined) {
      console.log(SCRIPT_TAG, tag, data);
    } else {
      console.log(SCRIPT_TAG, tag);
    }
  }

  function normalize(s) {
    return (s || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  /** Align M/D/YYYY vs MM/DD/YYYY so "4/21/2026" matches note title "04/21/2026". */
  function normalizeSlashDates(s) {
    return (s || '').replace(/\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/g, function (_, mo, da, y) {
      function p2(x) {
        var n = parseInt(x, 10);
        return ('0' + n).slice(-2);
      }
      return p2(mo) + '/' + p2(da) + '/' + y;
    });
  }

  function textForSessionNoteMatch(row) {
    var cells = row.querySelectorAll('td');
    var best = '';
    for (var i = 0; i < cells.length; i++) {
      var t = (cells[i].textContent || '').replace(/\s+/g, ' ').trim();
      if (!t) continue;
      if (
        /\b\d{1,2}\/\d{1,2}\/\d{4}\b/.test(t) ||
        /\b97\d{3}\b/.test(t) ||
        t.indexOf('Session Note') !== -1
      ) {
        return t;
      }
      if (t.length > best.length) best = t;
    }
    if (best) return best;
    return (row.textContent || '').replace(/\s+/g, ' ').trim();
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

  function isVisible(el) {
    if (!el) return false;
    var r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }

  function isSessionNoteHeaderText(t) {
    var n = normalize(t);
    if (!n) return false;
    if (n.indexOf('session note') === -1) return false;
    return n.indexOf('name') !== -1 || n.indexOf('title') !== -1;
  }

  /** Find the session-note table by a likely note-title/header label (not Last Edited). */
  function findSessionNotesTableRoot() {
    var ths = document.querySelectorAll('table thead th, table th');
    for (var i = 0; i < ths.length; i++) {
      if (isSessionNoteHeaderText(ths[i].textContent || '')) {
        var table = ths[i].closest('table');
        if (table) return table;
      }
    }
    var tables = document.querySelectorAll('table');
    for (var j = 0; j < tables.length; j++) {
      var headerText = normalize(
        ((tables[j].querySelector('thead') && tables[j].querySelector('thead').textContent) || '')
      );
      if (
        headerText &&
        headerText.indexOf('last edited') !== -1 &&
        headerText.indexOf('session note') === -1
      ) {
        continue;
      }
      if (tables[j].querySelector('tbody tr')) {
        var bodyText = normalize(tables[j].textContent || '');
        if (bodyText.indexOf('session note') !== -1 || bodyText.indexOf('97153') !== -1) {
          return tables[j];
        }
      }
    }
    return null;
  }

  function findSessionNoteInput(root) {
    var scope = root || document;
    return (
      scope.querySelector('input.MuiAutocomplete-input') ||
      scope.querySelector('input[aria-autocomplete="list"]') ||
      scope.querySelector('input[placeholder*="session note" i]')
    );
  }

  function resolveAutocompleteRoot(node) {
    if (!node) return null;
    if (node.matches && node.matches('.MuiAutocomplete-inputRoot')) return node;
    if (node.closest) {
      return (
        node.closest('.MuiAutocomplete-inputRoot') ||
        node.closest('.MuiAutocomplete-root') ||
        node.closest('[class*="MuiAutocomplete"]') ||
        node.closest('[role="dialog"]')
      );
    }
    return null;
  }

  function findSessionNoteRoot() {
    var dialog = findNotePickerDialog();
    if (dialog) {
      var inDialog = findSessionNoteInput(dialog);
      if (inDialog) {
        var inDialogRoot = resolveAutocompleteRoot(inDialog);
        if (inDialogRoot) return inDialogRoot;
      }
    }

    var seed =
      document.querySelector('[data-testid="select-existing-session-note"]') ||
      document.querySelector('[data-testid*="existing-session-note"]') ||
      document.querySelector('[aria-label*="existing session note" i]') ||
      document.querySelector('input[placeholder*="session note" i]');
    if (!seed) return null;
    return resolveAutocompleteRoot(seed) || seed;
  }

  function findVisibleListbox() {
    var uls = document.querySelectorAll('ul[role="listbox"]');
    for (var i = 0; i < uls.length; i++) {
      if (isVisible(uls[i])) return uls[i];
    }
    return null;
  }

  /**
   * Prefer [role=dialog] around the session-note table; fall back to dialog text match;
   * finally any visible host that contains the table (drawer / panel without role=dialog).
   */
  function findNotePickerDialog() {
    var sessionTable = findSessionNotesTableRoot();
    if (sessionTable && sessionTable.querySelector('tbody tr')) {
      var dlg = sessionTable.closest('[role="dialog"]');
      if (dlg) return dlg;
      dlg = sessionTable.closest('[class*="MuiDialog"]');
      if (dlg) return dlg;
      var paper = sessionTable.closest('[class*="MuiPaper-root"], [class*="Drawer"]');
      if (paper) return paper;
      return sessionTable.parentElement || sessionTable;
    }

    var dialogs = document.querySelectorAll('[role="dialog"]');
    for (var i = 0; i < dialogs.length; i++) {
      var d = dialogs[i];
      var t = normalize(d.textContent || '');
      var hasPhrase =
        t.indexOf('select existing session note') !== -1 ||
        t.indexOf('session note names') !== -1;
      if (hasPhrase && d.querySelector('table tbody')) return d;
    }
    return null;
  }

  function pickListOption(listbox) {
    var opts = listbox.querySelectorAll('li[role="option"]');
    if (!opts.length) return null;
    var withCode = null;
    for (var i = 0; i < opts.length; i++) {
      if ((opts[i].textContent || '').indexOf(CODE_MARKER) !== -1) {
        withCode = opts[i];
        break;
      }
    }
    if (opts.length > 1) return withCode;
    return withCode || opts[0];
  }

  function listboxOptionPreviews(listbox, max) {
    var opts = listbox ? listbox.querySelectorAll('li[role="option"]') : [];
    var out = [];
    for (var i = 0; i < Math.min(opts.length, max || 8); i++) {
      out.push(String((opts[i].textContent || '')).replace(/\s+/g, ' ').trim().slice(0, 180));
    }
    return out;
  }

  function getVisibleNoteRows(dialog) {
    var table = (dialog && dialog.querySelector('table')) || findSessionNotesTableRoot();
    if (!table) return { rowCount: 0, previews: [] };
    var tbody = table.querySelector('tbody');
    if (!tbody) return { rowCount: 0, previews: [] };
    var rows = tbody.querySelectorAll('tr[data-testid="row"], tr.MuiTableRow-root, tr');
    var previews = [];
    for (var i = 0; i < Math.min(rows.length, 8); i++) {
      previews.push(textForSessionNoteMatch(rows[i]).slice(0, 180));
    }
    return {
      rowCount: rows.length,
      previews: previews
    };
  }

  /**
   * Session note title is often "Provider A - Provider B - MM/DD/YYYY - 97153 Session Note" while
   * ROW_SNIPPET from billing is "MM/DD/YYYY Patricia Rivera". Substring must not require date+name order.
   */
  function buildNameVariants(raw) {
    var s = String(raw || '').trim();
    if (!s) return [];
    var out = [s];
    if (s.indexOf(',') !== -1) {
      var parts = s
        .split(',')
        .map(function (p) {
          return p.trim();
        })
        .filter(Boolean);
      if (parts.length >= 2) {
        out.push(parts.slice(1).join(' ') + ' ' + parts[0]);
      }
    }
    return out;
  }

  function nameTokens(raw) {
    return normalize(String(raw || '').replace(/[^\w\s]/g, ' '))
      .split(' ')
      .filter(function (t) {
        return t && t.length >= 3 && !/^\d+$/.test(t);
      });
  }

  function findSessionNoteSearchInput(root) {
    var scope = root || document;
    return (
      scope.querySelector('input[placeholder*="Find session notes" i]') ||
      scope.querySelector('input[placeholder*="session notes" i]') ||
      scope.querySelector('input[placeholder*="session note" i]')
    );
  }

  function setInputValue(el, value) {
    if (!el) return;
    var proto = Object.getPrototypeOf(el);
    var desc = proto && Object.getOwnPropertyDescriptor(proto, 'value');
    if (desc && typeof desc.set === 'function') {
      desc.set.call(el, value);
    } else {
      el.value = value;
    }
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function pressKey(el, key, code, keyCode) {
    if (!el) return;
    var opts = {
      key: key,
      code: code || key,
      keyCode: keyCode,
      which: keyCode,
      bubbles: true,
      cancelable: true
    };
    el.dispatchEvent(new KeyboardEvent('keydown', opts));
    el.dispatchEvent(new KeyboardEvent('keypress', opts));
    el.dispatchEvent(new KeyboardEvent('keyup', opts));
  }

  function pressEnter(el) {
    pressKey(el, 'Enter', 'Enter', 13);
  }

  function pressArrowDown(el) {
    pressKey(el, 'ArrowDown', 'ArrowDown', 40);
  }

  function tryOpenSessionNoteDropdown(root) {
    var scope = root || findSessionNoteRoot() || document;
    var pop =
      scope.querySelector('button.MuiAutocomplete-popupIndicator') ||
      scope.querySelector('button[aria-label="Open"]');
    var input = findSessionNoteInput(scope);
    var didSomething = false;
    if (pop && isVisible(pop)) {
      humanClick(pop);
      didSomething = true;
    }
    if (input) {
      input.focus();
      humanClick(input);
      pressArrowDown(input);
      didSomething = true;
    }
    return {
      didSomething: didSomething,
      hasPopupButton: !!pop,
      hasInput: !!input
    };
  }

  function buildSearchProbe(snippetRaw) {
    var s = String(snippetRaw || '').trim();
    if (!s) return CODE_MARKER;
    var m = s.match(/\b(\d{1,2}\/\d{1,2}\/\d{4})\b/);
    var datePart = m ? m[1] : '';
    var rest = m ? s.replace(m[0], '').trim() : s;
    var variants = buildNameVariants(rest);
    var tokens = nameTokens(variants[0] || rest).slice(0, 2);
    if (tokens.length >= 1 && datePart) return tokens.join(' ') + ' ' + datePart;
    if (tokens.length >= 1) return tokens.join(' ');
    if (datePart) return datePart;
    return CODE_MARKER;
  }

  function triggerSearchRefresh(dialog) {
    var input = findSessionNoteSearchInput(dialog || document);
    if (!input) return { ok: false, error: 'Find session notes input not found.' };
    var probe = buildSearchProbe(ROW_SNIPPET);
    try {
      input.focus();
      humanClick(input);
    } catch (e) {}
    setInputValue(input, probe);
    pressEnter(input);
    stepLog('search round typed + enter', { probe: probe });
    return { ok: true, probe: probe, input: input };
  }

  function clearSearchRefreshInput(dialog, fallbackInput) {
    var input =
      findSessionNoteSearchInput(dialog || document) ||
      fallbackInput ||
      findSessionNoteInput(dialog || document) ||
      null;
    if (!input) return { ok: false, error: 'Find session notes input not found for clear.' };
    try {
      input.focus();
      humanClick(input);
      if (typeof input.select === 'function') input.select();
    } catch (e) {}
    setInputValue(input, '');
    pressEnter(input);
    return { ok: true, input: input };
  }

  function snippetMatchesNoteName(noteTextRaw, snippetRaw) {
    var note = normalize(normalizeSlashDates(noteTextRaw));
    var needle = normalize(normalizeSlashDates(snippetRaw));
    if (needle.length && note.indexOf(needle) !== -1) return true;

    var m = snippetRaw.match(/\b(\d{1,2}\/\d{1,2}\/\d{4})\b/);
    if (!m) return false;
    var dateNorm = normalize(normalizeSlashDates(m[1]));
    var rest = snippetRaw.replace(m[0], '').trim();
    var restNorm = normalize(normalizeSlashDates(rest));
    if (!dateNorm.length) return false;
    if (note.indexOf(dateNorm) === -1) return false;
    if (!restNorm.length) return true;
    if (note.indexOf(restNorm) !== -1) return true;

    var variants = buildNameVariants(rest);
    for (var i = 0; i < variants.length; i++) {
      var vNorm = normalize(normalizeSlashDates(variants[i]));
      if (vNorm && note.indexOf(vNorm) !== -1) return true;
      var tokens = nameTokens(variants[i]);
      if (!tokens.length) continue;
      var hitCount = 0;
      for (var j = 0; j < tokens.length; j++) {
        if (note.indexOf(tokens[j]) !== -1) hitCount += 1;
      }
      if (tokens.length >= 2 && hitCount >= 2) return true;
      if (tokens.length === 1 && hitCount === 1) return true;
    }
    return false;
  }

  function findRowsInDialog(dialog) {
    var table = dialog.querySelector('table');
    if (!table) table = findSessionNotesTableRoot();
    if (!table) return [];
    var tbody = table.querySelector('tbody');
    if (!tbody) return [];
    var rows = tbody.querySelectorAll('tr[data-testid="row"], tr.MuiTableRow-root, tr');
    var out = [];
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      var nameCell = textForSessionNoteMatch(r);
      if (snippetMatchesNoteName(nameCell, ROW_SNIPPET)) {
        out.push({
          row: r,
          nameCell: nameCell
        });
      }
    }
    return out;
  }

  function parseMdYToMs(s) {
    var m = String(s || '').match(/\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/);
    if (!m) return 0;
    var mo = parseInt(m[1], 10) - 1;
    var da = parseInt(m[2], 10);
    var yy = parseInt(m[3], 10);
    var t = new Date(yy, mo, da).getTime();
    return isNaN(t) ? 0 : t;
  }

  function chooseBestMatch(matches) {
    if (!matches || !matches.length) return null;
    var scored = matches.map(function (m, idx) {
      var dt = parseMdYToMs((m && m.nameCell) || '');
      return {
        idx: idx,
        dt: dt,
        row: m.row,
        nameCell: m.nameCell || ''
      };
    });
    scored.sort(function (a, b) {
      if (b.dt !== a.dt) return b.dt - a.dt; // newest title date first
      return a.idx - b.idx; // stable fallback to current row order
    });
    return scored[0];
  }

  function findSelectInDialog(dialog) {
    var actions = dialog.querySelector('.MuiDialogActions-root') || dialog;
    var buttons = actions.querySelectorAll('button');
    for (var j = 0; j < buttons.length; j++) {
      var lab = buttons[j].querySelector('.MuiButton-label');
      var text = ((lab ? lab.textContent : buttons[j].textContent) || '').trim().toUpperCase();
      if (text === 'SELECT') return buttons[j];
    }
    return null;
  }

  function collectUiSnapshot() {
    var sessionTable = findSessionNotesTableRoot();
    var noteRows = sessionTable
      ? sessionTable.querySelectorAll('tbody tr[data-testid="row"], tbody tr').length
      : 0;
    var rowNameSamples = [];
    if (sessionTable) {
      var sampleRows = sessionTable.querySelectorAll('tbody tr[data-testid="row"], tbody tr');
      for (var s = 0; s < Math.min(sampleRows.length, 5); s++) {
        rowNameSamples.push(textForSessionNoteMatch(sampleRows[s]).slice(0, 180));
      }
    }
    var listbox = findVisibleListbox();
    var listOpts = listbox ? listbox.querySelectorAll('li[role="option"]').length : 0;
    var dialogs = document.querySelectorAll('[role="dialog"]');
    var dlgPreviews = [];
    for (var i = 0; i < Math.min(dialogs.length, 4); i++) {
      var t = (dialogs[i].textContent || '').replace(/\s+/g, ' ').trim().slice(0, 140);
      dlgPreviews.push(t);
    }
    var foundDialog = findNotePickerDialog();
    var matchingRows = foundDialog ? findRowsInDialog(foundDialog) : [];
    var matchRowCount = matchingRows.length;
    var matchRowPreviews = matchingRows.slice(0, 5).map(function (m) {
      return String((m && m.nameCell) || '').slice(0, 180);
    });
    var searchInput = findSessionNoteSearchInput(foundDialog || document);

    return {
      rowSnippet: ROW_SNIPPET,
      snippetNeedleNormalized: normalize(normalizeSlashDates(ROW_SNIPPET)),
      msElapsed: Date.now() - t0,
      hasAutocompleteRoot: !!findSessionNoteRoot(),
      sessionNotesTableFound: !!sessionTable,
      sessionNoteBodyRowCount: noteRows,
      noteRowNameSamples: rowNameSamples,
      listboxVisible: !!listbox,
      listboxOptionCount: listOpts,
      roleDialogCount: dialogs.length,
      roleDialogTextPreviews: dlgPreviews,
      notePickerSurfaceFound: !!foundDialog,
      rowMatchWouldSucceed: matchRowCount === 1,
      rowMatchCount: matchRowCount,
      rowMatchPreviews: matchRowPreviews,
      searchInputFound: !!searchInput,
      searchInputValue: searchInput ? String(searchInput.value || '').slice(0, 120) : '',
      fallbackSearchTried: searchRefreshTried,
      fallbackSearchInFlight: searchRefreshInFlight,
      fallbackSearchProbe: searchRefreshProbe,
      openedCombo: openedCombo,
      listOptionClicked: listOptionClicked,
      rowClickStarted: rowClickStarted,
    };
  }

  var openedCombo = false;
  var listOptionClicked = false;
  var rowClickStarted = false;
  var lastComboOpenAttemptMs = 0;
  var comboOpenAttempts = 0;
  var rowMissingSinceMs = 0;
  var searchRefreshTried = false;
  var searchRefreshInFlight = false;
  var searchRefreshProbe = '';
  var searchRefreshFinishedMs = 0;
  var lastConsoleSnapshotMs = 0;
  var CONSOLE_SNAPSHOT_THROTTLE_MS = 1200;
  var notesVisibleLogged = false;
  var lastPhaseKey = '';
  var lastRowMatchCount = -1;
  var lastDialogMissingLogMs = 0;
  var rowWaitingLogged = false;
  var lastNoMatchRowCount = -1;
  var searchRoundCount = 0;
  var searchRoundsStartedAt = 0;
  var searchRoundNextAtMs = 0;
  var searchRoundPhase = 'idle';
  var searchRoundInput = null;

  function fail(msg, debug) {
    var snap = collectUiSnapshot();
    var out = Object.assign({}, debug || {}, snap);
    stepLog('fail: ' + msg, out);
    console.warn(SCRIPT_TAG, 'FAIL:', msg, out);
    window.__selectExistingSessionNoteFlowResult = { success: false, error: msg, debug: out };
  }

  function succeed(debug) {
    var snap = collectUiSnapshot();
    stepLog('success', Object.assign({}, debug || {}, snap));
    console.log(SCRIPT_TAG, 'OK', Object.assign({}, debug || {}, snap));
    window.__selectExistingSessionNoteFlowResult = { success: true, debug: Object.assign({}, debug || {}, snap) };
  }

  function sessionNotesTableHasRows() {
    var t = findSessionNotesTableRoot();
    return !!(t && t.querySelector('tbody tr'));
  }

  function maybeLogNotesVisible() {
    var sessionTable = findSessionNotesTableRoot();
    var n = sessionTable ? sessionTable.querySelectorAll('tbody tr[data-testid="row"], tbody tr').length : 0;
    if (n === 0) return;
    var now = Date.now();
    if (now - lastConsoleSnapshotMs < CONSOLE_SNAPSHOT_THROTTLE_MS) return;
    lastConsoleSnapshotMs = now;
    var snap = collectUiSnapshot();
    console.log(SCRIPT_TAG, 'notes UI visible (session table has rows)', snap);
    if (!notesVisibleLogged) {
      notesVisibleLogged = true;
      console.log(
        SCRIPT_TAG,
        'first time seeing notes table — if flow still times out, compare snippetNeedleNormalized to name cells (2nd td).'
      );
    }
  }

  function maybeOpenCombo(force) {
    var now = Date.now();
    if (!force && now - lastComboOpenAttemptMs < COMBO_REOPEN_INTERVAL_MS) return false;
    lastComboOpenAttemptMs = now;
    var root = findSessionNoteRoot();
    if (!root) return false;
    var openRes = tryOpenSessionNoteDropdown(root);
    comboOpenAttempts += 1;
    stepLog('open autocomplete attempt #' + comboOpenAttempts, openRes);
    return !!openRes.didSomething;
  }

  function tick() {
    if (window.__selectExistingSessionNoteFlowResult) return;
    var phaseKey =
      'open=' +
      (openedCombo ? '1' : '0') +
      ' list=' +
      (listOptionClicked ? '1' : '0') +
      ' row=' +
      (rowClickStarted ? '1' : '0');
    if (phaseKey !== lastPhaseKey) {
      lastPhaseKey = phaseKey;
      stepLog('phase changed', { phase: phaseKey });
    }
    if (Date.now() - t0 > MAX_MS) {
      fail('Timed out waiting for session note UI (combo, list, or dialog).', {
        fallbackSearchTried: searchRefreshTried,
        fallbackSearchProbe: searchRefreshProbe || ''
      });
      return;
    }

    if (openedCombo) {
      maybeLogNotesVisible();
    }

    if (!openedCombo) {
      if (sessionNotesTableHasRows()) {
        openedCombo = true;
        listOptionClicked = true;
        stepLog('notes table already visible; skip dropdown step');
        setTimeout(tick, POLL_MS);
        return;
      }
      if (maybeOpenCombo(true)) {
        openedCombo = true;
        stepLog('dropdown open attempt issued; waiting for listbox');
      } else {
        stepLog('autocomplete root not found yet');
      }
      setTimeout(tick, POLL_MS);
      return;
    }

    var dialog = findNotePickerDialog();

    if (!listOptionClicked) {
      var lb = findVisibleListbox();
      if (lb) {
        var choice = pickListOption(lb);
        if (!choice) {
          stepLog('listbox found but no option nodes');
          setTimeout(tick, POLL_MS);
          return;
        }
        var optCount = lb.querySelectorAll('li[role="option"]').length;
        stepLog('listbox visible', {
          optionCount: optCount,
          optionPreviews: listboxOptionPreviews(lb, 8)
        });
        if (optCount > 1 && (choice.textContent || '').indexOf(CODE_MARKER) === -1) {
          fail('Multiple session-note options but none contain ' + CODE_MARKER + '.');
          return;
        }
        stepLog('clicking dropdown option', {
          optCount: optCount,
          choicePreview: (choice.textContent || '').slice(0, 120),
        });
        humanClick(choice);
        listOptionClicked = true;
        setTimeout(tick, 350);
        return;
      }
      if (dialog && dialog.querySelector('table tbody tr')) {
        stepLog('table rows already visible; skip dropdown option click');
        listOptionClicked = true;
      }
      maybeOpenCombo(false);
      setTimeout(tick, POLL_MS);
      return;
    }

    if (!dialog) {
      if (Date.now() - lastDialogMissingLogMs > 900) {
        lastDialogMissingLogMs = Date.now();
        stepLog('waiting for session-note dialog surface');
      }
      setTimeout(tick, POLL_MS);
      return;
    }

    if (!rowClickStarted) {
      var matches = findRowsInDialog(dialog);
      if (matches.length !== lastRowMatchCount) {
        lastRowMatchCount = matches.length;
        stepLog('row match scan', {
          count: matches.length,
          previews: matches.slice(0, 8).map(function (m) {
            return String((m && m.nameCell) || '').slice(0, 180);
          })
        });
      }
      if (!matches.length) {
        if (!rowMissingSinceMs) rowMissingSinceMs = Date.now();
        if (!rowWaitingLogged) {
          rowWaitingLogged = true;
          stepLog('no matching row yet; waiting for notes (modal filter search disabled)');
        }
        var visibleRows = getVisibleNoteRows(dialog);
        if (visibleRows.rowCount !== lastNoMatchRowCount) {
          lastNoMatchRowCount = visibleRows.rowCount;
          if (visibleRows.rowCount > 0) {
            stepLog('notes are visible but none match target yet', {
              visibleRowCount: visibleRows.rowCount,
              visibleRowPreviews: visibleRows.previews
            });
          } else {
            stepLog('no note rows visible yet');
          }
        }

        var nowMs = Date.now();
        if (
          ENABLE_MODAL_FILTER_SEARCH &&
          !searchRefreshTried &&
          !searchRefreshInFlight &&
          nowMs - rowMissingSinceMs >= ROW_MATCH_WAIT_BEFORE_SEARCH_MS
        ) {
          searchRefreshTried = true;
          searchRoundsStartedAt = nowMs;
          searchRoundCount = 0;
          searchRoundNextAtMs = nowMs;
          searchRoundPhase = 'idle';
        }

        if (searchRefreshTried) {
          if (!searchRefreshInFlight && searchRoundCount < SEARCH_ROUND_MAX && nowMs >= searchRoundNextAtMs) {
            if (searchRoundPhase === 'idle') {
              var refresh = triggerSearchRefresh(dialog);
              if (!refresh.ok) {
                searchRefreshFinishedMs = nowMs;
                stepLog('search fallback unavailable', { error: refresh.error || 'unknown' });
                searchRoundCount = SEARCH_ROUND_MAX;
              } else {
                searchRefreshProbe = refresh.probe || '';
                searchRoundInput = refresh.input || null;
                searchRefreshInFlight = true;
                searchRoundPhase = 'typed';
                searchRoundCount += 1;
                stepLog('running search refresh round ' + searchRoundCount + '/' + SEARCH_ROUND_MAX, {
                  probe: searchRefreshProbe
                });
                setTimeout(function () {
                  searchRefreshInFlight = false;
                  searchRoundNextAtMs = Date.now();
                }, SEARCH_ROUND_POST_ENTER_WAIT_MS);
                return;
              }
            } else if (searchRoundPhase === 'typed') {
              var clearRes = clearSearchRefreshInput(dialog, searchRoundInput);
              if (clearRes.ok) {
                stepLog('search round ' + searchRoundCount + ' cleared + enter');
                searchRoundInput = clearRes.input || searchRoundInput;
                searchRoundPhase = 'idle';
                searchRoundNextAtMs = nowMs + SEARCH_ROUND_POST_CLEAR_WAIT_MS;
                searchRefreshFinishedMs = nowMs;
              } else {
                stepLog('search round ' + searchRoundCount + ' clear failed', {
                  error: clearRes.error || 'unknown'
                });
                /* Keep same round in typed phase and retry clear shortly. */
                searchRoundNextAtMs = nowMs + 800;
              }
            }
          }

          if (
            searchRoundCount >= SEARCH_ROUND_MAX &&
            searchRoundPhase === 'idle' &&
            nowMs - searchRoundsStartedAt >= SEARCH_ROUND_TOTAL_WINDOW_MS
          ) {
            var finalVisible = getVisibleNoteRows(dialog);
            if (finalVisible.rowCount > 0) {
              fail('Notes loaded, but none matched provider/date after 3 search rounds (~25s).', {
                fallbackSearchProbe: searchRefreshProbe || '',
                fallbackSearchTried: true,
                searchRoundsTried: searchRoundCount,
                visibleRowCount: finalVisible.rowCount,
                visibleRowPreviews: finalVisible.previews
              });
            } else {
              fail('No notes appeared after 3 search rounds (~25s).', {
                fallbackSearchProbe: searchRefreshProbe || '',
                fallbackSearchTried: true,
                searchRoundsTried: searchRoundCount,
                visibleRowCount: 0
              });
            }
            return;
          }
        }

        setTimeout(tick, POLL_MS);
        return;
      }

      var chosen = chooseBestMatch(matches);
      if (!chosen) {
        fail('Matching rows existed but best-match chooser returned none.', {
          ambiguousMatchCount: matches.length,
          ambiguousMatchPreviews: matches.slice(0, 8).map(function (m) {
            return String((m && m.nameCell) || '').slice(0, 180);
          })
        });
        return;
      }

      if (matches.length > 1) {
        stepLog('multiple matches found; auto-selecting best candidate', {
          matchCount: matches.length,
          chosenPreview: String(chosen.nameCell || '').slice(0, 180),
          chosenDateMs: chosen.dt || 0,
          candidates: matches.slice(0, 8).map(function (m) {
            return String((m && m.nameCell) || '').slice(0, 180);
          })
        });
      }

      var row = chosen.row;
      rowMissingSinceMs = 0;
      rowWaitingLogged = false;
      lastNoMatchRowCount = -1;
      rowClickStarted = true;
      try {
        stepLog('clicking selected note row', {
          nameCellPreview: String(chosen.nameCell || '').slice(0, 140),
        });
        humanClick(row);
        setTimeout(function () {
          var d2 = findNotePickerDialog();
          var sel = d2 && findSelectInDialog(d2);
          if (sel) {
            humanClick(sel);
            succeed({ rowSnippet: ROW_SNIPPET });
          } else {
            fail('Clicked the note row but the dialog Select button was not found.', {
              selectFound: false,
              surfaceExists: !!d2,
            });
          }
        }, 220);
      } catch (e) {
        fail('Failed to click note row: ' + (e.message || 'unknown'));
      }
      return;
    }
  }

  console.log(SCRIPT_TAG, 'start', { rowSnippet: ROW_SNIPPET, maxMs: MAX_MS });
  tick();
})();
