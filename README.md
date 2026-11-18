# QR Studio Pro — Static QR Generator Commercial Edition (AS-IS)

A browser-first QR code generator with 18 static QR categories, PNG/SVG export, design customization, bilingual UI, and an optional server-protected Admin area for shared QR-type settings.

> **Sale scope:** Static QR Edition, supplied AS-IS. Dynamic QR management, redirect resolution, campaign analytics, cloud-synced projects, and active AdSense integration are not included.

## Features

- 18 static QR categories across Basic, Communication, Business, and Marketing & Event.
- Category-specific payload validation.
- PNG and SVG export.
- Logo, color, gradient, and preset customization.
- Premium Design Studio.
- Indonesian and English pages.
- Responsive browser UI and supported-device native sharing.
- Up to eight recent projects saved in browser localStorage.
- Optional server-side Admin login and shared settings for the 18 QR categories, backed by Upstash Redis.

## Technology

- HTML, CSS, and browser JavaScript for the generator UI.
- Vercel serverless API routes for Admin endpoints.
- Upstash Redis REST for Admin sessions, login rate limiting, and global settings.
- Neon PostgreSQL serverless driver for the Admin database health probe.
- Tailwind CSS 3.4.17 compiled to a local CSS asset.

The QR generator creates static QR payloads in the browser. A Neon connection health check does not mean Dynamic QR features have been implemented.

## Requirements

- Node.js and npm (use a currently supported Node.js LTS release).
- A Vercel account/project for deploying the serverless API routes.
- Upstash Redis for Admin authentication, rate limiting, and shared global settings.
- Neon PostgreSQL is only required for the optional Admin database health probe in this edition.
- No database migration is required for the Static QR generator.

## Local setup

1. Clone or download the source archive.
2. Install dependencies:

   ```bash
   npm ci
   ```

3. Rebuild the locally bundled Tailwind CSS when styles are changed:

   ```bash
   npm run build:css
   ```

4. Deploy the project to Vercel to exercise the serverless Admin API routes. The repository does not currently define a standalone local server or `npm start` command.

The public generator pages can be previewed with a simple static HTTP server, but Admin API functionality requires the Vercel serverless runtime and its configured environment variables.

## Vercel environment variables

Configure values in the buyer's own Vercel project. Never reuse seller credentials or commit secret values to source control.

| Variable | Required for | Notes |
|---|---|---|
| `ADMIN_EMAIL` | Admin login | Buyer-selected Admin email. |
| `ADMIN_PASSWORD` | Admin login | Unique strong password. |
| `ADMIN_PIN` | Admin login | Buyer-selected PIN/passphrase. |
| `ADMIN_SESSION_SECRET` | Admin sessions | Cryptographically random secret, minimum 32 characters. |
| `UPSTASH_REDIS_REST_URL` | Admin login/settings | Buyer-owned Upstash REST URL. |
| `UPSTASH_REDIS_REST_TOKEN` | Admin login/settings | Buyer-owned Upstash REST token. |
| `DATABASE_URL` | Admin database health probe | Optional for Static QR generation; if configured, endpoint expects a Neon PostgreSQL URL. |

After configuring environment variables, create a new Vercel Preview deployment. Start with Preview only; configure Production separately only after the buyer completes acceptance and explicitly chooses to release.

Detailed Admin setup: [docs/GLOBAL_ADMIN_SETTINGS_SETUP.md](docs/GLOBAL_ADMIN_SETTINGS_SETUP.md) and [ADMIN_AUTH_SETUP.md](ADMIN_AUTH_SETUP.md). For a complete buyer-owned installation, credential setup, and custom-domain walkthrough, see the [Buyer Installation Guide](docs/BUYER_INSTALLATION_GUIDE.md).

## Admin behavior and security notes

- Admin credentials are checked server-side.
- Successful sessions use signed, eight-hour HttpOnly, Secure, SameSite=Strict cookies.
- Redis stores active session records, login-attempt counters, and global settings.
- Login fails closed if required authentication or Redis services are missing/unavailable.
- Global settings writes require an authenticated session and same-origin request.
- The database health endpoint requires a valid Admin session and performs `SELECT 1 AS health_check`.
- Buyer must create fresh credentials and provider resources. Do not transfer seller passwords, tokens, cookies, or private keys.

## Known limitations and exclusions

- QR codes are **static**. Their encoded destination/content cannot be changed after creation; generate a new QR code to change the payload.
- Dynamic QR CRUD, redirect resolver, lifecycle controls, persistent campaign analytics, and campaign management are not included.
- Recent projects use browser localStorage and are not cloud-synchronized or backed up.
- Admin shared settings require Upstash Redis and Vercel environment configuration.
- Neon health check is a connectivity probe only; it is not evidence of Dynamic QR functionality.
- AdSense controls/placeholders do not load ads, establish approval, or generate revenue.
- Native share behavior depends on browser and operating system support.
- Public legal/contact pages and seller identity disclosures must be reviewed and updated by the buyer.
- No independent penetration-test certification, SLA, uptime guarantee, or universal browser compatibility warranty is provided.

See [docs/AS_IS_FEATURE_MATRIX.md](docs/AS_IS_FEATURE_MATRIX.md) for the complete sale disclosure matrix.

## Deployment

1. Create a buyer-owned Vercel project connected to the buyer's repository.
2. Configure the environment variables listed above in Preview.
3. Provision a buyer-owned Upstash Redis database and use its REST credentials.
4. Configure `DATABASE_URL` only if the Admin database health probe is required.
5. Deploy a Preview build and complete the functional acceptance checklist.
6. Do not enable Production until the buyer has reviewed domain, account ownership, privacy/legal disclosures, and all environment settings.

## Documentation

- [Buyer Installation Guide](docs/BUYER_INSTALLATION_GUIDE.md)
- [Security & Distribution Audit](docs/SECURITY_DISTRIBUTION_AUDIT.md)
- [Codester Listing Draft](docs/CODESTER_LISTING_DRAFT.md)
- [AS-IS Feature Matrix](docs/AS_IS_FEATURE_MATRIX.md)
- [Pre-Sale Audit](docs/PRE_SALE_AUDIT.md)
- [Buyer Handover Checklist](docs/BUYER_HANDOVER_CHECKLIST.md)
- [Ownership Transfer Plan](docs/OWNERSHIP_TRANSFER_PLAN.md)
- [Third-Party Asset & Licence Inventory](docs/THIRD_PARTY_ASSET_INVENTORY.md)
- [Global Admin Settings Setup](docs/GLOBAL_ADMIN_SETTINGS_SETUP.md)

## Third-party assets and licence

This repository contains third-party dependencies and references external font/icon/QR assets. Review [docs/THIRD_PARTY_ASSET_INVENTORY.md](docs/THIRD_PARTY_ASSET_INVENTORY.md), retain required notices, and perform a full transitive dependency licence review before redistribution.

**There is currently no root `LICENSE` file for the application's own code.** The seller must select and approve the actual commercial licence or written assignment terms before sale. Do not assume that third-party licences, hosting accounts, domains, or vendor subscriptions transfer with the source code.

## Sale and handover

The recommended listing scope is **QR Studio Pro — Static QR Generator Commercial Edition (AS-IS)**. Agree in writing on the exact commit/version, source rights, exclusivity, resale/sublicensing, support, excluded services/accounts, and acceptance window. Use the buyer handover checklist and obtain appropriate legal review.
