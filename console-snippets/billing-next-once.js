/**
 * Paste into the browser DevTools console on the CentralReach billing list page.
 * Fires exactly ONE synthetic click on the visible "Next" control (data-click="pageUp").
 * Does not call Knockout pageUp() directly — same idea as the extension.
 *
 * Optional: change GENTLE_MS (ms) before the click; 0 = immediate.
 */
(function billingNextOnce() {
  var GENTLE_MS = 50;

  function isVisible(el) {
    if (!el) return false;
    if (typeof el.checkVisibility === 'function') {
      try {
        return el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
      } catch (e) {
        /* continue */
      }
    }
    var s = window.getComputedStyle(el);
    return s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity) > 0;
  }

  function runClick() {
    var anchors = document.querySelectorAll('a[data-click="pageUp"]');
    var el = null;
    for (var i = 0; i < anchors.length; i++) {
      if (isVisible(anchors[i])) {
        el = anchors[i];
        break;
      }
    }
    if (!el) {
      console.warn('[billing-next-once] No visible Next link (a[data-click="pageUp"]).');
      return;
    }

    console.log('[billing-next-once] Target:', el);
    var had = el.hasAttribute('href');
    var prev = had ? el.getAttribute('href') : null;
    if (had) el.removeAttribute('href');
    try {
      el.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
      );
    } finally {
      if (had) {
        setTimeout(function () {
          try {
            el.setAttribute('href', prev);
          } catch (e) {
            /* ignore */
          }
        }, 1200);
      }
    }
    console.log('[billing-next-once] One click dispatched.');
  }

  if (GENTLE_MS > 0) {
    setTimeout(runClick, GENTLE_MS);
    console.log('[billing-next-once] Waiting ' + GENTLE_MS + 'ms, then one click…');
  } else {
    runClick();
  }
})();
