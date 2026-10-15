const {
  sendJson, secretsConfigured, constantTimeEqual, issueSessionCookie
} = require('../_adminAuth');

const MAX_LOGIN_BODY_BYTES = 4096;

module.exports = function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method tidak diizinkan.' });
  }
  if (!secretsConfigured()) {
    return sendJson(res, 503, { error: 'Autentikasi Admin belum dikonfigurasi di environment server.' });
  }

  const contentType = String(req.headers['content-type'] || '').toLowerCase();
  if (!contentType.startsWith('application/json')) {
    return sendJson(res, 415, { error: 'Gunakan Content-Type application/json.' });
  }

  const body = req.body && typeof req.body === 'object' && !Array.isArray(req.body)
    ? req.body
    : null;
  if (!body) {
    return sendJson(res, 400, { error: 'Format permintaan login tidak valid.' });
  }

  let bodyBytes;
  try {
    bodyBytes = Buffer.byteLength(JSON.stringify(body), 'utf8');
  } catch {
    return sendJson(res, 400, { error: 'Format permintaan login tidak valid.' });
  }
  if (bodyBytes > MAX_LOGIN_BODY_BYTES) {
    return sendJson(res, 413, { error: 'Permintaan login terlalu besar.' });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const pin = typeof body.pin === 'string' ? body.pin.trim() : '';

  if (email.length > 254 || password.length > 1024 || pin.length > 128) {
    return sendJson(res, 400, { error: 'Format kredensial tidak valid.' });
  }

  // Evaluate each comparison before combining the results to avoid short-circuiting
  // the credential checks on the first mismatch.
  const emailMatches = constantTimeEqual(email, process.env.ADMIN_EMAIL.trim().toLowerCase());
  const passwordMatches = constantTimeEqual(password, process.env.ADMIN_PASSWORD);
  const pinMatches = constantTimeEqual(pin, process.env.ADMIN_PIN);
  const valid = emailMatches & passwordMatches & pinMatches;

  if (!valid) return sendJson(res, 401, { authenticated: false, error: 'Email, kata sandi, atau PIN tidak sesuai.' });

  issueSessionCookie(res);
  return sendJson(res, 200, { authenticated: true });
};
