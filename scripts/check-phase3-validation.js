'use strict';

const assert = require('node:assert/strict');
const {
  isValidSlug,
  createSlug,
  validateDestinationUrl,
  normalizeLinkInput
} = require('../api/_dynamicQrValidation');

let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  process.stdout.write('PASS ' + name + '\n');
}

test('creates URL-safe slugs with at least 128 bits of entropy', () => {
  const first = createSlug();
  const second = createSlug();
  assert.match(first, /^[A-Za-z0-9_-]{22}$/);
  assert.notEqual(first, second);
  assert.equal(isValidSlug(first), true);
});

test('accepts HTTP and HTTPS destination URLs', () => {
  assert.equal(validateDestinationUrl('https://example.com/path').valid, true);
  assert.equal(validateDestinationUrl('http://example.com').valid, true);
});

test('rejects non-HTTP schemes and protocol-relative URLs', () => {
  for (const value of ['javascript:alert(1)', 'data:text/html,hello', 'file:///etc/passwd', '//example.com/path']) {
    assert.equal(validateDestinationUrl(value).valid, false, value);
  }
});

test('rejects credential-bearing, whitespace, control, and backslash URLs', () => {
  for (const value of [
    'https://user:pass@example.com',
    'https://example.com/a b',
    'https://example.com/\nheader',
    'https://example.com\\@evil.test'
  ]) {
    assert.equal(validateDestinationUrl(value).valid, false, value);
  }
});

test('rejects malformed and oversized URLs', () => {
  assert.equal(validateDestinationUrl('https://').valid, false);
  assert.equal(validateDestinationUrl('x'.repeat(2049)).valid, false);
  assert.equal(validateDestinationUrl(null).valid, false);
});

test('normalizes valid title and destination input', () => {
  const result = normalizeLinkInput({
    destinationUrl: 'https://example.com/a',
    title: '  Campaign A  '
  });
  assert.equal(result.valid, true);
  assert.equal(result.value.title, 'Campaign A');
  assert.equal(result.value.expiresAt, null);
});

test('rejects invalid titles and past/invalid expiry timestamps', () => {
  assert.equal(normalizeLinkInput({ destinationUrl: 'https://example.com', title: 'x'.repeat(121) }).valid, false);
  assert.equal(normalizeLinkInput({ destinationUrl: 'https://example.com', expiresAt: 'not-a-date' }).valid, false);
  assert.equal(normalizeLinkInput({ destinationUrl: 'https://example.com', expiresAt: '2000-01-01T00:00:00Z' }).valid, false);
});

test('rejects malformed slugs', () => {
  for (const value of ['short', '../admin', 'with space', '', null]) {
    assert.equal(isValidSlug(value), false);
  }
});

process.stdout.write('\n' + passed + '/8 validation groups passed.\n');
