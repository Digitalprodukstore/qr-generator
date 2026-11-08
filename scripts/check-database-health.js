'use strict';

const assert = require('node:assert/strict');
const Module = require('node:module');

let sessionValid = false;
let databaseRows = [{ health_check: 1 }];
let queryCalls = [];
let connectionUsed = null;

const originalLoad = Module._load;
Module._load = function(request, parent, isMain) {
  if (request === '@neondatabase/serverless') {
    return {
      neon(connectionString) {
        connectionUsed = connectionString;
        return async (strings, ...values) => {
          const statement = strings.reduce((out, part, index) => out + part + (values[index] ?? ''), '');
          queryCalls.push(statement.replace(/\\s+/g, ' ').trim());
          if (databaseRows instanceof Error) throw databaseRows;
          return databaseRows;
        };
      }
    };
  }
  if (request === '../_adminAuth' && parent && parent.filename.endsWith('/api/admin/database-health.js')) {
    return {
      sendJson(res, status, payload) {
        res.statusCode = status;
        res.headers = res.headers || {};
        res.end(JSON.stringify(payload));
      },
      async hasValidSession() {
        return sessionValid;
      }
    };
  }
  return originalLoad.call(this, request, parent, isMain);
};

const handler = require('../api/admin/database-health');
Module._load = originalLoad;

function response() {
  return {
    statusCode: 200,
    headers: {},
    setHeader(name, value) { this.headers[name] = value; },
    end(body) { this.body = body; }
  };
}

async function invoke(method = 'GET') {
  const res = response();
  await handler({ method, headers: {} }, res);
  return { ...res, payload: res.body ? JSON.parse(res.body) : null };
}

async function run() {
  let passed = 0;
  async function test(name, fn) {
    await fn();
    passed += 1;
    process.stdout.write('PASS ' + name + '\\n');
  }

  const originalDatabaseUrl = process.env.DATABASE_URL;
  try {
    process.env.DATABASE_URL = 'postgresql://probe:secret@ep-example.neon.tech/db?sslmode=require';
    sessionValid = false;
    queryCalls = [];
    await test('rejects non-GET methods', async () => {
      const result = await invoke('POST');
      assert.equal(result.statusCode, 405);
      assert.equal(result.headers.Allow, 'GET');
      assert.equal(queryCalls.length, 0);
    });

    await test('requires a valid Admin session before database access', async () => {
      const result = await invoke();
      assert.equal(result.statusCode, 401);
      assert.equal(queryCalls.length, 0);
    });

    sessionValid = true;
    await test('fails safely when DATABASE_URL is missing', async () => {
      delete process.env.DATABASE_URL;
      const result = await invoke();
      assert.equal(result.statusCode, 503);
      assert.equal(result.payload.connected, false);
      assert.equal(queryCalls.length, 0);
    });

    await test('rejects a non-Neon database host', async () => {
      process.env.DATABASE_URL = 'postgresql://probe:secret@neon.tech.evil.example/db';
      const result = await invoke();
      assert.equal(result.statusCode, 503);
      assert.equal(queryCalls.length, 0);
    });

    await test('executes only the read-only health query and returns no credentials', async () => {
      process.env.DATABASE_URL = 'postgresql://probe:secret@ep-example.neon.tech/db?sslmode=require';
      databaseRows = [{ health_check: 1 }];
      queryCalls = [];
      const result = await invoke();
      assert.equal(result.statusCode, 200);
      assert.equal(result.payload.connected, true);
      assert.equal(result.payload.check, 'SELECT 1');
      assert.equal(queryCalls.length, 1);
      assert.equal(queryCalls[0], 'SELECT 1 AS health_check');
      assert.equal(connectionUsed, process.env.DATABASE_URL);
      assert.equal(JSON.stringify(result.payload).includes('secret'), false);
      assert.equal(JSON.stringify(result.payload).includes('neon.tech'), false);
    });

    await test('rejects empty or malformed health-query results', async () => {
      for (const invalidRows of [[], [{}], [{ health_check: 0 }], null]) {
        databaseRows = invalidRows;
        const result = await invoke();
        assert.equal(result.statusCode, 503);
        assert.equal(result.payload.connected, false);
        assert.equal(JSON.stringify(result.payload).includes('health_check'), false);
      }
    });

    await test('returns a generic error when the database query fails', async () => {
      databaseRows = new Error('sensitive database details');
      const result = await invoke();
      assert.equal(result.statusCode, 503);
      assert.equal(result.payload.connected, false);
      assert.equal(JSON.stringify(result.payload).includes('sensitive database details'), false);
    });
  } finally {
    if (originalDatabaseUrl === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = originalDatabaseUrl;
  }

  process.stdout.write('\\n' + passed + '/7 database health test groups passed.\\n');
}

run().catch(error => {
  process.stderr.write((error && error.stack) || String(error));
  process.exitCode = 1;
});
