# QRNode adoption — Phase 1

Date: 2026-11-02  
Target: QR Studio Pro legacy single-page app  
Source: `qrnode.zip` — selective adoption only

## Scope implemented in this branch

- Adds 12 content types: URL, text, WhatsApp, email, telephone, SMS, Wi-Fi, vCard, geo, calendar event, menu URL, and invitation URL.
- Adds client-side field validation and payload construction.
- Uses standard payload families (mailto, tel, smsto, WIFI, vCard 3.0, iCalendar, geo URI, WhatsApp click-to-chat).
- Adds SVG download alongside the existing PNG and share actions.
- Keeps the existing canvas renderer, QR encoder, logo UI, color controls, admin portal, and sponsor settings in place.
- Menu and invitation deliberately accept public URLs. The source ZIP's custom MENU:/UNDANGAN: strings are not interoperable QR payload standards and would otherwise scan as opaque text.

## Explicitly not migrated

- SQLite database and its records.
- FastAPI backend, payment endpoints, admin/auth stack, Supabase credentials, and environment files.
- Next.js build output, node_modules, .next, out, Docker/Helm deployment artifacts.
- AI/payment/premium service code. Those need separate architecture, provider, secret, webhook, and entitlement review.

## Source ZIP security finding

`app/security.py` contains an origin comparison that ends with `or True`, which makes that fallback comparison always pass. The ZIP backend is therefore not eligible for direct deployment or copy/paste migration. This finding is documented for remediation if backend modules are considered later.

## QA required before promotion

1. Run the static module checks and browser QR decode workflow.
2. Verify each of the 12 payload types with at least two independent phone scanners.
3. Specifically test Wi-Fi credentials containing semicolons, commas, colons, quotes, and backslashes.
4. Test vCard import into iOS Contacts and Android Contacts.
5. Test iCalendar import on iOS Calendar and Google Calendar.
6. Test geo payload behavior across camera apps and Google Maps.
7. Test SVG opened in a browser and imported into a vector editor; verify scanability after print at intended physical sizes.
8. Test 360px mobile viewport and desktop; verify legacy admin login, ad/sponsor settings, PNG download, logo, gradient, and sharing regressions.
9. Do not merge to Production until manual scanner tests and Preview regression pass.

## Known limitations in this phase

- PNG output continues to use the existing 1200px canvas; 2048px export and resolution selection remain a follow-up.
- Contrast checking and print-size guidance are not yet wired into the legacy app.
- Menu/invitation are link-based, not hosted page builders.
- SVG output uses a standards-compliant QR matrix and embeds supported uploaded raster logo data when present; final logo scanability still requires physical-device testing.
