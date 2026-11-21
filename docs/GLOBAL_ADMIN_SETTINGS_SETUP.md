# QR Studio Pro — Global Admin Settings Setup

This release adds a server-backed settings endpoint for the Admin Dashboard.

## What is implemented

- `GET /api/admin/settings`: reads the shared settings used by the public generator.
- `PUT /api/admin/settings`: writes settings only when the existing HttpOnly admin session is valid.
- Storage: Upstash Redis REST, key `qr-studio-pro:global-settings:v1`.
- Settings schema: ad mode, Auto Ads switch, publisher/slot identifiers, sponsor details, and the enabled state of all 18 QR types.
- The public QR selector hides disabled QR types after it loads the global settings.
- Browser localStorage is no longer treated as the authoritative source for these global settings.

## Required Vercel Preview environment variables

Set these in the Vercel project for the Preview environment only. Do not put values in GitHub, HTML, JavaScript, or this document.

### Existing admin authentication

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_PIN`
- `ADMIN_SESSION_SECRET` — use a cryptographically random secret of at least 32 characters.

### Shared settings storage

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Use an Upstash Redis database dedicated to this application or an appropriately isolated keyspace. The same Upstash variables can also support the existing admin-login rate limiter.

After adding or changing Preview environment variables, create a new Preview deployment so the functions receive them. Keep Production variables and Production deployments untouched.

## Expected behavior before credentials are configured

- The settings endpoint returns a controlled 503 response when Upstash is missing or unavailable.
- The dashboard displays that global storage is not ready.
- Saving is blocked; the UI must not claim settings were saved or synchronized.
- Admin login remains unavailable until the admin authentication variables are configured.

## AdSense status

The settings fields only store configuration. This does not activate Google AdSense or guarantee account approval. Keep Auto Ads off and do not insert an AdSense script until the publisher account is approved, valid publisher/slot IDs are supplied, and placements have been reviewed against Google policies.

## Manual QA checklist

1. Confirm unauthenticated `PUT /api/admin/settings` returns 401.
2. Confirm unauthenticated `GET /api/admin/settings` returns the current public-safe settings.
3. Sign in as admin and save a sponsor name, mode, and one disabled QR type.
4. Reload the Preview in a separate browser/device and verify the same values load.
5. Confirm the disabled type is unavailable in the public QR selector.
6. Re-enable it and verify it returns after a public page reload.
7. Confirm QR generation and PNG/SVG exports still work for enabled types.
8. Confirm Auto Ads remains off unless explicitly configured after AdSense approval.
9. Repeat the test on the English page.
10. Do not merge PR #5 or deploy to Production as part of this QA.
