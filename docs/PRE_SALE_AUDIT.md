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
| Application's own source licence | OWNER APPROVAL REQUIRED | No root `LICENSE` has been approved. Do not invent legal terms or add an unapproved licence. |
| Final buyer ZIP | NOT BUILT | Build from explicit allowlist only after release gates close; scan archive and verify clean extraction/install. |
| Buyer-owned clean-room deployment | NOT TESTED | Requires buyer-owned Vercel and Upstash resources and acceptance. |
| Codester submission | NOT READY | Listing and screenshots are drafts; licence, package, demo access and final QA still need approval. |
| Production | LOCKED / NOT AUTHORIZED | `https://qrnode.boothpro.my.id/` must remain untouched. |

## Dependency advisory interpretation

An earlier audit reported high-severity `picomatch` findings through the Tailwind build dependency chain. On the exact 19 November HEAD, the full browser workflow's `npm audit --audit-level=high` step passed without a lockfile change in the branding commit. Therefore, the earlier failure is not reproduced by the latest CI evidence. Do not claim the upstream advisory is permanently resolved or suppress future audit findings. Re-check the advisory database and the full audit output before creating the release archive. Do not use `npm audit fix --force`, guessed overrides, or a forced Tailwind major upgrade.

## Remaining release work — in order

1. Resolve the authoritative redistribution notice/copyright evidence for `dlv@1.1.3`, or safely remove/replace the package on an isolated branch and rerun the full CI/SBOM checks.
2. Complete the QR encoder, Google Fonts and Material Symbols external asset licence/attribution/privacy review. Decide whether any assets should be self-hosted; do not bundle them without verified rights and notices.
3. Obtain owner approval for the application's own non-exclusive commercial source licence and written Codester Regular/Extended scope. No copyright assignment or exclusivity is implied.
4. Re-run full CI and inspect the complete npm audit/SBOM outputs against the exact release candidate.
5. Complete real phone-camera scans and physical-device export/share checks.
6. Complete Admin logout, session expiry, rate-limit and fail-closed acceptance on an isolated buyer-like Preview. Never request or expose credentials.
7. Verify public Preview access for intended testers without weakening deployment protection.
8. Build the ZIP from the manifest allowlist, exclude Git metadata/secrets/seller-only records, inspect the archive, scan it, extract cleanly, run documented installation/build, and verify all documentation links.
9. Complete buyer-owned Vercel + Upstash clean-room Preview deployment and acceptance.
10. Finalize original screenshots, demo access, listing copy, version/commit, archive checksum and Codester submission metadata.

## Sale decision

**Not ready to submit to Codester yet.** CI is materially healthier and the current browser workflow is green, but unresolved third-party redistribution evidence, external runtime assets, application licence approval, physical-device QA, final ZIP verification, and buyer-owned installation remain release blockers.
