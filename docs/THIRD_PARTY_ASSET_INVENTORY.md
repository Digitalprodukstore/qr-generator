# QR Studio Pro — Third-Party Asset & Licence Inventory

Audit date: 16 November 2026  
Scope: source-visible direct dependencies and runtime CDN assets. This is a partial inventory, not a complete SBOM or legal opinion.

## Direct application dependency

| Component | Version / source | Licence evidence | Distribution note |
|---|---|---|---|
| `@neondatabase/serverless` | `package.json` declares `^1.0.2` | MIT; [package metadata for 1.0.2](https://app.unpkg.com/@neondatabase/serverless@1.0.2/files/package.json) | Exact installed version is not locked because no npm lockfile is present. Recreate and audit the resolved tree before transfer. |

## Runtime CDN assets

| Component | Version / source | Licence evidence | Distribution / operational note |
|---|---|---|---|
| `qrcode-generator` | 1.4.4 from cdnjs | MIT; [cdnjs 1.4.4 listing](https://cdnjs.com/libraries/qrcode-generator/1.4.4) and [upstream licence](https://github.com/kazuhikoarase/qrcode-generator/blob/master/LICENSE) | Version is pinned in the script URL. It is loaded from a third-party CDN, not vendored in this repository. |
| Tailwind CSS Play CDN | `https://cdn.tailwindcss.com` (unversioned runtime URL) | Tailwind CSS is MIT; [official licence](https://github.com/tailwindlabs/tailwindcss/blob/main/LICENSE) | **Production concern:** Tailwind's official documentation says the Play CDN is for development only and is not intended for production. Replace it with a compiled, version-pinned CSS asset before presenting this as a turnkey production deployment. |
| Geist font family | Google Fonts CSS endpoint | SIL Open Font License 1.1; [upstream Geist font project](https://github.com/vercel/geist-font) | Served remotely; exact font response/version is controlled by the Google Fonts CSS response, not pinned in this repository. |
| Inter font family | Google Fonts CSS endpoint | SIL Open Font License 1.1; [upstream Inter project](https://github.com/rsms/inter) | Served remotely; exact font response/version is controlled by the Google Fonts CSS response, not pinned in this repository. |
| Material Symbols Outlined | Google Fonts CSS endpoint | Apache License 2.0; [Google licensing guidance](https://developers.google.com/fonts/docs/material_symbols) | Served remotely. Preserve attribution/licence notice if later self-hosted or redistributed. |

## Required follow-up before turnkey sale

1. Generate and commit a verified npm lockfile, then run an install from the lockfile and an automated dependency/licence inventory.
2. Replace Tailwind Play CDN with a local, compiled, version-pinned CSS build and rerun all browser, responsive and visual regression checks. Do not attempt a blind migration in the current pre-sale branch.
3. Decide whether to self-host fonts/icons. If bundled, include the relevant OFL 1.1 / Apache 2.0 copyright and licence notices in the distribution.
4. Review the privacy notice for requests to Google Fonts, cdnjs, Tailwind's CDN and other third-party hosts; these providers receive ordinary network request metadata.
5. Complete a full transitive dependency and Git-history secret scan. This file does not claim either is complete.
6. The repository has no root `LICENSE` file for the application's own code. The owner must choose and approve the application's source licence / sale-transfer terms; do not infer or invent one.

## Current decision

The known direct/runtime assets reviewed here have permissive licences compatible with ordinary commercial software distribution when their respective terms and notices are followed. This does **not** mean the full project is licence-cleared: the npm dependency resolution, transitive packages, full asset notices, CDN terms/privacy and the application's own source ownership/licence still need review.
