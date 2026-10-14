const crypto = require('node:crypto');

const COOKIE_NAME = 'qr_admin_session';
const SESSION_TTL_SECONDS = 8 * 60 * 60;

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

function constantTimeEqual(left, right) {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function signExpiry(expiry) {
  return crypto.createHmac('sha256', process.env.ADMIN_SESSION_SECRET)
    .update(String(expiry))
    .digest('base64url');
}

function issueSessionCookie(res) {
  const expiry = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const value = expiry + '.' + signExpiry(expiry);
  res.setHeader('Set-Cookie',
    COOKIE_NAME + '=' + value + '; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=' + SESSION_TTL_SECONDS
  );
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

function hasValidSession(req) {
  if (!secretsConfigured()) return false;
  const value = readCookie(req, COOKIE_NAME);
  const separator = value.indexOf('.');
  if (separator < 1) return false;
  const expiryText = value.slice(0, separator);
  const signature = value.slice(separator + 1);
  if (!/^\d{10}$/.test(expiryText) || Number(expiryText) <= Math.floor(Date.now() / 1000)) return false;
  return constantTimeEqual(signature, signExpiry(expiryText));
}

module.exports = {
  COOKIE_NAME,
  SESSION_TTL_SECONDS,
  sendJson,
  secretsConfigured,
  constantTimeEqual,
  issueSessionCookie,
  clearSessionCookie,
  hasValidSession
};
