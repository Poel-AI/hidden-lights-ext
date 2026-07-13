/**
 * Element selectors and page config for CentralReach (members.centralreach.com).
 * All selectors and URLs live here so content script stays generic.
 * Injected first in content_scripts; shared with content.js in the same isolated world.
 */
var CENTRALREACH_SELECTORS = {
  // Base URL for the app
  baseUrl: 'https://members.centralreach.com',

  // Reporting page we're targeting
  reportingUrl: 'https://members.centralreach.com/#reporting/104',

  // Default values for filters (change as needed)
  defaultContactId: '3792429',
  defaultServiceCode: 'all',

  // Report table column indices (0-based) for export
  reportTableDateCol: 0,
  reportTableDurationCol: 3,

  // Run All – edit these to change what the "Run All" button does
  runAll: {
    dateFrom: '08/04/2025',
    dateTo: '02/04/26',
    contactId: '3792429',
    serviceCode: 'all'
  },

  // Report 104 (Service Audits) – main working area. Each element has multiple selectors (CSS + XPath)
  // tried in order for resilience. CSS first, then XPath fallbacks.
  elements: {
    formPanel: ['.form-panel', '//div[contains(@class,"form-panel")]'],
    reportName: ['#reportName', '//h2[@id="reportName"]'],
    report104: ['#cr__reporting-104', '//div[@id="cr__reporting-104"]'],
    report104Container: ['#indReportRoot', '//div[@id="indReportRoot"]'],
    dateFrom: [
      '#dateFrom',
      'input#dateFrom',
      'input.dateCal[placeholder="From..."]',
      '//input[@id="dateFrom"]',
      '//input[@placeholder="From..."]'
    ],
    dateTo: [
      '#dateTo',
      'input#dateTo',
      'input.dateCal[placeholder="To..."]',
      '//input[@id="dateTo"]',
      '//input[@placeholder="To..."]',
      '/html/body/div[1]/div[1]/div[4]/div[1]/div[1]/div/div/div/div[2]/div[28]/div/div[1]/div[2]/div/input'
    ],
    btnSearch: ['#btnsearch', 'a#btnsearch', '//a[@id="btnsearch"]'],
    exportBtn: ['a.export-report', '//a[contains(@class,"export-report")]'],
    reportTable: ['#reportTable', '//table[@id="reportTable"]'],
    reportList: ['#reportList', '//tbody[@id="reportList"]'],
    filterContact: ['[data-bind*="clientSelect"]', '//input[contains(@data-bind,"clientSelect")]'],
    filterContactTrigger: [
      'span.select2-chosen[id="select2-chosen-8"]',
      '#indReportRoot span.select2-chosen:first-of-type',
      'span.select2-chosen[id*="select2-chosen"]',
      '//span[contains(@class,"select2-chosen") and contains(.,"Filter by contact")]',
      '#indReportRoot .select2-container:first-of-type .select2-choice',
      '#cr__reporting-104 .form-inline .select2-container:first-of-type .select2-choice',
      '.select2-container .select2-choice',
      '/html/body/div[1]/div[1]/div[4]/div[1]/div[1]/div/div/div/div[2]/div[28]/div/div[1]/div[3]/div/a/span[1]'
    ],
    filterContactSearchInput: [
      '#s2id_autogen8_search',
      'input#s2id_autogen8_search',
      '#select2-drop input.select2-input',
      '.select2-drop-active input.select2-input',
      '.select2-drop .select2-search input',
      'input.select2-input[placeholder*="contact"]',
      'input[placeholder="Filter by contact..."]',
      '//input[contains(@placeholder,"Filter by contact")]',
      '/html/body/div[10]//input[@class="select2-input"]'
    ],
    filterContactResult: [
      '.select2-drop .select2-results li.select2-result-selectable',
      '.select2-drop .select2-results li.select2-highlighted',
      '#select2-drop .select2-results li',
      '.select2-results li.select2-result-selectable',
      '//div[@id="select2-drop"]//ul[@class="select2-results"]/li',
      '/html/body/div[10]//ul[@class="select2-results"]/li'
    ],
    filterEmployee: ['[data-bind*="employeeSelect"]', '//input[contains(@data-bind,"employeeSelect")]'],
    filterServiceCode: ['[data-bind*="codeSelect"]', '//input[contains(@data-bind,"codeSelect")]'],
    filterServiceCodeTrigger: [
      '//span[contains(@class,"select2-chosen") and contains(.,"Filter by service code")]',
      '/html/body/div[1]/div[1]/div[4]/div[1]/div[1]/div/div/div/div[2]/div[28]/div/div[1]/div[5]/div/a/span[1]',
      '#indReportRoot .select2-container:nth-of-type(3) span.select2-chosen',
      'span.select2-chosen[id*="select2-chosen"]'
    ]
  }
};
