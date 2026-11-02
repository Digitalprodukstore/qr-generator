# QR Studio Pro — AdSense Readiness Checklist

Status: preparation only. Google AdSense is not yet approved or connected. No AdSense loader, publisher ID, ad-unit ID, or ad request is active in this branch.

## Implemented in Preview
- Responsive, clearly labeled advertisement placeholders on the generator and result/design workspace.
- The placeholders do not request ads, create impressions, block QR creation, or delay PNG/SVG downloads.
- Footer navigation to About Us, Contact, Privacy Policy, Terms of Service, Disclaimer, FAQ, Tutorial, and Use Cases.
- Eight public information pages with editable owner/contact placeholders; Privacy/Terms/Disclaimer text now reflects the inspected app behavior.
- Sitemap entries for all eight pages.
- Existing QR creation, design, size selection, PNG/SVG export, and mobile file delivery are retained.

## Owner details to complete before applying
- [ ] Legal owner/business name and business address.
- [ ] Support email, privacy email, and contact/working hours.
- [ ] Contact details and commercial partnership contact.
- [ ] Hosting provider, server-log practices, retention periods, and security measures.
- [ ] Confirm exact data flows for QR content, localStorage projects, admin configuration, and any future analytics.
- [ ] List all third-party libraries, hosting, analytics, cookies, and advertising providers actually used.
- [ ] Owner to confirm audience/children statement and complete legal identity/contact details.
- [ ] Review Terms and Disclaimer with the owner's actual operating model and applicable law.
- [x] Add visible last-updated date to Privacy, Terms, and Disclaimer pages.
- [ ] Owner to complete all identity/contact placeholders and conduct final editorial/legal review.

## Before enabling AdSense
1. Apply for AdSense using the real site/domain after the information pages and content are complete.
2. Wait for Google review and approval.
3. Only then add the real publisher ID and approved ad-unit IDs.
4. Keep ad labels distinct from navigation and download controls; never incentivize clicks or force ad viewing.
5. Verify ads do not cover content, obstruct navigation, or delay downloads.
6. Re-test responsive layouts, accessibility, QR generation, PNG/SVG export, and mobile sharing.

## Release guardrails
- This work is on `fix/qrnode-phase1-adoption-2026-11-02` and the existing draft PR only.
- Do not merge or change Production without explicit owner approval.
- Preview pages are drafts; owner placeholders must be replaced and legal text reviewed before public production release or an AdSense application.
