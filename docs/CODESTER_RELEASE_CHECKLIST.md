# QR Studio Pro — Codester Release Checklist

## Product scope

- [ ] Confirm product title and category for Codester.
- [ ] Confirm the product is listed as Static QR Generator Edition (AS-IS).
- [ ] Confirm Dynamic QR, redirects, persistent analytics, cloud project sync, and active AdSense are excluded.
- [ ] Confirm the buyer's expected hosting/runtime requirements are stated.

## Source and installation

- [ ] Run a clean `npm ci` from the committed lockfile.
- [ ] Run `npm run build:css` and verify generated CSS output.
- [ ] Test the documented `vercel dev` workflow.
- [ ] Deploy Preview under a buyer-owned Vercel account.
- [ ] Verify Admin authentication and global settings with buyer-owned Upstash Redis.
- [ ] Verify optional Neon health diagnostic only if advertised.
- [ ] Confirm the application works without any seller-owned account, token, domain, or database.
- [ ] Confirm `.env.example` contains names and safe placeholders only.

## Functional QA

- [ ] Independently decode representative output from all 18 QR categories.
- [ ] Test PNG and SVG export.
- [ ] Test logo placement, colors, patterns, presets, and contrast.
- [ ] Test saved projects and disclose localStorage limitations.
- [ ] Test mobile share behavior on supported devices.
- [ ] Test Indonesian and English pages.
- [ ] Test phone, tablet, and desktop layouts.
- [ ] Test Admin login, logout/revocation, expiry, rate limiting, and settings synchronization.
- [ ] Review browser console and serverless function logs.

## Security, privacy, and legal

- [ ] Complete Git-history secret scanning; rotate any exposed credentials.
- [ ] Review current and transitive npm dependencies and their licences.
- [ ] Review third-party fonts, icons, QR library, and attribution requirements.
- [ ] Review privacy/terms/disclaimer pages and all buyer placeholders.
- [ ] Confirm seller identity and support channel shown in the listing.
- [ ] Confirm intellectual-property ownership and rights to every bundled asset.
- [ ] Decide the application's own licence / rights notice; do not add a licence without owner approval.
- [ ] Do not claim penetration-test certification or legal compliance without evidence.

## Marketplace assets

- [ ] Create 3–9 truthful product screenshots from the final Preview.
- [ ] Create the required preview image and product icon to current Codester specifications.
- [ ] Write an English product description with honest scope and requirements.
- [ ] Prepare version number, changelog, support policy, and known limitations.
- [ ] Build the ZIP using `docs/CODESTER_PACKAGE_MANIFEST.md`.
- [ ] Extract the ZIP into a clean directory and repeat the installation test.
- [ ] Record final ZIP checksum and source commit SHA.

## Submission gate

- [ ] Seller has reviewed the exact archive and listing.
- [ ] Seller has confirmed the licence model and sale rights.
- [ ] No Production deployment, domain, or environment change is required for Codester submission.
