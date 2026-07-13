/**
 * Injected on the timesheet editor. Selects a timezone in #timesheetTimeZone (MUI native select).
 *
 * Priority:
 * 1) If window.__timesheetTimezoneValue is a non-empty string, select that exact option value (IANA id).
 * 2) Else: window.__timesheetTimezoneMatch substring (case-insensitive) on option text+value; default "alaska".
 *
 * Result: window.__setTimesheetTimezoneResult = { success, value?, label?, match?, mode?, error? }
 * mode: "value" | "substring"
 */
(function () {
  window.__setTimesheetTimezoneResult = null;

  var select = document.getElementById('timesheetTimeZone');
  if (!select || select.tagName !== 'SELECT') {
    window.__setTimesheetTimezoneResult = {
      success: false,
      error: 'Timesheet timezone control (#timesheetTimeZone) not found. Open the timesheet editor with the timezone dropdown visible.'
    };
    return;
  }

  function applySelection(chosen, mode, extra) {
    try {
      select.focus();
      select.value = chosen.value;
      select.dispatchEvent(new Event('input', { bubbles: true }));
      select.dispatchEvent(new Event('change', { bubbles: true }));
      try {
        select.dispatchEvent(new Event('blur', { bubbles: true }));
      } catch (e0) {}

      var out = {
        success: true,
        value: chosen.value,
        label: (chosen.textContent || chosen.text || '').trim(),
        mode: mode
      };
      if (extra) {
        for (var k in extra) {
          if (Object.prototype.hasOwnProperty.call(extra, k)) out[k] = extra[k];
        }
      }
      window.__setTimesheetTimezoneResult = out;
    } catch (e) {
      window.__setTimesheetTimezoneResult = {
        success: false,
        mode: mode,
        error: e.message || 'Failed to set timezone.'
      };
    }
  }

  var exactValue =
    typeof window.__timesheetTimezoneValue === 'string' ? window.__timesheetTimezoneValue.trim() : '';
  if (exactValue) {
    delete window.__timesheetTimezoneValue;
    var optsExact = select.querySelectorAll('option');
    var j;
    var foundExact = null;
    for (j = 0; j < optsExact.length; j++) {
      if ((optsExact[j].value || '') === exactValue) {
        foundExact = optsExact[j];
        break;
      }
    }
    if (!foundExact) {
      window.__setTimesheetTimezoneResult = {
        success: false,
        mode: 'value',
        error: 'No timezone option with value "' + exactValue + '".'
      };
      return;
    }
    applySelection(foundExact, 'value', { match: exactValue });
    return;
  }

  var raw =
    typeof window.__timesheetTimezoneMatch === 'string' && window.__timesheetTimezoneMatch.trim()
      ? window.__timesheetTimezoneMatch.trim()
      : 'alaska';
  var matchLower = raw.toLowerCase();
  if (window.__timesheetTimezoneMatch !== undefined) delete window.__timesheetTimezoneMatch;

  var opts = select.querySelectorAll('option');
  var i;
  var chosen = null;
  for (i = 0; i < opts.length; i++) {
    var opt = opts[i];
    var label = ((opt.textContent || opt.text || '') + ' ' + (opt.value || '')).toLowerCase();
    if (label.indexOf(matchLower) !== -1) {
      chosen = opt;
      break;
    }
  }

  if (!chosen) {
    window.__setTimesheetTimezoneResult = {
      success: false,
      mode: 'substring',
      match: raw,
      error: 'No timezone option contains "' + raw + '".'
    };
    return;
  }

  applySelection(chosen, 'substring', { match: raw });
})();
