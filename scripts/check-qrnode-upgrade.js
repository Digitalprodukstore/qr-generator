const fs = require('node:fs');
const { spawnSync } = require('node:child_process');
const html = fs.readFileSync('index.html', 'utf8');
const moduleSource = fs.readFileSync('qrnode-upgrade.js', 'utf8');
const assert = (condition, message) => {
  if (!condition) { console.error('FAIL:', message); process.exitCode = 1; }
  else console.log('PASS:', message);
};
const syntax = spawnSync(process.execPath, ['--check', 'qrnode-upgrade.js'], { encoding: 'utf8' });
assert(syntax.status === 0, 'QRNode upgrade module has valid JavaScript syntax');
assert(html.includes('src="/qrnode-upgrade.js"'), 'QRNode upgrade module is loaded by the existing app');
for (const id of ['url','text','wa','email','tel','sms','wifi','vcard','geo','event','menu','invitation']) {
  assert(new RegExp('(^|[,{])\\s*' + id + '\\s*:', 'm').test(moduleSource), 'category payload form exists: ' + id);
}
for (const marker of ['mailto:', 'https://wa.me/', 'WIFI:T:', 'BEGIN:VCARD', 'BEGIN:VCALENDAR', 'geo:']) {
  assert(moduleSource.includes(marker), 'standard payload encoding exists: ' + marker);
}
assert(moduleSource.includes('function downloadSvg()'), 'SVG export implementation exists');
assert(moduleSource.includes('dataset.qrReady!=="true"'), 'SVG export refuses invalid/unready QR');
assert(!moduleSource.includes('MENU:') && !moduleSource.includes('UNDANGAN:'), 'menu and invitation do not use proprietary non-scannable pseudo schemes');
assert(html.includes('qrcode-generator/1.4.4/qrcode.min.js'), 'standards-compliant QR encoder remains loaded');
if (process.exitCode) process.exit(process.exitCode);
