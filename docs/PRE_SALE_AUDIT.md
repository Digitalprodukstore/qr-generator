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
