# Security & Distribution Audit — QR Studio Pro

Audit date: 18 November 2026  
Reviewed branch HEAD: `8f559e2005e29888698843ce60c4a8627b9120da` (18 November 2026)  
Scope: source-tree review of all 56 tracked text/code/config/documentation files in the reviewed sale-branch tree for common credential patterns, plus targeted Admin/authentication and buyer-facing configuration review. A sample of 28 recent commit patches was also checked for common token/private-key patterns. This is a focused static review, not a dedicated secret-scanning product, a complete Git-history secret scan, or a penetration test.

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
- The current 56-file text/code/config/documentation tree scan found no matches for the tested common provider-token/private-key/credential-assignment patterns. The 28-commit patch sample also found no matches. This does not establish that all Git history, binary files, deployment logs, branches, tags, or external accounts contain no secrets; a complete historical secret scan remains required.

### 2. Test-only database fixture

The database health test contains a deliberately fake connection string using the username/password pair `probe:secret` and a non-production Neon hostname. It is used as a test fixture and is not a live database credential based on the inspected test code. Keep it clearly marked as synthetic; do not copy it into deployment settings.

### 3. Seller identity embedded in public pages

The sale branch has been cleaned of the seller's direct email, phone/WhatsApp number, operator identity, and BoothPro branding in the reviewed public pages. Buyer-neutral placeholders such as `support@example.com` and `Your Business` are now used. The buyer must replace all placeholders with their own support and legal/business information before public launch. This cleanup applies only to the development/sale branch; the seller's live Production site was not changed.

### 4. Domain and deployment ownership

- Buyer installation must use the buyer's own GitHub repository, Vercel project, environment variables, Upstash database, optional Neon database, and domain/DNS account.
- The seller's hosting accounts, domains, credentials, API keys, and service subscriptions are excluded from the sale.
- A custom domain is configured through the buyer's Vercel project and DNS provider. The source does not need a seller-domain substitution merely to use a buyer-owned domain.
- The reviewed sale branch now uses `https://example.com` placeholders for canonical/hreflang, sitemap, and robots references. The sample QR payload and sponsor/social defaults have also been neutralized.
- Verify all public canonical, hreflang, sitemap, robots, Open Graph, contact, and legal references during final package preparation; the buyer must replace placeholders with their own domain and identity. Do not include seller Production credentials or project configuration.
- Keep the seller's live Production domain untouched; make buyer-neutral changes only on the sale/development branch and in the generated ZIP.

### 5. Deployment headers

The current Vercel configuration includes nosniff, referrer policy, frame denial, HSTS, and a restrictive permissions policy. A complete Content Security Policy has not been established; inline scripts/styles and third-party runtime assets need a compatibility/security review before adding CSP.

### 6. Dependency and third-party licensing and security

The latest CI run on branch HEAD `8f559e2005e29888698843ce60c4a8627b9120da` completed the static checks and Admin auth tests successfully, but its browser job stopped at `npm audit --audit-level=high`. npm reported 10 high-severity findings in the transitive `picomatch` dependency chain used by Tailwind CSS 3.4.17/build tooling. The log recommends `npm audit fix --force`, which would force a major Tailwind upgrade in this dependency graph. **Do not run `npm audit fix --force` or upgrade Tailwind to v4 without a separate compatibility review and full CSS/browser regression.**

The surfaced advisory GHSA-fc5q-39xc-vjpf / CVE-2026-112366 concerns ReDoS in picomatch versions through 4.0.7. The GitHub Advisory Database currently lists no patched version; npm's registry currently lists 4.0.7 as latest. The issue is disputed by the upstream maintainer, but the published high-severity advisory remains active. In this repository picomatch is a transitive dependency of Tailwind/build tooling, not a direct application runtime dependency. This lowers exposure during normal browser-side static QR generation, but does not eliminate build-time risk. Keep the CI finding visible, do not feed untrusted glob patterns into build tooling, and re-evaluate when a confirmed upstream fix is published. Do not claim “zero vulnerabilities” for the current dependency tree. See the [GitHub advisory](https://github.com/advisories/GHSA-fc5q-39xc-vjpf) and [npm picomatch version history](https://www.npmjs.com/package/picomatch?activeTab=versions).

### Third-party licensing inventory

The current third-party inventory includes 74 lockfile package entries with licence metadata (64 MIT, 7 ISC, 2 Apache-2.0, 1 BSD-3-Clause; no missing metadata fields detected). This remains a metadata-only inventory, not a full SBOM or legal licence clearance. It also identifies the direct Neon dependency and runtime QR/font/icon assets. A pattern-based scan of 35 selected current source/configuration/documentation files found no matches for common token/private-key/credential patterns; this is not a full Git-history secret scan.

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

- [x] Static common-secret-pattern scan of all 56 tracked text/code/config/documentation files in the reviewed tree — no matches found.
- [ ] Run a dedicated secret scanner across every branch, tag, and the complete Git history; review any findings without printing secret values.
- [ ] Confirm seller-specific contact/legal identity is clearly marked for replacement or neutralized in the buyer archive.
- [ ] Replace seller-specific canonical/hreflang/sitemap/robots URLs with the buyer's domain or clearly documented placeholders.
- [ ] Replace seller-specific sample QR payload and sponsor/social defaults with neutral placeholders or buyer-owned values.
- [ ] Complete transitive dependency licence/SBOM review and resolve or formally document the current high-severity build-tool advisory before claiming a clean dependency audit.
- [ ] Confirm ownership/licensing rights for original code, images, icons, fonts, and all included assets.
- [ ] Add approved non-exclusive commercial licence and required third-party notices.
- [ ] Build a clean source ZIP using an explicit allowlist/exclusion list.
- [ ] Extract the ZIP into a clean directory, install dependencies, deploy a buyer-owned Preview, and execute the buyer acceptance checklist.
- [ ] Do not claim security certification, full licence clearance, or guaranteed compatibility.

## Limitations of this audit

This review did not run a full Git-history secret scanner, a dependency SBOM/licence scanner, an independent penetration test, or a buyer-owned clean-room deployment. It must not be represented as certification or proof that no secret exists anywhere in the project history.
