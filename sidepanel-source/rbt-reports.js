/**
 * RBT reports (ported from Hidden Light standalone extension).
 * IDs are prefixed with rbt- to avoid collisions with Concurrences UI.
 */
(function initHiddenLightsRbtReports() {
  if (!document.getElementById('rbt-btn-run-main')) return;

  function rbtWaitTabComplete(tabId, timeoutMs) {
    var ms = timeoutMs != null ? timeoutMs : 10000;
    if (typeof window.SHELL !== 'undefined' && window.SHELL.waitTabComplete) {
      return window.SHELL.waitTabComplete(tabId, ms);
    }
    var deadline = Date.now() + ms;
    return (async function () {
      while (Date.now() < deadline) {
        try {
          var t = await chrome.tabs.get(tabId);
          if (t && t.status === 'complete') return;
        } catch (e) {}
        await new Promise(function (r) { setTimeout(r, 250); });
      }
    })();
  }

  function rbtDownloadBlob(blob, baseFilename, rowCount) {
    try {
      if (chrome.downloads && typeof chrome.downloads.download === 'function') {
        var reader = new FileReader();
        reader.onload = function () {
          var b64 = reader.result.split(',')[1];
          chrome.downloads.download({
            url: 'data:application/pdf;base64,' + b64,
            filename: baseFilename,
            saveAs: false
          }, function () {
            if (chrome.runtime.lastError) {
              setStatus('Download failed: ' + chrome.runtime.lastError.message, true);
            } else {
              setStatus('Exported ' + rowCount + ' rows to Downloads/' + baseFilename);
            }
          });
        };
        reader.readAsDataURL(blob);
        return;
      }
    } catch (e) {}
    try {
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = baseFilename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
      setStatus('Exported ' + rowCount + ' rows as ' + baseFilename);
    } catch (e2) {
      setStatus('Download failed: ' + (e2 && e2.message ? e2.message : e2), true);
    }
  }

/**
 * Sidepanel UI: sends messages to the active tab's content script.
 */
const statusEl = document.getElementById('rbt-status');
const PDF_FORM_KEYS = ['rbt-pdf-client-name', 'rbt-pdf-dob', 'rbt-pdf-authorized-hours'];
const SETTINGS_KEYS = ['rbt-settings-low-util-threshold', 'rbt-settings-unfound-folder', 'rbt-settings-auth-selection'];
const RUN_FULL_KEYS = ['rbt-run-start-date', 'rbt-run-stop-date', 'rbt-run-contact-id', 'rbt-run-service-code'];

const RUN_FULL_DEFAULTS = {
  'rbt-run-start-date': '08/04/2025',
  'rbt-run-stop-date': '02/04/26',
  'rbt-run-contact-id': '3792429',
  'rbt-run-service-code': 'all'
};

/** Service codes for dropdown; when "All" is selected, report runs for each of these. */
const SERVICE_CODES = ['97153 tx', '97155 tx t', '97156 tx t'];

/** Set by Load Contact Info: hours per service code from auth breakdown. Used by Run Full Report when service is "all". */
let loadedHoursByCode = {};

/** Queue: array of { name, url }. Persisted to storage. */
const QUEUE_STORAGE_KEY = 'hidden_lights_rbt_report_queue';
let reportQueue = [];

/**
 * Clients base folder:
 * - Native: real FileSystemDirectoryHandle (unpacked / non-sandbox sidepanel).
 * - POEL shell: { __shellFs: true, name } — handle lives in unsandboxed parent.
 */
let customSaveDirHandle = null;

const IDB_NAME = 'HiddenLightsRbtReports';
const IDB_STORE = 'storage';
const DIR_HANDLE_KEY = 'clientsFolder';

function hasShellFs() {
  return typeof window.SHELL !== 'undefined' && typeof window.SHELL.fsChooseDirectory === 'function';
}

function isShellFsHandle(h) {
  return !!(h && h.__shellFs);
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function openIDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = (e) => {
      if (!e.target.result.objectStoreNames.contains(IDB_STORE)) {
        e.target.result.createObjectStore(IDB_STORE);
      }
    };
  });
}

async function saveDirHandleToStorage(handle) {
  try {
    const db = await openIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      const req = store.put(handle, DIR_HANDLE_KEY);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve();
    });
  } catch (e) {
    console.warn('[CentralReach Helper] Could not save folder to storage:', e);
  }
}

async function loadDirHandleFromStorage() {
  try {
    const db = await openIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get(DIR_HANDLE_KEY);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve(req.result || null);
    });
  } catch (e) {
    return null;
  }
}

async function clearDirHandleFromStorage() {
  try {
    const db = await openIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const req = tx.objectStore(IDB_STORE).delete(DIR_HANDLE_KEY);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve();
    });
  } catch (e) {
    console.warn('[CentralReach Helper] Could not clear folder from storage:', e);
  }
}
let queueLoadInProgress = true;

const AUTH_UTIL_FOLDER = 'Auth Utilization';

/** Cache so multiple PDFs for same client in one run share the same DS folder. */
let cachedSaveDir = null;
let cachedSaveDirClient = null;

/** True if any PDF in the current run used Unfound Clients folder. */
let queueRunUsedUnfound = false;

/** True if any PDF fell back to Downloads (File System API failed). */
let queueRunUsedFallback = false;

function clearSaveDirCache() {
  cachedSaveDir = null;
  cachedSaveDirClient = null;
}

function requireFolderChosen() {
  if (!customSaveDirHandle) {
    setStatus('Choose the Clients folder above first.', true);
    return false;
  }
  return true;
}

function clearSaveLog() {
  const el = document.getElementById('rbt-save-log');
  if (el) el.textContent = '';
}

function loadQueue() {
  queueLoadInProgress = true;
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    chrome.storage.local.get(QUEUE_STORAGE_KEY, (o) => {
      if (queueLoadInProgress) {
        reportQueue = Array.isArray(o[QUEUE_STORAGE_KEY]) ? o[QUEUE_STORAGE_KEY] : [];
      }
      queueLoadInProgress = false;
      renderQueue();
      updateMainButton();
    });
    return;
  }
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    reportQueue = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(reportQueue)) reportQueue = [];
  } catch (e) {
    reportQueue = [];
  }
  queueLoadInProgress = false;
  renderQueue();
  updateMainButton();
}

function saveQueue() {
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    chrome.storage.local.set({ [QUEUE_STORAGE_KEY]: reportQueue });
  } else {
    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(reportQueue));
    } catch (e) { /* ignore */ }
  }
  queueLoadInProgress = false;
  renderQueue();
  updateMainButton();
}

function renderQueue() {
  const el = document.getElementById('rbt-queue-list');
  if (!el) return;
  if (reportQueue.length === 0) {
    el.innerHTML = '<div class="queue-empty-msg">No contacts in queue</div>';
    return;
  }
  el.innerHTML = reportQueue.map((item, i) => {
    const name = String(item.name || 'Unknown').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    return '<div class="queue-item" data-index="' + i + '">' +
      '<span>' + name + '</span>' +
      '<span class="queue-remove" data-index="' + i + '" title="Remove">×</span>' +
    '</div>';
  }).join('');
  el.querySelectorAll('.queue-remove').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      reportQueue.splice(idx, 1);
      saveQueue();
    });
  });
}

function updateMainButton() {
  const btn = document.getElementById('rbt-btn-run-main');
  if (!btn) return;
  btn.textContent = reportQueue.length > 0 ? 'Run the queue' : 'Generate report for only the Current Contact';
}

function loadFormValues() {
  const cfg = typeof CENTRALREACH_SELECTORS !== 'undefined' ? CENTRALREACH_SELECTORS : {};
  const runDefaults = {
    'rbt-run-start-date': (cfg.runAll && cfg.runAll.dateFrom) || RUN_FULL_DEFAULTS['rbt-run-start-date'],
    'rbt-run-stop-date': (cfg.runAll && cfg.runAll.dateTo) || RUN_FULL_DEFAULTS['rbt-run-stop-date'],
    'rbt-run-contact-id': cfg.defaultContactId || RUN_FULL_DEFAULTS['rbt-run-contact-id'],
    'rbt-run-service-code': cfg.defaultServiceCode || RUN_FULL_DEFAULTS['rbt-run-service-code']
  };
  RUN_FULL_KEYS.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = runDefaults[id] || '';
  });
  function applyStored(stored) {
    PDF_FORM_KEYS.forEach((id) => {
      const el = document.getElementById(id);
      if (el && stored[id] != null && String(stored[id]).trim() !== '') el.value = stored[id];
    });
    SETTINGS_KEYS.forEach((id) => {
      const el = document.getElementById(id);
      if (el && stored[id] != null) el.value = stored[id];
    });
  }
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    chrome.storage.local.get([...PDF_FORM_KEYS, ...SETTINGS_KEYS], (stored) => {
      applyStored(stored || {});
    });
  } else {
    try {
      const raw = localStorage.getItem('hidden_lights_rbt_form');
      if (raw) applyStored(JSON.parse(raw) || {});
    } catch (e) { /* ignore */ }
  }
}

function savePdfFormToStorage() {
  const obj = {};
  PDF_FORM_KEYS.forEach((id) => {
    const el = document.getElementById(id);
    if (el) obj[id] = el.value || '';
  });
  RUN_FULL_KEYS.forEach((id) => {
    const el = document.getElementById(id);
    if (el) obj[id] = el.value || '';
  });
  SETTINGS_KEYS.forEach((id) => {
    const el = document.getElementById(id);
    if (el) obj[id] = el.value || '';
  });
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    chrome.storage.local.set(obj);
  } else {
    try {
      localStorage.setItem('hidden_lights_rbt_form', JSON.stringify(obj));
    } catch (e) { /* ignore */ }
  }
}
const REPORTING_URL = 'https://members.centralreach.com/#reporting/104';

function setStatus(text, isError = false) {
  if (statusEl) {
    statusEl.textContent = text;
    statusEl.style.color = isError ? '#e08080' : '#888';
  }
  // rbt-status sits inside #rbt-main-content (hidden until a folder is chosen).
  const main = document.getElementById('rbt-main-content');
  const mainHidden = !main || main.style.display === 'none';
  if (mainHidden) setFolderStatus(text, isError);
}

function setFolderStatus(text, isError = false) {
  const el = document.getElementById('rbt-folder-status');
  if (!el) return;
  el.textContent = text || '';
  if (isError) el.classList.add('is-error');
  else el.classList.remove('is-error');
}

function appendLog(text) {
  const el = document.getElementById('rbt-save-log');
  if (!el) return;
  const line = '[' + new Date().toLocaleTimeString() + '] ' + text;
  el.textContent = (el.textContent ? el.textContent + '\n' : '') + line;
  el.scrollTop = el.scrollHeight;
}

function showQueueSummary(results) {
  if (!results || results.length === 0) return;
  appendLog('');
  appendLog('——— Queue complete ———');
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    const name = (r.clientName || 'Unknown').trim() || 'Unknown';
    const reports = r.reports || [];
    const list = reports.length > 0 ? reports.join(', ') : '(none)';
    appendLog(name + ': ' + list);
  }
  if (queueRunUsedFallback) {
    appendLogRed('Some PDFs saved to Downloads folder (folder access had expired).');
  }
  if (queueRunUsedUnfound) {
    appendLogRed('Some clients were saved to the Unfound Clients folder (no matching client folder).');
  }
  appendLog('——— End summary ———');
}

function appendLogRed(text) {
  const el = document.getElementById('rbt-save-log');
  if (!el) return;
  const line = '[' + new Date().toLocaleTimeString() + '] ';
  const span = document.createElement('span');
  span.style.color = '#c93434';
  span.textContent = text;
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(line));
  div.appendChild(span);
  el.appendChild(div);
  el.scrollTop = el.scrollHeight;
}

function normalizeForMatch(s) {
  return (s || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

/** Resolves Clients base -> client folder -> Auth Utilization -> next DS folder. Returns { dirHandle|shellPath, logPath }. Caches per client so multiple PDFs in one run share the same DS folder. */
async function getSaveDirectoryForClient(clientName) {
  if (!customSaveDirHandle) return null;
  const name = (clientName || '').trim() || 'Pt';
  if (cachedSaveDirClient === name && cachedSaveDir) {
    return cachedSaveDir;
  }
  const unfoundName = (document.getElementById('rbt-settings-unfound-folder')?.value || 'Unfound Clients').trim() || 'Unfound Clients';
  const clientNorm = normalizeForMatch(name);

  if (isShellFsHandle(customSaveDirHandle) && hasShellFs()) {
    try {
      const entryNames = await window.SHELL.fsListDirectories([]);
      let usedFolderName = '';
      let clientPath = null;

      const exact = entryNames.find((n) => normalizeForMatch(n) === clientNorm);
      if (exact) {
        usedFolderName = exact;
        clientPath = [exact];
        appendLog('Found client folder: "' + usedFolderName + '"');
      } else {
        const partial = entryNames.find((n) => {
          const fn = normalizeForMatch(n);
          return fn && clientNorm && (fn.includes(clientNorm) || clientNorm.includes(fn));
        });
        if (partial) {
          usedFolderName = partial;
          clientPath = [partial];
          appendLog('Matched client folder: "' + usedFolderName + '"');
        }
      }

      if (!clientPath) {
        const safeName = (name || 'Pt').replace(/[/\\:*?"<>|]/g, '').trim().replace(/\s+/g, ' ') || 'Pt';
        clientPath = [unfoundName, safeName];
        await window.SHELL.fsEnsureDirectory(clientPath);
        usedFolderName = unfoundName + '\\' + safeName;
        queueRunUsedUnfound = true;
        appendLogRed('Client not found, using: ' + usedFolderName);
      }

      const authPath = clientPath.concat([AUTH_UTIL_FOLDER]);
      await window.SHELL.fsEnsureDirectory(authPath);
      const dsNames = await window.SHELL.fsListDirectories(authPath);
      let maxDs = 0;
      for (let i = 0; i < dsNames.length; i++) {
        const m = dsNames[i].match(/^ds(\d+)$/i);
        if (m) maxDs = Math.max(maxDs, parseInt(m[1], 10));
      }
      const nextDs = 'DS' + (maxDs + 1);
      const shellPath = authPath.concat([nextDs]);
      await window.SHELL.fsEnsureDirectory(shellPath);
      const logPath = usedFolderName + '\\' + AUTH_UTIL_FOLDER + '\\' + nextDs;
      appendLog('Save path: ' + logPath);
      cachedSaveDir = { shellPath: shellPath, logPath: logPath };
      cachedSaveDirClient = name;
      return cachedSaveDir;
    } catch (e) {
      appendLog('Error resolving path: ' + (e.message || String(e)));
      throw e;
    }
  }

  let clientDirHandle = null;
  let usedFolderName = '';

  try {
    const entries = [];
    for await (const [entryName, handle] of customSaveDirHandle.entries()) {
      if (handle.kind === 'directory') entries.push({ name: entryName, handle });
    }

    const exact = entries.find((e) => normalizeForMatch(e.name) === clientNorm);
    if (exact) {
      clientDirHandle = exact.handle;
      usedFolderName = exact.name;
      appendLog('Found client folder: "' + usedFolderName + '"');
    } else {
      const partial = entries.find((e) => {
        const fn = normalizeForMatch(e.name);
        return fn && clientNorm && (fn.includes(clientNorm) || clientNorm.includes(fn));
      });
      if (partial) {
        clientDirHandle = partial.handle;
        usedFolderName = partial.name;
        appendLog('Matched client folder: "' + usedFolderName + '"');
      }
    }

    if (!clientDirHandle) {
      const safeName = (name || 'Pt').replace(/[/\\:*?"<>|]/g, '').trim().replace(/\s+/g, ' ') || 'Pt';
      const unfoundRoot = await customSaveDirHandle.getDirectoryHandle(unfoundName, { create: true });
      clientDirHandle = await unfoundRoot.getDirectoryHandle(safeName, { create: true });
      usedFolderName = unfoundName + '\\' + safeName;
      queueRunUsedUnfound = true;
      appendLogRed('Client not found, using: ' + usedFolderName);
    }

    const authUtil = await clientDirHandle.getDirectoryHandle(AUTH_UTIL_FOLDER, { create: true });

    let maxDs = 0;
    for await (const [entryName, handle] of authUtil.entries()) {
      if (handle.kind !== 'directory') continue;
      const m = entryName.match(/^ds(\d+)$/i);
      if (m) maxDs = Math.max(maxDs, parseInt(m[1], 10));
    }
    const nextDs = 'DS' + (maxDs + 1);
    const dsDir = await authUtil.getDirectoryHandle(nextDs, { create: true });

    const logPath = usedFolderName + '\\' + AUTH_UTIL_FOLDER + '\\' + nextDs;
    appendLog('Save path: ' + logPath);

    cachedSaveDir = { dirHandle: dsDir, logPath };
    cachedSaveDirClient = name;
    return cachedSaveDir;
  } catch (e) {
    appendLog('Error resolving path: ' + (e.message || String(e)));
    throw e;
  }
}

function isFileSystemPermissionError(e) {
  const msg = (e?.message || '').toLowerCase();
  return /not allowed by the user agent|the platform in the current context|permission denied|invalidstateerror|securityerror/i.test(msg) ||
    e?.name === 'SecurityError' || e?.name === 'InvalidStateError';
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function sendToContent(action, payload = {}) {
  const tab = await getActiveTab();
  if (!tab?.id) {
    setStatus('No active tab.', true);
    return null;
  }
  const url = payload.url || REPORTING_URL;
  if (action === 'navigate') {
    chrome.tabs.update(tab.id, { url });
    setStatus('Redirecting…');
    return { ok: true };
  }
  const isCentralReach = tab.url?.startsWith('https://members.centralreach.com');
  if (!isCentralReach) {
    setStatus('Open a CentralReach tab for this action.', true);
    return null;
  }
  try {
    const response = await chrome.tabs.sendMessage(tab.id, {
      source: 'sidepanel',
      action,
      payload
    });
    return response;
  } catch (e) {
    console.error('[CentralReach Helper] sendToContent failed:', {
      action,
      tabId: tab.id,
      tabUrl: tab.url,
      errorName: e?.name,
      errorMessage: e?.message,
      fullError: e
    });
    const isReceivingEnd = /receiving end does not exist|Receiving end does not exist/i.test(e?.message || '');
    const msg = isReceivingEnd
      ? 'Content script not loaded. Refresh the CentralReach page (F5) and try again.'
      : 'Page may not be loaded. Try again. ' + (e.message || '');
    setStatus(msg, true);
    return null;
  }
}

document.getElementById('rbt-run-auth-date-range').addEventListener('change', function () {
  const val = (this.value || '').trim();
  if (!val || val.indexOf(' - ') < 0) return;
  const parts = val.split(' - ');
  const startEl = document.getElementById('rbt-run-start-date');
  const stopEl = document.getElementById('rbt-run-stop-date');
  if (startEl) startEl.value = (parts[0] || '').trim();
  if (stopEl) stopEl.value = (parts[1] || '').trim();
  savePdfFormToStorage();
});

document.getElementById('rbt-run-service-code').addEventListener('change', function () {
  if (!loadedHoursByCode || !Object.keys(loadedHoursByCode).length) return;
  const code = (this.value || '').trim();
  const authEl = document.getElementById('rbt-pdf-authorized-hours');
  if (!authEl) return;
  if (code === 'all') {
    const sum = Object.values(loadedHoursByCode).reduce((a, b) => a + b, 0);
    authEl.value = sum || '';
  } else if (loadedHoursByCode[code] != null) {
    authEl.value = loadedHoursByCode[code];
  }
  savePdfFormToStorage();
});

document.getElementById('rbt-btn-load-contact-info').addEventListener('click', async () => {
  if (!requireFolderChosen()) return;
  const tab = await getActiveTab();
  if (!tab?.id) {
    setStatus('No active tab.', true);
    return;
  }
  if (!tab.url?.startsWith('https://members.centralreach.com')) {
    setStatus('Open a CentralReach contact page first.', true);
    return;
  }
  const delay = ms => new Promise(r => setTimeout(r, ms));
  let clientId = '', clientName = '', clientDob = '';
  let authRanges = [];
  let dateFrom = '', dateTo = '';
  let hoursByCode = {};
  try {
    setStatus('Step 1: Reading client ID, name & DOB…');
    let r = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        var clientId = '', clientName = '', clientDob = '';
        try {
          var idEl = document.evaluate('/html/body/div[1]/div[1]/div[4]/div/div/div/div/div[2]/div/div[1]/nav[1]/div[2]/div[2]/div[3]/span[2]', document, null, 9, null).singleNodeValue;
          if (idEl) clientId = (idEl.textContent || '').trim();
        } catch (e) {}
        if (!clientId) {
          var spans = document.querySelectorAll('nav span.pull-right');
          for (var i = 0; i < spans.length; i++) {
            var t = (spans[i].textContent || '').trim();
            if (t && /^\d+$/.test(t)) { clientId = t; break; }
          }
        }
        try {
          var nameEl = document.evaluate('/html/body/div[1]/div[1]/div[4]/div/div/div/div/div[2]/div/div[1]/nav[1]/div[2]/div[1]/div/div[2]', document, null, 9, null).singleNodeValue;
          if (nameEl) clientName = (nameEl.textContent || '').trim();
        } catch (e) {}
        if (!clientName) {
          var d = document.querySelector('.txt-xxl.margin-top');
          if (d) clientName = (d.textContent || '').trim();
        }
        try {
          var dobContainer = document.evaluate('/html/body/div[1]/div[1]/div[4]/div/div/div/div/div/div/div[1]/nav[1]/div[2]/div[2]/div[5]', document, null, 9, null).singleNodeValue;
          if (!dobContainer) dobContainer = document.querySelector('nav div[class*="padding"]');
          var searchRoot = dobContainer || document;
          var dobDivs = searchRoot.querySelectorAll('div.padding-xs-bottom, div.border-bottom, div[class*="padding-xs-bottom"]');
          for (var j = 0; j < dobDivs.length; j++) {
            var firstSpan = dobDivs[j].querySelector('span');
            if (firstSpan && (firstSpan.textContent || '').indexOf('DOB') >= 0) {
              var pr = dobDivs[j].querySelector('span.pull-right');
              if (pr) { clientDob = (pr.textContent || '').trim(); break; }
            }
          }
        } catch (e) {}
        return { ok: true, clientId, clientName, clientDob };
      }
    });
    if (!r?.[0]?.result?.ok) {
      setStatus(r?.[0]?.result?.error || 'Could not read client', true);
      return;
    }
    clientId = r[0].result.clientId || '';
    clientName = r[0].result.clientName || '';
    clientDob = r[0].result.clientDob || '';
    await delay(500);

    setStatus('Step 2: Clicking Show/Hide More…');
    r = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        function realClick(el) {
          var prevent = function(e) { e.preventDefault(); };
          el.addEventListener('click', prevent, true);
          el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
          el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
          el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          el.removeEventListener('click', prevent, true);
        }
        var el = document.querySelector('.module-actions a.showmore') || document.querySelector('a.showmore');
        if (!el) return { ok: false, error: 'Show/Hide More not found' };
        realClick(el);
        return { ok: true };
      }
    });
    if (!r?.[0]?.result?.ok) {
      setStatus(r?.[0]?.result?.error || 'Show/Hide More failed', true);
      return;
    }
    await delay(500);

    setStatus('Step 3: Reading auth date ranges…');
    const authSelection = document.getElementById('rbt-settings-auth-selection')?.value || 'current';
    r = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (selectionPref) => {
        var ranges = [];
        var container = document;
        var authMod = Array.from(document.querySelectorAll('.module-title')).find(function(m) {
          return (m.textContent || '').indexOf('Authorizations') >= 0;
        });
        if (authMod) {
          var parent = authMod.closest('.relative') || authMod.closest('.white-basic') || authMod.parentElement;
          if (parent) container = parent;
        }
        function is97151(linkEl) {
          if (!linkEl) return false;
          var desc = linkEl.querySelector('span.overflow-hidden.block') || Array.from(linkEl.children).find(function(c) { return c.tagName === 'SPAN'; });
          if (!desc) return false;
          return /^97151\b/.test((desc.textContent || '').trim());
        }
        var pullRights = container.querySelectorAll('.module-items a.item .pull-right, .module-items .pull-right');
        for (var i = 0; i < pullRights.length; i++) {
          var link = pullRights[i].closest('a') || pullRights[i].parentElement;
          if (is97151(link)) continue;
          var spans = pullRights[i].querySelectorAll('span');
          if (spans.length >= 2) {
            var start = (spans[0].textContent || '').trim();
            var end = (spans[1].textContent || '').trim();
            if (start && end && /^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(start) && /^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(end)) {
              ranges.push(start + ' - ' + end);
            }
          }
        }
        function parseEnd(str) {
          var p = str.split(' - ')[1];
          if (!p) return 0;
          p = p.split('/');
          if (p.length < 3) return 0;
          var m = parseInt(p[0], 10), d = parseInt(p[1], 10), y = parseInt(p[2], 10);
          if (y < 100) y += 2000;
          return new Date(y, m - 1, d).getTime();
        }
        function parseStart(str) {
          var p = str.split(' - ')[0];
          if (!p) return 0;
          p = p.split('/');
          if (p.length < 3) return 0;
          var m = parseInt(p[0], 10), d = parseInt(p[1], 10), y = parseInt(p[2], 10);
          if (y < 100) y += 2000;
          return new Date(y, m - 1, d).getTime();
        }
        ranges.sort(function(a, b) { return parseEnd(a) - parseEnd(b); });
        
        var dateFrom = '', dateTo = '';
        if (ranges.length > 0) {
          var chosenRange;
          var now = Date.now();
          if (selectionPref === 'current') {
            var containingToday = ranges.filter(function(r) { 
              return now >= parseStart(r) && now <= parseEnd(r); 
            });
            if (containingToday.length > 0) {
              chosenRange = containingToday[containingToday.length - 1];
            } else {
              chosenRange = ranges[ranges.length - 1];
            }
          } else {
            var indexOffset = parseInt(selectionPref, 10) || 1;
            var targetIndex = ranges.length - indexOffset;
            if (targetIndex < 0) targetIndex = 0;
            chosenRange = ranges[targetIndex];
          }
          
          if (chosenRange) {
            var parts = chosenRange.split(' - ');
            dateFrom = parts[0] || '';
            dateTo = parts[1] || '';
          }
        }
        return { ok: true, ranges: ranges, dateFrom, dateTo };
      },
      args: [authSelection]
    });
    if (r?.[0]?.result?.ok) {
      authRanges = [...new Set(r[0].result.ranges || [])];
      dateFrom = r[0].result.dateFrom || '';
      dateTo = r[0].result.dateTo || '';
      console.log('[CentralReach Helper] [DATES] Load Contact Info — dates from CLIENT PAGE (Authorizations module, latest by end date):', { dateFrom, dateTo, source: 'client page DOM', rangesFound: authRanges });
    }
    if (!authRanges.length) {
      setStatus('No auth date ranges found. Click Show/Hide More first.', true);
      return;
    }
    await delay(500);

    setStatus('Step 4: Opening chosen auth…');
    const authSelectionStep4 = document.getElementById('rbt-settings-auth-selection')?.value || 'current';
    r = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (selectionPref) => {
        var container = document;
        var authMod = Array.from(document.querySelectorAll('.module-title')).find(function(m) {
          return (m.textContent || '').indexOf('Authorizations') >= 0;
        });
        if (authMod) {
          var parent = authMod.closest('.relative') || authMod.closest('.white-basic') || authMod.parentElement;
          if (parent) container = parent;
        }
        var links = container.querySelectorAll('.module-items a.item[href]');
        if (!links.length) return { ok: false, error: 'No auth item found' };
        function is97151(linkEl) {
          if (!linkEl) return false;
          var desc = linkEl.querySelector('span.overflow-hidden.block') || Array.from(linkEl.children).find(function(c) { return c.tagName === 'SPAN'; });
          if (!desc) return false;
          return /^97151\b/.test((desc.textContent || '').trim());
        }
        function parseDate(str) {
          var p = (str || '').split('/');
          if (p.length < 3) return 0;
          var m = parseInt(p[0], 10), d = parseInt(p[1], 10), y = parseInt(p[2], 10);
          if (y < 100) y += 2000;
          return new Date(y, m - 1, d).getTime();
        }
        var items = [];
        for (var i = 0; i < links.length; i++) {
          if (is97151(links[i])) continue;
          var pr = links[i].querySelector('.pull-right');
          if (!pr) continue;
          var spans = pr.querySelectorAll('span');
          if (spans.length < 2) continue;
          var startStr = (spans[0].textContent || '').trim();
          var endStr = (spans[1].textContent || '').trim();
          var startTime = parseDate(startStr);
          var endTime = parseDate(endStr);
          items.push({ link: links[i], startTime: startTime, endTime: endTime });
        }
        items.sort(function(a, b) { return a.endTime - b.endTime; });
        if (!items.length) return { ok: false, error: 'No auth item found' };
        
        var chosen;
        var now = Date.now();
        if (selectionPref === 'current') {
          var containingToday = items.filter(function(it) { return now >= it.startTime && now <= it.endTime; });
          if (containingToday.length > 0) {
            chosen = containingToday[containingToday.length - 1];
          } else {
            chosen = items[items.length - 1];
          }
        } else {
          var indexOffset = parseInt(selectionPref, 10) || 1;
          var targetIndex = items.length - indexOffset;
          if (targetIndex < 0) targetIndex = 0;
          chosen = items[targetIndex];
        }

        var href = (chosen.link.getAttribute('href') || '').trim();
        if (!href) return { ok: false, error: 'No href' };
        var fullUrl = href.indexOf('http') === 0 ? href : (new URL(href, window.location.href)).href;
        return { ok: true, url: fullUrl };
      },
      args: [authSelectionStep4]
    });
    if (!r?.[0]?.result?.ok) {
      setStatus(r?.[0]?.result?.error || 'Latest auth failed', true);
      return;
    }
    chrome.tabs.update(tab.id, { url: r[0].result.url });
    await delay(2500);
    await delay(500);

    setStatus('Step 5: Closing modal…');
    r = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        function realClick(el) {
          var prevent = function(e) { e.preventDefault(); };
          el.addEventListener('click', prevent, true);
          el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
          el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
          el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          el.removeEventListener('click', prevent, true);
        }
        var btn = document.querySelector('.modal-content button[data-dismiss="modal"]') || document.querySelector('button[data-dismiss="modal"]');
        if (!btn) return { ok: false };
        realClick(btn);
        return { ok: true };
      }
    });
    await delay(500);

    setStatus('Step 6: Reading service breakdown…');
    r = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (codeMap) => {
        var section = Array.from(document.querySelectorAll('*')).find(function(el) {
          return (el.textContent || '').trim() === 'Service Code Breakdown';
        });
        if (!section) {
          section = Array.from(document.querySelectorAll('.flex, .border')).find(function(el) {
            return (el.textContent || '').indexOf('Service Code Breakdown') >= 0;
          });
        }
        if (!section) return { ok: false, error: 'Service Code Breakdown not found' };
        var container = section.closest('.border') || section.closest('.drop-shadow') || section.parentElement || document;
        var groups = container.querySelectorAll('.code-group');
        var out = [];
        for (var g = 0; g < groups.length; g++) {
          var group = groups[g];
          var codeSpans = group.querySelectorAll('h5 span');
          var codesRaw = '';
          for (var s = 0; s < codeSpans.length; s++) {
            var t = (codeSpans[s].textContent || '').trim();
            if (t && /^[\d\s,]+$/.test(t)) { codesRaw = t; break; }
          }
          if (!codesRaw) codesRaw = ((group.querySelector('h5') || {}).textContent || '').replace(/Grouped Codes:\s*/i, '').trim() || '?';
          var uniqueCodes = codesRaw.split(',').map(function(x) { return x.trim(); }).filter(Boolean);
          uniqueCodes = uniqueCodes.filter(function(c, i) { return uniqueCodes.indexOf(c) === i; });
          var rows = group.querySelectorAll('.row');
          function getUnits(row) {
            if (!row) return null;
            var cols = row.querySelectorAll('.col-xs-3');
            if (cols.length >= 3) {
              var v = (cols[2].textContent || '').trim().replace(/\s+/g, ' ').replace(/\s*n\/a\s*/gi, '').trim();
              return v && /units/i.test(v) ? v : null;
            }
            return null;
          }
          var onceUnits = rows[0] ? getUnits(rows[0]) : null;
          var totalUnits = rows[1] ? getUnits(rows[1]) : null;
          var units = totalUnits || onceUnits;
          if (units) {
            var hours = 0;
            var hoursMatch = units.match(/\((\d+(?:\.\d+)?)\s*hours?\)/i);
            if (hoursMatch) hours = Math.round(parseFloat(hoursMatch[1]));
            else {
              var num = parseInt(units.replace(/\D/g, ''), 10);
              hours = !isNaN(num) ? Math.round(num / 4) : 0;
            }
            for (var c = 0; c < uniqueCodes.length; c++) {
              var sc = codeMap[uniqueCodes[c]];
              if (sc) out.push({ serviceCode: sc, hours: hours });
            }
          }
        }
        return { ok: true, breakdown: out };
      },
      args: [{ '97153': '97153 tx', '97155': '97155 tx t', '97156': '97156 tx t' }]
    });
    if (!r?.[0]?.result?.ok) {
      setStatus(r?.[0]?.result?.error || 'Service breakdown failed', true);
      return;
    }
    var breakdown = r[0].result.breakdown || [];
    for (let i = 0; i < breakdown.length; i++) {
      hoursByCode[breakdown[i].serviceCode] = breakdown[i].hours;
    }
    loadedHoursByCode = { ...hoursByCode };

    document.getElementById('rbt-pdf-client-name').value = clientName;
    document.getElementById('rbt-pdf-dob').value = clientDob;
    document.getElementById('rbt-run-start-date').value = dateFrom;
    document.getElementById('rbt-run-stop-date').value = dateTo;
    document.getElementById('rbt-run-contact-id').value = clientId;
    const authTotal = Object.values(hoursByCode).reduce((a, b) => a + b, 0);
    document.getElementById('rbt-pdf-authorized-hours').value = authTotal || '';

    const authSelect = document.getElementById('rbt-run-auth-date-range');
    const rowAuth = document.getElementById('rbt-row-auth-date-range');
    authSelect.innerHTML = '<option value="">— Select —</option>' + authRanges.map(function(range) {
      return '<option value="' + range.replace(/"/g, '&quot;') + '">' + range + '</option>';
    }).join('');
    authSelect.value = (dateFrom && dateTo) ? (dateFrom + ' - ' + dateTo) : (authRanges[authRanges.length - 1] || '');
    rowAuth.style.display = 'block';

    console.log('[CentralReach Helper] [DATES] Load Contact Info — form SET to:', { dateFrom, dateTo, clientName, clientId, source: 'client page (latest auth range)' });
    savePdfFormToStorage();
    setStatus('Contact info loaded. Select auth range if needed, then click Run Full Report.');
  } catch (e) {
    setStatus('Error: ' + (e.message || 'Could not load'), true);
  }
});

document.getElementById('rbt-btn-run-full-report').addEventListener('click', async () => {
  clearSaveDirCache();
  if (!requireFolderChosen()) return;
  clearSaveLog();
  queueRunUsedFallback = false;
  queueRunUsedUnfound = false;
  setStatus('Step 1: Refreshing page…');

  const tab = await getActiveTab();
  if (!tab?.id) {
    setStatus('No active tab.', true);
    return;
  }
  if (!tab.url?.startsWith('https://members.centralreach.com')) {
    setStatus('Open a CentralReach tab first.', true);
    return;
  }

  chrome.tabs.reload(tab.id);
  await new Promise((resolve) => {
    const listener = (tabId, changeInfo) => {
      if (tabId === tab.id && changeInfo.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener);
        resolve();
      }
    };
    chrome.tabs.onUpdated.addListener(listener);
    setTimeout(() => {
      chrome.tabs.onUpdated.removeListener(listener);
      resolve();
    }, 10000);
  });
  await new Promise(r => setTimeout(r, 1500));

  const cfg = typeof CENTRALREACH_SELECTORS !== 'undefined' ? CENTRALREACH_SELECTORS : {};
  const dateFrom = (document.getElementById('rbt-run-start-date')?.value || '').trim();
  const dateTo = (document.getElementById('rbt-run-stop-date')?.value || '').trim();
  const contactId = (document.getElementById('rbt-run-contact-id')?.value || '').trim() || String(cfg.defaultContactId || '3792429');
  const serviceCode = (document.getElementById('rbt-run-service-code')?.value || '').trim() || String(cfg.defaultServiceCode || 'all');

  console.log('[CentralReach Helper] [DATES] Run Full Report (manual) — using dates from SIDEPANEL FORM:', { dateFrom, dateTo, contactId, source: 'manual form (refresh with Load Contact Info on the contact page if wrong)' });

  if (!dateFrom || !dateTo) {
    setStatus('Enter start and stop dates.', true);
    return;
  }

  savePdfFormToStorage();
  const codesToRun = (serviceCode === 'all') ? SERVICE_CODES : [serviceCode];
  const opts = { dateFrom, dateTo, contactId, serviceCode };

  try {
    setStatus('Step 2: Filling dates…');
    console.log('[CentralReach Helper] [DATES] Run Full Report (manual) — filling REPORT PAGE with form dates:', { dateFrom: opts.dateFrom, dateTo: opts.dateTo, source: 'sidepanel form' });
    let results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (o) => {
        function fillDate(sel, val) {
          var el = document.querySelector(sel) || document.getElementById((sel || '').replace('#', ''));
          if (!el) return false;
          el.value = val;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          return true;
        }
        if (!fillDate('#dateFrom', o.dateFrom)) return { ok: false, error: 'Date from not found' };
        if (!fillDate('#dateTo', o.dateTo)) return { ok: false, error: 'Date to not found' };
        return { ok: true };
      },
      args: [opts]
    });
    if (!results?.[0]?.result?.ok) {
      setStatus(results?.[0]?.result?.error || 'Dates failed', true);
      return;
    }

    setStatus('Step 3: Selecting contact…');
    results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: async (id) => {
        function realClick(el) {
          var prevent = function(e) { e.preventDefault(); };
          el.addEventListener('click', prevent, true);
          el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
          el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
          el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          el.removeEventListener('click', prevent, true);
        }
        var contactSpan = document.querySelector('span#select2-chosen-8') || document.querySelector('#indReportRoot span.select2-chosen:first-of-type');
        if (!contactSpan) return { ok: false, error: 'Contact span not found' };
        realClick(contactSpan);
        await new Promise(r => setTimeout(r, 400));
        var searchInput = document.querySelector('#select2-drop input') || document.querySelector('.select2-drop input.select2-input');
        if (!searchInput) return { ok: false, error: 'Contact search input not found' };
        searchInput.focus();
        searchInput.value = id;
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        searchInput.dispatchEvent(new Event('keyup', { bubbles: true }));
        await new Promise(r => setTimeout(r, 1000));
        var res = document.querySelector('#select2-drop .select2-results li.select2-result-selectable') || document.querySelector('#select2-drop .select2-results li');
        if (!res) return { ok: false, error: 'Contact result not found' };
        realClick(res);
        return { ok: true };
      },
      args: [contactId]
    });
    if (!results?.[0]?.result?.ok) {
      setStatus(results?.[0]?.result?.error || 'Contact failed', true);
      return;
    }

    let pdfCount = 0;
    const totalCodes = codesToRun.length;
    for (let idx = 0; idx < codesToRun.length; idx++) {
      const code = codesToRun[idx];
      const stepLabel = totalCodes > 1 ? ` (${idx + 1}/${totalCodes}: ${code})` : '';

      if (idx > 0) {
        setStatus('Waiting for page to be ready…');
        await new Promise(r => setTimeout(r, 3000));
        setStatus('Clearing previous service code…');
        results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            function realClick(el) {
              var prevent = function(e) { e.preventDefault(); };
              el.addEventListener('click', prevent, true);
              el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
              el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
              el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
              el.removeEventListener('click', prevent, true);
            }
            var closeBtn = document.querySelector('#indReportRoot .select2-container:nth-of-type(3) abbr.select2-search-choice-close');
            if (!closeBtn) {
              var all = document.querySelectorAll('abbr.select2-search-choice-close');
              closeBtn = all.length >= 3 ? all[2] : (all[all.length - 1] || all[0]);
            }
            if (!closeBtn) return { ok: false, error: 'Service code clear (X) button not found' };
            realClick(closeBtn);
            return { ok: true };
          }
        });
        if (!results?.[0]?.result?.ok) {
          setStatus(results?.[0]?.result?.error || 'Clear service code failed', true);
          return;
        }
        await new Promise(r => setTimeout(r, 500));
      }

      setStatus('Step 4' + stepLabel + ': Selecting service code…');
      results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: async (code) => {
          function realClick(el) {
            var prevent = function(e) { e.preventDefault(); };
            el.addEventListener('click', prevent, true);
            el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
            el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
            el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
            el.removeEventListener('click', prevent, true);
          }
          var codeSpan = (function() {
            try {
              var r = document.evaluate('//span[contains(@class,"select2-chosen") and contains(.,"Filter by service code")]', document, null, 9, null);
              if (r.singleNodeValue) return r.singleNodeValue;
            } catch(e) {}
            return document.querySelector('#indReportRoot .select2-container:nth-of-type(3) span.select2-chosen');
          })();
          if (!codeSpan) return { ok: false, error: 'Service code span not found' };
          realClick(codeSpan);
          await new Promise(r => setTimeout(r, 400));
          var searchInput = document.querySelector('#select2-drop input') || document.querySelector('.select2-drop input.select2-input');
          if (!searchInput) return { ok: false, error: 'Service code search input not found' };
          searchInput.focus();
          searchInput.value = code;
          searchInput.dispatchEvent(new Event('input', { bubbles: true }));
          searchInput.dispatchEvent(new Event('keyup', { bubbles: true }));
          await new Promise(r => setTimeout(r, 1000));
          var res = document.querySelector('#select2-drop .select2-results li.select2-result-selectable') || document.querySelector('#select2-drop .select2-results li');
          if (!res) return { ok: false, error: 'Service code result not found' };
          realClick(res);
          return { ok: true };
        },
        args: [code]
      });
      if (!results?.[0]?.result?.ok) {
        setStatus(results?.[0]?.result?.error || 'Service code failed', true);
        return;
      }

      setStatus('Step 5' + stepLabel + ': Clicking Search…');
      results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          var btn = document.querySelector('#btnsearch') || document.querySelector('a#btnsearch');
          if (!btn) return { ok: false, error: 'Search button not found' };
          var prevent = function(e) { e.preventDefault(); };
          btn.addEventListener('click', prevent, true);
          btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
          btn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
          btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          btn.removeEventListener('click', prevent, true);
          return { ok: true };
        }
      });

      if (!results?.[0]?.result?.ok) {
        setStatus(results?.[0]?.result?.error || 'Search failed', true);
        return;
      }

      savePdfFormToStorage();

      setStatus('Step 6' + stepLabel + ': Waiting for results…');
      await new Promise(r => setTimeout(r, 4000));

      setStatus('Step 7' + stepLabel + ': Generating PDF…');
      const authHours = (loadedHoursByCode && loadedHoursByCode[code] != null) ? loadedHoursByCode[code] : null;
      const pdfOk = await runPdfExport(tab, {
        serviceCodeOverride: code,
        authorizedHoursOverride: authHours != null ? authHours : undefined
      });
      if (pdfOk) pdfCount++;
      if (idx < codesToRun.length - 1) {
        setStatus('Preparing for next service code…');
        await new Promise(r => setTimeout(r, 2000));
      }
    }
    setStatus(pdfCount > 0
      ? (pdfCount === totalCodes ? 'Done. ' + pdfCount + ' PDF(s) downloaded.' : 'Done. ' + pdfCount + '/' + totalCodes + ' PDF(s) downloaded.')
      : 'Search complete. PDF failed—try Export button after table loads.');
  } catch (e) {
    setStatus('Error: ' + (e.message || 'Could not run'), true);
  }
});

/** Maps breakdown codes (97153) to SERVICE_CODES (97153 tx). 97151 is ignored. */
const CODE_TO_SERVICE = { '97153': '97153 tx', '97155': '97155 tx t', '97156': '97156 tx t' };

function isContactDetailsUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const u = url.trim();
  if (!u.startsWith('https://members.centralreach.com')) return false;
  return u.indexOf('#contacts/details/') >= 0 && /[?&]id=\d+/.test(u);
}

function getContactIdFromUrl(url) {
  const m = (url || '').match(/[?&]id=(\d+)/);
  return m ? m[1] : '';
}

document.getElementById('rbt-btn-add-to-queue').addEventListener('click', async () => {
  if (!requireFolderChosen()) return;
  try {
    const tab = await getActiveTab();
    if (!tab?.id) {
      setStatus('No active tab.', true);
      return;
    }
    const url = (tab.url || '').trim();
    if (!isContactDetailsUrl(url)) {
      setStatus('Open a CentralReach contact page (e.g. .../#contacts/details/?id=12345)', true);
      return;
    }
    if (reportQueue.some((q) => q.url === url)) {
      setStatus('Already in queue.', true);
      return;
    }
    setStatus('Reading client name…');
    let name = 'Contact ' + (getContactIdFromUrl(url) || '?');
    try {
      const r = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          var clientName = '';
          try {
            var nameEl = document.evaluate('/html/body/div[1]/div[1]/div[4]/div/div/div/div/div[2]/div/div[1]/nav[1]/div[2]/div[1]/div/div[2]', document, null, 9, null).singleNodeValue;
            if (nameEl) clientName = (nameEl.textContent || '').trim();
          } catch (e) {}
          if (!clientName) {
            var d = document.querySelector('.txt-xxl.margin-top');
            if (d) clientName = (d.textContent || '').trim();
          }
          if (!clientName) {
            var nav = document.querySelector('nav .txt-xxl, nav h2, .contact-name');
            if (nav) clientName = (nav.textContent || '').trim();
          }
          return { ok: true, name: clientName || '' };
        }
      });
      const n = r?.[0]?.result?.name;
      if (n) name = n;
    } catch (e) {
      setStatus('Could not read name (using ID). Adding anyway…');
    }
    reportQueue.push({ name, url });
    saveQueue();
    setStatus('Added "' + name + '" to queue.');
  } catch (err) {
    setStatus('Add to queue failed: ' + (err.message || String(err)), true);
    console.error('Add to queue:', err);
  }
});

async function runFullReportFromContactForTab(tab, clientLabel = '') {
  clearSaveDirCache();
  if (!tab?.id) {
    setStatus('No active tab.', true);
    return { clientName: '', reports: [] };
  }
  if (!tab.url?.startsWith('https://members.centralreach.com')) {
    setStatus('Open a CentralReach contact page first.', true);
    return { clientName: '', reports: [] };
  }
  const delay = ms => new Promise(r => setTimeout(r, ms));
  const prefix = clientLabel ? clientLabel + ' ' : '';
  let clientId = '', clientName = '', clientDob = '';
  let dateFrom = '', dateTo = '';
  let hoursByCode = {};
  try {
    setStatus(prefix + 'Step 1: Reading client ID, name & DOB…');
    let r = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        var clientId = '', clientName = '', clientDob = '';
        try {
          var idEl = document.evaluate('/html/body/div[1]/div[1]/div[4]/div/div/div/div/div[2]/div/div[1]/nav[1]/div[2]/div[2]/div[3]/span[2]', document, null, 9, null).singleNodeValue;
          if (idEl) clientId = (idEl.textContent || '').trim();
        } catch (e) {}
        if (!clientId) {
          var spans = document.querySelectorAll('nav span.pull-right');
          for (var i = 0; i < spans.length; i++) {
            var t = (spans[i].textContent || '').trim();
            if (t && /^\d+$/.test(t)) { clientId = t; break; }
          }
        }
        try {
          var nameEl = document.evaluate('/html/body/div[1]/div[1]/div[4]/div/div/div/div/div[2]/div/div[1]/nav[1]/div[2]/div[1]/div/div[2]', document, null, 9, null).singleNodeValue;
          if (nameEl) clientName = (nameEl.textContent || '').trim();
        } catch (e) {}
        if (!clientName) {
          var d = document.querySelector('.txt-xxl.margin-top');
          if (d) clientName = (d.textContent || '').trim();
        }
        try {
          var dobContainer = document.evaluate('/html/body/div[1]/div[1]/div[4]/div/div/div/div/div/div/div[1]/nav[1]/div[2]/div[2]/div[5]', document, null, 9, null).singleNodeValue;
          if (!dobContainer) dobContainer = document.querySelector('nav div[class*="padding"]');
          var searchRoot = dobContainer || document;
          var dobDivs = searchRoot.querySelectorAll('div.padding-xs-bottom, div.border-bottom, div[class*="padding-xs-bottom"]');
          for (var j = 0; j < dobDivs.length; j++) {
            var firstSpan = dobDivs[j].querySelector('span');
            if (firstSpan && (firstSpan.textContent || '').indexOf('DOB') >= 0) {
              var pr = dobDivs[j].querySelector('span.pull-right');
              if (pr) { clientDob = (pr.textContent || '').trim(); break; }
            }
          }
        } catch (e) {}
        return { ok: true, clientId, clientName, clientDob };
      }
    });
    if (!r?.[0]?.result?.ok) {
      setStatus(r?.[0]?.result?.error || 'Could not read client', true);
      return { clientName: '', reports: [] };
    }
    clientId = r[0].result.clientId || '';
    clientName = r[0].result.clientName || '';
    clientDob = r[0].result.clientDob || '';
    await delay(500);

    setStatus(prefix + 'Step 2: Clicking Show/Hide More…');
    r = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        function realClick(el) {
          var prevent = function(e) { e.preventDefault(); };
          el.addEventListener('click', prevent, true);
          el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
          el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
          el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          el.removeEventListener('click', prevent, true);
        }
        var el = document.querySelector('.module-actions a.showmore') || document.querySelector('a.showmore');
        if (!el) return { ok: false, error: 'Show/Hide More not found' };
        realClick(el);
        return { ok: true };
      }
    });
    if (!r?.[0]?.result?.ok) {
      setStatus(r?.[0]?.result?.error || 'Show/Hide More failed', true);
      return { clientName: clientName || '', reports: [] };
    }
    await delay(500);

    setStatus(prefix + 'Step 3: Reading auth date ranges and choosing auth…');
    const authSelectionStep3 = document.getElementById('rbt-settings-auth-selection')?.value || 'current';
    r = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (selectionPref) => {
        var container = document;
        var authMod = Array.from(document.querySelectorAll('.module-title')).find(function(m) {
          return (m.textContent || '').indexOf('Authorizations') >= 0;
        });
        if (authMod) {
          var parent = authMod.closest('.relative') || authMod.closest('.white-basic') || authMod.parentElement;
          if (parent) container = parent;
        }
        var links = container.querySelectorAll('.module-items a.item[href]');
        if (!links.length) return { ok: false, error: 'No auth item found' };
        function is97151(linkEl) {
          if (!linkEl) return false;
          var desc = linkEl.querySelector('span.overflow-hidden.block') || Array.from(linkEl.children).find(function(c) { return c.tagName === 'SPAN'; });
          if (!desc) return false;
          return /^97151\b/.test((desc.textContent || '').trim());
        }
        function parseDate(str) {
          var p = (str || '').split('/');
          if (p.length < 3) return 0;
          var m = parseInt(p[0], 10), d = parseInt(p[1], 10), y = parseInt(p[2], 10);
          if (y < 100) y += 2000;
          return new Date(y, m - 1, d).getTime();
        }
        var items = [];
        for (var i = 0; i < links.length; i++) {
          if (is97151(links[i])) continue;
          var pr = links[i].querySelector('.pull-right');
          if (!pr) continue;
          var spans = pr.querySelectorAll('span');
          if (spans.length < 2) continue;
          var startStr = (spans[0].textContent || '').trim();
          var endStr = (spans[1].textContent || '').trim();
          if (!startStr || !endStr || !/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(startStr) || !/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(endStr)) continue;
          var startTime = parseDate(startStr);
          var endTime = parseDate(endStr);
          items.push({ link: links[i], startStr, endStr, startTime, endTime });
        }
        items.sort(function(a, b) { return a.endTime - b.endTime; });
        if (!items.length) return { ok: false, error: 'No auth items with dates' };
        var now = Date.now();
        var nowDate = new Date(now);
        var nowStr = (nowDate.getMonth() + 1) + '/' + nowDate.getDate() + '/' + (String(nowDate.getFullYear()).slice(-2));
        var containingToday = items.filter(function(it) { return now >= it.startTime && now <= it.endTime; });
        
        var chosen;
        var reason;
        
        if (selectionPref === 'current') {
          if (containingToday.length > 0) {
            chosen = containingToday[containingToday.length - 1]; // most recent ending among current
            reason = 'current_containing_today';
          } else {
            chosen = items[items.length - 1];
            reason = 'most_recent_fallback';
          }
        } else {
          // '1' for Most Recent, '2' for 2nd Most Recent, etc.
          var indexOffset = parseInt(selectionPref, 10) || 1;
          var targetIndex = items.length - indexOffset;
          if (targetIndex < 0) targetIndex = 0;
          chosen = items[targetIndex];
          reason = 'selected_index_' + indexOffset;
        }

        var authRanges = items.map(function(it) { return it.startStr + ' - ' + it.endStr; });
        var href = (chosen.link.getAttribute('href') || '').trim();
        if (!href) return { ok: false, error: 'No href' };
        var fullUrl = href.indexOf('http') === 0 ? href : (new URL(href, window.location.href)).href;
        return { ok: true, dateFrom: chosen.startStr, dateTo: chosen.endStr, url: fullUrl, authLog: { now: nowStr, ranges: authRanges, chosen: chosen.startStr + ' - ' + chosen.endStr, reason: reason } };
      },
      args: [authSelectionStep3]
    });
    if (r?.[0]?.result?.ok) {
      dateFrom = r[0].result.dateFrom || '';
      dateTo = r[0].result.dateTo || '';
      const log = r[0].result.authLog;
      if (log) {
        appendLog('[Auth range] Today: ' + log.now);
        appendLog('[Auth range] Found: ' + (log.ranges || []).join(' | '));
        appendLog('[Auth range] Chose: ' + log.chosen + ' (reason: ' + log.reason + ')');
        console.log('[CentralReach Helper] [DATES] Run from contact/queue — dates from CURRENT CONTACT PAGE (Authorizations, non-97151):', { dateFrom, dateTo, reason: log.reason, chosen: log.chosen, ranges: log.ranges, source: 'client page DOM' });
      }
    }
    if (!r?.[0]?.result?.ok) {
      setStatus(r?.[0]?.result?.error || 'Auth selection failed', true);
      return { clientName: clientName || '', reports: [] };
    }
    if (!dateFrom || !dateTo) {
      setStatus('Could not get auth date range.', true);
      return { clientName: clientName || '', reports: [] };
    }
    await delay(500);

    setStatus('Step 4: Opening auth…');
    chrome.tabs.update(tab.id, { url: r[0].result.url });
    await delay(2500);
    await delay(500);

    setStatus('Step 5: Closing modal…');
    r = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        function realClick(el) {
          var prevent = function(e) { e.preventDefault(); };
          el.addEventListener('click', prevent, true);
          el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
          el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
          el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          el.removeEventListener('click', prevent, true);
        }
        var btn = document.querySelector('.modal-content button[data-dismiss="modal"]') || document.querySelector('button[data-dismiss="modal"]');
        if (!btn) return { ok: false };
        realClick(btn);
        return { ok: true };
      }
    });
    await delay(500);

    setStatus('Step 6: Reading service breakdown…');
    r = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (codeMap) => {
        var section = Array.from(document.querySelectorAll('*')).find(function(el) {
          return (el.textContent || '').trim() === 'Service Code Breakdown';
        });
        if (!section) {
          section = Array.from(document.querySelectorAll('.flex, .border')).find(function(el) {
            return (el.textContent || '').indexOf('Service Code Breakdown') >= 0;
          });
        }
        if (!section) return { ok: false, error: 'Service Code Breakdown not found' };
        var container = section.closest('.border') || section.closest('.drop-shadow') || section.parentElement || document;
        var groups = container.querySelectorAll('.code-group');
        var out = [];
        for (var g = 0; g < groups.length; g++) {
          var group = groups[g];
          var codeSpans = group.querySelectorAll('h5 span');
          var codesRaw = '';
          for (var s = 0; s < codeSpans.length; s++) {
            var t = (codeSpans[s].textContent || '').trim();
            if (t && /^[\d\s,]+$/.test(t)) { codesRaw = t; break; }
          }
          if (!codesRaw) codesRaw = ((group.querySelector('h5') || {}).textContent || '').replace(/Grouped Codes:\s*/i, '').trim() || '?';
          var uniqueCodes = codesRaw.split(',').map(function(x) { return x.trim(); }).filter(Boolean);
          uniqueCodes = uniqueCodes.filter(function(c, i) { return uniqueCodes.indexOf(c) === i; });
          var rows = group.querySelectorAll('.row');
          function getUnits(row) {
            if (!row) return null;
            var cols = row.querySelectorAll('.col-xs-3');
            if (cols.length >= 3) {
              var v = (cols[2].textContent || '').trim().replace(/\s+/g, ' ').replace(/\s*n\/a\s*/gi, '').trim();
              return v && /units/i.test(v) ? v : null;
            }
            return null;
          }
          var onceUnits = rows[0] ? getUnits(rows[0]) : null;
          var totalUnits = rows[1] ? getUnits(rows[1]) : null;
          var units = totalUnits || onceUnits;
          if (units) {
            var hours = 0;
            var hoursMatch = units.match(/\((\d+(?:\.\d+)?)\s*hours?\)/i);
            if (hoursMatch) hours = Math.round(parseFloat(hoursMatch[1]));
            else {
              var num = parseInt(units.replace(/\D/g, ''), 10);
              hours = !isNaN(num) ? Math.round(num / 4) : 0;
            }
            for (var c = 0; c < uniqueCodes.length; c++) {
              var sc = codeMap[uniqueCodes[c]];
              if (sc) out.push({ serviceCode: sc, hours: hours });
            }
          }
        }
        return { ok: true, breakdown: out };
      },
      args: [{ '97153': '97153 tx', '97155': '97155 tx t', '97156': '97156 tx t' }]
    });
    let hoursByCode = {};
    SERVICE_CODES.forEach(c => hoursByCode[c] = 0);

    if (r?.[0]?.result?.ok) {
      var breakdown = r[0].result.breakdown || [];
      for (var i = 0; i < breakdown.length; i++) {
        hoursByCode[breakdown[i].serviceCode] = breakdown[i].hours;
      }
    } else {
      console.warn('[CentralReach Helper] Service breakdown read failed or not found, hours will be 0.');
    }

    document.getElementById('rbt-pdf-client-name').value = clientName;
    document.getElementById('rbt-pdf-dob').value = clientDob;
    document.getElementById('rbt-run-start-date').value = dateFrom;
    document.getElementById('rbt-run-stop-date').value = dateTo;
    document.getElementById('rbt-run-contact-id').value = clientId;
    console.log('[CentralReach Helper] [DATES] Run from contact/queue — form SET to:', { dateFrom, dateTo, clientName, clientId, source: 'current contact page (chosen auth range)' });
    savePdfFormToStorage();

    setStatus(prefix + 'Step 7: Navigating to reporting…');
    chrome.tabs.update(tab.id, { url: REPORTING_URL });
    await new Promise((resolve) => {
      const listener = (tabId, changeInfo) => {
        if (tabId === tab.id && changeInfo.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          resolve();
        }
      };
      chrome.tabs.onUpdated.addListener(listener);
      setTimeout(() => {
        chrome.tabs.onUpdated.removeListener(listener);
        resolve();
      }, 10000);
    });
    await delay(1500);

    let results;
    let pdfCount = 0;
    const reportsGenerated = [];

    // Make sure service code filter is cleared before searching
    setStatus('Step 8: Clearing any service code filter…');
    results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        function realClick(el) {
          var prevent = function(e) { e.preventDefault(); };
          el.addEventListener('click', prevent, true);
          el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
          el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
          el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          el.removeEventListener('click', prevent, true);
        }
        var closeBtn = document.querySelector('#indReportRoot .select2-container:nth-of-type(3) abbr.select2-search-choice-close');
        if (!closeBtn) {
          var all = document.querySelectorAll('abbr.select2-search-choice-close');
          closeBtn = all.length >= 3 ? all[2] : (all[all.length - 1] || all[0]);
        }
        if (closeBtn) realClick(closeBtn);
        return { ok: true };
      }
    });
    await delay(500);

    setStatus('Step 9: Filling dates & contact…');
    results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (opts) => {
        function fillDate(sel, val) {
          var el = document.querySelector(sel) || document.getElementById((sel || '').replace('#', ''));
          if (!el) return false;
          el.value = val;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          return true;
        }
        if (!fillDate('#dateFrom', opts.dateFrom)) return { ok: false, error: 'Date from not found' };
        if (!fillDate('#dateTo', opts.dateTo)) return { ok: false, error: 'Date to not found' };
        return { ok: true };
      },
      args: [{ dateFrom, dateTo }]
    });
    if (!results?.[0]?.result?.ok) {
      setStatus(results?.[0]?.result?.error || 'Dates failed', true);
      return { clientName: clientName || '', reports: reportsGenerated };
    }

    results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: async (id) => {
        function realClick(el) {
          var prevent = function(e) { e.preventDefault(); };
          el.addEventListener('click', prevent, true);
          el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
          el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
          el.removeEventListener('click', prevent, true);
        }
        var contactSpan = document.querySelector('span#select2-chosen-8') || document.querySelector('#indReportRoot span.select2-chosen:first-of-type');
        if (!contactSpan) return { ok: false, error: 'Contact span not found' };
        realClick(contactSpan);
        await new Promise(r => setTimeout(r, 400));
        var searchInput = document.querySelector('#select2-drop input') || document.querySelector('.select2-drop input.select2-input');
        if (!searchInput) return { ok: false, error: 'Contact search input not found' };
        searchInput.focus();
        searchInput.value = id;
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        searchInput.dispatchEvent(new Event('keyup', { bubbles: true }));
        await new Promise(r => setTimeout(r, 1000));
        var res = document.querySelector('#select2-drop .select2-results li.select2-result-selectable') || document.querySelector('#select2-drop .select2-results li');
        if (!res) return { ok: false, error: 'Contact result not found' };
        realClick(res);
        return { ok: true };
      },
      args: [clientId]
    });
    if (!results?.[0]?.result?.ok) {
      setStatus(results?.[0]?.result?.error || 'Contact failed', true);
      return { clientName: clientName || '', reports: reportsGenerated };
    }
    await delay(400);

    setStatus('Step 10: Clicking Search…');
    results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        var btn = document.querySelector('#btnsearch') || document.querySelector('a#btnsearch');
        if (!btn) return { ok: false, error: 'Search button not found' };
        var prevent = function(e) { e.preventDefault(); };
        btn.addEventListener('click', prevent, true);
        btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
        btn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
        btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        btn.removeEventListener('click', prevent, true);
        return { ok: true };
      }
    });
    if (!results?.[0]?.result?.ok) {
      setStatus(results?.[0]?.result?.error || 'Search failed', true);
      return { clientName: clientName || '', reports: reportsGenerated };
    }

    setStatus('Step 11: Waiting for results…');
    await delay(4000);

    setStatus('Step 12: Reading all timesheets from table…');
    const dateCol = (typeof CENTRALREACH_SELECTORS !== 'undefined' && CENTRALREACH_SELECTORS.reportTableDateCol != null) ? CENTRALREACH_SELECTORS.reportTableDateCol : 0;
    const durationCol = (typeof CENTRALREACH_SELECTORS !== 'undefined' && CENTRALREACH_SELECTORS.reportTableDurationCol != null) ? CENTRALREACH_SELECTORS.reportTableDurationCol : 3;
    const serviceCodeCol = 9;

    results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (dateColIdx, durationColIdx, serviceCodeColIdx) => {
        const tbody = document.querySelector('#reportList') || document.querySelector('#reportTable tbody');
        if (!tbody) return { ok: false, error: 'Report table not found' };
        const trs = Array.from(tbody.querySelectorAll('tr'));
        const data = [];
        for (let i = 0; i < trs.length; i++) {
          const cells = trs[i].querySelectorAll('td');
          if (cells.length > Math.max(dateColIdx, durationColIdx)) {
            const date = (cells[dateColIdx]?.textContent || '').trim();
            const duration = (cells[durationColIdx]?.textContent || '').trim();
            const serviceCode = (cells.length > serviceCodeColIdx ? (cells[serviceCodeColIdx]?.textContent || '').trim() : '');
            if (date || duration) data.push({ date, duration, serviceCode });
          }
        }
        return { ok: true, rows: data };
      },
      args: [dateCol, durationCol, serviceCodeCol]
    });

    const allRows = results?.[0]?.result?.rows || [];
    if (allRows.length === 0) {
      setStatus('No timesheets found for this contact in the given period.', true);
      return { clientName: clientName || '', reports: [] };
    }

    for (let idx = 0; idx < SERVICE_CODES.length; idx++) {
      const code = SERVICE_CODES[idx];
      const prefixMatch = code.split(' ')[0]; // e.g., '97153' from '97153 tx'
      
      const filteredRows = allRows.filter(r => r.serviceCode && r.serviceCode.startsWith(prefixMatch));
      if (filteredRows.length === 0) continue;

      setStatus('Step 13: Generating PDF for ' + code + '…');
      const pdfOk = await runPdfExport(tab, {
        serviceCodeOverride: code,
        authorizedHoursOverride: hoursByCode[code] || 0,
        rowsOverride: filteredRows
      });

      if (pdfOk) {
        pdfCount++;
        reportsGenerated.push(code);
      }
      await delay(500);
    }

    setStatus('Done. ' + pdfCount + ' PDF(s) downloaded.');
    return { clientName: clientName || '', reports: reportsGenerated };
  } catch (e) {
    setStatus('Error: ' + (e.message || 'Failed'), true);
    return { clientName: clientName || '', reports: [] };
  }
}

document.getElementById('rbt-btn-run-main').addEventListener('click', async () => {
  if (!requireFolderChosen()) return;
  clearSaveLog();
  queueRunUsedFallback = false;
  queueRunUsedUnfound = false;
  const tab = await getActiveTab();
  if (!tab?.id) {
    setStatus('No active tab.', true);
    return;
  }
  if (reportQueue.length > 0) {
    const total = reportQueue.length;
    const queueResults = [];
    for (let i = 0; i < total; i++) {
      clearSaveDirCache();
      const item = reportQueue[0];
      if (!item) break;
      const label = '(' + (i + 1) + '/' + total + ': ' + item.name + ')';
      setStatus('Loading ' + item.name + '…');
      chrome.tabs.update(tab.id, { url: item.url });
      await rbtWaitTabComplete(tab.id, 10000);
      await new Promise(r => setTimeout(r, 2000));
      const result = await runFullReportFromContactForTab(tab, label);
      const clientName = (result?.clientName || item.name || '').trim() || item.name || 'Unknown';
      queueResults.push({ clientName, reports: result?.reports || [] });
      reportQueue.shift();
      saveQueue();
      if (reportQueue.length > 0) {
        setStatus('Next: ' + reportQueue[0].name + '…');
        await new Promise(r => setTimeout(r, 2000));
      }
    }
    showQueueSummary(queueResults);
    setStatus('Queue complete. See log for summary.');
  } else {
    if (!tab.url?.startsWith('https://members.centralreach.com') || tab.url.indexOf('contacts/details') < 0) {
      setStatus('Open a CentralReach contact page first.', true);
      return;
    }
    await runFullReportFromContactForTab(tab);
    if (queueRunUsedFallback) {
      appendLogRed('Some PDFs saved to Downloads folder (folder access had expired).');
    }
    if (queueRunUsedUnfound) {
      appendLogRed('Some clients were saved to the Unfound Clients folder (no matching client folder).');
    }
  }
});

async function runPdfExport(tab, options = {}) {
  const { serviceCodeOverride, authorizedHoursOverride, rowsOverride } = options;
  const dateCol = (typeof CENTRALREACH_SELECTORS !== 'undefined' && CENTRALREACH_SELECTORS.reportTableDateCol != null)
    ? CENTRALREACH_SELECTORS.reportTableDateCol : 0;
  const durationCol = (typeof CENTRALREACH_SELECTORS !== 'undefined' && CENTRALREACH_SELECTORS.reportTableDurationCol != null)
    ? CENTRALREACH_SELECTORS.reportTableDurationCol : 3;
  const serviceCodeCol = 9;

  try {
    let rows = [];
    if (rowsOverride) {
      rows = rowsOverride;
    } else {
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (dateColIdx, durationColIdx, serviceCodeColIdx) => {
          const tbody = document.querySelector('#reportList') || document.querySelector('#reportTable tbody');
          if (!tbody) return { ok: false, error: 'Report table not found' };
          const trs = Array.from(tbody.querySelectorAll('tr'));
          const data = [];
          for (let i = 0; i < trs.length; i++) {
            const cells = trs[i].querySelectorAll('td');
            if (cells.length > Math.max(dateColIdx, durationColIdx)) {
              const date = (cells[dateColIdx]?.textContent || '').trim();
              const duration = (cells[durationColIdx]?.textContent || '').trim();
              const serviceCode = (cells.length > serviceCodeColIdx ? (cells[serviceCodeColIdx]?.textContent || '').trim() : '');
              if (date || duration) data.push({ date, duration, serviceCode });
            }
          }
          return { ok: true, rows: data };
        },
        args: [dateCol, durationCol, serviceCodeCol]
      });

      const result = results?.[0]?.result;
      if (!result?.ok) {
        setStatus(result?.error || 'Failed to read table', true);
        return false;
      }
      rows = result.rows || [];
    }

    if (rows.length === 0) {
      setStatus('No results—skipped.');
      return true;
    }

    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
      setStatus('PDF library not loaded.', true);
      return false;
    }

    let totalMinutes = 0;
    for (let i = 0; i < rows.length; i++) {
      const d = (rows[i].duration || '').trim();
      const m = d.match(/^(\d+):(\d{2})$/);
      if (m) totalMinutes += parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
    }
    const totalHours = Math.floor(totalMinutes / 60);
    const totalMins = totalMinutes % 60;
    const totalStr = (totalHours || totalMinutes) ? (totalHours + 'hrs' + (totalMins > 0 ? ' ' + totalMins + ' mins' : '')) : '0hrs';

    const clientName = (document.getElementById('rbt-pdf-client-name')?.value || '').trim();
    const clientDOB = (document.getElementById('rbt-pdf-dob')?.value || '').trim();
    const dateFrom = (document.getElementById('rbt-run-start-date')?.value || '').trim();
    const dateTo = (document.getElementById('rbt-run-stop-date')?.value || '').trim();
    const authPeriod = (dateFrom && dateTo) ? (dateFrom + ' - ' + dateTo) : '';
    console.log('[CentralReach Helper] [DATES] PDF export — auth period from SIDEPANEL FORM (used in PDF header):', { dateFrom, dateTo, authPeriod, clientName, source: 'sidepanel form' });
    const serviceCode = (serviceCodeOverride != null ? serviceCodeOverride : (document.getElementById('rbt-run-service-code')?.value || '').trim());
    const authorizedHours = (authorizedHoursOverride != null ? authorizedHoursOverride : (() => {
      const raw = (document.getElementById('rbt-pdf-authorized-hours')?.value || '').trim();
      return raw ? parseFloat(raw) : 0;
    })());
    const totalDurationHours = totalMinutes / 60;
    const utilizationPercent = (authorizedHours > 0) ? Math.round((totalDurationHours / authorizedHours) * 1000) / 10 : 0;
    const pageW = 210;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', compress: true });
    const colW = [55, 45];
    const tableW = colW[0] + colW[1];
    const startX = (pageW - tableW) / 2;
    const logoH = 28;
    const logoMargin = 6;
    const startY = 38 + logoH + logoMargin * 2;
    const rowH = 8;
    const headerH = 10;

    /* logo skipped in Hidden Lights POEL build */

    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Authorization Utilization Report', pageW / 2, logoMargin + logoH + logoMargin + 8, { align: 'center' });
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.text('Client name: ' + clientName + '  |  DOB: ' + clientDOB + '  |  Auth period: ' + authPeriod, pageW / 2, logoMargin + logoH + logoMargin + 18, { align: 'center' });
    doc.setFont(undefined, 'bold');
    const serviceCodeDisplay = (String(serviceCode).match(/\d{5}/g) || []).join(',') || serviceCode;
    doc.text('Service code: ' + serviceCodeDisplay + ' – Authorized hours: ' + authorizedHours, pageW / 2, logoMargin + logoH + logoMargin + 26, { align: 'center' });
    doc.setFont(undefined, 'normal');

    let y = startY;
    doc.rect(startX, y, tableW, headerH);
    doc.setFont(undefined, 'bold');
    doc.text('Date', startX + 3, y + 7);
    doc.text('Duration', startX + colW[0] + 3, y + 7);
    doc.setFont(undefined, 'normal');
    doc.line(startX + colW[0], y, startX + colW[0], y + headerH);
    y += headerH;

    for (let i = 0; i < rows.length; i++) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.rect(startX, y, tableW, rowH);
      doc.line(startX + colW[0], y, startX + colW[0], y + rowH);
      doc.text((rows[i].date || '').substring(0, 18), startX + 3, y + 5.5);
      doc.text(rows[i].duration || '', startX + colW[0] + 3, y + 5.5);
      y += rowH;
    }

    y += 12;
    doc.setFont(undefined, 'bold');
    doc.text('Total: ' + totalStr, pageW / 2, y, { align: 'center' });
    doc.setFont(undefined, 'normal');
    y += 8;
    const utilLabel = authorizedHours > 0
      ? 'Utilization: ' + utilizationPercent + '% (total ' + totalStr + ' ÷ ' + authorizedHours + ' authorized hrs)'
      : 'Utilization: ' + utilizationPercent + '% (enter authorized hours to calculate)';
    doc.text(utilLabel, pageW / 2, y, { align: 'center' });
    y += 10;

    // const lowUtilThreshold = parseFloat((document.getElementById('rbt-settings-low-util-threshold')?.value || '80').trim()) || 80;
    // if (utilizationPercent < lowUtilThreshold) {
    //   doc.setTextColor(220, 53, 69);
    //   doc.setFontSize(9);
    //   const lowUtilMsg = 'Utilization was impacted by brief staffing challenges. A qualified RBT is now assigned and delivering services consistently, with no anticipated disruptions moving forward.';
    //   doc.text(lowUtilMsg, pageW / 2, y, { maxWidth: 170, align: 'center' });
    //   doc.setTextColor(0, 0, 0);
    //   doc.setFontSize(10);
    // }

    const blob = doc.output('blob');
    const ptName = (clientName || 'Pt').replace(/[/\\:*?"<>|]/g, '').trim().replace(/\s+/g, ' ') || 'Pt';
    const codeNum = (String(serviceCode).match(/\d{5}/g) || []).join(',') || 'code';
    const dateRange = (dateFrom && dateTo)
      ? (dateFrom + ' - ' + dateTo).replace(/\//g, '-')
      : new Date().toISOString().slice(0, 10);
    const baseFilename = ptName + ' ' + codeNum + ' ' + dateRange + '.pdf';

    if (!customSaveDirHandle) {
      setStatus('Choose the Clients folder above first.', true);
      return false;
    }
    try {
      appendLog('Saving PDF for: ' + (clientName || 'Pt'));
      const resolved = await getSaveDirectoryForClient(clientName || ptName);
      if (!resolved) {
        setStatus('No save folder chosen.', true);
        return false;
      }
      if (resolved.shellPath && hasShellFs()) {
        const ab = await blob.arrayBuffer();
        await window.SHELL.fsWriteFile(resolved.shellPath, baseFilename, arrayBufferToBase64(ab));
      } else if (resolved.dirHandle) {
        const fileHandle = await resolved.dirHandle.getFileHandle(baseFilename, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
      } else {
        throw new Error('No writable save path');
      }
      appendLog('Saved: ' + baseFilename + ' -> ' + resolved.logPath);
      setStatus('Exported ' + rows.length + ' rows to ' + resolved.logPath);
    } catch (e) {
      if (isFileSystemPermissionError(e)) {
        queueRunUsedFallback = true;
        appendLogRed('Folder access expired. Using Downloads folder.');
        customSaveDirHandle = null;
        if (hasShellFs()) {
          try { await window.SHELL.fsClear(); } catch (_e) { /* ignore */ }
        } else {
          await clearDirHandleFromStorage();
        }
        updateChosenFolderUIFull();
        rbtDownloadBlob(blob, baseFilename, rows.length);
      } else {
        appendLog('Save failed: ' + (e.message || 'Unknown error'));
        setStatus('Save failed: ' + (e.message || 'Unknown error'), true);
      }
    }
    savePdfFormToStorage();
    return true;
  } catch (err) {
    setStatus('Error: ' + (err.message || 'Could not export'), true);
    return false;
  }
}

function doChooseFolder() {
  return (async () => {
    setFolderStatus('Opening folder picker…', false);
    try {
      if (hasShellFs()) {
        const res = await window.SHELL.fsChooseDirectory();
        if (!res || res.cancelled) {
          setFolderStatus('Folder selection cancelled.', false);
          return;
        }
        customSaveDirHandle = { __shellFs: true, name: res.name || 'Chosen folder' };
        clearSaveDirCache();
        updateChosenFolderUIFull();
        setStatus('Clients folder chosen: ' + (res.name || 'folder') + '. Saved for next time.');
        return;
      }
      if (!('showDirectoryPicker' in self)) {
        setStatus(
          'Choose folder is not available here (sandboxed POEL panel). Reload the POEL CLIENTS extension so the shell can open the folder picker.',
          true
        );
        return;
      }
      const handle = await showDirectoryPicker({ mode: 'readwrite' });
      customSaveDirHandle = handle;
      await saveDirHandleToStorage(handle);
      clearSaveDirCache();
      updateChosenFolderUIFull();
      setStatus('Clients folder chosen. Saved for next time.');
    } catch (e) {
      if (e && e.name === 'AbortError') {
        setFolderStatus('Folder selection cancelled.', false);
        return;
      }
      const msg = (e && e.message) || 'Unknown error';
      console.error('[RBT reports] choose folder failed:', e);
      setStatus('Could not open folder: ' + msg, true);
    }
  })();
}

async function verifyDirHandle(handle) {
  try {
    for await (const _ of handle.entries()) { break; }
    return true;
  } catch (e) {
    return false;
  }
}

async function restoreDirHandle() {
  if (hasShellFs()) {
    try {
      const info = await window.SHELL.fsGetChosen();
      if (info && info.name) {
        customSaveDirHandle = { __shellFs: true, name: info.name };
        updateChosenFolderUIFull();
        setFolderStatus('Restored folder: ' + info.name, false);
        return;
      }
    } catch (e) {
      console.warn('[RBT reports] shell fsGetChosen failed:', e);
    }
  }
  const handle = await loadDirHandleFromStorage();
  if (!handle) return;
  const valid = await verifyDirHandle(handle);
  if (!valid) {
    await clearDirHandleFromStorage();
    customSaveDirHandle = null;
    updateChosenFolderUIFull();
    return;
  }
  customSaveDirHandle = handle;
  updateChosenFolderUIFull();
}

document.getElementById('rbt-btn-choose-folder').addEventListener('click', doChooseFolder);

document.getElementById('rbt-btn-show-settings').addEventListener('click', function () {
  const section = document.getElementById('rbt-settings-section');
  if (!section) return;
  const isHidden = section.style.display === 'none';
  section.style.display = isHidden ? 'block' : 'none';
  this.textContent = isHidden ? 'Hide settings' : 'Show settings';
});

['rbt-settings-low-util-threshold', 'rbt-settings-unfound-folder', 'rbt-settings-auth-selection'].forEach((id) => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('change', savePdfFormToStorage);
});

function updateChosenFolderUIFull() {
  const btn = document.getElementById('rbt-btn-choose-folder');
  if (btn) btn.textContent = customSaveDirHandle ? (customSaveDirHandle.name || 'Chosen folder') : 'Choose Clients folder';
  const visible = !!customSaveDirHandle;
  const mainContent = document.getElementById('rbt-main-content');
  if (mainContent) mainContent.style.display = visible ? 'flex' : 'none';
}

document.getElementById('rbt-btn-manual-mode').addEventListener('click', function () {
  const section = document.getElementById('rbt-manual-mode-section');
  if (!section) return;
  const isHidden = section.style.display === 'none';
  section.style.display = isHidden ? 'block' : 'none';
  this.textContent = isHidden ? 'Hide manual mode' : 'Manual mode';
});

(async function rbtBoot() {
  loadFormValues();
  loadQueue();
  await restoreDirHandle();
  updateChosenFolderUIFull();
})();


})();
