/**
 * Injected into the timesheet page. Finds the service code list (.md-tab-content ul with li > a),
 * clicks the item that contains "97153" but does NOT contain "non billable" (case-insensitive).
 * Used on LINE 3 of the 97155 overlap fix to select the billable 97153 code
 * (e.g. "97153: Adaptive behavior treatment by protocol").
 * Result: window.__clickBillable97153NoBResult = { success, clicked, error? }
 */
(function () {
  var CODE_MARKER = '97153';
  var NONBILLABLE_MARKER = 'non billable';

  function findListContainer() {
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

  function findBillableLink(container) {
    if (!container) return null;
    var items = container.querySelectorAll('li > a');
    for (var i = 0; i < items.length; i++) {
      var text = (items[i].textContent || '').toLowerCase();
      if (text.indexOf(CODE_MARKER) !== -1 && text.indexOf(NONBILLABLE_MARKER) === -1) return items[i];
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

  var container = findListContainer();
  if (!container) {
    window.__clickBillable97153NoBResult = { success: false, clicked: 0, error: 'Service code list not found. Wait for the page to finish loading and try again.' };
    return;
  }
  var link = findBillableLink(container);
  if (!link) {
    window.__clickBillable97153NoBResult = { success: false, clicked: 0, error: 'No billable 97153 option (excluding "non billable") found in the list.' };
    return;
  }
  try {
    humanClick(link);
    window.__clickBillable97153NoBResult = { success: true, clicked: 1 };
  } catch (e) {
    window.__clickBillable97153NoBResult = { success: false, clicked: 0, error: e.message || 'Click failed.' };
  }
})();
