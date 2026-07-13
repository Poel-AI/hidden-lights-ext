/**
 * Injected into the timesheet signature page. Types "No signature" into the
 * provider signature input (#providersignature) and checks the "I agree" checkbox.
 * Result: window.__fillNoSignatureResult = { success, inputFilled, checkboxChecked, error? }
 */
(function () {
  function setNativeValue(el, value) {
    var proto = Object.getPrototypeOf(el);
    var setter = Object.getOwnPropertyDescriptor(proto, 'value') ||
                 Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
    if (setter && setter.set) {
      setter.set.call(el, value);
    } else {
      el.value = value;
    }
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  var input = document.getElementById('providersignature');
  if (!input) {
    input = document.querySelector('input[id*="providersignature"], input[id*="providerSignature"]');
  }
  if (!input) {
    var inputs = document.querySelectorAll('input[type="text"]');
    for (var i = 0; i < inputs.length; i++) {
      var id = (inputs[i].id || '').toLowerCase();
      if (id.indexOf('signature') !== -1 && id.indexOf('provider') !== -1) {
        input = inputs[i];
        break;
      }
    }
  }

  var inputFilled = false;
  if (input) {
    input.focus();
    setNativeValue(input, 'No signature');
    input.dispatchEvent(new Event('blur', { bubbles: true }));
    inputFilled = true;
    console.log('[Sig inject] Filled provider signature input with "No signature"');
  } else {
    console.log('[Sig inject] Could not find provider signature input');
  }

  var checkboxChecked = false;
  var checkbox = document.querySelector('.iAgreeCheckbox input[type="checkbox"]');
  if (!checkbox) {
    var labels = document.querySelectorAll('label');
    for (var j = 0; j < labels.length; j++) {
      var text = (labels[j].textContent || '').toLowerCase();
      if (text.indexOf('attest') !== -1 || text.indexOf('true and correct') !== -1) {
        checkbox = labels[j].querySelector('input[type="checkbox"]');
        if (checkbox) break;
      }
    }
  }

  if (checkbox) {
    if (!checkbox.checked) {
      var clickTarget = checkbox.closest('span[class*="MuiIconButton"]') ||
                        checkbox.closest('span[class*="Checkbox"]') ||
                        checkbox.closest('label') ||
                        checkbox;
      var rect = clickTarget.getBoundingClientRect();
      var x = rect.left + rect.width / 2;
      var y = rect.top + rect.height / 2;
      var opts = { bubbles: true, cancelable: true, view: window, clientX: x, clientY: y };
      clickTarget.dispatchEvent(new MouseEvent('mousedown', opts));
      clickTarget.dispatchEvent(new MouseEvent('mouseup', opts));
      clickTarget.dispatchEvent(new MouseEvent('click', opts));
      checkboxChecked = true;
      console.log('[Sig inject] Clicked I-agree checkbox');
    } else {
      checkboxChecked = true;
      console.log('[Sig inject] I-agree checkbox already checked');
    }
  } else {
    console.log('[Sig inject] Could not find I-agree checkbox');
  }

  if (!inputFilled && !checkboxChecked) {
    window.__fillNoSignatureResult = {
      success: false,
      inputFilled: false,
      checkboxChecked: false,
      error: 'Could not find the signature input or the I-agree checkbox. Make sure the signature panel is open.'
    };
  } else {
    window.__fillNoSignatureResult = {
      success: true,
      inputFilled: inputFilled,
      checkboxChecked: checkboxChecked
    };
  }
})();
