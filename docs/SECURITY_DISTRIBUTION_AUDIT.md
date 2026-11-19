# Security & Distribution Audit — QRnode

Audit date: 18 November 2026  
Reviewed branch HEAD: `760cf971b7d4e147a76338fc4b86b1908f7b641f` (18 November 2026)  
Scope: latest tree contains 60 tracked files. Earlier source-content pattern scans covered 56 tracked text/code/config/documentation files, plus a selected 35-file scan and a sample of 28 recent commit patches for common token/private-key patterns. The branch is 266 commits ahead of the locked baseline. The entire 266-commit delta and all branches/tags have not been scanned commit-by-commit. This remains a focused static review, not a complete Git-history secret scan or penetration test.

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

The latest completed QR Generator CI on commit `66284699e180f99089070ca4f19c58bb84542125` passed static checks, Admin auth tests, and QRNode static checks; its browser job failed at `npm audit --audit-level=high`. The dependency tree resolves `tinyglobby@0.2.17` to `picomatch@4.0.7` (dev/build dependency), and npm reported 10 high-severity findings in this transitive chain used by Tailwind CSS 3.4.17/build tooling. The follow-up documentation commit `4de369563396c0a756c012742e4e957ecc9a91ff` has its Phase 2 and Phase 3 workflows passing; the QR Generator workflow was still in progress at the time of this audit update. The log recommends `npm audit fix --force`, which would force a major Tailwind upgrade in this dependency graph. **Do not run `npm audit fix --force` or upgrade Tailwind to v4 without a separate compatibility review and full CSS/browser regression.**

The surfaced advisory GHSA-fc5q-39xc-vjpf / CVE-2026-112366 concerns a reported ReDoS condition in picomatch. The committed lockfile at reviewed HEAD resolves two development-only copies: `picomatch@2.3.2` and nested `tinyglobby/node_modules/picomatch@4.0.7`; `tinyglobby@0.2.17` is also marked development-only and is in the Tailwind/build-tool dependency graph. These are not direct application runtime dependencies, which lowers exposure during normal browser-side static QR generation but does not remove build-time or developer-tooling risk.

The GitHub Advisory Database was updated on 17 November 2026 and, at the time of this review, shows affected versions as **Unknown** and patched versions as **Unknown**. A secondary vulnerability aggregator reports `4.0.8` as a possible fixed version, but this is not corroborated by the GitHub advisory or the lockfile evidence inspected here. Treat the fix status as **unconfirmed**; do not force an override to `4.0.8`, run `npm audit fix --force`, or upgrade Tailwind to v4 without confirming the upstream release, dependency compatibility, and full CSS/browser regression. Keep the CI audit finding visible and do not claim “zero vulnerabilities.” Re-check the advisory and registry metadata immediately before packaging. See the [GitHub advisory](https://github.com/advisories/GHSA-fc5q-39xc-vjpf), [OSV record](https://osv.dev/vulnerability/GHSA-fc5q-39xc-vjpf), and [secondary version/remediation report](https://www.dbu.gs/vulnerability/PT-2026-117472); the secondary report is not authoritative for declaring the issue fixed.

### Third-party licensing inventory

The current third-party inventory includes 74 lockfile package entries with licence metadata (64 MIT, 7 ISC, 2 Apache-2.0, 1 BSD-3-Clause; no missing metadata fields detected). This remains a metadata-only inventory, not a full SBOM or legal licence clearance. It also identifies the direct Neon dependency and runtime QR/font/icon assets. A pattern-based scan of 35 selected current source/configuration/documentation files found no matches for common token/private-key/credential patterns; this is not a full Git-history secret scan. The latest Git tree contains 60 tracked files and no filenames matching common `.env`, private-key, certificate, database-dump, or credential-file patterns; filenames alone do not prove that file contents or Git history are clean.

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

## Follow-up review — 18 November 2026

- Reviewed branch HEAD: `760cf971b7d4e147a76338fc4b86b1908f7b641f`; current tracked tree lists 60 files.
- The tree filename review found no paths matching common `.env`, private-key, certificate, database-dump, or credential-file naming patterns. This was a filename-only check; a full content scan of all 60 files and a commit-by-commit historical secret scan have not been completed in this review.
- The latest branch lockfile contains `picomatch@2.3.2` and `picomatch@4.0.7`, both marked `dev: true`; the latter is nested beneath `tinyglobby@0.2.17`.
- The official GitHub advisory update dated 17 November lists affected and patched versions as Unknown. A secondary source mentions 4.0.8, but no override was applied because the fix status is not authoritatively confirmed.
- PR #5 remains Draft/open, based on `lock/qr-studio-pro-premium-v3-2026-10-15`; no merge or Production change was made.


## Follow-up review — full Git-history scan completed (18 November 2026)

- Added `.github/workflows/secret-history-scan.yml` on the sale/development branch. The workflow checks out the full available history (`fetch-depth: 0`) and runs Gitleaks against all fetched refs using `git --log-opts=--all`.
- Gitleaks container is pinned by immutable image digest; scan output is configured for 100% redaction. The workflow uses read-only repository contents and does not upload a report artifact containing candidate secrets.
- Exact branch HEAD scanned: `b766d54e698bfd630892b4e32390ac7565fed21f`.
- Push run: `44238511325` — SUCCESS. Pull-request run: `44238519287` — SUCCESS.
- Both logs independently report **362 commits scanned**, approximately **1.19 MB** scanned, and **no leaks found**.
- Scope: all Git refs/history fetched from the origin repository by the workflow at scan time. This does not inspect private local clones, deleted/unreachable Git objects, forks not fetched, GitHub issues/discussions, CI artifacts/logs outside this job, vendor dashboards, or credentials already exposed elsewhere. It is a strong repository-history result, not proof of global absence of secrets.
- The earlier 56-file and 28-commit sample scans remain historical evidence only; the full-history Gitleaks result supersedes the outstanding Git-history gate for this scanned HEAD.
- PR #5 remains Draft/open and unmerged, based on the locked baseline. No Production deployment or settings were changed.

### Release-gate update
- [x] Dedicated Gitleaks scan across all fetched origin refs and complete reachable Git history at the scanned HEAD — no leaks found.
- [ ] Generate/review a complete transitive SBOM and actual licence notices, including externally hosted fonts/icons/QR assets.
- [ ] Resolve or formally document the current high-severity picomatch build-tool advisory and obtain a passing full QR browser workflow without forcing a Tailwind major upgrade.
- [ ] Finalize application licence wording and third-party notices.
- [ ] Build the ZIP from the allowlist, run archive secret scan, and complete buyer-owned clean-room installation/QA.


## Follow-up review — CycloneDX SBOM generated (18 November 2026)

- Added `.github/workflows/sbom.yml` to generate a CycloneDX 1.5 SBOM after a clean `npm ci --ignore-scripts` from the committed lockfile.
- SBOM run: `44238774223` on commit `3f83389f386d92d79a7c5a8ce990f804a3cf852f` — SUCCESS. The SBOM was validated and uploaded as artifact ID `14398816802` (`qr-studio-pro-cyclonedx-sbom.zip`); SHA-256 of the uploaded artifact: `6c3ed59fa542403b41069bb817c09e66aa8c3c7b6cc0aac96297146be640bb2f` (14-day retention).
- CycloneDX report contains **73 installed components**; all 73 have declared licence metadata. Counts: MIT 63, ISC 7, Apache-2.0 2, BSD-3-Clause 1. The package lock separately contains 74 node_modules entries: 73 installed on the Linux runner plus optional `fsevents@2.3.3`, which is not installed on Linux.
- Lockfile dependency flags identify one production dependency (`@neondatabase/serverless@1.2.1`, MIT), 72 development dependencies, and one optional development dependency (`fsevents`). This confirms the high-severity picomatch chain is in development/build tooling, not the single declared production dependency. It does not mean build-time risk is absent.
- The SBOM records package metadata and declared licence identifiers; it does **not** include the complete text of each package's licence or establish legal clearance. The 63/7/2/1 counts must not be treated as approval to redistribute without preserving notices.
- npm SBOM does not cover separately hosted runtime assets such as Google Fonts, cdnjs libraries, QR encoder assets, or bundled non-npm fonts/icons. Those require a separate asset-by-asset licence/notice review.

### Release-gate update
- [x] Generate CycloneDX SBOM from clean locked dependency installation and verify component/licence metadata.
- [ ] Review actual licence texts/notices for all installed packages and preserve required notices in the buyer archive.
- [ ] Review third-party runtime/CDN assets and bundled fonts/icons independently.
- [ ] Resolve or formally document the picomatch build-tool advisory; do not force a Tailwind major upgrade.
- [ ] Finalize application licence wording, then build and scan the allowlist ZIP and complete buyer-owned clean-room QA.


## Upstream picomatch remediation status — 18 November 2026

- Rechecked the official GitHub Advisory and upstream repository. GHSA-fc5q-39xc-vjpf / CVE-2026-112366 is still published as High; the advisory page lists affected and patched versions as Unknown, while npm audit flags the installed released versions through `4.0.7` and the current lockfile's picomatch copies.
- Upstream issue `micromatch/picomatch#247` remains open. Candidate fix PR `#238` for the master/4.x line remains open and unmerged; candidate PR `#246` for the v2 line remains open and unmerged. The official release list still shows `4.0.7` as latest; no official `4.0.8` release was confirmed.
- A secondary aggregator recommends `4.0.8`, but that version is not corroborated by the official release list or the GitHub advisory. Do not force an npm override to 4.0.8, do not use `npm audit fix --force`, and do not suppress the audit. The v2 copy also needs a fix, so a 4.x-only override would not clear the full tree.
- The SBOM and lockfile classify the vulnerable chain as development/build tooling. This lowers normal browser-runtime exposure but leaves CI/build-time risk and does not justify calling the dependency tree clean.
- Decision: retain the current locked Tailwind 3.4.17 toolchain, keep the high-severity audit visible, and defer dependency remediation until upstream ships a reviewed release for both affected major lines or an independently tested compatible mitigation is available. Re-run npm audit and all browser/CSS regression checks after any later remediation.


## Third-party notice text collection — 18 November 2026

- Extended the CycloneDX workflow to collect the actual package-root `LICENSE`, `LICENCE`, `COPYING`, and `NOTICE` text files for package name/version pairs present in the generated SBOM. Non-dependency test fixtures discovered under nested package directories are excluded from this notice count.
- Latest SBOM + notice workflow run: `44239324540` — SUCCESS, source commit `165a776f72c9260175520f265b128e2efbe24030`.
- Artifact: `qr-studio-pro-sbom-and-licence-notices.zip`, ID `14397943745`, SHA-256 `97ce030e1465a9ae8b9c64550c1b743228b3896453c59acf71a011a1c33618dd` (14-day retention). It contains the CycloneDX 1.5 report and the collected notice-text bundle; it is an internal audit artifact, not the buyer ZIP.
- CycloneDX: 73 components, 72 unique name/version pairs, all with declared licence metadata. Licence counts: MIT 63, ISC 7, Apache-2.0 2, BSD-3-Clause 1.
- Actual notice collection: 72 unique SBOM package identities checked; 71 have a matching licence/NOTICE text file in the installed package. One exception: `dlv@1.1.3` declares MIT in package metadata but contains no matching licence file in the installed package. Its upstream GitHub repository root also has no LICENSE file; upstream package metadata identifies Jason Miller as author. Do not invent a copyright year or claim the notice is complete. Obtain an authoritative MIT notice/copyright statement or written rights-holder clarification before redistributing the final package.
- Four additional package.json files discovered in dependency test fixtures were not present in the CycloneDX component set and were excluded from the actual dependency notice count.
- This text collection does not inspect separately hosted runtime CDN/font/icon assets; those still require independent notice and attribution review.

### Release-gate update
- [x] Generate CycloneDX SBOM and reconcile installed components with lockfile metadata.
- [x] Collect actual package licence/NOTICE texts for the installed SBOM dependencies.
- [ ] Resolve the missing `dlv@1.1.3` MIT notice/copyright evidence.
- [ ] Review external CDN/font/icon assets and buyer-facing privacy disclosures.
- [ ] Keep the picomatch advisory as an explicit build-tool release blocker until a reviewed upstream release or validated mitigation is available.


## Verification addendum — 19 November 2026

Reviewed branch: `fix/qrnode-phase1-adoption-2026-11-02`  
Exact reviewed HEAD: `9d65b7d89c127053eb184a014b703f9d7365fb70`  
Preview deployment: `https://qr-generator-ho2xuq7y1-risakil.vercel.app` — Vercel state READY, source SHA matches this HEAD.

### Current verification evidence

- Full Git-history Gitleaks workflow run #98 completed successfully on this HEAD. Scope is fetched origin refs/history only; it does not cover private local clones, unfetched forks/unreachable objects, or external accounts.
- CycloneDX SBOM workflow run #109 completed successfully on this HEAD. This proves the inventory workflow ran, not that every third-party licence is legally cleared.
- Phase 3 schema guard run #298 completed successfully on this HEAD.
- Phase 2 checks run #527 were still in progress at the time of this addendum; do not report them as passed until a completed successful result is observed.
- The QR Generator browser workflow has not been shown green on this exact documentation HEAD. The latest known browser workflow failure remains the `npm audit --audit-level=high` gate with 10 High findings in the transitive `picomatch` chain; browser tests after that gate were skipped.

### Remaining release blockers

- Keep the `picomatch` advisory visible. Do not use `npm audit fix --force`, invent an npm override, suppress the audit, or force a Tailwind major upgrade. Any dependency experiment must be isolated on a separate branch and pass clean install, complete audit review, CSS output comparison, static checks, and the full Chromium QR browser suite.
- `dlv@1.1.3` remains the unresolved third-party package notice item until authoritative MIT notice/copyright evidence is obtained.
- Google Fonts, Material Symbols, and the externally loaded QR encoder remain outside the npm SBOM and require a separate redistribution, attribution, and privacy review.
- Application source licence wording has not been approved or included. Do not create a guessed licence file or claim legal clearance.
- No final allowlist ZIP, archive scan, buyer-owned clean-room deployment, or final buyer acceptance has been completed.

### Branch and production guardrails

- Buyer-facing README, Codester draft, installation guide, handover checklist, distribution manifest, and feature matrix were aligned to the QRnode product name in the latest documentation commits.
- PR #5 remains Draft, open, and unmerged. Production domain `https://qrnode.boothpro.my.id/` remains locked and untouched.
- The current Preview is a documentation/branding update and does not establish final browser QA or commercial release readiness.


## Follow-up review — picomatch advisory verification (19 November 2026)

- Isolated investigation branch: `audit/picomatch-remediation-research-2026-11-19`, created from QRnode sale-branch HEAD `c8e08cfd53ddce4844993675659b8b2950c906e1`. No application code, dependency manifest, lockfile, PR base, or Production configuration was changed in this research step.
- The official GitHub Advisory Database entry for GHSA-fc5q-39xc-vjpf / CVE-2026-112366 still reports affected versions as Unknown and patched versions as Unknown. Its description identifies picomatch versions through 4.0.7 as vulnerable to a ReDoS condition involving single-branch repeated extglob patterns.
- The npm package registry currently identifies 4.0.7 as the latest published picomatch version; no 4.0.8 release is listed in the registry version history at this review. A secondary vulnerability aggregator's 4.0.8 recommendation is therefore not independently confirmed by the registry or the official GitHub advisory and must not be treated as an available verified fix.
- The inspected upstream picomatch pull request #194 is about parsing a leading `?` in an extglob body; it is not evidence of a fix for CVE-2026-112366.
- Decision: do not add an npm override, fabricate a 4.0.8 lockfile resolution, suppress the audit, or force a Tailwind major upgrade. Keep the existing high-severity audit gate visible until an upstream patch/release or a separately validated dependency-path change is available.
- Next validation must use a real published package version, a clean `npm ci`, `npm audit --audit-level=high`, the Tailwind CSS build and output checks, static checks, and the full Chromium QR/Design Studio test suite. No Codester-ready or zero-vulnerability claim is authorized by this research.


## Correction — live CI audit and Preview verification (19 November 2026, 17:15 WIB)

The first research note above records the advisory database and package-registry state observed during initial investigation. A subsequent clean CI run on this branch provides new, directly reproducible project evidence:

- Commit: `63941bb7645a8cbfd8449f1e35f0546d418c0e85`.
- Locked dependency tree still contains `picomatch@2.3.2` and nested `picomatch@4.0.7`; this research commit did not change `package.json` or `package-lock.json`.
- `npm ci --ignore-scripts`: PASS; 74 packages audited; npm reported 0 vulnerabilities.
- `npm audit --audit-level=high`: PASS; npm reported 0 vulnerabilities.
- Browser-test dependency install: PASS; 123 packages audited; npm reported 0 vulnerabilities.
- Tailwind CSS build and generated stylesheet checks: PASS.
- Chromium QR decode, Premium Design Studio, and phone/tablet responsive checks: PASS.
- Admin auth, QRnode static checks, Phase 2 checks, and Phase 3 schema/privacy guards: PASS.
- Vercel Preview deployment: READY at `https://qr-generator-nv4hmbooq-risakil.vercel.app`, source branch and SHA match this research branch and commit.

Interpretation: the previously reported 10 High npm audit findings are **not reproducible** by the current locked project dependency tree and npm audit database in this CI run. This is not evidence that picomatch 4.0.7 was patched upstream, nor does it independently resolve the separate GitHub advisory's affected/patched-version metadata. Do not describe the package itself as fixed; retain the distinction between a clean current npm audit result and unresolved upstream advisory metadata. No dependency override, lockfile edit, audit suppression, or forced major upgrade was made.


## Follow-up review — dlv@1.1.3 licence metadata corroboration (19 November 2026)

- The npm registry page for the exact package version `dlv@1.1.3` explicitly declares **MIT** and links the package to `github.com/developit/dlv`. The upstream repository README also labels the package licence **MIT**. This independently corroborates the SPDX licence classification already recorded in the lockfile and CycloneDX metadata.
- The registry lists the package collaborator as `developit`; the upstream README identifies the package repository, but the inspected upstream repository root does not provide a standalone `LICENSE` file. The evidence reviewed here does **not** establish a complete, authoritative copyright notice/year suitable for copying into a redistributed notice bundle.
- Therefore, the earlier wording “MIT licence is unknown” is too broad: **the declared licence is corroborated as MIT; the exact copyright notice text remains unverified**. Do not fabricate a copyright line, year, or rights-holder statement. Keep the buyer-archive notice gate open until the exact published tarball/maintainer notice or written rights-holder clarification supplies the required notice text.
- Sources reviewed: npm package metadata and README for `dlv@1.1.3`, plus the upstream `developit/dlv` repository README. The npm registry reports version 1.1.3 as the published package version and MIT as its declared licence. These sources confirm declared licence metadata, not legal advice or independent ownership clearance.

### Release-gate clarification
- [x] Corroborate `dlv@1.1.3` declared MIT licence against npm registry metadata and upstream README.
- [ ] Verify the exact copyright/permission notice text to include in the buyer archive; do not invent missing notice details.


## External runtime asset review — source inspection and licence evidence (19 November 2026)

Reviewed the sale/research branch source files `index.html` and `en/index.html`. This is a source-reference review; no browser network capture or legal opinion is implied.

### Exact external references found

Both language entry pages currently load:
- Google Fonts CSS for **Geist** and **Inter** from `fonts.googleapis.com`, with font binaries expected from `fonts.gstatic.com`.
- **Material Symbols Outlined** from Google Fonts. The HTML contains two separate stylesheet links for the same family with different axis/display parameters; this is redundant and may cause duplicate CSS/font requests or confusing cascade behavior.
- **qrcode-generator 1.4.4** JavaScript from `cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js`. The script tag has no Subresource Integrity (`integrity`) or `crossorigin` attribute.

### Licence evidence and distribution implications

- **Geist**: the Google Fonts upstream family metadata identifies the Geist Project Authors and its OFL 1.1 licence; the family OFL notice begins “Copyright 2024 The Geist Project Authors”. OFL permits bundling and redistribution with software, subject to carrying the copyright notice and full OFL text and not selling the font by itself. Source: `https://github.com/google/fonts/blob/main/ofl/geist/OFL.txt`.
- **Inter**: Google Fonts metadata identifies Inter as OFL; the family OFL notice begins “Copyright 2020 The Inter Project Authors”. The same OFL redistribution/notice conditions apply. Source: `https://github.com/google/fonts/blob/main/ofl/inter/OFL.txt`.
- **Material Symbols**: Google's official developer guide identifies Apache License 2.0. Source: `https://developers.google.com/fonts/docs/material_symbols`. If icon font binaries or icon files are bundled, include the applicable Apache 2.0 licence and preserve copyright/NOTICE/attribution information as required by that licence. A remotely hosted stylesheet alone is not a redistribution of the font binary by this source archive.
- **qrcode-generator 1.4.4**: upstream JavaScript source identifies “Copyright (c) 2009 Kazuhiko Arase” and MIT licence. Source: `https://github.com/kazuhikoarase/qrcode-generator/blob/master/js/dist/qrcode.mjs`. npm's version history confirms 1.4.4 is a published version; its current package page declares MIT. Source: `https://www.npmjs.com/package/qrcode-generator?activeTab=versions`. The exact CDN-served 1.4.4 file should still be downloaded/hash-checked against the upstream release before creating a buyer notice bundle; do not assume the current upstream branch file is byte-identical to the 1.4.4 CDN asset.

### Runtime privacy and integrity observations

- Because both entry pages reference Google Fonts and cdnjs at runtime, a buyer deployment will make third-party network requests when visitors load the pages. Those providers may receive normal request metadata such as IP address, user-agent, referrer (subject to browser/referrer policy), and requested resource. The buyer should disclose third-party asset providers in their privacy notice and review applicable provider terms and data-transfer requirements.
- The QR encoder is executable JavaScript fetched from a third-party CDN at runtime. Without SRI, the browser does not pin the expected bytes. For a commercial source package, prefer a locally bundled, version-pinned copy with its exact MIT notice, or add a verified SRI hash and retain a documented CDN dependency. Any such change requires the full QR browser regression suite.
- Consider self-hosting Geist, Inter, and Material Symbols only after collecting the exact font binaries, checking each family’s metadata/notice, including full licence text in the archive, and verifying the visual output. No fonts or icon binaries were copied into the repository during this review.

### Product identity consistency finding

The current `index.html` and `en/index.html` still contain legacy visible/schema branding such as “QR Studio Pro” and “QR_GENERATOR”, although buyer-facing documentation and the Codester draft have been renamed QRnode. This is a real release consistency defect, not a new feature. It must be corrected on the sale branch and checked in both languages before the final buyer ZIP; this research-only branch did not modify application HTML.

### Gate status

- [x] Identify the exact external asset URLs used by both generator pages.
- [x] Corroborate upstream licence families for Geist, Inter, Material Symbols, and qrcode-generator.
- [ ] Verify exact CDN qrcode-generator 1.4.4 bytes and preserve its MIT notice in the buyer package.
- [ ] Decide whether runtime external requests remain or assets are self-hosted; update buyer privacy disclosure accordingly.
- [ ] Remove duplicate Material Symbols stylesheet reference and add SRI or bundle a pinned local QR encoder; run complete browser regression if changed.
- [ ] Align Indonesian and English HTML/schema/visible product identity to QRnode on the sale branch and verify both language routes.
- [ ] Include exact Geist/Inter OFL notices and Material Symbols Apache notice only if font/icon binaries are redistributed in the archive.
