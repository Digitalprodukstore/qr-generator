# Codester Listing Draft — QRnode

Status: Draft for seller review. Do not publish until licence, source package, demo, screenshots, and final QA are approved.

## Product title

QRnode — 18-Type Static QR Code Generator with PNG/SVG Export

## Short description

A responsive, bilingual static QR code generator with 18 QR categories, customizable designs, and high-quality PNG/SVG export. Includes an optional server-protected Admin area for shared QR-type settings.

## Product category

PHP Scripts / JavaScript / Tools (choose the closest category available in the Codester submission form; the product uses browser JavaScript and Vercel serverless API routes, not a PHP backend).

## Suggested tags

QR Code, QR Generator, Static QR, JavaScript, PNG Export, SVG Export, Responsive, Admin Dashboard, Vercel, Upstash Redis, Bilingual

## Full description

### Create and customize QR codes in your browser

QRnode is a browser-first QR code generator designed for personal use, creators, and businesses that need a straightforward way to create and export static QR codes.

The interface includes 18 QR categories grouped into Basic, Communication, Business, and Marketing & Event. Users can enter the relevant data, customize the visual appearance, preview the result, and export the QR code as PNG or SVG.

### Main features

- 18 static QR categories across four groups.
- Category-specific input and payload validation.
- PNG and SVG export.
- Logo, color, gradient, and preset customization.
- Premium Design Studio.
- Indonesian and English interfaces.
- Responsive layout for modern desktop and mobile browsers.
- Up to eight recent projects stored locally in the visitor's browser.
- Optional server-protected Admin area.
- Admin controls to enable or disable the available QR types globally.
- Shared Admin settings stored through buyer-configured Upstash Redis.
- Signed Admin session cookies and login rate limiting.

### Technology

- HTML, CSS, and browser JavaScript.
- Vercel serverless API routes for Admin features.
- Upstash Redis REST for Admin sessions, login rate limiting, and shared settings.
- Optional Neon PostgreSQL connectivity probe for Admin diagnostics.
- Tailwind CSS compiled into a local stylesheet.

### Installation

The buyer deploys an independent copy using their own GitHub repository and Vercel project. Admin functionality requires the buyer's own Upstash Redis database and environment variables. A custom domain can be connected through the buyer's Vercel project and DNS provider.

The download includes a buyer installation guide covering deployment, Admin credential setup, Redis configuration, custom domain setup, and a Preview acceptance checklist.

### Important scope and limitations

- This is a **static QR generator**. The destination/content is embedded in the QR code and cannot be changed after generation.
- Dynamic QR CRUD, redirect resolution, campaign analytics, and campaign management are not included.
- Recent projects are stored in browser localStorage and are not synchronized to the cloud.
- The optional Neon health check only tests database connectivity; it does not enable Dynamic QR functionality.
- Ad/sponsor settings are configuration placeholders. Active AdSense integration and approval are not included.
- Hosting, domain, database, and third-party service accounts are not included. Buyers create and pay for their own provider accounts as applicable.
- Buyers must replace example domain, contact, legal, privacy, and business details before public launch.

## Included files

- Complete application source code.
- Vercel serverless Admin API routes.
- Compiled CSS and source styling configuration.
- Package manifest and lockfile.
- Buyer Installation Guide.
- Buyer Handover Checklist.
- AS-IS Feature Matrix.
- Third-party licence/NOTICE files required for included dependencies and bundled assets, once legally reviewed and cleared.
- Buyer-facing privacy/legal notices and installation documentation.

## Requirements

- Node.js and npm for dependency installation/build tasks.
- GitHub account for buyer-owned source repository (recommended).
- Vercel account/project for serverless Admin API deployment.
- Upstash Redis database for Admin login, sessions, rate limiting, and global settings.
- Optional Neon PostgreSQL database only for the Admin database-health probe.
- Optional buyer-owned domain and DNS access.

## Licence and support fields to complete before submission

- Codester licence type(s): use the platform's supported Regular and Extended licence options.
- Seller support policy: [seller to define].
- Updates policy: [seller to define].
- Final price: [seller to set in Codester].
- Demo URL: [insert buyer-accessible Preview/demo URL after final QA].
- Screenshots: [prepare original screenshots from the approved release build].
- Application source licence: seller-approved non-exclusive model is recorded in `APPLICATION-LICENSE.md`; third-party notices and asset redistribution rights remain subject to final review before upload.

## Claims intentionally not made

Do not advertise Dynamic QR, editable QR destinations, scan analytics, campaign tracking, cloud-synced project history, active AdSense monetization, independent security certification, or guaranteed universal compatibility.


## Seller QA status — 19 November 2026

This listing remains a draft and is not submission-ready. The latest code HEAD tested by CI (`cc7dcac753dc6007955dbf3c602230775c22d704`) passed the Chromium QR/browser workflow, static checks, Admin auth tests, Phase 2/3 guards, Gitleaks scan and CycloneDX SBOM/notice collection. The branch subsequently received documentation-only audit updates; all CI must be rerun on the exact release candidate.

Open submission blockers: authoritative `dlv@1.1.3` redistribution notice evidence; external QR encoder/font/icon rights, attribution and privacy review; seller-approved application source licence; physical-device QA; public demo access confirmation; final allowlist ZIP and checksum; buyer-owned clean-room deployment. Do not upload this listing or claim that the product is security-certified or licence-cleared until these items are closed.


## Current QA and licence status — 22 November 2026

- Latest verified development branch commit before this documentation refresh: `8467ef7de47280c231bf37dc250cb0b319dcecc9`; all nine CI workflow runs for that exact SHA completed successfully.
- Seller approval for the non-exclusive application-licence model has been received and recorded. It is no longer an outstanding owner-approval gate.
- The current sale branch is being updated with buyer-facing privacy disclosures to match the actual runtime: Google Fonts and the cdnjs QR encoder are remote assets; Tailwind CSS is compiled and served locally.
- Submission remains blocked by the unresolved authoritative `dlv@1.1.3` copyright/NOTICE wording, final third-party asset/licence/privacy review, physical phone-camera QA, buyer-owned clean install/deployment, final ZIP allowlist/archive/secret validation, and final demo/screenshots. Do not publish this draft or claim distribution clearance.


## Seller review update — 24 November 2026

Current release-candidate evidence supersedes the earlier dated status snapshots above:
- Development branch commit: `a41a29d7f599c568dea76385c6ea677753caaf09`.
- All nine GitHub Actions workflows on that exact SHA passed.
- Vercel Preview: https://qr-generator-6tkp2f9hk-risakil.vercel.app (READY; not independently certified route-by-route or as anonymous buyer access).
- Seller approval for the non-exclusive application-use licence is received and recorded in `APPLICATION-LICENSE.md`.

**Still not ready for submission.** The exact third-party runtime asset review is recorded in `docs/THIRD_PARTY_RUNTIME_ASSET_REVIEW.md`. The `dlv@1.1.3` package declares MIT in npm/upstream metadata, but upstream tag 1.1.3 has no standalone LICENSE file or explicit copyright-year/holder statement. Do not use unverified third-party copyright attribution. Google Fonts and cdnjs QR encoder are remote runtime requests, not bundled files in the current source allowlist; privacy disclosures must remain accurate.

Outstanding acceptance items: physical phone-camera tests; buyer-owned clean-room installation/deployment; final explicit-allowlist ZIP, archive secret scan, extraction/install/build verification and checksum; final screenshots/demo review; and seller support/update/pricing decisions. No Dynamic QR or other excluded functionality should be claimed.

Do not publish this listing, upload a source ZIP, or claim legal/security certification until all release gates are closed.
