const fs = require('node:fs');
const source = fs.readFileSync('db/migrations/001_create_dynamic_qr_tables.sql', 'utf8');
const sql = source.split('\n').filter(line => !line.trimStart().startsWith('--')).join('\n');
const tableDefinitions = [...sql.matchAll(/CREATE TABLE IF NOT EXISTS [^(]+\(([\s\S]*?)\);/gi)]
  .map(match => match[1]).join('\n');
const assert = (condition, message) => {
  if (!condition) { console.error('FAIL:', message); process.exitCode = 1; }
  else console.log('PASS:', message);
};

assert(/CREATE TABLE IF NOT EXISTS qr_links/i.test(sql), 'persistent QR links table is defined');
assert(/CREATE TABLE IF NOT EXISTS qr_scan_events/i.test(sql), 'scan events table is defined');
assert(/slug VARCHAR\(64\) NOT NULL UNIQUE/i.test(sql), 'slug uniqueness is enforced');
assert(/\{22,64\}/.test(sql), 'slug has minimum entropy-compatible encoded length');
assert(/destination_url ~\* '\^https\?:\/\//i.test(sql), 'database rejects non-HTTP(S) destination schemes');
assert(/status IN \('active', 'paused', 'expired', 'deleted'\)/i.test(sql), 'link lifecycle states are constrained');
assert(/expires_at > starts_at/i.test(sql), 'expiry must be later than start');
assert(/REFERENCES qr_links\(id\) ON DELETE RESTRICT/i.test(sql), 'scan events cannot orphan their QR link');
assert(/country_code ~ '\^\[A-Z\]\{2\}\$'/i.test(sql), 'country data is limited to ISO-style two-letter codes');
assert(/device_class IN \('mobile', 'desktop', 'tablet', 'unknown'\)/i.test(sql), 'device classification is bounded');
assert(/referrer_class IN \('direct', 'search', 'social', 'other', 'unknown'\)/i.test(sql), 'referrer classification is bounded');
assert(/qr_scan_events_link_time_idx/i.test(sql), 'link/time analytics index is defined');
assert(/qr_links_created_idx/i.test(sql), 'single-admin QR listing index is defined');
assert(!/\bowner_id\b/i.test(tableDefinitions), 'single-primary-Admin schema has no per-owner identifier');
assert(tableDefinitions.length > 0 && !/\b(ip_address|email|phone|full_referrer_url|raw_user_agent)\b/i.test(tableDefinitions), 'table columns contain no direct visitor identifiers');
assert(/BEGIN;[\s\S]*COMMIT;/i.test(sql), 'migration is transactional');
if (process.exitCode) process.exit(process.exitCode);
