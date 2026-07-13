const fs = require('fs');
const path = require('path');

const sidepanelDir = path.join(__dirname, '../sidepanel-source');
const sidepanelPath = path.join(sidepanelDir, 'sidepanel.js');
const htmlPath = path.join(sidepanelDir, 'sidepanel.html');

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

const bootstrap = `(function(){
  var SH = window.SHELL;
  if (!SH || !SH.container) return;
  SH.container.innerHTML = \`${escapedHtml}\`;

`;
fs.writeFileSync(path.join(__dirname, 'app.js'), bootstrap + appCode + '\n})();');
console.log('Built app.js');
