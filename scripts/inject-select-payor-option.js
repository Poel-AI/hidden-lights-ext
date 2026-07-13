/**
 * Site-specific: CentralReach / Quest education-tier cards ("Master or Bachelor" / "Associate or HS").
 * Deploy as `scripts/inject-select-payor-option.js` from your private repo — not bundled in the core extension.
 *
 * Set window.__payorOptionMatch = "master" | "associate" (substring match) before RUN_SCRIPT.
 * Result: window.__selectPayorOptionResult = { success, clicked, matchedText, error?, debug? }
 *
 * debug.tierVisibility — always filled so the panel log can confirm this script build ran and what the DOM showed.
 */
(function () {
  var SCRIPT_BUILD = 'payor-guard-2026-04-12i';

  var matchStr = (typeof window.__payorOptionMatch === 'string' && window.__payorOptionMatch.trim())
    ? window.__payorOptionMatch.trim().toLowerCase()
    : 'master';

  function collapseWs(s) {
    return (s || '').replace(/\s+/g, ' ').trim();
  }

  function bodyLower() {
    return collapseWs(document.body && document.body.textContent).toLowerCase();
  }

  function hasTierKeyword(t) {
    return t.indexOf('master') !== -1 || t.indexOf('bachelor') !== -1 ||
           t.indexOf('associate') !== -1 || /\bhs\b/.test(t) ||
           t.indexOf('high school') !== -1;
  }

  function matchesTier(t, tier) {
    if (tier === 'master') return t.indexOf('master') !== -1 || t.indexOf('bachelor') !== -1;
    if (tier === 'associate') return t.indexOf('associate') !== -1 || /\bhs\b/.test(t) || t.indexOf('high school') !== -1;
    return t.indexOf(tier) !== -1;
  }

  var BROAD_SEL = [
    'button', '[role="button"]', 'a',
    '.MuiButtonBase-root', '.MuiCardActionArea-root', '.MuiIconButton-root',
    '.MuiCard-root', '.MuiPaper-root',
    '[class*="MuiRadio"]', '[class*="MuiFormControlLabel"]',
    'label', 'input[type="radio"]',
    'div[class*="jss"]',
    'div[class*="MuiCard"]', 'div[class*="Card"]'
  ].join(', ');

  function gatherTierVisibilityDebug() {
    var bl = bodyLower();
    var hits = [];
    var patterns = [
      { id: 'master', re: /\bmaster\b/i },
      { id: 'bachelor', re: /\bbachelor\b/i },
      { id: 'associate', re: /\bassociate\b/i },
      { id: 'hs_word', re: /\bhs\b/i },
      { id: 'high_school', re: /high\s*school/i }
    ];
    for (var p = 0; p < patterns.length; p++) {
      hits.push({ label: patterns[p].id, presentInBody: patterns[p].re.test(bl) });
    }

    var snippets = [];
    var allEls = document.querySelectorAll(BROAD_SEL);
    var maxN = Math.min(allEls.length, 600);
    for (var i = 0; i < maxN && snippets.length < 30; i++) {
      var el = allEls[i];
      var t = collapseWs(el.textContent || '').toLowerCase();
      if (t.length < 2 || t.length > 200) continue;
      if (!hasTierKeyword(t)) continue;
      snippets.push({
        tag: (el.tagName || '').toLowerCase(),
        cls: ((el.className || '') + '').slice(0, 100),
        text: t.slice(0, 120)
      });
    }

    if (snippets.length === 0) {
      var allDivs = document.querySelectorAll('div, span, p, label, td, li');
      var dMax = Math.min(allDivs.length, 2000);
      for (var d = 0; d < dMax && snippets.length < 20; d++) {
        var de = allDivs[d];
        var dt = collapseWs(de.textContent || '').toLowerCase();
        if (dt.length < 4 || dt.length > 120) continue;
        if (!hasTierKeyword(dt)) continue;
        snippets.push({
          tag: (de.tagName || '').toLowerCase(),
          cls: ((de.className || '') + '').slice(0, 100),
          text: dt.slice(0, 120),
          fromWide: true
        });
      }
    }

    return { scriptBuild: SCRIPT_BUILD, tierHits: hits, tierLikeSnippets: snippets };
  }

  var tierDbg = gatherTierVisibilityDebug();
  try {
    console.log('[inject-select-payor-option]', JSON.stringify(tierDbg));
  } catch (e0) {}

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

  function isSvgPlus(el) {
    if (!el) return false;
    var tag = (el.tagName || '').toLowerCase();
    if (tag !== 'svg') return false;
    var di = el.getAttribute('data-icon');
    if (di === 'plus' || di === 'add') return true;
    var cls = ((el.className && el.className.baseVal) || el.getAttribute('class') || '').toLowerCase();
    if (cls.indexOf('fa-plus') !== -1 || cls.indexOf('fa-add') !== -1) return true;
    return false;
  }

  function findSvgPlusIn(container) {
    if (!container) return null;
    if (isSvgPlus(container)) return container;
    var svgs = container.querySelectorAll ? container.querySelectorAll('svg') : [];
    for (var i = 0; i < svgs.length; i++) {
      if (isSvgPlus(svgs[i])) return svgs[i];
    }
    return null;
  }

  function findSvgPlusNear(el) {
    if (!el) return null;
    var node = el;
    for (var depth = 0; depth < 5 && node; depth++) {
      var found = findSvgPlusIn(node);
      if (found) return found;
      node = node.parentElement;
    }
    return null;
  }

  function isClickable(el) {
    if (!el || el.nodeType !== 1) return false;
    var tag = (el.tagName || '').toLowerCase();
    if (tag === 'button' || tag === 'a' || tag === 'label') return true;
    if (el.getAttribute('role') === 'button') return true;
    if (el.getAttribute('tabindex') != null) return true;
    if (el.onclick) return true;
    var cls = ((el.className || '') + '').toLowerCase();
    if (cls.indexOf('muibutton') !== -1 || cls.indexOf('muicard') !== -1 ||
        cls.indexOf('muiiconbutton') !== -1 || cls.indexOf('actionarea') !== -1 ||
        cls.indexOf('clickable') !== -1 || cls.indexOf('selectable') !== -1) return true;
    var cursor = '';
    try { cursor = window.getComputedStyle(el).cursor; } catch (e) {}
    if (cursor === 'pointer') return true;
    return false;
  }

  function findBestTierElement(tier) {
    var candidates = [];

    var svgs = document.querySelectorAll('svg.fa-plus, svg[data-icon="plus"], .svg-inline--fa.fa-plus');
    for (var si = 0; si < svgs.length; si++) {
      var svg = svgs[si];
      if (!isSvgPlus(svg)) continue;
      var row = svg.parentElement;
      if (!row) continue;
      var rowText = collapseWs(row.textContent || '').toLowerCase();
      if (rowText.length < 4 || rowText.length > 500) continue;
      if (matchesTier(rowText, tier)) {
        candidates.push({ el: svg, text: rowText, source: 'svg-in-row' });
      }
    }
    if (candidates.length > 0) {
      candidates.sort(function (a, b) { return a.text.length - b.text.length; });
      return candidates[0].el;
    }

    var broadEls = document.querySelectorAll(BROAD_SEL);
    for (var i = 0; i < broadEls.length; i++) {
      var el = broadEls[i];
      var t = collapseWs(el.textContent || '').toLowerCase();
      if (t.length < 2 || t.length > 200) continue;
      if (matchesTier(t, tier)) {
        var svgNear = findSvgPlusNear(el);
        if (!svgNear && !isClickable(el)) continue;
        candidates.push({ el: svgNear || el, text: t, source: svgNear ? 'broad+svg' : 'broad' });
      }
    }

    if (candidates.length === 0) {
      var allEls = document.querySelectorAll('div, span, p, label, td, li');
      var max = Math.min(allEls.length, 3000);
      for (var j = 0; j < max; j++) {
        var de = allEls[j];
        var dt = collapseWs(de.textContent || '').toLowerCase();
        if (dt.length < 4 || dt.length > 160) continue;
        if (!matchesTier(dt, tier)) continue;
        var svgInDiv = findSvgPlusNear(de);
        if (svgInDiv) {
          candidates.push({ el: svgInDiv, text: dt, source: 'wide+svg' });
          continue;
        }
        if (!isClickable(de)) {
          var parent = de.parentElement;
          if (parent && isClickable(parent)) {
            candidates.push({ el: parent, text: collapseWs(parent.textContent || '').toLowerCase(), source: 'parent' });
          }
          continue;
        }
        candidates.push({ el: de, text: dt, source: 'wide' });
      }
    }

    if (candidates.length === 0) return null;

    candidates.sort(function (a, b) { return a.text.length - b.text.length; });
    return candidates[0].el;
  }

  var option = findBestTierElement(matchStr);
  tierDbg.foundOption = !!option;
  if (option) {
    tierDbg.optionTag = (option.tagName || '').toLowerCase();
    tierDbg.optionCls = ((option.className || '') + '').slice(0, 100);
    tierDbg.optionText = collapseWs(option.textContent || '').slice(0, 120);
  }

  if (!option) {
    var anyTierInBody = false;
    for (var hi = 0; hi < tierDbg.tierHits.length; hi++) {
      if (tierDbg.tierHits[hi].presentInBody) {
        anyTierInBody = true;
        break;
      }
    }
    if (!anyTierInBody && (!tierDbg.tierLikeSnippets || tierDbg.tierLikeSnippets.length === 0)) {
      window.__selectPayorOptionResult = {
        success: true,
        skipped: true,
        clicked: 0,
        matchedText: matchStr,
        debug: Object.assign({}, tierDbg, {
          skipReason: 'no_payor_or_education_ui',
          note: 'No Master/Associate tier keywords anywhere in DOM — tier selection not on this page.'
        })
      };
      return;
    }
    window.__selectPayorOptionResult = {
      success: false,
      clicked: 0,
      matchedText: matchStr,
      error: 'Tier keywords found in body text but no clickable element matched "' + matchStr +
        '". Snippets: ' + (tierDbg.tierLikeSnippets || []).slice(0, 5).map(function (s) {
          return '"' + s.text + '" (' + s.tag + ')';
        }).join('; '),
      debug: tierDbg
    };
    return;
  }

  try {
    try {
      option.scrollIntoView({ block: 'center', inline: 'nearest' });
    } catch (e1) {}
    humanClick(option);
    window.__selectPayorOptionResult = { success: true, clicked: 1, matchedText: matchStr, debug: tierDbg };
  } catch (e) {
    window.__selectPayorOptionResult = {
      success: false,
      clicked: 0,
      matchedText: matchStr,
      error: e.message || 'Click failed.',
      debug: tierDbg
    };
  }
})();
