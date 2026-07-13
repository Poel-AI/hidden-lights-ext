/**
 * Injected into the timesheet page. Fills Time Worked From and Time To,
 * then dispatches Enter in each field.
 * After To, blurs To and refocuses From so the timesheet commits the end time (manual tab-out).
 *
 * Modes
 * -----
 * • Manual / demo: set window.__enterTimesAllowDefaults = true before inject. Then optional
 *   __enterTimesFrom / __enterTimesTo; missing pieces default to 02:00 PM / 03:30 PM.
 * • Overlap / automation: do NOT set allowDefaults (or set false). Both times must be set;
 *   otherwise the script fails — it will NOT silently apply 02:00/03:30 (that was a common bug).
 *
 * Retries finding inputs every 200ms for up to 8s (line 3 often mounts after service-code clicks).
 * Result: window.__enterTimesResult = { success, error?, wasFrom?, wasTo? }
 */
(function () {
  window.__enterTimesResult = null;
  var allowDefaults = window.__enterTimesAllowDefaults === true;
  if (allowDefaults) {
    delete window.__enterTimesAllowDefaults;
  }

  var TIME_FROM;
  var TIME_TO;
  if (allowDefaults) {
    TIME_FROM =
      typeof window.__enterTimesFrom === 'string' && window.__enterTimesFrom.trim()
        ? window.__enterTimesFrom.trim()
        : '02:00 PM';
    TIME_TO =
      typeof window.__enterTimesTo === 'string' && window.__enterTimesTo.trim()
        ? window.__enterTimesTo.trim()
        : '03:30 PM';
  } else {
    if (
      typeof window.__enterTimesFrom !== 'string' ||
      !String(window.__enterTimesFrom).trim() ||
      typeof window.__enterTimesTo !== 'string' ||
      !String(window.__enterTimesTo).trim()
    ) {
      window.__enterTimesResult = {
        success: false,
        error:
          'Explicit Time From and Time To are required (automation mode). Refusing default 02:00 PM / 03:30 PM.'
      };
      return;
    }
    TIME_FROM = String(window.__enterTimesFrom).trim();
    TIME_TO = String(window.__enterTimesTo).trim();
  }
  if (window.__enterTimesFrom !== undefined) delete window.__enterTimesFrom;
  if (window.__enterTimesTo !== undefined) delete window.__enterTimesTo;

  var POLL_MS = 200;
  var MAX_WAIT_MS = 8000;
  var DELAY_AFTER_FROM_MS = 180;
  /** After To + Enter: refocus From so the editor commits To (same as manual tab-out). */
  var DELAY_AFTER_TO_MS = 160;

  function findInput(id, placeholder) {
    var el = document.getElementById(id);
    if (el && (el.tagName === 'INPUT' || el.tagName === 'input')) return el;
    var inputs = document.querySelectorAll('input[placeholder="' + placeholder + '"], input[placeholder*="' + placeholder.replace(/\s+/g, '') + '"]');
    for (var i = 0; i < inputs.length; i++) if (inputs[i].id === id || !document.getElementById(id)) return inputs[i];
    var labels = document.querySelectorAll('label.control-label, label');
    for (var j = 0; j < labels.length; j++) {
      if ((labels[j].textContent || '').toLowerCase().indexOf('time worked') !== -1) {
        var group = labels[j].closest('.form-group') || labels[j].closest('div');
        if (group) {
          var fromInput = group.querySelector('input#timeWorkedFrom, input[placeholder*="From"]');
          var toInput = group.querySelector('input#timeWorkedTo, input[placeholder*="To"]');
          if (id === 'timeWorkedFrom' && fromInput) return fromInput;
          if (id === 'timeWorkedTo' && toInput) return toInput;
        }
      }
    }
    return document.getElementById(id);
  }

  function setValueAndEnter(input, value) {
    if (!input) return false;
    input.focus();
    input.dispatchEvent(new Event('focus', { bubbles: false }));
    var proto = Object.getPrototypeOf(input);
    var desc = Object.getOwnPropertyDescriptor(proto, 'value');
    if (desc && desc.set) {
      desc.set.call(input, value);
    } else {
      input.value = value;
    }
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    var opts = { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true, view: window };
    input.dispatchEvent(new KeyboardEvent('keydown', opts));
    input.dispatchEvent(new KeyboardEvent('keypress', Object.assign({}, opts, { charCode: 13 })));
    input.dispatchEvent(new KeyboardEvent('keyup', opts));
    return true;
  }

  function normalizeTime(s) {
    if (!s || typeof s !== 'string') return '';
    return s.trim().toLowerCase().replace(/\s+/g, ' ').replace(/^0(\d:)/, '$1');
  }

  function timesMatchInputs(fromInput, toInput) {
    if (!fromInput || !toInput) return false;
    return (
      normalizeTime(fromInput.value || '') === normalizeTime(TIME_FROM) &&
      normalizeTime(toInput.value || '') === normalizeTime(TIME_TO)
    );
  }

  function done(result) {
    window.__enterTimesResult = result;
  }

  var start = Date.now();

  function tryOnce() {
    var fromInput = findInput('timeWorkedFrom', 'Time From');
    var toInput = findInput('timeWorkedTo', 'Time To');
    if (!fromInput || !toInput) {
      if (Date.now() - start >= MAX_WAIT_MS) {
        var which = !fromInput && !toInput ? 'Time From and Time To inputs' : (!fromInput ? 'Time From input' : 'Time To input');
        done({ success: false, error: which + ' not found after ' + MAX_WAIT_MS / 1000 + 's.' });
        return;
      }
      setTimeout(tryOnce, POLL_MS);
      return;
    }
    var wasFrom = (fromInput.value || '').trim() || '(empty)';
    var wasTo = (toInput.value || '').trim() || '(empty)';
    try {
      setValueAndEnter(fromInput, TIME_FROM);
      fromInput.blur();
      fromInput.dispatchEvent(new Event('blur', { bubbles: true }));
      setTimeout(function () {
        try {
          setValueAndEnter(toInput, TIME_TO);
          toInput.blur();
          toInput.dispatchEvent(new Event('blur', { bubbles: true }));
          setTimeout(function () {
            try {
              fromInput.focus();
              fromInput.dispatchEvent(new Event('focus', { bubbles: false }));
              fromInput.blur();
              fromInput.dispatchEvent(new Event('blur', { bubbles: true }));
              var verifyAttempt = 0;
              var verifyMax = 12;
              var verifyStepMs = 200;
              function finishIfVerified() {
                var gotFrom = (fromInput.value || '').trim() || '(empty)';
                var gotTo = (toInput.value || '').trim() || '(empty)';
                if (timesMatchInputs(fromInput, toInput)) {
                  done({ success: true, wasFrom: wasFrom, wasTo: wasTo, gotFrom: gotFrom, gotTo: gotTo });
                  return;
                }
                verifyAttempt += 1;
                if (verifyAttempt >= verifyMax) {
                  done({
                    success: false,
                    error:
                      'Times did not read back correctly after entry (expected ' +
                      TIME_FROM +
                      ' – ' +
                      TIME_TO +
                      ', got ' +
                      gotFrom +
                      ' – ' +
                      gotTo +
                      ').',
                    wasFrom: wasFrom,
                    wasTo: wasTo,
                    gotFrom: gotFrom,
                    gotTo: gotTo
                  });
                  return;
                }
                setTimeout(finishIfVerified, verifyStepMs);
              }
              finishIfVerified();
            } catch (e3) {
              done({
                success: false,
                error: e3.message || 'Failed to commit end time (refocus From).',
                wasFrom: wasFrom,
                wasTo: wasTo
              });
            }
          }, DELAY_AFTER_TO_MS);
        } catch (e2) {
          done({ success: false, error: e2.message || 'Failed to set end time.', wasFrom: wasFrom, wasTo: wasTo });
        }
      }, DELAY_AFTER_FROM_MS);
    } catch (e) {
      done({ success: false, error: e.message || 'Failed to set times.', wasFrom: wasFrom, wasTo: wasTo });
    }
  }

  tryOnce();
})();
