/**
 * Injected into the timesheet editor page. Can run as one flow or per-step (window.__setDateStep).
 * Step 1: click date input. Step 2: type date. Step 3: click day in calendar.
 * Result: window.__setDateOfServiceResult = { success, dateSet, error? }
 * Expects: window.__dateOfServiceValue = "MM/DD/YYYY", optional window.__setDateStep = 1|2|3.
 *
 * Default flow: focus field, simulate typing each character (keydown/keypress/input/keyup)
 * so jQuery UI datepicker updates to the correct month like a human, then poll and click the day.
 */
(function () {
  const step = window.__setDateStep;
  const dateStr = typeof window.__dateOfServiceValue === 'string' && window.__dateOfServiceValue
    ? window.__dateOfServiceValue
    : (function () {
        const d = new Date();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const y = d.getFullYear();
        return m + '/' + day + '/' + y;
      })();

  const parts = dateStr.split('/');
  const month1 = parts.length >= 1 ? parseInt(parts[0], 10) : new Date().getMonth() + 1;
  const day = parts.length >= 2 ? parseInt(parts[1], 10) : new Date().getDate();
  const year = parts.length >= 3 ? parseInt(parts[2], 10) : new Date().getFullYear();
  const month0 = month1 - 1;

  /** ms between each typed character (datepicker often keys off keydown). */
  const TYPE_CHAR_DELAY_MS = 48;
  /** First wait after last keystroke before looking for the day cell. */
  const AFTER_TYPE_INITIAL_WAIT_MS = 420;
  /** Retries if calendar/month is still catching up. */
  const CLICK_DAY_MAX_ATTEMPTS = 14;
  const CLICK_DAY_RETRY_MS = 130;

  function findDateOfServiceInput() {
    const byId = document.getElementById('dateOfService');
    if (byId && (byId.tagName === 'INPUT' || byId.tagName === 'input')) return byId;
    const byName = document.querySelector('input[name="dateOfService"]');
    if (byName) return byName;
    const byIdAny = document.querySelector('input#dateOfService');
    if (byIdAny) return byIdAny;
    const labels = document.querySelectorAll('label.control-label, label');
    for (const label of labels) {
      if (label.textContent.trim().toLowerCase().indexOf('date of service') !== -1) {
        const group = label.closest('.form-group') || label.closest('div');
        if (group) {
          const input = group.querySelector('input[type="text"], input');
          if (input) return input;
        }
      }
    }
    const byClass = document.querySelector('input.hasDatepicker');
    if (byClass) return byClass;
    try {
      const result = document.evaluate("//input[@id='dateOfService']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      const el = result.singleNodeValue;
      if (el) return el;
    } catch (e) {}
    return null;
  }

  function setNativeInputValue(input, value) {
    const proto = Object.getPrototypeOf(input);
    const descriptor = Object.getOwnPropertyDescriptor(proto, 'value');
    if (descriptor && descriptor.set) {
      descriptor.set.call(input, value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function charToKeyCode(ch) {
    if (ch >= '0' && ch <= '9') return ch.charCodeAt(0);
    if (ch === '/') return 191;
    return 0;
  }

  /** One keystroke: keydown/keypress → append char → input → keyup (matches human + jQuery UI). */
  function typeOneChar(input, ch) {
    const keyCode = charToKeyCode(ch);
    const keInit = { key: ch, bubbles: true, cancelable: true };
    if (keyCode) {
      keInit.keyCode = keyCode;
      keInit.which = keyCode;
    }
    input.dispatchEvent(new KeyboardEvent('keydown', keInit));
    input.dispatchEvent(new KeyboardEvent('keypress', keInit));
    const proto = Object.getPrototypeOf(input);
    const descriptor = Object.getOwnPropertyDescriptor(proto, 'value');
    const next = input.value + ch;
    if (descriptor && descriptor.set) {
      descriptor.set.call(input, next);
    } else {
      input.value = next;
    }
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keyup', keInit));
  }

  /**
   * Clear field, then type fullDateStr one character at a time, then run onDone().
   */
  function typeDateLikeHuman(input, fullDateStr, onDone) {
    setNativeInputValue(input, '');
    input.focus();
    var i = 0;
    function tick() {
      if (i >= fullDateStr.length) {
        onDone();
        return;
      }
      typeOneChar(input, fullDateStr.charAt(i));
      i += 1;
      setTimeout(tick, TYPE_CHAR_DELAY_MS);
    }
    setTimeout(tick, 40);
  }

  /** Find the visible jQuery UI datepicker calendar. */
  function findDatepickerDiv() {
    const byId = document.getElementById('ui-datepicker-div');
    if (byId && byId.offsetParent !== null) return byId;
    const byClass = document.querySelector('.ui-datepicker.ui-widget');
    if (byClass) return byClass;
    return document.getElementById('ui-datepicker-div');
  }

  /** Find the <a> for the given day in the calendar (data-date, data-month 0-indexed, data-year on td). */
  function findDayLink(pickerDiv, dayNum, month0Index, yearNum) {
    const tds = pickerDiv.querySelectorAll('td[data-handler="selectDay"][data-month][data-year]');
    for (let i = 0; i < tds.length; i++) {
      const td = tds[i];
      if (td.classList.contains('ui-datepicker-unselectable')) continue;
      const m = td.getAttribute('data-month');
      const y = td.getAttribute('data-year');
      if (String(m) !== String(month0Index) || String(y) !== String(yearNum)) continue;
      const a = td.querySelector('a[data-date]');
      if (a && String(a.getAttribute('data-date')) === String(dayNum)) return a;
    }
    const links = pickerDiv.querySelectorAll('a.ui-state-default[data-date]');
    for (let j = 0; j < links.length; j++) {
      const a = links[j];
      const td = a.closest('td');
      if (!td || td.classList.contains('ui-datepicker-unselectable')) continue;
      if (String(a.getAttribute('data-date')) === String(dayNum) &&
          String(td.getAttribute('data-month')) === String(month0Index) &&
          String(td.getAttribute('data-year')) === String(yearNum)) return a;
    }
    return null;
  }

  function humanClick(el) {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const opts = { bubbles: true, cancelable: true, view: window, clientX: x, clientY: y };
    el.dispatchEvent(new MouseEvent('mousedown', opts));
    el.dispatchEvent(new MouseEvent('mouseup', opts));
    el.dispatchEvent(new MouseEvent('click', opts));
  }

  /** Simulate clicking the input as if the user is about to type: focus, focus events, then full mouse sequence. */
  function focusAndClickInput(inputEl) {
    if (!inputEl) return;
    inputEl.scrollIntoView({ block: 'nearest', behavior: 'auto' });
    inputEl.focus();
    inputEl.dispatchEvent(new Event('focus', { bubbles: false }));
    inputEl.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    var rect = inputEl.getBoundingClientRect();
    var x = rect.left + rect.width / 2;
    var y = rect.top + rect.height / 2;
    var base = { view: window, bubbles: true, cancelable: true, clientX: x, clientY: y, button: 0, buttons: 1, detail: 1 };
    inputEl.dispatchEvent(new MouseEvent('mousedown', Object.assign({}, base, { buttons: 1 })));
    inputEl.dispatchEvent(new MouseEvent('mouseup', Object.assign({}, base, { buttons: 0 })));
    inputEl.dispatchEvent(new MouseEvent('click', Object.assign({}, base, { detail: 1 })));
  }

  function scheduleClickDay(attempt) {
    var delay = attempt === 0 ? AFTER_TYPE_INITIAL_WAIT_MS : CLICK_DAY_RETRY_MS;
    setTimeout(function () {
      try {
        var pickerDiv = findDatepickerDiv();
        if (!pickerDiv) {
          if (attempt + 1 < CLICK_DAY_MAX_ATTEMPTS) {
            scheduleClickDay(attempt + 1);
            return;
          }
          window.__setDateOfServiceResult = { success: false, dateSet: dateStr, error: 'Calendar did not open. Try again.' };
          return;
        }
        var dayLink = findDayLink(pickerDiv, day, month0, year);
        if (dayLink) {
          humanClick(dayLink);
          window.__setDateOfServiceResult = { success: true, dateSet: dateStr };
          return;
        }
        if (attempt + 1 < CLICK_DAY_MAX_ATTEMPTS) {
          scheduleClickDay(attempt + 1);
          return;
        }
        window.__setDateOfServiceResult = { success: false, dateSet: dateStr, error: 'Day ' + day + ' not found in calendar. Change month if needed.' };
      } catch (e) {
        window.__setDateOfServiceResult = { success: false, dateSet: dateStr, error: e.message || 'Failed to click date.' };
      }
    }, delay);
  }

  const input = findDateOfServiceInput();
  if (!input) {
    window.__setDateOfServiceResult = { success: false, dateSet: dateStr, error: 'Date of service input not found. Open a timesheet editor first.' };
    return;
  }

  if (step === 1) {
    focusAndClickInput(input);
    window.__setDateOfServiceResult = { success: true, dateSet: dateStr };
    return;
  }

  if (step === 2) {
    setNativeInputValue(input, dateStr);
    if (input.value !== dateStr) input.value = dateStr;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    window.__setDateOfServiceResult = { success: true, dateSet: dateStr };
    return;
  }

  if (step === 3) {
    try {
      const pickerDiv = findDatepickerDiv();
      if (!pickerDiv) {
        window.__setDateOfServiceResult = { success: false, dateSet: dateStr, error: 'Calendar not visible. Run 1 then 2 first.' };
        return;
      }
      const dayLink = findDayLink(pickerDiv, day, month0, year);
      if (!dayLink) {
        window.__setDateOfServiceResult = { success: false, dateSet: dateStr, error: 'Day ' + day + ' not found in calendar.' };
        return;
      }
      humanClick(dayLink);
      window.__setDateOfServiceResult = { success: true, dateSet: dateStr };
    } catch (e) {
      window.__setDateOfServiceResult = { success: false, dateSet: dateStr, error: e.message || 'Failed to click date.' };
    }
    return;
  }

  focusAndClickInput(input);
  typeDateLikeHuman(input, dateStr, function () {
    scheduleClickDay(0);
  });
})();
