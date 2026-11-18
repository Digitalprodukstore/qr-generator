# QR Studio Pro — Pre-Sale Audit

Audit date: 18 November 2026  
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
- Owner-reported live Preview acceptance on 18 November 2026: Admin login succeeded; global QR type settings were saved, persisted after refresh, and synchronized in another browser; the Admin database health check also succeeded. This is owner-reported manual evidence, not an independently captured API trace. The exact Neon probe output/latency and logout/session-expiry behavior were not supplied.
- Dynamic QR migration is present but unapplied; Dynamic QR persistence/resolver/analytics are not complete.

## 18 November follow-up — buyer-neutral package, buyer README, and dependency security

- Pattern-based scan of 35 selected current source/configuration/documentation files found no common token, private-key, credential-assignment, or credential-bearing Redis URL patterns. This is not a full repository-wide historical scan.
- Added `docs/DISTRIBUTION_PACKAGE_MANIFEST.md` with candidate include/exclude lists and explicit release gates. Added `docs/BUYER_README.md` as the buyer-facing root README source for the ZIP, excluding seller-only working documentation. No final ZIP has been built or issued.

- Buyer-facing Indonesian/English pages, contact/legal pages, `sitemap.xml`, and `robots.txt` were neutralized on the sale branch. Seller domain, direct contact, and BoothPro-specific sample/sponsor defaults were replaced with buyer placeholders. Production was not changed.
- `package-lock.json` contains 74 dependency entries with licence metadata: 64 MIT, 7 ISC, 2 Apache-2.0, and 1 BSD-3-Clause; none are missing a declared licence field. This is not a full SBOM/legal review.
- Static common-secret-pattern scan covered all 56 tracked text/code/config/documentation files in the reviewed tree and a sample of 28 recent commit patches; no tested token/private-key/credential-literal patterns were found. A dedicated complete all-branches/tags Git-history secret scan remains outstanding.
- CI on commit `353ec2e451754d23e8ee5242f22fc11da1f60858`: static checks and Admin auth tests passed; browser job failed at `npm audit --audit-level=high`, reporting 10 high findings in the transitive `picomatch` dependency tree used by Tailwind CSS 3.4.17/build tooling. The suggested `--force` remediation would upgrade Tailwind to 4.3.5 (major breaking change); no force upgrade was applied. This advisory is being tracked, and the browser suite is not yet green on the latest commit.
- The branch is 266 commits ahead of the locked baseline. Earlier scans covered selected current source files and 28 recent commit patches, not the complete 266-commit delta or all branches/tags. A full Git-history secret scan remains an open release gate.
- The latest tree contains 60 tracked files and no filenames matching common `.env`, private-key, certificate, database-dump, or credential-file patterns; filename review is not a content/history scan.
- Latest Preview deployment for `4de369563396c0a756c012742e4e957ecc9a91ff` was initializing at the time of this update. Phase 2 and Phase 3 checks passed; the QR Generator workflow was still running.
- Current status must not be described as zero vulnerabilities or fully security-cleared. Normal runtime QR generation is browser-side, but build-time dependency risk remains.

## Current pre-sale gate matrix

| Gate | Status | Evidence / next action |
|---|---|---|
| Static QR feature inventory | DOCUMENTED | 18 categories and supporting capabilities described in PR #5. |
| Fresh 18-category decode regression | PASS (CI) | All 18 payload categories and square/rounded/dots patterns independently decoded in browser CI; real phone-camera scans remain a separate acceptance step. |
| PNG/SVG, presets and exports | PASS (CI) | 2048px PNG for all three patterns independently decoded; SVG shape checks, five presets, local projects and sponsor URL safety passed. Manual logo/share QA across physical devices remains required. |
| Admin authentication and global settings | MOCKED CI PASS / LIVE PARTIAL — OWNER-REPORTED PASS | Owner confirmed Preview Admin login, saving global QR type settings, persistence after refresh, and cross-browser synchronization on 18 Nov 2026. Logout, expiry, failure-mode, and buyer-owned credential acceptance remain untested. |
| Neon real connectivity | OWNER-REPORTED PASS (Preview) | Owner confirmed Admin database health check succeeded on 18 Nov 2026. Exact query output/latency and independent verification were not provided; do not infer that Dynamic QR persistence is implemented. |
| Dynamic QR and analytics | NOT INCLUDED / INCOMPLETE | Explicitly exclude from Static QR Edition sale scope. |
| Public Preview buyer access | NOT VERIFIED | Owner must approve any access-setting changes; do not weaken protection. |
| Legal/policy/owner disclosures | OWNER REVIEW REQUIRED | Confirm legal entity, contact, privacy/terms, domain and transfer rights. |
| Third-party dependency/licence review | PARTIAL / SECURITY BLOCKER | 74 lockfile licence metadata entries counted; full SBOM/legal notices remain open. CI reports 10 high `picomatch` transitive dependency advisories via Tailwind build tooling. Do not use `npm audit fix --force`; investigate an upstream fix or document/mitigate before release. |
| Secret and environment handover | PARTIAL | Sale-branch buyer-facing contact/domain defaults neutralized; common credential-pattern checks were run against selected current files and a limited recent commit-patch sample. Complete Git-history secret scan remains open. Buyer recreates credentials in buyer-owned accounts. |
| Domain and vendor asset ownership | CONTRACT REQUIRED | Explicitly list domain, Vercel, Upstash, Neon and account-transfer exclusions/inclusions. |
| Production release | LOCKED / NOT AUTHORIZED | No production release under this audit. |

## Local CSS and dependency build verification

- Tailwind Play CDN was removed from both language pages; both load `/assets/tailwind.generated.css`.
- Tailwind CSS is pinned at `3.4.17`; the generated CSS artifact and version-3 npm lockfile are committed.
- Latest full browser workflow on branch HEAD `5e3e3914660cfa1bc7cca4569390fb44ee0fdc64` passed: `npm ci --ignore-scripts`, local CSS compilation/output assertions, all 18 QR payload categories, square/rounded/dots decode, all three 2048×2048 PNG exports, SVG shape checks, Premium Design Studio, and five responsive viewports.
- The test workflow regenerates the CSS and verifies key selectors and absence of the Tailwind Play CDN URL before serving the app. The generated CSS/lockfile commit was created by the prior successful browser run and is now part of the tested branch.

## Safe sale positioning

Recommended label: **QR Studio Pro — Static QR Generator Commercial Edition (AS-IS)**.

Include only capabilities that are present and documented in `AS_IS_FEATURE_MATRIX.md`. Attach the buyer handover checklist. State that Dynamic QR, analytics, cloud-synced saved projects and active AdSense are not included. Neon health check has been owner-reported successful on Preview, but database-backed Dynamic QR features remain incomplete.

Do not claim “100% safe”, “penetration tested”, “fully production-ready”, “guaranteed revenue”, “AdSense approved”, or “all modules complete”.

## Remaining work sequence

1. Complete real phone-camera scanning and physical-device export/share acceptance on the current Preview.
2. Complete Admin logout/session-expiry and fail-closed acceptance; retain the owner-reported Preview evidence for Upstash persistence/cross-browser sync and Neon health check.
3. Verify the committed dependency lockfile with a clean `npm ci`; complete transitive SBOM/licence/privacy review.
4. Complete dedicated Git-history secret scanning across all branches/tags and review CSP strategy without exposing secret values.
5. Resolve or formally document the current high-severity `picomatch` build-tool advisory and obtain a passing full browser workflow without forcing a Tailwind major upgrade.
5. Review all public pages and confirm legal owner/contact/domain details with the seller.
6. Finalize the exact sale asset schedule and written transfer agreement.
7. Provide buyer with source, setup guide, environment variable names, known limitations, and a controlled acceptance checklist.
8. Keep Production locked unless separately and explicitly authorized.

## Completion rule

The product may be offered as an AS-IS Static QR Edition with the above disclosures once the seller is comfortable with the documented limitations and the exact transfer rights. It must not be represented as a fully verified turnkey service until all applicable live acceptance gates pass.


## 18 November 2026 follow-up — full Git-history secret scan

- Added `.github/workflows/secret-history-scan.yml` to the sale/development branch. It checks out the full available Git history and scans all fetched origin refs with Gitleaks, pinned by image digest and configured for 100% redaction.
- Scanned exact branch HEAD `b766d54e698bfd630892b4e32390ac7565fed21f`.
- Push run `44238511325` and pull-request run `44238519287` both completed successfully.
- Both logs report 362 commits scanned, approximately 1.19 MB, and **no leaks found**.
- This closes the dedicated Git-history scan gate for the fetched origin refs at that SHA. It does not scan local clones, unfetched forks/unreachable objects, external accounts, or unrelated GitHub/CI content.
- Latest QR Generator workflow on this SHA is still a blocker: it completed with failure at `npm audit --audit-level=high`; Phase 2 and Phase 3 passed. Do not suppress the audit or force a major Tailwind upgrade.
- The full SBOM/licence-notice review, picomatch remediation/documented risk, application licence approval, ZIP archive scan, and buyer-owned clean-room deployment remain open. No ZIP has been issued.
