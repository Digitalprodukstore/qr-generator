const { sendJson, secretsConfigured, hasValidSession } = require('../_adminAuth');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(res, 405, { authenticated: false, error: 'Method tidak diizinkan.' });
  }
  if (!secretsConfigured()) return sendJson(res, 200, { authenticated: false });
  const authenticated = await hasValidSession(req);
  return sendJson(res, 200, { authenticated });
};
