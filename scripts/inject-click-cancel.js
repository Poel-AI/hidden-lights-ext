/**
 * Injected into the timesheet page. Finds and clicks the CANCEL button (timesheet editor).
 * Casts a wide net: span.MuiButton-label "CANCEL", button text, MuiButton variants, XPath, containers.
 * Result: window.__clickCancelResult = { success, error? }
 */
(function () {
  function normalizeText(s) {
    return (s || '').trim().toUpperCase();
  }

  function getCancelLabelText(btn) {
    var label = btn.querySelector && btn.querySelector('[class*="MuiButton-label"]');
    return normalizeText((label ? label.textContent : btn.textContent) || '');
  }

  function findCancelButton() {
    // 1) Any button with span.MuiButton-label text exactly "CANCEL"
    var spans = document.querySelectorAll('span.MuiButton-label');
    for (var i = 0; i < spans.length; i++) {
      if (normalizeText(spans[i].textContent) === 'CANCEL') {
        var btn = spans[i].closest('button');
        if (btn) return btn;
      }
    }

    // 2) All buttons: match by label text (from child span or button text)
    var buttons = document.querySelectorAll('button');
    for (var j = 0; j < buttons.length; j++) {
      if (getCancelLabelText(buttons[j]) === 'CANCEL') return buttons[j];
    }

    // 3) MuiButton-text (secondary/cancel style) with label CANCEL
    var textBtns = document.querySelectorAll('button[class*="MuiButton-text"]');
    for (var k = 0; k < textBtns.length; k++) {
      if (getCancelLabelText(textBtns[k]) === 'CANCEL') return textBtns[k];
    }

    // 4) XPath: button containing span with text CANCEL
    try {
      var xp = document.evaluate(
        "//button[.//span[normalize-space(.)='CANCEL']]",
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
      );
      if (xp.singleNodeValue) return xp.singleNodeValue;
    } catch (e) {}
    try {
      var xp2 = document.evaluate(
        "//button[contains(., 'CANCEL')]",
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
      );
      if (xp2.singleNodeValue) return xp2.singleNodeValue;
    } catch (e) {}

    // 5) Common footer/action containers (same pattern as submit script)
    var containers = document.querySelectorAll('.jss6775, .jss6776, [class*="jss67"]');
    for (var c = 0; c < containers.length; c++) {
      var inContainer = containers[c].querySelectorAll('button');
      for (var d = 0; d < inContainer.length; d++) {
        if (getCancelLabelText(inContainer[d]) === 'CANCEL') return inContainer[d];
      }
    }

    // 6) Any element with role="button" and visible CANCEL text
    var roleButtons = document.querySelectorAll('[role="button"]');
    for (var r = 0; r < roleButtons.length; r++) {
      if (getCancelLabelText(roleButtons[r]) === 'CANCEL') return roleButtons[r];
    }

    return null;
  }

  function humanClick(el) {
    if (!el) return;
    el.scrollIntoView({ block: 'center', inline: 'center' });
    var rect = el.getBoundingClientRect();
    var x = rect.left + rect.width / 2;
    var y = rect.top + rect.height / 2;
    var opts = { bubbles: true, cancelable: true, view: window, clientX: x, clientY: y };
    el.dispatchEvent(new MouseEvent('mousedown', opts));
    el.dispatchEvent(new MouseEvent('mouseup', opts));
    el.dispatchEvent(new MouseEvent('click', opts));
    if (typeof el.click === 'function') el.click();
  }

  var btn = findCancelButton();
  if (!btn) {
    window.__clickCancelResult = { success: false, error: 'CANCEL button not found.' };
    return;
  }
  try {
    humanClick(btn);
    window.__clickCancelResult = { success: true };
  } catch (e) {
    window.__clickCancelResult = { success: false, error: (e && e.message) || 'Click failed.' };
  }
})();
