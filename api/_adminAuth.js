const crypto = require('node:crypto');
const { fetchRedisJson } = require('./_redisFetch');

const COOKIE_NAME = 'qr_admin_session';
const SESSION_TTL_SECONDS = 8 * 60 * 60;
const SESSION_KEY_PREFIX = 'qr-admin-session:';

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.end(JSON.stringify(payload));
}

function secretsConfigured() {
  return Boolean(
    process.env.ADMIN_EMAIL &&
    process.env.ADMIN_PASSWORD &&
    process.env.ADMIN_PIN &&
    process.env.ADMIN_SESSION_SECRET &&
    process.env.ADMIN_SESSION_SECRET.length >= 32
  );
}

function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url: url.replace(new RegExp('/+$'), ''), token };
}

async function redisCommand(command) {
  const cfg = redisConfig();
  if (!cfg) throw new Error('SESSION_STORE_NOT_CONFIGURED');
  const { response, payload } = await fetchRedisJson(cfg.url, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + cfg.token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(command)
  });
  if (!response.ok) throw new Error('SESSION_STORE_UNAVAILABLE');
  if (!payload || payload.error) throw new Error('SESSION_STORE_UNAVAILABLE');
  return payload.result;
}

function constantTimeEqual(left, right) {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function signSession(expiry, sessionId) {
  return crypto.createHmac('sha256', process.env.ADMIN_SESSION_SECRET)
    .update(String(expiry) + '.' + sessionId)
    .digest('base64url');
}

function parseSession(req) {
  const value = readCookie(req, COOKIE_NAME);
  const parts = value.split('.');
  if (parts.length !== 3) return null;
  const [expiryText, sessionId, signature] = parts;
  if (!/^[0-9]{10}$/.test(expiryText) || !/^[a-f0-9]{64}$/.test(sessionId)) return null;
  if (Number(expiryText) <= Math.floor(Date.now() / 1000)) return null;
  if (!constantTimeEqual(signature, signSession(expiryText, sessionId))) return null;
  return { expiry: Number(expiryText), sessionId };
}

function issueSessionCookie(res) {
  const expiry = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const sessionId = crypto.randomBytes(32).toString('hex');
  const value = expiry + '.' + sessionId + '.' + signSession(expiry, sessionId);
  return redisCommand(['SET', SESSION_KEY_PREFIX + sessionId, '1', 'EX', SESSION_TTL_SECONDS, 'NX'])
    .then(result => {
      if (result !== 'OK') throw new Error('SESSION_STORE_UNAVAILABLE');
      res.setHeader('Set-Cookie',
        COOKIE_NAME + '=' + value + '; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=' + SESSION_TTL_SECONDS
      );
    });
}

function clearSessionCookie(res) {
  res.setHeader('Set-Cookie',
    COOKIE_NAME + '=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0'
  );
}

function readCookie(req, name) {
  const raw = req.headers.cookie || '';
  for (const item of raw.split(';')) {
    const index = item.indexOf('=');
    if (index < 0) continue;
    if (item.slice(0, index).trim() === name) return item.slice(index + 1).trim();
  }
  return '';
}

async function hasValidSession(req) {
  if (!secretsConfigured()) return false;
  const session = parseSession(req);
  if (!session) return false;
  try {
    const active = await redisCommand(['GET', SESSION_KEY_PREFIX + session.sessionId]);
    return active === '1';
  } catch {
    return false;
  }
}

async function revokeSession(req) {
  const session = secretsConfigured() ? parseSession(req) : null;
  if (!session) return true;
  const result = await redisCommand(['DEL', SESSION_KEY_PREFIX + session.sessionId]);
  return Number(result) === 1 || Number(result) === 0;
}

module.exports = {
  COOKIE_NAME,
  SESSION_TTL_SECONDS,
  sendJson,
  secretsConfigured,
  constantTimeEqual,
  issueSessionCookie,
  clearSessionCookie,
  hasValidSession,
  revokeSession
};
