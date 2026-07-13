/**
 * Site-specific (CentralReach / Quest fee schedule). Ship from your private repo as
 * `scripts/inject-select-fee-schedule-role.js` and list it in config `scripts` so POEL RUN_SCRIPT can fetch it.
 * Do NOT bundle this file inside the core Hidden Talents extension package.
 *
 * Inputs (panel sets these on the timesheet tab before RUN_SCRIPT):
 *   window.__feeScheduleRoleMatch — "bcba" | "lbs" | "rbt_bt"
 *   window.__feeScheduleTierMatch — optional "master" | "associate"
 *
 * Result: window.__selectFeeScheduleRoleResult = { success, clicked, skipped?, matchedText?, error?, debug? }
 */
(function () {
  var SCRIPT_BUILD = 'fee-guard-2026-04-12k';

  var roleRaw =
    typeof window.__feeScheduleRoleMatch === 'string' ? window.__feeScheduleRoleMatch.trim().toLowerCase() : '';
  var tierRaw =
    typeof window.__feeScheduleTierMatch === 'string' ? window.__feeScheduleTierMatch.trim().toLowerCase() : '';
  var placeRaw =
    typeof window.__feeSchedulePlaceMatch === 'string' ? window.__feeSchedulePlaceMatch.trim().toLowerCase() : '';

  function bodyLower() {
    return collapseWs(document.body && document.body.textContent).toLowerCase();
  }

  /** What the page shows for education tiers (for panel log + verifying remote script updates). */
  function gatherTierVisibilityDebug() {
    var bl = bodyLower();
    return {
      scriptBuild: SCRIPT_BUILD,
      presentInBody: {
        master: /\bmaster\b/i.test(bl),
        bachelor: /\bbachelor\b/i.test(bl),
        associate: /\bassociate\b/i.test(bl),
        hsWord: /\bhs\b/.test(bl),
        highSchool: /high\s*school/i.test(bl),
        feeSchedulePhrase: bl.indexOf('fee schedule') !== -1
      },
      roleInput: roleRaw,
      tierInput: tierRaw
    };
  }

  function collapseWs(s) {
    return (s || '').replace(/\s+/g, ' ').trim();
  }

  var dbg = gatherTierVisibilityDebug();
  try {
    console.log('[inject-select-fee-schedule-role] tier visibility', JSON.stringify(dbg));
  } catch (eLog) {}

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

  function rowTextLower(el) {
    return collapseWs(el.textContent || '').toLowerCase();
  }

  function isSvgPlus(el) {
    if (!el) return false;
    var tag = (el.tagName || '').toLowerCase();
    if (tag === 'svg') {
      var di = el.getAttribute('data-icon');
      if (di === 'plus' || di === 'add') return true;
      if (el.classList && (el.classList.contains('fa-plus') || el.classList.contains('fa-add'))) return true;
      var cls = ((el.className && el.className.baseVal) || el.getAttribute('class') || '').toLowerCase();
      if (cls.indexOf('fa-plus') !== -1 || cls.indexOf('fa-add') !== -1) return true;
    }
    return false;
  }

  function findSvgPlusIn(container) {
    if (!container) return null;
    if (isSvgPlus(container)) return container;
    var svgs = container.querySelectorAll('svg');
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

  /** Plus / add control: button with +/add text, MUI icon button, or bare SVG fa-plus. */
  function isPlusLikeControl(el) {
    if (!el || el.nodeType !== 1) return false;
    if (isSvgPlus(el)) return true;
    var tag = (el.tagName || '').toLowerCase();
    if (tag !== 'button' && tag !== 'a' && el.getAttribute('role') !== 'button') {
      if (el.classList && el.classList.contains('MuiIconButton-root')) {
        /* allow */
      } else if (el.getAttribute && el.getAttribute('tabindex') === '0' && el.querySelector('svg')) {
        /* MUI div button */
      } else {
        if (findSvgPlusIn(el)) return true;
        return false;
      }
    }
    var txt = collapseWs(el.textContent || '');
    var aria = ((el.getAttribute && el.getAttribute('aria-label')) || '').toLowerCase();
    var title = ((el.getAttribute && el.getAttribute('title')) || '').toLowerCase();
    if (txt === '+' || txt === '＋' || txt === 'add' || txt === 'new') return true;
    if (aria.indexOf('add') !== -1 || aria.indexOf('plus') !== -1) return true;
    if (title.indexOf('add') !== -1) return true;
    if (el.querySelector && el.querySelector('svg')) {
      if (txt.length <= 3) return true;
    }
    return false;
  }

  function feeRoleSignal(low) {
    return /(\bbcba\b|\blbs\b|\brbt\b|behavior\s+technician|registered\s+behavior|rbt\s*\/\s*bt|rbt-bt|fee\s*schedule|\bibc\b|\bhighmark\b|quest)/i.test(
      low
    );
  }

  function rowMatchesPlace(low, place) {
    if (!place) return false;
    if (place === 'home') return /\bhome\b/.test(low) || /12\s*-/.test(low);
    if (place === 'office') return /\boffice\b/.test(low) || /11\s*-/.test(low);
    if (place === 'other') return /\bother\b/.test(low) || /99\s*-/.test(low);
    return low.indexOf(place) !== -1;
  }

  function rowMatchesRole(low, role) {
    if (role === 'bcba') return /\bbcba\b/.test(low);
    if (role === 'lbs') return /\blbs\b/.test(low);
    if (role === 'rbt_bt') {
      if (/\bbcba\b/.test(low) || /\blbs\b/.test(low)) return false;
      return (
        /\brbt\b/.test(low) ||
        /rbt\s*\/\s*bt/.test(low) ||
        /rbt-bt/.test(low) ||
        /behavior\s+technician/.test(low) ||
        /registered\s+behavior/.test(low) ||
        /\bbt\b(?!\w)/.test(low) ||
        low.indexOf('bt /') !== -1 ||
        low.indexOf('bt/') !== -1
      );
    }
    return false;
  }

  function rowMatchesTier(low, tier) {
    if (!tier) return true;
    if (tier === 'master') {
      return (
        low.indexOf('master') !== -1 ||
        low.indexOf('bachelor') !== -1 ||
        low.indexOf('master or bachelor') !== -1
      );
    }
    if (tier === 'associate') {
      return (
        low.indexOf('associate') !== -1 ||
        low.indexOf('associate or hs') !== -1 ||
        /\bhs\b/.test(low) ||
        /(^|[\s,;/(]|[-–—])hs([\s,;).]|$)/.test(low)
      );
    }
    return true;
  }

  var MAX_ROW_SNIP = 4000;

  function findRowForPlusButton(btn) {
    var tr = btn.closest('tr');
    if (tr) {
      var trLow = rowTextLower(tr);
      if (feeRoleSignal(trLow) && trLow.length <= MAX_ROW_SNIP) return tr;
    }
    var best = null;
    var bestLen = 1000000;
    var row = btn.parentElement;
    var depth = 0;
    while (row && depth < 22) {
      var low = rowTextLower(row);
      if (low.length <= MAX_ROW_SNIP && feeRoleSignal(low) && low.length < bestLen) {
        best = row;
        bestLen = low.length;
      }
      row = row.parentElement;
      depth++;
    }
    return best || tr || btn.parentElement;
  }

  function collectCandidatesFromPlusButtons() {
    var out = [];
    var seenRows = [];
    var sel =
      'button, [role="button"], a.MuiIconButton-root, .MuiIconButton-root, .MuiButtonBase-root, [class*="IconButton"], svg.fa-plus, svg[data-icon="plus"], .svg-inline--fa';
    var buttons = document.querySelectorAll(sel);
    for (var i = 0; i < buttons.length; i++) {
      var btn = buttons[i];
      if (!isPlusLikeControl(btn)) continue;
      var row = findRowForPlusButton(btn);
      if (!row) continue;
      var low = rowTextLower(row);
      if (!feeRoleSignal(low)) continue;
      var dup = false;
      for (var j = 0; j < seenRows.length; j++) {
        if (seenRows[j] === row) {
          dup = true;
          break;
        }
      }
      if (dup) continue;
      seenRows.push(row);
      out.push({ row: row, plus: btn, low: low });
    }
    return out;
  }

  function collectCandidatesFromTableRows() {
    var out = [];
    var seen = [];
    var rows = document.querySelectorAll('tbody tr, table tr, [role="row"]');
    for (var i = 0; i < rows.length; i++) {
      var tr = rows[i];
      var low = rowTextLower(tr);
      if (low.length > MAX_ROW_SNIP || low.length < 3) continue;
      if (!feeRoleSignal(low)) continue;
      var plus = null;
      var cells = tr.querySelectorAll('button, [role="button"], .MuiIconButton-root, .MuiButtonBase-root, svg.fa-plus, svg[data-icon="plus"]');
      for (var c = 0; c < cells.length; c++) {
        if (isPlusLikeControl(cells[c])) {
          plus = cells[c];
          break;
        }
      }
      if (!plus) continue;
      var key = tr;
      var dup = false;
      for (var j = 0; j < seen.length; j++) {
        if (seen[j] === key) {
          dup = true;
          break;
        }
      }
      if (dup) continue;
      seen.push(key);
      out.push({ row: tr, plus: plus, low: low });
    }
    return out;
  }

  function collectCandidatesFromDivRows() {
    var out = [];
    var seen = [];
    var svgs = document.querySelectorAll('svg.fa-plus, svg[data-icon="plus"], .svg-inline--fa.fa-plus');
    for (var i = 0; i < svgs.length; i++) {
      var svg = svgs[i];
      if (!isSvgPlus(svg)) continue;
      var row = svg.parentElement;
      if (!row) continue;
      var low = rowTextLower(row);
      if (low.length > MAX_ROW_SNIP || low.length < 3) continue;
      if (!feeRoleSignal(low)) {
        var up = row.parentElement;
        if (up) {
          var upLow = rowTextLower(up);
          if (feeRoleSignal(upLow) && upLow.length <= MAX_ROW_SNIP) {
            row = up;
            low = upLow;
          }
        }
      }
      if (!feeRoleSignal(low)) continue;
      var dup = false;
      for (var j = 0; j < seen.length; j++) {
        if (seen[j] === row) { dup = true; break; }
      }
      if (dup) continue;
      seen.push(row);
      out.push({ row: row, plus: svg, low: low });
    }
    return out;
  }

  function mergeCandidates(a, b) {
    var map = [];
    var out = [];
    function pushList(list) {
      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var dup = false;
        for (var j = 0; j < map.length; j++) {
          if (map[j].row === item.row && map[j].plus === item.plus) {
            dup = true;
            break;
          }
        }
        if (dup) continue;
        map.push(item);
        out.push(item);
      }
    }
    pushList(a);
    pushList(b);
    return out;
  }

  function feeMenuLikelyVisible(candidates) {
    if (candidates.length > 0) return true;
    var body = collapseWs(document.body && document.body.textContent).toLowerCase();
    if (body.indexOf('fee schedule') !== -1) return true;
    if (body.indexOf('feeschedule') !== -1) return true;
    return false;
  }

  function pickBestRow(candidates, role, requireTier) {
    var tierFilter = requireTier && tierRaw ? tierRaw : '';
    var scored = [];
    for (var i = 0; i < candidates.length; i++) {
      var c = candidates[i];
      if (!rowMatchesRole(c.low, role)) continue;
      var tierOk = rowMatchesTier(c.low, tierFilter);
      scored.push({ c: c, tierOk: tierOk });
    }
    var strict = [];
    for (var j = 0; j < scored.length; j++) {
      if (scored[j].tierOk) strict.push(scored[j].c);
    }
    if (strict.length) return strict[0];
    if (requireTier && tierFilter) return null;
    for (var k = 0; k < scored.length; k++) {
      if (rowMatchesRole(scored[k].c.low, role)) return scored[k].c;
    }
    return null;
  }

  function pickBestRowFallbackTier(candidates, role) {
    var withTier = pickBestRow(candidates, role, true);
    if (withTier) return withTier;
    return pickBestRow(candidates, role, false);
  }

  var tierScanLog = [];

  function findTierActionClickable(keyword) {
    var wantMaster = keyword === 'master';
    var wantAssoc = keyword === 'associate';
    var wantHome = keyword === 'home';
    var wantOffice = keyword === 'office';
    var wantOther = keyword === 'other';
    var isLocation = wantHome || wantOffice || wantOther;

    var pageHasFee = collapseWs(document.body && document.body.textContent)
      .toLowerCase()
      .indexOf('fee schedule');

    var best = null;
    var bestLen = 100000;
    var seen = [];
    var list = [];

    var sel = [
      'button', '[role="button"]', 'a', 'label',
      '.MuiButtonBase-root', '.MuiCardActionArea-root', '.MuiIconButton-root',
      '.MuiCard-root', '.MuiPaper-root',
      '[class*="MuiRadio"]', '[class*="MuiFormControlLabel"]',
      'div[class*="jss"]', 'div[class*="Card"]',
      'svg.fa-plus', 'svg[data-icon="plus"]'
    ].join(', ');
    var nodes = document.querySelectorAll(sel);
    for (var ni = 0; ni < nodes.length; ni++) list.push(nodes[ni]);

    var wideDivs = document.querySelectorAll('div, span, td, li');
    var wMax = Math.min(wideDivs.length, 2000);
    for (var wi = 0; wi < wMax; wi++) {
      var wd = wideDivs[wi];
      var wt = rowTextLower(wd);
      if (wt.length < 4 || wt.length > 160) continue;
      var hasKeyword =
        wt.indexOf('master') !== -1 || wt.indexOf('bachelor') !== -1 ||
        wt.indexOf('associate') !== -1 || /\bhs\b/.test(wt) || wt.indexOf('high school') !== -1 ||
        /\bhome\b/.test(wt) || /\boffice\b/.test(wt) || /\bother\b/.test(wt);
      if (hasKeyword) list.push(wd);
    }

    for (var i = 0; i < list.length; i++) {
      var el = list[i];
      var t = rowTextLower(el);
      if (t.length > 220 || t.length < 2) continue;

      var matchKeyword = false;
      if (!isLocation) {
        if (t.indexOf('master') !== -1 || t.indexOf('bachelor') !== -1 ||
            t.indexOf('associate') !== -1 || /\bhs\b/.test(t) || t.indexOf('high school') !== -1) {
          matchKeyword = true;
        }
      } else {
        if (/\bhome\b/.test(t) || /\boffice\b/.test(t) || /\bother\b/.test(t) || /12\s*-/.test(t) || /11\s*-/.test(t) || /99\s*-/.test(t)) {
          matchKeyword = true;
        }
      }
      if (!matchKeyword) continue;

      var wantMatch = false;
      if (wantMaster) {
        wantMatch = t.indexOf('master') !== -1 || t.indexOf('bachelor') !== -1;
      } else if (wantAssoc) {
        wantMatch = t.indexOf('associate') !== -1 || /\bhs\b/.test(t) || t.indexOf('high school') !== -1;
      } else if (wantHome) {
        wantMatch = /\bhome\b/.test(t) || /12\s*-/.test(t);
      } else if (wantOffice) {
        wantMatch = /\boffice\b/.test(t) || /11\s*-/.test(t);
      } else if (wantOther) {
        wantMatch = /\bother\b/.test(t) || /99\s*-/.test(t);
      }

      var up = el;
      var depth = 0;
      var inFee = false;
      while (up && depth < 14) {
        var u = rowTextLower(up);
        if (u.indexOf('fee schedule') !== -1 || u.indexOf('feeschedule') !== -1) {
          inFee = true;
          break;
        }
        up = up.parentElement;
        depth++;
      }
      if (!inFee && pageHasFee !== -1) {
        var elCls = ((el.className || '') + '').toLowerCase();
        var isProviderTag = elCls.indexOf('tag') !== -1 || elCls.indexOf('label') !== -1;
        var isFormDisplay = elCls.indexOf('form-control') !== -1 || elCls.indexOf('col-sm') !== -1;
        if (!isProviderTag && !isFormDisplay) inFee = true;
      }

      var dup = false;
      for (var si = 0; si < seen.length; si++) { if (seen[si] === el) { dup = true; break; } }
      if (dup) continue;
      seen.push(el);

      var snippet = t.length > 80 ? t.slice(0, 80) + '…' : t;
      tierScanLog.push({
        text: snippet,
        tag: (el.tagName || '').toLowerCase(),
        cls: ((el.className || '') + '').slice(0, 120),
        wantMatch: wantMatch,
        inFee: inFee
      });

      if (!wantMatch) continue;
      if (!inFee) continue;

      var clickTarget = el;
      var tag = (el.tagName || '').toLowerCase();
      if (tag !== 'button' && tag !== 'a' && el.getAttribute('role') !== 'button') {
        var cursor = '';
        try { cursor = window.getComputedStyle(el).cursor; } catch (eC) {}
        if (cursor !== 'pointer' && !el.onclick && el.getAttribute('tabindex') == null) {
          var par = el.parentElement;
          if (par) {
            var pCursor = '';
            try { pCursor = window.getComputedStyle(par).cursor; } catch (eP) {}
            if (pCursor === 'pointer' || par.onclick || (par.tagName || '').toLowerCase() === 'button' ||
                par.getAttribute('role') === 'button' || par.getAttribute('tabindex') != null) {
              clickTarget = par;
            }
          }
        }
      }

      var svgPlus = findSvgPlusNear(el);
      if (svgPlus) clickTarget = svgPlus;

      var ctTag = (clickTarget.tagName || '').toLowerCase();
      var isInteractive = (ctTag === 'button' || ctTag === 'a' || ctTag === 'svg' ||
        (clickTarget.getAttribute && clickTarget.getAttribute('role') === 'button'));
      if (!isInteractive) {
        try { isInteractive = window.getComputedStyle(clickTarget).cursor === 'pointer'; } catch (_) {}
      }
      if (!isInteractive) {
        isInteractive = !!clickTarget.onclick || (clickTarget.getAttribute && clickTarget.getAttribute('tabindex') != null);
      }
      if (!isInteractive) continue;

      if (t.length < bestLen) {
        best = clickTarget;
        bestLen = t.length;
      }
    }
    return best;
  }

  function dumpVisibleClickables() {
    var out = [];
    var els = document.querySelectorAll(
      'button, [role="button"], a, label, .MuiButtonBase-root, .MuiCardActionArea-root, .MuiIconButton-root, .MuiCard-root, [class*="MuiFormControlLabel"]'
    );
    for (var i = 0; i < els.length && out.length < 25; i++) {
      var t = collapseWs(els[i].textContent || '').toLowerCase();
      if (t.length < 2 || t.length > 150) continue;
      out.push(t.length > 80 ? t.slice(0, 80) + '…' : t);
    }
    return out;
  }

  var fromPlus = collectCandidatesFromPlusButtons();
  var fromTable = collectCandidatesFromTableRows();
  var fromDivs = collectCandidatesFromDivRows();
  var candidates = mergeCandidates(mergeCandidates(fromPlus, fromTable), fromDivs);
  dbg.feeRowCandidates = candidates.length;

  var candidateSnippets = [];
  for (var ci = 0; ci < candidates.length && ci < 15; ci++) {
    var snip = candidates[ci].low;
    candidateSnippets.push(snip.length > 120 ? snip.slice(0, 120) + '…' : snip);
  }
  dbg.candidateRowTexts = candidateSnippets;

  function withDbg(obj, extra) {
    var d = {};
    for (var k in dbg) if (Object.prototype.hasOwnProperty.call(dbg, k)) d[k] = dbg[k];
    if (extra) for (var k2 in extra) if (Object.prototype.hasOwnProperty.call(extra, k2)) d[k2] = extra[k2];
    if (tierScanLog.length > 0) d.tierScan = tierScanLog;
    if (tierScanLog.length === 0 && candidates.length === 0) {
      d.allClickables = dumpVisibleClickables();
    }
    obj.debug = d;
    try {
      console.log('[inject-select-fee-schedule-role] result', JSON.stringify(obj));
    } catch (e2) {}
    return obj;
  }

  if (!feeMenuLikelyVisible(candidates)) {
    window.__selectFeeScheduleRoleResult = withDbg({ success: true, skipped: true, clicked: 0 }, { phase: 'no_fee_ui' });
    return;
  }

  var chosen = null;

  if (roleRaw && (roleRaw === 'bcba' || roleRaw === 'lbs' || roleRaw === 'rbt_bt')) {
    chosen = pickBestRowFallbackTier(candidates, roleRaw);
  }

  if (!chosen && tierRaw) {
    var tierEl = findTierActionClickable(tierRaw);
    if (tierEl) {
      chosen = { row: tierEl, plus: tierEl, low: rowTextLower(tierEl) };
    }
  }

  if (!chosen && placeRaw) {
    for (var pi = 0; pi < candidates.length; pi++) {
      if (rowMatchesPlace(candidates[pi].low, placeRaw)) {
        chosen = candidates[pi];
        break;
      }
    }
    if (!chosen) {
      var placeEl = findTierActionClickable(placeRaw === 'home' ? 'home' : placeRaw === 'office' ? 'office' : 'other');
      if (placeEl) {
        chosen = { row: placeEl, plus: placeEl, low: rowTextLower(placeEl) };
      }
    }
  }

  if (!chosen) {
    var hasInteractiveTierHits = false;
    for (var tsi = 0; tsi < tierScanLog.length; tsi++) {
      if (tierScanLog[tsi].wantMatch && tierScanLog[tsi].inFee &&
          (tierScanLog[tsi].tag === 'svg' || tierScanLog[tsi].tag === 'button' || tierScanLog[tsi].tag === 'a')) {
        hasInteractiveTierHits = true; break;
      }
    }
    var noInteractiveUI = candidates.length === 0 && !hasInteractiveTierHits;

    var seenSummary = candidates.length > 0
      ? ' Candidate rows seen (' + candidates.length + '): ' +
        candidateSnippets.slice(0, 5).map(function(s) { return '"' + s + '"'; }).join('; ')
      : ' No candidate rows with fee-role signal found.';
    var tierSummary;
    if (tierScanLog.length > 0) {
      tierSummary = ' Tier buttons scanned (' + tierScanLog.length + '): ' +
        tierScanLog.slice(0, 6).map(function(e) {
          return '"' + e.text + '" (wantMatch=' + e.wantMatch + ', inFee=' + e.inFee + ')';
        }).join('; ');
    } else {
      var btns = dumpVisibleClickables();
      tierSummary = btns.length > 0
        ? ' No tier-keyword elements found. All clickable buttons on page: ' +
          btns.slice(0, 8).map(function(s) { return '"' + s + '"'; }).join('; ')
        : ' No tier-keyword elements and no clickable buttons found on page (DOM may still be loading).';
    }
    window.__selectFeeScheduleRoleResult = withDbg(
      {
        success: false,
        clicked: 0,
        noInteractiveUI: noInteractiveUI,
        error:
          (noInteractiveUI
            ? 'Body text mentions "fee schedule" but no fee rows or tier cards found in DOM yet.'
            : 'The fee schedule menu is visible, but no row matched role "' +
              roleRaw + '"' + (tierRaw ? ' (tier "' + tierRaw + '")' : '') + '.') +
          seenSummary + tierSummary
      },
      { phase: noInteractiveUI ? 'no_interactive_fee_ui' : 'no_row_match' }
    );
    return;
  }

  try {
    chosen.row.scrollIntoView({ block: 'center', inline: 'nearest' });
  } catch (e1) {}

  try {
    chosen.plus.scrollIntoView({ block: 'center', inline: 'nearest' });
  } catch (e2) {}

  var matchedText = roleRaw + (tierRaw ? '+' + tierRaw : '');
  try {
    humanClick(chosen.plus);
    window.__selectFeeScheduleRoleResult = withDbg(
      { success: true, clicked: 1, matchedText: matchedText },
      { phase: 'clicked' }
    );
  } catch (e) {
    window.__selectFeeScheduleRoleResult = withDbg(
      {
        success: false,
        clicked: 0,
        matchedText: matchedText,
        error: e.message || 'Click failed.'
      },
      { phase: 'click_error' }
    );
  }
})();
