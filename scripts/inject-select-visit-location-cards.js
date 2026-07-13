/**
 * Optional step after billable 97153: payer-specific **visit location** cards (e.g. Highmark)
 * — HOME (12), OFFICE (11), OTHER (99). Layout matches IBC-style rows: bold header + sibling card rows with + icon.
 *
 * Set window.__visitLocationMatch = 'office' | 'home' | 'other' before inject (default 'office').
 * Result: window.__selectVisitLocationResult = { success, skipped?, clicked?, matchedText, error?, reason?, debug? }
 */
(function () {
  var matchStr = (typeof window.__visitLocationMatch === 'string' && window.__visitLocationMatch.trim())
    ? window.__visitLocationMatch.trim().toLowerCase()
    : 'office';
  if (matchStr !== 'home' && matchStr !== 'other') matchStr = 'office';

  var settleUntil = Date.now() + 900;
  while (Date.now() < settleUntil) {}

  function visibleText(el) {
    return (el && (el.innerText || el.textContent) || '').replace(/\s+/g, ' ').trim();
  }

  function isVisibleEl(el) {
    if (!el || el.nodeType !== 1) return false;
    if (el.offsetParent !== null) return true;
    var r = el.getClientRects();
    return r && r.length > 0;
  }

  function rowMatchesVisitTier(low, tier) {
    if (tier === 'home') {
      return /\bhome\b/.test(low) || /12\s*-\s*home/i.test(low) || (low.indexOf('12') !== -1 && low.indexOf('home') !== -1);
    }
    if (tier === 'other') {
      return (
        /\bother\b/.test(low) ||
        /99\s*-\s*other/i.test(low) ||
        low.indexOf('other place') !== -1
      );
    }
    if (/\bhome\b/.test(low) && !/\boffice\b/.test(low) && !/11\s*-/.test(low) && low.indexOf('12') === -1)
      return false;
    return (
      /\boffice\b/.test(low) ||
      /11\s*-\s*office/i.test(low) ||
      (low.indexOf('11') !== -1 && low.indexOf('office') !== -1)
    );
  }

  /** Container whose direct children include ≥2 “card” rows with svg + rates and both HOME and OFFICE cues. */
  function findVisitLocationCardRoot() {
    var all = document.querySelectorAll('div');
    var i;
    for (i = 0; i < all.length; i++) {
      var el = all[i];
      if (!isVisibleEl(el)) continue;
      var kids = el.children;
      if (kids.length < 2) continue;
      var cardRows = 0;
      var seenHome = false;
      var seenOffice = false;
      var j;
      for (j = 0; j < kids.length; j++) {
        var row = kids[j];
        if (row.tagName !== 'DIV' || !isVisibleEl(row)) continue;
        if (!row.querySelector('svg')) continue;
        var low = visibleText(row).toLowerCase();
        if (low.length < 10 || low.length > 750) continue;
        if (low.indexOf('$') === -1 && low.indexOf('rate') === -1) continue;
        cardRows++;
        if (/\bhome\b/.test(low) || /12\s*-\s*home/.test(low)) seenHome = true;
        if (/\boffice\b/.test(low) || /11\s*-\s*office/.test(low)) seenOffice = true;
      }
      if (cardRows >= 2 && seenHome && seenOffice) return el;
    }
    return null;
  }

  function findVisitRowInRoot(root, tier) {
    if (!root) return null;
    var kids = root.children;
    var i;
    for (i = 0; i < kids.length; i++) {
      var row = kids[i];
      if (row.tagName !== 'DIV' || !isVisibleEl(row)) continue;
      var low = visibleText(row).toLowerCase();
      if (low.length < 8) continue;
      if (rowMatchesVisitTier(low, tier)) return row;
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

  function activateRow(el) {
    if (!el) return;
    try {
      if (el.click) el.click();
    } catch (e1) {}
    humanClick(el);
  }

  var debug = {
    matchRequested: matchStr,
    phase: 'init',
    tierUiPresent: false
  };

  var root = findVisitLocationCardRoot();
  if (!root) {
    debug.phase = 'skipped_no_visit_cards';
    window.__selectVisitLocationResult = {
      success: true,
      skipped: true,
      clicked: 0,
      matchedText: matchStr,
      reason: 'No visit location card group (HOME/OFFICE/OTHER) visible; skipped.',
      debug: debug
    };
    return;
  }

  debug.tierUiPresent = true;
  var row = findVisitRowInRoot(root, matchStr);
  if (!row) {
    debug.phase = 'failed_no_matching_row';
    debug.containerSample = visibleText(root).slice(0, 420);
    window.__selectVisitLocationResult = {
      success: false,
      clicked: 0,
      matchedText: matchStr,
      error:
        'Visit location cards are visible but no row matched "' +
        matchStr +
        '". Expected HOME / OFFICE / OTHER (or 11/12/99 codes).',
      debug: debug
    };
    return;
  }

  try {
    activateRow(row);
    debug.phase = 'clicked_visit_row';
    debug.chosenSnippet = visibleText(row).slice(0, 220);
    window.__selectVisitLocationResult = {
      success: true,
      skipped: false,
      clicked: 1,
      matchedText: matchStr,
      debug: debug
    };
  } catch (e) {
    debug.clickError = e.message || String(e);
    window.__selectVisitLocationResult = {
      success: false,
      clicked: 0,
      matchedText: matchStr,
      error: e.message || 'Click failed.',
      debug: debug
    };
  }
})();
