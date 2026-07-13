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
  var signBtn = null;
  for (var i = 0; i < buttons.length; i++) {
    var label = (buttons[i].textContent || '').trim();
    if (label === 'SIGN') {
      signBtn = buttons[i];
      break;
    }
  }

  if (!signBtn) {
    window.__clickSignButtonResult = { success: false, error: 'Could not find the SIGN button on the page. Make sure the signature panel is open.' };
    return;
  }

  humanClick(signBtn);
  window.__clickSignButtonResult = { success: true, clicked: true };
  console.log('[Sig inject] Clicked SIGN button');
})();
