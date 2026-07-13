/**
 * Read current Time Worked From / To on the active timesheet line (same discovery as inject-enter-times).
 * Result: window.__readTimeWorkedResult = { from: string|null, to: string|null, error?: string }
 */
(function () {
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

  var fromInput = document.getElementById('timeWorkedFrom');
  var toInput = document.getElementById('timeWorkedTo');
  if (!fromInput || !toInput || fromInput.tagName !== 'INPUT' || toInput.tagName !== 'INPUT') {
    fromInput = findInput('timeWorkedFrom', 'Time From');
    toInput = findInput('timeWorkedTo', 'Time To');
  }
  if (!fromInput || !toInput) {
    window.__readTimeWorkedResult = {
      from: null,
      to: null,
      error: !fromInput && !toInput ? 'Time From and Time To not found.' : !fromInput ? 'Time From not found.' : 'Time To not found.'
    };
    return;
  }
  window.__readTimeWorkedResult = {
    from: (fromInput.value || '').trim() || null,
    to: (toInput.value || '').trim() || null
  };
})();
