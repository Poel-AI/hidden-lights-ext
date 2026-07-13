/**
 * Injected into the timesheet page. Finds and clicks the CLOSE button (note dialog).
 * Target: MuiButton-text MuiButton-textPrimary with label "CLOSE".
 * Backup: button inside #domain-members (XPath domain-members/div[10]/div[3]/div/div[3]/button[1]).
 * Result: window.__clickCloseNoteResult = { success, error? }
 */
(function () {
  function getCloseLabelText(btn) {
    var label = btn.querySelector('[class*="MuiButton-label"]');
    return ((label ? label.textContent : btn.textContent) || '').trim().toUpperCase();
  }

  function findCloseButton() {
    // 1) Backup: exact DOM path from XPath //*[@id="domain-members"]/div[10]/div[3]/div/div[3]/button[1]
    var dm = document.getElementById('domain-members');
    if (dm && dm.children.length >= 10) {
      var d10 = dm.children[9];
      if (d10.children.length >= 3) {
        var d3 = d10.children[2];
        if (d3.children.length >= 1) {
          var inner = d3.children[0];
          if (inner.children.length >= 3) {
            var div3 = inner.children[2];
            var firstBtn = div3.querySelector('button');
            if (firstBtn && getCloseLabelText(firstBtn) === 'CLOSE') return firstBtn;
          }
        }
      }
    }

    // 2) Prefer note-dialog CLOSE: MuiButton-text + MuiButton-textPrimary (class may be hashed e.g. MuiButton-textPrimary-23079)
    var buttons = document.querySelectorAll('button[class*="MuiButton-text"]');
    for (var i = 0; i < buttons.length; i++) {
      var c = (buttons[i].className && buttons[i].className.toString()) || '';
      if (c.indexOf('MuiButton-textPrimary') !== -1 && getCloseLabelText(buttons[i]) === 'CLOSE') return buttons[i];
    }

    // 3) Any MuiButton with label CLOSE
    var all = document.querySelectorAll('button');
    for (var j = 0; j < all.length; j++) {
      if (getCloseLabelText(all[j]) === 'CLOSE') return all[j];
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
    el.click();
  }

  var btn = findCloseButton();
  if (!btn) {
    window.__clickCloseNoteResult = { success: false, error: 'CLOSE button not found.' };
    return;
  }
  try {
    humanClick(btn);
    window.__clickCloseNoteResult = { success: true };
  } catch (e) {
    window.__clickCloseNoteResult = { success: false, error: e.message || 'Click failed.' };
  }
})();
