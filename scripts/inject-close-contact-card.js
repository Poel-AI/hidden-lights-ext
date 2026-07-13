/**
 * Closes the contact card by clicking a cell in the first billing row (e.g. the amount cell
 * with 75.00). Clicking outside the card typically dismisses it.
 */
(function () {
  const row = document.querySelector('tr[id^="billing-grid-row-"]');
  if (!row) {
    window.__closeContactCardResult = { error: 'No billing row found.' };
    return;
  }
  const amountCell = row.querySelector('td.txt-right');
  const target = amountCell || row.querySelector('td');
  if (!target) {
    window.__closeContactCardResult = { error: 'No cell to click.' };
    return;
  }
  target.click();
  window.__closeContactCardResult = { success: true };
})();
