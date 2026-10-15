const crypto = require('node:crypto');

const WINDOW_SECONDS = 10 * 60;
const MAX_ATTEMPTS = 10;

function clientAddress(req) {
  // Vercel supplies x-forwarded-for for incoming requests. Use the first address
  // as the client IP and never accept an IP passed in the JSON body.
  const forwarded = req.headers && req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim().slice(0, 128) || 'unknown';
  }
  const realIp = req.headers && req.headers['x-real-ip'];
  return typeof realIp === 'string' && realIp.trim() ? realIp.trim().slice(0, 128) : 'unknown';
}

async function checkAdminLoginRateLimit(req) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url && !token) return { configured: false, limited: false };
  if (!url || !token) return { configured: true, error: true };

  const ip = clientAddress(req);
  const digest = crypto.createHash('sha256').update(ip).digest('hex');
  const key = 'qr-admin-login:' + digest;
  const base = url.replace(/\/+$/, '');
  const headers = { Authorization: 'Bearer ' + token };

  try {
    const increment = await fetch(base + '/incr/' + encodeURIComponent(key), { headers });
    if (!increment.ok) return { configured: true, error: true };
    const payload = await increment.json();
    const count = Number(payload && payload.result);
    if (!Number.isSafeInteger(count) || count < 1) return { configured: true, error: true };

    if (count === 1) {
      const expiry = await fetch(base + '/expire/' + encodeURIComponent(key) + '/' + WINDOW_SECONDS, { headers });
      if (!expiry.ok) return { configured: true, error: true };
    }
    return { configured: true, limited: count > MAX_ATTEMPTS, remaining: Math.max(0, MAX_ATTEMPTS - count) };
  } catch {
    return { configured: true, error: true };
  }
}

module.exports = { checkAdminLoginRateLimit, WINDOW_SECONDS, MAX_ATTEMPTS };
