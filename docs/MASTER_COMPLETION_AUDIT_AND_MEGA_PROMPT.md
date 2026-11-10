# QR Studio Pro / QR Generator — Audit & Master Completion Prompt

Audit basis: repository branch `fix/qrnode-phase1-adoption-2026-11-02`, latest reviewed commit `be2666ab8856655e6ecc0eadc4ddc8875561b549`, and associated Vercel Preview deployment `qr-generator-hosgffl5i-risakil.vercel.app` (READY). This is a code/repository and CI review, not a claim that every live browser flow has just been re-tested.

## 1. Non-negotiable protection rule

**DO NOT CHANGE, REWRITE, REMOVE, REPLACE, RESTYLE, OR REGRESS ANY EXISTING FEATURE THAT IS ALREADY WORKING.**

Treat the current working QR Generator as a protected baseline. Before every code change:
1. Identify the exact files and functions involved.
2. Record the existing behavior and current screenshots/test results where available.
3. Make the smallest additive change possible.
4. Run regression tests for the affected area and the protected core.
5. If an existing feature fails after a change, stop and fix the regression before continuing.

Never do a broad redesign, rewrite the main HTML/JavaScript, replace the QR library, rename existing element IDs, change current QR payload formats, or change current export behavior unless a verified defect makes it necessary and the owner explicitly approves the specific change.

## 2. Current status — what is already in place

### A. Static QR Generator — existing core (reported working; protect)
- 18 QR categories: Basic, Communication, Business, and Marketing & Event.
- Category-specific input validation and standards-oriented payload generation.
- PNG and SVG export.
- Logo/color customization and selectable PNG export sizes/ratios.
- Mobile sharing support.
- Saved projects in browser localStorage (up to eight recent projects according to the current privacy notice).
- Indonesian/English interface.
- Premium Design Studio/presets and responsive layout.
- Existing QR generation remains client-side; public QR content is not sent to the application's own API in the inspected privacy description.

Status: **CORE FEATURE SET COMPLETE / REGRESSION-PROTECTED.** Prior owner-reported QA covers all 18 types, scanning on a phone, PNG/SVG, Admin, responsive layout, and settings sync. A previous Chromium CI run covered QR decode, design studio, and responsive checks. These reports are evidence of progress, not a substitute for a fresh final release regression run.

### B. Admin and shared settings — foundation in place
- Server-side Admin login; credentials are not embedded in public HTML.
- Signed 8-hour HttpOnly, Secure, SameSite=Strict session cookie.
- Session validity/revocation backed by Upstash Redis.
- Login fails closed if required session/rate-limit infrastructure is unavailable.
- Global Admin settings stored in Upstash Redis.
- Admin can enable/disable all 18 QR types; public selector follows the global settings.
- Sponsor/AdSense configuration controls exist, but ad loader/real AdSense requests are not active by default.
- Settings writes require a valid Admin session and same-origin/CSRF validation.

Status: **FOUNDATION COMPLETE; FINAL LIVE ADMIN/FAILURE-MODE QA STILL REQUIRED.**

### C. Public information and privacy foundation
- Eight public information pages are documented in PR #5, including Privacy, Terms, FAQ, Tutorial, Use Cases, Contact, and related navigation/sitemap coverage.
- Privacy notice now describes localStorage projects, Upstash global settings, Admin session storage, login-attempt counters, Vercel hosting, and frontend CDNs.
- Terms/disclaimer and bilingual SEO work have been included in prior PR work.

Status: **MOSTLY PREPARED; OWNER/LEGAL DETAILS, CURRENT DEPLOYMENT CONFIGURATION, CONTACTS, AND FINAL POLICY REVIEW MUST BE CONFIRMED BEFORE COMMERCIAL RELEASE.**

### D. Deployment and repository safety
- Active development branch: `fix/qrnode-phase1-adoption-2026-11-02`.
- Locked baseline: `baseline/qr-generator-v1-locked`.
- PR #5 remains Draft.
- Vercel Preview for commit `be2666ab8856655e6ecc0eadc4ddc8875561b549` is READY at `https://qr-generator-hosgffl5i-risakil.vercel.app`.
- GitHub commit status reports Vercel success.
- Production domain/deployment and locked baseline are protected and have not been intentionally changed in this work.

Status: **PREVIEW DELIVERY WORKS; FINAL PUBLIC ACCESS/DOMAIN/RELEASE GATE IS NOT COMPLETE.**

### E. Phase 3 database/security preparation
- Neon selected by owner for the primary QR Generator database.
- Primary Vercel Neon integration: `neon-champagne-door`; generated connection variables were scoped to Preview.
- Secondary Neon store `neon-claret-cushion` and its `STORAGE_` variables are not to be used or modified.
- `@neondatabase/serverless` dependency added.
- Admin-only `GET /api/admin/database-health` endpoint implemented.
- Endpoint validates session, accepts only PostgreSQL URLs on a `.neon.tech` host, and runs only `SELECT 1 AS health_check`.
- Endpoint response is sanitized and cache-disabled.
- Seven mocked test groups pass for method restriction, Admin auth, missing URL, wrong host, read-only query, malformed result, and sanitized errors.
- Phase 2 CI passed; Phase 3 static/schema/security CI passed on the reviewed prior commit.
- Dynamic QR migration file exists but has **NOT** been applied to any database.

Status: **PREPARATION COMPLETE; REAL LIVE NEON CONNECTION IS NOT VERIFIED.**

## 3. Work not yet complete

### P0 — Release blockers
1. Verify the latest Preview can be reached by the intended public testers without requiring a Vercel login. Do not disable or weaken deployment protection without explicit owner approval.
2. Log in to the latest Preview Admin and invoke `GET /api/admin/database-health` from that authenticated session. Confirm a real `connected: true` response. Do not paste database URLs, credentials, cookies, or tokens into chat/logs.
3. Re-run final regression tests on the latest Preview: all 18 QR types, scan/decode, PNG/SVG, logo, colors, presets, saved projects, sharing, responsive layout, bilingual navigation, Admin login/logout/session expiry, and global settings sync.
4. Confirm public/production domain, canonical URL, hreflang, sitemap, robots, support contact, legal entity details, and owner disclosures. The current main HTML contains canonical references to `qrnode.boothpro.my.id`; confirm that this is the intended public canonical domain before any domain/SEO change.
5. Check all public pages and links, mobile navigation, 404 behavior, accessibility basics, loading/error states, and privacy/terms accuracy against the actual deployed app.

### P1 — Complete Dynamic QR (not currently live)
1. After live Neon health check succeeds, and only after the owner explicitly authorizes applying the migration, apply the reviewed migration to the dedicated Preview database only.
2. Add safe, parameterized data-access functions and Admin-only CRUD APIs: create, list, edit destination/title/expiry, pause, resume, soft-delete.
3. Use cryptographically secure non-sequential slugs with at least 128-bit entropy. Slug must remain immutable after the QR is issued.
4. Implement a first-party resolver route `/r/:slug`. Resolve destination only from the database; never accept redirect destination from query parameters.
5. Correct status handling: unknown/deleted → 404; expired → 410; paused/not-yet-active → safe informational page; active → 302/307 redirect.
6. Add request validation, same-origin/CSRF controls for writes, Admin authorization, rate limiting, safe errors, bounded request sizes, and audit events.
7. Ensure analytics failure does not break an otherwise valid redirect.
8. Add tests for lifecycle persistence across cold starts/redeploys, invalid URLs, open-redirect attempts, injection payloads, authorization, expiry, slug collisions, and database failures.

### P1 — Complete analytics
1. Persist privacy-minimized scan events in `qr_scan_events`.
2. Never store raw IP, email, phone, full user-agent, or full referrer URL in the analytics table.
3. Collect only coarse device class, referrer class, country code when provided by trusted infrastructure, and timestamp.
4. Provide Admin-only aggregate reporting with bounded date ranges and indexed queries.
5. Define retention, deletion/aggregation policy, privacy notice updates, and abuse controls.
6. Verify scan counts, timezone boundaries, repeated scans, bot/noise handling, and analytics-outage behavior.

### P2 — Commercial/public hardening
1. Verify production-grade HTTPS, domain redirects, canonical/hreflang, sitemap, robots, metadata, and broken-link checks.
2. Confirm all public pages have accurate owner/contact/legal disclosures; owner must approve legal identity and policy text.
3. Check performance, mobile usability, keyboard navigation, contrast, accessible labels, and error messaging without changing established design.
4. Review third-party CDN dependencies, availability/fallback behavior, dependency pinning, and security headers/CSP in a separate additive hardening pass.
5. Add operational monitoring, database backup/restore plan, usage/cost limits, retention jobs, and incident/recovery notes.
6. Verify sponsor/AdSense controls remain inactive until the owner intentionally configures and approves monetization. Never claim AdSense approval or revenue is guaranteed.
7. Document full ownership handover. The existing plan is documentation only; do not claim an automated transfer feature exists.

## 4. Progress estimate

**Estimated overall completion: approximately 73% (reasonable range 70–75%).**

This is a weighted engineering-readiness estimate, not a percentage of code lines:
- Static QR core and user-facing generator: 100% of this module, weighted 45%.
- Admin/auth/global settings foundation: approximately 90%, weighted 15%.
- Hosting, privacy, and Preview security foundation: approximately 80%, weighted 10%.
- Neon connection and database readiness: approximately 50%, weighted 10% (mock tests pass; live connection and migration gate remain).
- Dynamic QR persistence/resolver/CRUD: approximately 5%, weighted 12%.
- Analytics: approximately 0%, weighted 5%.
- Final public/commercial QA and release readiness: approximately 40%, weighted 3%.

Weighted subtotal: 45 + 13.5 + 8 + 5 + 0.6 + 0 + 1.2 = 73.3%, rounded to approximately 73%. Recalculate this estimate only when acceptance evidence changes. Do not call the product 100% merely because CI is green or Vercel reports READY.

## 5. Strict implementation sequence

**Phase 0 — Freeze and baseline**
- Confirm branch/head and preserve the locked baseline.
- Record protected behavior and current test results.
- Create a regression checklist before touching code.

**Phase 1 — Safe audit and release hygiene**
- Verify public pages, metadata, link integrity, mobile behavior, Admin failure modes, and current Preview access.
- Fix only confirmed defects with minimal additive patches.
- Do not redesign the existing generator.

**Phase 2 — Live database gate**
- Test the Admin-only read-only Neon probe against the real Preview environment.
- If it fails, diagnose only the connection/configuration path. Do not expose secrets.
- Do not apply migration until the real health check succeeds and the owner explicitly authorizes the Preview schema change.

**Phase 3 — Dynamic QR backend**
- Apply migration only after the gate above.
- Implement and test repository/data layer, CRUD, resolver, lifecycle, authorization, rate limiting, audit trail, and persistence.
- Do not connect the new backend to the existing static QR workflow in a way that changes its behavior.

**Phase 4 — Analytics**
- Implement event collection and aggregate queries with privacy controls, retention, and failure isolation.
- Keep static QR generation independent from analytics.

**Phase 5 — Additive UI integration**
- Add Dynamic QR and analytics UI as clearly separate modes/sections.
- Keep the existing static QR generator layout, controls, element IDs, payload formats, export functions, and saved-project behavior unchanged.
- Add feature flags or safe disabled states if backend readiness is incomplete.

**Phase 6 — Full QA and commercial readiness**
- Run automated CI, browser tests, QR decoding, mobile/desktop, security, persistence, privacy, and load tests.
- Test on Preview with public tester access as approved.
- Produce a pass/fail report with evidence, known limitations, and rollback instructions.

**Phase 7 — Owner release gate**
- Present Preview for owner acceptance.
- Keep PR Draft and Production untouched until explicit owner approval for merge/release.
- Never deploy to Production, change Production environment variables, move domains, or overwrite the locked baseline under this prompt.

## 6. Acceptance criteria for 100%

The project may be marked **100% ready for public/commercial use** only when all applicable criteria below have evidence:
- All 18 existing static QR categories generate correct payloads and pass real decode/scan tests.
- PNG/SVG exports, logos, colors, sizes, sharing, presets, saved projects, mobile/desktop layouts, and bilingual navigation work without regression.
- Admin login/logout, session expiry/revocation, fail-closed behavior, global settings, and cross-browser sync pass live tests.
- Preview/public tester access works as intentionally configured; deployment protection is not weakened without owner approval.
- Real Neon health probe passes; migration is reviewed and explicitly authorized; database backup/restore and persistence tests pass.
- Dynamic QR create/edit/pause/resume/expiry/delete and immutable redirect slugs work after redeploy/cold start.
- Resolver is safe against open redirects, injection, unauthorized writes, and abuse.
- Analytics are persistent, aggregate-only, privacy-minimized, bounded, and retention-controlled.
- Public pages, legal disclosures, privacy notice, contact, SEO, domain, links, accessibility, and performance are reviewed.
- CI and browser QA are green on the final candidate commit; no unresolved critical/high defects remain.
- Owner accepts Preview and separately approves Production release.

## 7. Master prompt for the implementation agent

You are the senior engineer responsible for completing QR Studio Pro / QR Generator in repository `Digitalprodukstore/qr-generator`.

Your goal is to bring the product to verified 100% public/commercial readiness while preserving all existing working features.

### Absolute rules
- Existing working features are protected. Do not redesign, rewrite, remove, rename, replace, or alter their behavior.
- Work only on `fix/qrnode-phase1-adoption-2026-11-02` or a new clearly named feature branch based on it. Do not work on Production or the locked baseline.
- Do not merge PR #5, promote/deploy to Production, modify Production environment variables, change production domains, or overwrite `baseline/qr-generator-v1-locked`.
- Do not touch the secondary Neon store `neon-claret-cushion` or any `STORAGE_` environment variable.
- Use the primary Preview Neon integration only.
- Never expose secrets in code, browser bundles, logs, screenshots, commits, or chat.
- Do not apply the SQL migration until the real authenticated Preview health probe returns `connected: true` and the owner explicitly authorizes the Preview migration.
- Do not invent test results. Distinguish automated CI, manual owner-reported QA, and tests you actually execute.
- Do not activate AdSense or other paid services without explicit owner approval.
- No new unrelated features. Finish the approved product scope only.

### Required working method
1. Inspect current branch, commit, deployment, PR, and existing tests before editing.
2. Write a short plan for each phase with files expected to change and protected behaviors.
3. Run baseline tests before changes.
4. Implement one small, reviewable change at a time.
5. Add regression tests before/with each change.
6. Run the full affected test suite after every patch.
7. Deploy only to Vercel Preview when appropriate; verify commit SHA, branch, and READY state.
8. If an external access/auth gate blocks a test, report it as blocked; do not weaken security to bypass it.
9. Keep a running completion checklist and update progress based on evidence.
10. Stop at approval gates and request only the specific authorization required.

### Required deliverables
- Working Preview implementation with all existing static QR features preserved.
- Dynamic QR CRUD and resolver, only after the database gate.
- Privacy-minimized persistent analytics, only after backend tests.
- Automated regression/security/browser tests.
- Updated accurate Privacy, Terms, FAQ, Tutorial, Contact, and SEO metadata where required.
- Deployment and operations runbook, backup/restore notes, rollback steps, and ownership-transfer checklist.
- Final QA matrix showing each acceptance criterion as PASS / FAIL / BLOCKED with evidence.
- Final report listing commit SHA, Preview URL, CI runs, test results, known limitations, and remaining owner decisions.

### Definition of done
Do not report 100% until every acceptance criterion in Section 6 is PASS with evidence and the owner has accepted the Preview. A green build alone is not completion. Production release remains a separate owner-controlled action.


## 8. Update after audit document commit (2026-11-10)

- Master audit/megaprompt committed as `cfb4f6e4dfc5f416a9a7c2489f96cce142e1f379` on the Preview feature branch.
- Vercel created a new Preview deployment for that exact commit: `https://qr-generator-lbnuz83d4-risakil.vercel.app`, state READY.
- GitHub Phase 2 run `42750670302` completed its `premium-static-checks` job successfully.
- GitHub Phase 3 run `42750670341` completed its `schema-static-guard` job successfully, including migration safety, Dynamic QR validation, same-origin/CSRF, and mocked Admin-only Neon health endpoint checks.
- The Preview homepage returned HTTP 200 through the deployment fetch route. This confirms the deployed static page can be fetched through the authorized Preview access mechanism; it does not by itself prove anonymous public access for all testers.
- The live database health endpoint remains blocked by Vercel deployment authentication when fetched without an authenticated Admin browser session. Real Neon connectivity remains NOT VERIFIED.
- No application feature code was changed in this documentation commit. No migration was applied, no Production target was deployed, and PR #5 remains Draft.
