const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const login = require('../api/admin/login');
const session = require('../api/admin/session');
const logout = require('../api/admin/logout');
const settingsHandler = require('../api/admin/settings');
const { checkAdminLoginRateLimit, MAX_ATTEMPTS, WINDOW_SECONDS } = require('../api/_adminRateLimit');
const { fetchRedisJson, REDIS_TIMEOUT_MS } = require('../api/_redisFetch');

const testSecrets = {
  ADMIN_EMAIL: ['admin', 'example.test'].join('@'),
  ADMIN_PASSWORD: ['test', 'only', 'password'].join('-'),
  ADMIN_PIN: ['48', '2951'].join(''),
  ADMIN_SESSION_SECRET: 'x'.repeat(40)
};
Object.assign(process.env, testSecrets);
process.env.UPSTASH_REDIS_REST_URL = 'https://redis.example.test';
process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';
const redis = new Map();
const rateCounts = new Map();
global.fetch = async (url, options = {}) => {
  const commands = JSON.parse(options.body || 'null');
  if (String(url).endsWith('/pipeline')) {
    if (commands[0][0] === 'INCR') {
      const key = commands[0][1];
      const count = (rateCounts.get(key) || 0) + 1;
      rateCounts.set(key, count);
      return { ok: true, json: async () => [{ result: count }, { result: count === 1 ? 1 : 0 }] };
    }
    const results = commands.map(([command, key, value]) => {
      if (command === 'GET') return { result: redis.get(key) ?? null };
      if (command === 'SET') { redis.set(key, value); return { result: 'OK' }; }
      return { error: 'unsupported command' };
    });
    return { ok: true, json: async () => results };
  }
  if (!Array.isArray(commands)) return { ok: false, json: async () => ({ error: 'invalid command' }) };
  const [command, key, value] = commands;
  if (command === 'SET') {
    redis.set(key, value);
    return { ok: true, json: async () => ({ result: 'OK' }) };
  }
  if (command === 'GET') {
    return { ok: true, json: async () => ({ result: redis.get(key) ?? null }) };
  }
  if (command === 'DEL') {
    const existed = redis.delete(key);
    return { ok: true, json: async () => ({ result: existed ? 1 : 0 }) };
  }
  return { ok: false, json: async () => ({ error: 'unsupported command' }) };
};

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
  await test('Redis requests have a bounded timeout and abort the request', async () => {
    const oldFetch = global.fetch;
    let signal;
    global.fetch = async (_url, options) => {
      signal = options.signal;
      return new Promise(() => {});
    };
    try {
      await assert.rejects(fetchRedisJson('https://redis.example.test', {}, 20), error => error.code === 'REDIS_TIMEOUT');
      assert.equal(signal.aborted, true);
      assert.equal(REDIS_TIMEOUT_MS, 5000);
    } finally { global.fetch = oldFetch; }
  });
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
  await test('rate limiter fails closed when backend is not configured', async () => {
    const oldUrl = process.env.UPSTASH_REDIS_REST_URL;
    const oldToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    try { assert.deepEqual(await checkAdminLoginRateLimit({ headers: {} }), { configured: false, error: true }); }
    finally {
      process.env.UPSTASH_REDIS_REST_URL = oldUrl;
      process.env.UPSTASH_REDIS_REST_TOKEN = oldToken;
    }
  });
  await test('rate limiter fails closed on incomplete backend configuration', async () => {
    const oldToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    try { assert.deepEqual(await checkAdminLoginRateLimit({ headers: {} }), { configured: false, error: true }); }
    finally { process.env.UPSTASH_REDIS_REST_TOKEN = oldToken; }
  });
  await test('rate limiter blocks requests beyond the configured threshold', async () => {
    const oldFetch = global.fetch;
    const oldUrl = process.env.UPSTASH_REDIS_REST_URL;
    const oldToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    let count = MAX_ATTEMPTS + 1;
    global.fetch = async (url, options) => {
      assert.ok(url.endsWith('/pipeline'));
      assert.equal(options.method, 'POST');
      const commands = JSON.parse(options.body);
      assert.equal(commands[0][0], 'INCR');
      assert.equal(commands[1][0], 'EXPIRE');
      assert.equal(commands[1][3], 'NX');
      return { ok: true, json: async () => [{ result: count }, { result: count === 1 ? 1 : 0 }] };
    };
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
  function validAdminCookie() {
    const expiry = String(Math.floor(Date.now() / 1000) + 3600);
    const sessionId = 'a'.repeat(64);
    const signature = crypto.createHmac('sha256', process.env.ADMIN_SESSION_SECRET)
      .update(expiry + '.' + sessionId).digest('base64url');
    redis.set('qr-admin-session:' + sessionId, '1');
    return 'qr_admin_session=' + expiry + '.' + sessionId + '.' + signature;
  }
  const validSettings = {
    ad: { adMode: 'sponsor', autoAds: false, pubId: '', slotId: '', sponsorName: 'Sponsor', sponsorLink: 'https://example.org', sponsorTagline: 'Info' },
    enabledTypes: Object.fromEntries(['url','text','wifi','wa','email','tel','sms','vcard','review','social','menu','geo','pdf','multilink','form','event','invitation','app'].map(id => [id, true]))
  };
  await test('public settings GET returns defaults without an Admin session', async () => {
    const r = await call(settingsHandler, 'GET', {}, { host: 'qr.example.test' });
    assert.equal(r.statusCode, 200);
    assert.equal(r.json().configured, false);
    assert.equal(r.json().settings.enabledTypes.url, true);
  });
  await test('settings PUT rejects unauthenticated requests', async () => {
    const r = await call(settingsHandler, 'PUT', validSettings, {
      host: 'qr.example.test', origin: 'https://qr.example.test'
    });
    assert.equal(r.statusCode, 401);
  });
  await test('settings PUT rejects cross-origin requests even with a valid session', async () => {
    const r = await call(settingsHandler, 'PUT', validSettings, {
      host: 'qr.example.test', origin: 'https://attacker.example', cookie: validAdminCookie()
    });
    assert.equal(r.statusCode, 403);
  });
  await test('settings PUT rejects requests with a missing Origin header', async () => {
    const r = await call(settingsHandler, 'PUT', validSettings, {
      host: 'qr.example.test', cookie: validAdminCookie()
    });
    assert.equal(r.statusCode, 403);
  });
  await test('settings PUT accepts IPv4 localhost same-origin requests', async () => {
    const r = await call(settingsHandler, 'PUT', validSettings, {
      host: '127.0.0.1:3000', origin: 'http://127.0.0.1:3000', cookie: validAdminCookie()
    });
    assert.equal(r.statusCode, 200);
  });
  await test('settings PUT rejects unsafe sponsor URL schemes', async () => {
    const payload = { ...validSettings, ad: { ...validSettings.ad, sponsorLink: 'javascript:alert(1)' } };
    const r = await call(settingsHandler, 'PUT', payload, {
      host: 'qr.example.test', origin: 'https://qr.example.test', cookie: validAdminCookie()
    });
    assert.equal(r.statusCode, 400);
  });
  await test('settings PUT accepts same-origin authenticated requests and persists settings', async () => {
    const r = await call(settingsHandler, 'PUT', validSettings, {
      host: 'qr.example.test', origin: 'https://qr.example.test', cookie: validAdminCookie()
    });
    assert.equal(r.statusCode, 200);
    assert.equal(r.json().saved, true);
    assert.equal(r.json().settings.enabledTypes.url, true);
  });
  await test('settings PUT rejects malformed settings after authentication', async () => {
    const r = await call(settingsHandler, 'PUT', { ad: {}, enabledTypes: {} }, {
      host: 'qr.example.test', origin: 'https://qr.example.test', cookie: validAdminCookie()
    });
    assert.equal(r.statusCode, 400);
  });
  if (process.exitCode) process.exit(process.exitCode);
})().catch(error => { console.error(error); process.exit(1); });
