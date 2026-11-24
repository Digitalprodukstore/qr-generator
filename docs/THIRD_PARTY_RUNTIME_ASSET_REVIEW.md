# QRnode — Third-Party Runtime Asset Review (Provisional)

Review date: 24 November 2026  
Branch: `fix/qrnode-phase1-adoption-2026-11-02`  
Reviewed commit: `a41a29d7f599c568dea76385c6ea677753caaf09`  
Purpose: record verifiable third-party assets referenced by the current HTML and dependency lockfile. This is an audit note, **not** a final legal opinion or a claim that all distribution gates are cleared.

## 1. Runtime QR encoder

- Current HTML loads `https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js`.
- cdnjs identifies version 1.4.4 as MIT licensed: https://cdnjs.com/libraries/qrcode-generator/1.4.4
- The upstream project LICENSE states: Copyright (c) 2009 Kazuhiko Arase; MIT terms: https://github.com/kazuhikoarase/qrcode-generator/blob/master/LICENSE
- The encoder is loaded from a third-party CDN at runtime; it is not currently a local bundled file in the source allowlist.
- Keep the privacy disclosure about the cdnjs request. If the library is ever copied into the archive or self-hosted, include the full upstream MIT notice and verify the exact 1.4.4 distribution file.

Status: licence source evidence found for upstream project; runtime dependency and privacy disclosure remain relevant. No claim is made that the exact CDN-served minified file has been independently byte-compared to the upstream tag.

## 2. Geist font

- Current HTML requests Geist through the Google Fonts CSS API.
- The upstream Geist project states that its Font Software is licensed under SIL Open Font License 1.1: https://github.com/vercel/geist-font
- Google Fonts repository documentation says fonts are made available for redistribution subject to each family’s applicable licence; each family directory has its own licence and authorship metadata: https://github.com/google/fonts
- Current QRnode HTML references the remote Google Fonts service; the font binaries are not included in the source allowlist.

Status: upstream family licence identified; exact Google Fonts response/binary revision is not pinned in the HTML. Do not claim font binaries are bundled or self-hosted.

## 3. Inter font

- Current HTML requests Inter through the Google Fonts CSS API.
- The current page uses remote CSS, not a locally bundled Inter font file.
- The exact Google Fonts API response and font binary revision are not pinned in the source tree. Verify the Inter family’s current upstream OFL notice and the exact served response before creating a self-hosted/bundled font package.

Status: remote runtime asset; exact revision/notice verification remains open.

## 4. Material Symbols

- Current HTML contains two separate Google Fonts CSS requests for Material Symbols Outlined, with different axis declarations:
  - `opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200`
  - `wght,FILL@100..700,0..1`
- Google's official Material Symbols guide states that Material Symbols are licensed under Apache License 2.0: https://developers.google.com/fonts/docs/material_symbols
- The actual font binaries are remotely served and are not included in the current source allowlist.
- Do not consolidate the two requests unless a rendering/axis equivalence test confirms the same glyph appearance and variable-axis behavior.

Status: official licence identified; exact served font response is dynamic and not pinned. Preserve privacy disclosure of remote Google Fonts requests.

## 5. Build dependency dlv@1.1.3 — OPEN NOTICE BLOCKER

- `package-lock.json` resolves `dlv@1.1.3` from the npm registry and records MIT metadata and the tarball integrity.
- npm package metadata identifies repository `developit/dlv`, version `1.1.3`, and MIT licence: https://www.npmjs.com/package/dlv
- The upstream tag `1.1.3` package.json declares `license: MIT` and `author: Jason Miller <jason@developit.ca>`: https://github.com/developit/dlv/blob/1.1.3/package.json
- The upstream tag tree does not contain a standalone `LICENSE` file. The package metadata does not provide an explicit copyright-year/holder line.
- A secondary generated third-party notice seen in a separate project says “Copyright (c) 2019 Chase West and other contributors”; this has not been verified against the upstream tag and is not acceptable evidence for inserting that notice into QRnode’s distribution.
- Do not invent a year or copyright holder, and do not silently copy the secondary attribution. Obtain authoritative rights-holder/notice confirmation or carry out a separately reviewed dependency-removal/replacement and rerun full CI, npm audit, SBOM and browser regression.

Status: MIT metadata confirmed; required notice provenance unresolved. This remains a distribution gate.

## 6. Distribution interpretation

The current application references the QR encoder and fonts remotely. The QRnode source archive should not contain third-party font binaries or QR encoder code unless those exact files and their notices are separately verified and intentionally added to the allowlist. The buyer-facing privacy page must continue to disclose remote third-party requests. The source ZIP must include a transparent third-party dependency/asset inventory, but that inventory must not pretend that remote runtime assets are bundled.

## Release decision

**Not cleared for Codester distribution.** The non-exclusive application licence has seller approval, but the unresolved `dlv@1.1.3` notice provenance, exact external font response review, physical-device acceptance, buyer-owned clean-room deployment and final archive verification remain open.
