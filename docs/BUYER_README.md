# QR Studio Pro — Static QR Generator Commercial Edition

A browser-first QR generator with 18 static QR categories, PNG/SVG export, design customization, Indonesian and English interfaces, and an optional server-protected Admin area for shared QR-type settings.

## Included functionality

- 18 static QR categories across Basic, Communication, Business, and Marketing & Event.
- Category-specific payload validation.
- PNG and SVG export, logo/color/gradient customization, design presets, and Premium Design Studio.
- Responsive Indonesian and English interfaces.
- Up to eight recent projects stored locally in the visitor's browser.
- Optional Admin login and shared QR-type settings backed by the buyer's own Upstash Redis.

## Important scope limitations

This is the **Static QR Edition (AS-IS)**. It does not include Dynamic QR management, redirect resolution, campaign analytics, cloud-synchronized projects, or active AdSense integration. A static QR destination cannot be edited after creation; generate a new QR code to change its content. Recent projects remain in localStorage on the same browser/device and are not synchronized.

## Requirements

- Node.js and npm (supported Node.js LTS recommended).
- A Vercel account/project to deploy the serverless Admin API.
- An Upstash Redis database for Admin sessions, login rate limiting, and shared settings.
- Optional Neon PostgreSQL only if the Admin database-health probe is needed; it is not required for static QR generation or settings storage.

## Quick setup

1. Create a new repository owned by the buyer and upload the delivered source package.
2. Import that repository into a new buyer-owned Vercel project.
3. Configure the buyer's own Preview environment variables:
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `ADMIN_PIN`
   - `ADMIN_SESSION_SECRET` (cryptographically random, at least 32 characters)
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
4. Optionally configure `DATABASE_URL` only for the Neon health probe.
5. Deploy Preview and complete the acceptance checklist before deciding whether to publish the buyer's own Production deployment.

Never reuse or request the seller's credentials, hosting resources, database accounts, tokens, or domain. Do not put secrets in source files, commits, screenshots, or support messages.

## Buyer documentation

- [Buyer Installation Guide](BUYER_INSTALLATION_GUIDE.md)
- [Global Admin Settings Setup](GLOBAL_ADMIN_SETTINGS_SETUP.md)
- [AS-IS Feature Matrix](AS_IS_FEATURE_MATRIX.md)
- [Buyer Handover Checklist](BUYER_HANDOVER_CHECKLIST.md)

## Buyer launch checklist

- Replace the `example.com` SEO/canonical/sitemap placeholders with the buyer's final HTTPS domain.
- Review and replace legal, privacy, terms, disclaimer, contact, and business details with accurate buyer information.
- Verify all 18 QR types, PNG/SVG downloads, mobile and desktop layouts, Admin login/logout, session behavior, rate limiting, and cross-browser settings persistence.
- Review all third-party dependency, font, icon, QR encoder, and asset licences before redistribution or public launch.
- Keep the first deployment in Preview. The buyer alone decides whether and when to configure their Production environment and domain.

## Third-party components and licence

Third-party dependencies and external services remain subject to their own licences and terms. Preserve all required notices supplied with the release package. The application's own licence is the separate written licence granted for this purchase; no copyright assignment, exclusivity, or rights beyond the applicable Codester licence are implied.

## Support and updates

Support period, update obligations, warranties, and any additional services are only those explicitly stated in the purchase listing and written agreement. No seller hosting account, domain, subscription, API key, database, or ongoing service is included unless explicitly listed.
