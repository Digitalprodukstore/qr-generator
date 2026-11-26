'use strict';

const assert = require('node:assert/strict');
const { isSameOriginRequest } = require('../api/_sameOrigin');

let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  process.stdout.write('PASS ' + name + '\n');
}

test('accepts exact HTTPS origin for matching host', () => {
  assert.equal(isSameOriginRequest({
    headers: { origin: 'https://preview.example.com', host: 'preview.example.com' }
  }), true);
});

test('accepts Vercel forwarded HTTPS protocol', () => {
  assert.equal(isSameOriginRequest({
    headers: {
      origin: 'https://preview.example.com',
      host: 'preview.example.com',
      'x-forwarded-proto': 'https, http'
    }
  }), true);
});

test('accepts local HTTP development origin', () => {
  assert.equal(isSameOriginRequest({
    headers: { origin: 'http://localhost:3000', host: 'localhost:3000' }
  }), true);
});

test('rejects cross-origin host mismatch', () => {
  assert.equal(isSameOriginRequest({
    headers: { origin: 'https://attacker.example', host: 'preview.example.com' }
  }), false);
});

test('rejects missing Origin or Host', () => {
  assert.equal(isSameOriginRequest({ headers: { host: 'preview.example.com' } }), false);
  assert.equal(isSameOriginRequest({ headers: { origin: 'https://preview.example.com' } }), false);
  assert.equal(isSameOriginRequest({ headers: {} }), false);
});

test('rejects Origin with credentials, path, query, or fragment', () => {
  for (const origin of [
    'https://user:pass@preview.example.com',
    'https://preview.example.com/path',
    'https://preview.example.com?x=1',
    'https://preview.example.com#fragment'
  ]) {
    assert.equal(isSameOriginRequest({
      headers: { origin, host: 'preview.example.com' }
    }), false, origin);
  }
});

test('rejects invalid protocols and malformed host values', () => {
  assert.equal(isSameOriginRequest({
    headers: {
      origin: 'https://preview.example.com',
      host: 'preview.example.com',
      'x-forwarded-proto': 'javascript'
    }
  }), false);
  assert.equal(isSameOriginRequest({
    headers: { origin: 'not a url', host: 'preview.example.com' }
  }), false);
});

process.stdout.write('\n' + passed + '/7 same-origin test groups passed.\n');
