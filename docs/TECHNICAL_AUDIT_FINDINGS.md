# QR Studio Pro — Technical Audit Findings (Preview-only)

Audit date: 16 November 2026  
Repository: `Digitalprodukstore/qr-generator`  
Branch: `fix/qrnode-phase1-adoption-2026-11-02`  
Audited branch HEAD: `3ab42bf3d7431816927909d53d42f6530c5e0f43`  
Browser and application CI evidence: run `43745119519` (same runtime code; final HEAD additionally adds `.gitignore`).

## 1. Current deployment and CI evidence

- Latest Vercel Preview deployment: **READY**.
- Preview URL: https://qr-generator-5ohzynxg5-risakil.vercel.app
- Deployment ID: `dpl_ECw1iJH5AJaDmRJXDzpZokbG3MHR`.
- Deployment Git metadata matches branch `fix/qrnode-phase1-adoption-2026-11-02` and HEAD `3ab42bf3d7431816927909d53d42f6530c5e0f43`.
- GitHub Actions on the final branch HEAD:
  - QR Generator checks: **SUCCESS** (run 43745119519).
  - QR Studio Pro Phase 2 checks: **SUCCESS** (run 43745121826).
  - QR Studio Pro Phase 3 schema guard: **SUCCESS** (run 43745121798).
- The browser job independently decoded all 18 QR payload categories: URL, text, WhatsApp, email, telephone, SMS, Wi-Fi, vCard, geo, event, menu, invitation, review, social, PDF, multi-link, form, and app.
- Square, rounded and dots module patterns independently decoded. All three 2048 × 2048 PNG exports independently decoded to the expected payload; SVG exports were valid and retained their selected shape.
- Premium Design Studio checks passed: five presets, manual contrast refresh, local save/load/delete, sponsor URL update/clear, and rejection of unsafe `javascript:` URLs.
- Responsive checks passed at 320×740, 375×812, 430×932, 768×1024, and 1024×768. No horizontal overflow or clipped primary QR controls was reported.
- Mocked Admin-auth tests passed for invalid methods/content types, oversized credentials, incorrect password/PIN, signed session issuance, tampered/expired sessions, rate limiting, fail-closed backend behavior, unauthenticated/cross-origin settings writes, unsafe sponsor URLs, and valid same-origin settings persistence.
- These are CI/browser regression results, not a real-world mobile-camera test, live authenticated Admin acceptance, independent penetration test, or legal certification.

Preview READY proves hosting/build availability; the CI results above provide separate functional evidence.

## 2. Security implementation observations

### Positive controls observed in source

- Admin credentials are checked server-side; no credential values are documented in this report.
- Admin session uses a signed HMAC-SHA256 token and a random 32-byte session identifier.
- Session cookie is HttpOnly, Secure, SameSite=Strict, Path=/, with an eight-hour maximum age.
- Active sessions are checked and revoked through Upstash Redis; session validation fails closed if Redis is unavailable.
- Admin login requires configured email, password, PIN and a session secret of at least 32 characters.
- Login attempts are rate-limited through Upstash Redis; login fails closed when the limiter is unavailable.
- Admin settings writes require a valid session and same-origin validation.
- Settings input is allow-listed by the 18 known QR type IDs; sponsor URL validation only accepts HTTP/HTTPS.
- API responses use no-store cache headers.
- Existing response headers include X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin, X-Frame-Options: DENY, X-Permitted-Cross-Domain-Policies: none, Strict-Transport-Security: max-age=31536000, and Permissions-Policy: camera=(), microphone=(), geolocation=().

### Hardening gaps / follow-up

- The checked-in `vercel.json` now defines HSTS (`max-age=31536000`) and a restrictive Permissions-Policy for camera, microphone and geolocation. CSP remains intentionally absent pending a nonce/hash strategy and a compatibility inventory: the app relies on inline scripts/styles and external CDNs, so a simplistic CSP could break functionality or provide weak protection if it relies on `unsafe-inline`.
- Admin logout clears the browser cookie and attempts Redis revocation. If Redis is unavailable, the endpoint returns 503 and the server-side session can remain valid until its original expiry (maximum eight hours). This is documented behavior, not evidence of an authentication bypass.
- Re-check trusted proxy/IP header assumptions for rate limiting in the actual Vercel runtime. The code prefers `x-real-ip` and falls back to the first `x-forwarded-for` value.
- No independent penetration test has been performed. Source inspection and mocked tests are not a penetration-test certification.

## 3. Dependencies and third-party assets

- `package.json` declares one npm runtime dependency: `@neondatabase/serverless ^1.0.2`.
- The inspected repository tree does not contain a package lockfile (`package-lock.json`, `pnpm-lock.yaml`, or `yarn.lock`). This weakens deterministic dependency installation and prevents a reproducible lockfile-based dependency audit.
- A partial direct/runtime asset inventory is now documented in `docs/THIRD_PARTY_ASSET_INVENTORY.md`: Neon serverless driver (MIT), qrcode-generator 1.4.4 (MIT), Tailwind CSS (MIT), Geist and Inter fonts (SIL OFL 1.1), and Material Symbols (Apache 2.0). This is not a complete transitive SBOM.
- **Production blocker:** the app loads Tailwind through `cdn.tailwindcss.com` (Play CDN). Tailwind's official documentation states this CDN is intended for development, not production. Before a turnkey production handover, compile and pin CSS locally, then rerun visual/responsive regressions.
- Google Fonts, cdnjs and Tailwind CDN requests expose ordinary request metadata to those third parties; confirm the privacy notice describes the actual runtime hosts and review provider terms/availability.

## 4. Repository hygiene observations

- A root `.gitignore` has now been added for local environment files, `.vercel/`, dependencies, generated output and logs. The inspected root tree still has no npm lockfile (`package-lock.json`, `pnpm-lock.yaml`, or `yarn.lock`); deterministic dependency installation remains a handover gap.
- No secret values are reproduced here. A proper secret-exposure review must examine the complete Git history and Vercel deployment configuration with secret values masked. Current source inspection alone cannot prove that no credential was ever committed.
- Buyer handover must use fresh buyer-owned credentials and service accounts; never transfer the seller's personal account password.

## 5. Sale-readiness gates updated by this audit

| Gate | Current result |
|---|---|
| Preview deployment | READY on audited SHA |
| Phase 2 CI | PASS |
| Phase 3 schema guard CI | PASS |
| Main browser/static CI workflow | PASS — run 43745119519 |
| Responsive browser checks | PASS — five phone/tablet viewports |
| Admin auth mocked tests | PASS; not a live security certification |
| Real Neon connectivity | NOT VERIFIED |
| Third-party asset inventory | PARTIAL; direct licences identified, transitive SBOM pending; Tailwind Play CDN not suitable for production |
| Git history secret review | NOT COMPLETE |
| HSTS / Permissions-Policy | CONFIGURED in Preview; CSP remains pending compatibility work |
| Dynamic QR / analytics | NOT INCLUDED / INCOMPLETE |
| Production | LOCKED / UNTOUCHED |

## 6. Next safe actions

1. Complete deterministic dependency management (generate and commit a verified lockfile) and full transitive SBOM/licence review; replace Tailwind Play CDN with compiled local CSS before turnkey production.
2. Review a nonce/hash-based CSP plan; do not weaken it with a blanket `unsafe-inline` policy.
3. Complete Git-history secret scanning and buyer-owned Preview acceptance.
4. Verify the live authenticated Neon health probe and Admin logout/revocation behavior in a buyer-approved Preview environment.
5. Complete independent security review/penetration testing if making a security-certification claim.
6. Keep PR #5 Draft and Production untouched until separately authorized.

## Scope and limitations

This is a source and CI evidence review, not a live authenticated Admin acceptance test, independent security audit, legal opinion, or guarantee of safety. No application feature code, database, environment variable, domain, or Production setting was changed as part of this audit.
