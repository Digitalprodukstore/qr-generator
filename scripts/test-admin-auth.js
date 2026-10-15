const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const login = require('../api/admin/login');
const session = require('../api/admin/session');
const logout = require('../api/admin/logout');

const testSecrets = {
  ADMIN_EMAIL: ['admin', 'example.test'].join('@'),
  ADMIN_PASSWORD: ['test', 'only', 'password'].join('-'),
  ADMIN_PIN: ['48', '2951'].join(''),
  ADMIN_SESSION_SECRET: 'x'.repeat(40)
};
Object.assign(process.env, testSecrets);

function call(handler, method, body = {}, headers = {}) {
  const res = {
    headers: {}, statusCode: 200, body: '',
    setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
    end(v = '') { this.body = v; },
    json() { return JSON.parse(this.body); }
  };
  handler({ method, body, headers: { 'content-type': 'application/json', ...headers } }, res);
  return res;
}
function test(name, fn) {
  try { fn(); console.log('PASS:', name); }
  catch (e) { console.error('FAIL:', name, e.message); process.exitCode = 1; }
}
test('login rejects wrong HTTP method', () => assert.equal(call(login, 'GET').statusCode, 405));
test('login rejects non-JSON request', () => assert.equal(call(login, 'POST', {}, { 'content-type': 'text/plain' }).statusCode, 415));
test('login rejects JSONP-like content type', () => assert.equal(call(login, 'POST', {}, { 'content-type': 'application/jsonp' }).statusCode, 415));
test('login rejects missing body', () => assert.equal(call(login, 'POST', null).statusCode, 400));
test('login rejects oversized credentials', () => assert.equal(call(login, 'POST', { email: 'a'.repeat(255), password: 'x', pin: '1' }).statusCode, 400));
test('login rejects incorrect password', () => {
  const r = call(login, 'POST', { email: process.env.ADMIN_EMAIL, password: 'wrong', pin: process.env.ADMIN_PIN });
  assert.equal(r.statusCode, 401);
  assert.equal(r.json().authenticated, false);
});
test('login rejects incorrect PIN', () => assert.equal(call(login, 'POST', { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD, pin: 'wrong' }).statusCode, 401));
test('valid login issues protected cookie and session validates', () => {
  const r = call(login, 'POST', { email: process.env.ADMIN_EMAIL.toUpperCase(), password: process.env.ADMIN_PASSWORD, pin: process.env.ADMIN_PIN });
  assert.equal(r.statusCode, 200);
  assert.match(r.headers['set-cookie'], /HttpOnly/);
  assert.match(r.headers['set-cookie'], /Secure/);
  assert.match(r.headers['set-cookie'], /SameSite=Strict/);
  assert.match(r.headers['set-cookie'], /Path=\//);
  const cookie = r.headers['set-cookie'].split(';')[0];
  assert.equal(call(session, 'GET', {}, { cookie }).json().authenticated, true);
});
test('tampered session cookie is rejected', () => {
  const r = call(session, 'GET', {}, { cookie: 'qr_admin_session=1799999999.invalid' });
  assert.equal(r.json().authenticated, false);
});
test('expired but correctly signed session is rejected', () => {
  const expiry = String(Math.floor(Date.now() / 1000) - 60);
  const signature = crypto.createHmac('sha256', process.env.ADMIN_SESSION_SECRET).update(expiry).digest('base64url');
  const r = call(session, 'GET', {}, { cookie: `qr_admin_session=${expiry}.${signature}` });
  assert.equal(r.json().authenticated, false);
});
test('session endpoint rejects wrong HTTP method', () => assert.equal(call(session, 'POST').statusCode, 405));
test('logout clears cookie', () => {
  const r = call(logout, 'POST');
  assert.equal(r.statusCode, 200);
  assert.match(r.headers['set-cookie'], /Max-Age=0/);
});
test('logout rejects wrong HTTP method', () => assert.equal(call(logout, 'GET').statusCode, 405));
test('login fails closed when session secret is too short', () => {
  const previous = process.env.ADMIN_SESSION_SECRET;
  process.env.ADMIN_SESSION_SECRET = 'short';
  try { assert.equal(call(login, 'POST', {}).statusCode, 503); }
  finally { process.env.ADMIN_SESSION_SECRET = previous; }
});
if (process.exitCode) process.exit(process.exitCode);
