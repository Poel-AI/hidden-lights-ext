const fs = require('fs');
const path = require('path');

const sidepanelDir = path.join(__dirname, '../sidepanel-source');
const sidepanelPath = path.join(sidepanelDir, 'sidepanel.js');
const htmlPath = path.join(sidepanelDir, 'sidepanel.html');
const jspdfPath = path.join(sidepanelDir, 'lib/jspdf.umd.min.js');
const rbtSelectorsPath = path.join(sidepanelDir, 'rbt-selectors.js');
const rbtReportsPath = path.join(sidepanelDir, 'rbt-reports.js');

let appCode = fs.readFileSync(sidepanelPath, 'utf8');
appCode = appCode.replace(
  /await chrome\.scripting\.executeScript\(\s*\{\s*target:\s*\{\s*tabId:\s*tab\.id\s*\},\s*files:\s*\[\s*'inject-service-line-tab-count\.js',\s*'inject-add-service-line\.js'\]\s*\}\);/g,
  "await window.SHELL.runScript('inject-service-line-tab-count');\n    await window.SHELL.runScript('inject-add-service-line');"
);
appCode = appCode.replace(
  /await chrome\.scripting\.executeScript\(\s*\{\s*target:\s*\{\s*tabId:\s*tab\.id\s*\},\s*files:\s*\[\s*'inject-service-line-tab-count\.js',\s*'inject-read-timesheet\.js'\]\s*\}\);/g,
  "await window.SHELL.runScript('inject-service-line-tab-count');\n    await window.SHELL.runScript('inject-read-timesheet');"
);
appCode = appCode.replace(/await chrome\.scripting\.executeScript\(\s*\{\s*target:\s*\{\s*tabId:\s*tab\.id\s*\},\s*files:\s*\['(inject-[^']+)\.js'\]\s*\}\);/g, "await window.SHELL.runScript('$1');");
appCode = appCode.replace(/const scanFile = resultKey === '97155' \? 'inject-overlaps-97155\.js' : 'inject-overlaps\.js';\s*await chrome\.scripting\.executeScript\(\s*\{\s*target:\s*\{\s*tabId:\s*tab\.id\s*\},\s*files:\s*\[scanFile\]\s*\}\);/s, "const scriptName = resultKey === '97155' ? 'inject-overlaps-97155' : 'inject-overlaps';\n  await window.SHELL.runScript(scriptName);");

const html = fs.readFileSync(htmlPath, 'utf8');
const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
const bodyMatch = html.match(/<body>([\s\S]*?)<\/body>/);
const style = (styleMatch ? styleMatch[1] : '').trim();
let body = (bodyMatch ? bodyMatch[1] : '').trim();
body = body.replace(/<script\s+src="sidepanel\.js"[^>]*>\s*<\/script>\s*/gi, '');
const fullHtml = '<style>' + style + '</style>' + body;
const escapedHtml = fullHtml.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');

const jspdfRaw = fs.existsSync(jspdfPath) ? fs.readFileSync(jspdfPath, 'utf8') : '';
const jspdf = jspdfRaw
  ? '(function(){\ntry {\n' + jspdfRaw + '\n} catch (eJspdf) { console.warn("[Hidden Lights] jspdf load failed", eJspdf); }\n})();\n'
  : '';
const rbtSelectors = fs.existsSync(rbtSelectorsPath) ? fs.readFileSync(rbtSelectorsPath, 'utf8') + '\n' : '';
const rbtReports = fs.existsSync(rbtReportsPath) ? fs.readFileSync(rbtReportsPath, 'utf8') + '\n' : '';

const bootstrap = `(function(){
  var SH = window.SHELL;
  if (!SH || !SH.container) return;
  SH.container.innerHTML = \`${escapedHtml}\`;

`;
fs.writeFileSync(
  path.join(__dirname, 'app.js'),
  jspdf + bootstrap + rbtSelectors + appCode + '\n' + rbtReports + '\n})();'
);
console.log('Built app.js');
