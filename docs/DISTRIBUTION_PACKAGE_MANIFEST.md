# Codester Distribution Package Manifest — QR Studio Pro

Status: preparation manifest only. Do not publish or deliver the archive until all release gates in `PRE_SALE_AUDIT.md` are closed.

## Package identity

- Product: QR Studio Pro — Static QR Generator Commercial Edition
- Sale model: non-exclusive licence through Codester; seller retains ownership of original application IP.
- Source branch: `fix/qrnode-phase1-adoption-2026-11-02`
- Package version/commit: set only after security, dependency, licence, and buyer-install QA gates pass.
- Deployment: buyer-owned Vercel project; Preview only for seller QA. No seller production resources are transferred.

## Candidate include list

Include application files required for the buyer to build and deploy the current AS-IS product:

- `index.html`, `en/index.html`, and public content pages: `about.html`, `contact.html`, `disclaimer.html`, `faq.html`, `privacy.html`, `terms.html`, `tutorial.html`, `use-cases.html`.
- `admin-settings.js`.
- `api/` serverless routes and shared helpers.
- `assets/tailwind.generated.css`.
- `styles/tailwind.input.css`, `tailwind.config.cjs`.
- `package.json`, `package-lock.json`.
- `vercel.json`, `.gitignore`.
- `db/migrations/` only with clear documentation that Dynamic QR endpoints/features are not complete or included in the commercial feature claim.
- Buyer-facing documentation: `README.md`, `ADMIN_AUTH_SETUP.md`, `docs/AS_IS_FEATURE_MATRIX.md`, `docs/BUYER_INSTALLATION_GUIDE.md`, `docs/BUYER_HANDOVER_CHECKLIST.md`, `docs/THIRD_PARTY_ASSET_INVENTORY.md`, `docs/SECURITY_DISTRIBUTION_AUDIT.md`, and any final buyer support document.
- Third-party licence/notice files required by the completed SBOM and asset review.

## Candidate exclude list

Exclude from the buyer ZIP unless a documented technical reason requires otherwise:

- `.git/`, GitHub PR metadata, branches, commit history, and repository internals.
- `.github/workflows/` (CI configuration is seller development infrastructure, not needed to run the app).
- `node_modules/`, npm caches, build caches, test output, browser binaries, temporary files, and logs.
- `.env`, `.env.*`, local environment files, secrets, API tokens, private keys, certificates, database dumps, and any credential-bearing files.
- Seller Vercel project metadata, seller-only environment configuration, account identifiers, deployment logs, and private operational records.
- Internal planning prompts, private audit work notes, and roadmap documents that describe unfinished Dynamic QR/analytics features; include only the AS-IS feature matrix and buyer-relevant documentation.
- Any seller-only screenshot, customer data, or personal information.
- Any file or asset whose commercial redistribution rights have not been verified.

## Mandatory substitutions and buyer setup

Before the release archive is created, verify that buyer-facing placeholders remain intentional:
- Replace `https://example.com` with a neutral documented placeholder or keep it with a clear buyer replacement instruction; do not let it be mistaken for the buyer's real domain.
- Replace `support@example.com`, `Your Business`, `Your Sponsor Name`, and all other contact/legal/business placeholders during buyer installation.
- Buyers create their own Admin credentials, session secret, Upstash Redis, optional Neon database, Vercel project, and domain.
- No seller account, domain, secret, or hosted database is included.

## Packaging validation steps

1. Resolve the high-severity transitive `picomatch` advisory or document an approved risk disposition and ensure the full browser workflow has an acceptable result.
2. Complete full Git-history secret scan and current-tree scan; remediate historical exposed credentials by rotation/revocation if any are found. Never copy secret values into the report.
3. Complete transitive SBOM and licence-notice review, including CDN-hosted QR encoder, Google Fonts, and cdnjs assets.
4. Confirm seller rights for all original code, copy, graphics, logos, fonts, icons, and included assets.
5. Finalize the non-exclusive application licence and Codester Regular/Extended scope; do not promise copyright transfer or rights beyond Codester terms.
6. Build the ZIP from an explicit allowlist, not by zipping the repository root.
7. Inspect archive listing for forbidden paths/patterns and scan archive contents for secrets.
8. Extract into a clean directory, run the documented install/build process, and deploy to a buyer-owned Vercel Preview with buyer-owned Upstash.
9. Complete the buyer acceptance checklist on desktop and mobile, including Admin login, session logout, rate limiting, settings persistence, PNG/SVG export, and all 18 QR types.
10. Record final package commit SHA, archive checksum, tested Node/npm versions, and test results.

## Important limitations

- This manifest is not the final ZIP and does not certify that every listed file is legally distributable.
- Dynamic QR, redirect resolver, campaign analytics, cloud-synced projects, and active AdSense are not included.
- Do not add the root `LICENSE` until the seller-approved application licence and third-party notice requirements are confirmed.
