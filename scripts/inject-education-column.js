/**
 * Injected into the billing list page. Adds an "Education" column after the Provider column.
 * In each row:
 * - "Show first" button: opens the provider contact card and shows the first row; when the
 *   contact card appears, label values are read and shown in the Education cell.
 * - Clicking the provider name opens the contact card; when it appears, labels are read and
 *   shown in the Education cell.
 * Contact card labels are read from #contactcard .tag .tag-name and stored in
 * window.__educationContactLabels and displayed in the row's Education cell.
 */
(function () {
  const MARKER_ATTR = 'data-education-column-added';

  /** Row (tr) we expect the contact card to be for; used to update the right Education cell. */
  let lastEducationRow = null;

  /** Find billing table the same way as Edit Timesheet: first find a billing row, then its table. */
  function findBillingTable() {
    const firstRow = document.querySelector('tr[id^="billing-grid-row-"]');
    if (!firstRow || firstRow.querySelectorAll('td').length < 10) return null;
    const table = firstRow.closest('table');
    if (!table || table.getAttribute(MARKER_ATTR)) return null;
    return table;
  }

  /** Find the Provider column: td where .filter-link has providerId (not Client's clientId). */
  function getProviderCellIndex(row) {
    const tds = row.querySelectorAll('td');
    for (let i = 0; i < tds.length; i++) {
      const td = tds[i];
      const filterLink = td.querySelector('a.filter-link');
      const vcard = td.querySelector('a.vcard[contactid]');
      if (!filterLink || !vcard) continue;
      const dataBind = (filterLink.getAttribute('data-bind') || '').toString();
      if (dataBind.indexOf('providerId') !== -1) return i;
    }
    return -1;
  }

  /** Get Education cell for a row (td[data-education-cell]). */
  function getEducationCell(row) {
    return row ? row.querySelector('td[data-education-cell]') : null;
  }

  /** Read label values from #contactcard: all .tag .tag-name text. */
  function readContactCardLabels() {
    const card = document.getElementById('contactcard');
    if (!card) return [];
    const tags = card.querySelectorAll('.tag .tag-name');
    const labels = [];
    for (let i = 0; i < tags.length; i++) {
      const t = (tags[i].textContent || '').trim();
      if (t) labels.push(t);
    }
    return labels;
  }

  function showFirstRow(table) {
    const tbody = table.querySelector('tbody');
    if (!tbody) return;
    const firstRow = tbody.querySelector('tr[id^="billing-grid-row-"]');
    if (!firstRow) return;
    firstRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    firstRow.classList.add('education-highlight');
    setTimeout(function () {
      firstRow.classList.remove('education-highlight');
    }, 1500);
  }

  /** When contact card appears, read labels and update the Education cell for lastEducationRow. */
  function onContactCardReady() {
    const labels = readContactCardLabels();
    if (labels.length === 0) return;
    window.__educationContactLabels = { labels: labels };
    const cell = getEducationCell(lastEducationRow);
    if (cell) {
      const existing = cell.querySelector('.education-labels');
      if (existing) existing.remove();
      const wrap = document.createElement('div');
      wrap.className = 'education-labels';
      wrap.style.cssText = 'font-size: 11px; line-height: 1.3; max-width: 140px;';
      const list = document.createElement('ul');
      list.style.cssText = 'margin: 0; padding-left: 14px;';
      labels.forEach(function (name) {
        const li = document.createElement('li');
        li.textContent = name;
        list.appendChild(li);
      });
      wrap.appendChild(list);
      cell.appendChild(wrap);
    }
    lastEducationRow = null;
  }

  /** Observe DOM for #contactcard and read labels when it has .tag .tag-name. */
  function observeContactCard() {
    function tryRead() {
      const card = document.getElementById('contactcard');
      if (!card || !card.querySelector('.tag .tag-name')) return false;
      if (readContactCardLabels().length === 0) return false;
      observer.disconnect();
      onContactCardReady();
      return true;
    }
    const observer = new MutationObserver(function () {
      tryRead();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(function () { tryRead(); }, 150);
    setTimeout(function () { tryRead(); }, 500);
  }

  const table = findBillingTable();
  if (!table) {
    window.__educationColumnResult = { error: 'No billing table found, or Education column already added.' };
    return;
  }

  const tbody = table.querySelector('tbody');
  if (!tbody) {
    window.__educationColumnResult = { error: 'Billing table has no tbody.' };
    return;
  }
  const thead = table.querySelector('thead');
  const headerRow = thead && (thead.querySelector('tr') || thead);
  const dataRows = Array.from(tbody.querySelectorAll('tr')).filter(function (tr) {
    return tr.id && tr.id.indexOf('billing-grid-row-') === 0 && tr.querySelectorAll('td').length >= 10;
  });

  if (dataRows.length === 0) {
    window.__educationColumnResult = { error: 'No billing data rows found.' };
    return;
  }

  const providerIndex = getProviderCellIndex(dataRows[0]);
  if (providerIndex < 0) {
    window.__educationColumnResult = { error: 'Could not find Provider column in row.' };
    return;
  }

  const ths = headerRow ? headerRow.querySelectorAll('th') : [];
  const insertHeaderAfter = ths[providerIndex] || null;
  if (insertHeaderAfter) {
    const th = document.createElement('th');
    th.className = 'nowrap';
    th.textContent = 'Education';
    th.setAttribute('data-education-header', '1');
    insertHeaderAfter.parentNode.insertBefore(th, insertHeaderAfter.nextSibling);
  }

  const style = document.createElement('style');
  style.textContent = '.education-highlight { background-color: #fff3cd !important; outline: 2px solid #ffc107; }';
  document.head.appendChild(style);

  dataRows.forEach(function (tr) {
    const tds = tr.querySelectorAll('td');
    const providerTd = tds[providerIndex];
    if (!providerTd) return;

    const newTd = document.createElement('td');
    newTd.className = 'nowrap';
    newTd.setAttribute('data-education-cell', '1');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-default btn-xs';
    btn.textContent = 'Show first';
    btn.title = 'Open contact card and show first row; labels will appear here';
    btn.addEventListener('click', function () {
      lastEducationRow = tr;
      var providerVcard = providerTd.querySelector('a.vcard[contactid]');
      if (providerVcard) providerVcard.click();
      showFirstRow(table);
      observeContactCard();
    });
    newTd.appendChild(btn);
    providerTd.parentNode.insertBefore(newTd, providerTd.nextSibling);

    const providerLink = providerTd.querySelector('a.vcard');
    if (providerLink && !providerLink.getAttribute('data-education-click')) {
      providerLink.setAttribute('data-education-click', '1');
      providerLink.addEventListener('click', function (e) {
        lastEducationRow = tr;
        observeContactCard();
      });
    }
  });

  table.setAttribute(MARKER_ATTR, '1');
  window.__educationColumnResult = { success: true, rows: dataRows.length };
})();
