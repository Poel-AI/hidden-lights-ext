/**
 * Injected into the timesheet page. Finds the Service address dropdown (#selectedServiceAddressId)
 * and selects the option whose text or title contains the given match string.
 * Flexible matching: case-insensitive, collapsed spaces, punctuation normalized.
 * Set window.__serviceAddressMatch = "30 carn" (or any string) before injecting; default is "30 carn".
 * Result: window.__selectServiceAddressResult = { success, value, text, matchedText, error? }
 */
(function () {
  var matchStr = (typeof window.__serviceAddressMatch === 'string' && window.__serviceAddressMatch.trim())
    ? window.__serviceAddressMatch.trim()
    : '30 carn';

  /** Normalize for loose matching: lowercase, collapse whitespace, normalize punctuation to spaces. */
  function normalizeForMatch(s) {
    if (typeof s !== 'string') return '';
    return s
      .toLowerCase()
      .replace(/[\s.,;:\-_/\\]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /** True if option text or title loosely contains the match (normalized). */
  function optionMatches(opt, normalizedMatch) {
    if (!normalizedMatch) return false;
    var text = (opt.textContent || opt.text || '').trim();
    var title = (opt.getAttribute('title') || '').trim();
    var nText = normalizeForMatch(text);
    var nTitle = normalizeForMatch(title);
    if (nText.indexOf(normalizedMatch) !== -1) return true;
    if (nTitle.indexOf(normalizedMatch) !== -1) return true;
    var words = normalizedMatch.split(/\s+/).filter(Boolean);
    if (words.length === 0) return false;
    var allInText = words.every(function (w) {
      return nText.indexOf(w) !== -1;
    });
    if (allInText) return true;
    var allInTitle = words.every(function (w) {
      return nTitle.indexOf(w) !== -1;
    });
    return allInTitle;
  }

  function findServiceAddressSelect() {
    var el = document.getElementById('selectedServiceAddressId');
    if (el && el.tagName === 'SELECT') return el;
    el = document.querySelector('select[name="selectedServiceAddressId"]');
    if (el && el.tagName === 'SELECT') return el;
    el = document.querySelector('select[id*="erviceAddress"], select[name*="erviceAddress"]');
    if (el && el.tagName === 'SELECT') return el;
    el = document.querySelector('select[data-testid*="ervice"], select[data-testid*="address"]');
    if (el && el.tagName === 'SELECT') return el;
    var labels = document.querySelectorAll('label.control-label, label, span.MuiFormLabel-root, legend');
    var i;
    for (i = 0; i < labels.length; i++) {
      var lt = (labels[i].textContent || '').toLowerCase();
      if (
        lt.indexOf('service address') === -1 &&
        lt.indexOf('service addr') === -1 &&
        lt.indexOf('location address') === -1
      )
        continue;
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
    el = document.getElementById('selectedServiceAddressId');
    return el && el.tagName === 'SELECT' ? el : null;
  }

  function findOptionWithText(select, match) {
    if (!select || select.tagName !== 'SELECT') return null;
    var normalizedMatch = normalizeForMatch(match);
    if (!normalizedMatch) return null;
    var opts = select.options;
    for (var j = 0; j < opts.length; j++) {
      if (opts[j].value === '' || opts[j].value === '0') continue;
      if (optionMatches(opts[j], normalizedMatch)) return opts[j];
    }
    return null;
  }

  var select = findServiceAddressSelect();
  if (!select) {
    window.__selectServiceAddressResult = { success: false, error: 'Service address dropdown not found.' };
    return;
  }
  var option = findOptionWithText(select, matchStr);
  if (!option) {
    window.__selectServiceAddressResult = {
      success: false,
      matchedText: matchStr,
      error: 'No option matching "' + matchStr + '" found.'
    };
    return;
  }
  try {
    select.focus && select.focus();
    select.value = option.value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    select.dispatchEvent(new Event('input', { bubbles: true }));
    try {
      select.dispatchEvent(new Event('blur', { bubbles: true }));
    } catch (e0) {}
    window.__selectServiceAddressResult = {
      success: true,
      value: option.value,
      text: (option.textContent || option.text || '').trim(),
      matchedText: matchStr
    };
  } catch (e) {
    window.__selectServiceAddressResult = { success: false, matchedText: matchStr, error: e.message || 'Failed to select.' };
  }
})();
