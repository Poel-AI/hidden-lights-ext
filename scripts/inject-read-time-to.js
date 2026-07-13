/**
 * Injected on the timesheet page. Reads the current "Time To" (end time) value.
 * Result: window.__readTimeToResult = { value: string or null, error?: string }
 * Uses same find logic as inject-enter-times.js so we read the same field we write.
 */
(function () {
  function findToInput() {
    var el = document.getElementById('timeWorkedTo');
    if (el && (el.tagName === 'INPUT' || el.tagName === 'input')) return el;
    var inputs = document.querySelectorAll('input[placeholder="Time To"], input[placeholder*="Time To"]');
    for (var i = 0; i < inputs.length; i++) return inputs[i];
    var labels = document.querySelectorAll('label.control-label, label');
    for (var j = 0; j < labels.length; j++) {
      if ((labels[j].textContent || '').toLowerCase().indexOf('time worked') !== -1) {
        var group = labels[j].closest('.form-group') || labels[j].closest('div');
        if (group) {
          var toInput = group.querySelector('input#timeWorkedTo, input[placeholder*="To"]');
          if (toInput) return toInput;
        }
      }
    }
    return document.getElementById('timeWorkedTo');
  }

  var input = findToInput();
  if (!input) {
    window.__readTimeToResult = { value: null, error: 'Time To input not found.' };
    return;
  }
  var value = (input.value || '').trim();
  window.__readTimeToResult = { value: value || null };
})();
