/**
 * Scrapes the contact-details "Appointments" dashboard widget (Upcoming tab).
 * Includes hidden items under .module-items .item.
 * Sets window.__upcomingAppointmentsResult when finished.
 */
(function () {
  window.__upcomingAppointmentsResult = null;

  function sleep(ms) {
    return new Promise(function (r) {
      setTimeout(r, ms);
    });
  }

  function textOf(el) {
    return el ? (el.textContent || '').replace(/\s+/g, ' ').trim() : '';
  }

  function moduleRootFromTitle(titleEl) {
    if (!titleEl) return null;
    return (
      titleEl.closest('.relative') ||
      titleEl.closest('.white-basic') ||
      titleEl.closest('[class*="module"]') ||
      titleEl.parentElement
    );
  }

  function upcomingIsSelected(root) {
    if (!root) return false;
    var nodes = root.querySelectorAll('a, button, span, li, .nav-tabs a, .btn, [role="tab"]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var t = textOf(el);
      if (!/^upcoming$/i.test(t) && t.toLowerCase().indexOf('upcoming') < 0) continue;
      if (t.toLowerCase().indexOf('appointments') >= 0) continue;
      var cls = (el.className && String(el.className)) || '';
      var aria = (el.getAttribute && el.getAttribute('aria-selected')) || '';
      var parent = el.parentElement;
      var parentCls = (parent && parent.className && String(parent.className)) || '';
      if (
        /\bactive\b/i.test(cls) ||
        /\bselected\b/i.test(cls) ||
        aria === 'true' ||
        /\bactive\b/i.test(parentCls)
      ) {
        return true;
      }
    }
    return false;
  }

  function findAppointmentsModule() {
    var titles = Array.prototype.slice.call(document.querySelectorAll('.module-title, .module-header, h3, h4'));
    var candidates = [];
    for (var i = 0; i < titles.length; i++) {
      var titleEl = titles[i];
      var titleText = textOf(titleEl);
      if (!/appointments/i.test(titleText)) continue;
      var root = moduleRootFromTitle(titleEl);
      if (!root) continue;
      var items = root.querySelectorAll('.module-items .item, .module-items a.item');
      candidates.push({
        titleEl: titleEl,
        root: root,
        titleText: titleText,
        upcoming: upcomingIsSelected(root) || /upcoming/i.test(titleText),
        itemCount: items.length
      });
    }
    if (!candidates.length) return null;
    candidates.sort(function (a, b) {
      if (a.upcoming !== b.upcoming) return a.upcoming ? -1 : 1;
      return b.itemCount - a.itemCount;
    });
    return candidates[0];
  }

  function clickUpcomingIfNeeded(root) {
    if (!root || upcomingIsSelected(root)) return false;
    var nodes = root.querySelectorAll('a, button, span, li, .nav-tabs a, .btn, [role="tab"]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var t = textOf(el);
      if (!/^upcoming$/i.test(t) && t !== 'Upcoming') continue;
      try {
        el.click();
        return true;
      } catch (e) {
        /* ignore */
      }
    }
    return false;
  }

  function parseIdsFromHref(href) {
    var out = { eventId: '', providerId: '', href: href || '' };
    if (!href) return out;
    var em = href.match(/[?&#]eventId=(\d+)/i) || href.match(/eventId[=:](\d+)/i);
    var pm = href.match(/[?&#]providerId=(\d+)/i) || href.match(/providerId[=:](\d+)/i);
    if (em) out.eventId = em[1];
    if (pm) out.providerId = pm[1];
    return out;
  }

  function isMuted(el) {
    if (!el) return false;
    var cls = (el.className && String(el.className)) || '';
    if (/\b(text-muted|muted|text-secondary|gray|grey)\b/i.test(cls)) return true;
    var style = window.getComputedStyle ? window.getComputedStyle(el) : null;
    if (!style) return false;
    var color = (style.color || '').toLowerCase();
    return (
      color.indexOf('128') >= 0 ||
      color.indexOf('153') >= 0 ||
      color.indexOf('148') >= 0 ||
      color === 'gray' ||
      color === 'grey'
    );
  }

  function looksLikeTime(t) {
    return (
      /\b(mon|tue|wed|thu|fri|sat|sun)\b/i.test(t) ||
      /\d{1,2}\s*[ap]m?\b/i.test(t) ||
      /\d{1,2}:\d{2}/.test(t) ||
      /\d{1,2}[ap]-\d{1,2}[ap]/i.test(t)
    );
  }

  function looksLikeServiceType(t) {
    return /direct services|supervision|parent training|assessment|consult|group|indirect|caregiver|family|therapy/i.test(
      t
    );
  }

  function parseItem(item) {
    var href = '';
    var link =
      item.tagName === 'A'
        ? item
        : item.querySelector('a[href*="eventId"], a[href*="timesheet"], a[href*="providerId"], a[href]');
    if (link) href = link.getAttribute('href') || '';
    var ids = parseIdsFromHref(href);

    var spans = Array.prototype.slice.call(item.querySelectorAll('span'));
    var texts = [];
    for (var i = 0; i < spans.length; i++) {
      var s = textOf(spans[i]);
      if (!s) continue;
      // Prefer leaf-ish text; skip wrapping parents that duplicate children.
      if (spans[i].querySelector('span') && textOf(spans[i]).length > 80) continue;
      texts.push({ el: spans[i], text: s, muted: isMuted(spans[i]) });
    }
    if (!texts.length) {
      var raw = textOf(item);
      if (raw) texts.push({ el: item, text: raw, muted: false });
    }

    var time = '';
    var provider = '';
    var address = '';
    var serviceType = '';

    for (var t = 0; t < texts.length; t++) {
      var entry = texts[t];
      if (!time && looksLikeTime(entry.text)) {
        time = entry.text;
        continue;
      }
      if ((entry.muted || looksLikeServiceType(entry.text)) && !serviceType) {
        serviceType = entry.text;
        continue;
      }
    }

    for (var u = 0; u < texts.length; u++) {
      var e2 = texts[u];
      if (e2.text === time || e2.text === serviceType) continue;
      if (!provider && !looksLikeTime(e2.text) && !looksLikeServiceType(e2.text) && e2.text.length < 80) {
        // Address-ish lines tend to have commas / numbers; pick name before address.
        if (/\d/.test(e2.text) && /[,#]/.test(e2.text) && provider) {
          if (!address) address = e2.text;
          continue;
        }
        if (!provider) {
          provider = e2.text;
          continue;
        }
        if (!address) {
          address = e2.text;
          continue;
        }
      } else if (!address && provider && e2.text !== provider) {
        address = e2.text;
      }
    }

    if (!time && texts[0]) time = texts[0].text;
    if (!provider && texts[1]) provider = texts[1].text;

    return {
      time: time,
      provider: provider,
      address: address,
      serviceType: serviceType,
      eventId: ids.eventId,
      providerId: ids.providerId,
      href: ids.href,
      hidden: !!(item.classList && item.classList.contains('hidden')) || /\bhidden\b/i.test(item.className || ''),
      rawText: textOf(item)
    };
  }

  function collectAppointments(root) {
    var items = root.querySelectorAll('.module-items .item, .module-items a.item');
    var out = [];
    var seen = {};
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var parsed = parseItem(item);
      var key =
        (parsed.eventId || '') +
        '|' +
        (parsed.time || '') +
        '|' +
        (parsed.provider || '') +
        '|' +
        (parsed.rawText || '');
      if (seen[key]) continue;
      seen[key] = true;
      out.push(parsed);
    }
    return out;
  }

  async function run() {
    try {
      var waited = 0;
      var found = null;
      while (waited < 20000) {
        found = findAppointmentsModule();
        if (found && found.root) break;
        await sleep(400);
        waited += 400;
      }
      if (!found || !found.root) {
        window.__upcomingAppointmentsResult = {
          success: false,
          error: 'Appointments widget not found on this contact page.',
          appointments: []
        };
        return;
      }

      if (clickUpcomingIfNeeded(found.root)) {
        await sleep(600);
        found = findAppointmentsModule() || found;
      }

      // Extra settle for dashboard widgets that lazy-load.
      await sleep(400);
      var appointments = collectAppointments(found.root);
      window.__upcomingAppointmentsResult = {
        success: true,
        appointments: appointments,
        count: appointments.length,
        widgetTitle: found.titleText || 'Appointments',
        upcomingSelected: !!(found.upcoming || upcomingIsSelected(found.root))
      };
    } catch (e) {
      window.__upcomingAppointmentsResult = {
        success: false,
        error: (e && e.message) || String(e),
        appointments: []
      };
    }
  }

  run();
})();
