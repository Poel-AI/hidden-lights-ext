/**
 * Runs on the page when the contact card is open. Reads label values from
 * #contactcard .tag .tag-name (e.g. Bachelors, Behavior Technician, FT RBT, RBT, Salary).
 */
(function () {
  const card = document.getElementById('contactcard');
  if (!card) {
    window.__readContactLabelsResult = { error: 'Contact card not found. Open a provider\'s contact card first.' };
    return;
  }
  const tagNames = card.querySelectorAll('.tag .tag-name');
  const labels = [];
  for (let i = 0; i < tagNames.length; i++) {
    const t = (tagNames[i].textContent || '').trim();
    if (t) labels.push(t);
  }
  window.__readContactLabelsResult = labels.length
    ? { success: true, labels: labels }
    : {
        error:
          'No tags appeared on the provider profile window. Click the provider name on the billing row so the profile opens, wait for it to load, then try Read labels again.'
      };
})();
