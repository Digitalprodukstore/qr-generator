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
