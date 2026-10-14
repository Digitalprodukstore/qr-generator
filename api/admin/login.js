const {
  sendJson, secretsConfigured, constantTimeEqual, issueSessionCookie
} = require('../_adminAuth');

module.exports = function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method tidak diizinkan.' });
  }
  if (!secretsConfigured()) {
    return sendJson(res, 503, { error: 'Autentikasi Admin belum dikonfigurasi di environment server.' });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const pin = typeof body.pin === 'string' ? body.pin.trim() : '';
  const valid = constantTimeEqual(email, process.env.ADMIN_EMAIL.trim().toLowerCase()) &&
    constantTimeEqual(password, process.env.ADMIN_PASSWORD) &&
    constantTimeEqual(pin, process.env.ADMIN_PIN);

  if (!valid) return sendJson(res, 401, { authenticated: false, error: 'Email, kata sandi, atau PIN tidak sesuai.' });

  issueSessionCookie(res);
  return sendJson(res, 200, { authenticated: true });
};
