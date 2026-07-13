(function () {
  function humanClick(el) {
    var rect = el.getBoundingClientRect();
    var x = rect.left + rect.width / 2;
    var y = rect.top + rect.height / 2;
    var opts = { bubbles: true, cancelable: true, view: window, clientX: x, clientY: y };
    el.dispatchEvent(new MouseEvent('mousedown', opts));
    el.dispatchEvent(new MouseEvent('mouseup', opts));
    el.dispatchEvent(new MouseEvent('click', opts));
  }

  var buttons = document.querySelectorAll('button');
  var continueBtn = null;
  for (var i = 0; i < buttons.length; i++) {
    var label = (buttons[i].textContent || '').trim();
    if (label === 'CONTINUE') {
      continueBtn = buttons[i];
      break;
    }
  }

  if (!continueBtn) {
    window.__clickContinueButtonResult = { success: false, error: 'Could not find the CONTINUE button on the page. Make sure the dialog is open.' };
    return;
  }

  humanClick(continueBtn);
  window.__clickContinueButtonResult = { success: true, clicked: true };
  console.log('[Sig inject] Clicked CONTINUE button');
})();
