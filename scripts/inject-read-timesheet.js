/**
 * Injected into the timesheet editor page. Reads form fields and assigns result to window.__timesheetResult.
 * Field IDs/structure from the Canvas timesheet form (see timesheethtml).
 */
(function () {
  /** Prefer inject-service-line-tab-count.js (scoped); else legacy (align with inject-add-service-line.js). */
  function countServiceLineTabs() {
    if (typeof window.__countServiceLineTabs === 'function') return window.__countServiceLineTabs();
    const selectors = [
      '.MuiTabs-flexContainer[role="tablist"]',
      '[role="tablist"].MuiTabs-flexContainer',
      '.MuiTabs-flexContainer',
      '[role="tablist"]'
    ];
    for (const sel of selectors) {
      const tablist = document.querySelector(sel);
      if (!tablist) continue;
      const buttons = tablist.querySelectorAll('button[role="tab"]');
      return buttons.length;
    }
    return 0;
  }

  function val(id) {
    const el = document.getElementById(id);
    if (!el) return '';
    if (el.tagName === 'SELECT') {
      const opt = el.options[el.selectedIndex];
      return opt ? opt.textContent.trim() : '';
    }
    return (el.value || '').trim();
  }

  /** Native or MUI-hidden <select>; try id first, then label text (align with inject-select-place/address). */
  function findSelectByField(preferredId, labelSubstrings) {
    let el = document.getElementById(preferredId);
    if (el && el.tagName === 'SELECT') return el;
    const labels = document.querySelectorAll('label.control-label, label, span.MuiFormLabel-root, legend');
    for (const label of labels) {
      const t = (label.textContent || '').toLowerCase();
      if (!labelSubstrings.some((s) => t.indexOf(s) !== -1)) continue;
      const root =
        label.closest('.form-group, .MuiFormControl-root, [class*="FormControl"], .MuiGrid-root, .MuiGrid-item') ||
        label.parentElement;
      if (!root) continue;
      const sel =
        root.querySelector('select.MuiSelect-nativeInput') ||
        root.querySelector('select.MuiNativeSelect-root') ||
        root.querySelector('select');
      if (sel && sel.tagName === 'SELECT') return sel;
    }
    return null;
  }

  function selectedOptionText(sel) {
    if (!sel || sel.tagName !== 'SELECT') return '';
    const opt = sel.options[sel.selectedIndex];
    return opt ? (opt.textContent || opt.text || '').trim() : '';
  }

  function byLabel(labelText) {
    const labels = document.querySelectorAll('.form-group label.control-label');
    for (const label of labels) {
      if (label.textContent.trim().indexOf(labelText) === 0) {
        const group = label.closest('.form-group');
        if (!group) continue;
        const staticEl = group.querySelector('.form-control-static');
        if (staticEl) return staticEl.textContent.trim();
        const input = group.querySelector('input, select, textarea');
        if (input) return (input.value || '').trim();
        const link = group.querySelector('a');
        if (link) return link.textContent.trim();
        return '';
      }
    }
    return '';
  }

  function serviceNotes() {
    const ta = document.getElementById('react-tinymce-16');
    if (ta && ta.value) return ta.value.replace(/<[^>]+>/g, ' ').trim();
    const iframe = document.getElementById('react-tinymce-16_ifr');
    if (iframe && iframe.contentDocument && iframe.contentDocument.body) {
      return (iframe.contentDocument.body.innerText || '').trim();
    }
    return '';
  }

  const dateOfService = val('dateOfService');
  if (!dateOfService) {
    window.__timesheetResult = { error: 'Timesheet form not found. Open a timesheet editor first.' };
    return;
  }

  const pointer1 = val('diagnosisPointer1');
  const pointer2 = val('diagnosisPointer2');
  const pointer3 = val('diagnosisPointer3');
  const pointer4 = val('diagnosisPointer4');
  const pointers = [pointer1, pointer2, pointer3, pointer4].filter(Boolean).join(', ') || '(none)';

  const tzSelect = document.getElementById('timesheetTimeZone');
  const timeZoneValue =
    tzSelect && tzSelect.tagName === 'SELECT' && tzSelect.value ? String(tzSelect.value).trim() : '';

  window.__timesheetResult = {
    provider: byLabel('Provider') || val('provider'),
    dateOfService,
    authorization: document.querySelector('.jss5912') ? document.querySelector('.jss5912').textContent.trim() : byLabel('Authorization'),
    patientResponsibility: val('copayAmount'),
    modifiers: byLabel('Modifiers'),
    pointer: pointers,
    timeWorkedFrom: val('timeWorkedFrom'),
    timeWorkedTo: val('timeWorkedTo'),
    timeZone: val('timesheetTimeZone'),
    timeZoneValue,
    unitsOfService: val('unitsOfService'),
    driveHours: val('driveTimeHours'),
    driveMinutes: val('driveTimeMinutes'),
    mileage: val('mileage'),
    driveInfo: val('driveTimeHours') + 'h ' + val('driveTimeMinutes') + 'm, ' + val('mileage') + ' mi',
    placeOfService: (function () {
      const sel = findSelectByField('selectedLocation', ['place of service', 'place of serv']);
      return selectedOptionText(sel) || val('selectedLocation');
    })(),
    serviceAddress: (function () {
      const sel = findSelectByField('selectedServiceAddressId', ['service address', 'service addr', 'location address']);
      return selectedOptionText(sel) || val('selectedServiceAddressId');
    })(),
    serviceAddressText: (function () {
      const sel = findSelectByField('selectedServiceAddressId', ['service address', 'service addr', 'location address']);
      return selectedOptionText(sel);
    })(),
    providerPayRate: val('rateProvider'),
    providerPayDrive: val('rateProviderDriveHourly'),
    providerPayMiles: val('rateProviderDriveMileage'),
    clientRate: val('rateClient'),
    clientRateDrive: val('rateClientDriveHourly'),
    clientRateMiles: val('rateClientDriveMileage'),
    agreedRate: val('rateClientAgreed'),
    serviceNotes: serviceNotes(),
    serviceLineTabCount: countServiceLineTabs()
  };

  window.__countServiceLineTabs = countServiceLineTabs;
})();
