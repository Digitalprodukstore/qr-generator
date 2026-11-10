const { sendJson, clearSessionCookie, revokeSession } = require('../_adminAuth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method tidak diizinkan.' });
  }
  clearSessionCookie(res);
  try {
    await revokeSession(req);
    return sendJson(res, 200, { authenticated: false, revoked: true });
  } catch {
    // The browser cookie is cleared; if Redis is unavailable, the server-side
    // session remains time-limited by its original eight-hour expiration.
    return sendJson(res, 503, { authenticated: false, revoked: false, error: 'Cookie lokal dihapus, tetapi pencabutan sesi server belum terkonfirmasi.' });
  }
};
