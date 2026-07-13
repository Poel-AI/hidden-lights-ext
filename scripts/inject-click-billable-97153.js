/**
 * Injected into the timesheet page. Finds the billable codes list (.md-tab-content ul with li > a),
 * clicks the item matching Texas billable direct care RBT/BT (Hidden Talents); falls back to any 97153 line.
 * Result: window.__clickBillable97153Result = { success, clicked, error? }
 */
(function () {
  const CODE_MARKER = '97153';

  function findBillableListContainer() {
    var selectors = [
      '.md-tab-content ul.tab-pane.active',
      '.md-tab-content ul',
      'ul.jss20512',
      'ul.tab-pane.active'
    ];
    for (var i = 0; i < selectors.length; i++) {
      var ul = document.querySelector(selectors[i]);
      if (ul && ul.querySelectorAll('li > a').length > 0) return ul;
    }
    var uls = document.querySelectorAll('.md-tab-content ul');
    for (var j = 0; j < uls.length; j++) {
      var items = uls[j].querySelectorAll('li > a');
      if (items.length > 0) return uls[j];
    }
    return null;
  }

  function normalizeForMatch(s) {
    return (s || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  /** Prefer "97153: Direct Care - RBT/BT" style labels for Hidden Talents. */
  function matchesTexasBillable(text) {
    var n = normalizeForMatch(text);
    return (
      n.indexOf('97153') !== -1 &&
      n.indexOf('direct care') !== -1 &&
      (n.indexOf('rbt') !== -1 || n.indexOf('/bt') !== -1 || /\brbt\b/.test(n))
    );
  }

  function findPreferredBillableLink(container) {
    if (!container) return null;
    var items = container.querySelectorAll('li > a');
    var fallback = null;
    for (var i = 0; i < items.length; i++) {
      var text = (items[i].textContent || '').trim();
      if (matchesTexasBillable(text)) return items[i];
      if (!fallback && text.indexOf(CODE_MARKER) !== -1) fallback = items[i];
    }
    return fallback;
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

  var container = findBillableListContainer();
  if (!container) {
    window.__clickBillable97153Result = { success: false, clicked: 0, error: 'Billable list not found. Open the billable tab first.' };
    return;
  }
  var link = findPreferredBillableLink(container);
  if (!link) {
    window.__clickBillable97153Result = { success: false, clicked: 0, error: 'No billable 97153 line found in the list.' };
    return;
  }
  try {
    humanClick(link);
    window.__clickBillable97153Result = { success: true, clicked: 1 };
  } catch (e) {
    window.__clickBillable97153Result = { success: false, clicked: 0, error: e.message || 'Click failed.' };
  }
})();
