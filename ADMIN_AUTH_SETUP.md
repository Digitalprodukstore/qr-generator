# QR Generator Admin authentication setup

The Admin login is now designed to authenticate on the server. Do not merge/deploy this change until the required Vercel environment variables are configured for Preview and Production.

## Required environment variables

Set these in Vercel → Project Settings → Environment Variables:

- `ADMIN_EMAIL`: the new administrator email address.
- `ADMIN_PASSWORD`: a new, unique, strong password (do not reuse the old demo credential).
- `ADMIN_PIN`: a new PIN or passphrase. Use a value not present in the previous frontend code.
- `ADMIN_SESSION_SECRET`: a cryptographically random secret of at least 32 characters. Generate a unique value and never commit it to GitHub.

Configure variables for both **Preview** and **Production** as appropriate, then redeploy the matching deployment after adding them. Do not paste secrets into chat, source files, issues, or pull-request comments.

## Behavior

- Credentials are checked by `/api/admin/login`, not by browser JavaScript.
- Successful login issues an eight-hour signed session cookie marked HttpOnly, Secure, and SameSite=Strict.
- `/api/admin/session` validates the cookie on page load; browser storage is not treated as proof of authentication.
- `/api/admin/logout` clears the session cookie.
- If server secrets are missing, login fails closed with a configuration error.
- Public QR generation, QR PNG export, and sharing remain on the public page.

## Important migration note

The former demo credentials were embedded in the old client-side HTML and therefore must be considered exposed. Replace them with new values before deploying this change. Git history may retain old source snapshots; rotating the credentials is essential.


## Required shared session store and login rate limiting

Upstash Redis is a **required dependency** for Admin authentication, session validation/revocation, global settings persistence, and login rate limiting. Configure these environment variables in Vercel **Preview** before attempting live Admin acceptance:

- `UPSTASH_REDIS_REST_URL`: the database REST URL.
- `UPSTASH_REDIS_REST_TOKEN`: the database REST token.

Keep both values secret. Login is limited to 10 attempts per Vercel-reported client IP per 10-minute window. The counter and active session records are stored in Redis, not in process memory. If either variable is missing, the backend is incomplete, or Redis returns an error, Admin login fails closed with HTTP 503; there is no unprotected fallback mode. Global settings reads/writes and session validation also fail closed when Redis is unavailable.

The rate limiter uses Vercel's normalized `x-real-ip` header and falls back to `x-forwarded-for`. Vercel documents these as equivalent client-IP headers and states it overwrites `X-Forwarded-For` to prevent IP spoofing. If this application is later placed behind another proxy, reassess the trusted-proxy chain before relying on IP-based rate limiting.

Do not configure Production, rotate Production credentials, or change the production domain as part of this audit without explicit approval. After Preview variables are configured, perform live Admin login, session refresh, logout/revocation, and global settings persistence checks on Preview.
