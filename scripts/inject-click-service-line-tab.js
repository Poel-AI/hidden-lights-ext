(function () {
  var idx = typeof window.__serviceLineTabIndex === 'number' ? window.__serviceLineTabIndex : 0;
  if (idx < 0) idx = 0;

  function findTablist() {
    var selectors = [
      '.MuiTabs-flexContainer[role="tablist"]',
      '[role="tablist"].MuiTabs-flexContainer',
      '.MuiTabs-flexContainer',
      '[role="tablist"]',
    ];
    for (var s = 0; s < selectors.length; s++) {
      var el = document.querySelector(selectors[s]);
      if (el) return el;
    }
    return null;
  }

  function humanClick(el) {
    var rect = el.getBoundingClientRect();
    var x = rect.left + rect.width / 2;
    var y = rect.top + rect.height / 2;
    var opts = { bubbles: true, cancelable: true, view: window, clientX: x, clientY: y };
    el.dispatchEvent(new MouseEvent('mousedown', opts));
    el.dispatchEvent(new MouseEvent('mouseup', opts));
    el.dispatchEvent(new MouseEvent('click', opts));
  }

  var tablist = findTablist();
  if (!tablist) {
    window.__clickServiceLineTabResult = { success: false, error: 'Service line tab list not found.' };
    return;
  }
  var tabs = tablist.querySelectorAll('button[role="tab"]');
  if (!tabs.length) {
    window.__clickServiceLineTabResult = { success: false, error: 'No service line tabs found.' };
    return;
  }
  if (idx >= tabs.length) {
    window.__clickServiceLineTabResult = {
      success: false,
      error: 'Tab index ' + idx + ' out of range (count ' + tabs.length + ').',
    };
    return;
  }
  var tab = tabs[idx];
  var label = (tab.textContent || '').replace(/\s+/g, ' ').trim();
  // Re-clicking an already-selected MUI tab can re-render the form and briefly clear
  // Time From/To — which breaks consecutive stable read-back verification.
  if (tab.getAttribute('aria-selected') === 'true') {
    window.__clickServiceLineTabResult = {
      success: true,
      index: idx,
      tabCount: tabs.length,
      label: label,
      alreadySelected: true,
    };
    return;
  }
  humanClick(tab);
  window.__clickServiceLineTabResult = {
    success: true,
    index: idx,
    tabCount: tabs.length,
    label: label,
    alreadySelected: false,
  };
})();
