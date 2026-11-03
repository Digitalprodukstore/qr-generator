# QR Studio Pro — AdSense Readiness Checklist

Status: preparation only. Google AdSense is not approved or connected. No AdSense loader, publisher ID, ad-unit ID, or ad request is active in this branch.

## Implemented in Preview
- Responsive, clearly labeled advertisement placeholders on the generator and result/design workspace.
- Placeholders do not request ads, create impressions, block QR creation, or delay PNG/SVG downloads.
- Footer navigation to About Us, Contact, Privacy Policy, Terms of Service, Disclaimer, FAQ, Tutorial, and Use Cases.
- Eight public information pages are present; Privacy, Terms, and Disclaimer reflect the inspected application behavior.
- Public operator/contact details currently configured: operator BoothPro; product QR Studio Pro; country Indonesia; support contact Namachanel89@gmail.com and WhatsApp 0881022062137; service hours Monday–Friday, 09:00–17:00 WIB.
- No physical business address is displayed because this is a software service without a customer-facing physical location. Do not invent or add an address.
- Sitemap entries for all eight public information pages.
- Existing QR creation, design, size selection, PNG/SVG export, and mobile file delivery are retained.

## Remaining owner and compliance checks
- [ ] Confirm the legal entity/individual responsible for the service and whether “BoothPro” is the correct public-facing operator name for legal notices.
- [ ] Confirm hosting provider, server-log practices, retention periods, and security measures from the actual hosting/account configuration.
- [ ] Confirm exact data flows for QR content, localStorage projects, admin configuration, and any future analytics.
- [ ] Verify the list of third-party libraries, hosting, analytics, cookies, and advertising providers against the deployed build.
- [ ] Owner to confirm audience/children statement and complete any legally required identity disclosures.
- [ ] Review Terms and Disclaimer against the actual operating model and applicable Indonesian law.
- [ ] Conduct final editorial, accessibility, mobile, and legal review before production release.
- [x] Public support email and WhatsApp contact are configured.
- [x] Service hours are configured as Monday–Friday, 09:00–17:00 WIB.
- [x] Visible last-updated dates are present on Privacy, Terms, and Disclaimer pages.

## Before enabling AdSense
1. Apply using the real site/domain only after public information pages and original useful content are complete.
2. Wait for Google's review and approval.
3. Only then add the real publisher ID and approved ad-unit IDs.
4. Keep ad labels distinct from navigation and download controls; never incentivize clicks or force ad viewing.
5. Verify ads do not cover content, obstruct navigation, or delay downloads.
6. Re-test responsive layouts, accessibility, QR generation, PNG/SVG export, and mobile sharing.

## Release guardrails
- This work is on `fix/qrnode-phase1-adoption-2026-11-02` and the existing draft PR only.
- Production domain `qrnode.boothpro.my.id` is locked. Do not deploy to or change Production.
- Do not merge the PR or change Production without explicit owner approval.
- Preview is for review/testing. The remaining owner/compliance checks above must be completed before a public production release or AdSense application.

## Latest Preview QA note — 3 November 2026
- Owner-reported manual end-to-end test: the user tested the public flow from start to finish and reported that it worked safely. This is recorded as owner-reported QA, not as an independently executed automated/browser test.
- Tutorial and FAQ support-email placeholders were replaced with the configured support email.
- English generator page was corrected to remove the unapproved sample Publisher ID, sample ad-slot ID, and “ADSENSE VERIFIED” claims; its default monetization preview is sponsor-only with Auto Ads disabled.
- Indonesian generator default monetization preview is also sponsor-only with Auto Ads disabled; Publisher ID and slot ID remain blank until actual approval/configuration.
- Preview still requires a fresh deployment and a final direct browser review after these edits.
