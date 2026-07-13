/**
 * Runs in page. Finds the billing table, then scrolls every scrollable ancestor
 * to the bottom (and tries scrollBy in steps) so virtualized rows can load.
 * Sets window.__scrollBillingTableResult = { scrolled: boolean, rowCount: number }.
 */
(function () {
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

  /** Collect all ancestors that can scroll (have scrollHeight > clientHeight). */
  function findAllScrollables(el) {
    const out = [];
    let node = el && el.parentElement;
    while (node && node !== document.body) {
      if (node.scrollHeight > node.clientHeight) out.push(node);
      node = node.parentElement;
    }
    return out;
  }

  const tbody = findTable();
  if (!tbody) {
    window.__scrollBillingTableResult = { scrolled: false, rowCount: 0, error: 'No billing table found.' };
    return;
  }

  const scrollables = findAllScrollables(tbody);
  for (const el of scrollables) {
    el.scrollTop = el.scrollHeight;
  }
  /** If no scrollable found, try scrolling by large steps from the table upward (some UIs use overflow:hidden + JS). */
  if (scrollables.length === 0) {
    let node = tbody.parentElement;
    while (node && node !== document.body) {
      if (node.scrollHeight > node.clientHeight) {
        node.scrollTop = node.scrollHeight;
        break;
      }
      node = node.parentElement;
    }
  }

  const rowCount = tbody.querySelectorAll('tr').length;
  window.__scrollBillingTableResult = { scrolled: scrollables.length > 0, rowCount };
})();
