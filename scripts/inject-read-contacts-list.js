/**
 * Scrolls the CentralReach contacts AG Grid and collects unique contacts (id + name).
 * Sets window.__contactsListResult when finished.
 */
(function () {
  window.__contactsListResult = null;

  function sleep(ms) {
    return new Promise(function (r) {
      setTimeout(r, ms);
    });
  }

  function textOf(el) {
    return el ? (el.textContent || '').replace(/\s+/g, ' ').trim() : '';
  }

  function findBestViewport() {
    var viewports = Array.prototype.slice.call(document.querySelectorAll('.ag-body-viewport'));
    var best = null;
    var bestScore = -1;
    for (var i = 0; i < viewports.length; i++) {
      var vp = viewports[i];
      var root = vp.closest('.ag-root') || vp.closest('[role="grid"]') || vp;
      var rows = root.querySelectorAll('.ag-row, [role="row"].ag-row').length;
      var idCells = root.querySelectorAll('[col-id="id"]').length;
      var score = rows * 10 + idCells * 5 + (vp.scrollHeight || 0) / 1000;
      if (score > bestScore) {
        bestScore = score;
        best = vp;
      }
    }
    return best;
  }

  function collectFromDom(byId) {
    var rows = document.querySelectorAll('.ag-center-cols-container .ag-row, .ag-body-container .ag-row, .ag-row');
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var id = '';
      var name = '';
      var idCell = row.querySelector('[col-id="id"]');
      if (idCell) {
        var idLink = idCell.querySelector('a[href*="contacts/details"]');
        id = textOf(idLink || idCell).replace(/\D/g, '') || id;
        if (!id && idLink) {
          var hm = (idLink.getAttribute('href') || '').match(/[?&]id=(\d+)/);
          if (hm) id = hm[1];
        }
      }
      if (!id) {
        var preview = row.querySelector('a.vcard[data-contactid], [data-contactid]');
        if (preview) id = String(preview.getAttribute('data-contactid') || '').trim();
      }
      if (!id) {
        var anyLink = row.querySelector('a[href*="contacts/details"]');
        if (anyLink) {
          var m = (anyLink.getAttribute('href') || '').match(/[?&]id=(\d+)/);
          if (m) id = m[1];
        }
      }
      var nameCell = row.querySelector('[col-id="name"]');
      if (nameCell) {
        var strong = nameCell.querySelector('strong[title]');
        if (strong && strong.getAttribute('title')) name = strong.getAttribute('title').trim();
        if (!name) {
          var nameLink = nameCell.querySelector('a.overflow-hidden, a[href*="contacts/details"]');
          name = textOf(nameLink || nameCell);
        }
      }
      name = name.replace(/\s*Preview\s*$/i, '').trim();
      if (!id || !/^\d+$/.test(id)) continue;
      if (!byId[id]) byId[id] = { id: id, name: name || ('Contact ' + id) };
      else if (name && (!byId[id].name || byId[id].name.indexOf('Contact ') === 0)) byId[id].name = name;
    }
  }

  async function run() {
    try {
      var vp = null;
      var waited = 0;
      while (waited < 20000) {
        vp = findBestViewport();
        if (vp && (vp.querySelector('.ag-row') || document.querySelector('[col-id="id"]'))) break;
        await sleep(400);
        waited += 400;
      }
      if (!vp) {
        window.__contactsListResult = {
          success: false,
          error: 'Contacts grid not found. Open the BCBA contacts list first.',
          contacts: []
        };
        return;
      }

      var byId = {};
      vp.scrollTop = 0;
      await sleep(250);
      collectFromDom(byId);

      var stableRounds = 0;
      var lastCount = Object.keys(byId).length;
      var guard = 0;
      while (guard < 80) {
        guard++;
        var before = vp.scrollTop;
        var step = Math.max(120, Math.floor((vp.clientHeight || 400) * 0.85));
        vp.scrollTop = Math.min(vp.scrollTop + step, vp.scrollHeight);
        await sleep(280);
        collectFromDom(byId);
        var count = Object.keys(byId).length;
        var atEnd = vp.scrollTop + vp.clientHeight >= vp.scrollHeight - 4;
        var noMove = vp.scrollTop === before;
        if (count === lastCount) stableRounds++;
        else {
          stableRounds = 0;
          lastCount = count;
        }
        if ((atEnd || noMove) && stableRounds >= 3) break;
      }

      var contacts = Object.keys(byId)
        .sort(function (a, b) {
          return Number(a) - Number(b);
        })
        .map(function (k) {
          return byId[k];
        });

      window.__contactsListResult = {
        success: true,
        contacts: contacts,
        count: contacts.length
      };
    } catch (e) {
      window.__contactsListResult = {
        success: false,
        error: (e && e.message) || String(e),
        contacts: []
      };
    }
  }

  run();
})();
