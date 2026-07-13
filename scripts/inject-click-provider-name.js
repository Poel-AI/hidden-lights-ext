/**
 * Runs on the billing list page. Finds the first billing row and clicks the provider's name
 * (the a.vcard in the column where the filter link has providerId). Same idea as Edit Timesheet:
 * first row only, one simple action.
 */
(function () {
  const row = document.querySelector('tr[id^="billing-grid-row-"]');
  if (!row) {
    window.__clickProviderNameResult = { error: 'No billing row found.' };
    return;
  }
  const tds = row.querySelectorAll('td');
  for (let i = 0; i < tds.length; i++) {
    const filterLink = tds[i].querySelector('a.filter-link');
    if (!filterLink) continue;
    const dataBind = (filterLink.getAttribute('data-bind') || '').toString();
    if (dataBind.indexOf('providerId') === -1) continue;
    const vcard = tds[i].querySelector('a.vcard[contactid]');
    if (!vcard) {
      window.__clickProviderNameResult = { error: 'Provider name link not found in row.' };
      return;
    }
    vcard.click();
    window.__clickProviderNameResult = { success: true, name: (vcard.textContent || '').trim() };
    return;
  }
  window.__clickProviderNameResult = { error: 'Provider column not found in row.' };
})();
