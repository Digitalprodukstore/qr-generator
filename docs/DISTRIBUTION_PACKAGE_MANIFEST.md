# Codester Distribution Package Manifest — QRnode

Status: preparation manifest only. Do not publish or deliver the archive until all release gates in `PRE_SALE_AUDIT.md` are closed.

## Package identity

- Product: QRnode — Static QR Generator Commercial Edition
- Sale model: non-exclusive licence through Codester; seller retains ownership of original application IP.
- Source branch: `experiment/remove-tailwind-build-chain-2026-11-18` (isolated QA branch; not merged to locked baseline)
- Package version/commit: provisional build from the isolated experiment branch; final archive SHA-256 and commit are recorded by the package CI artifact.
- Deployment: buyer-owned Vercel project; Preview only for seller QA. No seller production resources are transferred.

## Candidate include list

Include application files required for the buyer to build and deploy the current AS-IS product:

- `index.html`, `en/index.html`, and public content pages: `about.html`, `contact.html`, `disclaimer.html`, `faq.html`, `privacy.html`, `terms.html`, `tutorial.html`, `use-cases.html`.
- `admin-settings.js`.
- `qrnode-upgrade.js` (required: both Indonesian and English generator pages load this script for the 18 QR categories, payload validation, Design Studio, and export features).
- `api/_adminAuth.js`, `api/_adminRateLimit.js`, `api/_redisFetch.js`, `api/_sameOrigin.js`, and `api/admin/{database-health,login,logout,session,settings}.js` (the server-side Admin features required by this edition).
- `assets/tailwind.generated.css`.
- `package.json`, `package-lock.json`.
- `vercel.json`, `.gitignore`.
- `THIRD_PARTY_NOTICES.txt` (CDN asset notices for the QR encoder, Geist, Inter, and Material Symbols; font/icon binaries are not bundled).
- `THIRD_PARTY_NPM_NOTICES.txt` (actual MIT licence text for the sole installed npm dependency).
- `SBOM.cdx.json` (CycloneDX 1.5 inventory for installed npm dependencies; external CDN assets are documented separately).
- `robots.txt` and `sitemap.xml` (buyer-neutral public-site metadata; buyer must replace canonical domain placeholders).
- Buyer-facing documentation: use `docs/BUYER_README.md` as the root `README.md` in the ZIP, plus `docs/AS_IS_FEATURE_MATRIX.md`, `docs/BUYER_INSTALLATION_GUIDE.md`, `docs/BUYER_HANDOVER_CHECKLIST.md`, and `docs/GLOBAL_ADMIN_SETTINGS_SETUP.md`.


## Candidate exclude list

Exclude from the buyer ZIP unless a documented technical reason requires otherwise:

- `.git/`, GitHub PR metadata, branches, commit history, and repository internals.
- `.github/workflows/` (CI configuration is seller development infrastructure, not needed to run the app).
- `scripts/`, `db/migrations/`, and `api/_dynamicQrValidation.js` (seller QA tooling and incomplete Dynamic QR groundwork are not part of the Static QR sale scope).
- `node_modules/`, npm caches, build caches, test output, browser binaries, temporary files, and logs.
- `tailwind.config.cjs` and `styles/tailwind.input.css` (development-only Tailwind sources; the buyer package uses the committed precompiled CSS and does not ship the vulnerable CSS build chain).
- `.env`, `.env.*`, local environment files, secrets, API tokens, private keys, certificates, database dumps, and any credential-bearing files.
- Seller Vercel project metadata, seller-only environment configuration, account identifiers, deployment logs, and private operational records.
- Internal planning prompts, private audit work notes, pre-sale audit reports, security-distribution audit working papers, Codester listing drafts, ownership-transfer planning notes, and roadmap documents that describe unfinished Dynamic QR/analytics features; include only buyer-facing installation/handover instructions, the AS-IS feature matrix, Admin setup instructions, and the buyer-relevant third-party licence notices.
- Any seller-only screenshot, customer data, or personal information.
- Any file or asset whose commercial redistribution rights have not been verified.

## Mandatory substitutions and buyer setup

Before the release archive is created, verify that buyer-facing placeholders remain intentional:
- Replace `https://example.com` with a neutral documented placeholder or keep it with a clear buyer replacement instruction; do not let it be mistaken for the buyer's real domain.
- Replace `support@example.com`, `Your Business`, `Your Sponsor Name`, and all other contact/legal/business placeholders during buyer installation.
- Buyers create their own Admin credentials, session secret, Upstash Redis, optional Neon database, Vercel project, and domain.
- No seller account, domain, secret, or hosted database is included.

## Packaging validation steps

1. Confirm the production-only dependency lockfile and full browser workflow remain green; this isolated experiment removes Tailwind build tooling and its flagged transitive dependency chain.
2. Complete full Git-history secret scan and current-tree scan; remediate historical exposed credentials by rotation/revocation if any are found. Never copy secret values into the report.
3. Review the committed CycloneDX SBOM and npm licence notice text, plus CDN-hosted QR encoder, Google Fonts, and Material Symbols notices/privacy disclosures.
4. Owner confirmed on 18 November 2026 that original application code and owner-created assets may be sold/distributed. Retain this as an owner statement; separately comply with and preserve every third-party component licence and notice.
5. Finalize the non-exclusive application licence and Codester Regular/Extended scope; do not promise copyright transfer or rights beyond Codester terms.
6. Reconcile the buyer ZIP allowlist against all HTML script/style/navigation references; in particular, retain `qrnode-upgrade.js`, which is required by both generator pages, and `assets/tailwind.generated.css`, the precompiled stylesheet used by both languages. Include only the five Admin API endpoints and shared helpers listed above; do not ship the unused Dynamic QR validation helper, Tailwind build sources, or unapplied migration. Copy `docs/BUYER_README.md` to the archive root as `README.md`; do not include the repository's seller-working README.
7. Confirm every link in the buyer-edition README resolves to a file included in the archive; do not ship seller-only audit, PR, pricing, or roadmap working documents.
8. Build the ZIP from an explicit allowlist, not by zipping the repository root.
9. Inspect archive listing for forbidden paths/patterns and scan archive contents for secrets.
10. Extract into a clean directory, run `npm ci`, validate required files/routes, and deploy to a buyer-owned Vercel Preview with buyer-owned Upstash.
11. Complete the buyer acceptance checklist on desktop and mobile, including Admin login, session logout, rate limiting, settings persistence, PNG/SVG export, and all 18 QR types.
12. Record final package commit SHA, archive checksum, tested Node/npm versions, and test results.

## Current evidence — 18 November 2026

- QR Generator workflow run `44241396960` on commit `9f7109f60c2fe05cf22d3476650175313c22be05`: SUCCESS. Static checks, Admin auth tests, QRNode static checks, browser QR decode, Premium Design Studio, responsive viewport checks, high/critical npm audit gate, and production-only lockfile commit all completed successfully.
- SBOM workflow run `44241396975`: SUCCESS. CycloneDX 1.5 lists one installed npm dependency: `@neondatabase/serverless@1.2.1` (MIT). Actual package licence text was collected; no missing npm package notice text. The earlier `picomatch`/Tailwind/`dlv` dependency chain is absent from the installed application dependency set on this experiment branch.
- This evidence is branch-specific and does not authorize merging, Production deployment, or sale publication. The full-history secret scan passed on the current experiment HEAD (run `44243423988`, redacted Gitleaks scan). The latest QR CI run captured four genuine browser screenshots and assembled a candidate buyer ZIP. The first archive-validation pass exposed a working-directory bug in the ZIP verification script; this is being corrected before the package is approved. Seller visual review, demo QA, buyer-owned deployment acceptance, and ownership/licence confirmation remain release gates.

## Latest package pipeline

The QR workflow now captures four genuine UI screenshots and builds a buyer ZIP from the explicit allowlist. It runs `npm ci`, the High/Critical audit, Node syntax checks for the shipped serverless modules, archive integrity validation, and checks for forbidden files before uploading the ZIP artifact. The archive is a CI artifact for seller review, not yet an approved public release.

## Important limitations

- This manifest is not the final approved release and does not certify that every listed file is legally distributable.
- Dynamic QR, redirect resolver, campaign analytics, cloud-synced projects, and active AdSense are not included.
- Do not add the root `LICENSE` until the seller-approved application licence and third-party notice requirements are confirmed.
