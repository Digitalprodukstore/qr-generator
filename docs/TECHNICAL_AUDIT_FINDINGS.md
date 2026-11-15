# QR Studio Pro — Technical Audit Findings (Preview-only)

Audit date: 15 November 2026  
Repository: `Digitalprodukstore/qr-generator`  
Branch: `fix/qrnode-phase1-adoption-2026-11-02`  
Audited commit: `e78b6aa0fc6a6d1e3c663d31f274530ce8db1be3`

## 1. Current deployment and CI evidence

- Vercel Preview deployment `dpl_GNY8WDNqH5MfcnFDMHfJx7spiv3g` is **READY**.
- Preview URL: https://qr-generator-6821ib3et-risakil.vercel.app
- The deployment Git metadata matches the audited branch and commit SHA above.
- GitHub Actions on the audited SHA:
  - QR Studio Pro Phase 2 checks: **SUCCESS** (run 43673723151).
  - QR Studio Pro Phase 3 schema guard: **SUCCESS** (run 43673723226).
  - QR Generator checks: **FAILURE** (run 43673721497).
- In the failing QR Generator run, static checks, Phase 1 checks and mocked Admin-auth tests passed. The browser job passed QR decode, five preset/contrast checks, local project save/load/delete, sponsor URL safety, and square/rounded 2048px PNG/SVG checks. It failed at **dots 2048px PNG decode**: the exported PNG did not decode to the active payload. Responsive checks were skipped after this failure.
- Therefore Preview READY is a hosting/build result, not a passing functional acceptance result.

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
- Existing response headers include X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin, X-Frame-Options: DENY, and X-Permitted-Cross-Domain-Policies: none.

### Hardening gaps / follow-up

- The checked-in `vercel.json` does not currently define Content-Security-Policy, Strict-Transport-Security, or Permissions-Policy. Review and add carefully in a separate change after testing all inline scripts and external assets; do not apply a restrictive CSP blindly because the app currently relies on inline scripts and external CDNs.
- Admin logout clears the browser cookie and attempts Redis revocation. If Redis is unavailable, the endpoint returns 503 and the server-side session can remain valid until its original expiry (maximum eight hours). This is documented behavior, not evidence of an authentication bypass.
- Re-check trusted proxy/IP header assumptions for rate limiting in the actual Vercel runtime. The code prefers `x-real-ip` and falls back to the first `x-forwarded-for` value.
- No independent penetration test has been performed. Source inspection and mocked tests are not a penetration-test certification.

## 3. Dependencies and third-party assets

- `package.json` declares one npm runtime dependency: `@neondatabase/serverless ^1.0.2`.
- The inspected repository tree does not contain a package lockfile (`package-lock.json`, `pnpm-lock.yaml`, or `yarn.lock`). This weakens deterministic dependency installation and prevents a reproducible lockfile-based dependency audit.
- The public HTML loads third-party assets at runtime, including Google Fonts, Tailwind CSS via `cdn.tailwindcss.com`, Material Symbols fonts, and `qrcode-generator 1.4.4` via cdnjs. These runtime CDN assets are not represented in the npm dependency manifest and need separate licence, version-pinning, availability, and privacy review.
- No complete third-party licence/SBOM review is claimed in this audit.

## 4. Repository hygiene observations

- The inspected root tree did not show a `.gitignore` file or a package lockfile. Confirm whether those omissions are intentional before a buyer source handover.
- No secret values are reproduced here. A proper secret-exposure review must examine the complete Git history and Vercel deployment configuration with secret values masked. Current source inspection alone cannot prove that no credential was ever committed.
- Buyer handover must use fresh buyer-owned credentials and service accounts; never transfer the seller's personal account password.

## 5. Sale-readiness gates updated by this audit

| Gate | Current result |
|---|---|
| Preview deployment | READY on audited SHA |
| Phase 2 CI | PASS |
| Phase 3 schema guard CI | PASS |
| Main browser/static CI workflow | FAIL — dots PNG decode |
| Responsive browser checks in failing run | SKIPPED after failure |
| Admin auth mocked tests | PASS; not a live security certification |
| Real Neon connectivity | NOT VERIFIED |
| Dependency licence/SBOM review | NOT COMPLETE |
| Git history secret review | NOT COMPLETE |
| CSP/HSTS/Permissions-Policy review | HARDENING REQUIRED |
| Dynamic QR / analytics | NOT INCLUDED / INCOMPLETE |
| Production | LOCKED / UNTOUCHED |

## 6. Next safe actions

1. Reproduce and isolate the dots-pattern PNG decode failure; do not remove or silently disable the dots preset.
2. Make a minimal targeted fix only after the cause is established, then rerun the complete browser workflow including responsive checks.
3. Add deterministic dependency management and a documented third-party asset/licence inventory as a separate, reviewed change.
4. Review security headers with a compatibility test plan before changing them.
5. Complete Git-history secret scanning and buyer-owned Preview acceptance.
6. Keep PR #5 Draft and Production untouched until separately authorized.

## Scope and limitations

This is a source and CI evidence review, not a live authenticated Admin acceptance test, independent security audit, legal opinion, or guarantee of safety. No application feature code, database, environment variable, domain, or Production setting was changed as part of this audit.
