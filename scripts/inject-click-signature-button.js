/**
 * Injected into the timesheet page. Clicks the CLIENT SIGNATURE or PROVIDER SIGNATURE
 * button inside the draftTimesheet-signature area.
 * After clicking, waits up to 2s for a "Confirm" modal (recollect signatures warning)
 * and auto-clicks "Continue" if it appears.
 * Set window.__signatureTarget = "client" | "provider" before injecting.
 * Result: window.__clickSignatureResult = { success, clicked, target, dismissedConfirm?, error? }
 */
(function () {
  var CONFIRM_POLL_MS = 150;
  var CONFIRM_MAX_WAIT_MS = 4000;

  var target = (typeof window.__signatureTarget === 'string' && window.__signatureTarget.trim())
    ? window.__signatureTarget.trim().toLowerCase()
    : '';

  if (!target) {
    window.__clickSignatureResult = { success: false, clicked: 0, target: '', error: 'No signature target specified (expected "client" or "provider").' };
    return;
  }

  var needle = target === 'client' ? 'CLIENT SIGNATURE' : 'PROVIDER SIGNATURE';

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

  function pollForConfirmModal() {
    var start = Date.now();
    var pollCount = 0;
    function check() {
      pollCount++;
      var modals = document.querySelectorAll('.modal-content');
      console.log('[Sig inject] poll #' + pollCount + ', .modal-content count: ' + modals.length);
      for (var m = 0; m < modals.length; m++) {
        var modal = modals[m];
        var header = modal.querySelector('.modal-title, .modal-header .modal-title, .modal-header h2');
        var body = modal.querySelector('.modal-body');
        var footer = modal.querySelector('.modal-footer');
        var headerText = header ? (header.textContent || '').trim().toLowerCase() : '';
        var bodyText = body ? (body.textContent || '').toLowerCase() : '';
        console.log('[Sig inject] modal[' + m + '] header="' + headerText + '" body=' + (bodyText.length > 80 ? bodyText.slice(0, 80) + '…' : bodyText));
        var isRecollectModal =
          headerText.indexOf('confirm') !== -1 &&
          (bodyText.indexOf('recollect') !== -1 || bodyText.indexOf('signature') !== -1);

        if (isRecollectModal && footer) {
          var buttons = footer.querySelectorAll('button');
          var continueBtn = null;
          for (var b = 0; b < buttons.length; b++) {
            var btnText = (buttons[b].textContent || '').trim().toLowerCase();
            console.log('[Sig inject] footer button[' + b + '] text="' + btnText + '"');
            if (btnText === 'continue') {
              continueBtn = buttons[b];
              break;
            }
          }
          if (continueBtn) {
            console.log('[Sig inject] clicking Continue on recollect modal');
            humanClick(continueBtn);
            window.__clickSignatureResult.dismissedConfirm = true;
            window.__clickSignatureResult.modalDetected = true;
            return;
          }
        }
      }
      if (Date.now() - start < CONFIRM_MAX_WAIT_MS) {
        setTimeout(check, CONFIRM_POLL_MS);
      } else {
        console.log('[Sig inject] poll ended after ' + pollCount + ' checks, no recollect modal found');
        window.__clickSignatureResult.modalDetected = false;
      }
    }
    check();
  }

  function clickedOk() {
    window.__clickSignatureResult = { success: true, clicked: 1, target: target, dismissedConfirm: false };
    pollForConfirmModal();
  }

  var labels = document.querySelectorAll('.MuiButton-label, span.MuiButton-label');
  for (var i = 0; i < labels.length; i++) {
    var text = (labels[i].textContent || '').trim().toUpperCase();
    if (text === needle) {
      var btn = labels[i].closest('button');
      if (btn) {
        try {
          humanClick(btn);
          clickedOk();
          return;
        } catch (e) {
          window.__clickSignatureResult = { success: false, clicked: 0, target: target, error: e.message || 'Click failed.' };
          return;
        }
      }
    }
  }

  var buttons = document.querySelectorAll('.draftTimesheet-signature button');
  for (var j = 0; j < buttons.length; j++) {
    var btnText = (buttons[j].textContent || '').trim().toUpperCase();
    if (btnText.indexOf(needle) !== -1) {
      try {
        humanClick(buttons[j]);
        clickedOk();
        return;
      } catch (e) {
        window.__clickSignatureResult = { success: false, clicked: 0, target: target, error: e.message || 'Click failed.' };
        return;
      }
    }
  }

  window.__clickSignatureResult = {
    success: false,
    clicked: 0,
    target: target,
    error: 'Could not find the "' + needle + '" button on this page. Scroll down until the SIGNATURES section is visible, then try again.'
  };
})();
