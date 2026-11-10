const { neon } = require('@neondatabase/serverless');
const { sendJson, hasValidSession } = require('../_adminAuth');

const QUERY_TIMEOUT_MS = 7000;

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Pragma', 'no-cache');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(res, 405, { connected: false, error: 'Method tidak diizinkan.' });
  }

  if (!(await hasValidSession(req))) {
    return sendJson(res, 401, { connected: false, error: 'Sesi admin tidak valid.' });
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return sendJson(res, 503, {
      connected: false,
      error: 'DATABASE_URL belum tersedia pada environment Preview.'
    });
  }

  let parsed;
  try {
    parsed = new URL(connectionString);
  } catch {
    return sendJson(res, 503, { connected: false, error: 'Konfigurasi database tidak valid.' });
  }

  if (
    !['postgres:', 'postgresql:'].includes(parsed.protocol) ||
    !parsed.hostname.endsWith('.neon.tech')
  ) {
    return sendJson(res, 503, {
      connected: false,
      error: 'DATABASE_URL tidak menunjuk ke host Neon yang diharapkan.'
    });
  }

  const startedAt = Date.now();
  let timeout;
  try {
    const sql = neon(connectionString);
    const query = sql`SELECT 1 AS health_check`;
    const deadline = new Promise((_, reject) => {
      timeout = setTimeout(() => reject(new Error('DATABASE_HEALTH_TIMEOUT')), QUERY_TIMEOUT_MS);
    });
    const rows = await Promise.race([query, deadline]);
    if (!Array.isArray(rows) || Number(rows[0]?.health_check) !== 1) {
      throw new Error('DATABASE_HEALTH_INVALID_RESPONSE');
    }
    return sendJson(res, 200, {
      connected: true,
      check: 'SELECT 1',
      latencyMs: Date.now() - startedAt
    });
  } catch {
    return sendJson(res, 503, {
      connected: false,
      error: 'Koneksi database Preview gagal atau melewati batas waktu.'
    });
  } finally {
    clearTimeout(timeout);
  }
};
