/**
 * One-shot: open the "Select existing session note" MUI Autocomplete (popup icon or input).
 * Triggers list/network load the same way the full flow does on its first step.
 * Result: window.__nudgeOpenSessionNoteComboResult = { success, error? }
 */
(function () {
  var TAG = '[inject-nudge-open-session-note-combo]';

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

  var root = document.querySelector('[data-testid="select-existing-session-note"]');
  if (!root) {
    window.__nudgeOpenSessionNoteComboResult = {
      success: false,
      error: 'select-existing-session-note (data-testid) not in DOM'
    };
    console.warn(TAG, 'no combo root');
    return;
  }
  var pop = root.querySelector('button.MuiAutocomplete-popupIndicator');
  if (pop) {
    humanClick(pop);
    window.__nudgeOpenSessionNoteComboResult = { success: true, via: 'popupIndicator' };
    console.log(TAG, 'clicked popup indicator');
    return;
  }
  var inp = root.querySelector('input.MuiAutocomplete-input');
  if (inp) {
    inp.focus();
    humanClick(inp);
    window.__nudgeOpenSessionNoteComboResult = { success: true, via: 'input' };
    console.log(TAG, 'focused/clicked input');
    return;
  }
  window.__nudgeOpenSessionNoteComboResult = { success: false, error: 'No popup button or input in combo' };
  console.warn(TAG, 'no control to open');
})();
