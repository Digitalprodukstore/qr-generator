# QRnode — Pre-Sale Audit

Audit date: 19 November 2026  
Reviewed branch HEAD: `cc7dcac753dc6007955dbf3c602230775c22d704`  
Preview: https://qr-generator-m7ibm14jz-risakil.vercel.app  
Scope: prepare the existing Static QR product for a transparent Codester sale. Preserve working features; no new application features are authorized.

## Guardrails

- Work only on `fix/qrnode-phase1-adoption-2026-11-02`.
- Preserve `baseline/qr-generator-v1-locked`.
- Keep PR #5 Draft, open, and unmerged.
- Do not merge, promote, deploy to Production, alter Production environment variables, or change the production domain.
- Do not apply database migrations, modify database resources, rotate secrets, or weaken deployment protection.
- Do not redesign or rewrite existing generator code.
- Do not claim a test passed without attributable evidence.

## Latest verified state

- PR #5 is Draft / open / unmerged and targets `lock/qr-studio-pro-premium-v3-2026-10-15`.
- Exact sale-branch HEAD: `cc7dcac753dc6007955dbf3c602230775c22d704`.
- Vercel reports the matching Preview deployment as READY. This confirms deployment readiness, not anonymous buyer access or production readiness.
- Latest QR Generator workflow run #410 (GitHub run `44542488658`) passed all jobs: static checks, Admin auth tests, QRnode Phase 1 static checks, and browser-QR tests.
- Browser workflow explicitly passed locked install, `npm audit --audit-level=high`, browser dependencies, Tailwind compilation, independent QR decoding, Premium Design Studio, and responsive phone/tablet viewport tests.
- Full Git History Secret Scan run #103 (`44542496294`) passed its Gitleaks scan of fetched repository refs/history.
- CycloneDX SBOM run #114 (`44542496312`) passed generation/validation and package licence/NOTICE text collection.
- Phase 2 run #537 (`44542496300`) and Phase 3 schema guard run #308 (`44542496207`) passed.
- These CI results are attributable to the exact HEAD above. They do not replace manual phone-camera testing or buyer-owned clean-room deployment acceptance.

## Product scope

Included sale scope is **QRnode — Static QR Generator Commercial Edition (AS-IS)**:
- 18 static QR categories and category-specific payload validation.
- PNG/SVG export, logo/color/gradient customization, presets, and Premium Design Studio.
- Indonesian and English interfaces.
- Browser-local recent projects.
- Optional server-protected Admin settings backed by buyer-owned Upstash Redis.

Explicit exclusions:
- Dynamic QR CRUD, redirect resolver, editable destinations, and campaign analytics.
- Cloud-synchronized project history.
- Active AdSense integration or guaranteed advertising revenue.
- Seller's domain, Vercel project, Upstash/Neon resources, credentials, subscriptions, and accounts.

## Current release gate matrix

| Gate | Current status | Evidence / remaining action |
|---|---|---|
| Static QR feature and payload coverage | PASS (CI) | 18 QR categories independently decoded in Chromium. |
| PNG/SVG and visual design | PASS (CI) | Browser workflow passed export, design studio and responsive tests. Real phone-camera and physical-device acceptance remains separate. |
| Static checks and Admin auth handlers | PASS (CI) | Latest QR Generator workflow #410. Live buyer-owned credentials and full logout/expiry acceptance remain outstanding. |
| npm high/critical audit gate | PASS (CI, 19 Nov) | `npm audit --audit-level=high` passed on exact HEAD. This does not mean zero vulnerabilities; re-run and inspect full audit output immediately before packaging. |
| Full fetched-ref Git history secret scan | PASS (CI) | Gitleaks workflow #103 passed. Does not cover unfetched forks, unreachable objects, local clones, or external accounts. |
| CycloneDX SBOM and package notice collection | PASS (CI) | Workflow #114 passed. Manual legal review and the unresolved `dlv@1.1.3` notice issue remain. |
| Phase 2 / Phase 3 static guards | PASS (CI) | Runs #537 and #308. |
| Preview deployment | READY | Matching SHA; public anonymous access has not been independently confirmed. |
| Third-party runtime assets | PARTIAL / RELEASE BLOCKER | QR encoder, Google Fonts and Material Symbols remain external CDN assets outside npm SBOM; complete rights, notice, version and privacy review required. |
| Application's own source licence | OWNER APPROVAL RECEIVED — NOTICE ADDED | Seller approved the non-exclusive model on 20 Nov 2026. `APPLICATION-LICENSE.md` records it; no open-source root `LICENSE` is added. Confirm listing copy and buyer rights against Codester's current Regular/Extended terms. |
| Final buyer ZIP | NOT BUILT | Build from explicit allowlist only after release gates close; scan archive and verify clean extraction/install. |
| Buyer-owned clean-room deployment | NOT TESTED | Requires buyer-owned Vercel and Upstash resources and acceptance. |
| Codester submission | NOT READY | Listing and screenshots are drafts; licence, package, demo access and final QA still need approval. |
| Production | LOCKED / NOT AUTHORIZED | `https://qrnode.boothpro.my.id/` must remain untouched. |

## Dependency advisory interpretation

The earlier `picomatch` audit failure is explained by the upstream GitHub advisory being withdrawn on 18 November 2026. The current lockfile still contains `picomatch@4.0.7` in development tooling; this was not upgraded. The exact 19 November CI audit threshold passed. Keep the lockfile unchanged unless a separate dependency review justifies a change, and re-check the official advisory before release. Do not suppress future audit findings or use `npm audit fix --force` / guessed overrides.

## Remaining release work — in order

1. Resolve the authoritative redistribution notice/copyright evidence for `dlv@1.1.3`, or safely remove/replace the package on an isolated branch and rerun the full CI/SBOM checks.
2. Complete the QR encoder, Google Fonts and Material Symbols external asset licence/attribution/privacy review. Decide whether any assets should be self-hosted; do not bundle them without verified rights and notices.
3. Seller approval for the non-exclusive application-licence model is received and recorded in `APPLICATION-LICENSE.md`. Before submission, confirm listing copy and handover wording against Codester's current Regular/Extended terms; no copyright assignment or exclusivity is implied.
4. Re-run full CI and inspect the complete npm audit/SBOM outputs against the exact release candidate.
5. Complete real phone-camera scans and physical-device export/share checks.
6. Complete Admin logout, session expiry, rate-limit and fail-closed acceptance on an isolated buyer-like Preview. Never request or expose credentials.
7. Verify public Preview access for intended testers without weakening deployment protection.
8. Build the ZIP from the manifest allowlist, exclude Git metadata/secrets/seller-only records, inspect the archive, scan it, extract cleanly, run documented installation/build, and verify all documentation links.
9. Complete buyer-owned Vercel + Upstash clean-room Preview deployment and acceptance.
10. Finalize original screenshots, demo access, listing copy, version/commit, archive checksum and Codester submission metadata.

## Sale decision

**Not ready to submit to Codester yet.** CI is materially healthier and the current browser workflow is green, but unresolved third-party redistribution evidence, external runtime assets, application licence approval, physical-device QA, final ZIP verification, and buyer-owned installation remain release blockers.


## Picomatch advisory status correction — 19 November 2026

The GitHub Advisory Database entry `GHSA-fc5q-39xc-vjpf` / `CVE-2026-112366` is now marked **Withdrawn**, with the advisory page stating it was withdrawn on 18 November 2026. The withdrawal reason references the upstream maintainer discussion; this is not a patched package release. The current lockfile still resolves `picomatch@4.0.7` in development tooling, but the advisory is no longer an active GitHub-reviewed advisory. The latest CI `npm audit --audit-level=high` step also passes on the reviewed HEAD.

Do not describe this as a code patch or claim that `picomatch@4.0.7` was upgraded. Keep the lockfile unchanged unless a separately reviewed dependency update is warranted. Re-check the official advisory before each release: https://github.com/advisories/GHSA-fc5q-39xc-vjpf


## Release evidence correction — current HEAD 7d5533b85265f3ac88eb5f0c0fd66672f4429c95 (19 November 2026)

The package rename changed `package.json` and the root package-lock metadata to `qrnode`; dependency versions and application runtime code were not intentionally changed. Current HEAD is `7d5533b85265f3ac88eb5f0c0fd66672f4429c95`.

On this HEAD, Secret Scan, Phase 2, Phase 3 and CycloneDX SBOM workflows have completed successfully. QR Generator browser workflow run `44544713051` remains in progress at the time of this audit. The locked install, `npm audit --audit-level=high`, browser dependency install and Tailwind compilation steps passed; Chromium installation, QR decode, Premium Design Studio, responsive viewports and the workflow's generated-CSS/lockfile commit step have not yet completed. The full browser test is therefore **PENDING**, not PASS.

`dlv@1.1.3` is declared MIT by npm metadata and the upstream version 1.1.3 `package.json`, but upstream has no standalone `LICENSE` file. Verify the actual published tarball's notice/copyright wording before preparing buyer-facing notices; do not invent attribution.

The earlier green browser workflow evidence on code HEAD `cc7dcac753dc6007955dbf3c602230775c22d704` remains valid for that exact commit only. It must not be represented as the completed result for current HEAD.


## Licence approval and current branch evidence — 21 November 2026

The seller approved the non-exclusive application-licence model on 20 November 2026. The repository now contains `APPLICATION-LICENSE.md`, and the buyer README and distribution manifest link/include it. This closes the owner-approval question for the licence model, but it does not close third-party asset rights or legal review of every bundled component.

Codester's current official licence page states:
- Regular: one project; personal/commercial use; no resale of the item as-is or as part of a project; no distribution of source files.
- Extended: multiple projects; personal/commercial use; source files may be distributed or sublicensed only as part of a larger project; neither licence permits resale of the item as-is.
- Codester states the seller retains ownership of the item.

Source: https://www.codester.com/info/licenses (checked 21 November 2026). Listing copy must not imply that buyers receive copyright ownership, can resell QRnode as-is, or can distribute its source outside the selected licence scope.

Latest reviewed branch tip at this audit: `68a98e494a12fa0fcd7bc363e0f88deed262f737`. PR #5 remains open, Draft, and unmerged. All nine workflow runs associated with the latest documentation/licence commits have completed successfully, including QR Generator checks, Phase 2, Phase 3, Full Git History Secret Scan and CycloneDX SBOM. These CI results do not close the manual physical-device, third-party notice, clean-room deployment or final archive gates.

The final ZIP remains NOT BUILT and Codester submission remains NOT READY.


## Current branch and release-gate refresh — 21 November 2026 (supersedes earlier HEAD references)

- Exact branch HEAD: `9d278d2213b09a5a2a66d2c726ac6159feb89108` (buyer installation guide domain instructions corrected).
- PR #5 remains **open / Draft / unmerged**, targeting `lock/qr-studio-pro-premium-v3-2026-10-15`.
- All nine GitHub Actions runs associated with this exact SHA completed successfully: QR Generator checks; Phase 2 checks; Phase 3 schema guard; Full Git History Secret Scan; and CycloneDX SBOM, including duplicate push/PR-triggered runs. This is exact-SHA CI evidence, not proof of zero vulnerabilities or complete legal clearance.
- The latest browser workflow is green on this SHA; nevertheless, hands-on physical phone-camera scans, buyer-owned clean-room install/deployment, and final archive validation remain outstanding.
- The candidate distribution manifest still says **NOT APPROVED FOR DISTRIBUTION**. No buyer ZIP has been built.
- The seller-approved non-exclusive application-use licence notice is present as `APPLICATION-LICENSE.md`. Codester's current official licence page was checked 21 November 2026: Regular covers one project and does not permit source-file distribution; Extended covers multiple projects and permits source files only as part of a larger project; neither permits resale as-is; Codester states the author retains ownership. Listing copy must remain within those boundaries. Source: https://www.codester.com/info/licenses.
- Remaining release blockers: authoritative `dlv@1.1.3` copyright/notice evidence; exact third-party runtime asset and privacy review (Google Fonts, Material Symbols, cdnjs QR encoder); physical-device acceptance; buyer-owned clean install/deployment; explicit-allowlist ZIP creation, archive inspection and secret scan; and final Codester listing/demo review.
- Production remains locked and untouched at `https://qrnode.boothpro.my.id/`. No merge, production deployment, production configuration change, database migration, or feature addition is authorized.

This section supersedes older branch-HEAD, CI-pending, and owner-licence-approval-pending statements in earlier dated audit entries. Those entries are retained as historical evidence for their respective commits.


## Release evidence refresh — 24 November 2026 (current branch snapshot)

This addendum supersedes older HEAD, Preview URL and CI status snapshots above; earlier entries remain historical records for their stated commits.

- Exact development branch HEAD remains `a41a29d7f599c568dea76385c6ea677753caaf09`.
- PR #5 remains **open / Draft / unmerged** and targets `lock/qr-studio-pro-premium-v3-2026-10-15`.
- All nine GitHub Actions runs attached to the exact HEAD completed successfully: QR Generator checks; Phase 2 checks; Phase 3 schema guard; Full Git History Secret Scan (push and pull_request); and CycloneDX SBOM (push and pull_request).
- The QR Generator workflow includes locked install, `npm audit --audit-level=high`, Tailwind CSS build, Chromium QR decoding, Premium Design Studio and responsive phone/tablet viewport checks. These are CI browser checks, not physical phone-camera acceptance.
- Vercel Preview deployment `dpl_7qNWg7q4cKFgvzEF2YPevojFvsFL` is `READY`, sourced from the exact branch and SHA above. Build logs recorded 73 packages installed and a completed build. This does not independently prove every route's HTTP status or anonymous access.
- The seller-approved non-exclusive application licence is present and no longer awaits owner approval.
- The candidate package ZIP has **not** been built. Codester submission remains **NOT READY**.

### Current legal/asset evidence refinement

- The published upstream `developit/dlv` tag `1.1.3` package metadata declares `MIT` and lists Jason Miller as package author. The upstream tag tree contains no standalone `LICENSE` file and no explicit copyright-year/holder statement. A secondary generated notice seen elsewhere attributes the package to Chase West and other contributors, but that attribution is not corroborated by the upstream tagged source and must not be copied as fact. Do not invent a copyright notice. Record the unresolved notice provenance as a release blocker until upstream rights-holder evidence is obtained or a separately reviewed dependency-removal/replacement is completed.
- The QR encoder is loaded at runtime from cdnjs as `qrcode-generator@1.4.4`, not included as a local bundled source file in the current application tree. cdnjs identifies the version as MIT; the upstream project LICENSE states Copyright (c) 2009 Kazuhiko Arase. Preserve this distinction between an external runtime request and a redistributed/bundled copy.
- Geist is served remotely through Google Fonts; the upstream Geist project states SIL Open Font License 1.1. Inter is also requested remotely through Google Fonts. The actual font binaries are not in the current source allowlist, so do not claim they are bundled.
- Material Symbols are requested remotely through Google Fonts. Google's official developer guide states Apache License 2.0. The HTML currently contains two separate Material Symbols stylesheet requests with different axis declarations; keep them as distinct requests until an equivalence/rendering test justifies consolidation.
- Because these font and QR assets are runtime network dependencies, the buyer-facing privacy disclosure must continue to identify the third-party requests. A remote URL reference is not the same as packaging the font/library files in the source ZIP.

### Remaining release gates

1. Resolve `dlv@1.1.3` notice provenance without inventing a copyright statement.
2. Complete exact font/API request and privacy review; keep external assets identified as external unless redistribution rights and notices for exact files are established.
3. Obtain user-run physical-device camera scan and PNG/SVG export acceptance.
4. Perform buyer-owned clean-room install and Preview deployment with buyer-created accounts/credentials.
5. Refresh the explicit allowlist, create and inspect the archive, scan for secrets, extract it cleanly, run the documented install/build, and record checksum.
6. Finalize screenshots, demo access and seller support/update/pricing fields before Codester submission.

Production remains locked and untouched. No merge, Production deployment/promotion, database migration, feature addition, or ZIP creation is authorized by this audit update.
