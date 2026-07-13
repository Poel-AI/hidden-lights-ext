/**
 * Injected into the timesheet editor page. Finds and clicks "ADD SERVICE LINE", then reports
 * service line tab count. Uses multiple selectors so it keeps working if the DOM changes.
 * Result: window.__addServiceLineResult = { success, countBefore, countAfter, error? }
 */
(function () {
  const ADD_SERVICE_LINE_TEXT = 'ADD SERVICE LINE';

  /** Prefer inject-service-line-tab-count.js (scoped); else legacy first tablist on page. */
  function countServiceLineTabs() {
    if (typeof window.__countServiceLineTabs === 'function') return window.__countServiceLineTabs();
    const selectors = [
      '.MuiTabs-flexContainer[role="tablist"]',
      '[role="tablist"].MuiTabs-flexContainer',
      '.MuiTabs-flexContainer',
      '[role="tablist"]'
    ];
    for (const sel of selectors) {
      const tablist = document.querySelector(sel);
      if (!tablist) continue;
      const buttons = tablist.querySelectorAll('button[role="tab"]');
      return buttons.length;
    }
    return 0;
  }

  /**
   * Find the ADD SERVICE LINE button using several strategies (order: most specific first).
   */
  function findAddServiceLineButton() {
    const normalizedTarget = ADD_SERVICE_LINE_TEXT.replace(/\s+/g, ' ').trim().toUpperCase();

    // 1) Span with class MuiButton-label and exact text, then parent button
    const spans = document.querySelectorAll('span.MuiButton-label');
    for (const span of spans) {
      if (span.textContent.replace(/\s+/g, ' ').trim().toUpperCase() === normalizedTarget) {
        const btn = span.closest('button');
        if (btn) return btn;
      }
    }

    // 2) Any span containing the text, then closest button
    const allSpans = document.querySelectorAll('span');
    for (const span of allSpans) {
      if (span.textContent.replace(/\s+/g, ' ').trim().toUpperCase() === normalizedTarget) {
        const btn = span.closest('button');
        if (btn) return btn;
      }
    }

    // 3) Button that contains a span with this text (by label class)
    const buttonsWithLabel = document.querySelectorAll('button .MuiButton-label');
    for (const label of buttonsWithLabel) {
      if (label.textContent.replace(/\s+/g, ' ').trim().toUpperCase() === normalizedTarget) {
        const btn = label.closest('button');
        if (btn) return btn;
      }
    }

    // 4) Within header: button whose text includes ADD SERVICE LINE (structure from user XPath)
    const header = document.querySelector('header');
    if (header) {
      const headerButtons = header.querySelectorAll('button');
      for (const btn of headerButtons) {
        if (btn.textContent.replace(/\s+/g, ' ').trim().toUpperCase().indexOf(normalizedTarget) !== -1) return btn;
      }
    }

    // 5) XPath fallback: button containing span with text
    try {
      const xpath = "//button[.//span[contains(translate(normalize-space(.), 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 'ADD SERVICE LINE')]]";
      const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      const btn = result.singleNodeValue;
      if (btn) return btn;
    } catch (e) {}

    // 6) Any button in the document with that label text
    const allButtons = document.querySelectorAll('button');
    for (const btn of allButtons) {
      if (btn.textContent.replace(/\s+/g, ' ').trim().toUpperCase() === normalizedTarget) return btn;
    }

    return null;
  }

  const countBefore = countServiceLineTabs();
  const maxBefore = typeof window.__addServiceLineMaxBefore === 'number'
    ? window.__addServiceLineMaxBefore
    : Infinity;

  if (countBefore > maxBefore) {
    console.log('[Add SL] Already ' + countBefore + ' lines (max allowed before add: ' + maxBefore + ') — skipping click');
    window.__addServiceLineResult = {
      success: true,
      skipped: true,
      countBefore,
      countAfter: countBefore
    };
    return;
  }

  const button = findAddServiceLineButton();

  if (!button) {
    window.__addServiceLineResult = {
      success: false,
      countBefore,
      countAfter: countBefore,
      error: 'ADD SERVICE LINE button not found. Open a timesheet editor first.'
    };
    return;
  }

  try {
    button.click();
    const countAfter = countServiceLineTabs();
    window.__addServiceLineResult = { success: true, countBefore, countAfter };
    setTimeout(function () {
      if (window.__addServiceLineResult && window.__addServiceLineResult.success) {
        window.__addServiceLineResult.countAfter = countServiceLineTabs();
      }
    }, 450);
  } catch (e) {
    window.__addServiceLineResult = {
      success: false,
      countBefore,
      countAfter: countBefore,
      error: e.message || 'Click failed.'
    };
  }
})();
