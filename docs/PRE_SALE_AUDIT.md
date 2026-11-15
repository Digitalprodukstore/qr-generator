# QR Studio Pro — Pre-Sale Audit

Audit date: 15 November 2026  
Scope: prepare the existing QR Generator for a transparent AS-IS source/product sale. Preserve working features. No application feature changes are authorized by this document.

## Guardrails

- Work only on `fix/qrnode-phase1-adoption-2026-11-02`.
- Preserve `baseline/qr-generator-v1-locked`.
- Keep PR #5 Draft.
- Do not merge, promote, deploy to Production, alter Production environment variables, or change the production domain.
- Do not apply database migrations, modify database resources, rotate secrets, or weaken deployment protection.
- Do not redesign or rewrite existing generator code.
- Do not claim a test passed unless there is fresh, attributable evidence.

## Evidence reviewed

- PR #5 documents the 18-category Static QR feature set, exports, customization, bilingual UI, Admin/global settings, public information pages and previous QA.
- `package.json` declares `@neondatabase/serverless` at `^1.0.2`; the application has Vercel serverless API architecture.
- The latest audit document on the feature branch records an estimated engineering-readiness score of approximately 73%, not a commercial certification.
- Prior CI evidence and owner-reported manual QA are documented in PR #5 and the master audit. They are not fresh live QA performed in this audit session.
- The latest recorded Vercel Preview was READY, but public anonymous access for intended buyers/testers was not conclusively established.
- The live Admin-authenticated Neon health probe has not been verified; the unauthenticated request was blocked by deployment protection.
- Dynamic QR migration is present but unapplied; Dynamic QR persistence/resolver/analytics are not complete.

## Current pre-sale gate matrix

| Gate | Status | Evidence / next action |
|---|---|---|
| Static QR feature inventory | DOCUMENTED | 18 categories and supporting capabilities described in PR #5. |
| Fresh 18-category decode regression | BLOCKED / NOT RE-RUN | Run on latest Preview with real scans and preserve results. |
| PNG/SVG, logo, presets, sharing | PRIOR EVIDENCE ONLY | Repeat on current Preview and representative mobile/desktop browsers. |
| Admin authentication and global settings | PARTIALLY DOCUMENTED | Prior owner-reported QA exists; fresh live login/logout/expiry/sync and fail-closed checks required. |
| Neon real connectivity | BLOCKED / NOT VERIFIED | Requires owner to test from authenticated Admin Preview session; do not share secrets. |
| Dynamic QR and analytics | NOT INCLUDED / INCOMPLETE | Explicitly exclude from Static QR Edition sale scope. |
| Public Preview buyer access | NOT VERIFIED | Owner must approve any access-setting changes; do not weaken protection. |
| Legal/policy/owner disclosures | OWNER REVIEW REQUIRED | Confirm legal entity, contact, privacy/terms, domain and transfer rights. |
| Third-party dependency/licence review | NOT YET VERIFIED | Generate a complete dependency and licence inventory from the actual source and review notices/terms. |
| Secret and environment handover | DOCUMENTATION REQUIRED | Inventory variable NAMES only; buyer recreates/rotates values in buyer-owned accounts. |
| Domain and vendor asset ownership | CONTRACT REQUIRED | Explicitly list domain, Vercel, Upstash, Neon and account-transfer exclusions/inclusions. |
| Production release | LOCKED / NOT AUTHORIZED | No production release under this audit. |

## Safe sale positioning

Recommended label: **QR Studio Pro — Static QR Generator Commercial Edition (AS-IS)**.

Include only capabilities that are present and documented in `AS_IS_FEATURE_MATRIX.md`. Attach the buyer handover checklist. State that Dynamic QR, analytics, cloud-synced saved projects, active AdSense and live Neon database connectivity are not included/verified.

Do not claim “100% safe”, “penetration tested”, “fully production-ready”, “guaranteed revenue”, “AdSense approved”, or “all modules complete”.

## Remaining work sequence

1. Confirm latest feature-branch HEAD and exact Preview deployment SHA.
2. Perform fresh static-generator regression without changing application behavior.
3. Perform authenticated Admin acceptance tests; record blocked checks honestly.
4. Review dependency licences, third-party CDN usage, security headers and secret names without exposing values.
5. Review all public pages and confirm legal owner/contact/domain details with the seller.
6. Finalize the exact sale asset schedule and written transfer agreement.
7. Provide buyer with source, setup guide, environment variable names, known limitations, and a controlled acceptance checklist.
8. Keep Production locked unless separately and explicitly authorized.

## Completion rule

The product may be offered as an AS-IS Static QR Edition with the above disclosures once the seller is comfortable with the documented limitations and the exact transfer rights. It must not be represented as a fully verified turnkey service until all applicable live acceptance gates pass.
