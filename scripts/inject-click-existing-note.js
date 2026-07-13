/**
 * Injected into the timesheet page. Finds and clicks the "SELECT EXISTING NOTE" button.
 * Uses multiple selectors. Result: window.__clickExistingNoteResult = { success, error? }
 */
(function () {
  var targetText = 'SELECT EXISTING NOTE';

  function normalize(s) {
    return (s || '').trim().toLowerCase().replace(/\s+/g, ' ');
  }

  function findButton() {
    var buttons = document.querySelectorAll('button');
    for (var i = 0; i < buttons.length; i++) {
      var label = buttons[i].querySelector('.MuiButton-label');
      var text = (label ? label.textContent : buttons[i].textContent) || '';
      if (normalize(text) === normalize(targetText)) return buttons[i];
    }
    for (var j = 0; j < buttons.length; j++) {
      if (normalize(buttons[j].textContent).indexOf('select existing note') !== -1) return buttons[j];
    }
    var outlined = document.querySelector('button.MuiButton-outlinedPrimary');
    if (outlined && normalize(outlined.textContent).indexOf('existing note') !== -1) return outlined;
    var byClass = document.querySelector('.jss21260 button, .sc-bwzfXH button');
    if (byClass && normalize(byClass.textContent).indexOf('existing note') !== -1) return byClass;
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

  var btn = findButton();
  if (!btn) {
    window.__clickExistingNoteResult = { success: false, error: 'SELECT EXISTING NOTE button not found.' };
    return;
  }
  try {
    humanClick(btn);
    window.__clickExistingNoteResult = { success: true };
  } catch (e) {
    window.__clickExistingNoteResult = { success: false, error: e.message || 'Click failed.' };
  }
})();
