# QR Studio Pro — Third-Party Asset & Licence Inventory

Audit date: 16 November 2026  
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

A programmatic read of the committed `package-lock.json` at the current sale branch found 74 installed package entries with a declared `license` metadata field:

| Declared SPDX/license identifier | Package count |
|---|---:|
| MIT | 64 |
| ISC | 7 |
| Apache-2.0 | 2 |
| BSD-3-Clause | 1 |
| Missing declared license metadata | 0 |

This is a metadata inventory, not a legal determination. It does not replace reviewing the actual licence text and notices for each package, transitive dependency conditions, bundled assets, or copyright attribution. The QR encoder and fonts/icons remain runtime CDN dependencies and are not bundled in the npm lockfile. No third-party application code should be relicensed under the seller's own application licence.

## Required follow-up before turnkey sale

1. Run a clean `npm ci` from the committed lockfile and independently generate/review a full transitive dependency licence/SBOM report before each commercial release. The 74-package metadata count above is only an initial static inventory.
2. Decide whether to self-host fonts/icons. If bundled, include the relevant OFL 1.1 / Apache 2.0 copyright and licence notices in the distribution.
3. Review the privacy notice for requests to Google Fonts, cdnjs and other third-party hosts; these providers receive ordinary network request metadata. Tailwind CSS is now local and no longer makes a runtime CDN request.
4. Complete a full transitive dependency and Git-history secret scan. This file does not claim either is complete.
5. The repository has no root `LICENSE` file for the application's own code. The owner must choose and approve the application's source licence / sale-transfer terms; do not infer or invent one.

## Current decision

The known direct/runtime assets reviewed here have permissive licences compatible with ordinary commercial software distribution when their respective terms and notices are followed. This does **not** mean the full project is licence-cleared: the transitive packages, full asset notices, remaining CDN terms/privacy and the application's own source ownership/licence still need review.


## CycloneDX verification — 18 November 2026

A clean Linux CI installation (`npm ci --ignore-scripts`) generated a validated CycloneDX 1.5 SBOM from the committed npm lockfile:

- Workflow run: `44238774223` (PASS), source commit `3f83389f386d92d79a7c5a8ce990f804a3cf852f`.
- Installed components: 73. Declared licence metadata present for all 73.
- SBOM licence identifiers: MIT 63, ISC 7, Apache-2.0 2, BSD-3-Clause 1.
- The lockfile contains 74 node_modules entries because optional `fsevents@2.3.3` is not installed on the Linux runner. The lockfile flags one production dependency (`@neondatabase/serverless@1.2.1`, MIT), 72 development dependencies, and that one optional development dependency.
- Internal CI artifact: `qr-studio-pro-cyclonedx-sbom.zip`, artifact ID `14398816802`, SHA-256 `6c3ed59fa542403b41069bb817c09e66aa8c3c7b6cc0aac96297146be640bb2f`; retained for 14 days. It is evidence for review, not part of the buyer ZIP.

The CycloneDX document contains declared licence identifiers and dependency metadata, not the complete licence texts. The original lockfile metadata table above counts 74 package entries, while the generated SBOM counts 73 installed Linux components; these are different scopes, not contradictory counts. The separate runtime CDN assets in the table above are not represented in the npm SBOM. Final legal review still requires the actual licence/NOTICE files for all 73 installed packages and separate confirmation of CDN-hosted assets, exact font versions, attribution and privacy disclosures.


## Actual package notice-text review — 18 November 2026

- The CycloneDX workflow now gathers actual package-root licence/NOTICE files for SBOM component identities, excluding package.json files from non-dependency test fixtures.
- Latest run `44239324540` passed on commit `165a776f72c9260175520f265b128e2efbe24030`. Internal review artifact ID `14397943745`, SHA-256 `97ce030e1465a9ae8b9c64550c1b743228b3896453c59acf71a011a1c33618dd` (14-day retention).
- The CycloneDX SBOM lists 73 components representing 72 unique package name/version pairs; all declare licence metadata. Licence IDs: MIT 63, ISC 7, Apache-2.0 2, BSD-3-Clause 1.
- Actual text collection found licence/NOTICE files for 71 of 72 unique SBOM packages. The single unresolved package is `dlv@1.1.3`: package metadata declares MIT and identifies Jason Miller as author, but neither the installed npm package nor the upstream repository root includes a matching LICENSE file. The final buyer archive must not invent a copyright year or claim this notice is complete; obtain an authoritative notice or written clarification before release.
- The other four missing-text entries from the initial broad scan were test-fixture package.json files not present in the CycloneDX dependency component set; they are excluded from the 72-package count.
- This review does not cover the external CDN/font/icon/QR encoder assets listed above. Their upstream terms, exact served versions, notices and privacy implications remain open.
