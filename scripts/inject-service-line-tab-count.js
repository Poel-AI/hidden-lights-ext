/**
 * Scoped count of **service line** tabs (next to ADD SERVICE LINE), not the first MUI tablist on the page.
 * Run before inject-add-service-line.js / inject-read-timesheet.js so they can use window.__countServiceLineTabs.
 * Sets window.__serviceLineTabCountResult = { count, scoped }.
 */
(function () {
  const ADD_SERVICE_LINE_TEXT = 'ADD SERVICE LINE';

  function countServiceLineTabsLegacy() {
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

  /** Keep aligned with inject-add-service-line.js */
  function findAddServiceLineButton() {
    const normalizedTarget = ADD_SERVICE_LINE_TEXT.replace(/\s+/g, ' ').trim().toUpperCase();

    const spans = document.querySelectorAll('span.MuiButton-label');
    for (const span of spans) {
      if (span.textContent.replace(/\s+/g, ' ').trim().toUpperCase() === normalizedTarget) {
        const btn = span.closest('button');
        if (btn) return btn;
      }
    }

    const allSpans = document.querySelectorAll('span');
    for (const span of allSpans) {
      if (span.textContent.replace(/\s+/g, ' ').trim().toUpperCase() === normalizedTarget) {
        const btn = span.closest('button');
        if (btn) return btn;
      }
    }

    const buttonsWithLabel = document.querySelectorAll('button .MuiButton-label');
    for (const label of buttonsWithLabel) {
      if (label.textContent.replace(/\s+/g, ' ').trim().toUpperCase() === normalizedTarget) {
        const btn = label.closest('button');
        if (btn) return btn;
      }
    }

    const header = document.querySelector('header');
    if (header) {
      const headerButtons = header.querySelectorAll('button');
      for (const btn of headerButtons) {
        if (btn.textContent.replace(/\s+/g, ' ').trim().toUpperCase().indexOf(normalizedTarget) !== -1) return btn;
      }
    }

    try {
      const xpath =
        "//button[.//span[contains(translate(normalize-space(.), 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 'ADD SERVICE LINE')]]";
      const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      const btn = result.singleNodeValue;
      if (btn) return btn;
    } catch (e) {}

    const allButtons = document.querySelectorAll('button');
    for (const btn of allButtons) {
      if (btn.textContent.replace(/\s+/g, ' ').trim().toUpperCase() === normalizedTarget) return btn;
    }

    return null;
  }

  /**
   * Tablist for service-line rows: latest in document order among tablists that precede the add button,
   * limited to main/app root so we skip app-chrome tablists above the timesheet.
   */
  function findServiceLineTabListNearAddButton(button) {
    if (!button) return null;
    const root =
      button.closest('main') ||
      button.closest('[role="main"]') ||
      button.closest('#root') ||
      button.closest('#app') ||
      document.body;
    const lists = root.querySelectorAll('[role="tablist"], .MuiTabs-flexContainer');
    let best = null;
    for (const tl of lists) {
      const tabs = tl.querySelectorAll('button[role="tab"]');
      if (!tabs.length) continue;
      if (!(button.compareDocumentPosition(tl) & Node.DOCUMENT_POSITION_PRECEDING)) continue;
      if (!best || (best.compareDocumentPosition(tl) & Node.DOCUMENT_POSITION_FOLLOWING)) best = tl;
    }
    return best;
  }

  function countScoped() {
    const btn = findAddServiceLineButton();
    const tl = btn && findServiceLineTabListNearAddButton(btn);
    if (tl) return { count: tl.querySelectorAll('button[role="tab"]').length, scoped: true };
    return { count: countServiceLineTabsLegacy(), scoped: false };
  }

  window.__countServiceLineTabs = function () {
    return countScoped().count;
  };

  const { count, scoped } = countScoped();
  window.__serviceLineTabCountResult = { count, scoped };
})();
