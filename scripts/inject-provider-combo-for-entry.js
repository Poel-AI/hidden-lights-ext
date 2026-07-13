/**
 * Same as provider combo but for a specific billing row by entryId.
 * Reads entryId from window.__overlapFixEntryId (set by side panel before injecting).
 * Finds tr#billing-grid-row-{entryId} (polls — grid may virtualize rows), clicks provider vcard,
 * waits for contact card, reads labels, closes card. Sets window.__overlapFixProviderLabels when done.
 *
 * Result shapes: { success: true, labels, providerName } | { error, code?, entryId? }
 * providerName: visible text from the provider vcard link (for error messages).
 * code: ROW_NOT_FOUND | PROVIDER_COLUMN_NOT_FOUND | NO_VCARD | CONTACT_CARD_TIMEOUT | NO_ENTRY_ID
 */
(function () {
  var ROW_POLL_MS = 150;
  var ROW_MAX_WAIT_MS = 15000;
  var CARD_POLL_MS = 200;
  var CARD_MAX_WAIT_MS = 3500;
  var entryId = window.__overlapFixEntryId;
  var entryIdStr = entryId != null ? String(entryId) : '';

  function setResult(obj) {
    window.__overlapFixProviderLabels = obj;
  }

  if (!entryId) {
    setResult({ error: 'Missing appointment id for this fix.', code: 'NO_ENTRY_ID' });
    return;
  }

  var rowDomId = 'billing-grid-row-' + entryIdStr;
  var rowWaitStart = Date.now();

  /* --- Grid container & sweep state --- */
  var gridContainer = null;
  var sweepStarted = false;
  var sweepPos = 0;
  var sweepMax = 0;
  var sweepStep = 0;
  var savedScrollTop = 0;

  function findGridContainer() {
    if (gridContainer) return gridContainer;
    var selectors = [
      '.billing-grid-container',
      '.ko-grid',
      'table.billing-grid',
      '[class*="billing"] tbody',
      '.grid-canvas'
    ];
    for (var i = 0; i < selectors.length; i++) {
      var el = document.querySelector(selectors[i]);
      if (el && el.scrollHeight > el.clientHeight) { gridContainer = el; return el; }
    }
    var tables = document.querySelectorAll('table');
    for (var j = 0; j < tables.length; j++) {
      var parent = tables[j].parentElement;
      if (parent && parent.scrollHeight > parent.clientHeight + 50) { gridContainer = parent; return parent; }
    }
    var all = document.querySelectorAll('div');
    for (var k = 0; k < all.length; k++) {
      var d = all[k];
      if (d.scrollHeight > d.clientHeight + 200 && d.querySelector('tr[id^="billing-grid-row-"]')) {
        gridContainer = d; return d;
      }
    }
    return null;
  }

  function startSweep(container) {
    sweepStarted = true;
    savedScrollTop = container.scrollTop;
    sweepStep = Math.max(container.clientHeight - 40, 100);
    sweepMax = container.scrollHeight;
    sweepPos = 0;
    container.scrollTop = 0;
  }

  function advanceSweep(container) {
    sweepPos += sweepStep;
    if (sweepPos >= sweepMax) {
      container.scrollTop = savedScrollTop;
      return false;
    }
    container.scrollTop = sweepPos;
    return true;
  }

  function waitForRow() {
    var row = document.getElementById(rowDomId);
    if (row) {
      try { row.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } catch (e) { /* ignore */ }
      openCardAndReadLabels(row);
      return;
    }
    if (Date.now() - rowWaitStart >= ROW_MAX_WAIT_MS) {
      if (gridContainer) {
        try { gridContainer.scrollTop = savedScrollTop; } catch (e) { /* ignore */ }
      }
      setResult({
        error:
          'After ' + Math.round(ROW_MAX_WAIT_MS / 1000) +
          ' seconds we scrolled through the entire billing list but could not find this appointment (row ' +
          entryIdStr + '). It may be on another page or filtered out.',
        code: 'ROW_NOT_FOUND',
        entryId: entryIdStr
      });
      return;
    }

    var container = findGridContainer();
    if (container && !sweepStarted) {
      startSweep(container);
    } else if (container && sweepStarted) {
      if (!advanceSweep(container)) {
        startSweep(container);
      }
    }
    setTimeout(waitForRow, ROW_POLL_MS);
  }

  function openCardAndReadLabels(row) {
    let providerTd = null;
    const tds = row.querySelectorAll('td');
    for (let i = 0; i < tds.length; i++) {
      const filterLink = tds[i].querySelector('a.filter-link');
      if (!filterLink) continue;
      if ((filterLink.getAttribute('data-bind') || '').indexOf('providerId') === -1) continue;
      providerTd = tds[i];
      break;
    }
    if (!providerTd) {
      setResult({
        error: 'This row does not show a provider column the way we expect. Try refreshing the billing list.',
        code: 'PROVIDER_COLUMN_NOT_FOUND',
        entryId: entryIdStr
      });
      return;
    }
    const vcard = providerTd.querySelector('a.vcard[contactid]');
    if (!vcard) {
      setResult({
        error: "We could not find a clickable provider name on this row. Scroll the row into view and try again.",
        code: 'NO_VCARD',
        entryId: entryIdStr
      });
      return;
    }

    var providerDisplayName = (vcard.textContent || vcard.innerText || '')
      .replace(/\s+/g, ' ')
      .trim();

    vcard.click();
    const cardWaitStart = Date.now();

    function pollCard() {
      const card = document.getElementById('contactcard');
      const hasLabels = card && card.querySelectorAll('.tag .tag-name').length > 0;
      if (hasLabels) {
        const tagNames = card.querySelectorAll('.tag .tag-name');
        const labels = [];
        for (let i = 0; i < tagNames.length; i++) {
          const t = (tagNames[i].textContent || '').trim();
          if (t) labels.push(t);
        }
        const amountCell = row.querySelector('td.txt-right');
        const closeTarget = amountCell || row.querySelector('td');
        if (closeTarget) closeTarget.click();
        setResult({ success: true, labels: labels, providerName: providerDisplayName });
        return;
      }
      if (Date.now() - cardWaitStart >= CARD_MAX_WAIT_MS) {
        setResult({
          error: 'The provider profile window did not finish opening in time. Close other popups, wait for the list to load, then try again.',
          code: 'CONTACT_CARD_TIMEOUT',
          entryId: entryIdStr
        });
        return;
      }
      setTimeout(pollCard, CARD_POLL_MS);
    }

    setTimeout(pollCard, CARD_POLL_MS);
  }

  setTimeout(waitForRow, ROW_POLL_MS);
})();
