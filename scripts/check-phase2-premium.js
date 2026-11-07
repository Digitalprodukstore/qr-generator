const fs = require('node:fs');
const html = fs.readFileSync('index.html', 'utf8');
const moduleSource = fs.readFileSync('qrnode-upgrade.js', 'utf8');
const assert = (condition, message) => {
  if (!condition) { console.error('FAIL:', message); process.exitCode = 1; }
  else console.log('PASS:', message);
};
const hasDomId = id => {
  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp('(?:\\.id\\s*=\\s*[\'"\\x22]' + escaped + '[\'"\\x22]|\\bid\\s*=\\s*[\'"\\x22]' + escaped + '[\'"\\x22])').test(moduleSource);
};

assert(moduleSource.includes('function downloadPng2048()'), '2048px PNG export exists');
assert(moduleSource.includes('function updateContrast()'), 'QR contrast checker exists');
assert(moduleSource.includes('function applyDesignPreset('), 'premium design presets exist');
for (const preset of ['gold','midnight','mono','coffee','forest']) {
  assert(moduleSource.includes(preset + ':'), 'design preset exists: ' + preset);
}
assert(moduleSource.includes('localStorage'), 'project persistence uses browser storage');
assert(moduleSource.includes('qrstudio.projects'), 'project storage namespace exists');
assert(moduleSource.includes('function saveProject()'), 'save project action exists');
assert(moduleSource.includes('function loadProject('), 'load project action exists');
assert(moduleSource.includes('function deleteProject('), 'delete project action exists');
assert(moduleSource.includes('contrast(c1,bg)'), 'contrast ratio is calculated from foreground/background');

// These controls are injected at runtime, so validate the DOM construction source
// rather than expecting the IDs to exist in the static index.html.
assert(hasDomId('qrnodeContrast') || moduleSource.includes('qrnodeContrast'), 'contrast result UI is injected');
assert(hasDomId('qrnodeProjects') || moduleSource.includes('qrnodeProjects'), 'project list UI is injected');
assert(hasDomId('qrnodeSave') || moduleSource.includes('qrnodeSave'), 'save project control is injected');
assert(hasDomId('qrnodeSizeOptions') || moduleSource.includes('qrnodeSizeOptions'), 'custom export size choices are injected');
assert(hasDomId('qrnodeDownloadSize') || moduleSource.includes('qrnodeDownloadSize'), 'custom export download control is injected');
assert(moduleSource.includes('function downloadCustomSize()'), 'custom dimension PNG export exists');
for (const ratio of ['9:16','1:1','4:5','16:9','3:2']) {
  assert(moduleSource.includes('ratio:"' + ratio + '"'), 'custom export ratio exists: ' + ratio);
}
assert(moduleSource.includes('out.width=size.width;out.height=size.height'), 'custom export canvas uses the selected pixel dimensions');
assert(moduleSource.includes('function addSvgButton()') && (hasDomId('qrSvgButton') || moduleSource.includes('qrSvgButton')), 'SVG export control is injected');
assert(moduleSource.includes('id="qrnodePng2048"') || moduleSource.includes('qrnodePng2048'), '2048px PNG control is injected');
assert(moduleSource.includes('addStudio();addSvgButton()'), 'Premium Design Studio and SVG controls are mounted during initialization');
assert(html.includes('id="qrColor1"') && html.includes('id="qrColor2"') && html.includes('id="qrBgColor"'), 'premium color controls remain mounted');
if (process.exitCode) process.exit(process.exitCode);
