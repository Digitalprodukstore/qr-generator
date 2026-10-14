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
