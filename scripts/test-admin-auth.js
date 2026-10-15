const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const login = require('../api/admin/login');
const session = require('../api/admin/session');
const logout = require('../api/admin/logout');
const { checkAdminLoginRateLimit, MAX_ATTEMPTS, WINDOW_SECONDS } = require('../api/_adminRateLimit');

const testSecrets = {
  ADMIN_EMAIL: ['admin', 'example.test'].join('@'),
  ADMIN_PASSWORD: ['test', 'only', 'password'].join('-'),
  ADMIN_PIN: ['48', '2951'].join(''),
  ADMIN_SESSION_SECRET: 'x'.repeat(40)
};
Object.assign(process.env, testSecrets);
delete process.env.UPSTASH_REDIS_REST_URL;
delete process.env.UPSTASH_REDIS_REST_TOKEN;

async function call(handler, method, body = {}, headers = {}) {
  const res = {
    headers: {}, statusCode: 200, body: '',
    setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
    end(v = '') { this.body = v; },
    json() { return JSON.parse(this.body); }
  };
  await handler({ method, body, headers: { 'content-type': 'application/json', ...headers } }, res);
  return res;
}
async function test(name, fn) {
  try { await fn(); console.log('PASS:', name); }
  catch (e) { console.error('FAIL:', name, e.message); process.exitCode = 1; }
}
(async () => {
  await test('login rejects wrong HTTP method', async () => assert.equal((await call(login, 'GET')).statusCode, 405));
  await test('login rejects non-JSON request', async () => assert.equal((await call(login, 'POST', {}, { 'content-type': 'text/plain' })).statusCode, 415));
  await test('login rejects JSONP-like content type', async () => assert.equal((await call(login, 'POST', {}, { 'content-type': 'application/jsonp' })).statusCode, 415));
  await test('login rejects missing body', async () => assert.equal((await call(login, 'POST', null)).statusCode, 400));
  await test('login rejects oversized credentials', async () => assert.equal((await call(login, 'POST', { email: 'a'.repeat(255), password: 'x', pin: '1' })).statusCode, 400));
  await test('login rejects incorrect password', async () => {
    const r = await call(login, 'POST', { email: process.env.ADMIN_EMAIL, password: 'wrong', pin: process.env.ADMIN_PIN });
    assert.equal(r.statusCode, 401);
    assert.equal(r.json().authenticated, false);
  });
  await test('login rejects incorrect PIN', async () => assert.equal((await call(login, 'POST', { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD, pin: 'wrong' })).statusCode, 401));
  await test('valid login issues protected cookie and session validates', async () => {
    const r = await call(login, 'POST', { email: process.env.ADMIN_EMAIL.toUpperCase(), password: process.env.ADMIN_PASSWORD, pin: process.env.ADMIN_PIN });
    assert.equal(r.statusCode, 200);
    assert.match(r.headers['set-cookie'], /HttpOnly/);
    assert.match(r.headers['set-cookie'], /Secure/);
    assert.match(r.headers['set-cookie'], /SameSite=Strict/);
    assert.match(r.headers['set-cookie'], /Path=\//);
    const cookie = r.headers['set-cookie'].split(';')[0];
    assert.equal((await call(session, 'GET', {}, { cookie })).json().authenticated, true);
  });
  await test('tampered session cookie is rejected', async () => assert.equal((await call(session, 'GET', {}, { cookie: 'qr_admin_session=1799999999.invalid' })).json().authenticated, false));
  await test('expired but correctly signed session is rejected', async () => {
    const expiry = String(Math.floor(Date.now() / 1000) - 60);
    const signature = crypto.createHmac('sha256', process.env.ADMIN_SESSION_SECRET).update(expiry).digest('base64url');
    const r = await call(session, 'GET', {}, { cookie: `qr_admin_session=${expiry}.${signature}` });
    assert.equal(r.json().authenticated, false);
  });
  await test('session endpoint rejects wrong HTTP method', async () => assert.equal((await call(session, 'POST')).statusCode, 405));
  await test('logout clears cookie', async () => {
    const r = await call(logout, 'POST');
    assert.equal(r.statusCode, 200);
    assert.match(r.headers['set-cookie'], /Max-Age=0/);
  });
  await test('logout rejects wrong HTTP method', async () => assert.equal((await call(logout, 'GET')).statusCode, 405));
  await test('login fails closed when session secret is too short', async () => {
    const previous = process.env.ADMIN_SESSION_SECRET;
    process.env.ADMIN_SESSION_SECRET = 'short';
    try { assert.equal((await call(login, 'POST', {})).statusCode, 503); }
    finally { process.env.ADMIN_SESSION_SECRET = previous; }
  });
  await test('rate limiter remains inactive without its optional backend configured', async () => {
    assert.deepEqual(await checkAdminLoginRateLimit({ headers: {} }), { configured: false, limited: false });
  });
  await test('rate limiter fails closed on incomplete backend configuration', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://example.test';
    try { assert.deepEqual(await checkAdminLoginRateLimit({ headers: {} }), { configured: true, error: true }); }
    finally { delete process.env.UPSTASH_REDIS_REST_URL; }
  });
  await test('rate limiter blocks requests beyond the configured threshold', async () => {
    const oldFetch = global.fetch;
    const oldUrl = process.env.UPSTASH_REDIS_REST_URL;
    const oldToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    let count = MAX_ATTEMPTS + 1;
    global.fetch = async () => ({ ok: true, json: async () => [{ result: count }, { result: count === 1 ? 1 : 0 }] });
    process.env.UPSTASH_REDIS_REST_URL = 'https://example.test';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';
    try {
      const result = await checkAdminLoginRateLimit({ headers: { 'x-forwarded-for': '203.0.113.7' } });
      assert.equal(result.limited, true);
      assert.equal(result.remaining, 0);
      assert.equal(WINDOW_SECONDS, 600);
    } finally {
      global.fetch = oldFetch;
      if (oldUrl === undefined) delete process.env.UPSTASH_REDIS_REST_URL; else process.env.UPSTASH_REDIS_REST_URL = oldUrl;
      if (oldToken === undefined) delete process.env.UPSTASH_REDIS_REST_TOKEN; else process.env.UPSTASH_REDIS_REST_TOKEN = oldToken;
    }
  });
  if (process.exitCode) process.exit(process.exitCode);
})().catch(error => { console.error(error); process.exit(1); });
