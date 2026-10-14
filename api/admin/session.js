const { sendJson, secretsConfigured, hasValidSession } = require('../_adminAuth');

module.exports = function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(res, 405, { authenticated: false, error: 'Method tidak diizinkan.' });
  }
  const authenticated = secretsConfigured() && hasValidSession(req);
  return sendJson(res, 200, { authenticated });
};
