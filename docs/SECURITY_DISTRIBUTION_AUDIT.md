# Security & Distribution Audit — QR Studio Pro

Audit date: 18 November 2026  
Reviewed ref: `9a4377dcf4d1d4e3ea6522f9448f6c331825cac5`  
Scope: source-tree review of buyer-facing configuration, Admin authentication, deployment settings, contact/legal identity, and common credential patterns. This is a focused static review, not a penetration test or a complete Git-history secret scan.

## Executive result

**Status: NOT YET READY FOR FINAL SOURCE ZIP.**

The inspected Admin implementation uses server-side environment variables for credentials and Redis for sessions, login rate limiting, and shared settings. No common hardcoded production credential/API-key pattern was found in the inspected authentication/configuration files. However, the distribution package still needs seller-identity separation, full history/dependency scans, and a final packaging check.

## Findings

### 1. Admin credentials and server secrets

- Admin email, password, PIN, and session signing key are read from server environment variables: `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_PIN`, and `ADMIN_SESSION_SECRET`.
- Admin login compares the submitted credentials server-side; browser JavaScript is not the source of truth for authentication.
- Active session records, rate-limit counters, and shared settings require buyer-provided Upstash Redis credentials.
- The application fails closed when required authentication or Redis configuration is missing/unavailable.
- The inspected auth/config files did not contain a detected hardcoded Admin password, PIN, Upstash token, Neon URL, or common provider/API-key literal.
- This does not establish that Git history, uninspected files, deployment logs, or external accounts contain no secrets. A full historical secret scan remains required.

### 2. Test-only database fixture

The database health test contains a deliberately fake connection string using the username/password pair `probe:secret` and a non-production Neon hostname. It is used as a test fixture and is not a live database credential based on the inspected test code. Keep it clearly marked as synthetic; do not copy it into deployment settings.

### 3. Seller identity embedded in the public contact page

The current `contact.html` includes seller-specific email, WhatsApp number, and operator/brand details. These details are appropriate only if the seller intentionally keeps them on the public demo. They must **not** be silently shipped as the buyer's own business contact details.

Packaging requirement:
- Include a clearly labelled buyer action in the handover guide to review and replace the contact page's email, phone/WhatsApp, operator name, service hours, privacy contact, terms, and legal/business disclosures.
- For a white-label distribution archive, create a buyer-ready contact-page variant with explicit replacement placeholders, or make a documented pre-packaging copy that removes seller contact details. Do not overwrite the seller's live demo identity without approval.

### 4. Domain and deployment ownership

- Buyer installation must use the buyer's own GitHub repository, Vercel project, environment variables, Upstash database, optional Neon database, and domain/DNS account.
- The seller's hosting accounts, domains, credentials, API keys, and service subscriptions are excluded from the sale.
- A custom domain is configured through the buyer's Vercel project and DNS provider. The source does not need a seller-domain substitution merely to use a buyer-owned domain.
- Current source review found seller-domain references in `index.html`, `en/index.html`, `sitemap.xml`, and `robots.txt` (`qrnode.boothpro.my.id`). Both language home pages also contain a BoothPro soft-file URL as the sample QR payload and a BoothPro Instagram URL as the sponsor default. Replace these with neutral examples or buyer-owned values in the distributable package.
- Verify all public canonical, hreflang, sitemap, robots, Open Graph, contact, and legal references during final package preparation. Do not include seller Production credentials or project configuration.
- Keep the seller's live Production domain untouched; make buyer-neutral changes only on the sale/development branch and in the generated ZIP.

### 5. Deployment headers

The current Vercel configuration includes nosniff, referrer policy, frame denial, HSTS, and a restrictive permissions policy. A complete Content Security Policy has not been established; inline scripts/styles and third-party runtime assets need a compatibility/security review before adding CSP.

### 6. Dependency and third-party licensing

The current third-party inventory is explicitly partial. It identifies the direct Neon dependency and runtime QR/font/icon assets, but does not constitute a full transitive SBOM or licence clearance.

Before release:
- Run a clean install from the lockfile.
- Generate and review a complete transitive dependency licence/SBOM report.
- Preserve MIT, SIL OFL 1.1, Apache 2.0, and any other applicable notices.
- Decide whether fonts/icons remain externally hosted or are bundled with required notices.
- Confirm the seller has the rights to distribute all application code, visual assets, and included content.
- Add the seller-approved application licence for the non-exclusive sale; no root application `LICENSE` file is present at this audit.

## Source ZIP exclusion rules

The release archive must exclude at minimum:

- `.git/` and repository metadata.
- `.env`, `.env.*`, local secret files, credentials, API tokens, private keys, certificates, and database dumps.
- `node_modules/`, caches, logs, temporary files, editor/OS metadata, and test artifacts not required by buyers.
- Seller-only Vercel project metadata or account-specific configuration, if present.
- Any private screenshots, customer data, deployment logs, or seller-owned operational records.

Do not exclude `package-lock.json`, application source, API routes, required assets, migrations/documentation that accurately describe the product, or third-party licence notices.

## Cleanup completed on the development/sale branch

The following buyer-facing defaults have now been neutralized on this branch only:

- Canonical and hreflang references in both language home pages use the reserved `example.com` placeholder.
- `sitemap.xml` and `robots.txt` use the same placeholder pending buyer domain configuration.
- Sample QR payloads and sponsor/social defaults no longer point to BoothPro-owned destinations.
- Contact, privacy, terms, FAQ, tutorial, and about pages no longer contain the seller's direct email/phone/operator identity; buyer replacement placeholders are used.
- A follow-up scan of the public-facing HTML/SEO files found no remaining matches for the checked seller email, phone, BoothPro domains, QRNode production domain, live-session sample token, or BoothPro brand string.

These are development-branch edits only. No Production domain, account, environment variable, or deployment was changed. The final buyer must replace `example.com`, `support@example.com`, and other clearly marked placeholders before public launch.

## Required release gates

- [ ] Complete secret scan of the current source tree and full Git history.
- [ ] Confirm seller-specific contact/legal identity is clearly marked for replacement or neutralized in the buyer archive.
- [ ] Replace seller-specific canonical/hreflang/sitemap/robots URLs with the buyer's domain or clearly documented placeholders.
- [ ] Replace seller-specific sample QR payload and sponsor/social defaults with neutral placeholders or buyer-owned values.
- [ ] Complete transitive dependency licence/SBOM review.
- [ ] Confirm ownership/licensing rights for original code, images, icons, fonts, and all included assets.
- [ ] Add approved non-exclusive commercial licence and required third-party notices.
- [ ] Build a clean source ZIP using an explicit allowlist/exclusion list.
- [ ] Extract the ZIP into a clean directory, install dependencies, deploy a buyer-owned Preview, and execute the buyer acceptance checklist.
- [ ] Do not claim security certification, full licence clearance, or guaranteed compatibility.

## Limitations of this audit

This review did not run a full Git-history secret scanner, a dependency SBOM/licence scanner, an independent penetration test, or a buyer-owned clean-room deployment. It must not be represented as certification or proof that no secret exists anywhere in the project history.
