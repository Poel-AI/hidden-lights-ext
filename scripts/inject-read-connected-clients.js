/**
 * Scrolls the connected-clients AG Grid and collects unique clients.
 * Expects rows like: "Abanum, Jayden (ID: 4938281)" in col-id="clientName".
 * Sets window.__connectedClientsResult when finished.
 */
(function () {
  window.__connectedClientsResult = null;

  function sleep(ms) {
    return new Promise(function (r) {
      setTimeout(r, ms);
    });
  }

  function textOf(el) {
    return el ? (el.textContent || '').replace(/\s+/g, ' ').trim() : '';
  }

  function findClientsViewport() {
    var viewports = Array.prototype.slice.call(document.querySelectorAll('.ag-body-viewport'));
    var best = null;
    var bestScore = -1;
    for (var i = 0; i < viewports.length; i++) {
      var vp = viewports[i];
      var root = vp.closest('.ag-root') || vp.closest('[role="grid"]') || vp;
      var clientCells = root.querySelectorAll('[col-id="clientName"]').length;
      var aria = parseInt(root.getAttribute('aria-rowcount') || '0', 10) || 0;
      var score = clientCells * 20 + aria;
      if (score > bestScore) {
        bestScore = score;
        best = vp;
      }
    }
    if (best) return best;
    return document.querySelector('.ag-body-viewport');
  }

  function parseClientName(raw) {
    var t = (raw || '').trim();
    var m = t.match(/^(.*?)\s*\(ID:\s*(\d+)\s*\)\s*$/i);
    if (m) return { name: m[1].trim(), id: m[2] };
    var m2 = t.match(/ID:\s*(\d+)/i);
    if (m2) return { name: t.replace(/\(ID:\s*\d+\s*\)/i, '').trim(), id: m2[1] };
    return { name: t, id: '' };
  }

  function collectFromDom(byId) {
    var rows = document.querySelectorAll('.ag-center-cols-container .ag-row, .ag-body-container .ag-row, .ag-row');
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var nameCell = row.querySelector('[col-id="clientName"]');
      if (!nameCell) continue;
      var parsed = parseClientName(textOf(nameCell));
      if (!parsed.id) continue;
      var type = textOf(row.querySelector('[col-id="type"]'));
      var status = textOf(row.querySelector('[col-id="status"]'));
      if (!byId[parsed.id]) {
        byId[parsed.id] = {
          id: parsed.id,
          name: parsed.name || ('Client ' + parsed.id),
          type: type || '',
          status: status || ''
        };
      }
    }
  }

  function expectedRowCount(vp) {
    var root = vp && (vp.closest('.ag-root') || vp.closest('[role="grid"]'));
    if (!root) return 0;
    return parseInt(root.getAttribute('aria-rowcount') || '0', 10) || 0;
  }

  async function run() {
    try {
      var vp = null;
      var waited = 0;
      while (waited < 25000) {
        vp = findClientsViewport();
        if (vp && document.querySelector('[col-id="clientName"].ag-cell')) break;
        await sleep(400);
        waited += 400;
      }
      if (!vp) {
        window.__connectedClientsResult = {
          success: false,
          error: 'Connected clients grid not found.',
          clients: []
        };
        return;
      }

      var byId = {};
      vp.scrollTop = 0;
      await sleep(300);
      collectFromDom(byId);

      var expected = expectedRowCount(vp);
      var stableRounds = 0;
      var lastCount = Object.keys(byId).length;
      var guard = 0;
      while (guard < 200) {
        guard++;
        var before = vp.scrollTop;
        var step = Math.max(100, Math.floor((vp.clientHeight || 400) * 0.8));
        vp.scrollTop = Math.min(vp.scrollTop + step, vp.scrollHeight);
        await sleep(220);
        collectFromDom(byId);
        var count = Object.keys(byId).length;
        var atEnd = vp.scrollTop + vp.clientHeight >= vp.scrollHeight - 4;
        var noMove = vp.scrollTop === before;
        if (count === lastCount) stableRounds++;
        else {
          stableRounds = 0;
          lastCount = count;
        }
        if (expected > 1 && count >= expected - 1 && stableRounds >= 2) break;
        if ((atEnd || noMove) && stableRounds >= 4) break;
      }

      var clients = Object.keys(byId)
        .sort(function (a, b) {
          return Number(a) - Number(b);
        })
        .map(function (k) {
          return byId[k];
        });

      window.__connectedClientsResult = {
        success: true,
        clients: clients,
        count: clients.length,
        expectedRowCount: expected
      };
    } catch (e) {
      window.__connectedClientsResult = {
        success: false,
        error: (e && e.message) || String(e),
        clients: []
      };
    }
  }

  run();
})();
