const assert = require('node:assert/strict');
const login = require('../api/admin/login');
const session = require('../api/admin/session');
const logout = require('../api/admin/logout');

process.env.ADMIN_EMAIL = ['admin', 'example.test'].join('@');
process.env.ADMIN_PASSWORD = ['test', 'only', 'password'].join('-');
process.env.ADMIN_PIN = ['48', '2951'].join('');
process.env.ADMIN_SESSION_SECRET = 'x'.repeat(40);

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
test('wrong HTTP method is rejected', () => assert.equal(call(login, 'GET').statusCode, 405));
test('non-JSON login is rejected', () => assert.equal(call(login, 'POST', {}, { 'content-type': 'text/plain' }).statusCode, 415));
test('missing body is rejected', () => assert.equal(call(login, 'POST', null).statusCode, 400));
test('incorrect credentials are rejected', () => {
  const r = call(login, 'POST', { email: process.env.ADMIN_EMAIL, password: 'wrong', pin: process.env.ADMIN_PIN });
  assert.equal(r.statusCode, 401);
  assert.equal(r.json().authenticated, false);
});
test('valid login issues protected cookie and session validates', () => {
  const r = call(login, 'POST', { email: process.env.ADMIN_EMAIL.toUpperCase(), password: process.env.ADMIN_PASSWORD, pin: process.env.ADMIN_PIN });
  assert.equal(r.statusCode, 200);
  assert.match(r.headers['set-cookie'], /HttpOnly/);
  assert.match(r.headers['set-cookie'], /Secure/);
  assert.match(r.headers['set-cookie'], /SameSite=Strict/);
  const cookie = r.headers['set-cookie'].split(';')[0];
  assert.equal(call(session, 'GET', {}, { cookie }).json().authenticated, true);
});
test('tampered session cookie is rejected', () => {
  const r = call(session, 'GET', {}, { cookie: 'qr_admin_session=1799999999.invalid' });
  assert.equal(r.json().authenticated, false);
});
test('logout clears cookie', () => {
  const r = call(logout, 'POST');
  assert.equal(r.statusCode, 200);
  assert.match(r.headers['set-cookie'], /Max-Age=0/);
});
test('logout rejects wrong method', () => assert.equal(call(logout, 'GET').statusCode, 405));
if (process.exitCode) process.exit(process.exitCode);
