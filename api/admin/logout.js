const { sendJson, clearSessionCookie } = require('../_adminAuth');

module.exports = function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method tidak diizinkan.' });
  }
  clearSessionCookie(res);
  return sendJson(res, 200, { authenticated: false });
};
