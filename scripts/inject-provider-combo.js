/**
 * Combo: click provider name → wait for contact card to load (poll every 200ms, max 3s) →
 * read labels → close contact card. Sets window.__providerComboResult when done.
 */
(function () {
  const POLL_MS = 200;
  const MAX_WAIT_MS = 3000;

  function setResult(obj) {
    window.__providerComboResult = obj;
  }

  const row = document.querySelector('tr[id^="billing-grid-row-"]');
  if (!row) {
    setResult({ error: 'No billing row found.' });
    return;
  }

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
    setResult({ error: 'Provider column not found.' });
    return;
  }
  const vcard = providerTd.querySelector('a.vcard[contactid]');
  if (!vcard) {
    setResult({ error: 'Provider name link not found.' });
    return;
  }

  vcard.click();
  const start = Date.now();
  let attempts = 0;

  function poll() {
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
      setResult({ success: true, labels: labels });
      return;
    }
    attempts++;
    if (Date.now() - start >= MAX_WAIT_MS) {
      setResult({ error: 'Contact card did not load in time.' });
      return;
    }
    setTimeout(poll, POLL_MS);
  }

  setTimeout(poll, POLL_MS);
})();
