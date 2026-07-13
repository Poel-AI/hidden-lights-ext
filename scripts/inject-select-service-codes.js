/**
 * Injected into the timesheet editor page. Clicks "Service Codes" to open the list,
 * then clicks the item whose label matches Texas nonbillable supervision (Hidden Talents).
 * Result: window.__selectServiceCodesResult = { success, clicked, error? }
 */
(function () {
  const TARGET_PHRASE = 'CONCURRENT: Nonbillable supervision time';

  function normalizeText(s) {
    return (s || '').toLowerCase().replace(/\s+/g, ' ').replace(/\s*:\s*/g, ':').trim();
  }

  function textMatches(text) {
    const n = normalizeText(text);
    const target = normalizeText(TARGET_PHRASE);
    if (n.indexOf(target) !== -1) return true;
    var words = target.split(/\s+/).filter(Boolean);
    words = words.filter(function (w) {
      return w.length > 1;
    });
    return words.length >= 3 && words.every(function (w) {
      return n.indexOf(w) !== -1;
    });
  }

  /**
   * Find the "Service Codes (N)" link with multiple strategies.
   */
  function findServiceCodesLink() {
    const links = document.querySelectorAll('a');
    for (const a of links) {
      const t = (a.textContent || '').trim();
      if (/Service\s*Codes\s*\(\d+\)/i.test(t)) return a;
      if (normalizeText(t).indexOf('service codes') !== -1) return a;
    }
    const byText = document.evaluate(
      "//a[contains(., 'Service Codes')]",
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    );
    const x = byText.singleNodeValue;
    if (x) return x;
    return null;
  }

  /**
   * Find the list container that holds the code items (ul with li > a and span text).
   */
  function findCodeListContainer() {
    const selectors = [
      '.md-tab-content ul',
      'ul.jss7298',
      'ul.tab-pane.active',
      '.md-tab-content ul.tab-pane',
      '.md-tab-content ul[class*="jss"]',
      'ul[class*="jss7298"]'
    ];
    for (const sel of selectors) {
      const ul = document.querySelector(sel);
      if (ul && ul.querySelectorAll('li > a').length > 0) return ul;
    }
    const uls = document.querySelectorAll('ul');
    for (const ul of uls) {
      const items = ul.querySelectorAll('li > a');
      if (items.length >= 3) {
        const hasSpan = Array.from(items).some(function (a) {
          return a.querySelector('span');
        });
        if (hasSpan) return ul;
      }
    }
    return null;
  }

  /**
   * Find all clickable code items (a) whose label text matches TARGET_PHRASE loosely.
   */
  function findMatchingCodeLinks(container) {
    if (!container) return [];
    const items = container.querySelectorAll('li > a');
    const out = [];
    for (const a of items) {
      const span = a.querySelector('span');
      const text = span ? span.textContent : a.textContent;
      if (textMatches(text)) out.push(a);
    }
    return out;
  }

  const serviceCodesLink = findServiceCodesLink();
  if (!serviceCodesLink) {
    window.__selectServiceCodesResult = { success: false, clicked: 0, error: 'Service Codes link not found.' };
    return;
  }

  serviceCodesLink.click();

  setTimeout(function () {
    const container = findCodeListContainer();
    const matching = findMatchingCodeLinks(container);
    var clicked = 0;
    for (var i = 0; i < matching.length; i++) {
      try {
        matching[i].click();
        clicked++;
      } catch (e) {}
    }
    window.__selectServiceCodesResult = {
      success: true,
      clicked: clicked,
      total: matching.length
    };
  }, 800);
})();
