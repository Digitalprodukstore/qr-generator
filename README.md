# QR Studio Pro — Static QR Generator

QR Studio Pro is a responsive, bilingual (Indonesian and English) browser-based QR code generator with 18 static QR categories, customizable QR styling, and PNG/SVG export.

> **Current commercial package scope:** Static QR Generator Edition (AS-IS). Dynamic QR management, redirect resolution, persistent scan analytics, cloud-synced projects, active Google AdSense, and verified live Neon connectivity are not included in this edition.

## Features

- 18 static QR categories: URL, text, WhatsApp, email, telephone, SMS, Wi-Fi, vCard, geo/location, event, menu, invitation, review, social profile, PDF/document, multi-link, form, and app download.
- Category-specific input validation and QR payload generation.
- PNG and SVG export.
- Custom colors, logo placement, design patterns, and presets.
- Browser-local saved projects (up to eight recent projects; not cloud synchronized).
- Indonesian and English interface.
- Responsive layouts for desktop, tablet, and mobile.
- Optional protected Admin area for global QR-type and sponsor settings.

## Requirements

- A Vercel account or compatible Node.js serverless hosting that supports the included API routes.
- Node.js 20 or later for dependency installation and CSS build tasks.
- Upstash Redis REST database for Admin login sessions, login rate limiting, and shared Admin settings.
- A Neon PostgreSQL database is optional for the Admin database-health diagnostic only; it does not enable Dynamic QR features.

Provider accounts, domains, hosting, and subscriptions are not included in the source-code package. Create accounts in the buyer's own name and review current provider plans and terms.

## Quick start

1. Download and extract the source package.
2. Install dependencies with `npm ci`.
3. Copy `.env.example` to `.env` for local development, then set the required values. Never commit `.env`.
4. Build the local Tailwind stylesheet with `npm run build:css`.
5. Install the Vercel CLI and run `vercel dev` to test the frontend and serverless API routes locally.
6. Deploy to a buyer-owned Vercel project and configure the same environment variables in the appropriate environment.
7. Open the deployed site and test public QR generation before configuring Admin access.

See [docs/CODESTER_INSTALLATION.md](docs/CODESTER_INSTALLATION.md) for the complete installation guide.

## Environment variables

See `.env.example` and the installation guide.

Required for Admin functionality:
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_PIN`
- `ADMIN_SESSION_SECRET` (at least 32 characters)
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Optional:
- `DATABASE_URL` — Neon PostgreSQL connection string used only by the Admin database-health diagnostic in this edition.

Do not use the seller's credentials, domains, database, Redis instance, or hosting account.

## Important limitations

- Saved QR projects use browser localStorage and remain on the current browser/device.
- Admin settings and sessions require Upstash Redis.
- Admin database health reports a Neon connection check only; no Dynamic QR CRUD or analytics feature is included.
- The Dynamic QR SQL migration is a draft and must not be applied as part of this edition.
- Google AdSense is not active. Sponsor/advertising controls do not imply AdSense approval or ad serving.
- QR scan reliability depends on payload, contrast, logo size, export settings, and the scanning device. Test designed QR codes before public use.

## Security and privacy

- Configure fresh buyer-owned Admin credentials and Redis resources.
- Keep environment files and secrets out of source control.
- Review the privacy notice and replace all seller-specific identity, contact, domain, and service details before publishing a buyer deployment.
- No independent penetration-test certification or legal compliance certification is provided.

## Documentation

- [Installation and configuration](docs/CODESTER_INSTALLATION.md)
- [AS-IS feature matrix](docs/AS_IS_FEATURE_MATRIX.md)
- [Third-party asset and licence inventory](docs/THIRD_PARTY_ASSET_INVENTORY.md)
- [Buyer handover checklist](docs/BUYER_HANDOVER_CHECKLIST.md)
- [Pre-sale audit](docs/PRE_SALE_AUDIT.md)

## Release status

This repository branch is a marketplace-preparation work branch. It is not a statement that the product has passed Codester review or that every live integration has been verified. Check the release checklist and complete all owner-review gates before submitting a ZIP.

## Support

The marketplace seller should replace this section with the support channel and support policy they intend to provide to buyers. Do not leave personal or seller-specific contact details from the demo deployment in a redistributed package.
