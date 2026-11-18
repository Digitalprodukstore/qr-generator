# QRnode — Third-Party Asset & Licence Inventory

Audit date: 18 November 2026  
Scope: the current isolated sale-preparation branch and the candidate buyer package. This is a technical inventory, not legal advice or a complete guarantee of rights.

## Installed npm dependency

| Component | Declared / resolved version | Licence | Distribution note |
|---|---|---|---|
| `@neondatabase/serverless` | `^1.0.2` / `1.2.1` | MIT | The only installed npm dependency in the current candidate package. Its licence text is included in `THIRD_PARTY_NPM_NOTICES.txt`. |

The current CycloneDX SBOM workflow on commit `386be4cf03b38112a8123f7beed8eab9efde3afa` passed and reported one component: `@neondatabase/serverless@1.2.1` (MIT). This is the installed npm dependency inventory; it does not include runtime CDN assets.

## Runtime and generated assets

| Component | Version / source | Licence evidence | Distribution / operational note |
|---|---|---|---|
| `qrcode-generator` | 1.4.4 from cdnjs | MIT; upstream project and licence | Loaded at runtime from cdnjs; not bundled as a local library file. Version is pinned in the page script URL. |
| Tailwind CSS generated stylesheet | `assets/tailwind.generated.css`; generated with Tailwind CSS 3.4.17 according to the previous build record | MIT; Tailwind CSS v3.4.17 licence text is included in `THIRD_PARTY_NOTICES.txt` | The buyer package includes only the precompiled CSS output. Tailwind CLI/build dependencies and build scripts are excluded; `package.json` has no CSS build script. |
| Geist font family | Google Fonts CSS endpoint | SIL Open Font License 1.1; upstream Geist font project | Served remotely. Exact Google Fonts response/version is not pinned by the current HTML requests. |
| Inter font family | Google Fonts CSS endpoint | SIL Open Font License 1.1; upstream Inter project | Served remotely. Exact Google Fonts response/version is not pinned by the current HTML requests. |
| Material Symbols Outlined | Google Fonts CSS endpoint | Apache License 2.0; Google licensing guidance | Served remotely. Preserve attribution/licence notice if later self-hosted or redistributed. |

## Buyer-facing distribution requirements

1. Keep `THIRD_PARTY_NOTICES.txt`, `THIRD_PARTY_NPM_NOTICES.txt`, and `SBOM.cdx.json` in the buyer package.
2. The QR encoder and Google Fonts assets are fetched from third-party hosts. Review provider terms, privacy disclosures, availability, and the exact served asset versions before public deployment.
3. The current buyer package does not bundle font or icon binaries. If those assets are later self-hosted or bundled, include the exact upstream licence and attribution files with the redistributed files.
4. Do not describe the npm SBOM as a complete inventory of CDN-loaded assets. It covers the installed npm dependency set only.
5. The repository has no root `LICENSE` for the application's own source code. The owner must approve the application licence and sale terms; do not infer or invent a source-code licence from the third-party notices.

## Ownership and release status

- The owner confirmed on 18 November 2026 that the original application code and owner-created assets are owned by the seller and may be sold/distributed. This records the owner's statement; it is not independent legal verification.
- Third-party components remain governed by their own licences. The application licence cannot relicense those components.
- The full fetched Git history/ref secret scan passed on commit `386be4cf03b38112a8123f7beed8eab9efde3afa` (workflow run 44317014032). This covers the refs fetched by that workflow, not unrelated forks, external copies, or unreachable objects.
- The buyer ZIP and gallery screenshots still require final visual review and a clean-room buyer acceptance review before submission.
