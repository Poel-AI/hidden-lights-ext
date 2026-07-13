/**
 * Injected into the timesheet page. Finds the Place of service dropdown (#selectedLocation)
 * and selects the option whose text contains the given match string.
 * Set window.__placeOfServiceMatch = "office" (or any string) before injecting; default is "office".
 * Result: window.__selectPlaceOfServiceResult = { success, value, text, matchedText, error? }
 */
(function () {
  var matchStr = (typeof window.__placeOfServiceMatch === 'string' && window.__placeOfServiceMatch.trim())
    ? window.__placeOfServiceMatch.trim().toLowerCase()
    : 'office';

  function findPlaceOfServiceSelect() {
    var el = document.getElementById('selectedLocation');
    if (el && el.tagName === 'SELECT') return el;
    el = document.querySelector('select[name="selectedLocation"]');
    if (el && el.tagName === 'SELECT') return el;
    el = document.querySelector('select[data-testid="timesheet-placeofservice"], select[data-testid*="placeofservice"]');
    if (el && el.tagName === 'SELECT') return el;
    var labels = document.querySelectorAll('label.control-label, label, span.MuiFormLabel-root, legend');
    var i;
    for (i = 0; i < labels.length; i++) {
      var lt = (labels[i].textContent || '').toLowerCase();
      if (lt.indexOf('place of service') === -1 && lt.indexOf('place of serv') === -1) continue;
      var root =
        labels[i].closest('.form-group, .MuiFormControl-root, [class*="FormControl"], .MuiGrid-root, .MuiGrid-item') ||
        labels[i].parentElement;
      if (!root) continue;
      var sel =
        root.querySelector('select.MuiSelect-nativeInput') ||
        root.querySelector('select.MuiNativeSelect-root') ||
        root.querySelector('select');
      if (sel && sel.tagName === 'SELECT') return sel;
    }
    el = document.getElementById('selectedLocation');
    return el && el.tagName === 'SELECT' ? el : null;
  }

  function findOptionWithText(select, text) {
    if (!select || select.tagName !== 'SELECT') return null;
    var opts = select.options;
    for (var i = 0; i < opts.length; i++) {
      if ((opts[i].textContent || opts[i].text || '').toLowerCase().indexOf(text) !== -1) return opts[i];
    }
    return null;
  }

  var select = findPlaceOfServiceSelect();
  if (!select) {
    window.__selectPlaceOfServiceResult = { success: false, error: 'Place of service dropdown not found.' };
    return;
  }
  var option = findOptionWithText(select, matchStr);
  if (!option) {
    window.__selectPlaceOfServiceResult = { success: false, matchedText: matchStr, error: 'No option containing "' + matchStr + '" found.' };
    return;
  }
  try {
    select.value = option.value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    select.dispatchEvent(new Event('input', { bubbles: true }));
    try {
      select.dispatchEvent(new Event('blur', { bubbles: true }));
    } catch (e0) {}
    window.__selectPlaceOfServiceResult = {
      success: true,
      value: option.value,
      text: (option.textContent || option.text || '').trim(),
      matchedText: matchStr
    };
  } catch (e) {
    window.__selectPlaceOfServiceResult = { success: false, matchedText: matchStr, error: e.message || 'Failed to select.' };
  }
})();
