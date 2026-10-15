const crypto = require('node:crypto');

const WINDOW_SECONDS = 10 * 60;
const MAX_ATTEMPTS = 10;

function clientAddress(req) {
  // Prefer Vercel's normalized client IP header; fall back to forwarded-for
  // only when the normalized header is unavailable.
  const realIp = req.headers && req.headers['x-real-ip'];
  if (typeof realIp === 'string' && realIp.trim()) return realIp.trim().slice(0, 128);
  const forwarded = req.headers && req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim().slice(0, 128) || 'unknown';
  }
  return 'unknown';
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

  try {
    // Use one Upstash pipeline and EXPIRE NX so the first request sets a
    // fixed-window TTL without resetting it on every subsequent attempt.
    // Applying EXPIRE NX on every request also repairs a missing TTL if an
    // earlier expiry command failed after INCR succeeded.
    const response = await fetch(base + '/pipeline', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([
        ['INCR', key],
        ['EXPIRE', key, WINDOW_SECONDS, 'NX']
      ])
    });
    if (!response.ok) return { configured: true, error: true };
    const payload = await response.json();
    const count = Number(payload && payload[0] && payload[0].result);
    const expiryResult = payload && payload[1] && payload[1].result;
    if (!Number.isSafeInteger(count) || count < 1) return { configured: true, error: true };
    if (expiryResult !== 1 && expiryResult !== 0 && expiryResult !== true && expiryResult !== false) {
      return { configured: true, error: true };
    }
    return { configured: true, limited: count > MAX_ATTEMPTS, remaining: Math.max(0, MAX_ATTEMPTS - count) };
  } catch {
    return { configured: true, error: true };
  }
}

module.exports = { checkAdminLoginRateLimit, WINDOW_SECONDS, MAX_ATTEMPTS };
