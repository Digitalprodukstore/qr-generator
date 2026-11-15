# QR Studio Pro — Pre-Sale Audit

Audit date: 16 November 2026  
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
- Fresh GitHub Actions on branch HEAD `301edbb512ae69a2f404dfe9e6eda103f63654e1` passed the QR Generator checks (run 43748007911), Phase 2 checks (run 43748012830), and Phase 3 schema guard (run 43748012880). The run performed `npm ci`, `npm audit --audit-level=high` (0 vulnerabilities), local Tailwind CSS compilation/output checks, all 18 QR payload decode tests, three pattern checks, 2048×2048 PNG/SVG export checks, Premium Design Studio tests, and five responsive viewports.
- Prior CI evidence and owner-reported manual QA are documented in PR #5 and the master audit. They are not fresh live QA performed in this audit session.
- Latest Vercel Preview deployment `dpl_7LU6xwp7ZfAeoo2z5bTpUDmAp19u` is READY at `https://qr-generator-hthunbjg8-risakil.vercel.app` for exact branch HEAD `301edbb512ae69a2f404dfe9e6eda103f63654e1`. Anonymous access for intended buyers/testers remains unverified because deployment protection could not be independently bypassed for this audit.
- The live Admin-authenticated Neon health probe has not been verified; the unauthenticated request was blocked by deployment protection.
- Dynamic QR migration is present but unapplied; Dynamic QR persistence/resolver/analytics are not complete.

## Current pre-sale gate matrix

| Gate | Status | Evidence / next action |
|---|---|---|
| Static QR feature inventory | DOCUMENTED | 18 categories and supporting capabilities described in PR #5. |
| Fresh 18-category decode regression | PASS (CI) | All 18 payload categories and square/rounded/dots patterns independently decoded in browser CI; real phone-camera scans remain a separate acceptance step. |
| PNG/SVG, presets and exports | PASS (CI) | 2048px PNG for all three patterns independently decoded; SVG shape checks, five presets, local projects and sponsor URL safety passed. Manual logo/share QA across physical devices remains required. |
| Admin authentication and global settings | MOCKED CI PASS / LIVE PARTIAL | Auth/session/rate-limit/same-origin tests passed in mocked CI. Live Admin login/logout, Redis persistence and buyer-owned session acceptance remain required. |
| Neon real connectivity | BLOCKED / NOT VERIFIED | Requires owner to test from authenticated Admin Preview session; do not share secrets. |
| Dynamic QR and analytics | NOT INCLUDED / INCOMPLETE | Explicitly exclude from Static QR Edition sale scope. |
| Public Preview buyer access | NOT VERIFIED | Owner must approve any access-setting changes; do not weaken protection. |
| Legal/policy/owner disclosures | OWNER REVIEW REQUIRED | Confirm legal entity, contact, privacy/terms, domain and transfer rights. |
| Third-party dependency/licence review | PARTIAL | Direct asset/licence inventory added in `docs/THIRD_PARTY_ASSET_INVENTORY.md`; full transitive SBOM and privacy review remain open. Tailwind CSS 3.4.17 is now compiled locally; npm lockfile is committed. Full transitive SBOM and privacy review remain open. |
| Secret and environment handover | DOCUMENTATION REQUIRED | `.gitignore` now excludes local env files; complete Git-history secret scan and inventory variable NAMES only. Buyer recreates/rotates values in buyer-owned accounts. |
| Domain and vendor asset ownership | CONTRACT REQUIRED | Explicitly list domain, Vercel, Upstash, Neon and account-transfer exclusions/inclusions. |
| Production release | LOCKED / NOT AUTHORIZED | No production release under this audit. |

## Local CSS and dependency build verification

- Tailwind Play CDN was removed from both language pages; both load `/assets/tailwind.generated.css`.
- Tailwind CSS is pinned at `3.4.17`; the generated CSS artifact and version-3 npm lockfile are committed.
- Latest full browser workflow on branch HEAD `5e3e3914660cfa1bc7cca4569390fb44ee0fdc64` passed: `npm ci --ignore-scripts`, local CSS compilation/output assertions, all 18 QR payload categories, square/rounded/dots decode, all three 2048×2048 PNG exports, SVG shape checks, Premium Design Studio, and five responsive viewports.
- The test workflow regenerates the CSS and verifies key selectors and absence of the Tailwind Play CDN URL before serving the app. The generated CSS/lockfile commit was created by the prior successful browser run and is now part of the tested branch.

## Safe sale positioning

Recommended label: **QR Studio Pro — Static QR Generator Commercial Edition (AS-IS)**.

Include only capabilities that are present and documented in `AS_IS_FEATURE_MATRIX.md`. Attach the buyer handover checklist. State that Dynamic QR, analytics, cloud-synced saved projects, active AdSense and live Neon database connectivity are not included/verified.

Do not claim “100% safe”, “penetration tested”, “fully production-ready”, “guaranteed revenue”, “AdSense approved”, or “all modules complete”.

## Remaining work sequence

1. Complete real phone-camera scanning and physical-device export/share acceptance on the current Preview.
2. Complete live authenticated Admin login/logout/session expiry, Upstash persistence and Neon health acceptance; record any unavailable services.
3. Verify the committed dependency lockfile with a clean `npm ci`; complete transitive SBOM/licence/privacy review.
4. Complete Git-history secret scanning and review CSP strategy without exposing secret values.
5. Review all public pages and confirm legal owner/contact/domain details with the seller.
6. Finalize the exact sale asset schedule and written transfer agreement.
7. Provide buyer with source, setup guide, environment variable names, known limitations, and a controlled acceptance checklist.
8. Keep Production locked unless separately and explicitly authorized.

## Completion rule

The product may be offered as an AS-IS Static QR Edition with the above disclosures once the seller is comfortable with the documented limitations and the exact transfer rights. It must not be represented as a fully verified turnkey service until all applicable live acceptance gates pass.
