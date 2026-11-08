'use strict';

/**
 * Strict same-origin guard for cookie-authenticated state-changing requests.
 * Preserve the existing Vercel forwarded-protocol behavior; fail closed when
 * Origin or Host is missing or malformed.
 */
function isSameOriginRequest(req) {
  const headers = req && req.headers;
  const origin = headers && headers.origin;
  const host = headers && headers.host;
  if (typeof origin !== 'string' || !origin || typeof host !== 'string' || !host) return false;

  try {
    const parsedOrigin = new URL(origin);
    if (
      parsedOrigin.username ||
      parsedOrigin.password ||
      parsedOrigin.pathname !== '/' ||
      parsedOrigin.search ||
      parsedOrigin.hash
    ) return false;

    const forwardedProto = String(headers['x-forwarded-proto'] || '')
      .split(',')[0]
      .trim()
      .toLowerCase();
    const protocol = forwardedProto ||
      (/^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(host) ? 'http' : 'https');

    if (protocol !== 'https' && protocol !== 'http') return false;
    const expectedOrigin = new URL(protocol + '://' + host).origin;
    return parsedOrigin.origin === expectedOrigin;
  } catch {
    return false;
  }
}

module.exports = { isSameOriginRequest };
