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
for (const id of ['url','text','wifi','wa','email','tel','sms','vcard','review','social','menu','geo','pdf','multilink','form','event','invitation','app']) {
  assert(new RegExp('(^|[,{])\\s*' + id + '\\s*:', 'm').test(moduleSource), 'category payload form exists: ' + id);
}
for (const marker of ['mailto:', 'https://wa.me/', 'WIFI:T:', 'BEGIN:VCARD', 'BEGIN:VCALENDAR', 'geo:']) {
  assert(moduleSource.includes(marker), 'standard payload encoding exists: ' + marker);
}
assert(moduleSource.includes('function downloadSvg()'), 'SVG export implementation exists');
assert(html.includes('function renderLiveQR(targetCanvas, outputSize)'), 'QR renderer supports independent output canvases and explicit resolutions');
assert(moduleSource.includes('window.renderLiveQR?.(out, 2048)'), '2048px PNG export rerenders QR modules at native resolution');
assert(!moduleSource.includes('x.drawImage(c,0,0,2048,2048)'), '2048px PNG export does not upscale the 1200px preview canvas');
assert(html.includes("const pattern = window.qrStudioPattern || 'square'"), 'QR renderer reads the selected module pattern');
assert(html.includes("pattern === 'dots' && !isFinder"), 'dot pattern preserves square finder zones');
assert(html.includes("pattern === 'rounded' && !isFinder"), 'rounded pattern preserves square finder zones');
assert(moduleSource.includes('id=\"qrnodePattern\"'), 'shape selector is available in the design studio');
assert(moduleSource.includes('pattern:selectedPattern'), 'selected pattern is saved with local projects');
assert(moduleSource.includes('if(select)select.value=pattern;update()}'), 'pattern changes revalidate the active QR payload before rendering');
assert(moduleSource.includes('shape===\"dots\"&&!finder') && moduleSource.includes('shape===\"rounded\"&&!finder'), 'SVG export preserves selected module pattern');
assert(moduleSource.includes('const icsEsc='), 'calendar fields are escaped for iCalendar');
assert(moduleSource.includes('"SUMMARY:"+icsEsc(g("title"))'), 'calendar event titles escape iCalendar delimiters');
assert(moduleSource.includes('"LOCATION:"+icsEsc(g("location"))'), 'calendar locations escape iCalendar delimiters');
assert(moduleSource.includes('Kata sandi Wi-Fi wajib diisi'), 'secured Wi-Fi requires a password');
assert(moduleSource.includes('n>1200'), 'oversized payloads are rejected before QR rendering');
assert(moduleSource.includes('png|jpeg|webp'), 'SVG embeds only supported raster logo formats');
assert(moduleSource.includes('dataset.qrReady!=="true"'), 'SVG export refuses invalid/unready QR');
assert(!moduleSource.includes('MENU:') && !moduleSource.includes('UNDANGAN:'), 'menu and invitation do not use proprietary non-scannable pseudo schemes');
assert(html.includes('qrcode-generator/1.4.4/qrcode.min.js'), 'standards-compliant QR encoder remains loaded');
if (process.exitCode) process.exit(process.exitCode);
