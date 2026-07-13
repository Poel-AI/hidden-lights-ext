/**
 * Side panel: Sig button sends drawS to the active tab's content script.
 * Logs to both console and the #log div in the panel.
 */
const PANEL_BUILD = '2026-07-13rbt-logo';
const logEl = document.getElementById('log');

(function showPanelBuild() {
  var el = document.getElementById('panel-build-label');
  if (el) el.textContent = PANEL_BUILD;
})();

/* ---------- Mode visibility flags ---------- */
const ENABLE_MANUAL_MODE = false;
const ENABLE_AI_SEARCH_MODE = false;

/* ---------- Settings panel ---------- */
const SETTINGS_STORAGE_KEY = 'hidden_lights_fixer_settings';
const DEFAULT_ALLOWED_PAYORS = ['United Healthcare Community Plan'];

/** Split comma- or newline-separated settings lists (payor allow/block). */
function commaSplitLines(raw) {
  if (!raw || typeof raw !== 'string') return [];
  return raw
    .split(/[\n,]+/)
    .map(function (s) {
      return s.trim();
    })
    .filter(Boolean);
}

/**
 * Stored payor lists are string[] — legacy rows sometimes used one comma-joined string per slot.
 * Split each element so UI and inject always see one substring per entry.
 */
function flattenPayorStringsForList(items) {
  var out = [];
  if (!Array.isArray(items)) return out;
  items.forEach(function (item) {
    commaSplitLines(String(item || '')).forEach(function (t) {
      if (t) out.push(t);
    });
  });
  return out;
}

let _settingsCache = null;

/** Read settings from the active tab's localStorage via execScript. */
async function _loadSettingsFromPage() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return null;
    const results = await execScript({
      target: { tabId: tab.id },
      func: (key) => {
        try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : null; }
        catch (e) { return null; }
      },
      args: [SETTINGS_STORAGE_KEY]
    });
    return results && results[0] && results[0].result;
  } catch (e) {
    console.warn('[Settings] page read failed:', e);
    return null;
  }
}

/** Write settings to the active tab's localStorage via execScript. */
async function _saveSettingsToPage(obj) {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return;
    await execScript({
      target: { tabId: tab.id },
      func: (key, val) => {
        try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* ignore */ }
      },
      args: [SETTINGS_STORAGE_KEY, obj]
    });
  } catch (e) {
    console.warn('[Settings] page write failed:', e);
  }
}

let _settingsCacheReady = null;

async function _initSettingsCache() {
  _settingsCache = await _loadSettingsFromPage();
  console.log('[Settings] loaded:', _settingsCache ? Object.keys(_settingsCache).join(', ') : '(empty)');
}

function _ensureSettingsLoaded() {
  if (!_settingsCacheReady) _settingsCacheReady = _initSettingsCache();
  return _settingsCacheReady;
}

function loadSettings() {
  return _settingsCache;
}

function saveSettings(obj) {
  const existing = _settingsCache || {};
  _settingsCache = Object.assign({}, existing, obj);
  _saveSettingsToPage(_settingsCache);
}

function getAllowedPayors() {
  const s = loadSettings();
  const raw =
    s && Array.isArray(s.allowedPayors) && s.allowedPayors.length ? s.allowedPayors : null;
  if (!raw) return DEFAULT_ALLOWED_PAYORS.slice();
  const flat = flattenPayorStringsForList(raw);
  return flat.length ? flat : DEFAULT_ALLOWED_PAYORS.slice();
}

function getBlockedPayors() {
  const s = loadSettings();
  if (!s || !Array.isArray(s.blockedPayors) || !s.blockedPayors.length) return [];
  return flattenPayorStringsForList(s.blockedPayors);
}

/** Append one substring to allowed payors (dedupe), persist, merge with existing settings. */
function addPayorToAllowedList(substring) {
  const t = typeof substring === 'string' ? substring.trim() : '';
  if (!t) return;
  const cur = getAllowedPayors().slice();
  if (!cur.some(function (x) { return x === t; })) cur.push(t);
  saveSettings({ allowedPayors: cur.length ? cur : DEFAULT_ALLOWED_PAYORS });
}

function addPayorToBlockedList(substring) {
  const t = typeof substring === 'string' ? substring.trim() : '';
  if (!t) return;
  const cur = getBlockedPayors().slice();
  if (!cur.some(function (x) { return x === t; })) cur.push(t);
  saveSettings({ blockedPayors: cur });
}

function getAnthropicApiKey() {
  const s = loadSettings();
  return (s && typeof s.anthropicApiKey === 'string') ? s.anthropicApiKey : '';
}

_ensureSettingsLoaded();

(function initSettingsPanel() {
  const toggleBtn = document.getElementById('toggle-settings');
  const panel = document.getElementById('settings-panel');
  const allowTa = document.getElementById('settings-payors-allow');
  const blockTa = document.getElementById('settings-payors-block');
  const apiKeyInput = document.getElementById('settings-anthropic-key');
  const saveBtn = document.getElementById('settings-save');
  const savedMsg = document.getElementById('settings-saved-msg');
  if (!toggleBtn || !panel) return;
  toggleBtn.addEventListener('click', async () => {
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) {
      _settingsCacheReady = _initSettingsCache();
      await _settingsCacheReady;
      if (allowTa) allowTa.value = getAllowedPayors().join('\n');
      if (blockTa) blockTa.value = getBlockedPayors().join('\n');
      if (apiKeyInput) apiKeyInput.value = getAnthropicApiKey();
      if (allowTa) allowTa.focus();
    }
  });
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const allowedItems = allowTa ? commaSplitLines(allowTa.value) : [];
      const blockedItems = blockTa ? commaSplitLines(blockTa.value) : [];
      const updated = {
        allowedPayors: allowedItems.length ? allowedItems : DEFAULT_ALLOWED_PAYORS,
        blockedPayors: blockedItems,
        anthropicApiKey: apiKeyInput ? apiKeyInput.value.trim() : ''
      };
      saveSettings(updated);
      if (savedMsg) {
        savedMsg.classList.add('show');
        setTimeout(() => savedMsg.classList.remove('show'), 1500);
      }
    });
  }
})();

/**
 * Snapshot from first timesheet during an overlap fix (provider, POS, address, date, timezone).
 * Stored per target tab so Run-all parallel jobs do not clobber each other.
 */
const overlapFixRecordByTabId = new Map();

function overlapFixRecordGet(tabId) {
  if (tabId == null || tabId === '') return null;
  return overlapFixRecordByTabId.get(tabId) || null;
}

function overlapFixRecordSet(tabId, rec) {
  if (tabId == null || tabId === '') return;
  overlapFixRecordByTabId.set(tabId, rec);
}

function overlapFixRecordClear(tabId) {
  if (tabId != null && tabId !== '') overlapFixRecordByTabId.delete(tabId);
}

const TIMESHEET_SNAPSHOT_READ_TIMEOUT_MS = 20000;

/**
 * Read line-1 timesheet fields into overlapFixRecordSet. Polls __timesheetResult with a timeout
 * so Run all rows do not spin forever if the inject never sets the global.
 */
async function captureOverlapFixTimesheetSnapshot(tabId, reportProgress) {
  if (reportProgress) await reportProgress('Saving snapshot…', 'snapshot');
  await execScript({
    target: { tabId: tabId },
    files: ['inject-service-line-tab-count.js', 'inject-read-timesheet.js']
  });
  await new Promise(function (r) {
    setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS);
  });
  var deadline = Date.now() + TIMESHEET_SNAPSHOT_READ_TIMEOUT_MS;
  var data = null;
  while (Date.now() < deadline) {
    var results = await execScript({
      target: { tabId: tabId },
      func: function () {
        return window.__timesheetResult;
      }
    });
    data = results && results[0] && results[0].result;
    if (data) break;
    await new Promise(function (r) {
      setTimeout(r, 400);
    });
  }
  if (!data) {
    return { error: 'Could not read timesheet (timed out waiting for snapshot).' };
  }
  if (data.error) {
    return { error: data.error };
  }
  overlapFixRecordSet(tabId, {
    provider: data.provider,
    placeOfService: data.placeOfService,
    serviceAddress: data.serviceAddress,
    serviceAddressText: data.serviceAddressText || data.serviceAddress,
    dateOfService: data.dateOfService,
    timeZone: data.timeZone,
    timeZoneValue: data.timeZoneValue != null ? String(data.timeZoneValue).trim() : ''
  });
  if (reportProgress) await reportProgress('Snapshot saved', 'snapshot');
  return { ok: true, data: data };
}

/** URL of the tab used for the last overlap scan (for Run all — duplicate list or timesheet deep link). */
let lastOverlapScanPageUrl = null;
/** `'texas'` | `'97155'` — which scan produced `lastOverlapScanPageUrl` (Texas = default billing overlap list). */
let lastOverlapScanMode = null;

/**
 * Run all: max concurrent workers. Fixes run truly in parallel — only
 * date-picker steps are serialized by the focus lock below.
 */
const RUN_ALL_MAX_CONCURRENT = 5;
/**
 * Minimum ms between consecutive `chrome.tabs.create` calls. Tighten/loosen stagger here.
 */
const RUN_ALL_TAB_CREATE_STAGGER_MS = 350;

/** For stagger between tab creates (first create is not delayed). */
let runAllLastTabsCreateMs = 0;

/**
 * Narrow focus lock for Run All — only held during the ~3–4 s date-picker
 * window (focus tab → set date → poll settle). Everything else runs in
 * parallel across tabs. Inactive (no-op) during single-entry execution.
 */
let _runAllFocusActive = false;
let _runAllFocusChain = Promise.resolve();
function acquireRunAllFocus() {
  if (!_runAllFocusActive) return Promise.resolve(function () {});
  const prev = _runAllFocusChain;
  let release;
  _runAllFocusChain = new Promise(function (r) { release = r; });
  return prev.then(function () { return release; });
}

/** @returns {Promise<void>} */
function sleepRunAll(ms) {
  return new Promise(function (r) {
    setTimeout(r, ms);
  });
}

/**
 * CentralReach date pickers often need the timesheet tab to be active.
 * During Run All, acquires the focus lock first so only one tab is active at a time.
 * @param {number} tabId
 * @returns {Promise<function>} release — caller MUST call release() when the focus-sensitive
 *   work is done (e.g. after pollForInjectResult for the date step).
 *   For single-entry execution the returned function is a no-op.
 */
async function focusTargetTabForTimesheetUi(tabId) {
  var release = await acquireRunAllFocus();
  if (tabId == null) return release;
  try {
    if (typeof chrome.tabs !== 'undefined' && typeof chrome.tabs.update === 'function') {
      await chrome.tabs.update(tabId, { active: true });
    } else if (typeof window.SHELL !== 'undefined' && typeof window.SHELL.activateTab === 'function') {
      await window.SHELL.activateTab(tabId);
    }
    await sleepRunAll(380);
  } catch (e) {
    log('Focus tab ' + tabId + ' (soft): ' + (e.message || String(e)));
  }
  return release;
}

/** Wait until timesheet editor is loaded enough to inject (date field preferred). */
async function waitForTimesheetEditorReady(tabId, entryId, maxWaitMs) {
  var waitMs = maxWaitMs != null ? maxWaitMs : 45000;
  var pollMs = 400;
  var stablePasses = 0;
  for (var elapsed = 0; elapsed < waitMs; elapsed += pollMs) {
    var data = null;
    try {
      var res = await execScript({
        target: { tabId: tabId },
        func: function () {
          var input =
            document.getElementById('dateOfService') ||
            document.querySelector('input[name="dateOfService"]') ||
            document.querySelector('input.hasDatepicker');
          var hasDateInput = false;
          if (input) {
            var rect = input.getBoundingClientRect();
            var style = window.getComputedStyle(input);
            hasDateInput =
              !!rect.width &&
              !!rect.height &&
              !input.disabled &&
              !input.readOnly &&
              style.visibility !== 'hidden' &&
              style.display !== 'none';
          }
          var hasTimeWorked = document.body.innerText.indexOf('Time worked') !== -1;
          var hasAnyInput = !!document.querySelector('input');
          if (hasDateInput || hasTimeWorked || hasAnyInput) {
            return { ready: true, hasDateInput: hasDateInput };
          }
          return { ready: false };
        },
      });
      data = res && res[0] && res[0].result;
    } catch (ePoll) {
      data = null;
    }
    if (data && data.ready) {
      stablePasses += 1;
      var needStable = data.hasDateInput ? 2 : 3;
      if (stablePasses >= needStable) {
        await sleepRunAll(_runAllFocusActive ? 1000 : 600);
        return true;
      }
    } else {
      stablePasses = 0;
    }
    await sleepRunAll(pollMs);
  }
  throw new Error('Timesheet editor did not finish loading in time (entry ' + entryId + ').');
}

/**
 * Build URL to open for Run all. Texas / Speech-shaped = same billing list URL; 97155 = timesheet editor hash for entry id.
 * @param {string} listUrl
 * @param {string} entryId
 * @param {'texas'|'speech'|'97155'} mode
 */
function buildRunAllOpenUrl(listUrl, entryId, mode) {
  if (!listUrl || !entryId) return listUrl;
  if (mode === '97155') {
    try {
      const u = new URL(listUrl);
      u.hash = 'billingmanager/timesheeteditor/?&id=' + String(entryId);
      return u.href;
    } catch (e) {
      return listUrl;
    }
  }
  return listUrl;
}

async function staggeredTabsCreate(url) {
  const now = Date.now();
  if (runAllLastTabsCreateMs > 0) {
    const due = runAllLastTabsCreateMs + RUN_ALL_TAB_CREATE_STAGGER_MS;
    if (now < due) await sleepRunAll(due - now);
  }
  let tab;
  if (typeof chrome.tabs.create === 'function') {
    tab = await chrome.tabs.create({ url: url, active: false });
  } else if (typeof window.SHELL !== 'undefined' && typeof window.SHELL.createTab === 'function') {
    tab = await window.SHELL.createTab({ url: url, active: false });
  } else {
    throw new Error('chrome.tabs.create is not available in this environment');
  }
  if (!tab || tab.id == null) {
    throw new Error('tabs.create returned no tab id');
  }
  runAllLastTabsCreateMs = Date.now();
  return tab;
}

function waitForTabStatusComplete(tabId, timeoutMs) {
  return new Promise(function (resolve, reject) {
    var done = false;
    var timer = setTimeout(function () {
      if (done) return;
      done = true;
      try {
        chrome.tabs.onUpdated.removeListener(onUpdated);
      } catch (e) {}
      reject(new Error('Tab load timed out after ' + Math.round(timeoutMs / 1000) + 's'));
    }, timeoutMs);
    function finishOk() {
      if (done) return;
      done = true;
      clearTimeout(timer);
      try {
        chrome.tabs.onUpdated.removeListener(onUpdated);
      } catch (e) {}
      resolve();
    }
    function onUpdated(id, info) {
      if (id !== tabId) return;
      if (info.status === 'complete') finishOk();
    }
    chrome.tabs.onUpdated.addListener(onUpdated);
    chrome.tabs.get(tabId).then(function (t) {
      if (t && t.status === 'complete') finishOk();
    }).catch(function () {});
  });
}

/** Wait for tab load: real extension API, or POEL sandbox `SHELL.waitTabComplete`. */
async function waitForTabLoadCompleteUnified(tabId, timeoutMs) {
  const ms = timeoutMs != null ? timeoutMs : 120000;
  if (
    typeof chrome.tabs !== 'undefined' &&
    chrome.tabs.onUpdated &&
    typeof chrome.tabs.onUpdated.addListener === 'function'
  ) {
    return waitForTabStatusComplete(tabId, ms);
  }
  if (typeof window.SHELL !== 'undefined' && typeof window.SHELL.waitTabComplete === 'function') {
    await window.SHELL.waitTabComplete(tabId, ms);
    return;
  }
  await sleepRunAll(Math.min(5000, ms));
}

async function setTabConcurrenceTitle(tabId, client, date) {
  var want = String((client || '').trim() + ' · ' + (date || '').trim()).trim();
  if (want.length > 120) want = want.slice(0, 117) + '...';
  if (!want) want = 'Hidden Lights';
  var betweenMs = [280, 450, 700];
  for (var round = 0; round <= betweenMs.length; round++) {
    if (round > 0) await sleepRunAll(betweenMs[round - 1]);
    try {
      await execScript({
        target: { tabId: tabId },
        world: 'MAIN',
        func: function (t) {
          document.title = t;
        },
        args: [want]
      });
    } catch (e) {
      /* ignore */
    }
  }
}

async function writeConcurrenceFixProgress(tabId, message, phase, error) {
  try {
    await execScript({
      target: { tabId: tabId },
      world: 'MAIN',
      func: function (p) {
        window.__concurrenceFixProgress = {
          phase: p.phase || '',
          message: p.message || '',
          error: p.error != null ? p.error : null,
          updatedAt: Date.now()
        };
      },
      args: [{ phase: phase || '', message: String(message || '').slice(0, 400), error: error != null ? String(error).slice(0, 400) : null }]
    });
  } catch (e) {
    /* tab gone */
  }
}

function createVirtualOverlapFixButton(fix, mode97155, meta) {
  var b = document.createElement('button');
  b.type = 'button';
  b.setAttribute('data-run-all-virtual', '1');
  if (mode97155) b.setAttribute('data-fix-mode', '97155');
  b.setAttribute('data-entry-id', fix.entryId);
  b.setAttribute('data-time-from', fix.timeFrom);
  b.setAttribute('data-time-to', fix.timeTo);
  b.setAttribute('data-overlap', fix.overlapText || '');
  b.setAttribute('data-overlap-from', fix.overlapFrom || '');
  b.setAttribute('data-overlap-to', fix.overlapTo || '');
  b.setAttribute('data-part3-from', fix.part3From || '');
  b.setAttribute('data-part3-to', fix.part3To || '');
  b.setAttribute('data-overlap-type', fix.overlapType || 'middle');
  if (meta) {
    if (meta.client) b.setAttribute('data-client', meta.client);
    if (meta.date) b.setAttribute('data-date', meta.date);
    if (meta.originalTimes) b.setAttribute('data-original-times', meta.originalTimes);
    if (meta.logSummary) b.setAttribute('data-log-summary', meta.logSummary);
  }
  return b;
}

function createVirtualMulti97155FixButton(plan, meta) {
  var b = document.createElement('button');
  b.type = 'button';
  b.setAttribute('data-run-all-virtual', '1');
  b.setAttribute('data-fix-mode', '97155-multi');
  b.setAttribute('data-entry-id', plan.entryId);
  b.setAttribute('data-fix-plan', JSON.stringify(plan));
  if (meta) {
    if (meta.client) b.setAttribute('data-client', meta.client);
    if (meta.date) b.setAttribute('data-date', meta.date);
    if (meta.originalTimes) b.setAttribute('data-original-times', meta.originalTimes);
    if (meta.logSummary) b.setAttribute('data-log-summary', meta.logSummary);
  }
  return b;
}

/** Match the visible Fix button for this run-all job (same row as a single Fix click). */
function findFixButtonForRunAllJob(job) {
  var root = document.getElementById('overlap-fix-buttons');
  if (!root) return null;
  var wantId = String((job.fix && job.fix.entryId) || '');
  var wantClient = String((job.client || '').trim());
  var wantDate = String((job.date || '').trim());
  var wantMode = job.mode === '97155-multi' ? '97155-multi' : job.mode === '97155' ? '97155' : '';
  var list = root.querySelectorAll('button.overlap-btn');
  for (var i = 0; i < list.length; i++) {
    var b = list[i];
    if (b.disabled) continue;
    if (String(b.getAttribute('data-entry-id') || '') !== wantId) continue;
    if (String(b.getAttribute('data-client') || '').trim() !== wantClient) continue;
    if (String(b.getAttribute('data-date') || '').trim() !== wantDate) continue;
    if (wantMode && String(b.getAttribute('data-fix-mode') || '') !== wantMode) continue;
    return b;
  }
  return null;
}

/** Non-error status line under the overlap row (same cell as fail reason). */
function setOverlapFixLiveProgress(btn, text) {
  if (!btn) return;
  var item = btn.closest('.overlap-list__item');
  if (!item) return;
  var el = item.querySelector('.overlap-list__fail-reason');
  if (!el) return;
  el.classList.add('overlap-list__fail-reason--progress');
  el.textContent = text || '';
}

function clearOverlapFixLiveProgress(btn) {
  if (!btn) return;
  var item = btn.closest('.overlap-list__item');
  if (!item) return;
  var el = item.querySelector('.overlap-list__fail-reason');
  if (!el) return;
  el.classList.remove('overlap-list__fail-reason--progress');
  el.textContent = '';
}

function clearOverlapRunAllMount() {
  var wrap = document.getElementById('overlap-run-all-wrap');
  if (wrap) wrap.innerHTML = '';
}

function mountOverlapRunAllUI(mode, groups, multiCases) {
  clearOverlapRunAllMount();
  var wrap = document.getElementById('overlap-run-all-wrap');
  if (!wrap || !lastOverlapScanPageUrl) return;
  var jobs = [];
  for (var i = 0; i < groups.length; i++) {
    var g = groups[i];
    var fix = getOverlapFixForGroup(g);
    if (!fix.ok) continue;
    var clientLabel = (g.client || '(no client)').trim();
    var dateLabel = (g.date || '').trim();
    var timesLine = (g.entries || [])
      .map(function (e) {
        return (e.time || '').trim() + ' ' + shortServiceCode(e.serviceAuth);
      })
      .join(' | ');
    var overlapText = fix.overlapText || (mode === '97155' ? getOverlap97155Display(g) : '');
    var logSummary =
      (mode === '97155' ? '97155' : 'speech') +
      ' · ' +
      clientLabel +
      ' • ' +
      dateLabel +
      ' ' +
      timesLine +
      (overlapText ? ' Overlap ' + overlapText : '');
    jobs.push({
      client: g.client,
      date: g.date,
      mode: mode,
      fix: fix,
      originalTimes: timesLine,
      logSummary: logSummary
    });
  }
  if (mode === '97155' && multiCases && multiCases.length) {
    for (var m = 0; m < multiCases.length; m++) {
      var item = multiCases[m];
      var plan = buildMulti97155FixPlanFromCase(item);
      if (!plan.ok) continue;
      var clientM = (item.client || '(no client)').trim();
      var dateM = (item.date || '').trim();
      var timesM =
        (item.entry97153.time || '').trim() +
        ' 97153 | ' +
        (item.concurrent97155 || [])
          .map(function (e) {
            return (e.time || '').trim() + ' 97155';
          })
          .join(' | ');
      jobs.push({
        client: item.client,
        date: item.date,
        mode: '97155-multi',
        plan: plan,
        fix: { entryId: plan.entryId },
        originalTimes: timesM,
        logSummary: '97155-multi · ' + clientM + ' • ' + dateM + ' ' + timesM
      });
    }
  }
  if (jobs.length === 0) return;
  var toolbar = document.createElement('div');
  toolbar.className = 'overlap-run-all-toolbar';
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.id = 'overlap-run-all-btn';
  btn.textContent = 'Run all (' + jobs.length + ')';
  btn.addEventListener('click', function () {
    void startOverlapRunAll(jobs);
  });
  toolbar.appendChild(btn);
  wrap.appendChild(toolbar);
}

var _runAllPollTimer = null;

function stopRunAllProgressPoll() {
  if (_runAllPollTimer != null) {
    clearInterval(_runAllPollTimer);
    _runAllPollTimer = null;
  }
}

function startRunAllProgressPoll(tabIdToFixBtn) {
  stopRunAllProgressPoll();
  _runAllPollTimer = setInterval(function () {
    tabIdToFixBtn.forEach(function (fixBtn, tabId) {
      if (!fixBtn || !fixBtn.isConnected) return;
      execScript({
        target: { tabId: tabId },
        func: function () {
          return window.__concurrenceFixProgress || null;
        }
      })
        .then(function (res) {
          var data = res && res[0] && res[0].result;
          if (!data || !fixBtn.isConnected) return;
          var t = (data.message || data.phase || '').trim();
          if (t) setOverlapFixLiveProgress(fixBtn, t);
        })
        .catch(function () {});
    });
  }, 450);
}

/**
 * Run queued overlap fixes: staggered tab.create, up to RUN_ALL_MAX_CONCURRENT workers.
 * @param {Array<{ client: string, date: string, mode: 'texas'|'speech'|'97155', fix: object }>} jobs
 */
async function startOverlapRunAll(jobs) {
  var listUrl = lastOverlapScanPageUrl;
  if (!listUrl) {
    log('Run all: missing list URL — run Texas overlaps (97155 concurrents) scan again.');
    console.warn('[Run all]', 'missing list URL');
    return;
  }
  var runBtn = document.getElementById('overlap-run-all-btn');
  if (runBtn) runBtn.disabled = true;
  runAllLastTabsCreateMs = 0;
  _runAllFocusActive = true;
  _runAllFocusChain = Promise.resolve();

  function runAllLog(msg) {
    log(msg);
    try {
      console.warn('[Run all]', msg);
    } catch (e) {}
  }

  var tabIdToFixBtn = new Map();
  var rows = [];
  for (var j = 0; j < jobs.length; j++) {
    var job = jobs[j];
    var fixBtn = findFixButtonForRunAllJob(job);
    rows.push({ job: job, btn: fixBtn });
    if (fixBtn) {
      clearOverlapFixLiveProgress(fixBtn);
      setOverlapFixButtonState(fixBtn, 'loading');
      setOverlapFixFailReason(fixBtn, '');
      setOverlapFixLiveProgress(fixBtn, 'Queued');
    } else {
      runAllLog(
        'Run all: no Fix button for ' +
          String(job.client) +
          ' · ' +
          String(job.date) +
          ' (entry ' +
          String(job.fix && job.fix.entryId) +
          ')'
      );
    }
  }

  startRunAllProgressPoll(tabIdToFixBtn);

  var queue = rows.slice();
  var workers = Math.min(RUN_ALL_MAX_CONCURRENT, Math.max(1, queue.length));

  async function workerFn() {
    while (queue.length > 0) {
      var item = queue.shift();
      if (!item) break;
      var job = item.job;
      var fixBtn = item.btn;
      var openUrl = buildRunAllOpenUrl(listUrl, job.fix.entryId, job.mode);
      if (fixBtn) setOverlapFixLiveProgress(fixBtn, 'Creating tab…');
      runAllLog('Run all: creating tab entry=' + job.fix.entryId + ' url=' + String(openUrl).slice(0, 140));
      var tab;
      try {
        tab = await staggeredTabsCreate(openUrl);
      } catch (e) {
        runAllLog('Run all: tab create failed: ' + (e.message || String(e)));
        if (fixBtn) {
          clearOverlapFixLiveProgress(fixBtn);
          setOverlapFixButtonState(fixBtn, 'error');
          setOverlapFixFailReason(fixBtn, 'Could not open tab: ' + (e.message || String(e)));
        }
        continue;
      }
      if (!tab || tab.id == null) {
        runAllLog('Run all: tab create returned no id: ' + JSON.stringify(tab));
        if (fixBtn) {
          clearOverlapFixLiveProgress(fixBtn);
          setOverlapFixButtonState(fixBtn, 'error');
          setOverlapFixFailReason(fixBtn, 'Tab create returned no id (extension bridge).');
        }
        continue;
      }
      var tabId = tab.id;
      tabIdToFixBtn.set(tabId, fixBtn);
      if (fixBtn) setOverlapFixLiveProgress(fixBtn, 'Loading tab ' + tabId + '…');
      try {
        await waitForTabLoadCompleteUnified(tabId, 120000);
      } catch (e) {
        runAllLog('Run all: load failed tab ' + tabId + ': ' + (e.message || String(e)));
        if (fixBtn) {
          clearOverlapFixLiveProgress(fixBtn);
          setOverlapFixButtonState(fixBtn, 'error');
          setOverlapFixFailReason(fixBtn, e.message || String(e));
        }
        tabIdToFixBtn.delete(tabId);
        continue;
      }
      await setTabConcurrenceTitle(tabId, job.client, job.date);
      await writeConcurrenceFixProgress(tabId, 'Starting fix…', 'start', null);
      if (fixBtn) setOverlapFixLiveProgress(fixBtn, 'Running fix…');
      runAllLog('Run all: starting fix entry=' + job.fix.entryId + ' tab=' + tabId);
      var virtualBtn =
        job.mode === '97155-multi'
          ? createVirtualMulti97155FixButton(job.plan, {
              client: job.client,
              date: job.date,
              originalTimes: job.originalTimes || '',
              logSummary: job.logSummary || ''
            })
          : createVirtualOverlapFixButton(job.fix, job.mode === '97155', {
              client: job.client,
              date: job.date,
              originalTimes: job.originalTimes || '',
              logSummary: job.logSummary || ''
            });
      var hiddenEl = document.createElement('div');
      hiddenEl.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;';
      hiddenEl.setAttribute('aria-hidden', 'true');
      document.body.appendChild(hiddenEl);
      var fixOpts = {
        targetTabId: tabId,
        resultEl: hiddenEl,
        progressTabId: tabId,
        skipTimesheetNavigate97155: true,
        isRunAll: true
      };
      try {
        if (job.mode === '97155-multi') {
          await runOverlapFix97155Multi(virtualBtn, fixOpts);
        } else if (job.mode === '97155') {
          await runOverlapFix97155(virtualBtn, fixOpts);
        } else {
          await runOverlapFixSpeech(virtualBtn, fixOpts);
        }
        var outcome = virtualBtn.getAttribute('data-run-all-outcome');
        if (outcome === 'error') {
          var failMsg = virtualBtn.getAttribute('data-run-all-fail') || 'Fix reported an error (see log).';
          runAllLog('Run all: fix error entry=' + job.fix.entryId + ' ' + failMsg);
          if (fixBtn) {
            clearOverlapFixLiveProgress(fixBtn);
            setOverlapFixButtonState(fixBtn, 'error');
            setOverlapFixFailReason(fixBtn, failMsg);
          }
          void writeConcurrenceFixProgress(tabId, failMsg, 'error', failMsg);
        } else {
          runAllLog('Run all: done entry=' + job.fix.entryId);
          if (fixBtn) {
            clearOverlapFixLiveProgress(fixBtn);
            setOverlapFixButtonState(fixBtn, 'success');
            setOverlapFixFailReason(fixBtn, '');
          }
        }
      } catch (err) {
        var msg = (err && err.message) || String(err);
        runAllLog('Run all: fix error entry=' + job.fix.entryId + ' ' + msg);
        if (fixBtn) {
          clearOverlapFixLiveProgress(fixBtn);
          setOverlapFixButtonState(fixBtn, 'error');
          setOverlapFixFailReason(fixBtn, msg);
        }
        void writeConcurrenceFixProgress(tabId, msg, 'error', msg);
      } finally {
        overlapFixRecordClear(tabId);
        tabIdToFixBtn.delete(tabId);
        document.body.removeChild(hiddenEl);
      }
    }
  }

  try {
    await Promise.all(
      Array.from({ length: workers }, function () {
        return workerFn();
      })
    );
  } finally {
    _runAllFocusActive = false;
    stopRunAllProgressPoll();
    if (runBtn) runBtn.disabled = false;
  }
}

/** POST overlap-fix telemetry to POEL (no cookie). Timesheet is not submitted — log on fix complete only. */
const POEL_PROGRAM_LOG_INGEST_URL =
  'https://www.poel.ai/api/ingest/program-logs/7621a158-c39a-4a16-b5af-22e1efb05694/2fe29489-451c-4e94-b2be-de2e9955f982';
const HIDDEN_TALENTS_APP_VERSION = '1.0.3';

/**
 * @returns {{ ok: boolean, status: number, text?: string, error?: string }}
 */
async function postPoelProgramLogIngest(body) {
  console.log('[Hidden Lights] POEL ingest → POST', POEL_PROGRAM_LOG_INGEST_URL);
  console.log('[Hidden Lights] POEL ingest body', body);
  try {
    if (
      typeof window !== 'undefined' &&
      window.SHELL &&
      typeof window.SHELL.ingestProgramLog === 'function'
    ) {
      try {
        var shellTimeoutMs = 20000;
        var ingestPromise = window.SHELL.ingestProgramLog(POEL_PROGRAM_LOG_INGEST_URL, body);
        var timeoutPromise = new Promise(function (resolve) {
          setTimeout(function () {
            resolve({ __timedOut: true });
          }, shellTimeoutMs);
        });
        var shellRes = await Promise.race([ingestPromise, timeoutPromise]);
        if (shellRes && shellRes.__timedOut) {
          console.error(
            '[Hidden Lights] POEL ingest timed out after ' +
              shellTimeoutMs +
              'ms — reload POEL CLIENTS v1.0.10+ (MessageChannel ingest).'
          );
          return { ok: false, status: 0, error: 'POEL shell ingest timed out (reload POEL extension v1.0.10+)' };
        }
        if (!shellRes || typeof shellRes !== 'object') {
          return { ok: false, status: 0, error: 'empty shell response' };
        }
        if (!shellRes.ok) {
          console.warn('[Hidden Lights] POEL ingest failed (shell)', shellRes.status, shellRes.text);
        }
        logPoelIngestServerAck(shellRes.text, 'shell');
        return { ok: !!shellRes.ok, status: shellRes.status || 0, text: shellRes.text || '' };
      } catch (shellErr) {
        var se = shellErr && shellErr.message ? shellErr.message : String(shellErr);
        console.error('[Hidden Lights] POEL ingest shell error:', shellErr);
        return { ok: false, status: 0, error: se };
      }
    }
    const res = await fetch(POEL_PROGRAM_LOG_INGEST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'omit',
      mode: 'cors'
    });
    const text = await res.text().catch(function () {
      return '';
    });
    if (!res.ok) {
      console.warn('[Hidden Lights] POEL ingest failed', res.status, text);
    }
    logPoelIngestServerAck(text, 'direct');
    return { ok: res.ok, status: res.status, text: text };
  } catch (e) {
    const err = e && e.message ? e.message : String(e);
    console.error('[Hidden Lights] POEL ingest network/CORS error:', e);
    return { ok: false, status: 0, error: err };
  }
}

function parsePoelIngestResponseText(text) {
  try {
    var j = JSON.parse(text || '{}');
    if (j && typeof j === 'object') return j;
  } catch (e) {
    /* ignore */
  }
  return null;
}

function logPoelIngestServerAck(text, where) {
  var p = parsePoelIngestResponseText(text);
  if (p && p.id) {
    console.log('[Hidden Lights] POEL ingest recorded id=' + p.id + ' (' + where + ')');
  } else if (text && String(text).trim()) {
    console.log('[Hidden Lights] POEL ingest response (' + where + '):', String(text).slice(0, 500));
  } else {
    console.warn('[Hidden Lights] POEL ingest empty response body (' + where + ')');
  }
}

function overlapFixIngestPayloadFromButton(btn, kind) {
  return {
    kind: kind,
    client: btn.getAttribute('data-client') || '',
    date: btn.getAttribute('data-date') || '',
    originalTimes: btn.getAttribute('data-original-times') || '',
    logSummary: btn.getAttribute('data-log-summary') || '',
    entryId: btn.getAttribute('data-entry-id') || '',
    overlapType: btn.getAttribute('data-overlap-type') || '',
    timeFrom: btn.getAttribute('data-time-from') || '',
    timeTo: btn.getAttribute('data-time-to') || '',
    overlap: btn.getAttribute('data-overlap') || '',
    overlapFrom: btn.getAttribute('data-overlap-from') || '',
    overlapTo: btn.getAttribute('data-overlap-to') || '',
    part3From: btn.getAttribute('data-part3-from') || '',
    part3To: btn.getAttribute('data-part3-to') || ''
  };
}

function overlapFixIngestChangeSummary(detail, variant, kind) {
  var who = (detail.client || '').trim() ? detail.client.trim() + ' · ' : '';
  var orig = (detail.originalTimes || '').trim();
  var origBit = orig ? 'List times: ' + orig + '. ' : '';
  var p1 = detail.timeFrom + '–' + detail.timeTo;
  var ov = detail.overlapFrom + '–' + detail.overlapTo;
  if (variant === '2-line') {
    return (
      who +
      origBit +
      kind +
      ' (' +
      (detail.overlapType || '?') +
      '): Part 1 trimmed to ' +
      p1 +
      '; line 2 nonbillable ' +
      ov +
      '. Not submitted.'
    );
  }
  var tail = detail.part3From + '–' + detail.part3To;
  return (
    who +
    origBit +
    kind +
    ' (middle): Part 1 ' +
    p1 +
    '; line 2 nonbillable ' +
    ov +
    '; line 3 billable ' +
    tail +
    (kind === '97155' ? '; note linked; client+provider signatures.' : '; note linked.') +
    ' Not submitted.'
  );
}

function overlapFixVariantFromButton(btn) {
  return (btn.getAttribute('data-overlap-type') || 'middle') === 'middle' ? '3-line' : '2-line';
}

function logPoelIngestOutcome(r) {
  try {
    if (typeof log !== 'function') return;
    if (r.ok) {
      var parsed = parsePoelIngestResponseText(r.text);
      var idPart = parsed && parsed.id ? ' ingestId=' + parsed.id : '';
      log('POEL program log OK (HTTP ' + r.status + ')' + idPart);
    } else {
      log(
        'POEL program log failed (HTTP ' +
          (r.status || 0) +
          '): ' +
          (r.error || r.text || 'unknown').slice(0, 240)
      );
    }
  } catch (e) {
    /* ignore */
  }
}

/**
 * Log overlap fix completion to POEL without submitting the timesheet.
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
async function sendPoelOverlapFixCompleteIngest(btn, kind, variant, awaitIngest) {
  var detail = overlapFixIngestPayloadFromButton(btn, kind);
  var changeSummary = overlapFixIngestChangeSummary(detail, variant, kind);
  var clientLabel = (detail.client || '').trim() || 'unknown client';
  var summaryLine = (detail.logSummary || '').trim();
  var preview =
    summaryLine ||
    kind + ' · ' + clientLabel + (detail.entryId ? ' · entry ' + detail.entryId : '') + ' · ' + variant;
  var body = {
    level: 'info',
    message: preview,
    payload: {
      source: 'hidden-lights-fixer',
      appVersion: HIDDEN_TALENTS_APP_VERSION,
      submitted: false,
      kind: kind,
      variant: variant,
      client: clientLabel,
      date: (detail.date || '').trim(),
      originalTimes: (detail.originalTimes || '').trim(),
      logSummary: summaryLine,
      changeSummary: changeSummary,
      fix: detail
    }
  };
  try {
    log('Sending POEL program log (overlap fix complete, not submitted)…');
  } catch (e0) {
    /* ignore */
  }
  if (awaitIngest) {
    var rAwait = await postPoelProgramLogIngest(body);
    logPoelIngestOutcome(rAwait);
    return { ok: !!rAwait.ok, error: rAwait.ok ? undefined : rAwait.error || rAwait.text || 'ingest failed' };
  }
  postPoelProgramLogIngest(body).then(function (r) {
    logPoelIngestOutcome(r);
  });
  return { ok: true };
}

/**
 * Mark overlap fix success and POST POEL ingest (no timesheet submit).
 * @returns {Promise<boolean>}
 */
async function completeOverlapFixWithIngest(btn, kind, variant, fo, resultEl, successHtml, logLine) {
  var progressCtx = fo
    ? { progressTabId: fo.progressTabId, panelFixBtn: fo.panelFixBtn }
    : null;
  if (progressCtx) {
    await writeConcurrenceFixProgress(progressCtx.progressTabId, 'Logging fix…', 'ingest', null);
  }
  var ingestRes = await sendPoelOverlapFixCompleteIngest(btn, kind, variant, !!(fo && fo.isRunAll));
  if (ingestRes && !ingestRes.ok && fo && fo.isRunAll) {
    if (resultEl) resultEl.innerHTML = '';
    setOverlapFixButtonState(btn, 'error');
    if (fo.panelFixBtn) setOverlapFixButtonState(fo.panelFixBtn, 'error');
    var failMsg = ingestRes.error || 'POEL program log failed.';
    setOverlapFixFailReason(btn, failMsg);
    if (fo.panelFixBtn) setOverlapFixFailReason(fo.panelFixBtn, failMsg);
    log('Run all: ingest failed — ' + failMsg);
    return false;
  }
  if (progressCtx && progressCtx.progressTabId != null) {
    await writeConcurrenceFixProgress(progressCtx.progressTabId, 'Done', 'done', null);
  }
  setOverlapFixButtonState(btn, 'success');
  if (fo && fo.panelFixBtn) {
    clearOverlapFixLiveProgress(fo.panelFixBtn);
    setOverlapFixButtonState(fo.panelFixBtn, 'success');
    setOverlapFixFailReason(fo.panelFixBtn, '');
  }
  setOverlapFixFailReason(btn, '');
  if (resultEl && successHtml) resultEl.innerHTML = successHtml;
  if (logLine) log(logLine);
  return true;
}

/** Timings for speech-overlap Fix: same timesheet, 2–3 service lines (see JSDoc on `document.body` overlap listener). */
/** Short delay between discrete steps (navigation, separate injects). */
const OVERLAP_FIX_STEP_DELAY_MS = 350;

/**
 * Poll UI readiness every this many ms instead of long fixed sleeps (overlap fix).
 * Each phase stops as soon as the check passes, up to OVERLAP_FIX_UI_POLL_MAX_MS.
 */
const OVERLAP_FIX_UI_POLL_MS = 500;
const OVERLAP_FIX_UI_POLL_MAX_MS = 12000;

/** Wait after entering times on any line so the value has time to settle before read-back verify. */
const OVERLAP_FIX_AFTER_ENTER_TIMES_MS = 1200;
const OVERLAP_FIX_AFTER_FIRST_END_TIME_MS = OVERLAP_FIX_AFTER_ENTER_TIMES_MS;

/** Max attempts to enter times and verify From/To took (retry on verify failure). All lines. */
const OVERLAP_FIX_TIMES_VERIFY_ATTEMPTS = 3;
const OVERLAP_FIX_PART1_VERIFY_ATTEMPTS = OVERLAP_FIX_TIMES_VERIFY_ATTEMPTS;
/** Consecutive matching reads before we trust the UI (guards transient values that revert). */
const TIMES_VERIFY_STABLE_READS = 3;
const TIMES_VERIFY_STABLE_POLL_MS = 500;
const TIMES_VERIFY_STABLE_MAX_MS = 5500;
const PART1_VERIFY_STABLE_READS = TIMES_VERIFY_STABLE_READS;
const PART1_VERIFY_STABLE_POLL_MS = TIMES_VERIFY_STABLE_POLL_MS;
const PART1_VERIFY_STABLE_MAX_MS = TIMES_VERIFY_STABLE_MAX_MS;

/** inject-enter-times.js polls inputs up to 8s; From → To → refocus From to commit To. */
const ENTER_TIMES_RESULT_POLL_STEP_MS = 400;
const ENTER_TIMES_RESULT_POLL_MAX_MS = 9000;
const ENTER_TIMES_PART3_POLL_MAX_MS = 9500;

/**
 * inject-set-date-of-service.js types MM/DD/YYYY (~10 chars + delays), waits for the picker,
 * then polls for the day cell — finish before reading window.__setDateOfServiceResult.
 */
const SET_DATE_INJECT_SETTLE_MS = 3200;

/** Brief settle after payor click before place-of-service inject (MUI repopulates dependent dropdowns). */
const OVERLAP_FIX_AFTER_MASTER_MS = 1100;

/**
 * Speech line 3: fee schedule menu and Master/Associate payor tier can appear one after the other (either order).
 * Allow enough time for both to mount and be clicked.
 */
const OVERLAP_FIX_FEE_PAYOR_COMBINED_MAX_MS = Math.max(OVERLAP_FIX_UI_POLL_MAX_MS * 2, 24000);

/** Wait between note steps (existing note, click note by date/name, close note) - more loading. */
const OVERLAP_FIX_NOTE_STEP_MS = 800;

/**
 * Poll until inject-select-existing-session-note-flow sets __selectExistingSessionNoteFlowResult.
 * Match inject MAX_MS (2.5 min) and 3s poll interval.
 */
const OVERLAP_FIX_BACKUP_NOTE_POLL_MAX_MS = 150000;
const OVERLAP_FIX_BACKUP_NOTE_POLL_STEP_MS = 3000;

/**
 * Retry wrapper around execScript.
 * Catches transient errors (403, network hiccups) and retries up to maxRetries times.
 */
const EXEC_SCRIPT_MAX_RETRIES = 3;
const EXEC_SCRIPT_RETRY_DELAY_MS = 600;

const _chromeScripting = chrome.scripting;

async function execScript(opts) {
  let lastErr;
  for (let attempt = 0; attempt <= EXEC_SCRIPT_MAX_RETRIES; attempt++) {
    try {
      return await _chromeScripting.executeScript(opts);
    } catch (err) {
      lastErr = err;
      const msg = (err && err.message) || '';
      const isTransient = /Script failed:\s*\d{3}/i.test(msg) || /fetch|network|timeout/i.test(msg);
      if (!isTransient || attempt === EXEC_SCRIPT_MAX_RETRIES) throw err;
      console.warn('[execScript] attempt ' + (attempt + 1) + ' failed (' + msg + '), retrying in ' + EXEC_SCRIPT_RETRY_DELAY_MS + 'ms…');
      await new Promise((r) => setTimeout(r, EXEC_SCRIPT_RETRY_DELAY_MS));
    }
  }
  throw lastErr;
}

/** Scoped service-line tab count (inject-service-line-tab-count.js). */
async function fetchServiceLineTabCount(tabId) {
  await execScript({
    target: { tabId },
    files: ['inject-service-line-tab-count.js']
  });
  const r = await execScript({
    target: { tabId },
    func: () => window.__serviceLineTabCountResult
  });
  return r && r[0] && r[0].result;
}

/** Poll until at least one service-line tab exists or timeout (timesheet still loading). */
async function pollServiceLineTabCountUntilPositive(tabId, maxWaitMs = 5000) {
  const step = 300;
  for (let elapsed = 0; elapsed < maxWaitMs; elapsed += step) {
    const res = await fetchServiceLineTabCount(tabId);
    const c = res && typeof res.count === 'number' ? res.count : 0;
    if (c > 0) return res;
    await new Promise((r) => setTimeout(r, step));
  }
  return fetchServiceLineTabCount(tabId);
}

/**
 * Call tryOnce() every pollMs until it returns true or maxMs elapses (overlap fix).
 * First attempt runs immediately.
 */
async function overlapUiPollTry(options) {
  const maxMs = options.maxMs != null ? options.maxMs : OVERLAP_FIX_UI_POLL_MAX_MS;
  const pollMs = options.pollMs != null ? options.pollMs : OVERLAP_FIX_UI_POLL_MS;
  const tryOnce = options.tryOnce;
  const resultEl = options.resultEl;
  const waitingHtml = options.waitingHtml;
  const deadline = Date.now() + maxMs;
  let n = 0;
  while (Date.now() < deadline) {
    n += 1;
    if (resultEl && waitingHtml) {
      resultEl.innerHTML =
        '<p>' +
        waitingHtml +
        (n > 1 ? ' <span style="opacity:0.85">· check ' + n + '</span>' : '') +
        '</p>';
    }
    if (await tryOnce()) return true;
    const wait = Math.min(pollMs, Math.max(0, deadline - Date.now()));
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  }
  return false;
}

async function probeServiceCodesLinkReady(tabId) {
  const r = await execScript({
    target: { tabId },
    func: () => {
      const links = document.querySelectorAll('a');
      for (let i = 0; i < links.length; i++) {
        const t = (links[i].textContent || '').trim();
        if (/Service\s*Codes\s*\(\d+\)/i.test(t)) return true;
        if (t.toLowerCase().indexOf('service codes') !== -1) return true;
      }
      return false;
    }
  });
  return !!(r && r[0] && r[0].result);
}


async function probeBillable97153Ready(tabId) {
  const r = await execScript({
    target: { tabId },
    func: () => {
      function rowMatchesTexasBillable(text) {
        const t = (text || '').toLowerCase();
        return (
          t.indexOf('97153') !== -1 &&
          t.indexOf('direct care') !== -1 &&
          (t.indexOf('rbt') !== -1 || t.indexOf('/bt') !== -1)
        );
      }
      const selectors = [
        '.md-tab-content ul.tab-pane.active',
        '.md-tab-content ul',
        'ul.jss20512',
        'ul.tab-pane.active'
      ];
      for (let i = 0; i < selectors.length; i++) {
        const ul = document.querySelector(selectors[i]);
        if (!ul) continue;
        const items = ul.querySelectorAll('li > a');
        if (items.length === 0) continue;
        for (let j = 0; j < items.length; j++) {
          const txt = items[j].textContent || '';
          if (rowMatchesTexasBillable(txt)) return true;
        }
      }
      const uls = document.querySelectorAll('.md-tab-content ul');
      for (let k = 0; k < uls.length; k++) {
        const items = uls[k].querySelectorAll('li > a');
        for (let j = 0; j < items.length; j++) {
          const txt = items[j].textContent || '';
          if (rowMatchesTexasBillable(txt)) return true;
        }
      }
      return false;
    }
  });
  return !!(r && r[0] && r[0].result);
}

/** Billing list “walk all pages”: max pages (safety), overlay wait timeout, poll interval. */
const BILLING_PAGE_WALK_MAX_PAGES = 60;
const BILLING_PAGE_WALK_LOAD_TIMEOUT_MS = 120000;
const BILLING_PAGE_WALK_POLL_MS = 350;
/** After setting billing hash, wait before clicking MUI Apply (filters UI). */
const BILLING_HASH_BEFORE_APPLY_MS = 400;
/** Min time between successive Next clicks (after grid has settled from previous Next). */
const BILLING_NEXT_GAP_MS = 3000;
/**
 * Delay inside the page before dispatching the synthetic Next click (matches console snippet).
 * Console “felt” better because it never fired in the same tick as inject; 0 = immediate.
 */
const BILLING_NEXT_GENTLE_MS = 50;

/**
 * Default payor inject match for Manual “Select payor” and fallback only.
 * Auto overlap fix (middle) uses labels via inferPayorMatchFromProviderLabels → "master" | "associate".
 */
const PAYOR_OPTION_MATCH = 'master';

/**
 * Log the full inject result to the panel (POEL often returns the whole object; older remote scripts omit `debug`).
 * Always logs something so you can confirm script version / tier fields vs a stale server file.
 */
function logRemoteInjectDebug(logPrefix, pick) {
  var pre = logPrefix || 'Remote inject';
  if (pick == null) {
    log(pre + ': result is null or undefined (RUN_SCRIPT did not return a payload).');
    return;
  }
  var line;
  try {
    line = JSON.stringify(pick);
  } catch (e) {
    line = String(pick);
  }
  if (line.length > 9000) line = line.slice(0, 9000) + '…[truncated]';
  log(pre + ': ' + line);
  if (!pick.debug) {
    log(
      pre +
        ': note — no `debug` property (tier visibility / scriptBuild). Your hosted script is probably an older file; deploy the copy from POEL CLIENTS/remote-scripts-source/ for this repo.'
    );
  }
}

/**
 * Read payor inject result from the page. Tries MAIN then default world — POEL may inject MAIN-only while
 * a single-world read misses, yielding undefined and a useless "no success" loop.
 */
async function readSelectPayorOptionResult(tabId) {
  try {
    const r = await execScript({
      target: { tabId },
      world: 'MAIN',
      func: () => window.__selectPayorOptionResult
    });
    const v = r && r[0] && r[0].result;
    if (v !== undefined && v !== null) return v;
  } catch (e) {
    /* MAIN disallowed or unavailable */
  }
  const r2 = await execScript({
    target: { tabId },
    func: () => window.__selectPayorOptionResult
  });
  return r2 && r2[0] && r2[0].result;
}

/**
 * Education / payor tier cards: DOM logic is not shipped in the core package.
 * Host `inject-select-payor-option` via POEL / private repo (see POEL CLIENTS/remote-scripts-source/).
 */
async function runInjectPayorSelect(tabId) {
  if (typeof window.SHELL !== 'undefined' && window.SHELL.runScript) {
    var out = await window.SHELL.runScript('inject-select-payor-option');
    if (out !== undefined && out != null) {
      if (!out.debug) {
        var fromPageP = await readSelectPayorOptionResult(tabId);
        if (fromPageP && fromPageP.debug) return fromPageP;
      }
      return out;
    }
    return readSelectPayorOptionResult(tabId);
  }
  await execScript({
    target: { tabId: tabId },
    func: () => {
      window.__selectPayorOptionResult = {
        success: true,
        skipped: true,
        clicked: 0,
        debug: { shippedStub: true }
      };
    }
  });
  await new Promise((r) => setTimeout(r, 50));
  return readSelectPayorOptionResult(tabId);
}

/**
 * Read fee schedule inject result from the page (MAIN then default world — same pattern as payor).
 */
async function readSelectFeeScheduleRoleResult(tabId) {
  try {
    const r = await execScript({
      target: { tabId },
      world: 'MAIN',
      func: () => window.__selectFeeScheduleRoleResult
    });
    const v = r && r[0] && r[0].result;
    if (v !== undefined && v !== null) return v;
  } catch (e) {
    /* MAIN disallowed or unavailable */
  }
  const r2 = await execScript({
    target: { tabId },
    func: () => window.__selectFeeScheduleRoleResult
  });
  return r2 && r2[0] && r2[0].result;
}

/**
 * Fee schedule line-3 automation: DOM logic is not shipped in the core extension.
 * POEL / private repo serves `inject-select-fee-schedule-role` (see POEL CLIENTS/remote-scripts-source/).
 * Unpacked-only: inline stub skips the step so overlap fix can continue (fee row must be clicked manually).
 */
async function runInjectFeeScheduleRoleSelect(tabId) {
  if (typeof window.SHELL !== 'undefined' && window.SHELL.runScript) {
    var out = await window.SHELL.runScript('inject-select-fee-schedule-role');
    if (out !== undefined && out != null) {
      if (!out.debug) {
        var fromPage = await readSelectFeeScheduleRoleResult(tabId);
        if (fromPage && fromPage.debug) return fromPage;
      }
      return out;
    }
    return readSelectFeeScheduleRoleResult(tabId);
  }
  await execScript({
    target: { tabId: tabId },
    func: () => {
      window.__selectFeeScheduleRoleResult = {
        success: true,
        skipped: true,
        clicked: 0,
        debug: { shippedStub: true }
      };
    }
  });
  await new Promise((r) => setTimeout(r, 50));
  return readSelectFeeScheduleRoleResult(tabId);
}

async function readSelectVisitLocationResult(tabId) {
  try {
    const r = await execScript({
      target: { tabId },
      world: 'MAIN',
      func: () => window.__selectVisitLocationResult
    });
    const v = r && r[0] && r[0].result;
    if (v !== undefined && v !== null) return v;
  } catch (e) {
    /* MAIN disallowed */
  }
  const r2 = await execScript({
    target: { tabId },
    func: () => window.__selectVisitLocationResult
  });
  return r2 && r2[0] && r2[0].result;
}

/**
 * Highmark-style HOME / OFFICE / OTHER cards after 97153 (optional — skips if not on screen).
 * POEL: RUN_SCRIPT must return __selectVisitLocationResult (POEL 1.0.7+ defaults).
 */
async function runInjectVisitLocationSelect(tabId) {
  if (typeof window.SHELL !== 'undefined' && window.SHELL.runScript) {
    var out = await window.SHELL.runScript('inject-select-visit-location-cards');
    if (out !== undefined && out !== null) return out;
    return readSelectVisitLocationResult(tabId);
  }
  await execScript({
    target: { tabId: tabId },
    files: ['inject-' + 'select-visit-location-cards.js']
  });
  await new Promise((r) => setTimeout(r, 250));
  return readSelectVisitLocationResult(tabId);
}

/**
 * Map line-1 place-of-service label to visit-location cards (HOME / OFFICE / OTHER).
 * Default OTHER unless POS text clearly reads as home or office (from the timesheet field).
 */
function inferVisitLocationMatchFromPlaceOfService(posText) {
  var t = (posText || '').trim().toLowerCase();
  if (!t) return 'other';

  var homeSpecific =
    /\bhome\b/.test(t) || /12\s*-\s*home/.test(t) || /^12\s*-/.test(t);
  var officeSpecific =
    /\boffice\b/.test(t) || /11\s*-\s*office/.test(t) || /^11\s*-/.test(t);

  if (homeSpecific && !officeSpecific) return 'home';
  if (officeSpecific && !homeSpecific) return 'office';
  return 'other';
}

/** Full JSON of payor result for troubleshooting (panel log). */
function logPayorResultPayload(logPrefix, attemptLabel, pick) {
  var prefix = logPrefix || 'Overlap fix';
  var lab = attemptLabel ? String(attemptLabel) : '';
  var tag = prefix + ': payor payload ' + lab + ' ';
  if (pick === undefined) {
    log(
      tag +
        'UNDEFINED — inject result missing (POEL: reload extension with RUN_SCRIPT payor return fix; unpacked: check inject).'
    );
    return;
  }
  if (pick === null) {
    log(
      tag +
        'NULL — page read returned null. Use POEL 1.0.5+ (or set poelShell.runScriptReturnGlobal in project config).'
    );
    return;
  }
  var s;
  try {
    s = JSON.stringify(pick);
  } catch (e) {
    s = String(pick);
  }
  if (s.length > 3500) s = s.slice(0, 3500) + '…[truncated]';
  log(tag + s);
}

function logPayorSelectDebug(payorPick, attemptLabel, logPrefix) {
  var prefix = logPrefix || 'Overlap fix';
  var label = attemptLabel ? String(attemptLabel) : '';
  if (payorPick == null) {
    log(
      prefix +
        ': payor ' +
        label +
        ' — no result (null/undefined). POEL: ensure extension returns payor payload from RUN_SCRIPT; see logPayorResultPayload line above.'
    );
    return;
  }
  if (!payorPick.debug) {
    log(prefix + ': payor ' + label + (payorPick.error ? ' — ' + payorPick.error : ' (no debug payload)'));
    return;
  }
  if (payorPick.skipped) {
    log(prefix + ': payor ' + label + ' skipped — no tier / education UI visible');
    return;
  }
  var d = payorPick.debug;
  var legacy =
    d.hadLegacyContainerClass != null ? d.hadLegacyContainerClass : d.hadLegacyJss20878;
  log(
    prefix +
      ': payor ' +
      label +
      ' phase=' +
      (d.phase != null ? d.phase : '—') +
      ' hadContainer=' +
      (d.hadResolvedContainer != null ? d.hadResolvedContainer : '—') +
      ' ibcHeader=' +
      (d.hadIbcHeader != null ? d.hadIbcHeader : '—') +
      ' legacyJss=' +
      (legacy != null ? legacy : '—') +
      ' tierLikeCount=' +
      (d.tierLikeSnippets ? d.tierLikeSnippets.length : 0)
  );
  if (d.containerSample) log(prefix + ': payor container sample: ' + String(d.containerSample).slice(0, 450));
  if (d.chosenSnippet) log(prefix + ': payor chosen snippet: ' + d.chosenSnippet);
  if (d.tierLikeSnippets && d.tierLikeSnippets.length)
    log(prefix + ': payor tier-like texts: ' + JSON.stringify(d.tierLikeSnippets));
  if (typeof d.radioCount === 'number')
    log(prefix + ': payor radio input count on page=' + d.radioCount);
  if (d.radioEducationSnippets && d.radioEducationSnippets.length)
    log(prefix + ': payor radio/education labels: ' + JSON.stringify(d.radioEducationSnippets));
}

/** Match string for Place of service dropdown (e.g. "office" for 11 - Office). Change this to select a different option. */
const PLACE_OF_SERVICE_MATCH = 'office';

/** Match string for Service address dropdown (e.g. "30 carn" for 30 Carnoustie Way...). Loose text matching. */
const SERVICE_ADDRESS_MATCH = '30 carn';

/** Date and name to match when clicking a note row (e.g. "03/17/2026" and "Molly Egan"). Easy to change. */
const NOTE_MATCH_DATE = '03/17/2026';
const NOTE_MATCH_NAME = 'Molly Egan';
/** Manual "Selected backup notes": dialog row must contain this substring (see inject-select-existing-session-note-flow). */
const BACKUP_NOTE_ROW_SNIPPET = '03/25/2026 Haley Kline';

/** Convert minutes since midnight to "HH:MM AM/PM" for timesheet inputs. */
function minutesToTimeString(minutes) {
  if (minutes == null || typeof minutes !== 'number') return '';
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  const isPm = h >= 12;
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const pad = (n) => String(n).padStart(2, '0');
  return pad(h12) + ':' + pad(m) + ' ' + (isPm ? 'PM' : 'AM');
}

/** Normalize time string for comparison (e.g. "02:00 PM" and "2:00 PM" match). */
function normalizeTimeForCompare(s) {
  if (!s || typeof s !== 'string') return '';
  return s
    .replace(/[\u200b\u200c\u200d\ufeff]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/\s*([ap])\.?\s*m\.?/i, ' $1m')
    .replace(/^0(\d:)/, '$1')
    .trim();
}

/** Parse "HH:MM AM/PM" to minutes since midnight; null if unparseable. */
function parseTimeStringToMinutes(s) {
  if (!s || typeof s !== 'string') return null;
  const t = normalizeTimeForCompare(s);
  const m = t.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  if (min < 0 || min > 59 || h < 1 || h > 12) return null;
  if (m[3] === 'pm' && h < 12) h += 12;
  if (m[3] === 'am' && h === 12) h = 0;
  return h * 60 + min;
}

/** Click a service-line tab by index (0 = first line). */
async function clickServiceLineTabOnTab(tabId, index) {
  await execScript({
    target: { tabId: tabId },
    func: (idx) => {
      window.__serviceLineTabIndex = idx;
    },
    args: [index]
  });
  await execScript({ target: { tabId: tabId }, files: ['inject-click-service-line-tab.js'] });
  const res = await execScript({
    target: { tabId: tabId },
    func: () => window.__clickServiceLineTabResult
  });
  return res && res[0] && res[0].result;
}

/** Ensure the requested service line tab is active before reading or entering times. */
async function ensureServiceLineTabActive(tabId, index) {
  const tabCountRes = await fetchServiceLineTabCount(tabId);
  const count = tabCountRes && typeof tabCountRes.count === 'number' ? tabCountRes.count : 0;
  if (count <= 1) return { ok: true, alreadySelected: true };
  const clickRes = await clickServiceLineTabOnTab(tabId, index);
  if (!clickRes || !clickRes.success) {
    return {
      ok: false,
      error: (clickRes && clickRes.error) || 'Could not select service line ' + (index + 1) + '.'
    };
  }
  // Only wait when we actually switched tabs — re-click settle was wiping Time From/To mid-poll.
  if (!clickRes.alreadySelected) {
    await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));
  }
  return { ok: true, alreadySelected: !!clickRes.alreadySelected };
}

/** Read current Time From / To on the active service line. */
async function readTimeWorkedOnTab(tabId) {
  await execScript({ target: { tabId: tabId }, files: ['inject-read-time-worked.js'] });
  const res = await execScript({
    target: { tabId: tabId },
    func: () => window.__readTimeWorkedResult
  });
  return res && res[0] && res[0].result;
}

function part1TimesMatchExpected(readResult, timeFrom, timeTo) {
  if (!readResult || readResult.error) return false;
  if (readResult.from == null || readResult.to == null) return false;
  const expFrom = parseTimeStringToMinutes(timeFrom);
  const expTo = parseTimeStringToMinutes(timeTo);
  const gotFrom = parseTimeStringToMinutes(readResult.from);
  const gotTo = parseTimeStringToMinutes(readResult.to);
  if (expFrom != null && expTo != null && gotFrom != null && gotTo != null) {
    return expFrom === gotFrom && expTo === gotTo;
  }
  return (
    normalizeTimeForCompare(readResult.from) === normalizeTimeForCompare(timeFrom) &&
    normalizeTimeForCompare(readResult.to) === normalizeTimeForCompare(timeTo)
  );
}

function formatPart1TimesMismatch(readResult, timeFrom, timeTo) {
  if (!readResult || readResult.error) {
    return (
      'expected ' +
      timeFrom +
      ' – ' +
      timeTo +
      ', could not read times (' +
      (readResult && readResult.error ? readResult.error : 'no result') +
      ')'
    );
  }
  return (
    'expected ' +
    timeFrom +
    ' – ' +
    timeTo +
    ', got ' +
    (readResult.from || '(empty)') +
    ' – ' +
    (readResult.to || '(empty)')
  );
}

/**
 * Poll until Time From/To read back the expected values on consecutive reads (guards against
 * transient DOM values that revert after async validation).
 * Selects the service-line tab once up front — re-selecting every poll caused MUI to flicker
 * and produced false "times are wrong" errors where expected === got on the last read.
 */
async function pollTimeWorkedUntilMatch(tabId, timeFrom, timeTo, opts) {
  const options = opts || {};
  const lineIndex = options.lineIndex != null ? options.lineIndex : 0;
  const maxMs = options.maxMs != null ? options.maxMs : TIMES_VERIFY_STABLE_MAX_MS;
  const pollMs = options.pollMs != null ? options.pollMs : TIMES_VERIFY_STABLE_POLL_MS;
  const requiredStable =
    options.requiredStable != null ? options.requiredStable : TIMES_VERIFY_STABLE_READS;
  let stableCount = 0;
  let lastRead = null;
  const tabPick = await ensureServiceLineTabActive(tabId, lineIndex);
  if (!tabPick.ok) {
    return { ok: false, read: lastRead, error: tabPick.error };
  }
  const deadline = Date.now() + maxMs;
  while (Date.now() < deadline) {
    lastRead = await readTimeWorkedOnTab(tabId);
    if (part1TimesMatchExpected(lastRead, timeFrom, timeTo)) {
      stableCount += 1;
      if (stableCount >= requiredStable) {
        return { ok: true, read: lastRead };
      }
    } else {
      stableCount = 0;
    }
    await new Promise((r) => setTimeout(r, pollMs));
  }
  // Last chance: values often match after flicker settles. Confirm with one delayed re-read
  // so we do not fail with "expected X, got X".
  if (part1TimesMatchExpected(lastRead, timeFrom, timeTo)) {
    await new Promise((r) => setTimeout(r, pollMs));
    const confirm = await readTimeWorkedOnTab(tabId);
    if (part1TimesMatchExpected(confirm, timeFrom, timeTo)) {
      return { ok: true, read: confirm, recoveredAfterFlicker: true };
    }
    lastRead = confirm || lastRead;
  }
  return { ok: false, read: lastRead };
}

/**
 * Enter times on a service line with retries until From/To read back correctly on that line.
 * Selects the service-line tab before every read and every enter attempt.
 * @returns {Promise<{ ok: true } | { ok: false, message: string }>}
 */
async function enterAndVerifyTimesOnLine(tabId, lineIndex, timeFrom, timeTo, resultEl, logPrefix, opts) {
  const options = opts || {};
  const lineLabel = options.lineLabel || 'Line ' + (lineIndex + 1);
  const stepLabel = options.stepLabel || lineLabel;
  const pollMaxMs =
    options.pollMaxMs != null ? options.pollMaxMs : ENTER_TIMES_RESULT_POLL_MAX_MS;
  const manageFocus = options.manageFocus !== false;
  let releaseFocus = function () {};
  if (manageFocus) {
    releaseFocus = await focusTargetTabForTimesheetUi(tabId);
  }
  try {
    const tabPick = await ensureServiceLineTabActive(tabId, lineIndex);
    if (!tabPick.ok) {
      return { ok: false, message: tabPick.error || 'Could not select ' + lineLabel + '.' };
    }

    resultEl.innerHTML = '<p>Checking ' + lineLabel + ' times…</p>';
    let stable = await pollTimeWorkedUntilMatch(tabId, timeFrom, timeTo, { lineIndex: lineIndex });
    if (stable.ok) {
      resultEl.innerHTML = '<p>' + lineLabel + ' already shows target times — no change needed.</p>';
      log(
        logPrefix +
          ': ' +
          lineLabel +
          ' skip enter-times (stable ' +
          stable.read.from +
          ' – ' +
          stable.read.to +
          ')'
      );
      return { ok: true };
    }

    let lastRead = stable.read;
    for (let attempt = 1; attempt <= OVERLAP_FIX_TIMES_VERIFY_ATTEMPTS; attempt++) {
      resultEl.innerHTML =
        '<p>Setting ' +
        lineLabel +
        ' times' +
        (attempt > 1
          ? ' (retry ' + attempt + ' of ' + OVERLAP_FIX_TIMES_VERIFY_ATTEMPTS + ')...'
          : '...') +
        '</p>';
      await ensureServiceLineTabActive(tabId, lineIndex);
      await primeEnterTimesExplicit(tabId, timeFrom, timeTo);
      await execScript({ target: { tabId: tabId }, files: ['inject-enter-times.js'] });
      const data = await pollEnterTimesResult(tabId, pollMaxMs);
      if (!data || !data.success) {
        const errMsg = messageForEnterTimesStepFailure(data, stepLabel);
        return { ok: false, message: errMsg };
      }
      log(
        logPrefix +
          ': ' +
          lineLabel +
          ' set to ' +
          timeFrom +
          ' – ' +
          timeTo +
          (attempt > 1 ? ' (attempt ' + attempt + ')' : '')
      );
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_AFTER_ENTER_TIMES_MS));
      resultEl.innerHTML = '<p>Verifying ' + lineLabel + ' times (From and To)...</p>';
      stable = await pollTimeWorkedUntilMatch(tabId, timeFrom, timeTo, { lineIndex: lineIndex });
      lastRead = stable.read || lastRead;
      if (stable.ok) {
        log(logPrefix + ': ' + lineLabel + ' times verified: ' + stable.read.from + ' – ' + stable.read.to);
        return { ok: true };
      }
      log(
        logPrefix +
          ': ' +
          lineLabel +
          ' verify failed – ' +
          formatPart1TimesMismatch(lastRead, timeFrom, timeTo) +
          (attempt < OVERLAP_FIX_TIMES_VERIFY_ATTEMPTS ? ', retrying...' : '')
      );
      if (attempt < OVERLAP_FIX_TIMES_VERIFY_ATTEMPTS) {
        await new Promise((r) => setTimeout(r, 600));
      }
    }
    return {
      ok: false,
      message: lineLabel + ' times did not take. ' + formatPart1TimesMismatch(lastRead, timeFrom, timeTo) + '.'
    };
  } finally {
    releaseFocus();
  }
}

/** Part 1 wrapper — line index 0. */
async function enterAndVerifyPart1Times(tabId, timeFrom, timeTo, resultEl, logPrefix) {
  return enterAndVerifyTimesOnLine(tabId, 0, timeFrom, timeTo, resultEl, logPrefix, {
    lineLabel: 'Part 1',
    stepLabel: 'Part 1'
  });
}

/**
 * Assert From/To on a service line (stable consecutive reads). Does not enter times.
 * @returns {Promise<{ ok: true } | { ok: false, message: string }>}
 */
async function assertTimesOnLine(tabId, lineIndex, timeFrom, timeTo, logPrefix, opts) {
  const options = opts || {};
  const lineLabel = options.lineLabel || 'Line ' + (lineIndex + 1);
  const manageFocus = options.manageFocus !== false;
  let releaseFocus = function () {};
  if (manageFocus) {
    releaseFocus = await focusTargetTabForTimesheetUi(tabId);
  }
  try {
    const tabPick = await ensureServiceLineTabActive(tabId, lineIndex);
    if (!tabPick.ok) {
      return { ok: false, message: tabPick.error || 'Could not select ' + lineLabel + '.' };
    }
    const stable = await pollTimeWorkedUntilMatch(tabId, timeFrom, timeTo, {
      lineIndex: lineIndex,
      maxMs: options.maxMs != null ? options.maxMs : TIMES_VERIFY_STABLE_MAX_MS + 1000
    });
    if (!stable.ok) {
      const matchedOnce = part1TimesMatchExpected(stable.read, timeFrom, timeTo);
      return {
        ok: false,
        message: matchedOnce
          ? lineLabel +
            ' times matched expected values but did not stay stable long enough to trust. ' +
            formatPart1TimesMismatch(stable.read, timeFrom, timeTo) +
            '.'
          : lineLabel +
            ' times are wrong. ' +
            formatPart1TimesMismatch(stable.read, timeFrom, timeTo) +
            '.'
      };
    }
    log(
      logPrefix +
        ': ' +
        lineLabel +
        ' times confirmed — ' +
        stable.read.from +
        ' – ' +
        stable.read.to +
        (stable.recoveredAfterFlicker ? ' (settled after flicker)' : '')
    );
    return { ok: true };
  } finally {
    releaseFocus();
  }
}

/** Re-read line 1 From/To immediately before starting line 2. */
async function assertPart1TimesBeforeLine2(tabId, timeFrom, timeTo, logPrefix, opts) {
  return assertTimesOnLine(tabId, 0, timeFrom, timeTo, logPrefix, Object.assign({ lineLabel: 'Line 1' }, opts || {}));
}

/**
 * From billing contact-card provider labels, choose which payor option card to click on line 3
 * ("Master or Bachelor" vs "Associate or HS"). Uses fuzzy substring checks (typos, missing trailing s).
 * Returns inject match string: "master" or "associate" (remote script inject-select-payor-option).
 */
function inferPayorMatchFromProviderLabels(labels) {
  if (!labels || !Array.isArray(labels) || labels.length === 0) {
    return {
      ok: false,
      error:
        "We did not find any tags on the provider's profile card. Those tags tell us whether to use the Master/Bachelor payor option or the Associate/HS option on the third line. Open the provider from the billing row, confirm the tags show up, then run Fix again, or pick the payor option yourself on the timesheet."
    };
  }
  const blob = labels
    .map((l) => String(l || ''))
    .join(' ')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
  if (!blob) {
    return {
      ok: false,
      error:
        "The provider's profile card had no readable tag text. Tags should mention degree level (for example Master, Bachelor, Associate, or HS) so we can choose the right payor. Check the profile in CentralReach, then try again, or select the payor option yourself."
    };
  }

  function looseHas(hay, needles) {
    const h = hay.toLowerCase();
    for (let i = 0; i < needles.length; i++) {
      const v = needles[i].toLowerCase();
      if (h.includes(v)) return true;
      if (v.length >= 4 && v.endsWith('s') && h.includes(v.slice(0, -1))) return true;
      if (v.length >= 5 && h.includes(v.slice(0, -1))) return true;
    }
    return false;
  }

  const masterSide = looseHas(blob, [
    'master',
    'maste',
    'mastre',
    'bachelor',
    'bachelo',
    'bachlor',
    'bachler',
    'bachel'
  ]);
  const assocSide =
    looseHas(blob, [
      'associate',
      'associat',
      'assoc',
      'assocaite',
      'association',
      'assocation',
      'assciate'
    ]) ||
    /\bhs\b/.test(blob) ||
    /(^|[\s,;/(]|[-–—])hs([\s,;).]|$)/.test(blob);

  if (masterSide && assocSide) {
    return {
      ok: false,
      error:
        "The provider's tags point to both degree levels at once (Master/Bachelor and Associate/HS), so the tool cannot pick a single payor option. Clean up conflicting tags on the provider profile, or choose the correct payor option yourself on the timesheet."
    };
  }
  if (masterSide) {
    return { ok: true, match: 'master', tier: 'Master or Bachelor' };
  }
  if (assocSide) {
    return { ok: true, match: 'associate', tier: 'Associate or HS' };
  }
  return {
    ok: false,
    error:
      "The provider's tags do not clearly say Master, Bachelor, Associate, or HS. Update the tags on the provider profile so degree level is obvious, or choose the Master vs Associate payor option yourself on the third line."
  };
}

/** Human label for panel log when reporting decided fee-schedule role from contact-card tags. */
function feeScheduleRoleDisplayName(role) {
  if (role === 'bcba') return 'BCBA';
  if (role === 'lbs') return 'LBS';
  if (role === 'rbt_bt') return 'RBT/BT';
  return '';
}

/** Fee row credential priority: BCBA (highest) > LBS > RBT/BT. When several tags match, the highest wins. */
const FEE_SCHEDULE_ROLE_PRIORITY = { rbt_bt: 1, lbs: 2, bcba: 3 };

function sortFeeRolesHighestFirst(roles) {
  const order = { bcba: 0, lbs: 1, rbt_bt: 2 };
  return roles.slice().sort((a, b) => (order[a] ?? 99) - (order[b] ?? 99));
}

/** Join role ids into readable text, highest credential first, e.g. "BCBA, LBS, and RBT/BT". */
function formatFeeScheduleRolesList(roleIds) {
  const names = sortFeeRolesHighestFirst(roleIds).map(feeScheduleRoleDisplayName).filter(Boolean);
  if (names.length === 0) return '';
  if (names.length === 1) return names[0];
  if (names.length === 2) return names[0] + ' and ' + names[1];
  return names.slice(0, -1).join(', ') + ', and ' + names[names.length - 1];
}

function pickHighestFeeScheduleRole(primarySet) {
  const arr = Array.from(primarySet);
  if (arr.length === 0) return null;
  return arr.reduce((best, r) =>
    (FEE_SCHEDULE_ROLE_PRIORITY[r] || 0) > (FEE_SCHEDULE_ROLE_PRIORITY[best] || 0) ? r : best
  );
}

/**
 * From billing contact-card provider tags, infer fee-schedule role for Quest-style rows: BCBA, LBS, RBT/BT.
 * When several primary tags match, picks the highest credential: BCBA > LBS > RBT/BT (RBT is lowest).
 * "Behavior Technician" maps to RBT/BT only when no BCBA/LBS/RBT/BT primary tag matched.
 * Returns { ok: true, role, allMatchedPrimary? } — role is "bcba" | "lbs" | "rbt_bt" | null.
 * @param {string[]} labels
 * @param {{ providerName?: string }} [options] — providerName reserved for future messages
 */
function inferProviderRoleFromLabels(labels, options) {
  if (!labels || !Array.isArray(labels) || labels.length === 0) {
    return { ok: true, role: null, allMatchedPrimary: [] };
  }
  const primary = new Set();
  let hasBehaviorTechnician = false;

  for (let i = 0; i < labels.length; i++) {
    const raw = String(labels[i] || '').trim();
    if (!raw) continue;
    const t = raw.toLowerCase().replace(/\s+/g, ' ').trim();

    if (/behavior\s*technician/i.test(raw)) {
      hasBehaviorTechnician = true;
    }

    if (t === 'bcba') {
      primary.add('bcba');
      continue;
    }
    if (t === 'lbs') {
      primary.add('lbs');
      continue;
    }
    if (/^registered\s+behavior\s+technician$/i.test(raw) || /^rbt-bt$/i.test(t)) {
      primary.add('rbt_bt');
      continue;
    }
    if (/^rbt\s*\/\s*bt$/.test(t) || t === 'rbt' || t === 'bt') {
      primary.add('rbt_bt');
    }
  }

  if (primary.size > 0) {
    const chosen = pickHighestFeeScheduleRole(primary);
    return { ok: true, role: chosen, allMatchedPrimary: Array.from(primary) };
  }
  if (hasBehaviorTechnician) {
    return { ok: true, role: 'rbt_bt', allMatchedPrimary: ['rbt_bt'] };
  }
  return { ok: true, role: null, allMatchedPrimary: [] };
}

/**
 * Overlap/automation: inject-enter-times must receive real From/To (no 02:00/03:30 fallback).
 * Clears stale result, sets globals, then verifies they actually landed in the page's MAIN world.
 */
async function primeEnterTimesExplicit(tabId, fromStr, toStr) {
  await execScript({
    target: { tabId: tabId },
    func: (from, to) => {
      window.__enterTimesResult = null;
      window.__enterTimesAllowDefaults = false;
      window.__enterTimesFrom = from;
      window.__enterTimesTo = to;
    },
    args: [fromStr, toStr]
  });
  const verify = await execScript({
    target: { tabId: tabId },
    func: () => ({ f: typeof window.__enterTimesFrom, t: typeof window.__enterTimesTo })
  });
  const v = verify && verify[0] && verify[0].result;
  if (!v || v.f !== 'string' || v.t !== 'string') {
    console.warn('[primeEnterTimesExplicit] globals may not be in MAIN world:', v, 'from=', fromStr, 'to=', toStr);
    await execScript({
      target: { tabId: tabId },
      func: (from, to) => {
        window.__enterTimesResult = null;
        window.__enterTimesAllowDefaults = false;
        window.__enterTimesFrom = from;
        window.__enterTimesTo = to;
      },
      args: [fromStr, toStr]
    });
  }
}

/**
 * Wait for window.__enterTimesResult after inject-enter-times.js (do not read once after a short sleep).
 * @returns {object|null}
 */
async function pollEnterTimesResult(tabId, maxWaitMs, stepMs) {
  const max = maxWaitMs != null ? maxWaitMs : ENTER_TIMES_RESULT_POLL_MAX_MS;
  const step = stepMs != null ? stepMs : ENTER_TIMES_RESULT_POLL_STEP_MS;
  let data = null;
  for (let elapsed = 0; elapsed < max; elapsed += step) {
    if (elapsed > 0) await new Promise((r) => setTimeout(r, step));
    const results = await execScript({
      target: { tabId: tabId },
      func: () => window.__enterTimesResult
    });
    data = results && results[0] && results[0].result;
    if (data) break;
  }
  return data;
}

/**
 * User-facing reason when enter-times did not succeed (never a bare "failed").
 * @param {object|null} data — from __enterTimesResult
 * @param {string} stepLabel — e.g. "Line 2 (nonbillable overlap)"
 */
function messageForEnterTimesStepFailure(data, stepLabel) {
  if (data && data.error) return stepLabel + ': ' + data.error;
  if (!data) {
    return (
      stepLabel +
      ': Timed out waiting for Time From / Time To (no result from the page yet). The times may still have applied — check the active line. If not, wait for the timesheet to finish loading and click Fix again.'
    );
  }
  var was = '';
  if (data.wasFrom != null || data.wasTo != null) {
    was =
      ' Before this attempt: Time From was ' +
      (data.wasFrom != null ? String(data.wasFrom) : '(unknown)') +
      ', Time To was ' +
      (data.wasTo != null ? String(data.wasTo) : '(unknown)') +
      '.';
  }
  return stepLabel + ': Enter times reported failure with no error message.' + was;
}

/** Manual “Enter times”: allow 02:00 PM / 03:30 PM when fields are not preset. */
function primeEnterTimesDefaults(tabId) {
  return execScript({
    target: { tabId: tabId },
    func: () => {
      window.__enterTimesAllowDefaults = true;
      delete window.__enterTimesFrom;
      delete window.__enterTimesTo;
    }
  });
}

function escapeHtml(s) {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

/** When aborting timesheet editing, click the CANCEL button so the dialog closes. */
async function clickTimesheetCancel(tab) {
  if (!tab?.id) return;
  try {
    await execScript({ target: { tabId: tab.id }, files: ['inject-click-cancel.js'] });
    await new Promise((r) => setTimeout(r, 300));
  } catch (e) {
    if (typeof log === 'function') log('Click Cancel failed: ' + (e && e.message));
  }
}

function log(msg) {
  const p = document.createElement('p');
  p.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  logEl.appendChild(p);
  logEl.scrollTop = logEl.scrollHeight;
  console.log('[Hidden Lights sidepanel]', msg);
}

document.getElementById('sig').addEventListener('click', async () => {
  log('Sig clicked');
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      log('Cannot run on this page. Open a normal webpage with a canvas.');
      return;
    }
    log('Injecting draw into tab...');
    await execScript({ target: { tabId: tab.id }, files: ['inject-draw.js'] });
    log('Done. Check the page console (F12) for [Hidden Lights] messages.');
  } catch (e) {
    log('Error: ' + e.message);
    console.error('[Hidden Lights sidepanel]', e);
  }
});

async function handleClickSignatureButton(target) {
  const label = target === 'client' ? 'Client signature' : 'Provider signature';
  const resultEl = document.getElementById('open-sig-result');
  log(label + ' clicked');
  if (resultEl) resultEl.innerHTML = '<p>Opening ' + label.toLowerCase() + '...</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      if (resultEl) resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      if (resultEl) resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({
      target: { tabId: tab.id },
      func: (t) => { window.__signatureTarget = t; },
      args: [target]
    });
    await execScript({ target: { tabId: tab.id }, files: ['inject-click-signature-button.js'] });
    await new Promise((r) => setTimeout(r, 4500));
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__clickSignatureResult
    });
    const data = results && results[0] && results[0].result;
    if (!data) {
      if (resultEl) resultEl.innerHTML = '<p>No result. Open the timesheet first.</p>';
      log(label + ': no result');
      return;
    }
    if (data.error || !data.success) {
      if (resultEl) resultEl.innerHTML = '<p>' + escapeHtml(data.error || 'Could not click the button.') + '</p>';
      log(label + ': ' + (data.error || 'failed'));
      return;
    }
    const confirmNote = data.dismissedConfirm
      ? ' (recollect signatures dialog appeared — clicked Continue)'
      : data.modalDetected === false
        ? ' (no recollect dialog)'
        : '';
    if (resultEl) resultEl.innerHTML = '<p>Opened <strong>' + escapeHtml(label) + '</strong>.' + escapeHtml(confirmNote) + '</p>';
    log(label + ': opened' + confirmNote);
  } catch (e) {
    log('Error: ' + e.message);
    if (resultEl) resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
}

document.getElementById('open-client-sig').addEventListener('click', () => handleClickSignatureButton('client'));
document.getElementById('open-provider-sig').addEventListener('click', () => handleClickSignatureButton('provider'));

document.getElementById('fill-no-signature').addEventListener('click', async () => {
  const resultEl = document.getElementById('open-sig-result');
  log('No signature + agree clicked');
  if (resultEl) resultEl.innerHTML = '<p>Filling "No signature" and checking agree...</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      if (resultEl) resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      if (resultEl) resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({ target: { tabId: tab.id }, files: ['inject-fill-no-signature.js'] });
    await new Promise((r) => setTimeout(r, 400));
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__fillNoSignatureResult
    });
    const data = results && results[0] && results[0].result;
    if (!data) {
      if (resultEl) resultEl.innerHTML = '<p>No result. Open the signature panel first.</p>';
      log('No signature: no result');
      return;
    }
    if (!data.success) {
      if (resultEl) resultEl.innerHTML = '<p>' + escapeHtml(data.error || 'Failed.') + '</p>';
      log('No signature: ' + (data.error || 'failed'));
      return;
    }
    const parts = [];
    if (data.inputFilled) parts.push('typed "No signature"');
    if (data.checkboxChecked) parts.push('checked agree');
    if (resultEl) resultEl.innerHTML = '<p><strong>Done</strong> — ' + escapeHtml(parts.join(', ') || 'OK') + '.</p>';
    log('No signature: ' + parts.join(', '));
  } catch (e) {
    log('Error: ' + e.message);
    if (resultEl) resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('click-sign-confirm').addEventListener('click', async () => {
  const resultEl = document.getElementById('open-sig-result');
  log('Confirm sign clicked');
  if (resultEl) resultEl.innerHTML = '<p>Clicking SIGN...</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      if (resultEl) resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      if (resultEl) resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({ target: { tabId: tab.id }, files: ['inject-click-sign-button.js'] });
    await new Promise((r) => setTimeout(r, 300));
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__clickSignButtonResult
    });
    const data = results && results[0] && results[0].result;
    if (!data) {
      if (resultEl) resultEl.innerHTML = '<p>No result. Make sure the signature panel is open.</p>';
      return;
    }
    if (!data.success) {
      if (resultEl) resultEl.innerHTML = '<p>' + escapeHtml(data.error || 'Failed.') + '</p>';
      return;
    }
    if (resultEl) resultEl.innerHTML = '<p><strong>Done</strong> — clicked SIGN.</p>';
    log('Confirm sign: clicked SIGN');
  } catch (e) {
    log('Error: ' + e.message);
    if (resultEl) resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('click-continue-dismiss').addEventListener('click', async () => {
  const resultEl = document.getElementById('open-sig-result');
  log('Dismiss dialog clicked');
  if (resultEl) resultEl.innerHTML = '<p>Clicking CONTINUE...</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      if (resultEl) resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      if (resultEl) resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({ target: { tabId: tab.id }, files: ['inject-click-continue-button.js'] });
    await new Promise((r) => setTimeout(r, 300));
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__clickContinueButtonResult
    });
    const data = results && results[0] && results[0].result;
    if (!data) {
      if (resultEl) resultEl.innerHTML = '<p>No result. Make sure the dialog is showing.</p>';
      return;
    }
    if (!data.success) {
      if (resultEl) resultEl.innerHTML = '<p>' + escapeHtml(data.error || 'Failed.') + '</p>';
      return;
    }
    if (resultEl) resultEl.innerHTML = '<p><strong>Done</strong> — dismissed dialog.</p>';
    log('Dismiss dialog: clicked CONTINUE');
  } catch (e) {
    log('Error: ' + e.message);
    if (resultEl) resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

// --------------- Auto sign both ---------------

async function pollForInjectResult(tabId, globalName, maxMs, pollMs) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    const res = await execScript({
      target: { tabId },
      func: (name) => window[name],
      args: [globalName]
    });
    const data = res && res[0] && res[0].result;
    if (data !== null && data !== undefined) return data;
    await new Promise((r) => setTimeout(r, pollMs));
  }
  return null;
}

/** Snippet for backup session-note dialog row; prefers overlap capture date + provider. */
function getBackupNoteRowSnippetForOverlapFix(tabId) {
  const rec = overlapFixRecordGet(tabId);
  if (!rec) return BACKUP_NOTE_ROW_SNIPPET;
  const d = (rec.dateOfService || '').trim();
  const p = (rec.provider || '').trim();
  if (d && p) return d + ' ' + p;
  return BACKUP_NOTE_ROW_SNIPPET;
}

/**
 * Pick session note on the timesheet line.
 * Pass A (primary): session-note picker → date/name list — **without** clicking SELECT EXISTING NOTE first
 *   (works when Session Note Names grid or list is already available).
 * Pass B (backup): disabled — was: click SELECT EXISTING NOTE, then repeat session picker → date/name.
 * @returns {Promise<{ ok: true } | { ok: false, msg: string }>}
 */
async function tryOverlapFixPickNoteBackupThenPrimary(tabId, resultEl, logPrefix) {
  const recPick = overlapFixRecordGet(tabId);
  const d = (recPick && recPick.dateOfService) || '';
  const n = (recPick && recPick.provider) || '';
  const snippet = getBackupNoteRowSnippetForOverlapFix(tabId);
  resultEl.innerHTML = '<p>Finding note (' + escapeHtml(d + ' ' + n) + ')...</p>';

  async function attemptSessionPickerOnly(passLabel) {
    log(logPrefix + ': ' + passLabel + ' — session-note picker');
    resultEl.innerHTML = '<p>Choosing note (session picker)…</p>';

    await execScript({
      target: { tabId },
      func: function (s) {
        window.__backupNoteRowSnippet = s;
        window.__selectExistingSessionNoteFlowResult = null;
      },
      args: [snippet],
    });
    await execScript({ target: { tabId }, files: ['inject-select-existing-session-note-flow.js'] });
    const backup = await pollForInjectResult(
      tabId,
      '__selectExistingSessionNoteFlowResult',
      OVERLAP_FIX_BACKUP_NOTE_POLL_MAX_MS,
      OVERLAP_FIX_BACKUP_NOTE_POLL_STEP_MS
    );
    if (backup && backup.success) {
      log(logPrefix + ': note selected via session-note picker (' + passLabel + ')');
      return { ok: true };
    }
    var backupErr =
      (backup && backup.error) ||
      'Session-note picker did not complete within ' + OVERLAP_FIX_BACKUP_NOTE_POLL_MAX_MS + 'ms.';
    return { ok: false, backupErr: backupErr };
  }

  /* Pass A — primary: no SELECT EXISTING NOTE button yet */
  var passA = await attemptSessionPickerOnly('primary (before SELECT EXISTING NOTE)');
  if (passA.ok) return { ok: true };

  /* Pass B — force-open SELECT EXISTING NOTE, then retry session picker only. */
  resultEl.innerHTML = '<p>Backup: clicking SELECT EXISTING NOTE…</p>';
  log(logPrefix + ': backup — clicking SELECT EXISTING NOTE button');
  await new Promise(function (r) {
    setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS);
  });
  await execScript({ target: { tabId }, files: ['inject-click-existing-note.js'] });
  await new Promise(function (r) {
    setTimeout(r, 400);
  });
  var btnRes = await execScript({
    target: { tabId },
    func: function () {
      return window.__clickExistingNoteResult;
    },
  });
  var btnData = btnRes && btnRes[0] && btnRes[0].result;
  if (!btnData || !btnData.success) {
    var btnErr =
      (btnData && btnData.error) ||
      'SELECT EXISTING NOTE button not found or click failed after primary attempts.';
    return {
      ok: false,
      msg: 'Primary: session — ' + passA.backupErr + ' · Backup button: ' + btnErr,
    };
  }

  await new Promise(function (r) {
    setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS);
  });

  var passB = await attemptSessionPickerOnly('after SELECT EXISTING NOTE');
  if (passB.ok) return { ok: true };

  return {
    ok: false,
    msg:
      'Primary: session — ' +
      passA.backupErr +
      ' · After SELECT EXISTING NOTE: session — ' +
      passB.backupErr,
  };
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) throw new Error('No active tab');
  if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:')))
    throw new Error('Cannot run on this page');
  return tab;
}

async function pollForElement(tabId, pollMs, maxMs, checkFn, checkArgs) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    const res = await execScript({ target: { tabId }, func: checkFn, args: checkArgs || [] });
    if (res && res[0] && res[0].result) return true;
    await new Promise((r) => setTimeout(r, pollMs));
  }
  return false;
}

async function runSignatureSequence(tab, target, resultEl, dismiss) {
  const label = target === 'client' ? 'Client' : 'Provider';

  // 1. Open sig
  if (resultEl) resultEl.innerHTML = '<p>[' + label + '] Opening signature button...</p>';
  log('[Auto] Opening ' + label + ' signature');
  await execScript({
    target: { tabId: tab.id },
    func: (t) => { window.__signatureTarget = t; },
    args: [target]
  });
  await execScript({ target: { tabId: tab.id }, files: ['inject-click-signature-button.js'] });

  // 2. Wait for the signature form to load (poll for #providersignature input every 200ms, max 8s)
  if (resultEl) resultEl.innerHTML = '<p>[' + label + '] Waiting for signature form to load...</p>';
  log('[Auto] Waiting for signature form');
  const formReady = await pollForElement(tab.id, 200, 8000, () => {
    return !!document.getElementById('providersignature') || !!document.querySelector('input[id*="providersignature"]');
  });
  if (!formReady) {
    log('[Auto] Signature form did not appear');
    if (resultEl) resultEl.innerHTML = '<p>[' + label + '] Signature form did not load in time.</p>';
    return false;
  }

  // 3. No signature + agree (no wait after)
  if (resultEl) resultEl.innerHTML = '<p>[' + label + '] Filling "No signature" + agree...</p>';
  log('[Auto] Filling no-signature + agree');
  await execScript({ target: { tabId: tab.id }, files: ['inject-fill-no-signature.js'] });

  // 4. Draw the S
  if (resultEl) resultEl.innerHTML = '<p>[' + label + '] Drawing signature...</p>';
  log('[Auto] Drawing S');
  await execScript({ target: { tabId: tab.id }, files: ['inject-draw.js'] });

  // 5. Wait 0.4s
  await new Promise((r) => setTimeout(r, 400));

  // 6. Confirm sign (click SIGN)
  if (resultEl) resultEl.innerHTML = '<p>[' + label + '] Clicking SIGN...</p>';
  log('[Auto] Clicking SIGN');
  await execScript({ target: { tabId: tab.id }, files: ['inject-click-sign-button.js'] });

  // 7. Wait for CONTINUE button to appear (poll every 200ms, max 6s)
  if (resultEl) resultEl.innerHTML = '<p>[' + label + '] Waiting for confirmation...</p>';
  log('[Auto] Waiting for next step');
  const nextReady = await pollForElement(tab.id, 200, 6000, () => {
    var btns = document.querySelectorAll('button');
    for (var i = 0; i < btns.length; i++) {
      var t = (btns[i].textContent || '').trim();
      if (t === 'CONTINUE') return true;
    }
    return false;
  });

  // 8. Dismiss dialog (only for client)
  if (dismiss) {
    if (nextReady) {
      if (resultEl) resultEl.innerHTML = '<p>[' + label + '] Dismissing dialog...</p>';
      log('[Auto] Dismissing dialog');
      await execScript({ target: { tabId: tab.id }, files: ['inject-click-continue-button.js'] });
    } else {
      log('[Auto] No CONTINUE button found, skipping dismiss');
    }
  }

  log('[Auto] ' + label + ' signature complete');
  return true;
}

document.getElementById('auto-sign-both').addEventListener('click', async () => {
  const resultEl = document.getElementById('open-sig-result');
  if (resultEl) resultEl.innerHTML = '<p><strong>Auto sign started...</strong></p>';
  log('[Auto] Auto sign both started');
  try {
    const tab = await getActiveTab();

    // ---- CLIENT ----
    const clientOk = await runSignatureSequence(tab, 'client', resultEl, true);
    if (!clientOk) return;

    // ---- Wait 2s for page to settle ----
    if (resultEl) resultEl.innerHTML = '<p>Client done. Waiting 2s before provider...</p>';
    log('[Auto] Waiting 2s before provider');
    await new Promise((r) => setTimeout(r, 2000));

    // ---- PROVIDER ----
    const providerOk = await runSignatureSequence(tab, 'provider', resultEl, false);
    if (!providerOk) return;

    if (resultEl) resultEl.innerHTML = '<p><strong>Both signatures complete.</strong></p>';
    log('[Auto] Both signatures complete');
  } catch (e) {
    log('[Auto] Error: ' + e.message);
    if (resultEl) resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

/** Extract short service code (e.g. 92507 or 97153) from serviceAuth string. */
function shortServiceCode(serviceAuth) {
  const m = (serviceAuth || '').match(/\d{5}/);
  return m ? m[0] : (serviceAuth || '').trim().slice(0, 5) || '—';
}

/** 97155 scan list: only groups that include a 97153 line can use the automatic fix (hide 97155-only overlaps). */
function overlapGroupHas97153Line(g) {
  const entries = g.entries || [];
  return entries.some((e) => (e.serviceAuth || '').includes('97153'));
}

/** True for billable/concurrent 97155 rows (not 97153, not direct non billable). */
function is97155ConcurrentServiceEntry(e) {
  const auth = (e && e.serviceAuth) || '';
  if (!auth.includes('97155')) return false;
  if (auth.toLowerCase().includes('direct non billable')) return false;
  return true;
}

function overlapEntryStableKey(e) {
  if (e && e.rowId) return String(e.rowId);
  return (
    String(e.time || '') +
    '|' +
    String(e.serviceAuth || '') +
    '|' +
    String(e.startMinutes != null ? e.startMinutes : '') +
    '|' +
    String(e.endMinutes != null ? e.endMinutes : '')
  );
}

function find97153EntryInOverlapGroup(g) {
  const entries = g.entries || [];
  const with97153 = entries.filter((e) => (e.serviceAuth || '').includes('97153'));
  if (with97153.length === 0) return null;
  if (with97153.length === 1) return with97153[0];
  return with97153.reduce((best, e) =>
    e.endMinutes - e.startMinutes >= best.endMinutes - best.startMinutes ? e : best
  );
}

/**
 * When one 97153 line overlaps two or more distinct 97155 sessions, automatic fix is not supported yet.
 * Returns regular fixable groups and blocked cases (one row per 97153 + its 97155 concurrences).
 */
function partition97155MultiConcurrentGroups(fixableGroups) {
  const buckets = new Map();
  for (const g of fixableGroups || []) {
    const entry97153 = find97153EntryInOverlapGroup(g);
    if (!entry97153) continue;
    const others = (g.entries || []).filter((e) => e !== entry97153);
    const concurrent97155 = others.filter(is97155ConcurrentServiceEntry);
    if (concurrent97155.length === 0) continue;
    const bucketKey =
      String(g.client || '') +
      '|' +
      String(g.date || '') +
      '|' +
      overlapEntryStableKey(entry97153);
    if (!buckets.has(bucketKey)) {
      buckets.set(bucketKey, {
        client: g.client,
        date: g.date,
        entry97153: entry97153,
        groups: [],
        concurrent97155ByKey: new Map()
      });
    }
    const bucket = buckets.get(bucketKey);
    bucket.groups.push(g);
    for (const c of concurrent97155) {
      bucket.concurrent97155ByKey.set(overlapEntryStableKey(c), c);
    }
  }

  const blockedGroupSet = new Set();
  const blockedCases = [];
  for (const bucket of buckets.values()) {
    if (bucket.concurrent97155ByKey.size < 2) continue;
    const concurrent97155 = Array.from(bucket.concurrent97155ByKey.values());
    for (const g of bucket.groups) blockedGroupSet.add(g);
    blockedCases.push({
      client: bucket.client,
      date: bucket.date,
      entry97153: bucket.entry97153,
      concurrent97155: concurrent97155,
      groups: bucket.groups
    });
  }

  const regular = (fixableGroups || []).filter((g) => !blockedGroupSet.has(g));
  return { regular: regular, blockedCases: blockedCases };
}

/** Same tolerance as getOverlapFixForGroup start/middle/end classification. */
const OVERLAP_PEEL_TOLERANCE_MINUTES = 1;
const MAX_MULTI_97155_LINE_COUNT = 8;

function segmentsOverlapMinutes(a0, a1, b0, b1) {
  return a0 < b1 && b0 < a1;
}

function classifyOverlapOnBillableSpan(wStart, wEnd, spanStart, spanEnd) {
  const overlapStart = Math.max(wStart, spanStart);
  const overlapEnd = Math.min(wEnd, spanEnd);
  if (overlapEnd <= overlapStart) return null;
  const atStart = overlapStart <= spanStart + OVERLAP_PEEL_TOLERANCE_MINUTES;
  const atEnd = overlapEnd >= spanEnd - OVERLAP_PEEL_TOLERANCE_MINUTES;
  if (atStart) return 'start';
  if (atEnd) return 'end';
  return 'middle';
}

/**
 * Build execution-order segment plan for one 97153 line with 2+ 97155 concurrences.
 * Line 1 is always billable (trim only); non billable lines are added as line 2+.
 */
function buildMulti97155FixPlan(entry97153, concurrent97155, meta) {
  if (!entry97153 || entry97153.startMinutes == null || entry97153.endMinutes == null) {
    return { ok: false, error: 'Missing 97153 time range.' };
  }
  if (!Array.isArray(concurrent97155) || concurrent97155.length < 2) {
    return { ok: false, error: 'Multi plan requires at least two 97155 sessions.' };
  }
  const entryId = (entry97153.rowId || '').replace(/^billing-grid-row-/, '');
  if (!entryId) {
    return { ok: false, error: 'We could not read the 97153 row id.' };
  }

  const S = entry97153.startMinutes;
  const E = entry97153.endMinutes;
  const windows = concurrent97155
    .map(function (entry) {
      const ws = Math.max(S, entry.startMinutes);
      const we = Math.min(E, entry.endMinutes);
      if (we <= ws) return null;
      return { startMinutes: ws, endMinutes: we, entry: entry };
    })
    .filter(Boolean)
    .sort(function (a, b) {
      return a.startMinutes - b.startMinutes || a.endMinutes - b.endMinutes;
    });

  if (windows.length < 2) {
    return { ok: false, error: 'Less than two 97155 windows overlap the 97153 line after clipping.' };
  }

  let billableSpans = [{ lineIndex: 0, startMinutes: S, endMinutes: E }];
  const nonBillableLines = [];
  let nextLineIndex = 1;
  const warnings = [];

  for (const w of windows) {
    const spanIdx = billableSpans.findIndex(function (s) {
      return segmentsOverlapMinutes(s.startMinutes, s.endMinutes, w.startMinutes, w.endMinutes);
    });
    if (spanIdx === -1) {
      const overlapWith = nonBillableLines
        .filter(function (nb) {
          return segmentsOverlapMinutes(nb.startMinutes, nb.endMinutes, w.startMinutes, w.endMinutes);
        })
        .map(function (nb) {
          return nb.lineIndex;
        });
      nonBillableLines.push({
        lineIndex: nextLineIndex++,
        startMinutes: w.startMinutes,
        endMinutes: w.endMinutes,
        source97155: w.entry
      });
      if (overlapWith.length) {
        warnings.push(
          '97155 row ' +
            (w.entry.time || '').trim() +
            ' overlaps nonbillable line(s) ' +
            overlapWith
              .map(function (i) {
                return String(i + 1);
              })
              .join(', ')
        );
      }
      continue;
    }
    const span = billableSpans[spanIdx];
    const kind = classifyOverlapOnBillableSpan(w.startMinutes, w.endMinutes, span.startMinutes, span.endMinutes);
    if (!kind) continue;

    if (kind === 'start') {
      billableSpans[spanIdx] = Object.assign({}, span, { startMinutes: w.endMinutes });
      nonBillableLines.push({
        lineIndex: nextLineIndex++,
        startMinutes: w.startMinutes,
        endMinutes: w.endMinutes,
        source97155: w.entry
      });
    } else if (kind === 'end') {
      billableSpans[spanIdx] = Object.assign({}, span, { endMinutes: w.startMinutes });
      nonBillableLines.push({
        lineIndex: nextLineIndex++,
        startMinutes: w.startMinutes,
        endMinutes: w.endMinutes,
        source97155: w.entry
      });
    } else {
      const oldEnd = span.endMinutes;
      billableSpans[spanIdx] = Object.assign({}, span, { endMinutes: w.startMinutes });
      nonBillableLines.push({
        lineIndex: nextLineIndex++,
        startMinutes: w.startMinutes,
        endMinutes: w.endMinutes,
        source97155: w.entry
      });
      billableSpans.push({
        lineIndex: nextLineIndex++,
        startMinutes: w.endMinutes,
        endMinutes: oldEnd
      });
    }
  }

  const allLines = billableSpans
    .map(function (s) {
      return {
        lineIndex: s.lineIndex,
        type: 'billable',
        startMinutes: s.startMinutes,
        endMinutes: s.endMinutes
      };
    })
    .concat(
      nonBillableLines.map(function (n) {
        return {
          lineIndex: n.lineIndex,
          type: 'nonbillable',
          startMinutes: n.startMinutes,
          endMinutes: n.endMinutes,
          source97155: n.source97155
        };
      })
    )
    .sort(function (a, b) {
      return a.lineIndex - b.lineIndex;
    });

  if (!allLines.length) {
    return { ok: false, error: 'Could not build service line plan.' };
  }
  if (allLines.length > MAX_MULTI_97155_LINE_COUNT) {
    return {
      ok: false,
      error:
        'Too many service lines (' +
        allLines.length +
        ') — fix manually (max ' +
        MAX_MULTI_97155_LINE_COUNT +
        ').'
    };
  }

  const line0 = allLines.find(function (l) {
    return l.lineIndex === 0;
  });
  if (!line0 || line0.type !== 'billable') {
    return { ok: false, error: 'Line 1 must remain billable — cannot build plan.' };
  }

  const segments = [
    {
      lineIndex: 0,
      type: 'billable',
      action: 'trim',
      from: minutesToTimeString(line0.startMinutes),
      to: minutesToTimeString(line0.endMinutes)
    }
  ];
  for (let i = 1; i < allLines.length; i++) {
    const line = allLines[i];
    const nbOverlap =
      line.type === 'nonbillable'
        ? nonBillableLines
            .filter(function (nb) {
              return (
                nb.lineIndex !== line.lineIndex &&
                segmentsOverlapMinutes(nb.startMinutes, nb.endMinutes, line.startMinutes, line.endMinutes)
              );
            })
            .map(function (nb) {
              return nb.lineIndex;
            })
        : [];
    segments.push({
      lineIndex: line.lineIndex,
      type: line.type,
      action: 'add',
      from: minutesToTimeString(line.startMinutes),
      to: minutesToTimeString(line.endMinutes),
      source97155: line.source97155 || null,
      warnOverlapWith: nbOverlap.length ? nbOverlap : undefined
    });
  }

  const billableIndices = allLines.filter(function (l) {
    return l.type === 'billable';
  });
  const lastBillableIndex = billableIndices[billableIndices.length - 1].lineIndex;

  return {
    ok: true,
    entryId: entryId,
    client: (meta && meta.client) || '',
    date: (meta && meta.date) || '',
    entry97153: entry97153,
    concurrent97155Count: windows.length,
    segments: segments,
    lineCount: allLines.length,
    lastBillableIndex: lastBillableIndex,
    warnings: warnings
  };
}

function buildMulti97155FixPlanFromCase(item) {
  if (!item || !item.entry97153) {
    return { ok: false, error: 'Invalid multi-concurrent case.' };
  }
  return buildMulti97155FixPlan(item.entry97153, item.concurrent97155 || [], {
    client: item.client,
    date: item.date
  });
}

function formatMulti97155SegmentPreview(plan) {
  if (!plan || !plan.ok || !plan.segments) return '';
  return plan.segments
    .map(function (seg, idx) {
      const label = seg.type === 'nonbillable' ? 'non billable' : 'billable';
      return (
        'L' +
        (seg.lineIndex + 1) +
        ' ' +
        label +
        ' ' +
        seg.from +
        '–' +
        seg.to +
        (seg.action === 'trim' ? ' (trim)' : '')
      );
    })
    .join(' · ');
}

function render97155MultiConcurrentFixSection(multiCases, containerEl) {
  if (!multiCases.length || !containerEl) return;
  const wrap = document.createElement('div');
  wrap.className = 'overlap-blocked-multi';

  const title = document.createElement('p');
  title.className = 'overlap-blocked-multi__title';
  title.innerHTML = '<strong>Multi-concurrent (' + multiCases.length + ')</strong>';
  wrap.appendChild(title);

  const hint = document.createElement('p');
  hint.className = 'section-hint';
  hint.textContent =
    'One 97153 line with two or more 97155 sessions. Line 1 stays billable; extra lines are added in peel order (tab order may differ from clock order).';
  wrap.appendChild(hint);

  const list = document.createElement('ul');
  list.className = 'overlap-list overlap-list--blocked';
  multiCases.forEach(function (item) {
    const plan = buildMulti97155FixPlanFromCase(item);
    const clientLabel = (item.client || '(no client)').trim();
    const dateLabel = (item.date || '').trim();
    const line97153 = (item.entry97153.time || '').trim() + ' 97153';
    const lines97155 = item.concurrent97155
      .map(function (e) {
        return (e.time || '').trim() + ' 97155';
      })
      .join(' | ');
    const count97155 = item.concurrent97155.length;
    const badgeLabel = count97155 + '×97155';
    const multiDetail = plan.ok
      ? 'Multi — ' +
        count97155 +
        '×97155 on one 97153 → ' +
        plan.lineCount +
        ' lines after fix'
      : plan.error || 'Cannot build fix plan';
    const preview = plan.ok ? formatMulti97155SegmentPreview(plan) : '';
    const warnHtml =
      plan.ok && plan.warnings && plan.warnings.length
        ? '<div class="overlap-list__line overlap-list__line--error">' +
          escapeHtml(plan.warnings.join(' · ')) +
          '</div>'
        : '';

    const li = document.createElement('li');
    li.className = 'overlap-list__item overlap-list__item--multi';
    li.innerHTML =
      '<div class="overlap-list__row">' +
      '<span class="overlap-list__fix-wrap"></span>' +
      '<div class="overlap-list__lines">' +
      '<div class="overlap-list__line">' +
      escapeHtml(clientLabel) +
      ' · ' +
      escapeHtml(dateLabel) +
      '</div>' +
      '<div class="overlap-list__line">' +
      escapeHtml(line97153) +
      ' | ' +
      escapeHtml(lines97155) +
      '</div>' +
      '<div class="overlap-list__line overlap-list__line--multi-label">' +
      escapeHtml(multiDetail) +
      '</div>' +
      (preview
        ? '<div class="overlap-list__line section-hint" style="margin:0;font-size:11px;">' +
          escapeHtml(preview) +
          '</div>'
        : '') +
      warnHtml +
      '</div>' +
      '<span class="overlap-list__type overlap-list__type--multi" title="Multi-concurrent: ' +
      count97155 +
      ' separate 97155 sessions on one 97153 line" aria-label="Multi-concurrent ' +
      count97155 +
      ' 97155 sessions">' +
      escapeHtml(badgeLabel) +
      '</span>' +
      '</div>' +
      '<div class="overlap-list__fail-reason" aria-live="polite"></div>';

    const fixWrap = li.querySelector('.overlap-list__fix-wrap');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'overlap-btn overlap-list__fix';
    if (plan.ok) {
      btn.setAttribute('data-fix-mode', '97155-multi');
      btn.setAttribute('data-entry-id', plan.entryId);
      btn.setAttribute('data-fix-plan', JSON.stringify(plan));
      btn.setAttribute('data-client', item.client || '');
      btn.setAttribute('data-date', item.date || '');
      btn.setAttribute(
        'data-log-summary',
        '97155-multi · ' +
          clientLabel +
          ' • ' +
          dateLabel +
          ' ' +
          line97153 +
          ' | ' +
          lines97155 +
          ' Multi ' +
          count97155 +
          '×97155'
      );
      btn.title = 'Fix multi-concurrent 97155 overlap';
    } else {
      btn.disabled = true;
      btn.title = plan.error || 'Cannot fix';
    }
    fixWrap.appendChild(btn);
    list.appendChild(li);
  });
  wrap.appendChild(list);
  containerEl.appendChild(wrap);
}

/** Length in minutes of [a0,a1] ∩ [b0,b1] (0 if disjoint). */
function overlapSegmentMinutes(a0, a1, b0, b1) {
  const s = Math.max(a0, b0);
  const e = Math.min(a1, b1);
  return e > s ? e - s : 0;
}

/** True when a billing row has the same start and end minute (e.g. 4:07–4:07p) — not a real overlap candidate. */
function isSameMinuteEntry(e) {
  if (!e || e.startMinutes == null || e.endMinutes == null) return false;
  return e.endMinutes <= e.startMinutes;
}

/** Drop overlap groups that include a zero-length row or have no positive overlap window. */
function overlapGroupIsMeaningful(g) {
  const entries = g.entries || [];
  if (entries.some(isSameMinuteEntry)) return false;
  if (entries.length < 2) return false;
  const overlapStart = Math.max(...entries.map((e) => e.startMinutes));
  const overlapEnd = Math.min(...entries.map((e) => e.endMinutes));
  return overlapEnd > overlapStart;
}

function describe97155OmittedOverlapGroups(overlappingGroups) {
  const groups = overlappingGroups || [];
  const with97153 = groups.filter(overlapGroupHas97153Line);
  const chainOnly = with97153.filter(function (g) {
    return !overlapGroupIsMeaningful(g);
  });
  if (chainOnly.length > 0) {
    return {
      title: 'Overlaps were found but could not be listed for automatic fix.',
      hint:
        chainOnly.length +
        ' group(s) link sessions in a chain where no single time window is shared by every line (for example morning 97153, 97155, and afternoon 97153). Update the extension and scan again, or review manually.',
    };
  }
  if (groups.length > 0) {
    return {
      title: 'No overlapping groups include a 97153 line, so nothing is listed for automatic fix.',
      hint:
        groups.length +
        ' overlap group(s) (for example 97155-only) were found but omitted — this flow only applies when a 97153 line is part of the overlap.',
    };
  }
  return {
    title: 'No overlapping groups include a 97153 line, so nothing is listed for automatic fix.',
    hint: '',
  };
}

/**
 * For an overlap group, pick a 97153 entry that intersects the non-97153 appointment window and split out
 * only that concurring segment (partial wrap is OK — we do not require 97153 to cover the full other span).
 * Returns { ok, error?, entry97153?, entryId?, timeFrom?, timeTo?, overlapText? }.
 */
function getOverlapFixForGroup(g) {
  const entries = g.entries || [];
  const with97153 = entries.filter((e) => (e.serviceAuth || '').includes('97153'));
  const others = entries.filter((e) => !(e.serviceAuth || '').includes('97153'));
  if (with97153.length === 0) {
    return { ok: false, error: 'This group does not include a 97153 service line, so this automatic fix does not apply here.' };
  }
  if (others.length === 0) {
    return {
      ok: false,
      error:
        'Every line here is 97153. This tool is for when 97153 overlaps a different service code (for example 92507) on the same day.'
    };
  }
  const minStartOthers = Math.min(...others.map((e) => e.startMinutes));
  const maxEndOthers = Math.max(...others.map((e) => e.endMinutes));

  const intersecting97153 = with97153.filter(
    (e) => e.startMinutes < maxEndOthers && e.endMinutes > minStartOthers
  );
  if (intersecting97153.length === 0) {
    const spanOthers = minutesToTimeString(minStartOthers) + ' – ' + minutesToTimeString(maxEndOthers);
    return {
      ok: false,
      error:
        'No 97153 line intersects the other overlapping appointment window (' +
        spanOthers +
        '). Refresh the billing list, run Overlaps again, or review manually.'
    };
  }

  const entry97153 = intersecting97153.reduce((best, e) => {
    const iw = overlapSegmentMinutes(e.startMinutes, e.endMinutes, minStartOthers, maxEndOthers);
    const bw = overlapSegmentMinutes(best.startMinutes, best.endMinutes, minStartOthers, maxEndOthers);
    if (iw > bw) return e;
    if (iw < bw) return best;
    return e.endMinutes - e.startMinutes >= best.endMinutes - best.startMinutes ? e : best;
  });

  const overlapStart = Math.max(entry97153.startMinutes, minStartOthers);
  const overlapEnd = Math.min(entry97153.endMinutes, maxEndOthers);

  if (overlapEnd <= overlapStart) {
    return {
      ok: false,
      error:
        'The overlap is only a single minute boundary (for example 4:07 PM – 4:07 PM), often from a zero-length row like 4:07–4:07. That does not count as an overlap — no fix needed.'
    };
  }

  const TOLERANCE_MINUTES = 1;
  const atStart = overlapStart <= entry97153.startMinutes + TOLERANCE_MINUTES;
  const atEnd = overlapEnd >= entry97153.endMinutes - TOLERANCE_MINUTES;

  const entryId = (entry97153.rowId || '').replace(/^billing-grid-row-/, '');
  if (!entryId) return { ok: false, error: 'We could not read the row id for this entry. Refresh the billing list and run Overlaps again.' };

  if (atStart) {
    // Overlap at start: adjust first line to start at end of overlap; add second (nonbillable). No third line.
    return {
      ok: true,
      overlapType: 'start',
      entry97153,
      entryId,
      timeFrom: minutesToTimeString(overlapEnd),
      timeTo: minutesToTimeString(entry97153.endMinutes),
      overlapText: minutesToTimeString(overlapStart) + ' – ' + minutesToTimeString(overlapEnd),
      overlapFrom: minutesToTimeString(overlapStart),
      overlapTo: minutesToTimeString(overlapEnd),
      part3From: '',
      part3To: ''
    };
  }
  if (atEnd) {
    // Overlap at end: part 1 ends at start of overlap; add second (nonbillable). No third line.
    return {
      ok: true,
      overlapType: 'end',
      entry97153,
      entryId,
      timeFrom: minutesToTimeString(entry97153.startMinutes),
      timeTo: minutesToTimeString(overlapStart),
      overlapText: minutesToTimeString(overlapStart) + ' – ' + minutesToTimeString(overlapEnd),
      overlapFrom: minutesToTimeString(overlapStart),
      overlapTo: minutesToTimeString(overlapEnd),
      part3From: '',
      part3To: ''
    };
  }

  // Middle: part 1 ends at overlap start; line 2 = nonbillable overlap; line 3 = billable after overlap.
  const newEndMinutes = overlapStart;
  return {
    ok: true,
    overlapType: 'middle',
    entry97153,
    entryId,
    timeFrom: minutesToTimeString(entry97153.startMinutes),
    timeTo: minutesToTimeString(newEndMinutes),
    overlapText: minutesToTimeString(overlapStart) + ' – ' + minutesToTimeString(overlapEnd),
    overlapFrom: minutesToTimeString(overlapStart),
    overlapTo: minutesToTimeString(overlapEnd),
    part3From: minutesToTimeString(overlapEnd),
    part3To: minutesToTimeString(entry97153.endMinutes)
  };
}

/**
 * When middle overlap fix fails before payor inference, map inject result codes to clear copy.
 * Row-not-found is a DOM/grid visibility issue, not “missing CRM labels” on the provider.
 */
function messageForOverlapFixProviderLabelsFailure(result) {
  if (!result || (!result.error && !result.success)) {
    return "We could not read the provider's profile tags in time. Those tags tell us which payor/education option to use on the third line. Make sure the right billing row is on screen, then click Fix again.";
  }
  if (result.success && result.labels && result.labels.length) return '';
  const code = result.code;
  const id = result.entryId != null ? String(result.entryId) : '';
  if (code === 'ROW_NOT_FOUND') {
    return (
      'This billing line is not on the screen right now (row ' +
      (id || 'unknown') +
      '). Scroll until you can see that appointment on the billing list, check filters and pages, then click Fix again. You can also click Overlaps to refresh the list first.'
    );
  }
  if (code === 'PROVIDER_COLUMN_NOT_FOUND') {
    return 'We found the row but not the provider column (the page layout may have changed). Refresh the billing list, run Overlaps again, then try Fix.';
  }
  if (code === 'NO_VCARD') {
    return "We could not click the provider's name on that row. Scroll the row fully into view and try again.";
  }
  if (code === 'CONTACT_CARD_TIMEOUT') {
    return "The provider profile window did not open in time. Close any open profile windows, wait for the billing list to finish loading, then try Fix again.";
  }
  if (code === 'NO_ENTRY_ID') {
    return 'Something went wrong matching this fix to a row. Click Overlaps again, then try Fix.';
  }
  if (result.error) {
    var raw = String(result.error);
    if (raw.indexOf('Row not found for entry') !== -1) {
      var idMatch = raw.match(/entry\s+([\d]+)/i);
      return messageForOverlapFixProviderLabelsFailure({
        code: 'ROW_NOT_FOUND',
        entryId: result.entryId != null ? result.entryId : idMatch ? idMatch[1] : ''
      });
    }
    return (
      "We could not read the provider's profile tags. " +
      raw.replace(/\.$/, '') +
      '. If this keeps happening, open the provider from the billing row yourself, note their degree tags, then choose the payor option by hand on the timesheet.'
    );
  }
  return "We could not read the provider's profile tags. Make sure the billing row is visible, then try Fix again.";
}

/**
 * Short message when remote payor/education inject fails (overlap flow or manual button).
 */
function messageForPayorSelectFailure(data) {
  if (data && data.error) return data.error;
  return 'We could not click the payor or education-level choice on this screen. Scroll until the Master / Associate (or similar) options are fully visible, wait for the page to finish loading, then try again. You can also click the right option yourself.';
}

/** For a 97155 overlap group, return overlap time range text for display. */
function getOverlap97155Display(g) {
  const entries = g.entries || [];
  if (entries.length === 0) return '—';
  const overlapStart = Math.max(...entries.map((e) => e.startMinutes));
  const overlapEnd = Math.min(...entries.map((e) => e.endMinutes));
  return minutesToTimeString(overlapStart) + ' – ' + minutesToTimeString(overlapEnd);
}

/**
 * Unknown payor labels from the billing table — user must add each to allow or block list before overlap results show.
 */
function renderUnknownPayors97155Prompt(unknownPayors) {
  const el = document.getElementById('overlaps-result');
  const fixButtonsEl = document.getElementById('overlap-fix-buttons');
  if (!el || !fixButtonsEl) return;
  el.innerHTML = '';
  fixButtonsEl.innerHTML = '';

  const wrap = document.createElement('div');
  wrap.className = 'unknown-payors-prompt';

  const title = document.createElement('p');
  title.className = 'unknown-payors-prompt__title';
  title.innerHTML = '<strong>New payors on this page</strong>';
  wrap.appendChild(title);

  const hint = document.createElement('p');
  hint.className = 'section-hint';
  hint.style.marginBottom = '10px';
  hint.textContent =
    'These payor cells did not match your allow list or block list. Pick where each label should go — settings update immediately and the scan runs again when you finish the list.';
  wrap.appendChild(hint);

  unknownPayors.forEach(function (payorLabel) {
    const row = document.createElement('div');
    row.className = 'unknown-payors-prompt__row';

    const labelEl = document.createElement('span');
    labelEl.className = 'unknown-payors-prompt__label';
    labelEl.textContent = payorLabel;

    const btnAllow = document.createElement('button');
    btnAllow.type = 'button';
    btnAllow.className = 'unknown-payors-prompt__btn unknown-payors-prompt__btn--allow';
    btnAllow.textContent = 'Allow list';
    btnAllow.addEventListener('click', function () {
      addPayorToAllowedList(payorLabel);
      row.remove();
      log('97155 scan: added to allow list — ' + payorLabel);
      if (!wrap.querySelector('.unknown-payors-prompt__row')) {
        runFindOverlaps97155();
      }
    });

    const btnBlock = document.createElement('button');
    btnBlock.type = 'button';
    btnBlock.className = 'unknown-payors-prompt__btn unknown-payors-prompt__btn--block';
    btnBlock.textContent = 'Block list';
    btnBlock.addEventListener('click', function () {
      addPayorToBlockedList(payorLabel);
      row.remove();
      log('97155 scan: added to block list — ' + payorLabel);
      if (!wrap.querySelector('.unknown-payors-prompt__row')) {
        runFindOverlaps97155();
      }
    });

    row.appendChild(labelEl);
    row.appendChild(btnAllow);
    row.appendChild(btnBlock);
    wrap.appendChild(row);
  });

  el.appendChild(wrap);
  fixButtonsEl.innerHTML =
    '<p class="section-hint">Resolve each payor above (or edit lists in Settings), then overlap results will appear.</p>';
}

function renderOverlaps97155(data) {
  const el = document.getElementById('overlaps-result');
  const fixButtonsEl = document.getElementById('overlap-fix-buttons');
  if (!el || !fixButtonsEl) return;
  el.innerHTML = '';
  fixButtonsEl.innerHTML = '';
  if (data.error) {
    clearOverlapRunAllMount();
    el.innerHTML = '<p>' + escapeHtml(data.error) + '</p>';
    fixButtonsEl.innerHTML = '<p class="section-hint">97155 overlap list will appear here after a successful scan.</p>';
    return;
  }
  const unknownPayors = Array.isArray(data.unknownPayors) ? data.unknownPayors : [];
  const overlappingGroups = Array.isArray(data.overlappingGroups) ? data.overlappingGroups : [];
  if (unknownPayors.length > 0) {
    renderUnknownPayors97155Prompt(unknownPayors);
    if (overlappingGroups.length === 0) {
      clearOverlapRunAllMount();
      return;
    }
    fixButtonsEl.innerHTML = '';
  }
  const {
    totalRows = 0,
    totalTableRows,
    uniqueClients = 0,
    skippedPayorRows = 0,
    skippedBlacklistRows = 0
  } = data;
  var skipParts = [];
  if (skippedBlacklistRows > 0) skipParts.push(skippedBlacklistRows + ' skipped (block list)');
  var skipOther = skippedPayorRows - skippedBlacklistRows;
  if (skipOther > 0) skipParts.push(skipOther + ' skipped (allow rules)');
  const payorNote = skipParts.length ? ' (' + skipParts.join('; ') + ')' : '';
  const rowSummary = totalTableRows != null
    ? totalTableRows + ' table rows in view, ' + totalRows + ' with 97155/97153'
    : totalRows + ' rows with 97155/97153';
  if (overlappingGroups.length === 0) {
    clearOverlapRunAllMount();
    el.innerHTML = '<p>No 97155/97153 overlapping times found.</p><p>' + rowSummary + '. ' + uniqueClients + ' unique clients.' + escapeHtml(payorNote) + '</p>';
    fixButtonsEl.innerHTML = '<p class="section-hint">No overlaps. The list will appear here when overlaps are found.</p>';
    return;
  }
  const fixable97155Groups = overlappingGroups.filter(function (g) {
    return overlapGroupIsMeaningful(g) && overlapGroupHas97153Line(g);
  });
  const partitioned97155 = partition97155MultiConcurrentGroups(fixable97155Groups);
  const regular97155Groups = partitioned97155.regular;
  const blockedMulti97155 = partitioned97155.blockedCases;
  if (fixable97155Groups.length === 0) {
    clearOverlapRunAllMount();
    const omitted = describe97155OmittedOverlapGroups(overlappingGroups);
    el.innerHTML =
      '<p>' + omitted.title + '</p>' +
      (omitted.hint ? '<p class="section-hint">' + omitted.hint + '</p>' : '') +
      '<p>' +
      rowSummary +
      '. ' +
      uniqueClients +
      ' unique clients.' +
      escapeHtml(payorNote) +
      '</p>';
    fixButtonsEl.innerHTML = '<p class="section-hint">Nothing to show for this scan.</p>';
    return;
  }
  if (regular97155Groups.length === 0 && blockedMulti97155.length > 0) {
    clearOverlapRunAllMount();
    const h3Blocked = document.createElement('h3');
    h3Blocked.textContent =
      blockedMulti97155.length +
      ' multi-concurrent case(s) · ' +
      totalRows +
      ' rows with 97155/97153' +
      payorNote;
    el.appendChild(h3Blocked);
    const subBlocked = document.createElement('p');
    subBlocked.className = 'section-hint';
    subBlocked.textContent =
      'Each row is one 97153 line with two or more 97155 concurrences. Line 1 stays billable.';
    subBlocked.style.marginTop = '4px';
    subBlocked.style.marginBottom = '8px';
    el.appendChild(subBlocked);
    render97155MultiConcurrentFixSection(blockedMulti97155, fixButtonsEl);
    mountOverlapRunAllUI('97155', [], blockedMulti97155);
    return;
  }
  const h3 = document.createElement('h3');
  const fixableCountLabel =
    regular97155Groups.length +
    ' fixable group(s)' +
    (blockedMulti97155.length > 0
      ? ', ' + blockedMulti97155.length + ' multi-concurrent'
      : '');
  const rowSummary97155 = totalTableRows != null
    ? fixableCountLabel + ' · ' + totalRows + ' rows with 97155/97153 (of ' + totalTableRows + ' table rows)' + payorNote
    : fixableCountLabel + ' · ' + totalRows + ' rows with 97155/97153' + payorNote;
  h3.textContent = rowSummary97155;
  const sub97155 = document.createElement('p');
  sub97155.className = 'section-hint';
  sub97155.textContent = 'Each fixable group = one client + one date with a single 97155 concurrent on that 97153 line.';
  sub97155.style.marginTop = '4px';
  sub97155.style.marginBottom = '8px';
  el.appendChild(h3);
  el.appendChild(sub97155);
  if (blockedMulti97155.length > 0) {
    render97155MultiConcurrentFixSection(blockedMulti97155, fixButtonsEl);
  }
  const list = document.createElement('ul');
  list.className = 'overlap-list';
  regular97155Groups.forEach((g) => {
    const fix = getOverlapFixForGroup(g);
    const overlapText = getOverlap97155Display(g);
    const clientLabel = (g.client || '(no client)').trim();
    const dateLabel = (g.date || '').trim();
    const timesLine = (g.entries || [])
      .map((e) => (e.time || '').trim() + ' ' + shortServiceCode(e.serviceAuth))
      .join(' | ');
    const thirdLineText = fix.ok ? 'Overlap ' + overlapText : 'Cannot fix';
    const thirdLineClass = fix.ok ? 'overlap-list__line' : 'overlap-list__line overlap-list__line--error';
    const typeBadge97155 = fix.ok && fix.overlapType ? ('<span class="overlap-list__type" aria-hidden="true">' + (fix.overlapType === 'middle' ? 'm' : fix.overlapType === 'start' ? 'b' : 'e') + '</span>') : '';
    const li = document.createElement('li');
    li.className = 'overlap-list__item';
    li.innerHTML =
      '<div class="overlap-list__row">' +
      '<span class="overlap-list__fix-wrap"></span>' +
      '<div class="overlap-list__lines">' +
      '<div class="overlap-list__line">' + escapeHtml(clientLabel) + ' · ' + escapeHtml(dateLabel) + '</div>' +
      '<div class="overlap-list__line">' + escapeHtml(timesLine) + '</div>' +
      '<div class="' + thirdLineClass + '">' + escapeHtml(thirdLineText) + '</div>' +
      '</div>' +
      typeBadge97155 +
      '</div>' +
      '<div class="overlap-list__fail-reason" aria-live="polite">' +
        (fix.ok
          ? ''
          : escapeHtml(
              fix.error ||
                'The 97153 time does not fully cover the other overlapping code for this group, so automatic fix is not available. Review the times manually.'
            )) +
        '</div>';
    const fixWrap = li.querySelector('.overlap-list__fix-wrap');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'overlap-btn overlap-list__fix';
    if (fix.ok) {
      btn.setAttribute('data-fix-mode', '97155');
      btn.setAttribute('data-entry-id', fix.entryId);
      btn.setAttribute('data-time-from', fix.timeFrom);
      btn.setAttribute('data-time-to', fix.timeTo);
      btn.setAttribute('data-overlap', fix.overlapText);
      btn.setAttribute('data-overlap-from', fix.overlapFrom);
      btn.setAttribute('data-overlap-to', fix.overlapTo);
      btn.setAttribute('data-part3-from', fix.part3From || '');
      btn.setAttribute('data-part3-to', fix.part3To || '');
      btn.setAttribute('data-overlap-type', fix.overlapType || 'middle');
      btn.setAttribute('data-client', g.client);
      btn.setAttribute('data-date', g.date);
      btn.setAttribute('data-original-times', timesLine);
      var logSummary97155 =
        '97155 · ' +
        clientLabel +
        ' • ' +
        dateLabel +
        ' ' +
        timesLine +
        (overlapText ? ' Overlap ' + overlapText : '');
      btn.setAttribute('data-log-summary', logSummary97155);
      btn.textContent = '';
      btn.title = 'Fix this 97155 overlap';
    } else {
      btn.textContent = '';
      btn.title = fix.error || '';
      btn.disabled = true;
    }
    fixWrap.appendChild(btn);
    list.appendChild(li);
  });
  fixButtonsEl.appendChild(list);
  mountOverlapRunAllUI('97155', regular97155Groups, blockedMulti97155);
}

function renderOverlaps(data) {
  const el = document.getElementById('overlaps-result');
  el.innerHTML = '';
  const fixButtonsEl = document.getElementById('overlap-fix-buttons');
  fixButtonsEl.innerHTML = '';
  if (data.error) {
    clearOverlapRunAllMount();
    el.innerHTML = '<p>' + escapeHtml(data.error) + '</p>';
    fixButtonsEl.innerHTML = '<p class="section-hint">Overlap list will appear here after a successful scan.</p>';
    return;
  }
  const { overlappingGroups = [], totalRows = 0, totalTableRows, uniqueClients = 0 } = data;
  const fixableGroups = (overlappingGroups || []).filter((g) => {
    if (!overlapGroupIsMeaningful(g)) return false;
    const entries = g.entries || [];
    const others = entries.filter((e) => !(e.serviceAuth || '').includes('97153'));
    return others.length > 0;
  });
  if (fixableGroups.length === 0) {
    clearOverlapRunAllMount();
    const rowSummary = totalTableRows != null
      ? totalTableRows + ' table rows in view, ' + totalRows + ' with 92507/97153'
      : totalRows + ' rows with 92507/97153';
    el.innerHTML = '<p>No overlapping times found.</p><p>' + rowSummary + '. ' + uniqueClients + ' unique clients.</p>';
    fixButtonsEl.innerHTML = '<p class="section-hint">No overlaps. The list will appear here when overlaps are found.</p>';
    return;
  }
  const h3 = document.createElement('h3');
  const rowSummary = totalTableRows != null
    ? fixableGroups.length + ' overlapping group(s) · ' + totalRows + ' rows with 92507/97153 (of ' + totalTableRows + ' table rows in view)'
    : fixableGroups.length + ' overlapping group(s) · ' + totalRows + ' rows with 92507/97153';
  h3.textContent = rowSummary;
  const sub = document.createElement('p');
  sub.className = 'section-hint';
  sub.textContent = 'Each group = one client + one date where two or more entries have overlapping times.';
  sub.style.marginTop = '4px';
  sub.style.marginBottom = '8px';
  el.appendChild(h3);
  el.appendChild(sub);
  const list = document.createElement('ul');
  list.className = 'overlap-list';
  fixableGroups.forEach((g) => {
    const fix = getOverlapFixForGroup(g);
    const clientLabel = (g.client || '(no client)').trim();
    const dateLabel = (g.date || '').trim();
    const timesLine = (g.entries || [])
      .map((e) => (e.time || '').trim() + ' ' + shortServiceCode(e.serviceAuth))
      .join(' | ');
    const overlapLine = fix.ok ? 'Overlap ' + escapeHtml(fix.overlapText) : 'Cannot fix';
    const failReasonText = fix.ok
      ? ''
      : fix.error ||
        'The 97153 time does not fully cover the other overlapping code for this group, so automatic fix is not available. Review the times manually.';
    const li = document.createElement('li');
    li.className = 'overlap-list__item';
    const typeBadge = fix.ok && fix.overlapType ? ('<span class="overlap-list__type" aria-hidden="true">' + (fix.overlapType === 'middle' ? 'm' : fix.overlapType === 'start' ? 'b' : 'e') + '</span>') : '';
    li.innerHTML =
      '<div class="overlap-list__row">' +
      '<span class="overlap-list__fix-wrap"></span>' +
      '<div class="overlap-list__lines">' +
      '<div class="overlap-list__line">' + escapeHtml(clientLabel) + ' · ' + escapeHtml(dateLabel) + '</div>' +
      '<div class="overlap-list__line">' + escapeHtml(timesLine) + '</div>' +
      '<div class="overlap-list__line' + (fix.ok ? '' : ' overlap-list__line--error') + '">' + overlapLine + '</div>' +
      '</div>' +
      typeBadge +
      '</div>' +
      '<div class="overlap-list__fail-reason" aria-live="polite">' + escapeHtml(failReasonText) + '</div>';
    const fixWrap = li.querySelector('.overlap-list__fix-wrap');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'overlap-btn overlap-list__fix';
    if (fix.ok) {
      btn.setAttribute('data-entry-id', fix.entryId);
      btn.setAttribute('data-time-from', fix.timeFrom);
      btn.setAttribute('data-time-to', fix.timeTo);
      btn.setAttribute('data-overlap', fix.overlapText);
      btn.setAttribute('data-overlap-from', fix.overlapFrom);
      btn.setAttribute('data-overlap-to', fix.overlapTo);
      btn.setAttribute('data-part3-from', fix.part3From || '');
      btn.setAttribute('data-part3-to', fix.part3To || '');
      btn.setAttribute('data-overlap-type', fix.overlapType || 'middle');
      btn.setAttribute('data-client', g.client);
      btn.setAttribute('data-date', g.date);
      btn.setAttribute('data-original-times', timesLine);
      var logSummarySpeech =
        'speech · ' +
        clientLabel +
        ' • ' +
        dateLabel +
        ' ' +
        timesLine +
        (fix.overlapText ? ' Overlap ' + fix.overlapText : '');
      btn.setAttribute('data-log-summary', logSummarySpeech);
      btn.textContent = '';
      btn.title = 'Fix this overlap';
    } else {
      btn.textContent = '';
      btn.title = fix.error || '';
      btn.disabled = true;
    }
    fixWrap.appendChild(btn);
    list.appendChild(li);
  });
  fixButtonsEl.appendChild(list);
  mountOverlapRunAllUI('speech', fixableGroups);
}

function renderTimesheet(data) {
  const el = document.getElementById('timesheet-result');
  el.innerHTML = '';
  if (data.error) {
    el.innerHTML = '<p>' + escapeHtml(data.error) + '</p>';
    return;
  }
  const h3 = document.createElement('h3');
  h3.textContent = 'Time sheet';
  el.appendChild(h3);
  const fields = [
    ['Date of service', data.dateOfService],
    ['Authorization', data.authorization],
    ['Time worked (start)', data.timeWorkedFrom],
    ['Time worked (end)', data.timeWorkedTo],
    ['Units of service', data.unitsOfService],
    ['Place of service', data.placeOfService],
    ['Service address', data.serviceAddressText || data.serviceAddress]
  ];
  fields.forEach(([name, value]) => {
    if (value === undefined || value === '') return;
    const div = document.createElement('div');
    div.className = 'field';
    div.innerHTML = '<span class="field-name">' + escapeHtml(name) + '</span>: ' + escapeHtml(String(value));
    el.appendChild(div);
  });
}

/** Push allow/block payor lists into the page MAIN world (POEL overlap scan reads them there). */
async function prime97155PayorFiltersOnTab(tabId) {
  await execScript({
    target: { tabId: tabId },
    world: 'MAIN',
    func: function (allowed, blocked) {
      window.__97155AllowedPayors = allowed;
      window.__97155BlockedPayors = blocked;
    },
    args: [getAllowedPayors(), getBlockedPayors()]
  });
}

/** Run overlap scan only (no scrolling). resultKey: '97155' = 97155/97153 scan, null = Speech 92507/97153 scan. */
async function runOverlapScanOnly(tab, resultKey) {
  await _ensureSettingsLoaded();
  if (resultKey === '97155') {
    await prime97155PayorFiltersOnTab(tab.id);
  }
  if (typeof window.SHELL !== 'undefined' && window.SHELL.runOverlapScan) {
    return window.SHELL.runOverlapScan(resultKey);
  }
  const scanFile = resultKey === '97155' ? 'inject-overlaps-97155.js' : 'inject-overlaps.js';
  await execScript({ target: { tabId: tab.id }, files: [scanFile] });
  const results = await execScript({
    target: { tabId: tab.id },
    func: (key) => (key === '97155' ? window.__overlaps97155Result : window.__overlapsResult),
    args: [resultKey]
  });
  return results && results[0] && results[0].result;
}

async function runFindOverlaps() {
  const resultEl = document.getElementById('overlaps-result');
  const fixButtonsEl = document.getElementById('overlap-fix-buttons');
  resultEl.innerHTML = '<p>Scanning...</p>';
  if (fixButtonsEl) fixButtonsEl.innerHTML = '';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    const data = await runOverlapScanOnly(tab, null);
    if (!data) {
      resultEl.innerHTML = '<p>No result. Make sure you are on the billing table page.</p>';
      document.getElementById('overlap-fix-buttons').innerHTML = '<p class="section-hint">Scan failed. Open the billing table and try again.</p>';
      return;
    }
    lastOverlapScanPageUrl = tab.url || null;
    lastOverlapScanMode = 'speech';
    renderOverlaps(data);
    log('Overlaps: ' + (data.overlappingGroups || []).length + ' group(s)');
  } catch (e) {
    log('Error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
    document.getElementById('overlap-fix-buttons').innerHTML = '<p class="section-hint">Error. Try again.</p>';
  }
}

/** Set the clicked Concurances button as active (blue); the other in the same panel becomes grey. */
function setConcuranceScanActive(activeBtn) {
  const container = activeBtn && activeBtn.closest('.buttons');
  if (!container) return;
  container.querySelectorAll('.concurance-scan-btn').forEach((btn) => {
    btn.classList.toggle('is-active', btn === activeBtn);
  });
}

document.getElementById('texas-overlaps-manual').addEventListener('click', () => {
  setConcuranceScanActive(document.getElementById('texas-overlaps-manual'));
  log('Texas overlaps (manual) — 97155 concurrents scan');
  runFindOverlaps97155();
});

document.getElementById('texas-overlaps-scan').addEventListener('click', () => {
  setConcuranceScanActive(document.getElementById('texas-overlaps-scan'));
  log('Texas overlaps — 97155 concurrents scan');
  runFindOverlaps97155();
});

async function runFindOverlaps97155() {
  const resultEl = document.getElementById('overlaps-result');
  const fixButtonsEl = document.getElementById('overlap-fix-buttons');
  if (resultEl) resultEl.innerHTML = '<p>Scanning for 97155/53...</p>';
  if (fixButtonsEl) fixButtonsEl.innerHTML = '';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      if (resultEl) resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      if (resultEl) resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    const data = await runOverlapScanOnly(tab, '97155');
    if (!data) {
      if (resultEl) resultEl.innerHTML = '<p>No result. Make sure you are on the billing table page.</p>';
      if (fixButtonsEl) fixButtonsEl.innerHTML = '<p class="section-hint">Scan failed. Open the billing table and try again.</p>';
      return;
    }
    lastOverlapScanPageUrl = tab.url || null;
    lastOverlapScanMode = '97155';
    renderOverlaps97155(data);
    const nGroups = (data.overlappingGroups || []).length;
    const nFixable = (data.overlappingGroups || []).filter(function (g) {
      return overlapGroupIsMeaningful(g) && overlapGroupHas97153Line(g);
    }).length;
    const nUnknown = (data.unknownPayors || []).length;
    let scanSummary = '97155 Overlaps: ' + nGroups + ' group(s), ' + nFixable + ' fixable';
    if (nUnknown > 0) {
      scanSummary += ', ' + nUnknown + ' payor(s) need allow/block';
    }
    if (nGroups > 0 && nFixable === 0) {
      const hasChain = (data.overlappingGroups || []).some(function (g) {
        return overlapGroupHas97153Line(g) && !overlapGroupIsMeaningful(g);
      });
      scanSummary += hasChain
        ? ' (chain-linked groups — no shared overlap window)'
        : ' (groups found but none include a fixable 97153 overlap)';
    }
    log(scanSummary);
  } catch (e) {
    log('Error: ' + e.message);
    if (resultEl) resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
    if (fixButtonsEl) fixButtonsEl.innerHTML = '<p class="section-hint">Error. Try again.</p>';
  }
}

document.getElementById('read-timesheet').addEventListener('click', async () => {
  log('Read Time Sheet clicked');
  const resultEl = document.getElementById('timesheet-result');
  resultEl.innerHTML = '<p>Reading timesheet...</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({
      target: { tabId: tab.id },
      files: ['inject-service-line-tab-count.js', 'inject-read-timesheet.js']
    });
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__timesheetResult
    });
    const data = results && results[0] && results[0].result;
    if (!data) {
      resultEl.innerHTML = '<p>No result. Open a timesheet editor page first.</p>';
      return;
    }
    renderTimesheet(data);
    log('Time sheet read.');
  } catch (e) {
    log('Error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('add-service-line').addEventListener('click', async () => {
  log('Add Service Line clicked');
  const resultEl = document.getElementById('add-service-line-result');
  resultEl.innerHTML = '<p>Adding service line...</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({
      target: { tabId: tab.id },
      files: ['inject-service-line-tab-count.js', 'inject-add-service-line.js']
    });
    await new Promise(function (r) { setTimeout(r, 550); });
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__addServiceLineResult
    });
    const data = results && results[0] && results[0].result;
    if (!data) {
      resultEl.innerHTML = '<p>No result. Open a timesheet editor first.</p>';
      log('Add Service Line: no result');
      return;
    }
    if (data.error) {
      resultEl.innerHTML = '<p>' + escapeHtml(data.error) + '</p>';
      log('Add Service Line: ' + data.error);
      return;
    }
    const before = data.countBefore;
    const after = data.countAfter;
    resultEl.innerHTML = '<p><strong>Added.</strong> Service lines: <strong>' + after + '</strong>' + (before !== after ? ' (was ' + before + ').' : '.') + '</p>';
    log('Add Service Line: now ' + after + ' service line(s)');
  } catch (e) {
    log('Error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('select-nonbillable-code').addEventListener('click', async () => {
  log('Select nonbillable code clicked');
  const resultEl = document.getElementById('select-nonbillable-code-result');
  resultEl.innerHTML = '<p>Opening Service Codes and selecting...</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({ target: { tabId: tab.id }, files: ['inject-select-service-codes.js'] });
    await new Promise(function (r) { setTimeout(r, 950); });
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__selectServiceCodesResult
    });
    const data = results && results[0] && results[0].result;
    if (!data) {
      resultEl.innerHTML = '<p>No result yet. Try again or open a timesheet editor first.</p>';
      log('Select nonbillable code: no result');
      return;
    }
    if (data.error) {
      resultEl.innerHTML = '<p>' + escapeHtml(data.error) + '</p>';
      log('Select nonbillable code: ' + data.error);
      return;
    }
    resultEl.innerHTML =
      '<p>Clicked <strong>' +
      data.clicked +
      '</strong> matching code(s) (CONCURRENT: Nonbillable supervision time).</p>';
    log('Select nonbillable code: clicked ' + data.clicked);
  } catch (e) {
    log('Error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('click-billable-97153').addEventListener('click', async () => {
  log('97153 (billable) clicked');
  const resultEl = document.getElementById('click-billable-97153-result');
  resultEl.innerHTML = '<p>Clicking 97153...</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({ target: { tabId: tab.id }, files: ['inject-click-billable-97153.js'] });
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__clickBillable97153Result
    });
    const data = results && results[0] && results[0].result;
    if (!data) {
      resultEl.innerHTML = '<p>No result. Open the billable tab first.</p>';
      log('97153: no result');
      return;
    }
    if (data.error) {
      resultEl.innerHTML = '<p>' + escapeHtml(data.error) + '</p>';
      log('97153: ' + data.error);
      return;
    }
    resultEl.innerHTML = '<p>Clicked <strong>97153</strong>.</p>';
    log('97153: clicked');
  } catch (e) {
    log('Error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('select-payor-option').addEventListener('click', async () => {
  log('Select payor option (' + PAYOR_OPTION_MATCH + ') clicked');
  const resultEl = document.getElementById('select-payor-option-result');
  resultEl.innerHTML = '<p>Selecting &hellip;</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({
      target: { tabId: tab.id },
      func: function (m) { window.__payorOptionMatch = m; },
      args: [PAYOR_OPTION_MATCH]
    });
    const data = await runInjectPayorSelect(tab.id);
    logRemoteInjectDebug('Payor manual', data);
    if (!data) {
      resultEl.innerHTML =
        '<p>Open the timesheet to the step where you choose <strong>insurance payor</strong> or <strong>provider education level</strong> (the Master vs Associate style choices), then click this button again.</p>';
      log('Payor option: no result');
      logPayorResultPayload('Payor', 'manual', data);
      logPayorSelectDebug(data, 'manual', 'Payor');
      return;
    }
    if (data.error || !data.success) {
      resultEl.innerHTML = '<p>' + escapeHtml(messageForPayorSelectFailure(data)) + '</p>';
      log('Payor option: ' + (data.error || 'failed'));
      logPayorResultPayload('Payor', 'manual', data);
      logPayorSelectDebug(data, 'manual', 'Payor');
      return;
    }
    if (data.skipped) {
      if (data.debug && data.debug.shippedStub) {
        resultEl.innerHTML =
          '<p>The shipped panel does not bundle payor/education DOM logic. With <strong>POEL</strong>, publish <code>inject-select-payor-option</code> from your project scripts; each automation run fetches the latest file (cache-bust). Use <strong>Update</strong> in the shell for new config — you do not need to reload the Chrome extension.</p>';
        log('Payor option: local stub only (host inject-select-payor-option remotely).');
        logRemoteInjectDebug('Payor manual', data);
        return;
      }
      resultEl.innerHTML =
        '<p>This screen does not show payor or education-level choices, so we <strong>skipped</strong> that step. That is normal on some lines.</p>';
      log('Payor option: skipped (no tier UI)');
      logPayorResultPayload('Payor', 'manual', data);
      logPayorSelectDebug(data, 'manual', 'Payor');
      logRemoteInjectDebug('Payor manual', data);
      return;
    }
    resultEl.innerHTML = '<p>Clicked option containing "<strong>' + escapeHtml(data.matchedText || PAYOR_OPTION_MATCH) + '</strong>".</p>';
    log('Payor option: clicked ' + (data.matchedText || PAYOR_OPTION_MATCH));
  } catch (e) {
    log('Error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('click-existing-note').addEventListener('click', async () => {
  log('Click existing note clicked');
  const resultEl = document.getElementById('click-existing-note-result');
  resultEl.innerHTML = '<p>Clicking...</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({ target: { tabId: tab.id }, files: ['inject-click-existing-note.js'] });
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__clickExistingNoteResult
    });
    const data = results && results[0] && results[0].result;
    if (!data) {
      resultEl.innerHTML = '<p>No result. Open a timesheet with notes first.</p>';
      log('Click existing note: no result');
      return;
    }
    if (data.error) {
      resultEl.innerHTML = '<p>' + escapeHtml(data.error) + '</p>';
      log('Click existing note: ' + data.error);
      return;
    }
    resultEl.innerHTML = '<p>Clicked <strong>SELECT EXISTING NOTE</strong>.</p>';
    log('Click existing note: OK');
  } catch (e) {
    log('Error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('click-note-by-date-name').addEventListener('click', async () => {
  log('Click note (' + NOTE_MATCH_DATE + ' ' + NOTE_MATCH_NAME + ') clicked');
  const resultEl = document.getElementById('click-note-by-date-name-result');
  resultEl.innerHTML = '<p>Finding note...</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({
      target: { tabId: tab.id },
      func: function (d, n) { window.__noteMatchDate = d; window.__noteMatchName = n; },
      args: [NOTE_MATCH_DATE, NOTE_MATCH_NAME]
    });
    await execScript({ target: { tabId: tab.id }, files: ['inject-click-note-by-date-name.js'] });
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__clickNoteByDateNameResult
    });
    const data = results && results[0] && results[0].result;
    if (!data) {
      resultEl.innerHTML = '<p>No result. Click "Click existing note" first to open the list.</p>';
      log('Click note: no result');
      return;
    }
    if (data.error) {
      resultEl.innerHTML = '<p>' + escapeHtml(data.error) + '</p>';
      log('Click note: ' + data.error);
      return;
    }
    resultEl.innerHTML = '<p>Clicked note: <strong>' + escapeHtml(NOTE_MATCH_DATE + ' ' + NOTE_MATCH_NAME) + '</strong>.</p>';
    log('Click note: OK');
  } catch (e) {
    log('Error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('selected-backup-notes').addEventListener('click', async () => {
  log('Selected backup notes clicked');
  const resultEl = document.getElementById('selected-backup-notes-result');
  resultEl.innerHTML = '<p>Opening session note picker…</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({
      target: { tabId: tab.id },
      func: function (snippet) {
        window.__backupNoteRowSnippet = snippet;
      },
      args: [BACKUP_NOTE_ROW_SNIPPET],
    });
    await execScript({ target: { tabId: tab.id }, files: ['inject-select-existing-session-note-flow.js'] });
    const data = await pollForInjectResult(tab.id, '__selectExistingSessionNoteFlowResult', 16000, 250);
    if (!data) {
      resultEl.innerHTML = '<p>No result. Open a timesheet line with session notes.</p>';
      log('Selected backup notes: no result');
      return;
    }
    if (data.error) {
      resultEl.innerHTML = '<p>' + escapeHtml(data.error) + '</p>';
      log('Selected backup notes: ' + data.error);
      return;
    }
    resultEl.innerHTML =
      '<p>Selected session note matching <strong>' + escapeHtml(BACKUP_NOTE_ROW_SNIPPET) + '</strong>.</p>';
    log('Selected backup notes: OK');
  } catch (e) {
    log('Error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('click-close-note').addEventListener('click', async () => {
  log('Close note clicked');
  const resultEl = document.getElementById('click-close-note-result');
  resultEl.innerHTML = '<p>Closing...</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({ target: { tabId: tab.id }, files: ['inject-click-close-note.js'] });
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__clickCloseNoteResult
    });
    const data = results && results[0] && results[0].result;
    if (!data) {
      resultEl.innerHTML = '<p>No result.</p>';
      log('Close note: no result');
      return;
    }
    if (data.error) {
      resultEl.innerHTML = '<p>' + escapeHtml(data.error) + '</p>';
      log('Close note: ' + data.error);
      return;
    }
    resultEl.innerHTML = '<p>Clicked <strong>CLOSE</strong>.</p>';
    log('Close note: OK');
  } catch (e) {
    log('Error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('click-provider-name').addEventListener('click', async () => {
  log('Click provider name');
  const resultEl = document.getElementById('click-provider-name-result');
  resultEl.innerHTML = '<p>Clicking provider name on first row...</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({ target: { tabId: tab.id }, files: ['inject-click-provider-name.js'] });
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__clickProviderNameResult
    });
    const data = results && results[0] && results[0].result;
    if (!data) {
      resultEl.innerHTML = '<p>No result. Open the billing list page first.</p>';
      log('Click provider name: no result');
      return;
    }
    if (data.error) {
      resultEl.innerHTML = '<p>' + escapeHtml(data.error) + '</p>';
      log('Click provider name: ' + data.error);
      return;
    }
    resultEl.innerHTML = '<p>Clicked provider: <strong>' + escapeHtml(data.name || '') + '</strong></p>';
    log('Click provider name: OK');
  } catch (e) {
    log('Error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('read-contact-labels').addEventListener('click', async () => {
  log('Read labels');
  const resultEl = document.getElementById('read-contact-labels-result');
  resultEl.innerHTML = '<p>Reading labels from contact card...</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({ target: { tabId: tab.id }, files: ['inject-read-contact-labels.js'] });
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__readContactLabelsResult
    });
    const data = results && results[0] && results[0].result;
    if (!data) {
      resultEl.innerHTML = '<p>No result. Open a contact card first, then click Read labels.</p>';
      log('Read labels: no result');
      return;
    }
    if (data.error) {
      resultEl.innerHTML = '<p>' + escapeHtml(data.error) + '</p>';
      log('Read labels: ' + data.error);
      return;
    }
    const labels = data.labels || [];
    resultEl.innerHTML = '<p><strong>Labels (' + labels.length + '):</strong></p><ul style="margin: 4px 0 0 0; padding-left: 18px;">' +
      labels.map(function (l) { return '<li>' + escapeHtml(l) + '</li>'; }).join('') + '</ul>';
    log('Read labels: ' + labels.length + ' label(s)');
  } catch (e) {
    log('Error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('close-contact-card').addEventListener('click', async () => {
  log('Close contact card');
  const resultEl = document.getElementById('close-contact-card-result');
  resultEl.innerHTML = '<p>Closing contact card...</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({ target: { tabId: tab.id }, files: ['inject-close-contact-card.js'] });
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__closeContactCardResult
    });
    const data = results && results[0] && results[0].result;
    if (!data) {
      resultEl.innerHTML = '<p>No result. Open the billing list page first.</p>';
      log('Close contact card: no result');
      return;
    }
    if (data.error) {
      resultEl.innerHTML = '<p>' + escapeHtml(data.error) + '</p>';
      log('Close contact card: ' + data.error);
      return;
    }
    resultEl.innerHTML = '<p>Clicked row cell to close the card.</p>';
    log('Close contact card: OK');
  } catch (e) {
    log('Error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('provider-combo').addEventListener('click', async () => {
  log('Provider combo');
  const resultEl = document.getElementById('provider-combo-result');
  resultEl.innerHTML = '<p>Opening provider card, waiting for load, reading labels, closing...</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({ target: { tabId: tab.id }, files: ['inject-provider-combo.js'] });
    const maxWait = 5000;
    const pollMs = 400;
    let data = null;
    for (let elapsed = 0; elapsed < maxWait; elapsed += pollMs) {
      await new Promise(function (r) { setTimeout(r, pollMs); });
      const results = await execScript({
        target: { tabId: tab.id },
        func: () => window.__providerComboResult
      });
      data = results && results[0] && results[0].result;
      if (data) break;
    }
    if (!data) {
      resultEl.innerHTML = '<p>No result yet. Try again on the billing list page.</p>';
      log('Provider combo: no result');
      return;
    }
    if (data.error) {
      resultEl.innerHTML = '<p>' + escapeHtml(data.error) + '</p>';
      log('Provider combo: ' + data.error);
      return;
    }
    const labels = data.labels || [];
    resultEl.innerHTML = '<p><strong>Done.</strong> Labels (' + labels.length + '):</p><ul style="margin: 4px 0 0 0; padding-left: 18px;">' +
      labels.map(function (l) { return '<li>' + escapeHtml(l) + '</li>'; }).join('') + '</ul>';
    log('Provider combo: ' + labels.length + ' label(s)');
  } catch (e) {
    log('Error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('set-date-today').addEventListener('click', async () => {
  log('Set Date (1 month ago) clicked');
  const resultEl = document.getElementById('set-date-result');
  resultEl.innerHTML = '<p>Setting date...</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    const target = new Date();
    target.setMonth(target.getMonth() - 1);
    const dateStr = String(target.getMonth() + 1).padStart(2, '0') + '/' + String(target.getDate()).padStart(2, '0') + '/' + target.getFullYear();
    await execScript({
      target: { tabId: tab.id },
      func: function (d) { window.__dateOfServiceValue = d; },
      args: [dateStr]
    });
    await execScript({ target: { tabId: tab.id }, files: ['inject-set-date-of-service.js'] });
    await new Promise(function (r) { setTimeout(r, SET_DATE_INJECT_SETTLE_MS); });
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__setDateOfServiceResult
    });
    const data = results && results[0] && results[0].result;
    if (!data) {
      resultEl.innerHTML = '<p>No result. Open a timesheet editor first.</p>';
      log('Set Date: no result');
      return;
    }
    if (data.error) {
      resultEl.innerHTML = '<p>' + escapeHtml(data.error) + '</p>';
      log('Set Date: ' + data.error);
      return;
    }
    resultEl.innerHTML = '<p>Date of service set to <strong>' + escapeHtml(data.dateSet) + '</strong>.</p>';
    log('Set Date: ' + data.dateSet);
  } catch (e) {
    log('Error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('enter-times').addEventListener('click', async () => {
  log('Enter times clicked');
  const resultEl = document.getElementById('enter-times-result');
  resultEl.innerHTML = '<p>Entering times...</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await primeEnterTimesDefaults(tab.id);
    await execScript({ target: { tabId: tab.id }, files: ['inject-enter-times.js'] });
    await new Promise(function (r) { setTimeout(r, 260); });
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__enterTimesResult
    });
    const data = results && results[0] && results[0].result;
    if (!data) {
      resultEl.innerHTML = '<p>No result. Open a timesheet editor first.</p>';
      log('Enter times: no result');
      return;
    }
    if (data.error) {
      resultEl.innerHTML = '<p>' + escapeHtml(data.error) + '</p>';
      log('Enter times: ' + data.error);
      return;
    }
    var wasFrom = (data.wasFrom != null ? data.wasFrom : '(empty)');
    var wasTo = (data.wasTo != null ? data.wasTo : '(empty)');
    resultEl.innerHTML = '<p>Was: ' + escapeHtml(wasFrom) + ' – ' + escapeHtml(wasTo) + '.<br>Now: <strong>02:00 PM</strong> – <strong>03:30 PM</strong>.</p>';
    log('Enter times: was ' + wasFrom + ' – ' + wasTo + ', now 02:00 PM – 03:30 PM');
  } catch (e) {
    log('Error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('set-timesheet-timezone').addEventListener('click', async () => {
  log('Set time zone clicked (match: Alaska)');
  const resultEl = document.getElementById('set-timesheet-timezone-result');
  resultEl.innerHTML = '<p>Selecting timezone…</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({
      target: { tabId: tab.id },
      func: () => {
        window.__timesheetTimezoneMatch = 'alaska';
      }
    });
    await execScript({ target: { tabId: tab.id }, files: ['inject-set-timesheet-timezone.js'] });
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__setTimesheetTimezoneResult
    });
    const data = results && results[0] && results[0].result;
    if (!data) {
      resultEl.innerHTML = '<p>No result. Open a timesheet with the timezone dropdown.</p>';
      log('Set time zone: no result');
      return;
    }
    if (!data.success) {
      resultEl.innerHTML = '<p>' + escapeHtml(data.error || 'Failed.') + '</p>';
      log('Set time zone: ' + (data.error || 'failed'));
      return;
    }
    resultEl.innerHTML =
      '<p>Set to <strong>' +
      escapeHtml(data.label || data.value || '') +
      '</strong> <code>' +
      escapeHtml(data.value || '') +
      '</code> (matched <em>' +
      escapeHtml(data.match || 'alaska') +
      '</em>).</p>';
    log('Set time zone: ' + (data.value || '') + ' — ' + (data.label || ''));
  } catch (e) {
    log('Error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('select-place-of-service').addEventListener('click', async () => {
  log('Place of service (' + PLACE_OF_SERVICE_MATCH + ') clicked');
  const resultEl = document.getElementById('select-place-of-service-result');
  resultEl.innerHTML = '<p>Selecting...</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({
      target: { tabId: tab.id },
      func: function (m) { window.__placeOfServiceMatch = m; },
      args: [PLACE_OF_SERVICE_MATCH]
    });
    await execScript({ target: { tabId: tab.id }, files: ['inject-select-place-of-service.js'] });
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__selectPlaceOfServiceResult
    });
    const data = results && results[0] && results[0].result;
    if (!data) {
      resultEl.innerHTML = '<p>No result. Open a timesheet editor first.</p>';
      log('Place of service: no result');
      return;
    }
    if (data.error) {
      resultEl.innerHTML = '<p>' + escapeHtml(data.error) + '</p>';
      log('Place of service: ' + data.error);
      return;
    }
    resultEl.innerHTML = '<p>Place of service: <strong>' + escapeHtml(data.text || data.value || data.matchedText) + '</strong>.</p>';
    log('Place of service: ' + (data.text || data.value));
  } catch (e) {
    log('Error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('select-service-address').addEventListener('click', async () => {
  log('Service address (' + SERVICE_ADDRESS_MATCH + ') clicked');
  const resultEl = document.getElementById('select-service-address-result');
  resultEl.innerHTML = '<p>Selecting...</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({
      target: { tabId: tab.id },
      func: function (m) { window.__serviceAddressMatch = m; },
      args: [SERVICE_ADDRESS_MATCH]
    });
    await execScript({ target: { tabId: tab.id }, files: ['inject-select-service-address.js'] });
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__selectServiceAddressResult
    });
    const data = results && results[0] && results[0].result;
    if (!data) {
      resultEl.innerHTML = '<p>No result. Open a timesheet editor first.</p>';
      log('Service address: no result');
      return;
    }
    if (data.error) {
      resultEl.innerHTML = '<p>' + escapeHtml(data.error) + '</p>';
      log('Service address: ' + data.error);
      return;
    }
    resultEl.innerHTML = '<p>Service address: <strong>' + escapeHtml(data.text || data.value || data.matchedText) + '</strong>.</p>';
    log('Service address: ' + (data.text || data.value));
  } catch (e) {
    log('Error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('edit-timesheet').addEventListener('click', async () => {
  log('Edit Timesheet clicked');
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      log('Cannot run on this page.');
      return;
    }
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => {
        const row = document.querySelector('tr[id^="billing-grid-row-"]');
        if (!row) return { error: 'No billing row found' };
        const id = (row.getAttribute('id') || '').replace(/^billing-grid-row-/, '');
        if (!id) return { error: 'No entry id in row' };
        window.location.hash = 'billingmanager/timesheeteditor/?&id=' + id;
        return { success: true, id: id };
      }
    });
    const data = results && results[0] && results[0].result;
    if (data && data.error) {
      log('Edit Timesheet: ' + data.error);
      return;
    }
    if (data && data.success) {
      log('Opened timesheet for entry ' + data.id);
    }
  } catch (e) {
    log('Error: ' + e.message);
    console.error('[Hidden Lights sidepanel]', e);
  }
});

let editTimesheetReadyMonitorId = null;

function setEditTimesheetReadyStatusEl(el, state, message) {
  if (!el) return;
  el.classList.remove(
    'edit-timesheet-ready-status--idle',
    'edit-timesheet-ready-status--ready',
    'edit-timesheet-ready-status--not-ready',
    'edit-timesheet-ready-status--loading'
  );
  if (state === 'ready') {
    el.classList.add('edit-timesheet-ready-status--ready');
  } else if (state === 'not-ready') {
    el.classList.add('edit-timesheet-ready-status--not-ready');
  } else if (state === 'loading') {
    el.classList.add('edit-timesheet-ready-status--loading');
  } else {
    el.classList.add('edit-timesheet-ready-status--idle');
  }
  el.textContent = message;
}

/**
 * Page probe: billing rows + Knockout list/invoice loading overlay (.overlay-loading).
 * Static HTML often looks the same; visible: binding toggles display at runtime.
 */
async function probeBillingGridRowsForEditTimesheet(tabId, injectOpts) {
  const inject = {
    target: { tabId: tabId },
    func: () => {
      function isOverlayLoadingVisible(el) {
        if (!el) return false;
        if (typeof el.checkVisibility === 'function') {
          try {
            return el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
          } catch (e) {
            /* fall through */
          }
        }
        const s = window.getComputedStyle(el);
        return (
          s.display !== 'none' &&
          s.visibility !== 'hidden' &&
          parseFloat(s.opacity) > 0
        );
      }
      const overlay = document.querySelector('.overlay-loading');
      const rows = document.querySelectorAll('tr[id^="billing-grid-row-"]');
      return {
        rowCount: rows.length,
        ready: rows.length > 0,
        overlayFound: !!overlay,
        listLoading: isOverlayLoadingVisible(overlay)
      };
    }
  };
  if (injectOpts && injectOpts.world === 'MAIN') {
    inject.world = 'MAIN';
  }
  const results = await execScript(inject);
  return results && results[0] ? results[0].result : null;
}

document.getElementById('check-edit-timesheet-ready').addEventListener('click', async () => {
  const btn = document.getElementById('check-edit-timesheet-ready');
  const statusEl = document.getElementById('edit-timesheet-ready-status');

  if (editTimesheetReadyMonitorId !== null) {
    clearInterval(editTimesheetReadyMonitorId);
    editTimesheetReadyMonitorId = null;
    btn.textContent = 'Watch grid load';
    btn.classList.remove('is-monitoring');
    setEditTimesheetReadyStatusEl(statusEl, 'idle', '—');
    log('Stopped watching billing grid');
    return;
  }

  btn.textContent = 'Stop watching';
  btn.classList.add('is-monitoring');
  log('Watching billing grid (same check as Edit Timesheet)…');

  async function tick() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) {
        setEditTimesheetReadyStatusEl(statusEl, 'not-ready', 'No active tab');
        return;
      }
      if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
        setEditTimesheetReadyStatusEl(statusEl, 'not-ready', 'Not a web page');
        return;
      }
      const data = await probeBillingGridRowsForEditTimesheet(tab.id);
      if (!data) {
        setEditTimesheetReadyStatusEl(statusEl, 'not-ready', 'Could not read page');
        return;
      }
      if (data.listLoading) {
        setEditTimesheetReadyStatusEl(
          statusEl,
          'loading',
          'Loading — .overlay-loading is visible (list or invoice creator spinner). Wait…'
        );
        return;
      }
      if (data.ready) {
        const n = data.rowCount;
        const label = n === 1 ? '1 row' : n + ' rows';
        const suffix = data.overlayFound ? '' : ' (no .overlay-loading on page)';
        setEditTimesheetReadyStatusEl(
          statusEl,
          'ready',
          'Ready — billing grid loaded (' + label + '). Edit Timesheet will work.' + suffix
        );
      } else {
        const hint = data.overlayFound
          ? 'Spinner off, but no billing rows yet.'
          : 'No billing rows; .overlay-loading not found (wrong page?).';
        setEditTimesheetReadyStatusEl(
          statusEl,
          'not-ready',
          'Not ready — ' + hint + ' Edit Timesheet not ready.'
        );
      }
    } catch (e) {
      setEditTimesheetReadyStatusEl(statusEl, 'not-ready', 'Error: ' + (e.message || String(e)));
    }
  }

  await tick();
  editTimesheetReadyMonitorId = setInterval(tick, 1000);
});

function parseBillingManagerListHash(tabUrl) {
  try {
    const u = new URL(tabUrl);
    const host = (u.hostname || '').toLowerCase();
    if (!host.includes('centralreach.com')) {
      return { error: 'Open a CentralReach members tab (billing list).' };
    }
    let h = u.hash || '';
    if (h.startsWith('#')) h = h.slice(1);
    if (!h.includes('billingmanager/billing')) {
      return { error: 'Hash must include billingmanager/billing (billing list).' };
    }
    const q = h.indexOf('?');
    const path = q >= 0 ? h.slice(0, q) : h;
    const search = q >= 0 ? h.slice(q + 1) : '';
    return { path: path, params: new URLSearchParams(search) };
  } catch (e) {
    return { error: e.message || String(e) };
  }
}

function buildBillingListHash(path, params) {
  return '#' + path + '?' + params.toString();
}

async function navigateBillingListHash(tabId, fullHash) {
  await execScript({
    target: { tabId: tabId },
    world: 'MAIN',
    func: (h) => {
      window.location.hash = h;
    },
    args: [fullHash]
  });
}

/**
 * Billing filters: MUI primary “Apply” after hash/query changes.
 */
async function clickBillingApplyButton(tabId) {
  const results = await execScript({
    target: { tabId: tabId },
    world: 'MAIN',
    func: () => {
      function btnVisible(btn) {
        if (!btn || btn.disabled) return false;
        if (typeof btn.checkVisibility === 'function') {
          try {
            return btn.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
          } catch (e) {
            /* fall through */
          }
        }
        const s = window.getComputedStyle(btn);
        return (
          s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity) > 0
        );
      }
      const labels = document.querySelectorAll('.MuiButton-label');
      for (let i = 0; i < labels.length; i++) {
        const span = labels[i];
        if ((span.textContent || '').trim() !== 'Apply') continue;
        const btn = span.closest('button');
        if (btn && btnVisible(btn)) {
          btn.click();
          return { ok: true, via: 'mui-label-exact' };
        }
      }
      const buttons = document.querySelectorAll('button.MuiButton-root');
      for (let j = 0; j < buttons.length; j++) {
        const b = buttons[j];
        const t = (b.textContent || '').replace(/\s+/g, ' ').trim();
        if (!/\bApply\b/.test(t)) continue;
        if (btnVisible(b)) {
          b.click();
          return { ok: true, via: 'mui-button-text' };
        }
      }
      return { ok: false, reason: 'apply-not-found' };
    }
  });
  const r = results && results[0] && results[0].result;
  if (!r) return { ok: false, reason: 'no-result' };
  return r;
}

/**
 * Same “loading?” signal as Watch grid load: probe until listLoading is false (overlay gone).
 * Used after each Next click while walking.
 */
async function waitForBillingGridWatchSettled(tabId, injectOpts) {
  const deadline = Date.now() + BILLING_PAGE_WALK_LOAD_TIMEOUT_MS;
  let last = null;
  while (Date.now() < deadline) {
    last = await probeBillingGridRowsForEditTimesheet(tabId, injectOpts);
    if (last && !last.listLoading) return { ok: true, data: last };
    await new Promise((r) => setTimeout(r, BILLING_PAGE_WALK_POLL_MS));
  }
  return { ok: false, data: last };
}

/**
 * After 500 mode + Apply: wait until the grid is done loading — overlay off and either at least
 * one row, or overlay off for several polls with 0 rows (truly empty list).
 */
async function waitForBillingGridReadyAfterApply(tabId, injectOpts) {
  const deadline = Date.now() + BILLING_PAGE_WALK_LOAD_TIMEOUT_MS;
  let last = null;
  let stableIdleZeroRows = 0;
  const stableEmptyPolls = 4;
  while (Date.now() < deadline) {
    last = await probeBillingGridRowsForEditTimesheet(tabId, injectOpts);
    if (!last) {
      await new Promise((r) => setTimeout(r, BILLING_PAGE_WALK_POLL_MS));
      continue;
    }
    if (last.listLoading) {
      stableIdleZeroRows = 0;
      await new Promise((r) => setTimeout(r, BILLING_PAGE_WALK_POLL_MS));
      continue;
    }
    if (last.rowCount > 0) {
      return { ok: true, data: last };
    }
    stableIdleZeroRows++;
    if (stableIdleZeroRows >= stableEmptyPolls) {
      return { ok: true, data: last };
    }
    await new Promise((r) => setTimeout(r, BILLING_PAGE_WALK_POLL_MS));
  }
  return { ok: false, data: last };
}

/** Read ?page= from location.hash inside the tab (page MAIN world). Hidden Lights does not write this. */
async function readBillingHashPageFromPage(tabId) {
  const results = await execScript({
    target: { tabId: tabId },
    world: 'MAIN',
    func: () => {
      const h = (window.location.hash || '').replace(/^#/, '');
      const qi = h.indexOf('?');
      if (qi < 0) return { page: null };
      return { page: new URLSearchParams(h.slice(qi + 1)).get('page') };
    }
  });
  return results && results[0] ? results[0].result : { page: null };
}

async function billingListHasNextPage(tabId, injectOpts) {
  const inject = {
    target: { tabId: tabId },
    func: () => {
      function isVisible(el) {
        if (!el) return false;
        if (typeof el.checkVisibility === 'function') {
          try {
            return el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
          } catch (e) {
            /* fall through */
          }
        }
        const s = window.getComputedStyle(el);
        return (
          s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity) > 0
        );
      }
      const anchors = document.querySelectorAll('a[data-click="pageUp"]');
      for (let i = 0; i < anchors.length; i++) {
        if (isVisible(anchors[i])) return true;
      }
      return false;
    }
  };
  if (injectOpts && injectOpts.world === 'MAIN') {
    inject.world = 'MAIN';
  }
  const results = await execScript(inject);
  return !!(results && results[0] && results[0].result);
}

async function clickBillingListNextPage(tabId) {
  const results = await execScript({
    target: { tabId: tabId },
    world: 'MAIN',
    func: (gentleMs) => {
      return new Promise(function (resolve) {
        function isVisible(el) {
          if (!el) return false;
          if (typeof el.checkVisibility === 'function') {
            try {
              return el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
            } catch (e) {
              /* fall through */
            }
          }
          const s = window.getComputedStyle(el);
          return (
            s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity) > 0
          );
        }
        function runClick() {
          try {
            /**
             * One real user click only runs the <a>’s data-click / delegated handler once.
             * Calling vm.pageUp() via ko.contextFor can hit the wrong $parent and appear to
             * advance many pages (e.g. 12) in one “click”. So: never call pageUp() directly;
             * only fire a single synthetic click on the visible Next anchor.
             */
            const anchors = document.querySelectorAll('a[data-click="pageUp"]');
            let el = null;
            for (let i = 0; i < anchors.length; i++) {
              if (isVisible(anchors[i])) {
                el = anchors[i];
                break;
              }
            }
            if (!el) {
              resolve(
                anchors.length ? { ok: false, reason: 'next-not-visible' } : { ok: false, reason: 'no-next-control' }
              );
              return;
            }
            const had = el.hasAttribute('href');
            const prev = had ? el.getAttribute('href') : null;
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
            resolve({ ok: true, via: 'single-anchor-click-gentle' });
          } catch (e) {
            resolve({ ok: false, reason: e && e.message ? e.message : String(e) });
          }
        }
        const ms = typeof gentleMs === 'number' ? gentleMs : 50;
        if (ms > 0) {
          setTimeout(runClick, ms);
        } else {
          runClick();
        }
      });
    },
    args: [BILLING_NEXT_GENTLE_MS]
  });
  const r = results && results[0] && results[0].result;
  if (!r) return { ok: false, reason: 'no-result' };
  return r;
}

/**
 * Billing list: set hash to pageSize=500, remove page=, click MUI Apply when visible, wait for grid to settle.
 */
async function runBillingList500HashAndApply(tabId, tabUrl, injectOpts) {
  const parsed = parseBillingManagerListHash(tabUrl);
  if (parsed.error) {
    return { ok: false, error: parsed.error };
  }
  const path = parsed.path;
  const params = new URLSearchParams(parsed.params.toString());
  params.set('pageSize', '500');
  params.delete('page');
  await navigateBillingListHash(tabId, buildBillingListHash(path, params));
  await new Promise((r) => setTimeout(r, BILLING_HASH_BEFORE_APPLY_MS));

  let applyRes = await clickBillingApplyButton(tabId);
  if (!applyRes.ok) {
    await new Promise((r) => setTimeout(r, 600));
    applyRes = await clickBillingApplyButton(tabId);
  }
  if (!applyRes.ok) {
    return {
      ok: false,
      error:
        'Could not click Apply (' +
        (applyRes.reason || '?') +
        '). Open billing filters so Apply is visible.',
      applyRes
    };
  }

  const settled = await waitForBillingGridReadyAfterApply(tabId, injectOpts);
  const snap = settled.data;
  const hp = await readBillingHashPageFromPage(tabId);
  return { ok: true, applyRes, settled, snap, hp };
}

let walkBillingPagesRunning = false;
let walkBillingPagesAbortRequested = false;

document.getElementById('walk-billing-pages').addEventListener('click', async () => {
  const btn = document.getElementById('walk-billing-pages');
  const resultEl = document.getElementById('walk-billing-pages-result');

  if (walkBillingPagesRunning) {
    walkBillingPagesAbortRequested = true;
    resultEl.textContent = (resultEl.textContent || '') + '\nStop requested — will stop after current page…';
    log('Walk billing pages: stop requested');
    return;
  }

  walkBillingPagesRunning = true;
  walkBillingPagesAbortRequested = false;
  btn.textContent = 'Stop walk';

  const lines = [];
  const pushLine = (s) => {
    lines.push(s);
    resultEl.textContent = lines.join('\n');
    log(s);
  };

  try {
    resultEl.textContent = '';
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      pushLine('No active tab.');
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      pushLine('Cannot run on this page.');
      return;
    }

    const walkInject = { world: 'MAIN' };

    pushLine(
      'Walk: (1) 500 mode — hash pageSize=500, drop page=, click Apply. ' +
        '(2) Wait until the grid finishes loading. ' +
        '(3) Then Next only, ' +
        BILLING_NEXT_GAP_MS / 1000 +
        's between Next clicks after each page settles.'
    );

    let walkExitedEarly = false;
    pushLine('Step 1/3 — 500 mode: updating hash and clicking Apply…');
    const prep = await runBillingList500HashAndApply(tab.id, tab.url, walkInject);
    if (!prep.ok) {
      pushLine(prep.error);
      walkExitedEarly = true;
    } else {
      pushLine('Hash updated (pageSize=500, page param removed). Apply: ' + (prep.applyRes.via || '?') + '.');
      pushLine('Step 2/3 — waiting for grid to finish loading after Apply…');
      if (!prep.settled.ok) {
        pushLine(
          'Grid still loading or empty after timeout — stopping walk (fix filters or try again).'
        );
        walkExitedEarly = true;
      } else {
        pushLine('Grid ready (spinner off' + (prep.snap && prep.snap.rowCount > 0 ? '; rows present' : '; list empty') + ').');
      }
      let snap = prep.snap;
      let rows = snap ? snap.rowCount : 0;
      let hp = prep.hp;
      if (!walkExitedEarly) {
        pushLine(
          'Step 3/3 — walking: hash page=' +
            (hp.page != null && hp.page !== '' ? hp.page : '(none)') +
            ', ' +
            rows +
            ' row(s).'
        );
        if (rows === 0) {
          pushLine('Done — 0 rows (nothing to walk).');
          walkExitedEarly = true;
        }
      }
      if (!walkExitedEarly) {
        let settled = prep.settled;
        let nextClicks = 0;
        let isFirstNext = true;
        let hitNextLimit = false;
        while (nextClicks < BILLING_PAGE_WALK_MAX_PAGES) {
          if (walkBillingPagesAbortRequested) {
            pushLine('Stopped by user.');
            walkExitedEarly = true;
            break;
          }
          const hasNext = await billingListHasNextPage(tab.id, walkInject);
          if (!hasNext) {
            pushLine('Done — no Next. Next clicks used: ' + nextClicks + '.');
            walkExitedEarly = true;
            break;
          }
          if (!isFirstNext) {
            pushLine('Waiting ' + BILLING_NEXT_GAP_MS / 1000 + 's before Next (grid already settled)…');
            await new Promise((r) => setTimeout(r, BILLING_NEXT_GAP_MS));
          }
          isFirstNext = false;
          if (walkBillingPagesAbortRequested) {
            walkExitedEarly = true;
            break;
          }
          const clickRes = await clickBillingListNextPage(tab.id);
          if (!clickRes.ok) {
            pushLine('Next failed (' + (clickRes.reason || '?') + '). Stopping.');
            walkExitedEarly = true;
            break;
          }
          pushLine('Clicked Next (' + (clickRes.via || '?') + '). Waiting for grid…');
          settled = await waitForBillingGridWatchSettled(tab.id, walkInject);
          if (!settled.ok) {
            pushLine('Warning: grid timed out after Next.');
          }
          snap = await probeBillingGridRowsForEditTimesheet(tab.id, walkInject);
          rows = snap ? snap.rowCount : 0;
          hp = await readBillingHashPageFromPage(tab.id);
          pushLine(
            'After Next — hash page=' +
              (hp.page != null && hp.page !== '' ? hp.page : '(none)') +
              ', ' +
              rows +
              ' row(s).'
          );
          if (rows === 0) {
            pushLine('Done — 0 rows.');
            walkExitedEarly = true;
            break;
          }
          nextClicks++;
        }
        if (!walkExitedEarly && nextClicks >= BILLING_PAGE_WALK_MAX_PAGES) {
          hitNextLimit = true;
        }
        if (hitNextLimit) {
          pushLine('Stopped — Next safety limit (' + BILLING_PAGE_WALK_MAX_PAGES + ').');
        }
      }
    }
  } catch (e) {
    pushLine('Error: ' + (e.message || String(e)));
  } finally {
    walkBillingPagesRunning = false;
    walkBillingPagesAbortRequested = false;
    btn.textContent = 'Walk all billing pages';
  }
});

document.getElementById('billing-500-mode').addEventListener('click', async () => {
  const resultEl = document.getElementById('billing-500-mode-result');
  const lines = [];
  const pushLine = (s) => {
    lines.push(s);
    resultEl.textContent = lines.join('\n');
    log(s);
  };
  const injectOpts = { world: 'MAIN' };

  try {
    resultEl.textContent = '';
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      pushLine('No active tab.');
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      pushLine('Cannot run on this page.');
      return;
    }

    pushLine('Setting billing hash to pageSize=500 (removing page=)…');
    const prep = await runBillingList500HashAndApply(tab.id, tab.url, injectOpts);
    if (!prep.ok) {
      pushLine(prep.error);
      return;
    }
    pushLine('Clicked Apply (' + (prep.applyRes.via || '?') + ').');
    pushLine('Grid settled: ' + (prep.settled.ok ? 'yes' : 'timed out (list may still be loading).'));
    const rows = prep.snap ? prep.snap.rowCount : 0;
    const hp = prep.hp;
    pushLine(
      'Hash page param: ' +
        (hp.page != null && hp.page !== '' ? hp.page : '(none)') +
        ', ' +
        rows +
        ' row(s) visible.'
    );
    pushLine('Done — 500 mode.');
  } catch (e) {
    pushLine('Error: ' + (e.message || String(e)));
  }
});

/**
 * After entering times on a new service line, reapply the IANA timezone value captured from line 1.
 * Soft-fail: logs only; does not abort the overlap fix.
 */
async function applyCapturedTimesheetTimezone(tabId, contextLabel) {
  const recTz = overlapFixRecordGet(tabId);
  if (!recTz || !recTz.timeZoneValue) return;
  const v = String(recTz.timeZoneValue).trim();
  if (!v) return;
  const label = contextLabel || 'Timezone';
  try {
    await execScript({
      target: { tabId: tabId },
      func: (value) => {
        window.__timesheetTimezoneValue = value;
      },
      args: [v]
    });
    await execScript({ target: { tabId: tabId }, files: ['inject-set-timesheet-timezone.js'] });
    const results = await execScript({
      target: { tabId: tabId },
      func: () => window.__setTimesheetTimezoneResult
    });
    const data = results && results[0] && results[0].result;
    if (data && data.success) {
      log(label + ': reapplied ' + (data.value || v));
      // Give CR a beat to finish any form refresh before the post-TZ time assert.
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS + 150));
    } else {
      log(label + ': reapply soft-failed — ' + ((data && data.error) || 'no result'));
    }
  } catch (e) {
    log(label + ': reapply soft-failed — ' + (e.message || String(e)));
  }
}

/** Set fail reason in red under the detail for this overlap item. Pass '' to clear. */
function setOverlapFixFailReason(btn, message) {
  if (btn && btn.getAttribute && btn.getAttribute('data-run-all-virtual') === '1') {
    btn.setAttribute('data-run-all-fail', message || '');
    return;
  }
  const item = btn && btn.closest('.overlap-list__item');
  if (!item) return;
  const el = item.querySelector('.overlap-list__fail-reason');
  if (!el) return;
  el.classList.remove('overlap-list__fail-reason--progress');
  el.textContent = '';
  if (message) {
    el.appendChild(document.createTextNode(message));
  }
}

/** Visible HTML for #overlap-fix-result when the note attach step fails (non-empty so result panel shows). */
function overlapFixNoteFailureHtml(detailMsg) {
  const detail = detailMsg ? String(detailMsg) : 'Could not attach a matching session note.';
  return (
    '<div class="overlap-fix-result--fail">' +
    '<p><strong>Note step failed</strong></p>' +
    '<p class="overlap-fix-result--fail-detail">' +
    escapeHtml(detail) +
    '</p>' +
    '</div>'
  );
}

/** Set overlap Fix button state: 'loading' | 'success' | 'error'. Idle = no class. */
function setOverlapFixButtonState(btn, state) {
  if (!btn || !btn.classList) return;
  if (btn.getAttribute && btn.getAttribute('data-run-all-virtual') === '1') {
    btn.setAttribute('data-run-all-outcome', state);
    return;
  }
  btn.classList.remove('is-loading', 'is-success', 'is-error');
  if (state === 'loading') {
    btn.classList.add('is-loading');
    btn.disabled = true;
    btn.title = 'Running…';
  } else if (state === 'success') {
    btn.classList.add('is-success');
    btn.disabled = true;
    btn.title = 'Done';
  } else if (state === 'error') {
    btn.classList.add('is-error');
    btn.disabled = false;
    btn.title = 'Failed – click to try again';
  }
}

function parseMulti97155FixPlanFromButton(btn) {
  const raw = btn.getAttribute('data-fix-plan');
  if (!raw) return null;
  try {
    const plan = JSON.parse(raw);
    return plan && plan.ok ? plan : null;
  } catch (e) {
    return null;
  }
}

/**
 * Add one service line when tab count is below expectedCount.
 * @returns {Promise<{ ok: true, count: number } | { ok: false, message: string }>}
 */
async function addServiceLineUntilCount(tabId, expectedCount, logPrefix) {
  let tabCountRes = await fetchServiceLineTabCount(tabId);
  let count = tabCountRes && typeof tabCountRes.count === 'number' ? tabCountRes.count : 0;
  if (count >= expectedCount) {
    return { ok: true, count: count };
  }
  await execScript({ target: { tabId: tabId }, files: ['inject-service-line-tab-count.js'] });
  await new Promise((r) => setTimeout(r, 150));
  await execScript({
    target: { tabId: tabId },
    func: (maxBefore) => {
      window.__addServiceLineMaxBefore = maxBefore;
    },
    args: [expectedCount - 1]
  });
  await execScript({ target: { tabId: tabId }, files: ['inject-add-service-line.js'] });
  await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));
  await new Promise((r) => setTimeout(r, 550));
  const results = await execScript({
    target: { tabId: tabId },
    func: () => window.__addServiceLineResult
  });
  const data = results && results[0] && results[0].result;
  if (!data) {
    return { ok: false, message: 'Add service line: no result.' };
  }
  if (data.error) {
    return { ok: false, message: data.error };
  }
  tabCountRes = await fetchServiceLineTabCount(tabId);
  count = tabCountRes && typeof tabCountRes.count === 'number' ? tabCountRes.count : 0;
  if (count !== expectedCount) {
    return {
      ok: false,
      message:
        'After adding a line, expected ' +
        expectedCount +
        ' service lines, got ' +
        count +
        '. Before/after: ' +
        (data.countBefore != null ? data.countBefore : '?') +
        ' → ' +
        (data.countAfter != null ? data.countAfter : '?') +
        '.'
    };
  }
  log((logPrefix || '97155 multi') + ': service line count ' + count);
  return { ok: true, count: count };
}

/**
 * Configure date, code, POS, address, and verified times on one service line (97155 fix).
 * @returns {Promise<{ ok: true } | { ok: false, message: string }>}
 */
async function configureOverlapServiceLine97155(tabId, lineIndex, seg, resultEl, logPrefix, opts) {
  const options = opts || {};
  const lineNum = lineIndex + 1;
  const isNonBillable = seg.type === 'nonbillable';
  const lineLabel =
    options.lineLabel ||
    'Line ' + lineNum + (isNonBillable ? ' (nonbillable)' : ' (billable)');
  const stepLabel =
    options.stepLabel || lineLabel + ' ' + seg.from + ' – ' + seg.to;
  const pollMaxMs =
    options.pollMaxMs != null ? options.pollMaxMs : ENTER_TIMES_RESULT_POLL_MAX_MS;

  const tabPick = await ensureServiceLineTabActive(tabId, lineIndex);
  if (!tabPick.ok) {
    return { ok: false, message: tabPick.error || 'Could not select ' + lineLabel + '.' };
  }

  if (seg.action === 'add') {
    resultEl.innerHTML = '<p>Setting date on ' + escapeHtml(lineLabel) + '…</p>';
    await execScript({
      target: { tabId: tabId },
      func: (d) => {
        window.__setDateOfServiceResult = null;
        window.__dateOfServiceValue = d;
      },
      args: [overlapFixRecordGet(tabId).dateOfService]
    });
    await execScript({ target: { tabId: tabId }, files: ['inject-set-date-of-service.js'] });
    await pollForInjectResult(tabId, '__setDateOfServiceResult', SET_DATE_INJECT_SETTLE_MS, 200);
  }

  resultEl.innerHTML =
    '<p>Waiting for service codes (' + escapeHtml(lineLabel) + ')…</p>';
  const codesReady = await overlapUiPollTry({
    tryOnce: () => probeServiceCodesLinkReady(tabId),
    resultEl,
    waitingHtml: 'Waiting for <strong>Service Codes</strong> link (' + lineLabel + ')…'
  });
  if (!codesReady) {
    return {
      ok: false,
      message:
        'Service Codes link did not appear within ' +
        Math.round(OVERLAP_FIX_UI_POLL_MAX_MS / 1000) +
        's on ' +
        lineLabel +
        '.'
    };
  }

  if (isNonBillable) {
    resultEl.innerHTML = '<p>Selecting nonbillable code on ' + escapeHtml(lineLabel) + '…</p>';
    await execScript({ target: { tabId: tabId }, files: ['inject-select-service-codes.js'] });
    await new Promise((r) => setTimeout(r, 900));
    await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));
    const codeRes = await execScript({
      target: { tabId: tabId },
      func: () => window.__selectServiceCodesResult
    });
    const codeData = codeRes && codeRes[0] && codeRes[0].result;
    if (codeData && codeData.error) {
      return { ok: false, message: 'Nonbillable code: ' + codeData.error };
    }
  } else if (seg.action === 'add') {
    const billableReady = await overlapUiPollTry({
      tryOnce: () => probeBillable97153Ready(tabId),
      resultEl,
      waitingHtml: 'Waiting for <strong>97153</strong> billable list (' + lineLabel + ')…'
    });
    if (billableReady) {
      resultEl.innerHTML = '<p>Clicking billable 97153 on ' + escapeHtml(lineLabel) + '…</p>';
      await execScript({
        target: { tabId: tabId },
        files: ['inject-click-billable-97153-no-nonbillable.js']
      });
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));
    } else {
      log(logPrefix + ': billable 97153 list not found on ' + lineLabel + ', continuing');
    }
  }

  const placeMatch = (overlapFixRecordGet(tabId).placeOfService || '').trim() || PLACE_OF_SERVICE_MATCH;
  await execScript({
    target: { tabId: tabId },
    func: (m) => {
      window.__placeOfServiceMatch = m;
    },
    args: [placeMatch]
  });
  await execScript({ target: { tabId: tabId }, files: ['inject-select-place-of-service.js'] });
  await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

  const addressMatch =
    (overlapFixRecordGet(tabId).serviceAddressText || overlapFixRecordGet(tabId).serviceAddress || '').trim() ||
    SERVICE_ADDRESS_MATCH;
  await execScript({
    target: { tabId: tabId },
    func: (m) => {
      window.__serviceAddressMatch = m;
    },
    args: [addressMatch]
  });
  await execScript({ target: { tabId: tabId }, files: ['inject-select-service-address.js'] });
  await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

  const timesResult = await enterAndVerifyTimesOnLine(
    tabId,
    lineIndex,
    seg.from,
    seg.to,
    resultEl,
    logPrefix,
    {
      lineLabel: lineLabel,
      stepLabel: stepLabel,
      pollMaxMs: pollMaxMs,
      manageFocus: false
    }
  );
  if (!timesResult.ok) {
    return { ok: false, message: timesResult.message || stepLabel + ' failed.' };
  }

  await applyCapturedTimesheetTimezone(tabId, logPrefix + ' line ' + lineNum);
  const afterTz = await assertTimesOnLine(tabId, lineIndex, seg.from, seg.to, logPrefix, {
    lineLabel: lineLabel,
    manageFocus: false
  });
  if (!afterTz.ok) {
    return { ok: false, message: afterTz.message };
  }

  return { ok: true };
}

/** Read back every segment in the plan (one pass; used once before note/signatures). */
async function assertAllPlanSegments(tabId, plan, throughIndex, logPrefix) {
  for (let i = 0; i <= throughIndex && i < plan.segments.length; i++) {
    const seg = plan.segments[i];
    const check = await assertTimesOnLine(tabId, seg.lineIndex, seg.from, seg.to, logPrefix, {
      lineLabel: 'Line ' + (seg.lineIndex + 1),
      manageFocus: false
    });
    if (!check.ok) {
      return check;
    }
  }
  return { ok: true };
}

/**
 * Multi 97155 overlap fix — data-fix-mode="97155-multi".
 * Line 1 billable trim, then add/configure each remaining segment with verify gates.
 */
async function runOverlapFix97155Multi(btn, fixOpts) {
  const fo = fixOpts || {};
  const plan = parseMulti97155FixPlanFromButton(btn);
  const entryId = btn.getAttribute('data-entry-id');
  const resultEl = fo.resultEl || document.getElementById('overlap-fix-result');
  const progressTabId = fo.progressTabId != null ? fo.progressTabId : null;
  const logPrefix = '97155 multi fix';

  async function progMulti(message, phase) {
    if (progressTabId != null) {
      await writeConcurrenceFixProgress(progressTabId, message, phase || 'run', null);
    }
  }

  if (!plan || !plan.segments || !plan.segments.length) {
    const msg = 'Invalid multi fix plan on this button. Run Overlaps again.';
    setOverlapFixButtonState(btn, 'error');
    setOverlapFixFailReason(btn, msg);
    return;
  }

  setOverlapFixButtonState(btn, 'loading');
  setOverlapFixFailReason(btn, '');
  resultEl.innerHTML = '<p>Starting multi-concurrent 97155 fix…</p>';
  await progMulti('Multi 97155 fix started', 'start');
  log(logPrefix + ': entry ' + entryId + ', ' + plan.lineCount + ' lines, ' + plan.concurrent97155Count + '×97155');

  try {
    let tab;
    if (fo.targetTabId != null) {
      tab = { id: fo.targetTabId };
    } else {
      const [t] = await chrome.tabs.query({ active: true, currentWindow: true });
      tab = t;
    }
    if (!tab?.id) {
      const msg = 'No active tab.';
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, msg);
      return;
    }

    if (!fo.skipTimesheetNavigate97155) {
      resultEl.innerHTML = '<p>Opening timesheet...</p>';
      await progMulti('Opening timesheet…', 'navigate');
      await execScript({
        target: { tabId: tab.id },
        func: (id) => {
          window.location.hash = 'billingmanager/timesheeteditor/?&id=' + id;
          return { success: true };
        },
        args: [entryId]
      });
      await new Promise((r) => setTimeout(r, 500));
      await waitForTimesheetEditorReady(tab.id, entryId);
    } else {
      await waitForTimesheetEditorReady(tab.id, entryId);
    }

    const seg0 = plan.segments[0];
    const part1Result = await enterAndVerifyPart1Times(tab.id, seg0.from, seg0.to, resultEl, logPrefix);
    if (!part1Result.ok) {
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, part1Result.message);
      return;
    }
    await progMulti('Line 1 verified', 'part1');

    resultEl.innerHTML = '<p>Recording from first timesheet...</p>';
    const snap = await captureOverlapFixTimesheetSnapshot(tab.id, progMulti);
    if (!snap.ok) {
      const msg = snap.error || 'Could not read timesheet.';
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, msg);
      return;
    }
    await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

    for (let si = 1; si < plan.segments.length; si++) {
      const seg = plan.segments[si];
      const expectedCount = seg.lineIndex + 1;
      resultEl.innerHTML =
        '<p>Adding line ' + expectedCount + ' (' + (seg.type === 'nonbillable' ? 'nonbillable' : 'billable') + ')…</p>';
      const addRes = await addServiceLineUntilCount(tab.id, expectedCount, logPrefix);
      if (!addRes.ok) {
        resultEl.innerHTML = '';
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, addRes.message);
        return;
      }

      const releaseFocus = await focusTargetTabForTimesheetUi(tab.id);
      let lineOk;
      try {
        lineOk = await configureOverlapServiceLine97155(
          tab.id,
          seg.lineIndex,
          seg,
          resultEl,
          logPrefix,
          {
            pollMaxMs: si === plan.segments.length - 1 ? ENTER_TIMES_PART3_POLL_MAX_MS : undefined
          }
        );
      } finally {
        releaseFocus();
      }
      if (!lineOk.ok) {
        resultEl.innerHTML = '';
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, lineOk.message);
        return;
      }

      await progMulti('Line ' + expectedCount + ' configured', 'line' + expectedCount);
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));
    }

    resultEl.innerHTML = '<p>Verifying all service lines…</p>';
    await progMulti('Verifying all lines…', 'verify-all');
    const finalGate = await assertAllPlanSegments(
      tab.id,
      plan,
      plan.segments.length - 1,
      logPrefix
    );
    if (!finalGate.ok) {
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, finalGate.message);
      return;
    }

    resultEl.innerHTML = '<p>Attaching note on last billable line…</p>';
    await ensureServiceLineTabActive(tab.id, plan.lastBillableIndex);
    const notePick = await tryOverlapFixPickNoteBackupThenPrimary(tab.id, resultEl, logPrefix);
    if (!notePick.ok) {
      resultEl.innerHTML = overlapFixNoteFailureHtml(notePick.msg);
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, notePick.msg);
      return;
    }

    resultEl.innerHTML = '<p>Closing note panel...</p>';
    await new Promise((r) => setTimeout(r, OVERLAP_FIX_NOTE_STEP_MS));
    await execScript({ target: { tabId: tab.id }, files: ['inject-click-close-note.js'] });
    await new Promise((r) => setTimeout(r, 300));
    await new Promise((r) => setTimeout(r, OVERLAP_FIX_NOTE_STEP_MS));

    const clientOk = await runSignatureSequence(tab, 'client', resultEl, true);
    if (!clientOk) {
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, 'Timesheet built OK but client signature failed.');
      return;
    }
    await new Promise((r) => setTimeout(r, 2000));
    const providerOk = await runSignatureSequence(tab, 'provider', resultEl, false);
    if (!providerOk) {
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, 'Timesheet built OK but provider signature failed.');
      return;
    }

    const doneHtml =
      '<p><strong>Done.</strong> Multi-concurrent fix — ' +
      plan.concurrent97155Count +
      '×97155 → ' +
      plan.lineCount +
      ' service lines.</p>' +
      '<p class="section-hint">' +
      escapeHtml(formatMulti97155SegmentPreview(plan)) +
      '</p>';
    const okDone = await completeOverlapFixWithIngest(
      btn,
      '97155',
      'multi-line',
      fo,
      resultEl,
      doneHtml,
      logPrefix + ': complete'
    );
    if (!okDone) return;
  } catch (err) {
    const msg = err.message || String(err);
    resultEl.innerHTML = '';
    log(logPrefix + ' error: ' + msg);
    setOverlapFixButtonState(btn, 'error');
    setOverlapFixFailReason(btn, msg);
  }
}

/**
 * 97155 overlap fix — triggered from Fix buttons with data-fix-mode="97155".
 *
 * Same overall shape as the Speech fix (LINE 1, snapshot, LINE 2, optional LINE 3) but:
 *  - No provider labels / payor inference (skip entirely).
 *  - LINE 2 (nonbillable): uses inject-click-nonbillable-97153.js + place of service + service address.
 *  - LINE 3 (middle only): uses inject-click-billable-97153-no-nonbillable.js + POS + address + note. No payor, no visit location.
 */
async function runOverlapFix97155(btn, fixOpts) {
  const fo = fixOpts || {};
  const entryId = btn.getAttribute('data-entry-id');
  const timeFrom = btn.getAttribute('data-time-from');
  const timeTo = btn.getAttribute('data-time-to');
  const overlapText = btn.getAttribute('data-overlap') || '';
  const overlapFrom = btn.getAttribute('data-overlap-from') || '';
  const overlapTo = btn.getAttribute('data-overlap-to') || '';
  const overlapType = btn.getAttribute('data-overlap-type') || 'middle';
  const resultEl = fo.resultEl || document.getElementById('overlap-fix-result');
  const progressTabId = fo.progressTabId != null ? fo.progressTabId : null;
  async function prog97155(message, phase) {
    if (progressTabId != null) {
      await writeConcurrenceFixProgress(progressTabId, message, phase || 'run', null);
    }
  }
  setOverlapFixButtonState(btn, 'loading');
  setOverlapFixFailReason(btn, '');
  resultEl.innerHTML = '<p>Starting 97155 overlap fix...</p>';
  await prog97155('97155 fix started', 'start');
  log('97155 fix: entry ' + entryId + ', type ' + overlapType + ', Part1 ' + timeFrom + ' – ' + timeTo + ' (overlap: ' + overlapText + ')');
  try {
    let results;
    let data;

    let tab;
    if (fo.targetTabId != null) {
      tab = { id: fo.targetTabId };
    } else {
      const [t] = await chrome.tabs.query({ active: true, currentWindow: true });
      tab = t;
    }
    if (!tab?.id) {
      const msg = 'No active tab.';
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, msg);
      return;
    }
    if (
      fo.targetTabId == null &&
      tab.url &&
      (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))
    ) {
      const msg = 'Cannot run on this page.';
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, msg);
      return;
    }

    /* -------------------------------------------------------------------------
     * PREAMBLE — Navigate to the timesheet editor (no labels/payor needed).
     * ------------------------------------------------------------------------- */
    if (!fo.skipTimesheetNavigate97155) {
      resultEl.innerHTML = '<p>Opening timesheet...</p>';
      await prog97155('Opening timesheet…', 'navigate');
      await execScript({
        target: { tabId: tab.id },
        func: (id) => {
          window.location.hash = 'billingmanager/timesheeteditor/?&id=' + id;
          return { success: true };
        },
        args: [entryId]
      });
      await new Promise((r) => setTimeout(r, 500));
      await waitForTimesheetEditorReady(tab.id, entryId);
    } else {
      resultEl.innerHTML = '<p>Waiting for timesheet editor…</p>';
      await prog97155('Waiting for timesheet editor…', 'navigate');
      await waitForTimesheetEditorReady(tab.id, entryId);
    }

    /* -------------------------------------------------------------------------
     * LINE 1 — First service line (trimmed 97153)
     * Same logic as Speech: shrink the original line so it no longer covers the overlap.
     * ------------------------------------------------------------------------- */
    const part1Result = await enterAndVerifyPart1Times(tab.id, timeFrom, timeTo, resultEl, '97155 fix');
    if (!part1Result.ok) {
      resultEl.innerHTML = '';
      log('97155 fix: Part 1 failed – ' + part1Result.message);
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, part1Result.message);
      return;
    }
    await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));
    await prog97155('Part 1 verified', 'part1');

    /* Snapshot line 1 — provider / POS / address / date to reuse on lines 2 & 3. */
    resultEl.innerHTML = '<p>Recording from first timesheet...</p>';
    var snap97155 = await captureOverlapFixTimesheetSnapshot(tab.id, prog97155);
    if (!snap97155.ok) {
      const msg = snap97155.error || 'Could not read timesheet.';
      resultEl.innerHTML = '';
      log('97155 fix: read timesheet failed');
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, msg);
      return;
    }
    const snapL = overlapFixRecordGet(tab.id);
    log('97155 fix: recorded provider, place, address, date' + (snapL && snapL.timeZoneValue ? ', tz ' + snapL.timeZoneValue : ''));
    await prog97155('Snapshot recorded', 'snapshot');
    await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

    resultEl.innerHTML = '<p>Verifying line 1 times before line 2…</p>';
    await prog97155('Verifying line 1 times before line 2…', 'part1');
    const part1Gate97155 = await assertPart1TimesBeforeLine2(tab.id, timeFrom, timeTo, '97155 fix');
    if (!part1Gate97155.ok) {
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, part1Gate97155.message);
      log('97155 fix: ' + part1Gate97155.message);
      return;
    }

    /* -------------------------------------------------------------------------
     * LINE 2 — Nonbillable overlap segment (97153 Direct non billable)
     * Steps: add line → date → click nonbillable 97153 → place of service → address → enter overlap times.
     * ------------------------------------------------------------------------- */
    resultEl.innerHTML = '<p>Checking service line tabs…</p>';
    let tabCountRes = await pollServiceLineTabCountUntilPositive(tab.id);
    let serviceLineCount =
      tabCountRes && typeof tabCountRes.count === 'number' ? tabCountRes.count : 0;
    if (serviceLineCount === 0) {
      const msg = 'Could not detect service line tabs. Wait for the timesheet to finish loading and try again.';
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, msg);
      log('97155 fix: no service line tabs');
      return;
    }
    if (serviceLineCount > 2) {
      const msg = 'Too many service lines (' + serviceLineCount + '). Remove extra lines or start from a single-line timesheet before running this fix.';
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, msg);
      log('97155 fix: too many lines before line 2 — ' + serviceLineCount);
      return;
    }
    if (serviceLineCount >= 2) {
      resultEl.innerHTML = '<p>Already ' + serviceLineCount + ' service line(s) — skipping add. Configure the active line as nonbillable overlap.</p>';
      log('97155 fix: skip add for line 2 (already ' + serviceLineCount + ' tab(s))');
    } else {
      resultEl.innerHTML = '<p>Adding second service line…</p>';
      await execScript({
        target: { tabId: tab.id },
        files: ['inject-service-line-tab-count.js']
      });
      await new Promise((r) => setTimeout(r, 150));
      await execScript({
        target: { tabId: tab.id },
        func: () => { window.__addServiceLineMaxBefore = 1; }
      });
      await execScript({
        target: { tabId: tab.id },
        files: ['inject-add-service-line.js']
      });
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));
      await new Promise((r) => setTimeout(r, 550));
      results = await execScript({
        target: { tabId: tab.id },
        func: () => window.__addServiceLineResult
      });
      data = results && results[0] && results[0].result;
      if (!data) {
        const msg = 'Add service line: no result.';
        resultEl.innerHTML = '';
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, msg);
        return;
      }
      if (data.error) {
        resultEl.innerHTML = '';
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, data.error);
        return;
      }
      if (data.skipped) {
        log('97155 fix: add-service-line skipped (already enough lines)');
      }
      tabCountRes = await fetchServiceLineTabCount(tab.id);
      serviceLineCount = tabCountRes && typeof tabCountRes.count === 'number' ? tabCountRes.count : 0;
      if (serviceLineCount !== 2) {
        const msg = 'After adding a line, expected exactly 2 service lines, got ' + serviceLineCount + '. Before/after from click: ' + data.countBefore + ' → ' + data.countAfter + '.';
        resultEl.innerHTML = '';
        log('97155 fix: service line count after add mismatch');
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, msg);
        return;
      }
      log('97155 fix: second service line present (count verified)');
    }
    await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

    resultEl.innerHTML = '<p>Setting date on new line...</p>';
    var releaseFocusL2 = await focusTargetTabForTimesheetUi(tab.id);
    try {
      await execScript({
        target: { tabId: tab.id },
        func: (d) => { window.__setDateOfServiceResult = null; window.__dateOfServiceValue = d; },
        args: [overlapFixRecordGet(tab.id).dateOfService]
      });
      await execScript({ target: { tabId: tab.id }, files: ['inject-set-date-of-service.js'] });
      await pollForInjectResult(tab.id, '__setDateOfServiceResult', SET_DATE_INJECT_SETTLE_MS, 200);

    resultEl.innerHTML = '<p>Waiting for new line to load, then selecting nonbillable code...</p>';
    const codesLinkReadyL2 = await overlapUiPollTry({
      tryOnce: () => probeServiceCodesLinkReady(tab.id),
      resultEl,
      waitingHtml: 'Waiting for <strong>Service Codes</strong> link (line 2)…'
    });
    if (!codesLinkReadyL2) {
      const msg =
        'Service Codes link did not appear within ' +
        Math.round(OVERLAP_FIX_UI_POLL_MAX_MS / 1000) +
        's — wait for the tab to finish loading and run Fix again.';
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, msg);
      log('97155 fix: ' + msg);
      return;
    }
    resultEl.innerHTML = '<p>Selecting nonbillable code (CONCURRENT supervision)...</p>';
    await execScript({ target: { tabId: tab.id }, files: ['inject-select-service-codes.js'] });
    await new Promise((r) => setTimeout(r, 900));
    await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));
    results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__selectServiceCodesResult
    });
    data = results && results[0] && results[0].result;
    if (data && data.error) {
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, 'Nonbillable code: ' + data.error);
      return;
    }
    await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

    /* LINE 2 — place of service + service address (97155 needs these on the nonbillable line too) */
    resultEl.innerHTML = '<p>Place of service (from original)...</p>';
    const placeMatchL2 = (overlapFixRecordGet(tab.id).placeOfService || '').trim() || PLACE_OF_SERVICE_MATCH;
    await execScript({
      target: { tabId: tab.id },
      func: (m) => { window.__placeOfServiceMatch = m; },
      args: [placeMatchL2]
    });
    await execScript({ target: { tabId: tab.id }, files: ['inject-select-place-of-service.js'] });
    await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

    resultEl.innerHTML = '<p>Service address (from original)...</p>';
    const addressMatchL2 = (overlapFixRecordGet(tab.id).serviceAddressText || overlapFixRecordGet(tab.id).serviceAddress || '').trim() || SERVICE_ADDRESS_MATCH;
    await execScript({
      target: { tabId: tab.id },
      func: (m) => { window.__serviceAddressMatch = m; },
      args: [addressMatchL2]
    });
    await execScript({ target: { tabId: tab.id }, files: ['inject-select-service-address.js'] });
    await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

    resultEl.innerHTML = '<p>Entering overlap times (nonbillable)…</p>';
    const line2Times97155 = await enterAndVerifyTimesOnLine(
      tab.id,
      1,
      overlapFrom,
      overlapTo,
      resultEl,
      '97155 fix',
      {
        lineLabel: 'Line 2 (nonbillable)',
        stepLabel: 'Line 2 (nonbillable overlap)',
        manageFocus: false
      }
    );
    if (!line2Times97155.ok) {
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, line2Times97155.message);
      return;
    }
    await applyCapturedTimesheetTimezone(tab.id, '97155 line 2');
    const line2AfterTz97155 = await assertTimesOnLine(
      tab.id,
      1,
      overlapFrom,
      overlapTo,
      '97155 fix',
      { lineLabel: 'Line 2 (nonbillable)', manageFocus: false }
    );
    if (!line2AfterTz97155.ok) {
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, line2AfterTz97155.message);
      return;
    }
    const line1AfterL297155 = await assertPart1TimesBeforeLine2(tab.id, timeFrom, timeTo, '97155 fix', {
      manageFocus: false
    });
    if (!line1AfterL297155.ok) {
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, line1AfterL297155.message);
      return;
    }
    await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));
    } finally { releaseFocusL2(); }

    /* Start/end overlap: line 1 + line 2 completes the fix. */
    if (overlapType !== 'middle') {
      const ok97155Two = await completeOverlapFixWithIngest(
        btn,
        '97155',
        '2-line',
        fo,
        resultEl,
        '<p><strong>Done.</strong> Part 1: ' +
          escapeHtml(timeFrom) +
          ' – ' +
          escapeHtml(timeTo) +
          '. Line 2 (nonbillable): ' +
          escapeHtml(overlapFrom) +
          ' – ' +
          escapeHtml(overlapTo) +
          '. No third line (overlap at ' +
          (overlapType === 'start' ? 'start' : 'end') +
          ').</p>',
        '97155 fix: 2-line fix complete (' + overlapType + ')'
      );
      if (!ok97155Two) return;
    } else {
      /* -----------------------------------------------------------------------
       * LINE 3 — Third service line (billable 97153 after overlap)
       * Same shape as Speech line 3 but: no payor, no visit location, no note.
       * ----------------------------------------------------------------------- */
      const part3From = btn.getAttribute('data-part3-from') || '';
      const part3To = btn.getAttribute('data-part3-to') || '';

      resultEl.innerHTML = '<p>Checking service line tabs before third line…</p>';
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));
      tabCountRes = await fetchServiceLineTabCount(tab.id);
      serviceLineCount = tabCountRes && typeof tabCountRes.count === 'number' ? tabCountRes.count : 0;
      if (serviceLineCount < 2) {
        const msg = 'Expected at least 2 service lines before adding the third, got ' + serviceLineCount + '.';
        resultEl.innerHTML = '';
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, msg);
        log('97155 fix: too few lines before line 3');
        return;
      }
      if (serviceLineCount > 3) {
        const msg = 'Too many service lines (' + serviceLineCount + ') before the third line. Remove extras or finish manually.';
        resultEl.innerHTML = '';
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, msg);
        log('97155 fix: too many lines before line 3 — ' + serviceLineCount);
        return;
      }
      if (serviceLineCount >= 3) {
        resultEl.innerHTML = '<p>Already ' + serviceLineCount + ' service line(s) — skipping add. Configure the active line as billable 97153.</p>';
        log('97155 fix: skip add for line 3 (already ' + serviceLineCount + ' tab(s))');
      } else {
        resultEl.innerHTML = '<p>Adding third service line (billable, after overlap)...</p>';
        await execScript({
          target: { tabId: tab.id },
          files: ['inject-service-line-tab-count.js']
        });
        await new Promise((r) => setTimeout(r, 150));
        await execScript({
          target: { tabId: tab.id },
          func: () => { window.__addServiceLineMaxBefore = 2; }
        });
        await execScript({
          target: { tabId: tab.id },
          files: ['inject-add-service-line.js']
        });
        await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));
        await new Promise((r) => setTimeout(r, 550));
        results = await execScript({
          target: { tabId: tab.id },
          func: () => window.__addServiceLineResult
        });
        data = results && results[0] && results[0].result;
        if (!data || data.error) {
          const msg = (data && data.error) ? data.error : 'Add third line: no result.';
          resultEl.innerHTML = '';
          setOverlapFixButtonState(btn, 'error');
          setOverlapFixFailReason(btn, msg);
          return;
        }
        if (data.skipped) {
          log('97155 fix: add-service-line skipped for line 3 (already enough lines)');
        }
        tabCountRes = await fetchServiceLineTabCount(tab.id);
        serviceLineCount = tabCountRes && typeof tabCountRes.count === 'number' ? tabCountRes.count : 0;
        if (serviceLineCount !== 3) {
          const msg = 'After adding a line, expected 3 service lines, got ' + serviceLineCount + '. Click reported ' + (data.countBefore ?? '?') + ' → ' + (data.countAfter ?? '?') + '.';
          resultEl.innerHTML = '';
          setOverlapFixButtonState(btn, 'error');
          setOverlapFixFailReason(btn, msg);
          log('97155 fix: count after third add mismatch');
          return;
        }
        log('97155 fix: third service line present (count verified)');
      }
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

      /* Line 3 — date of service */
      resultEl.innerHTML = '<p>Setting date on third line...</p>';
      var releaseFocusL3_97 = await focusTargetTabForTimesheetUi(tab.id);
      try {
        await execScript({
          target: { tabId: tab.id },
          func: (d) => { window.__setDateOfServiceResult = null; window.__dateOfServiceValue = d; },
          args: [overlapFixRecordGet(tab.id).dateOfService]
        });
        await execScript({ target: { tabId: tab.id }, files: ['inject-set-date-of-service.js'] });
        await pollForInjectResult(tab.id, '__setDateOfServiceResult', SET_DATE_INJECT_SETTLE_MS, 200);

      /* Line 3 — try to select billable 97153 code (optional — may already be set) */
      resultEl.innerHTML = '<p>Checking for service code list (billable 97153)...</p>';
      const codesLinkReadyL3 = await overlapUiPollTry({
        tryOnce: () => probeServiceCodesLinkReady(tab.id),
        resultEl,
        waitingHtml: 'Waiting for <strong>Service Codes</strong> link (line 3)…'
      });
      if (codesLinkReadyL3) {
        const billableReady = await overlapUiPollTry({
          tryOnce: () => probeBillable97153Ready(tab.id),
          resultEl,
          waitingHtml: 'Waiting for service code list with <strong>97153</strong>…'
        });
        if (billableReady) {
          resultEl.innerHTML = '<p>Clicking billable 97153...</p>';
          await execScript({ target: { tabId: tab.id }, files: ['inject-click-billable-97153-no-nonbillable.js'] });
          await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));
          results = await execScript({
            target: { tabId: tab.id },
            func: () => window.__clickBillable97153NoBResult
          });
          data = results && results[0] && results[0].result;
          if (data && data.success) {
            log('97155 fix: billable 97153 selected');
          } else {
            log('97155 fix: billable click soft-failed — ' + ((data && data.error) || 'no result') + ', continuing');
          }
        } else {
          log('97155 fix: 97153 list not found for line 3, skipping code selection (may already be set)');
        }
      } else {
        log('97155 fix: Service Codes link not found on line 3, skipping code selection (may already be set)');
      }
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

      /* Line 3 — place of service + service address */
      resultEl.innerHTML = '<p>Place of service (from original)...</p>';
      const placeMatchL3 = (overlapFixRecordGet(tab.id).placeOfService || '').trim() || PLACE_OF_SERVICE_MATCH;
      await execScript({
        target: { tabId: tab.id },
        func: (m) => { window.__placeOfServiceMatch = m; },
        args: [placeMatchL3]
      });
      await execScript({ target: { tabId: tab.id }, files: ['inject-select-place-of-service.js'] });
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

      resultEl.innerHTML = '<p>Service address (from original)...</p>';
      const addressMatchL3 = (overlapFixRecordGet(tab.id).serviceAddressText || overlapFixRecordGet(tab.id).serviceAddress || '').trim() || SERVICE_ADDRESS_MATCH;
      await execScript({
        target: { tabId: tab.id },
        func: (m) => { window.__serviceAddressMatch = m; },
        args: [addressMatchL3]
      });
      await execScript({ target: { tabId: tab.id }, files: ['inject-select-service-address.js'] });
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

      /* Line 3 — times for post-overlap billable segment */
      resultEl.innerHTML = '<p>Entering Part 3 times (after overlap)…</p>';
      const line3Times97155 = await enterAndVerifyTimesOnLine(
        tab.id,
        2,
        part3From,
        part3To,
        resultEl,
        '97155 fix',
        {
          lineLabel: 'Part 3',
          stepLabel: 'Part 3 (billable segment after overlap)',
          pollMaxMs: ENTER_TIMES_PART3_POLL_MAX_MS,
          manageFocus: false
        }
      );
      if (!line3Times97155.ok) {
        resultEl.innerHTML = '';
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, line3Times97155.message);
        return;
      }
      await applyCapturedTimesheetTimezone(tab.id, '97155 line 3');
      const line3AfterTz97155 = await assertTimesOnLine(
        tab.id,
        2,
        part3From,
        part3To,
        '97155 fix',
        { lineLabel: 'Part 3', manageFocus: false }
      );
      if (!line3AfterTz97155.ok) {
        resultEl.innerHTML = '';
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, line3AfterTz97155.message);
        return;
      }
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

      /* Line 3 — attach note (primary tries session picker + date/name without SELECT EXISTING NOTE; button is backup) */
      const notePick97155 = await tryOverlapFixPickNoteBackupThenPrimary(tab.id, resultEl, '97155 fix');
      if (!notePick97155.ok) {
        resultEl.innerHTML = overlapFixNoteFailureHtml(notePick97155.msg);
        log('97155 fix: note step failed – ' + notePick97155.msg);
        await prog97155(notePick97155.msg || 'Note step failed', 'error');
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, notePick97155.msg);
        return;
      }

      resultEl.innerHTML = '<p>Closing note panel...</p>';
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_NOTE_STEP_MS));
      await execScript({ target: { tabId: tab.id }, files: ['inject-click-close-note.js'] });
      await new Promise((r) => setTimeout(r, 300));
      const closeRes97155 = await execScript({
        target: { tabId: tab.id },
        func: () => window.__clickCloseNoteResult
      });
      const closeData97155 = closeRes97155 && closeRes97155[0] && closeRes97155[0].result;
      if (!closeData97155 || !closeData97155.success) {
        log('97155 fix: close note soft-failed — ' + ((closeData97155 && closeData97155.error) || 'CLOSE button not found') + ', continuing');
      }
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_NOTE_STEP_MS));
      } finally { releaseFocusL3_97(); }

      /* ---- AUTO SIGN BOTH (client then provider) ---- */
      log('97155 fix: starting auto-sign');

      // Client signature
      const clientOk = await runSignatureSequence(tab, 'client', resultEl, true);
      if (!clientOk) {
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, 'Timesheet built OK but client signature failed. Use the manual Signature buttons to finish.');
        return;
      }

      resultEl.innerHTML = '<p>Client signed. Waiting 2s before provider...</p>';
      log('97155 fix: client signed, waiting 2s');
      await new Promise((r) => setTimeout(r, 2000));

      // Provider signature
      const providerOk = await runSignatureSequence(tab, 'provider', resultEl, false);
      if (!providerOk) {
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, 'Timesheet built OK but provider signature failed. Use the manual Signature buttons to finish.');
        return;
      }

      log('97155 fix: both signatures complete');

      const ok97155Three = await completeOverlapFixWithIngest(
        btn,
        '97155',
        '3-line',
        fo,
        resultEl,
        '<p><strong>Done.</strong> Part 1: ' +
          escapeHtml(timeFrom) +
          ' – ' +
          escapeHtml(timeTo) +
          '. Line 2 (nonbillable): ' +
          escapeHtml(overlapFrom) +
          ' – ' +
          escapeHtml(overlapTo) +
          '. Line 3 (billable): ' +
          escapeHtml(part3From) +
          ' – ' +
          escapeHtml(part3To) +
          '. Note connected. Both signatures applied.</p>',
        '97155 fix: 3-line fix complete, note connected, signatures done'
      );
      if (!ok97155Three) return;
    }
  } catch (err) {
    const msg = err.message || 'Unknown error';
    resultEl.innerHTML = '';
    log('97155 fix error: ' + msg);
    await prog97155(msg, 'error');
    setOverlapFixButtonState(btn, 'error');
    setOverlapFixFailReason(btn, msg);
  }
}

/**
 * Speech overlap — delegated click on **Fix** (`button.overlap-btn`) for Speech (92507 / spanning 97153).
 *
 * Purpose
 * -------
 * Resolve a “speech concurrence”: one 97153 row overlaps another service’s minutes. We split work
 * across **2 or 3 service lines on the same timesheet** so times don’t double-book and the overlap
 * window is explicit:
 *
 *   • **Line 1** — Original 97153 shortened so it no longer covers the overlap (`timeFrom`–`timeTo`).
 *   • **Line 2** — Nonbillable line for **only** the overlap (`overlapFrom`–`overlapTo`).
 *   • **Line 3** — (*Middle* only) Remaining billable 97153 after the overlap; mirror billing fields
 *     from line 1; attach the note to this line.
 *
 * **Start** / **end** → lines 1–2 only. **Middle** → lines 1–2–3.
 *
 * Handler sections: PREAMBLE (billing list) → LINE 1 → snapshot → LINE 2 → (branch) LINE 3 + note.
 */
async function runOverlapFixSpeech(btn, fixOpts) {
  const fo = fixOpts || {};
  const entryId = btn.getAttribute('data-entry-id');
  const timeFrom = btn.getAttribute('data-time-from');
  const timeTo = btn.getAttribute('data-time-to');
  const overlapText = btn.getAttribute('data-overlap') || '';
  const overlapFrom = btn.getAttribute('data-overlap-from') || '';
  const overlapTo = btn.getAttribute('data-overlap-to') || '';
  const overlapType = btn.getAttribute('data-overlap-type') || 'middle';
  const resultEl = fo.resultEl || document.getElementById('overlap-fix-result');
  const progressTabId = fo.progressTabId != null ? fo.progressTabId : null;
  async function progSpeech(message, phase) {
    if (progressTabId != null) {
      await writeConcurrenceFixProgress(progressTabId, message, phase || 'run', null);
    }
  }
  setOverlapFixButtonState(btn, 'loading');
  setOverlapFixFailReason(btn, '');
  /** Provider labels from the entry's contact card; captured before opening timesheet. */
  let overlapFixProviderLabels = null;
  /** Payor inject match for line 3 — "master" or "associate", from labels when overlapType is middle. */
  let overlapFixPayorMatch = null;
  /** Fee schedule role for line 3 — "bcba" | "lbs" | "rbt_bt" | null, from labels when inferrable. */
  let overlapFixProviderRole = null;
  resultEl.innerHTML = '<p>Getting provider labels...</p>';
  await progSpeech('Getting provider labels…', 'start');
  log('Overlap fix: entry ' + entryId + ', type ' + overlapType + ', set Part1 to ' + timeFrom + ' – ' + timeTo + ' (overlap: ' + overlapText + ')');
  try {
    let results;

    let tab;
    if (fo.targetTabId != null) {
      tab = { id: fo.targetTabId };
    } else {
      const [t] = await chrome.tabs.query({ active: true, currentWindow: true });
      tab = t;
    }
    if (!tab?.id) {
      const msg = 'No active tab.';
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, msg);
      return;
    }
    if (
      fo.targetTabId == null &&
      tab.url &&
      (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))
    ) {
      const msg = 'Cannot run on this page.';
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, msg);
      return;
    }

    /* -------------------------------------------------------------------------
     * PREAMBLE — Still on billing list: identify the row, optional provider labels, open editor.
     * Purpose: land on the correct timesheet (same entry) before touching line 1.
     * ------------------------------------------------------------------------- */
    await execScript({
      target: { tabId: tab.id },
      func: (id) => { window.__overlapFixEntryId = id; },
      args: [entryId]
    });
    await execScript({ target: { tabId: tab.id }, files: ['inject-provider-combo-for-entry.js'] });
    const maxWait = 18000;
    const pollMs = 400;
    let labelsResult = null;
    for (let elapsed = 0; elapsed < maxWait; elapsed += pollMs) {
      await new Promise(function (r) { setTimeout(r, pollMs); });
      const results = await execScript({
        target: { tabId: tab.id },
        func: () => window.__overlapFixProviderLabels
      });
      labelsResult = results && results[0] && results[0].result;
      if (labelsResult) break;
    }
    if (overlapType === 'middle') {
      if (!labelsResult || !labelsResult.success || !labelsResult.labels || !labelsResult.labels.length) {
        const msg = messageForOverlapFixProviderLabelsFailure(labelsResult);
        resultEl.innerHTML = '';
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, msg);
        log('Overlap fix: stopped — ' + msg);
        console.error('[Hidden Lights overlap fix] Missing provider labels (middle overlap):', labelsResult);
        return;
      }
      overlapFixProviderLabels = labelsResult.labels;
      log('Overlap fix: got ' + overlapFixProviderLabels.length + ' provider label(s): ' + overlapFixProviderLabels.join(', '));
      console.log('[Hidden Lights overlap fix] Provider label(s) read before fix:', overlapFixProviderLabels);
      const payorInf = inferPayorMatchFromProviderLabels(overlapFixProviderLabels);
      if (!payorInf.ok) {
        resultEl.innerHTML = '';
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, payorInf.error);
        log('Overlap fix: stopped — ' + payorInf.error);
        console.error('[Hidden Lights overlap fix] Payor inference failed:', payorInf.error, overlapFixProviderLabels);
        return;
      }
      overlapFixPayorMatch = payorInf.match;
      log(
        'Overlap fix: payor from labels → ' + payorInf.tier + ' (inject match "' + payorInf.match + '")'
      );
      console.log('[Hidden Lights overlap fix] Inferred payor:', payorInf.match, payorInf.tier, overlapFixProviderLabels);
      const roleInf = inferProviderRoleFromLabels(overlapFixProviderLabels, {
        providerName: (labelsResult && labelsResult.providerName) || ''
      });
      overlapFixProviderRole = roleInf.role;
      if (overlapFixProviderRole != null) {
        const multi =
          roleInf.allMatchedPrimary && roleInf.allMatchedPrimary.length > 1
            ? ' (highest among tagged roles: ' + formatFeeScheduleRolesList(roleInf.allMatchedPrimary) + ')'
            : '';
        log(
          'Overlap fix: decided fee-schedule role from labels — ' +
            feeScheduleRoleDisplayName(overlapFixProviderRole) +
            ' (inject match "' +
            overlapFixProviderRole +
            '")' +
            multi
        );
        console.log(
          '[Hidden Lights overlap fix] Decided fee-schedule role:',
          overlapFixProviderRole,
          '(' + feeScheduleRoleDisplayName(overlapFixProviderRole) + ')',
          'allMatchedPrimary:',
          roleInf.allMatchedPrimary,
          'labels:',
          overlapFixProviderLabels
        );
      } else {
        log(
          'Overlap fix: decided fee-schedule role from labels — none matched (BCBA / LBS / RBT-BT). Fee menu will skip unless it appears; if it appears without a role, Fix will ask you to pick the row.'
        );
        console.log(
          '[Hidden Lights overlap fix] Decided fee-schedule role: (none — no BCBA/LBS/RBT-BT tag matched)',
          overlapFixProviderLabels
        );
      }
    } else {
      if (labelsResult && labelsResult.success && labelsResult.labels) {
        overlapFixProviderLabels = labelsResult.labels;
        log('Overlap fix: got ' + overlapFixProviderLabels.length + ' provider label(s): ' + overlapFixProviderLabels.join(', '));
        console.log('[Hidden Lights overlap fix] Provider label(s) read before fix:', overlapFixProviderLabels);
        const roleInfSe = inferProviderRoleFromLabels(overlapFixProviderLabels, {
          providerName: (labelsResult && labelsResult.providerName) || ''
        });
        overlapFixProviderRole = roleInfSe.role;
        if (overlapFixProviderRole != null) {
          const multiSe =
            roleInfSe.allMatchedPrimary && roleInfSe.allMatchedPrimary.length > 1
              ? ' (highest among tagged roles: ' + formatFeeScheduleRolesList(roleInfSe.allMatchedPrimary) + ')'
              : '';
          log(
            'Overlap fix: decided fee-schedule role from labels — ' +
              feeScheduleRoleDisplayName(overlapFixProviderRole) +
              ' (inject match "' +
              overlapFixProviderRole +
              '")' +
              multiSe
          );
          console.log(
            '[Hidden Lights overlap fix] Decided fee-schedule role:',
            overlapFixProviderRole,
            '(' + feeScheduleRoleDisplayName(overlapFixProviderRole) + ')',
            'allMatchedPrimary:',
            roleInfSe.allMatchedPrimary,
            'labels:',
            overlapFixProviderLabels
          );
        } else {
          log(
            'Overlap fix: decided fee-schedule role from labels — none matched (not needed for start/end line count).'
          );
          console.log(
            '[Hidden Lights overlap fix] Decided fee-schedule role: (none)',
            overlapFixProviderLabels
          );
        }
      } else if (labelsResult && labelsResult.error) {
        log(
          'Overlap fix: provider labels failed – ' + labelsResult.error + ' (continuing — start/end, no line 3 payor)'
        );
        console.warn('[Hidden Lights overlap fix] Provider labels failed (continuing):', labelsResult.error, labelsResult);
      } else {
        console.warn(
          '[Hidden Lights overlap fix] No provider labels after poll (continuing — start/end overlap).',
          labelsResult
        );
      }
    }
    resultEl.innerHTML = '<p>Opening timesheet...</p>';
    await execScript({
      target: { tabId: tab.id },
      func: (id) => {
        window.location.hash = 'billingmanager/timesheeteditor/?&id=' + id;
        return { success: true };
      },
      args: [entryId]
    });
    await new Promise((r) => setTimeout(r, 500));
    await waitForTimesheetEditorReady(tab.id, entryId);
    await progSpeech('Timesheet editor open', 'timesheet');

    /* -------------------------------------------------------------------------
     * LINE 1 — First service line (trimmed 97153)
     * Purpose: shrink the original billable segment so it no longer includes the overlap window.
     * Outcome: active line shows timeFrom–timeTo (verified on From and To); still one line only.
     * ------------------------------------------------------------------------- */
    const part1ResultSp = await enterAndVerifyPart1Times(tab.id, timeFrom, timeTo, resultEl, 'Overlap fix');
    if (!part1ResultSp.ok) {
      resultEl.innerHTML = '';
      log('Overlap fix: Part 1 failed – ' + part1ResultSp.message);
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, part1ResultSp.message);
      return;
    }
    await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));
    await progSpeech('Part 1 verified', 'part1');

    /* Snapshot line 1 — provider / POS / address / date to reuse on new lines (esp. line 3). */
    resultEl.innerHTML = '<p>Recording from first timesheet...</p>';
    var snapSpeech = await captureOverlapFixTimesheetSnapshot(tab.id, progSpeech);
    if (!snapSpeech.ok) {
      const msg = snapSpeech.error || 'Could not read timesheet.';
      resultEl.innerHTML = '';
      log('Overlap fix: read timesheet failed');
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, msg);
      return;
    }
    const snapS = overlapFixRecordGet(tab.id);
    log('Overlap fix: recorded provider, place, address, date' + (snapS && snapS.timeZoneValue ? ', tz ' + snapS.timeZoneValue : ''));
    await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

    resultEl.innerHTML = '<p>Verifying line 1 times before line 2…</p>';
    await progSpeech('Verifying line 1 times before line 2…', 'part1');
    const part1GateSp = await assertPart1TimesBeforeLine2(tab.id, timeFrom, timeTo, 'Overlap fix');
    if (!part1GateSp.ok) {
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, part1GateSp.message);
      log('Overlap fix: ' + part1GateSp.message);
      return;
    }

    /* -------------------------------------------------------------------------
     * LINE 2 — Second service line (nonbillable overlap slice)
     * Purpose: add a row that covers exactly the overlapping minutes as nonbillable, same DOS.
     * Steps: ensure 2 tabs (add only if needed) → set date → pick nonbillable code → enter overlapFrom–overlapTo.
     * ------------------------------------------------------------------------- */
    resultEl.innerHTML = '<p>Checking service line tabs…</p>';
    let tabCountRes = await pollServiceLineTabCountUntilPositive(tab.id);
    let serviceLineCount =
      tabCountRes && typeof tabCountRes.count === 'number' ? tabCountRes.count : 0;
    if (serviceLineCount === 0) {
      const msg =
        'Could not detect service line tabs. Wait for the timesheet to finish loading and try again.';
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, msg);
      log('Overlap fix: no service line tabs');
      return;
    }
    if (serviceLineCount > 2) {
      const msg =
        'Too many service lines (' +
        serviceLineCount +
        '). Remove extra lines or start from a single-line timesheet before running this fix.';
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, msg);
      log('Overlap fix: too many lines before line 2 — ' + serviceLineCount);
      return;
    }
    if (serviceLineCount >= 2) {
      resultEl.innerHTML =
        '<p>Already ' +
        serviceLineCount +
        ' service line(s) — skipping add. Configure the active line as nonbillable overlap.</p>';
      log(
        'Overlap fix: skip add for line 2 (already ' + serviceLineCount + ' tab(s), scoped count)'
      );
    } else {
      resultEl.innerHTML = '<p>Adding second service line…</p>';
      await execScript({
        target: { tabId: tab.id },
        files: ['inject-service-line-tab-count.js']
      });
      await new Promise((r) => setTimeout(r, 150));
      await execScript({
        target: { tabId: tab.id },
        func: () => { window.__addServiceLineMaxBefore = 1; }
      });
      await execScript({
        target: { tabId: tab.id },
        files: ['inject-add-service-line.js']
      });
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));
      await new Promise((r) => setTimeout(r, 550));
      results = await execScript({
        target: { tabId: tab.id },
        func: () => window.__addServiceLineResult
      });
      data = results && results[0] && results[0].result;
      if (!data) {
        const msg = 'Add service line: no result.';
        resultEl.innerHTML = '';
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, msg);
        return;
      }
      if (data.error) {
        resultEl.innerHTML = '';
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, data.error);
        return;
      }
      if (data.skipped) {
        log('Overlap fix: add-service-line skipped (already enough lines)');
      }
      tabCountRes = await fetchServiceLineTabCount(tab.id);
      serviceLineCount = tabCountRes && typeof tabCountRes.count === 'number' ? tabCountRes.count : 0;
      if (serviceLineCount !== 2) {
        const msg =
          'After adding a line, expected exactly 2 service lines, got ' +
          serviceLineCount +
          '. Before/after from click: ' +
          data.countBefore +
          ' → ' +
          data.countAfter +
          '.';
        resultEl.innerHTML = '';
        log('Overlap fix: service line count after add mismatch');
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, msg);
        return;
      }
      log('Overlap fix: second service line present (count verified)');
    }
    await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

    resultEl.innerHTML = '<p>Setting date on new line...</p>';
    var releaseFocusL2sp = await focusTargetTabForTimesheetUi(tab.id);
    try {
      await execScript({
        target: { tabId: tab.id },
        func: (d) => { window.__setDateOfServiceResult = null; window.__dateOfServiceValue = d; },
        args: [overlapFixRecordGet(tab.id).dateOfService]
      });
      await execScript({ target: { tabId: tab.id }, files: ['inject-set-date-of-service.js'] });
      await pollForInjectResult(tab.id, '__setDateOfServiceResult', SET_DATE_INJECT_SETTLE_MS, 200);

    resultEl.innerHTML = '<p>Waiting for new line to load, then selecting nonbillable code...</p>';
    const codesLinkReady = await overlapUiPollTry({
      tryOnce: () => probeServiceCodesLinkReady(tab.id),
      resultEl,
      waitingHtml: 'Waiting for <strong>Service Codes</strong> link (new line)…'
    });
    if (!codesLinkReady) {
      const msg =
        'Service Codes link did not appear within ' +
        Math.round(OVERLAP_FIX_UI_POLL_MAX_MS / 1000) +
        's — wait for the tab to finish loading and run Fix again.';
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, msg);
      log('Overlap fix: ' + msg);
      return;
    }
    resultEl.innerHTML = '<p>Selecting nonbillable code...</p>';
    await execScript({ target: { tabId: tab.id }, files: ['inject-select-service-codes.js'] });
    await new Promise((r) => setTimeout(r, 900));
    await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));
    results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__selectServiceCodesResult
    });
    data = results && results[0] && results[0].result;
    if (data && data.error) {
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, 'Nonbillable code: ' + data.error);
      return;
    }
    await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

    resultEl.innerHTML = '<p>Entering overlap times (nonbillable)…</p>';
    const line2TimesSp = await enterAndVerifyTimesOnLine(
      tab.id,
      1,
      overlapFrom,
      overlapTo,
      resultEl,
      'Overlap fix',
      {
        lineLabel: 'Line 2 (nonbillable)',
        stepLabel: 'Line 2 (nonbillable overlap)',
        manageFocus: false
      }
    );
    if (!line2TimesSp.ok) {
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, line2TimesSp.message);
      return;
    }
    await applyCapturedTimesheetTimezone(tab.id, 'Texas line 2');
    const line2AfterTzSp = await assertTimesOnLine(
      tab.id,
      1,
      overlapFrom,
      overlapTo,
      'Overlap fix',
      { lineLabel: 'Line 2 (nonbillable)', manageFocus: false }
    );
    if (!line2AfterTzSp.ok) {
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, line2AfterTzSp.message);
      return;
    }
    const line1AfterL2Sp = await assertPart1TimesBeforeLine2(tab.id, timeFrom, timeTo, 'Overlap fix', {
      manageFocus: false
    });
    if (!line1AfterL2Sp.ok) {
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, line1AfterL2Sp.message);
      return;
    }
    await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));
    } finally { releaseFocusL2sp(); }

    /* Start/end overlap: line 1 + line 2 completes the fix (no billable segment after overlap). */
    if (overlapType !== 'middle') {
      const okSpeechTwo = await completeOverlapFixWithIngest(
        btn,
        'speech',
        '2-line',
        fo,
        resultEl,
        '<p><strong>Done.</strong> Part 1: ' +
          escapeHtml(timeFrom) +
          ' – ' +
          escapeHtml(timeTo) +
          '. Line 2 (nonbillable): ' +
          escapeHtml(overlapFrom) +
          ' – ' +
          escapeHtml(overlapTo) +
          '. No third line (overlap at ' +
          (overlapType === 'start' ? 'start' : 'end') +
          ').</p>',
        'Overlap fix: 2-line fix complete (' + overlapType + ')'
      );
      if (!okSpeechTwo) return;
    } else {
      /* -------------------------------------------------------------------------
       * LINE 3 — Third service line (billable 97153 after overlap) + note
       * Purpose: restore billable 97153 for minutes after the overlap; mirror billing fields from
       * line 1; link the session note to this line so documentation matches the billable segment.
       * ------------------------------------------------------------------------- */
      const part3From = btn.getAttribute('data-part3-from') || '';
      const part3To = btn.getAttribute('data-part3-to') || '';

      resultEl.innerHTML = '<p>Checking service line tabs before third line…</p>';
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));
      tabCountRes = await fetchServiceLineTabCount(tab.id);
      serviceLineCount =
        tabCountRes && typeof tabCountRes.count === 'number' ? tabCountRes.count : 0;
      if (serviceLineCount < 2) {
        const msg =
          'Expected at least 2 service lines before adding the third, got ' + serviceLineCount + '.';
        resultEl.innerHTML = '';
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, msg);
        log('Overlap fix: too few lines before line 3');
        return;
      }
      if (serviceLineCount > 3) {
        const msg =
          'Too many service lines (' +
          serviceLineCount +
          ') before the third line. Remove extras or finish manually.';
        resultEl.innerHTML = '';
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, msg);
        log('Overlap fix: too many lines before line 3 — ' + serviceLineCount);
        return;
      }
      if (serviceLineCount >= 3) {
        resultEl.innerHTML =
          '<p>Already ' +
          serviceLineCount +
          ' service line(s) — skipping add. Configure the active line as billable 97153.</p>';
        log(
          'Overlap fix: skip add for line 3 (already ' + serviceLineCount + ' tab(s))'
        );
      } else {
        resultEl.innerHTML = '<p>Adding third service line (billable, after overlap)...</p>';
        await execScript({
          target: { tabId: tab.id },
          files: ['inject-service-line-tab-count.js']
        });
        await new Promise((r) => setTimeout(r, 150));
        await execScript({
          target: { tabId: tab.id },
          func: () => { window.__addServiceLineMaxBefore = 2; }
        });
        await execScript({
          target: { tabId: tab.id },
          files: ['inject-add-service-line.js']
        });
        await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));
        await new Promise((r) => setTimeout(r, 550));
        results = await execScript({
          target: { tabId: tab.id },
          func: () => window.__addServiceLineResult
        });
        data = results && results[0] && results[0].result;
        if (!data || data.error) {
          const msg = (data && data.error) ? data.error : 'Add third line: no result.';
          resultEl.innerHTML = '';
          setOverlapFixButtonState(btn, 'error');
          setOverlapFixFailReason(btn, msg);
          return;
        }
        if (data.skipped) {
          log('Overlap fix: add-service-line skipped for line 3 (already enough lines)');
        }
        tabCountRes = await fetchServiceLineTabCount(tab.id);
        serviceLineCount =
          tabCountRes && typeof tabCountRes.count === 'number' ? tabCountRes.count : 0;
        if (serviceLineCount !== 3) {
          const msg =
            'After adding a line, expected 3 service lines, got ' +
            serviceLineCount +
            '. Click reported ' +
            (data.countBefore ?? '?') +
            ' → ' +
            (data.countAfter ?? '?') +
            '.';
          resultEl.innerHTML = '';
          setOverlapFixButtonState(btn, 'error');
          setOverlapFixFailReason(btn, msg);
          log('Overlap fix: count after third add mismatch');
          return;
        }
        log('Overlap fix: third service line present (count verified)');
      }
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

      /* Line 3 — same date of service as line 1 */
      resultEl.innerHTML = '<p>Setting date on third line...</p>';
      var releaseFocusL3sp = await focusTargetTabForTimesheetUi(tab.id);
      try {
        await execScript({
          target: { tabId: tab.id },
          func: (d) => { window.__setDateOfServiceResult = null; window.__dateOfServiceValue = d; },
          args: [overlapFixRecordGet(tab.id).dateOfService]
        });
        await execScript({ target: { tabId: tab.id }, files: ['inject-set-date-of-service.js'] });
        await pollForInjectResult(tab.id, '__setDateOfServiceResult', SET_DATE_INJECT_SETTLE_MS, 200);

      /* Line 3 — billable code + payor / POS / address (align with trimmed workflow) */
      const billableReady = await overlapUiPollTry({
        tryOnce: () => probeBillable97153Ready(tab.id),
        resultEl,
        waitingHtml: 'Waiting for billable <strong>97153: Direct Care – RBT/BT</strong>…'
      });
      if (!billableReady) {
        const msg =
          'Billable line (97153 Direct Care RBT/BT) did not appear within ' +
          Math.round(OVERLAP_FIX_UI_POLL_MAX_MS / 1000) +
          's — open the billable tab if needed and try again.';
        resultEl.innerHTML = '';
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, msg);
        log('Overlap fix: ' + msg);
        return;
      }
      resultEl.innerHTML = '<p>Clicking 97153 (billable)...</p>';
      await execScript({ target: { tabId: tab.id }, files: ['inject-click-billable-97153.js'] });
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

      resultEl.innerHTML = '<p>Visit location (HOME / OFFICE / OTHER) if shown…</p>';
      const visitTier = inferVisitLocationMatchFromPlaceOfService(overlapFixRecordGet(tab.id).placeOfService);
      await execScript({
        target: { tabId: tab.id },
        func: (m) => {
          window.__visitLocationMatch = m;
        },
        args: [visitTier]
      });
      const visitPick = await runInjectVisitLocationSelect(tab.id);
      if (visitPick && !visitPick.success) {
        const vmsg = visitPick.error || 'Visit location step failed.';
        resultEl.innerHTML = '';
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, vmsg);
        log('Overlap fix: visit location — ' + vmsg);
        logPayorResultPayload('Overlap fix', 'visit location', visitPick);
        return;
      }
      if (visitPick && visitPick.skipped) {
        log('Overlap fix: visit location cards not on screen — skipped');
      } else if (visitPick && visitPick.success) {
        log('Overlap fix: visit location selected (' + visitTier + ')');
      }
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

      /**
       * Line 3: fee schedule rows (BCBA / LBS / RBT-BT + plus) and Master/Associate payor tier can appear
       * sequentially in either order, or not at all. Poll until both are resolved or combined timeout.
       */
      let feeHandled = false;
      let payorHandled = false;
      let payorPick = null;
      const combinedDeadline = Date.now() + OVERLAP_FIX_FEE_PAYOR_COMBINED_MAX_MS;
      let pass = 0;
      while (Date.now() < combinedDeadline && (!feeHandled || !payorHandled)) {
        pass += 1;
        resultEl.innerHTML =
          '<p>Fee schedule / payor tier' +
          (pass > 1 ? ' <span style="opacity:0.85">· pass ' + pass + '</span>' : '') +
          '…</p>';

        if (!feeHandled) {
          var feePlace = inferVisitLocationMatchFromPlaceOfService(
            (overlapFixRecordGet(tab.id).placeOfService || ''));
          await execScript({
            target: { tabId: tab.id },
            func: (role, tier, place) => {
              window.__feeScheduleRoleMatch = role != null && role !== '' ? String(role) : '';
              window.__feeScheduleTierMatch =
                tier != null && tier !== '' ? String(tier).trim().toLowerCase() : '';
              window.__feeSchedulePlaceMatch =
                place != null && place !== '' ? String(place).trim().toLowerCase() : '';
            },
            args: [
              overlapFixProviderRole != null ? overlapFixProviderRole : '',
              overlapFixPayorMatch != null ? overlapFixPayorMatch : '',
              feePlace || ''
            ]
          });
          const feePick = await runInjectFeeScheduleRoleSelect(tab.id);
          logRemoteInjectDebug('Overlap fix: fee schedule script (pass ' + pass + ')', feePick);
          if (!feePick || !feePick.success) {
            log('Overlap fix: fee schedule not matched yet (pass ' + pass + ')' +
              (Date.now() < combinedDeadline ? ', will retry…' : ' — will continue without it.'));
          } else if (feePick.clicked > 0) {
            feeHandled = true;
            log(
              'Overlap fix: fee schedule plus clicked (' +
                (feePick.matchedText || overlapFixProviderRole || '') +
                ')'
            );
            var feeMt = feePick.matchedText || '';
            if (feeMt.indexOf('+master') !== -1 || feeMt.indexOf('+associate') !== -1) {
              payorHandled = true;
              log(
                'Overlap fix: education tier was part of fee step (' +
                  feeMt +
                  '); will not run duplicate payor / education card step.'
              );
            }
          } else if (feePick.skipped && feePick.debug && feePick.debug.shippedStub) {
            feeHandled = true;
            log(
              'Overlap fix: fee schedule — core build has no bundled DOM script; host inject-select-fee-schedule-role via POEL/repo or click the row yourself.'
            );
          }
        }

        if (!payorHandled) {
          await execScript({
            target: { tabId: tab.id },
            func: (m) => {
              window.__payorOptionMatch = m;
            },
            args: [overlapFixPayorMatch || PAYOR_OPTION_MATCH]
          });
          payorPick = await runInjectPayorSelect(tab.id);
          logRemoteInjectDebug('Overlap fix: payor / education script (pass ' + pass + ')', payorPick);
          if (!payorPick || !payorPick.success) {
            log('Overlap fix: payor / education not matched yet (pass ' + pass + ')' +
              (Date.now() < combinedDeadline ? ', will retry…' : ' — will continue without it.'));
          } else if (!payorPick.skipped) {
            payorHandled = true;
            logPayorResultPayload('Overlap fix', 'combined payor OK', payorPick);
          } else if (payorPick.skipped && payorPick.debug && payorPick.debug.shippedStub) {
            payorHandled = true;
            log(
              'Overlap fix: payor / education — core build has no bundled DOM script; host inject-select-payor-option via POEL/repo or click the tier yourself.'
            );
          } else if (
            payorPick.skipped &&
            payorPick.debug &&
            payorPick.debug.skipReason === 'no_payor_or_education_ui'
          ) {
            payorHandled = true;
            log(
              'Overlap fix: payor / education — no tier cards (already handled or next step); continuing.'
            );
          } else {
            log('Overlap fix: payor / education tier not on screen yet (pass ' + pass + ')');
          }
        }

        if (feeHandled && payorHandled) break;
        const wait = Math.min(OVERLAP_FIX_UI_POLL_MS, Math.max(0, combinedDeadline - Date.now()));
        if (wait > 0) await new Promise((r) => setTimeout(r, wait));
      }

      if (!feeHandled) {
        var feePlaceFinal = inferVisitLocationMatchFromPlaceOfService(
          (overlapFixRecordGet(tab.id).placeOfService || ''));
        await execScript({
          target: { tabId: tab.id },
          func: (role, tier, place) => {
            window.__feeScheduleRoleMatch = role != null && role !== '' ? String(role) : '';
            window.__feeScheduleTierMatch =
              tier != null && tier !== '' ? String(tier).trim().toLowerCase() : '';
            window.__feeSchedulePlaceMatch =
              place != null && place !== '' ? String(place).trim().toLowerCase() : '';
          },
          args: [
            overlapFixProviderRole != null ? overlapFixProviderRole : '',
            overlapFixPayorMatch != null ? overlapFixPayorMatch : '',
            feePlaceFinal || ''
          ]
        });
        const feeFinal = await runInjectFeeScheduleRoleSelect(tab.id);
        logRemoteInjectDebug('Overlap fix: fee schedule script (final pass)', feeFinal);
        if (!feeFinal || !feeFinal.success) {
          const msg =
            (feeFinal && feeFinal.error) ||
            'Fee schedule step could not match — continuing (pick the correct plus (+) yourself if needed).';
          log('Overlap fix: fee schedule (final) — ' + msg);
        } else if (feeFinal.skipped) {
          log('Overlap fix: fee schedule menu never appeared — skipped');
        } else if (feeFinal.clicked > 0) {
          log('Overlap fix: fee schedule plus clicked on final pass');
        }
        feeHandled = true;
      }

      if (!payorHandled) {
        payorPick = payorPick || { success: true, skipped: true };
        log('Overlap fix: payor tier did not appear — continuing (skipped)');
        logPayorResultPayload('Overlap fix', 'combined payor timeout', payorPick);
      } else {
        logPayorResultPayload('Overlap fix', 'combined final', payorPick);
      }

      await new Promise((r) => setTimeout(r, OVERLAP_FIX_AFTER_MASTER_MS));

      resultEl.innerHTML = '<p>Place of service (from original)...</p>';
      const placeMatch = (overlapFixRecordGet(tab.id).placeOfService || '').trim() || PLACE_OF_SERVICE_MATCH;
      await execScript({
        target: { tabId: tab.id },
        func: (m) => { window.__placeOfServiceMatch = m; },
        args: [placeMatch]
      });
      await execScript({ target: { tabId: tab.id }, files: ['inject-select-place-of-service.js'] });
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

      resultEl.innerHTML = '<p>Service address (from original)...</p>';
      const addressMatch = (overlapFixRecordGet(tab.id).serviceAddressText || overlapFixRecordGet(tab.id).serviceAddress || '').trim() || SERVICE_ADDRESS_MATCH;
      await execScript({
        target: { tabId: tab.id },
        func: (m) => { window.__serviceAddressMatch = m; },
        args: [addressMatch]
      });
      await execScript({ target: { tabId: tab.id }, files: ['inject-select-service-address.js'] });
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

      /* Line 3 — times for post-overlap billable segment */
      resultEl.innerHTML = '<p>Entering Part 3 times (after overlap)…</p>';
      const line3TimesSp = await enterAndVerifyTimesOnLine(
        tab.id,
        2,
        part3From,
        part3To,
        resultEl,
        'Overlap fix',
        {
          lineLabel: 'Part 3',
          stepLabel: 'Part 3 (billable segment after overlap)',
          pollMaxMs: ENTER_TIMES_PART3_POLL_MAX_MS,
          manageFocus: false
        }
      );
      if (!line3TimesSp.ok) {
        resultEl.innerHTML = '';
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, line3TimesSp.message);
        return;
      }
      await applyCapturedTimesheetTimezone(tab.id, 'Texas line 3');
      const line3AfterTzSp = await assertTimesOnLine(
        tab.id,
        2,
        part3From,
        part3To,
        'Overlap fix',
        { lineLabel: 'Part 3', manageFocus: false }
      );
      if (!line3AfterTzSp.ok) {
        resultEl.innerHTML = '';
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, line3AfterTzSp.message);
        return;
      }
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

      /* Line 3 — attach note (primary tries session picker + date/name without SELECT EXISTING NOTE; button is backup) */
      const notePickSpeech = await tryOverlapFixPickNoteBackupThenPrimary(tab.id, resultEl, 'Overlap fix');
      if (!notePickSpeech.ok) {
        resultEl.innerHTML = overlapFixNoteFailureHtml(notePickSpeech.msg);
        log('Overlap fix: note step failed – ' + notePickSpeech.msg);
        await progSpeech(notePickSpeech.msg || 'Note step failed', 'error');
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, notePickSpeech.msg);
        return;
      }

      resultEl.innerHTML = '<p>Closing note panel...</p>';
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_NOTE_STEP_MS));
      await execScript({ target: { tabId: tab.id }, files: ['inject-click-close-note.js'] });
      await new Promise((r) => setTimeout(r, 300));
      const closeResSpeech = await execScript({
        target: { tabId: tab.id },
        func: () => window.__clickCloseNoteResult
      });
      const closeDataSpeech = closeResSpeech && closeResSpeech[0] && closeResSpeech[0].result;
      if (!closeDataSpeech || !closeDataSpeech.success) {
        log('Overlap fix: close note soft-failed — ' + ((closeDataSpeech && closeDataSpeech.error) || 'CLOSE button not found') + ', continuing');
      }
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_NOTE_STEP_MS));
      } finally { releaseFocusL3sp(); }

      const okSpeechThree = await completeOverlapFixWithIngest(
        btn,
        'speech',
        '3-line',
        fo,
        resultEl,
        '<p><strong>Done.</strong> Part 1: ' +
          escapeHtml(timeFrom) +
          ' – ' +
          escapeHtml(timeTo) +
          '. Line 2 (nonbillable): ' +
          escapeHtml(overlapFrom) +
          ' – ' +
          escapeHtml(overlapTo) +
          '. Line 3 (billable): ' +
          escapeHtml(part3From) +
          ' – ' +
          escapeHtml(part3To) +
          '. Note connected.</p>',
        'Overlap fix: note connected'
      );
      if (!okSpeechThree) return;
    }
  } catch (err) {
    const msg = err.message || 'Unknown error';
    resultEl.innerHTML = '';
    log('Overlap fix error: ' + msg);
    await progSpeech(msg, 'error');
    setOverlapFixButtonState(btn, 'error');
    setOverlapFixFailReason(btn, msg);
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      // await clickTimesheetCancel(tab);  // temporarily disabled: don't close dialog on error
    } catch (e) {}
  }
}

document.body.addEventListener('click', async (e) => {
  const btn = e.target.closest('button.overlap-btn');
  if (!btn || btn.disabled) return;
  if (btn.getAttribute('data-fix-mode') === '97155-multi') {
    return runOverlapFix97155Multi(btn);
  }
  if (btn.getAttribute('data-fix-mode') === '97155') {
    return runOverlapFix97155(btn);
  }
  await runOverlapFixSpeech(btn, {});
});

/* ---------- AI Search ---------- */

const AI_SEARCH_SYSTEM_PROMPT = [
  'You are an expert billing data analyst.',
  '',
  'You will receive ONLY the table structure: column headers, keys, and a few sample rows.',
  'You will NOT receive the full dataset. Your job is to write a JavaScript filter function',
  'that will be executed locally against all the data.',
  '',
  'You will receive:',
  '1. "headers" - human-readable column names in display order.',
  '2. "keys" - the corresponding camelCase property keys on each row object.',
  '3. "sampleRows" - 2-3 example rows so you can see exact property names, value formats, and data patterns.',
  '4. "totalRows" - how many rows are in the full dataset.',
  '',
  'Core field names (always present):',
  '- date, time, client, payor, providers, labels, serviceAuth, location',
  '- hrs, units, billedRate (rate per unit), agreedRate (agreed rate, may be empty)',
  '- billedCharges (total billed), agreedCharges (total agreed, may be empty)',
  '- calcAdj, prAmt (patient responsibility), adj, paid, owed',
  'Additional dynamic columns may also exist (check the keys/sampleRows).',
  '',
  'Return ONLY a valid JSON object with these fields:',
  '{',
  '  "filterFn": "<javascript function body>",',
  '  "explanation": "<brief summary>",',
  '  "displayFields": ["<field1>", "<field2>", ...],',
  '  "groupMode": "single" | "pairs"',
  '}',
  '',
  'displayFields: array of property key names that are RELEVANT to this query.',
  'Only include fields the user cares about. Always include "client" and "date".',
  'For example, if the user asks about payor and service codes at the same time,',
  'include: ["client","date","time","serviceAuth","payor"].',
  'If they ask about agreed charges, include: ["client","date","serviceAuth","agreedCharges","billedCharges"].',
  '',
  'groupMode: how results should be displayed.',
  '- "single": each matching row shown individually (default for simple filters).',
  '- "pairs": results involve comparing two rows (e.g. overlapping times, concurrence',
  '  checks). The filterFn must then return a FLAT array of idx values where consecutive',
  '  pairs are related: [rowA1, rowB1, rowA2, rowB2, ...]. The UI will display each pair',
  '  side by side in one card so the user can compare them.',
  '',
  'filterFn rules:',
  '- Function body string. Takes (rows, parseTime). Returns array of idx values.',
  '- For groupMode "pairs": return idx values in consecutive pairs [a,b, a,b, ...].',
  '- rows is the full array of row objects. Each has "idx" plus all column properties.',
  '- parseTime("9:00am") returns minutes since midnight. Returns null if unparseable.',
  '- For time ranges like "9:00am-10:00am", split on "-" yourself.',
  '- Use ONLY plain ES5 JavaScript (var, for, function). No arrow functions, no let/const, no template literals.',
  '- Called as: new Function("rows","parseTime", filterFn)(rows, parseTime)',
  '- Dollar amounts may contain "$", ",", or be empty. Parse with: parseFloat((val||"").replace(/[^\\d.\\-]/g,""))',
  '',
  'Important rules:',
  '- ALWAYS use the property names visible in sampleRows. Do NOT guess field names.',
  '- "at the same time" / "overlapping" means time ranges overlap (startA < endB AND startB < endA).',
  '- Service codes are in serviceAuth, e.g. "97155 - Adaptive behavior treatment".',
  '- Match payor names case-insensitively with substring matching.',
  '- Group by client+date when comparing across rows for the same client/date.',
  '- "agreed" refers to agreedRate or agreedCharges. "billed" refers to billedRate or billedCharges.',
  '- The filter must handle ALL rows and return every matching idx.',
  '- Return ONLY the JSON object, no markdown fences, no extra text.'
].join('\n');

async function readBillingTableData(tab) {
  if (typeof window.SHELL !== 'undefined' && window.SHELL.runScript) {
    await window.SHELL.runScript('inject-read-billing-table');
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__billingTableData
    });
    return results && results[0] && results[0].result;
  }
  await execScript({ target: { tabId: tab.id }, files: ['inject-read-billing-table.js'] });
  const results = await execScript({
    target: { tabId: tab.id },
    func: () => window.__billingTableData
  });
  return results && results[0] && results[0].result;
}

async function callAnthropicAPI(apiKey, tableData, userQuery) {
  var rows = tableData.rows || [];
  var headers = tableData.headers || [];
  var keys = tableData.keys || [];

  var sampleRows = rows.slice(0, Math.min(3, rows.length));

  var userContent = 'Column headers: ' + JSON.stringify(headers) +
    '\nColumn keys: ' + JSON.stringify(keys) +
    '\nSample rows (' + sampleRows.length + ' of ' + rows.length + ' total):\n' + JSON.stringify(sampleRows, null, 1) +
    '\ntotalRows: ' + rows.length +
    '\n\nFind: ' + userQuery;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: AI_SEARCH_SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: userContent
      }]
    })
  });
  if (!response.ok) {
    const errBody = await response.text();
    throw new Error('Anthropic API error ' + response.status + ': ' + errBody);
  }
  return response.json();
}

var FIELD_LABELS = {
  date: 'Date', time: 'Time', client: 'Client', payor: 'Payor',
  providers: 'Provider', labels: 'Labels', serviceAuth: 'Service',
  location: 'Location', hrs: 'Hrs', units: 'Units',
  billedRate: 'Rate', agreedRate: 'Agreed Rate',
  billedCharges: 'Billed', agreedCharges: 'Agreed',
  calcAdj: 'Calc Adj', prAmt: 'PR Amt', adj: 'Adj', paid: 'Paid', owed: 'Owed'
};

function _renderRowFields(r, fields) {
  if (!fields || fields.length === 0) {
    fields = ['client', 'date', 'time', 'serviceAuth', 'payor', 'providers'];
  }
  var html = '';
  var parts = [];
  for (var i = 0; i < fields.length; i++) {
    var key = fields[i];
    var val = r[key];
    if (val === undefined || val === null || val === '') continue;
    var label = FIELD_LABELS[key] || key;
    parts.push('<b>' + escapeHtml(label) + ':</b> ' + escapeHtml(val));
  }
  for (var i = 0; i < parts.length; i++) {
    html += '<div class="ai-result-item__line">' + parts[i] + '</div>';
  }
  return html;
}

function renderAISearchResults(allRows, matchIndices, explanation, displayFields, groupMode) {
  const resultEl = document.getElementById('ai-search-result');
  const listEl = document.getElementById('ai-search-list');
  resultEl.innerHTML = '';
  listEl.innerHTML = '';

  if (!displayFields || displayFields.length === 0) {
    displayFields = ['client', 'date', 'time', 'serviceAuth', 'payor'];
  }
  if (!groupMode) groupMode = 'single';

  const rowMap = {};
  allRows.forEach(function (r) { rowMap[r.idx] = r; });

  const uniqueIndices = [];
  const seen = {};
  matchIndices.forEach(function (idx) {
    if (!seen[idx]) { seen[idx] = true; uniqueIndices.push(idx); }
  });

  var resultCount;
  if (groupMode === 'pairs') {
    resultCount = Math.floor(matchIndices.length / 2);
  } else {
    resultCount = uniqueIndices.length;
  }

  const h3 = document.createElement('h3');
  h3.textContent = resultCount + ' result' + (resultCount !== 1 ? 's' : '') + ' found';
  resultEl.appendChild(h3);

  if (explanation) {
    const p = document.createElement('p');
    p.className = 'ai-summary';
    p.textContent = explanation;
    resultEl.appendChild(p);
  }

  if (resultCount === 0) return;

  const list = document.createElement('ul');
  list.className = 'overlap-list';

  if (groupMode === 'pairs') {
    for (var i = 0; i + 1 < matchIndices.length; i += 2) {
      var rA = rowMap[matchIndices[i]];
      var rB = rowMap[matchIndices[i + 1]];
      if (!rA && !rB) continue;

      var li = document.createElement('li');
      li.className = 'overlap-list__item ai-result-item ai-result-pair';
      var html = '';
      if (rA) {
        html += '<div class="ai-pair-row">' + _renderRowFields(rA, displayFields) + '</div>';
      }
      html += '<div class="ai-pair-vs">vs</div>';
      if (rB) {
        html += '<div class="ai-pair-row">' + _renderRowFields(rB, displayFields) + '</div>';
      }
      li.innerHTML = html;
      list.appendChild(li);
    }
  } else {
    uniqueIndices.forEach(function (idx) {
      var r = rowMap[idx];
      if (!r) return;
      var li = document.createElement('li');
      li.className = 'overlap-list__item ai-result-item';
      li.innerHTML = _renderRowFields(r, displayFields);
      list.appendChild(li);
    });
  }

  listEl.appendChild(list);
}

async function runAISearch() {
  const resultEl = document.getElementById('ai-search-result');
  const listEl = document.getElementById('ai-search-list');
  const input = document.getElementById('ai-search-input');
  const query = (input && input.value || '').trim();

  if (!query) {
    resultEl.innerHTML = '<p>Please enter a search query.</p>';
    listEl.innerHTML = '';
    return;
  }

  resultEl.innerHTML = '<p>Reading billing table...</p>';
  listEl.innerHTML = '';

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) {
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }

    await resetPageHighlightsAndFilter();

    const data = await readBillingTableData(tab);
    if (!data || data.error) {
      resultEl.innerHTML = '<p>' + escapeHtml((data && data.error) || 'No billing table found on this page.') + '</p>';
      return;
    }

    const rows = data.rows || [];
    if (rows.length === 0) {
      resultEl.innerHTML = '<p>Billing table is empty (0 rows).</p>';
      return;
    }

    await _ensureSettingsLoaded();
    const saved = getSavedSearches().find(s => s.query.toLowerCase() === query.toLowerCase());
    let matchIndices, explanation, filterFn;
    let displayFields = [];
    let groupMode = 'single';

    if (saved && saved.filterFn) {
      log('AI Search: running saved filter on ' + rows.length + ' rows');
      resultEl.innerHTML = '<p>Running saved filter (' + rows.length + ' rows)...</p>';
      const localResult = runSavedFilter(rows, saved.filterFn);
      if (localResult !== null) {
        matchIndices = localResult;
        explanation = 'Saved search (no AI call)';
        filterFn = saved.filterFn;
        displayFields = Array.isArray(saved.displayFields) ? saved.displayFields : [];
        groupMode = saved.groupMode || 'single';
      } else {
        log('Saved filter failed, falling back to AI');
        matchIndices = null;
      }
    }

    if (matchIndices == null) {
      const apiKey = getAnthropicApiKey();
      if (!apiKey) {
        resultEl.innerHTML = '<p>No Anthropic API key set. Open Settings (gear icon) and add your key.</p>';
        listEl.innerHTML = '';
        return;
      }
      log('AI Search: ' + rows.length + ' rows, querying AI for filter...');
      resultEl.innerHTML = '<p>Querying AI for filter function...</p>';

      const apiResponse = await callAnthropicAPI(apiKey, data, query);
      const textBlock = (apiResponse.content || []).find(b => b.type === 'text');
      const rawText = textBlock ? textBlock.text : '';

      let parsed;
      try {
        parsed = JSON.parse(rawText);
      } catch (e) {
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('AI returned invalid JSON: ' + rawText.slice(0, 200));
        }
      }

      filterFn = (typeof parsed.filterFn === 'string') ? parsed.filterFn : '';
      explanation = parsed.explanation || '';
      displayFields = Array.isArray(parsed.displayFields) ? parsed.displayFields : [];
      groupMode = (parsed.groupMode === 'pairs') ? 'pairs' : 'single';

      if (!filterFn) {
        throw new Error('AI did not return a filter function.');
      }

      resultEl.innerHTML = '<p>Running filter on ' + rows.length + ' rows...</p>';
      matchIndices = runSavedFilter(rows, filterFn);
      if (matchIndices === null) {
        throw new Error('Filter function returned an error. Try rephrasing your query.');
      }
    }

    log('AI Search: ' + matchIndices.length + ' matches, mode=' + groupMode);
    renderAISearchResults(rows, matchIndices, explanation, displayFields, groupMode);

    _lastSuccessfulQuery = query;
    _lastFilterFn = filterFn;
    _lastMatchIndices = matchIndices;
    _lastDisplayFields = displayFields;
    _lastGroupMode = groupMode;
    const saveBtn = document.getElementById('ai-save-search-btn');
    if (saveBtn) {
      const already = getSavedSearches().some(s => s.query.toLowerCase() === query.toLowerCase());
      saveBtn.style.display = already ? 'none' : '';
    }
    const filterBtn = document.getElementById('ai-filter-btn');
    if (filterBtn) filterBtn.style.display = matchIndices.length > 0 ? '' : 'none';
    const resetBtn = document.getElementById('ai-reset-page-btn');
    if (resetBtn) resetBtn.style.display = 'none';
    const hlBtn = document.getElementById('ai-highlight-toggle');
    if (hlBtn) hlBtn.style.display = matchIndices.length > 0 ? '' : 'none';

    _lastUsedCols = _detectUsedColumns(filterFn, data.keys || []);

    if (matchIndices.length > 0) {
      var hlToggle = document.getElementById('ai-highlight-toggle');
      if (!hlToggle || hlToggle.classList.contains('active')) {
        await highlightRowsOnPage(matchIndices, _lastUsedCols);
      }
    }
  } catch (e) {
    log('AI Search error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
    listEl.innerHTML = '';
  }
}

/* Saved searches: { query: string, filterFn: string }[] */
function getSavedSearches() {
  const s = loadSettings();
  if (!s || !Array.isArray(s.savedSearches)) return [];
  return s.savedSearches.map(function (item) {
    if (typeof item === 'string') return { query: item, filterFn: '' };
    return item;
  });
}

let _savedDropdownSelectedIdx = -1;

function _populateSavedSearchDropdown() {
  const trigger = document.getElementById('ai-saved-trigger');
  const dropdown = document.getElementById('ai-saved-dropdown');
  if (!trigger || !dropdown) return;
  const searches = getSavedSearches();
  _savedDropdownSelectedIdx = -1;
  trigger.textContent = '-- saved searches (' + searches.length + ') --';
  dropdown.innerHTML = '';
  if (searches.length === 0) {
    dropdown.innerHTML = '<div class="ai-saved-dropdown-empty">No saved searches yet</div>';
    return;
  }
  searches.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'ai-saved-dropdown-item';
    div.setAttribute('data-idx', String(i));
    div.textContent = item.query || '';
    div.addEventListener('click', () => {
      _savedDropdownSelectedIdx = i;
      trigger.textContent = item.query || '';
      document.getElementById('ai-search-input').value = item.query || '';
      dropdown.classList.remove('open');
      dropdown.querySelectorAll('.ai-saved-dropdown-item').forEach(el => el.classList.remove('selected'));
      div.classList.add('selected');
    });
    dropdown.appendChild(div);
  });
}

function _parseTimeMins(s) {
  if (!s || typeof s !== 'string') return null;
  s = s.trim().toLowerCase().replace(/\s+(cst|cdt|est|edt|pst|pdt|utc)$/i, '').trim();
  var hasP = /p|pm/.test(s);
  var hasA = /a|am/.test(s);
  var num = s.replace(/[^\d]/g, '');
  if (!num.length) return null;
  var h, m;
  if (num.length <= 2) { h = parseInt(num, 10); m = 0; }
  else { h = parseInt(num.slice(0, -2), 10); m = parseInt(num.slice(-2), 10); }
  if (h === 12 && hasA) h = 0;
  else if (h !== 12 && hasP) h += 12;
  return h * 60 + m;
}

function runSavedFilter(rows, filterFn) {
  try {
    var fn = new Function('rows', 'parseTime', filterFn);
    return fn(rows, _parseTimeMins);
  } catch (e) {
    console.warn('[AI Search] saved filter error:', e);
    return null;
  }
}

let _lastSuccessfulQuery = '';
let _lastFilterFn = '';
let _lastMatchIndices = [];
let _lastUsedCols = [];
let _lastDisplayFields = [];
let _lastGroupMode = 'single';

function _detectUsedColumns(filterFn, allKeys) {
  if (!filterFn) return [];
  var totalCols = (allKeys && allKeys.length) ? allKeys.length : 30;
  var KNOWN_POS = {
    date: 6, time: 7, client: 8, payor: 9, providers: 10,
    labels: 11, serviceAuth: 12, location: 13,
    hrs: 14, units: 15, billedRate: 16, agreedRate: 17
  };
  var KNOWN_FROM_END = {
    owed: 2, paid: 3, adj: 4, prAmt: 5, calcAdj: 6, agreedCharges: 7, billedCharges: 8
  };
  var used = {};
  for (var name in KNOWN_POS) {
    if (filterFn.indexOf(name) >= 0) {
      used[KNOWN_POS[name]] = true;
    }
  }
  for (var name in KNOWN_FROM_END) {
    if (filterFn.indexOf(name) >= 0) {
      var resolved = totalCols - KNOWN_FROM_END[name];
      if (resolved >= 0) used[resolved] = true;
    }
  }
  if (allKeys && allKeys.length) {
    for (var i = 0; i < allKeys.length; i++) {
      var k = allKeys[i];
      if (k && filterFn.indexOf(k) >= 0) used[i] = true;
    }
  }
  return Object.keys(used).map(Number);
}

async function highlightRowsOnPage(indices, columnIndices) {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return;
    await execScript({
      target: { tabId: tab.id },
      func: (matchIdxs, colIdxs) => {
        function findTable() {
          var tables = document.querySelectorAll('table');
          for (var i = 0; i < tables.length; i++) {
            var t = tables[i];
            var header = t.querySelector('thead th, tr th');
            if (header && (t.textContent || '').includes('Date') && (t.textContent || '').includes('Time')) {
              return t;
            }
          }
          return document.querySelector('table') || null;
        }
        var table = findTable();
        if (!table) return;

        if (colIdxs && colIdxs.length > 0) {
          var allTrs = table.querySelectorAll('tr');
          var headerRow = null;
          for (var r = 0; r < allTrs.length; r++) {
            if (allTrs[r].querySelectorAll('th').length > 5) { headerRow = allTrs[r]; break; }
          }
          if (headerRow) {
            var ths = headerRow.querySelectorAll('th');
            var colSet = new Set(colIdxs);
            for (var h = 0; h < ths.length; h++) {
              if (colSet.has(h)) {
                ths[h].style.setProperty('background-color', '#bfdbfe', 'important');
                ths[h].style.setProperty('border-bottom', '3px solid #3b82f6', 'important');
                ths[h].setAttribute('data-ai-highlight-col', '1');
              }
            }
          }
        }

        var tbody = table.querySelector('tbody');
        if (!tbody) return;
        var trs = Array.from(tbody.querySelectorAll('tr')).filter(function (tr) {
          return tr.querySelectorAll('td').length >= 6;
        });
        var set = new Set(matchIdxs);
        for (var i = 0; i < trs.length; i++) {
          if (set.has(i)) {
            trs[i].style.setProperty('background-color', '#fef08a', 'important');
            trs[i].setAttribute('data-ai-highlight', '1');
          }
        }
        if (matchIdxs.length > 0 && trs[matchIdxs[0]]) {
          trs[matchIdxs[0]].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      },
      args: [indices, columnIndices || []]
    });
    log('Highlighted ' + indices.length + ' rows' + (columnIndices && columnIndices.length ? ', ' + columnIndices.length + ' columns' : ''));
  } catch (e) {
    log('Highlight error: ' + e.message);
  }
}

async function clearHighlightsOnly() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return;
    await execScript({
      target: { tabId: tab.id },
      func: () => {
        document.querySelectorAll('tr[data-ai-highlight]').forEach(function (tr) {
          tr.style.removeProperty('background-color');
          tr.removeAttribute('data-ai-highlight');
        });
        document.querySelectorAll('[data-ai-highlight-col]').forEach(function (th) {
          th.style.removeProperty('background-color');
          th.style.removeProperty('border-bottom');
          th.removeAttribute('data-ai-highlight-col');
        });
      }
    });
    log('Cleared highlights');
  } catch (e) {
    log('Clear highlights error: ' + e.message);
  }
}

async function resetPageHighlightsAndFilter() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return;
    await execScript({
      target: { tabId: tab.id },
      func: () => {
        document.querySelectorAll('tr[data-ai-highlight]').forEach(function (tr) {
          tr.style.removeProperty('background-color');
          tr.removeAttribute('data-ai-highlight');
        });
        document.querySelectorAll('tr[data-ai-hidden]').forEach(function (tr) {
          tr.style.removeProperty('display');
          tr.removeAttribute('data-ai-hidden');
        });
        document.querySelectorAll('[data-ai-highlight-col]').forEach(function (th) {
          th.style.removeProperty('background-color');
          th.style.removeProperty('border-bottom');
          th.removeAttribute('data-ai-highlight-col');
        });
      }
    });
    log('Reset page');
  } catch (e) {
    log('Reset page error: ' + e.message);
  }
}

async function filterPageRows(indices) {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return;
    await execScript({
      target: { tabId: tab.id },
      func: (matchIdxs) => {
        function findTable() {
          var tables = document.querySelectorAll('table');
          for (var i = 0; i < tables.length; i++) {
            var t = tables[i];
            var header = t.querySelector('thead th, tr th');
            if (header && (t.textContent || '').includes('Date') && (t.textContent || '').includes('Time')) {
              var tbody = t.querySelector('tbody');
              if (tbody && tbody.querySelectorAll('tr').length > 0) return tbody;
            }
          }
          return document.querySelector('table tbody') || null;
        }
        var tbody = findTable();
        if (!tbody) return;
        var trs = Array.from(tbody.querySelectorAll('tr')).filter(function (tr) {
          return tr.querySelectorAll('td').length >= 6;
        });
        var set = new Set(matchIdxs);
        for (var i = 0; i < trs.length; i++) {
          if (!set.has(i)) {
            trs[i].style.setProperty('display', 'none', 'important');
            trs[i].setAttribute('data-ai-hidden', '1');
          }
        }
      },
      args: [indices]
    });
    log('Filtered page: showing ' + indices.length + ' rows');
  } catch (e) {
    log('Filter error: ' + e.message);
  }
}

document.getElementById('ai-filter-btn').addEventListener('click', async () => {
  if (_lastMatchIndices.length > 0) {
    await filterPageRows(_lastMatchIndices);
    document.getElementById('ai-reset-page-btn').style.display = '';
  }
});

document.getElementById('ai-reset-page-btn').addEventListener('click', async () => {
  await resetPageHighlightsAndFilter();
  document.getElementById('ai-reset-page-btn').style.display = 'none';
});

document.getElementById('ai-highlight-toggle').addEventListener('click', async (e) => {
  var btn = e.currentTarget;
  var isActive = btn.classList.toggle('active');
  if (isActive) {
    if (_lastMatchIndices.length > 0) {
      await highlightRowsOnPage(_lastMatchIndices, _lastUsedCols);
    }
  } else {
    await clearHighlightsOnly();
  }
});

document.getElementById('ai-search-btn').addEventListener('click', () => {
  runAISearch();
});

document.getElementById('ai-search-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    runAISearch();
  }
});

document.getElementById('ai-saved-trigger').addEventListener('click', () => {
  const dropdown = document.getElementById('ai-saved-dropdown');
  if (dropdown) dropdown.classList.toggle('open');
});

document.addEventListener('click', (e) => {
  const trigger = document.getElementById('ai-saved-trigger');
  const dropdown = document.getElementById('ai-saved-dropdown');
  if (!dropdown || !trigger) return;
  if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.remove('open');
  }
});

document.getElementById('ai-save-search-btn').addEventListener('click', () => {
  const query = _lastSuccessfulQuery.trim();
  if (!query) return;
  const searches = getSavedSearches();
  if (searches.some(s => s.query.toLowerCase() === query.toLowerCase())) return;
  searches.push({ query: query, filterFn: _lastFilterFn, displayFields: _lastDisplayFields, groupMode: _lastGroupMode });
  saveSettings({ savedSearches: searches });
  _populateSavedSearchDropdown();
  const btn = document.getElementById('ai-save-search-btn');
  if (btn) btn.style.display = 'none';
});

document.getElementById('ai-saved-delete').addEventListener('click', () => {
  const idx = _savedDropdownSelectedIdx;
  if (idx < 0) return;
  const searches = getSavedSearches();
  if (idx >= 0 && idx < searches.length) {
    searches.splice(idx, 1);
    saveSettings({ savedSearches: searches });
    _populateSavedSearchDropdown();
  }
});

_ensureSettingsLoaded().then(() => _populateSavedSearchDropdown());

/* ---------- BCBA Directory ---------- */
const BCBA_CONTACTS_LIST_HASH = '#contacts/?contactLabelIdIncluded=1015524';
/** Testing limit: only scrape this many BCBAs per Directory run. */
const BCBA_DIRECTORY_TEST_LIMIT = 3;
const BCBA_DIRECTORY_PAUSE_MS = 1500;
const BCBA_DIRECTORY_STORAGE_KEY = 'hidden_lights_bcba_directory';
/** In-panel cache so Upcoming works immediately after Directory (POEL sandbox storage is flaky). */
var _bcbaDirectoryMemory = null;

async function navigateHash(tabId, fullHash) {
  var h = fullHash.indexOf('#') === 0 ? fullHash : '#' + fullHash;
  await execScript({
    target: { tabId: tabId },
    world: 'MAIN',
    func: (hash) => {
      window.location.hash = hash;
    },
    args: [h]
  });
}

async function runNamedInjectAndPoll(tabId, scriptName, globalName, maxMs) {
  await execScript({
    target: { tabId: tabId },
    func: (name) => {
      window[name] = null;
    },
    args: [globalName]
  });
  if (typeof window.SHELL !== 'undefined' && window.SHELL.runScript) {
    try {
      await window.SHELL.runScript(scriptName);
    } catch (e) {
      /* fall through to files */
    }
  }
  try {
    await execScript({
      target: { tabId: tabId },
      files: [scriptName + '.js']
    });
  } catch (e2) {
    /* SHELL path may already have run it */
  }
  return pollForInjectResult(tabId, globalName, maxMs || 120000, 400);
}

function normalizeBcbaDirectoryPayload(payload) {
  if (!payload) return null;
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload);
    } catch (e) {
      return null;
    }
  }
  if (Array.isArray(payload)) {
    return { savedAt: null, bcbas: payload };
  }
  if (payload.bcbas && Array.isArray(payload.bcbas)) {
    return { savedAt: payload.savedAt || null, bcbas: payload.bcbas };
  }
  // Legacy / mistaken top-level clients list — wrap so load never looks empty incorrectly.
  if (payload.clients && Array.isArray(payload.clients)) {
    return {
      savedAt: payload.savedAt || null,
      bcbas: [{ id: '', name: '', clients: payload.clients }]
    };
  }
  return null;
}

function clientIdFromDirectoryRow(c) {
  if (!c || typeof c !== 'object') {
    if (c == null || c === '') return '';
    return String(c).trim();
  }
  var raw = c.id != null ? c.id : c.clientId != null ? c.clientId : '';
  return raw != null && raw !== '' ? String(raw).trim() : '';
}

function clientNameFromDirectoryRow(c) {
  if (!c || typeof c !== 'object') return '';
  return String(c.name || c.clientName || '').trim();
}

function collectBcbaClientIds(bcbas) {
  var ids = [];
  var seen = {};
  for (var i = 0; i < (bcbas || []).length; i++) {
    var clients = (bcbas[i] && bcbas[i].clients) || [];
    for (var j = 0; j < clients.length; j++) {
      var id = clientIdFromDirectoryRow(clients[j]);
      if (!id || seen[id]) continue;
      seen[id] = true;
      ids.push(id);
    }
  }
  return ids;
}

function readBcbaDirectoryFromPanelLocalStorage() {
  try {
    var raw = localStorage.getItem(BCBA_DIRECTORY_STORAGE_KEY);
    return normalizeBcbaDirectoryPayload(raw ? JSON.parse(raw) : null);
  } catch (e) {
    return null;
  }
}

function writeBcbaDirectoryToPanelLocalStorage(payload) {
  try {
    localStorage.setItem(BCBA_DIRECTORY_STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    /* POEL sandbox may throw — page mirror covers persistence */
  }
}

/** Mirror directory into CentralReach tab localStorage (same pattern as settings; works under POEL). */
async function writeBcbaDirectoryToPageStorage(payload) {
  try {
    var tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    var tab = tabs && tabs[0];
    if (!tab || !tab.id) return;
    await execScript({
      target: { tabId: tab.id },
      func: (key, val) => {
        try {
          localStorage.setItem(key, JSON.stringify(val));
        } catch (e) {
          /* ignore */
        }
      },
      args: [BCBA_DIRECTORY_STORAGE_KEY, payload]
    });
  } catch (e) {
    console.warn('[BCBA Directory] page write failed:', e);
  }
}

async function readBcbaDirectoryFromPageStorage() {
  try {
    var tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    var tab = tabs && tabs[0];
    if (!tab || !tab.id) return null;
    var results = await execScript({
      target: { tabId: tab.id },
      func: (key) => {
        try {
          var r = localStorage.getItem(key);
          return r ? JSON.parse(r) : null;
        } catch (e) {
          return null;
        }
      },
      args: [BCBA_DIRECTORY_STORAGE_KEY]
    });
    return normalizeBcbaDirectoryPayload(results && results[0] && results[0].result);
  } catch (e) {
    console.warn('[BCBA Directory] page read failed:', e);
    return null;
  }
}

function directoryPayloadHasBcbas(payload) {
  return !!(payload && payload.bcbas && payload.bcbas.length);
}

/**
 * Dual-write like RBT harden + settings page mirror:
 * memory → panel localStorage → chrome.storage (unpacked) → CR tab localStorage (POEL).
 */
function saveBcbaDirectoryToStorage(payload) {
  var normalized = normalizeBcbaDirectoryPayload(payload);
  if (!normalized) return;
  _bcbaDirectoryMemory = normalized;
  writeBcbaDirectoryToPanelLocalStorage(normalized);
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    try {
      var obj = {};
      obj[BCBA_DIRECTORY_STORAGE_KEY] = normalized;
      chrome.storage.local.set(obj);
    } catch (e) {
      /* ignore */
    }
  }
  writeBcbaDirectoryToPageStorage(normalized);
}

/**
 * Prefer memory (same session after Directory), then chrome.storage, panel localStorage,
 * then CentralReach page localStorage — same restore path Directory UI uses.
 */
function loadBcbaDirectoryFromStorage(done) {
  function finish(payload) {
    var n = normalizeBcbaDirectoryPayload(payload);
    if (directoryPayloadHasBcbas(n)) _bcbaDirectoryMemory = n;
    done(n);
  }

  function tryPanelThenPage() {
    var local = readBcbaDirectoryFromPanelLocalStorage();
    if (directoryPayloadHasBcbas(local)) {
      finish(local);
      return;
    }
    readBcbaDirectoryFromPageStorage().then(finish).catch(function () {
      finish(null);
    });
  }

  if (directoryPayloadHasBcbas(_bcbaDirectoryMemory)) {
    done(_bcbaDirectoryMemory);
    return;
  }

  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    try {
      chrome.storage.local.get(BCBA_DIRECTORY_STORAGE_KEY, function (o) {
        var payload = normalizeBcbaDirectoryPayload(o && o[BCBA_DIRECTORY_STORAGE_KEY]);
        if (directoryPayloadHasBcbas(payload)) {
          finish(payload);
          return;
        }
        tryPanelThenPage();
      });
      return;
    } catch (e) {
      /* fall through */
    }
  }
  tryPanelThenPage();
}

function renderBcbaDirectory(payload, statusEl, resultEl) {
  var normalized = normalizeBcbaDirectoryPayload(payload);
  var directory = normalized ? normalized.bcbas : [];
  if (!directory.length) {
    resultEl.innerHTML = '<p>No BCBAs found.</p>';
    return;
  }
  var allIds = collectBcbaClientIds(directory);
  var html = '';
  if (normalized.savedAt) {
    html +=
      '<p class="bcba-directory-saved">Saved ' +
      escapeHtml(String(normalized.savedAt)) +
      '</p>';
  }
  html +=
    '<p><strong>' +
    directory.length +
    '</strong> BCBA(s) · <strong>' +
    allIds.length +
    '</strong> unique client ID(s)</p>';
  if (allIds.length) {
    html +=
      '<div class="bcba-directory-ids">' +
      '<div class="bcba-directory-ids-title">Client IDs</div>' +
      '<p class="bcba-directory-ids-list">' +
      escapeHtml(allIds.join(', ')) +
      '</p></div>';
  }
  for (var i = 0; i < directory.length; i++) {
    var bcba = directory[i];
    var clients = bcba.clients || [];
    html +=
      '<details open>' +
      '<summary>' +
      escapeHtml(bcba.name || 'BCBA') +
      ' <span style="font-weight:500;color:#64748b">(' +
      escapeHtml(String(bcba.id || '')) +
      ') — ' +
      clients.length +
      ' client(s)</span></summary>';
    if (bcba.error) {
      html += '<p style="color:#b91c1c">' + escapeHtml(bcba.error) + '</p>';
    } else if (!clients.length) {
      html += '<p style="color:#64748b">No connected clients.</p>';
    } else {
      html += '<ul>';
      for (var j = 0; j < clients.length; j++) {
        var c = clients[j];
        html +=
          '<li>' +
          escapeHtml(c.name || '') +
          ' <span class="bcba-client-id">ID: ' +
          escapeHtml(String(c.id || '')) +
          '</span>' +
          (c.type || c.status
            ? ' <span style="color:#64748b">(' +
              escapeHtml([c.type, c.status].filter(Boolean).join(' · ')) +
              ')</span>'
            : '') +
          '</li>';
      }
      html += '</ul>';
    }
    html += '</details>';
  }
  resultEl.innerHTML = html;
}

async function runBcbaDirectory() {
  var statusEl = document.getElementById('bcba-directory-status');
  var resultEl = document.getElementById('bcba-directory-result');
  var btn = document.getElementById('bcba-directory-btn');
  var upcomingBtn = document.getElementById('bcba-upcoming-appointments-btn');
  if (!statusEl || !resultEl) return;
  if (btn) btn.disabled = true;
  if (upcomingBtn) upcomingBtn.disabled = true;
  resultEl.innerHTML = '';
  try {
    var tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    var tab = tabs && tabs[0];
    if (!tab || !tab.id) throw new Error('No active tab.');
    if (!(tab.url || '').startsWith('https://members.centralreach.com')) {
      throw new Error('Open CentralReach (members.centralreach.com) first.');
    }

    statusEl.textContent = 'Opening BCBA contacts list…';
    await navigateHash(tab.id, BCBA_CONTACTS_LIST_HASH);
    await new Promise(function (r) {
      setTimeout(r, 2000);
    });

    statusEl.textContent = 'Scraping BCBA list…';
    var listRes = await runNamedInjectAndPoll(
      tab.id,
      'inject-read-contacts-list',
      '__contactsListResult',
      90000
    );
    if (!listRes || !listRes.success) {
      throw new Error((listRes && listRes.error) || 'Could not read BCBA contacts list.');
    }
    var contacts = listRes.contacts || [];
    if (!contacts.length) throw new Error('No BCBAs found on the contacts list.');
    var totalFound = contacts.length;
    contacts = contacts.slice(0, BCBA_DIRECTORY_TEST_LIMIT);

    var directory = [];
    for (var i = 0; i < contacts.length; i++) {
      var bcba = contacts[i];
      statusEl.textContent =
        'Connected clients ' +
        (i + 1) +
        '/' +
        contacts.length +
        ' (of ' +
        totalFound +
        ' BCBAs; testing limit ' +
        BCBA_DIRECTORY_TEST_LIMIT +
        '): ' +
        (bcba.name || bcba.id) +
        '…';
      var detailHash =
        '#contacts/details/?id=' + encodeURIComponent(bcba.id) + '&mode=profile&edit=connected-clients';
      await navigateHash(tab.id, detailHash);
      await new Promise(function (r) {
        setTimeout(r, BCBA_DIRECTORY_PAUSE_MS);
      });
      var clientsRes = await runNamedInjectAndPoll(
        tab.id,
        'inject-read-connected-clients',
        '__connectedClientsResult',
        180000
      );
      if (!clientsRes || !clientsRes.success) {
        directory.push({
          id: bcba.id,
          name: bcba.name,
          clients: [],
          error: (clientsRes && clientsRes.error) || 'Failed to read connected clients'
        });
      } else {
        directory.push({
          id: bcba.id,
          name: bcba.name,
          clients: clientsRes.clients || []
        });
      }
    }

    var payload = {
      savedAt: new Date().toISOString(),
      bcbas: directory
    };
    saveBcbaDirectoryToStorage(payload);
    await writeBcbaDirectoryToPageStorage(payload);
    var allIds = collectBcbaClientIds(directory);
    statusEl.textContent =
      'Done — ' +
      directory.length +
      ' BCBA(s) of ' +
      totalFound +
      ' (testing limit). ' +
      allIds.length +
      ' unique client ID(s) saved.';
    renderBcbaDirectory(payload, statusEl, resultEl);
    log(
      'BCBA Directory: ' +
        directory.length +
        ' BCBAs scraped (limit ' +
        BCBA_DIRECTORY_TEST_LIMIT +
        '); ' +
        allIds.length +
        ' client IDs.'
    );
  } catch (e) {
    var msg = (e && e.message) || String(e);
    statusEl.textContent = 'Error: ' + msg;
    resultEl.innerHTML = '<p style="color:#b91c1c">' + escapeHtml(msg) + '</p>';
    log('BCBA Directory error: ' + msg);
  } finally {
    if (btn) btn.disabled = false;
    if (upcomingBtn) upcomingBtn.disabled = false;
  }
}

(function initBcbaDirectory() {
  var btn = document.getElementById('bcba-directory-btn');
  var statusEl = document.getElementById('bcba-directory-status');
  var resultEl = document.getElementById('bcba-directory-result');
  if (!btn || !resultEl) return;
  btn.addEventListener('click', function () {
    runBcbaDirectory();
  });
  loadBcbaDirectoryFromStorage(function (payload) {
    if (!payload || !payload.bcbas || !payload.bcbas.length) return;
    if (statusEl) {
      statusEl.textContent =
        'Restored saved directory' +
        (payload.savedAt ? ' (' + payload.savedAt + ')' : '') +
        '.';
    }
    renderBcbaDirectory(payload, statusEl, resultEl);
  });
})();

/* ---------- BCBA Upcoming appointments ---------- */
const BCBA_UPCOMING_APPTS_TEST_LIMIT = 3;
const BCBA_UPCOMING_APPTS_PAUSE_MS = BCBA_DIRECTORY_PAUSE_MS;
const BCBA_UPCOMING_APPTS_STORAGE_KEY = 'hidden_lights_client_appointments';

function flattenDirectoryClients(bcbas) {
  var byId = {};
  var order = [];
  for (var i = 0; i < (bcbas || []).length; i++) {
    var bcba = bcbas[i] || {};
    var bcbaId = bcba.id != null ? String(bcba.id).trim() : '';
    var bcbaName = String(bcba.name || '').trim();
    var clients = bcba.clients || [];
    for (var j = 0; j < clients.length; j++) {
      var c = clients[j];
      var id = clientIdFromDirectoryRow(c);
      if (!id) continue;
      var name = clientNameFromDirectoryRow(c) || 'Client ' + id;
      if (!byId[id]) {
        byId[id] = {
          clientId: id,
          clientName: name,
          id: id,
          name: name,
          bcbaId: bcbaId,
          bcbaName: bcbaName,
          bcbas: []
        };
        order.push(id);
      } else if (!byId[id].clientName || byId[id].clientName === 'Client ' + id) {
        byId[id].clientName = name;
        byId[id].name = name;
      }
      var list = byId[id].bcbas;
      var already = false;
      for (var k = 0; k < list.length; k++) {
        if (list[k].id === bcbaId && list[k].name === bcbaName) {
          already = true;
          break;
        }
      }
      if (!already) {
        list.push({ id: bcbaId, name: bcbaName });
      }
      // Prefer first BCBA link as primary; never drop later links from bcbas[].
      if (!byId[id].bcbaId && bcbaId) {
        byId[id].bcbaId = bcbaId;
        byId[id].bcbaName = bcbaName;
      }
    }
  }
  var out = [];
  for (var n = 0; n < order.length; n++) {
    out.push(byId[order[n]]);
  }
  return out;
}

function saveClientAppointmentsToStorage(payload) {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    var obj = {};
    obj[BCBA_UPCOMING_APPTS_STORAGE_KEY] = payload;
    chrome.storage.local.set(obj);
  } else {
    try {
      localStorage.setItem(BCBA_UPCOMING_APPTS_STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      /* ignore */
    }
  }
}

function renderUpcomingAppointmentsResult(payload, resultEl) {
  if (!resultEl) return;
  var clients = (payload && payload.clients) || [];
  if (!clients.length) {
    resultEl.innerHTML = '<p>No clients scanned.</p>';
    return;
  }
  var html =
    '<p><strong>' +
    clients.length +
    '</strong> client(s) scanned' +
    (payload && payload.savedAt ? ' · ' + escapeHtml(String(payload.savedAt)) : '') +
    (payload && payload.pdfFileName ? ' · PDF: ' + escapeHtml(payload.pdfFileName) : '') +
    '</p>';
  for (var i = 0; i < clients.length; i++) {
    var row = clients[i];
    var appts = row.appointments || [];
    html +=
      '<details open>' +
      '<summary>' +
      escapeHtml(row.clientName || row.name || 'Client') +
      ' <span style="font-weight:500;color:#64748b">(ID: ' +
      escapeHtml(String(row.clientId || row.id || '')) +
      ') — BCBA: ' +
      escapeHtml(row.bcbaName || row.bcbaId || '—') +
      (row.bcbaId ? ' (ID: ' + escapeHtml(String(row.bcbaId)) + ')' : '') +
      ' — ' +
      appts.length +
      ' appt(s)</span></summary>';
    if (row.error) {
      html += '<p style="color:#b91c1c">' + escapeHtml(row.error) + '</p>';
    } else if (!appts.length) {
      html += '<p style="color:#64748b">No upcoming appointments.</p>';
    } else {
      html += '<ul>';
      for (var j = 0; j < appts.length; j++) {
        var a = appts[j];
        html +=
          '<li>' +
          escapeHtml(a.time || '') +
          (a.provider ? ' — ' + escapeHtml(a.provider) : '') +
          (a.serviceType ? ' <span style="color:#64748b">(' + escapeHtml(a.serviceType) + ')</span>' : '') +
          (a.address ? ' · ' + escapeHtml(a.address) : '') +
          (a.hidden ? ' <span style="color:#94a3b8">[hidden]</span>' : '') +
          '</li>';
      }
      html += '</ul>';
    }
    html += '</details>';
  }
  resultEl.innerHTML = html;
}

function downloadUpcomingAppointmentsPdf(payload) {
  var jspdfNs = window.jspdf;
  var jsPDF = jspdfNs && jspdfNs.jsPDF;
  if (!jsPDF) {
    throw new Error('PDF library (jsPDF) not loaded.');
  }
  var doc = new jsPDF({ orientation: 'portrait', unit: 'mm', compress: true });
  var clients = (payload && payload.clients) || [];
  var y = 14;
  var lineH = 5;
  var maxY = 280;
  var margin = 12;
  var pageW = 210;
  var maxWidth = pageW - margin * 2;

  function addLine(text, opts) {
    opts = opts || {};
    var fontSize = opts.fontSize || 10;
    var fontStyle = opts.bold ? 'bold' : 'normal';
    doc.setFontSize(fontSize);
    doc.setFont(undefined, fontStyle);
    var lines = doc.splitTextToSize(String(text || ''), maxWidth);
    for (var i = 0; i < lines.length; i++) {
      if (y > maxY) {
        doc.addPage();
        y = 14;
      }
      doc.text(lines[i], margin, y);
      y += lineH;
    }
    if (opts.gap) y += opts.gap;
  }

  addLine('Upcoming appointments dump', { fontSize: 14, bold: true, gap: 2 });
  addLine('Generated: ' + (payload.savedAt || new Date().toISOString()), { fontSize: 9, gap: 2 });
  addLine(
    'Clients scanned: ' +
      clients.length +
      ' (testing limit ' +
      BCBA_UPCOMING_APPTS_TEST_LIMIT +
      ')',
    { fontSize: 9, gap: 4 }
  );

  for (var i = 0; i < clients.length; i++) {
    var row = clients[i];
    addLine(
      (i + 1) +
        '. ' +
        (row.clientName || row.name || 'Client') +
        ' (ID: ' +
        (row.clientId || row.id || '') +
        ')',
      { bold: true, fontSize: 11, gap: 1 }
    );
    addLine('BCBA: ' + (row.bcbaName || '—') + (row.bcbaId ? ' (ID: ' + row.bcbaId + ')' : ''), {
      fontSize: 9,
      gap: 1
    });
    if (row.bcbas && row.bcbas.length > 1) {
      var extra = [];
      for (var bi = 0; bi < row.bcbas.length; bi++) {
        var b = row.bcbas[bi];
        extra.push((b.name || '—') + (b.id ? ' (ID: ' + b.id + ')' : ''));
      }
      addLine('All BCBA links: ' + extra.join('; '), { fontSize: 8, gap: 1 });
    }
    if (row.error) {
      addLine('Error: ' + row.error, { fontSize: 9, gap: 3 });
      continue;
    }
    var appts = row.appointments || [];
    if (!appts.length) {
      addLine('No upcoming appointments.', { fontSize: 9, gap: 3 });
      continue;
    }
    for (var j = 0; j < appts.length; j++) {
      var a = appts[j];
      var bits = [
        a.time || '',
        a.provider || '',
        a.serviceType || '',
        a.address || '',
        a.eventId ? 'eventId=' + a.eventId : '',
        a.providerId ? 'providerId=' + a.providerId : '',
        a.hidden ? '[hidden]' : ''
      ].filter(Boolean);
      addLine('  - ' + bits.join(' | '), { fontSize: 9 });
    }
    y += 3;
  }

  var blob = doc.output('blob');
  var stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  var fileName = 'upcoming-appointments-' + stamp + '.pdf';
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  setTimeout(function () {
    try {
      URL.revokeObjectURL(url);
    } catch (e) {
      /* ignore */
    }
    if (a.parentNode) a.parentNode.removeChild(a);
  }, 2000);
  return fileName;
}

async function runBcbaUpcomingAppointments() {
  var statusEl = document.getElementById('bcba-upcoming-appointments-status');
  var resultEl = document.getElementById('bcba-upcoming-appointments-result');
  var btn = document.getElementById('bcba-upcoming-appointments-btn');
  var dirBtn = document.getElementById('bcba-directory-btn');
  if (!statusEl || !resultEl) return;
  if (btn) btn.disabled = true;
  if (dirBtn) dirBtn.disabled = true;
  resultEl.innerHTML = '';
  try {
    var tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    var tab = tabs && tabs[0];
    if (!tab || !tab.id) throw new Error('No active tab.');
    if (!(tab.url || '').startsWith('https://members.centralreach.com')) {
      throw new Error('Open CentralReach (members.centralreach.com) first.');
    }

    statusEl.textContent = 'Loading saved directory…';
    var directoryPayload = await new Promise(function (resolve) {
      loadBcbaDirectoryFromStorage(resolve);
    });
    var allClients = flattenDirectoryClients(directoryPayload && directoryPayload.bcbas);
    if (!allClients.length) {
      if (directoryPayloadHasBcbas(directoryPayload)) {
        throw new Error(
          'Saved directory has BCBAs but no client IDs. Re-run Directory.'
        );
      }
      throw new Error('No saved directory clients. Run Directory first.');
    }
    var totalFound = allClients.length;
    var clients = allClients.slice(0, BCBA_UPCOMING_APPTS_TEST_LIMIT);
    var scanned = [];

    for (var i = 0; i < clients.length; i++) {
      var client = clients[i];
      var clientId = client.clientId || client.id;
      var clientName = client.clientName || client.name;
      statusEl.textContent =
        'Appointments ' +
        (i + 1) +
        '/' +
        clients.length +
        ' (of ' +
        totalFound +
        ' clients; testing limit ' +
        BCBA_UPCOMING_APPTS_TEST_LIMIT +
        '): ' +
        (clientName || clientId) +
        '…';
      var detailHash = '#contacts/details/?id=' + encodeURIComponent(clientId);
      await navigateHash(tab.id, detailHash);
      await new Promise(function (r) {
        setTimeout(r, BCBA_UPCOMING_APPTS_PAUSE_MS);
      });
      var apptRes = await runNamedInjectAndPoll(
        tab.id,
        'inject-read-upcoming-appointments',
        '__upcomingAppointmentsResult',
        60000
      );
      if (!apptRes || !apptRes.success) {
        scanned.push({
          clientId: clientId,
          clientName: clientName,
          id: clientId,
          name: clientName,
          bcbaId: client.bcbaId,
          bcbaName: client.bcbaName,
          bcbas: client.bcbas || [],
          appointments: [],
          error: (apptRes && apptRes.error) || 'Failed to read upcoming appointments'
        });
      } else {
        scanned.push({
          clientId: clientId,
          clientName: clientName,
          id: clientId,
          name: clientName,
          bcbaId: client.bcbaId,
          bcbaName: client.bcbaName,
          bcbas: client.bcbas || [],
          appointments: apptRes.appointments || []
        });
      }
    }

    var payload = {
      savedAt: new Date().toISOString(),
      clients: scanned,
      testLimit: BCBA_UPCOMING_APPTS_TEST_LIMIT,
      totalDirectoryClients: totalFound
    };
    saveClientAppointmentsToStorage(payload);

    statusEl.textContent = 'Building PDF…';
    var pdfFileName = downloadUpcomingAppointmentsPdf(payload);
    payload.pdfFileName = pdfFileName;
    saveClientAppointmentsToStorage(payload);

    var apptCount = 0;
    for (var k = 0; k < scanned.length; k++) {
      apptCount += ((scanned[k].appointments || []).length);
    }
    statusEl.textContent =
      'Done — ' +
      scanned.length +
      ' client(s) of ' +
      totalFound +
      ' (testing limit). ' +
      apptCount +
      ' appointment(s). PDF downloaded: ' +
      pdfFileName;
    renderUpcomingAppointmentsResult(payload, resultEl);
    log(
      'Upcoming appointments: ' +
        scanned.length +
        ' clients (limit ' +
        BCBA_UPCOMING_APPTS_TEST_LIMIT +
        '); ' +
        apptCount +
        ' appts; PDF ' +
        pdfFileName
    );
  } catch (e) {
    var msg = (e && e.message) || String(e);
    statusEl.textContent = 'Error: ' + msg;
    resultEl.innerHTML = '<p style="color:#b91c1c">' + escapeHtml(msg) + '</p>';
    log('Upcoming appointments error: ' + msg);
  } finally {
    if (btn) btn.disabled = false;
    if (dirBtn) dirBtn.disabled = false;
  }
}

(function initBcbaUpcomingAppointments() {
  var btn = document.getElementById('bcba-upcoming-appointments-btn');
  if (!btn) return;
  btn.addEventListener('click', function () {
    runBcbaUpcomingAppointments();
  });
})();

// Tab bar: Concurrences / BCBA reports / RBT reports (CSP-safe, no inline script)
(function initTabs() {
  const tabBar = document.querySelector('.tab-bar');
  const panels = {
    'bcba-reports': document.getElementById('panel-bcba-reports'),
    'rbt-reports': document.getElementById('panel-rbt-reports'),
    auto: document.getElementById('panel-auto'),
    manual: document.getElementById('panel-manual'),
    'ai-search': document.getElementById('panel-ai-search')
  };
  if (!tabBar) return;

  const disabledPanels = {};
  if (!ENABLE_MANUAL_MODE) disabledPanels['manual'] = true;
  if (!ENABLE_AI_SEARCH_MODE) disabledPanels['ai-search'] = true;

  tabBar.querySelectorAll('.tab').forEach((t) => {
    const id = t.getAttribute('data-panel');
    if (disabledPanels[id] || t.hasAttribute('hidden')) {
      t.style.display = 'none';
      if (panels[id]) panels[id].style.display = 'none';
    }
  });
  // AI Search is not offered in Hidden Lights — keep DOM for shared code, hide panel.
  if (panels['ai-search']) panels['ai-search'].style.display = 'none';

  const visibleTabs = Array.from(tabBar.querySelectorAll('.tab')).filter(t => t.style.display !== 'none');
  if (visibleTabs.length <= 1) {
    tabBar.style.display = 'none';
  }

  const tabs = tabBar.querySelectorAll('.tab');

  function showPanel(panelId) {
    tabs.forEach((t) => {
      const isActive = t.getAttribute('data-panel') === panelId;
      t.classList.toggle('active', isActive);
      t.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
    Object.keys(panels).forEach((key) => {
      if (panels[key]) panels[key].classList.toggle('active', key === panelId);
    });
  }

  tabBar.addEventListener('click', (e) => {
    const tab = e.target.closest('.tab');
    if (!tab || tab.style.display === 'none' || tab.hasAttribute('hidden')) return;
    e.preventDefault();
    e.stopPropagation();
    const panelId = tab.getAttribute('data-panel');
    if (panelId) showPanel(panelId);
    return false;
  }, true);
})();

(function initPanelDiagnostics() {
  if (typeof window.SHELL === 'undefined' || !window.SHELL.runScript || window.SHELL.__cfRunScriptHooked) return;
  window.SHELL.__cfRunScriptHooked = true;
  var orig = window.SHELL.runScript.bind(window.SHELL);
  window.SHELL.runScript = function (name, returnGlobal) {
    return orig(name, returnGlobal).then(function (res) {
      var hasDebug = res && typeof res === 'object' && res.debug != null;
      var line =
        '[POEL runScript] ' +
        name +
        ' success=' +
        (res && res.success) +
        ' skipped=' +
        (res && res.skipped) +
        ' clicked=' +
        (res && res.clicked) +
        ' hasDebug=' +
        hasDebug +
        (res && res.error ? ' hasError=1' : '');
      try {
        log(line);
      } catch (e) {
        console.log('[Hidden Lights]', line);
      }
      return res;
    });
  };
})();
