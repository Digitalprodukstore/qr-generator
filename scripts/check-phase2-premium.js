const fs = require('node:fs');
const html = fs.readFileSync('index.html', 'utf8');
const moduleSource = fs.readFileSync('qrnode-upgrade.js', 'utf8');
const assert = (condition, message) => {
  if (!condition) { console.error('FAIL:', message); process.exitCode = 1; }
  else console.log('PASS:', message);
};

assert(moduleSource.includes('function downloadPng2048()'), '2048px PNG export exists');
assert(moduleSource.includes('function updateContrast()'), 'QR contrast checker exists');
assert(moduleSource.includes('function applyDesignPreset('), 'premium design presets exist');
for (const preset of ['gold','midnight','mono','coffee','forest']) {
  assert(moduleSource.includes(preset + ':'), 'design preset exists: ' + preset);
}
assert(moduleSource.includes('localStorage'), 'project persistence uses browser storage');
assert(moduleSource.includes('qrnodeProjects'), 'project storage namespace exists');
assert(moduleSource.includes('function saveProject()'), 'save project action exists');
assert(moduleSource.includes('function loadProject('), 'load project action exists');
assert(moduleSource.includes('function deleteProject('), 'delete project action exists');
assert(moduleSource.includes('contrast(c1,bg)'), 'contrast ratio is calculated from foreground/background');
assert(html.includes('id="qrnodeContrast"'), 'contrast result UI is mounted');
assert(html.includes('id="qrnodeProjects"'), 'project list UI is mounted');
assert(html.includes('id="qrnodeSaveProject"'), 'save project control is mounted');
assert(html.includes('id="qrnodePng2048"'), '2048px PNG control is mounted');
assert(html.includes('id="qrSvgButton"'), 'SVG export control remains mounted');
assert(html.includes('id="qrColor1"') && html.includes('id="qrColor2"') && html.includes('id="qrBgColor"'), 'premium color controls remain mounted');
if (process.exitCode) process.exit(process.exitCode);
