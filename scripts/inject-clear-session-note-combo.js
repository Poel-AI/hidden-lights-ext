/**
 * Clears the "Select existing session note" MUI Autocomplete so a new pick can start clean.
 * Prefer the clear (X) button; else clear the input with a React-friendly input event.
 * Result: window.__clearSessionNoteComboResult = { success, via?, error? }
 */
(function () {
  var TAG = '[inject-clear-session-note-combo]';

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
    window.__clearSessionNoteComboResult = {
      success: false,
      error: 'select-existing-session-note not in DOM',
    };
    return;
  }

  var clearBtn = root.querySelector('button.MuiAutocomplete-clearIndicator');
  if (clearBtn) {
    humanClick(clearBtn);
    window.__clearSessionNoteComboResult = { success: true, via: 'clearIndicator' };
    console.log(TAG, 'clicked clear (X)');
    return;
  }

  var inp = root.querySelector('input.MuiAutocomplete-input');
  if (!inp) {
    inp = root.querySelector('input');
  }
  if (!inp) {
    window.__clearSessionNoteComboResult = { success: false, error: 'no input in combo' };
    return;
  }

  try {
    var proto = window.HTMLInputElement && window.HTMLInputElement.prototype;
    var desc = proto && Object.getOwnPropertyDescriptor(proto, 'value');
    if (desc && desc.set) {
      desc.set.call(inp, '');
    } else {
      inp.value = '';
    }
    inp.dispatchEvent(new Event('input', { bubbles: true }));
    try {
      inp.dispatchEvent(new Event('change', { bubbles: true }));
    } catch (e2) {}
    inp.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, keyCode: 27, which: 27 })
    );
    if (document.activeElement === inp) {
      try {
        inp.blur();
      } catch (b) {}
    }
    window.__clearSessionNoteComboResult = { success: true, via: 'inputCleared' };
    console.log(TAG, 'cleared input + escape');
  } catch (e) {
    window.__clearSessionNoteComboResult = { success: false, error: e.message || 'clear failed' };
  }
})();
