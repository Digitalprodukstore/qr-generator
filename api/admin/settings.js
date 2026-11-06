const { sendJson, hasValidSession } = require('../_adminAuth');

const KEY = 'qr-studio-pro:global-settings:v1';
const DEFAULT_SETTINGS = Object.freeze({
  schemaVersion: 1,
  ad: {
    adMode: 'sponsor',
    autoAds: false,
    pubId: '',
    slotId: '',
    sponsorName: '',
    sponsorLink: '',
    sponsorTagline: ''
  },
  enabledTypes: {
    url: true, text: true, wifi: true,
    wa: true, email: true, tel: true, sms: true, vcard: true,
    review: true, social: true, menu: true, geo: true, pdf: true,
    multilink: true, form: true, event: true, invitation: true, app: true
  },
  updatedAt: null
});
const TYPE_IDS = Object.keys(DEFAULT_SETTINGS.enabledTypes);

function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  let base = url;
  while (base.endsWith('/')) base = base.slice(0, -1);
  return { url: base, token };
}
async function redisCommand(commands) {
  const cfg = redisConfig();
  if (!cfg) throw new Error('PERSISTENCE_NOT_CONFIGURED');
  const response = await fetch(cfg.url + '/pipeline', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + cfg.token, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands)
  });
  if (!response.ok) throw new Error('PERSISTENCE_UNAVAILABLE');
  const result = await response.json();
  if (!Array.isArray(result) || result.some(item => item && item.error)) throw new Error('PERSISTENCE_UNAVAILABLE');
  return result;
}
function cleanSettings(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  const ad = input.ad && typeof input.ad === 'object' && !Array.isArray(input.ad) ? input.ad : {};
  const types = input.enabledTypes && typeof input.enabledTypes === 'object' && !Array.isArray(input.enabledTypes) ? input.enabledTypes : {};
  const adMode = ['sponsor', 'adsense', 'hybrid'].includes(ad.adMode) ? ad.adMode : null;
  if (!adMode) return null;
  const text = (value, max) => typeof value === 'string' && value.length <= max ? value.trim() : null;
  const pubId = text(ad.pubId, 80), slotId = text(ad.slotId, 40);
  const sponsorName = text(ad.sponsorName, 100), sponsorLink = text(ad.sponsorLink, 500), sponsorTagline = text(ad.sponsorTagline, 180);
  if ([pubId, slotId, sponsorName, sponsorLink, sponsorTagline].some(value => value === null)) return null;
  if (sponsorLink) { try { const parsed = new URL(sponsorLink); if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null; } catch { return null; } }
  if (typeof ad.autoAds !== 'boolean') return null;
  const enabledTypes = {};
  for (const id of TYPE_IDS) {
    if (typeof types[id] !== 'boolean') return null;
    enabledTypes[id] = types[id];
  }
  return {
    schemaVersion: 1,
    ad: { adMode, autoAds: ad.autoAds, pubId, slotId, sponsorName, sponsorLink, sponsorTagline },
    enabledTypes,
    updatedAt: new Date().toISOString()
  };
}
function publicDefaults() {
  return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
}
function isSameOriginRequest(req) {
  const origin = req.headers && req.headers.origin;
  const host = req.headers && req.headers.host;
  if (typeof origin !== 'string' || !origin || typeof host !== 'string' || !host) return false;
  try {
    const parsedOrigin = new URL(origin);
    if (parsedOrigin.username || parsedOrigin.password || parsedOrigin.pathname !== '/' || parsedOrigin.search || parsedOrigin.hash) return false;
    const forwardedProto = String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim().toLowerCase();
    const protocol = forwardedProto || (/^(localhost|127\\.0\\.0\\.1)(:\\d+)?$/i.test(host) ? 'http' : 'https');
    if (protocol !== 'https' && protocol !== 'http') return false;
    const expectedOrigin = new URL(protocol + '://' + host).origin;
    return parsedOrigin.origin === expectedOrigin;
  } catch {
    return false;
  }
}
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Vary', 'Cookie');
  if (req.method === 'GET') {
    try {
      const result = await redisCommand([['GET', KEY]]);
      const raw = result[0] && result[0].result;
      if (!raw) return sendJson(res, 200, { settings: publicDefaults(), storage: 'ready', configured: false });
      let parsed;
      try { parsed = JSON.parse(raw); } catch { return sendJson(res, 500, { error: 'Konfigurasi global tersimpan tidak valid.' }); }
      const cleaned = cleanSettings(parsed);
      if (!cleaned) return sendJson(res, 500, { error: 'Struktur konfigurasi global tidak valid.' });
      cleaned.updatedAt = parsed.updatedAt || null;
      return sendJson(res, 200, { settings: cleaned, storage: 'ready', configured: true });
    } catch (error) {
      if (error.message === 'PERSISTENCE_NOT_CONFIGURED') {
        return sendJson(res, 503, { error: 'Penyimpanan global belum dikonfigurasi.', storage: 'unconfigured' });
      }
      return sendJson(res, 503, { error: 'Penyimpanan global sementara tidak tersedia.', storage: 'unavailable' });
    }
  }
  if (req.method === 'PUT') {
    if (!isSameOriginRequest(req)) return sendJson(res, 403, { error: 'Permintaan lintas situs ditolak.' });
    if (!(await hasValidSession(req))) return sendJson(res, 401, { error: 'Sesi admin tidak valid.' });
    const settings = cleanSettings(req.body);
    if (!settings) return sendJson(res, 400, { error: 'Format pengaturan tidak valid. Periksa seluruh kolom dan status 18 jenis QR.' });
    try {
      await redisCommand([['SET', KEY, JSON.stringify(settings)]]);
      return sendJson(res, 200, { saved: true, storage: 'ready', settings });
    } catch (error) {
      if (error.message === 'PERSISTENCE_NOT_CONFIGURED') {
        return sendJson(res, 503, { error: 'Tambahkan UPSTASH_REDIS_REST_URL dan UPSTASH_REDIS_REST_TOKEN di Vercel Preview terlebih dahulu.', storage: 'unconfigured' });
      }
      return sendJson(res, 503, { error: 'Gagal menyimpan ke penyimpanan global. Perubahan belum diterapkan.', storage: 'unavailable' });
    }
  }
  res.setHeader('Allow', 'GET, PUT');
  return sendJson(res, 405, { error: 'Metode tidak diizinkan.' });
};
