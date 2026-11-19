# QRnode — Third-Party Asset & Licence Inventory

Audit date: 19 November 2026  
Scope: source-visible direct dependencies and runtime assets. This is a partial inventory, not a complete SBOM or legal opinion.

## Direct application dependency

| Component | Version / source | Licence evidence | Distribution note |
|---|---|---|---|
| `@neondatabase/serverless` | `package.json` declares `^1.0.2`; lock resolves `1.2.1` | MIT | Exact resolved version is pinned in `package-lock.json`; verify/refresh it only through a reviewed dependency update. |

## Runtime CDN assets

| Component | Version / source | Licence evidence | Distribution / operational note |
|---|---|---|---|
| `qrcode-generator` | 1.4.4 from cdnjs | MIT; [cdnjs 1.4.4 listing](https://cdnjs.com/libraries/qrcode-generator/1.4.4) and [upstream licence](https://github.com/kazuhikoarase/qrcode-generator/blob/master/LICENSE) | Version is pinned in the script URL. It is loaded from a third-party CDN, not vendored in this repository. |
| Tailwind CSS | `3.4.17`, compiled locally to `assets/tailwind.generated.css` | MIT; [official licence](https://github.com/tailwindlabs/tailwindcss/blob/main/LICENSE) | Version pinned in `devDependencies` and `package-lock.json`. The runtime pages load a committed local CSS file; Tailwind Play CDN is no longer used. Rebuild with `npm ci` then `npm run build:css`. |
| Geist font family | Google Fonts CSS endpoint | SIL Open Font License 1.1; [upstream Geist font project](https://github.com/vercel/geist-font) | Served remotely; exact font response/version is controlled by the Google Fonts CSS response, not pinned in this repository. |
| Inter font family | Google Fonts CSS endpoint | SIL Open Font License 1.1; [upstream Inter project](https://github.com/rsms/inter) | Served remotely; exact font response/version is controlled by the Google Fonts CSS response, not pinned in this repository. |
| Material Symbols Outlined | Google Fonts CSS endpoint | Apache License 2.0; [Google licensing guidance](https://developers.google.com/fonts/docs/material_symbols) | Served remotely. Preserve attribution/licence notice if later self-hosted or redistributed. |

## Lockfile metadata review (18 November 2026)

A programmatic read of the committed `package-lock.json` at the current sale branch found 74 package entries with a declared `license` metadata field:

| Declared SPDX/license identifier | Package count |
|---|---:|
| MIT | 64 |
| ISC | 7 |
| Apache-2.0 | 2 |
| BSD-3-Clause | 1 |
| Missing declared license metadata | 0 |

This is a metadata inventory, not a legal determination. It does not replace reviewing the actual licence text and notices for each package, transitive dependency conditions, bundled assets, or copyright attribution. The QR encoder and fonts/icons remain runtime CDN dependencies and are not bundled in the npm lockfile. No third-party application code should be relicensed under the seller's own application licence.

## Required follow-up before turnkey sale

1. Review the generated CycloneDX SBOM and actual third-party licence/NOTICE texts; refresh them from the exact release archive before each commercial release.
2. Decide whether to self-host fonts/icons. If bundled, include the relevant OFL 1.1 / Apache 2.0 copyright and licence notices in the distribution.
3. Review the privacy notice for requests to Google Fonts, cdnjs and other third-party hosts; these providers receive ordinary network request metadata. Tailwind CSS is now local and no longer makes a runtime CDN request.
4. Resolve the remaining `dlv@1.1.3` copyright/notice evidence and the `picomatch` advisory before release. The Git-history Gitleaks scan has passed for fetched origin refs at branch HEAD `850f337`; this does not cover local clones, unfetched forks/unreachable objects, or external accounts.
5. The repository has no root `LICENSE` file for the application's own code. The owner must choose and approve the application's source licence / sale-transfer terms; do not infer or invent one.

## Current decision

The reviewed direct/runtime assets have permissive licence identifiers, but the full project is **not licence-cleared**. The `dlv` notice evidence, external CDN terms/privacy and exact served asset versions, and the application's own source ownership/licence still require review.

## CycloneDX verification — 18 November 2026

A clean Linux CI installation (`npm ci --ignore-scripts`) generated a validated CycloneDX 1.5 SBOM from the committed npm lockfile:

- Latest SBOM workflow on branch HEAD `850f337af031e7296b5e5725ce15a69d033ddb5d`: PASS (PR run 44239453403 and push run 44239447775).
- Installed components: 73. Declared licence metadata present for all 73.
- SBOM licence identifiers: MIT 63, ISC 7, Apache-2.0 2, BSD-3-Clause 1.
- The lockfile contains 74 node_modules entries because optional `fsevents@2.3.3` is not installed on the Linux runner. The lockfile flags one production dependency (`@neondatabase/serverless@1.2.1`, MIT), 72 development dependencies, and that one optional development dependency.
- The earlier SBOM artifact run `44238774223` produced artifact ID `14398816802`, SHA-256 `6c3ed59fa542403b41069bb817c09e66aa8c3c7b6cc0aac96297146be640bb2f`; retained for 14 days. It is evidence for review, not part of the buyer ZIP.

The CycloneDX document contains declared licence identifiers and dependency metadata, not the complete licence texts. The original lockfile metadata table counts 74 package entries, while the generated SBOM counts 73 installed Linux components; these are different scopes, not contradictory counts. Runtime CDN assets are not represented in the npm SBOM.

## Actual package notice-text review — 18 November 2026

- The CycloneDX workflow gathers actual package-root licence/NOTICE files for SBOM component identities, excluding package.json files from non-dependency test fixtures.
- Latest notice collection run `44239324540` passed on commit `165a776f72c9260175520f265b128e2efbe24030`. Internal review artifact ID `14397943745`, SHA-256 `97ce030e1465a9ae8b9c64550c1b743228b3896453c59acf71a011a1c33618dd` (14-day retention).
- The CycloneDX SBOM lists 73 components representing 72 unique package name/version pairs; all declare licence metadata. Licence IDs: MIT 63, ISC 7, Apache-2.0 2, BSD-3-Clause 1.
- Actual text collection found licence/NOTICE files for 71 of 72 unique SBOM packages. The one package without a matching file in the installed package or upstream repository root is `dlv@1.1.3`.
- npm's package page/metadata declares MIT and lists Jason Miller as author/publisher. Public third-party attribution inventories are inconsistent: some identify © 2019 Jason Miller, while another identifies © 2019 Chase West and contributors; other inventories leave the holder blank. These are secondary notices, not the upstream package's own licence file or a written rights-holder clarification. Do not select a copyright holder/year or reconstruct a definitive notice from these conflicting sources. Keep `dlv@1.1.3` as an unresolved redistribution-notice gate until authoritative evidence is obtained or the dependency is safely removed/replaced and the resulting tree is re-audited.
- The four other missing-text entries from the initial broad scan were test-fixture package.json files not present in the CycloneDX dependency component set; they are excluded from the 72-package count.
- The CDN-hosted QR encoder, Google Fonts and Material Symbols remain outside the npm SBOM and still require a separate rights/notice/privacy review.

## Picomatch advisory recheck — 18 November 2026

- GitHub Advisory `GHSA-fc5q-39xc-vjpf` / `CVE-2026-112366` remains High severity. The advisory still reports affected and patched versions as Unknown; npm audit continues to flag the locked dependency tree.
- The upstream repository's latest published release remains `4.0.7`; no official patched release was verified.
- The upstream remediation PR `micromatch/picomatch#235` was closed without merge on 21 October 2026. It is not a released fix and must not be treated as remediation.
- The dependency is in the development/build tooling chain (Tailwind/tinyglobby), not the application's declared runtime dependency. That narrows normal end-user exposure but does not remove build-time supply-chain risk.
- Decision: retain the locked Tailwind 3.4.17 tree; do not force a major Tailwind upgrade, invent an npm override, suppress the audit, or claim zero vulnerabilities. Revisit only after an official compatible upstream fix or a separately reviewed mitigation passes the complete browser/CSS suite.
- Latest QR Generator workflow on exact branch HEAD `850f337af031e7296b5e5725ce15a69d033ddb5d` failed only at `npm audit --audit-level=high`; the browser tests after that gate were skipped. Static checks, QRNode static checks, Admin auth tests, Phase 2, Phase 3, Gitleaks and SBOM workflows passed. The full browser regression is therefore not green on this HEAD.


## Build-tool mitigation candidate review — 18 November 2026

- The lockfile path to the flagged `picomatch@4.0.7` is `tailwindcss@3.4.17 → sucrase@3.35.1 → tinyglobby@0.2.17 → picomatch@4.0.7`.
- A possible experiment is to pin the Tailwind-compatible `sucrase@3.35.0` release: its published dependency metadata uses `glob@^10.3.10` rather than `tinyglobby`. This is only a candidate; no lockfile change or build test has been made.
- This route changes the glob-matching dependency tree and may introduce a `minimatch` dependency. `minimatch` has a separate Moderate advisory `GHSA-g3hv-75wg-m249` / `CVE-2026-118764`; the upstream advisory identifies `10.2.6` as affected and `11.0.1` as patched. Exact resolved versions and compatibility must be checked before considering this route.
- Decision: do not apply a Sucrase downgrade or npm override based only on dependency metadata. Any experiment must run on a separate branch and prove: clean `npm ci`, complete `npm audit` review, CSS output equivalence, all static checks, and the full Chromium/browser QR suite. Keep the current locked build tree until that evidence exists.


## Evidence refresh — 19 November 2026

The following CI evidence supersedes older statements in this document that the latest browser workflow was blocked at the high-severity npm audit gate:

- Exact reviewed sale-branch HEAD: `cc7dcac753dc6007955dbf3c602230775c22d704`.
- QR Generator workflow #410 / run `44542488658`: PASS. Its browser job passed `npm ci --ignore-scripts`, `npm audit --audit-level=high`, Tailwind CSS compilation, Chromium installation, independent QR decoding, Premium Design Studio checks, and responsive viewport checks.
- CycloneDX SBOM workflow #114 / run `44542496312`: PASS, including package licence/NOTICE text collection.
- Full Git History Secret Scan #103 / run `44542496294`: PASS for fetched refs/history.
- Phase 2 #537 and Phase 3 #308: PASS.

Interpretation: the previous high-severity audit failure was not reproduced on this exact HEAD. This is evidence that the current CI audit threshold passed, not proof of zero vulnerabilities or a declaration that every upstream advisory is permanently fixed. Re-run the full audit immediately before release and review its output.

The successful notice-collection workflow does not close the known legal evidence gap: prior package-root review found no matching authoritative licence/NOTICE file for `dlv@1.1.3`, while secondary copyright attributions conflict. Keep that item blocked until authoritative evidence is obtained or the package is safely removed/replaced and the resulting SBOM/notices are regenerated.

External runtime QR encoder, Google Fonts and Material Symbols remain outside the npm SBOM and still require separate rights, attribution, version and privacy review. The application's own source licence remains an owner-approval item; do not add a guessed root `LICENSE`.

The latest green browser CI does not complete real phone-camera acceptance, buyer-owned clean-room deployment, final allowlist ZIP validation, or Codester submission approval.


## Picomatch advisory status correction — 19 November 2026

The GitHub Advisory Database entry `GHSA-fc5q-39xc-vjpf` / `CVE-2026-112366` is now marked **Withdrawn**, with the advisory page stating it was withdrawn on 18 November 2026. The withdrawal reason references the upstream maintainer discussion; this is not a patched package release. The current lockfile still resolves `picomatch@4.0.7` in development tooling, but the advisory is no longer an active GitHub-reviewed advisory. The latest CI `npm audit --audit-level=high` step also passes on the reviewed HEAD.

Do not describe this as a code patch or claim that `picomatch@4.0.7` was upgraded. Keep the lockfile unchanged unless a separately reviewed dependency update is warranted. Re-check the official advisory before each release: https://github.com/advisories/GHSA-fc5q-39xc-vjpf
