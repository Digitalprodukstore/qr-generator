# QRnode — AS-IS Commercial Feature Matrix

Status basis: repository audit and owner-reported Preview checks updated 18 November 2026. This is a disclosure matrix, not a certification that every live workflow has been re-tested. This is a disclosure matrix, not a certification that every live workflow has been re-tested.

## Included in the current Static QR Edition scope

| Area | Current documented capability | Sale disclosure / verification |
|---|---|---|
| Static QR generator | 18 QR categories across Basic, Communication, Business, Marketing & Event | Existing core is treated as protected. Re-run real-device decode tests before buyer acceptance. |
| Payload validation | Category-specific validation and standards-oriented payload generation | Buyer should validate representative payloads for their use cases. |
| Export | PNG and SVG export; selectable PNG sizes/ratios | Re-test downloaded files and scans on buyer devices. |
| Design | Logo, color/gradient customization, Premium Design Studio and presets | Re-test logo readability and scan reliability with each design. |
| Sharing | Mobile share support where browser/device supports it | Native share availability depends on browser and OS. |
| Saved projects | Up to eight recent projects via browser localStorage | Browser/device-local; not cloud synced and may be removed when site data is cleared. |
| Language and layout | Indonesian/English interface; responsive layout | Final bilingual and mobile regression remains a buyer-acceptance item. |
| Admin | Server-side Admin authentication and global settings for 18 QR categories | Requires Vercel environment secrets and Upstash Redis. Owner confirmed Preview login, global settings persistence after refresh, and cross-browser sync on 18 Nov 2026; logout, expiry, and failure-mode tests remain outstanding. |
| Public information | Privacy, Terms, FAQ, Tutorial, Use Cases, Contact and related pages | Owner/legal identity, contact, policies and domain references must be approved before resale/release. |

## Explicitly not included / not represented as complete

- Dynamic QR management, persistent destination editing, resolver redirects, lifecycle controls and analytics.
- Fully implemented Dynamic QR database-backed functionality. Owner reported that the Admin Preview database health check succeeded on 18 Nov 2026, but this only confirms the health probe and does not mean Dynamic QR CRUD, resolver, or analytics are implemented.
- Applied Dynamic QR database migration. The migration file exists but has not been applied.
- Cloud synchronization or cloud backup of saved QR projects.
- Active Google AdSense integration, approval, ad serving or guaranteed revenue. Current ad controls/placeholders are not an active monetization integration.
- Independent penetration-test certification, legal compliance certification, uptime/SLA or guaranteed browser compatibility.

## Deployment and transfer status

- Development work branch: `fix/qrnode-phase1-adoption-2026-11-02`.
- Locked baseline: `baseline/qr-generator-v1-locked`.
- PR #5 remains Draft; it must not be represented as merged or released.
- Production domain `qrnode.boothpro.my.id` is locked/untouched and is not automatically included in a source-code sale.
- Preview deployment READY is not proof that anonymous buyer access, production readiness, or all live integrations have passed.

## Recommended product label

**QRnode — Static QR Generator Commercial Edition (AS-IS)**

Describe the included capabilities above and attach this matrix to any offer. Do not advertise it as a complete Dynamic QR / analytics platform or as 100% security-certified software.
