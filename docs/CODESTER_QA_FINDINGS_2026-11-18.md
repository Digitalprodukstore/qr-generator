# Codester Preparation — QA Findings (18 November 2026)

## Snapshot tested

- Source branch: `codester/marketplace-prep-2026-11-18`
- Source commit tested: `d18e4b520e79130ecb7a15f1698fcf6c3aa957d9`
- Test branch: `audit/codester-marketplace-qa-2026-11-18`
- Test-only marker commit: `8ba8967ba7056fc3af140000e9a2a13e93998bb7`
- Vercel Preview check: SUCCESS; anonymous buyer access has not been independently verified.

## Results

| Check | Result | Notes |
|---|---|---|
| Static document / SEO checks | PASS | Includes buyer-domain placeholder assertions after seller-domain cleanup. |
| QRNode module syntax and payload static checks | PASS | No syntax/payload-coverage failure reported. |
| Admin authentication mocked tests | PASS | Mocked tests only; not a live penetration test or live provider acceptance. |
| Phase 2 premium static checks | PASS | Static checks only. |
| Phase 3 schema guard | PASS | Schema guard only; migration remains unapplied and Dynamic QR remains excluded. |
| Browser QR scan workflow | BLOCKED | Job stopped at `npm audit --audit-level=high` before the browser test stage. |

## Newly observed dependency advisory

On 17 November 2026, the clean CI install reported 10 high-severity dependency findings associated with the transitive `picomatch` dependency used by the Tailwind CSS 3.4.x build toolchain. The audit output identifies GHSA-fc5q-39xc-vjpf / CVE-2026-112366 (ReDoS in repeated extglob parsing).

The current package uses Tailwind CSS 3.4.17 as a development/build dependency; the generated CSS is committed and loaded locally at runtime. This means the finding is in the build-time dependency tree, not a direct runtime QR API dependency, but it still affects a full development install and the CI gate.

The audit output offered a forced upgrade to Tailwind CSS 4.3.5, which is a major-version change. Do not run `npm audit fix --force` blindly: Tailwind v4 requires a migration and full visual/browser regression. No dependency change has been made in response to this finding.

Required follow-up:
1. Review whether a safe patched upstream dependency becomes available.
2. If considering Tailwind v4, do so on a separate branch and validate the existing theme/configuration and all responsive layouts.
3. Consider a buyer release install that uses the already-committed generated CSS and omits build-only dependencies, but validate the exact Vercel install behavior before adopting it.
4. Re-run clean install, dependency audit, all 18 QR decode tests, export tests, and responsive browser tests on the exact final release commit.

## Release decision

The Codester package is **not ready for submission**. The source-preparation branch is still a working branch. The dependency audit gate and live buyer-owned Preview acceptance remain open. No Production, baseline, or PR #5 state was changed by this QA run.
