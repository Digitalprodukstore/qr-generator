# QR Studio Pro — Buyer Handover Checklist

Use this checklist for a **non-exclusive source-code licence sale**. The seller retains ownership of the original application IP and may license the same product to multiple buyers. The buyer receives only the rights granted by the applicable Codester licence and any written terms that do not conflict with it. A source-code sale does not automatically transfer third-party accounts, domains, service subscriptions, trademarks, or rights in third-party libraries.

## 1. Define the transaction scope

- [ ] Product name and exact version/commit SHA are stated in the agreement.
- [ ] Sale is identified as **Static QR Generator Commercial Edition — AS-IS**, unless a separately tested scope is agreed.
- [ ] Included repository and branch are stated.
- [ ] Dynamic QR, resolver, persistent analytics and database-backed campaign management are explicitly excluded unless separately completed and accepted.
- [ ] Neon database and any existing data are explicitly included or excluded.
- [ ] Production domain `qrnode.boothpro.my.id` is explicitly included or excluded.
- [ ] Vercel project/team, Upstash database, Neon resources, email/support accounts and other vendor accounts are each explicitly listed as included, excluded, or buyer-recreated.
- [ ] Support period, bug-fix obligations, update obligations, warranties, liability limits and acceptance window are written down.
- [ ] The exact Codester licence tier (Regular or Extended) is identified and the buyer is directed to the applicable Codester licence terms.
- [ ] No exclusive ownership or copyright assignment is promised; the seller retains the right to sell/license the same source to other buyers.
- [ ] Buyer modification and use rights, project/client scope, redistribution restrictions, support and update terms are explained without extending rights beyond the selected Codester licence.
- [ ] A qualified Indonesian legal professional reviews the IP assignment/licence wording and written transfer instrument.

## 2. Repository and source delivery

- [ ] Deliver a clean source archive or a buyer-owned repository copy; do not transfer the seller's GitHub account or the original repository unless separately agreed.
- [ ] Identify exact commit SHA and tag the accepted non-exclusive release version.
- [ ] Include source, documentation, build/deployment instructions and known-limitations matrix.
- [ ] Review Git history for secrets, personal data, test credentials and unrelated private material before transfer.
- [ ] Revoke seller collaborator access only after buyer confirms access and backup.
- [ ] Do not transfer personal GitHub account credentials.

## 3. Hosting, domain and external services

- [ ] Buyer creates/owns their own Vercel account/team or accepts a documented project transfer.
- [ ] Buyer controls the domain registrar and DNS if domain is included.
- [ ] Buyer creates their own Upstash Redis database and confirms region, limits and billing.
- [ ] Buyer creates their own Neon project only if database-backed functionality is in the agreed scope.
- [ ] Buyer reviews Vercel deployment protection, Preview/Production separation, build settings and domains.
- [ ] Buyer verifies all vendor terms, quotas, billing, data regions and account-transfer rules.

## 4. Secrets and security cutover

- [ ] Seller never sends passwords, tokens, cookies or private keys in chat or source files.
- [ ] Buyer generates fresh Admin email/password/PIN and a new session secret.
- [ ] Buyer provisions new Upstash credentials and sets them in the correct Vercel environment.
- [ ] Buyer provisions database credentials only if needed; secrets are entered directly in the buyer's secure provider dashboard.
- [ ] Seller rotates/revokes old credentials and sessions after the buyer confirms the new deployment works.
- [ ] Verify login, logout, expiry, session revocation, rate limiting and fail-closed behavior on buyer-owned Preview.
- [ ] Check repository history and deployment logs for accidental secret exposure; rotate any potentially exposed value.

## 5. Functional acceptance

- [ ] Generate and decode representative QR codes from all 18 categories.
- [ ] Verify PNG and SVG downloads.
- [ ] Verify logo, colors/gradients, presets and export sizes.
- [ ] Verify mobile share behavior on supported devices.
- [ ] Verify saved projects and explain localStorage limitations.
- [ ] Verify Indonesian/English switching and public information pages.
- [ ] Verify Admin login/logout/session behavior and global settings sync.
- [ ] Verify mobile and desktop layouts.
- [ ] Verify Preview access for intended testers without weakening deployment protection.
- [ ] Record defects, reproduction steps, browser/device, severity and agreed disposition.

## 6. Final transfer record

- [ ] Buyer confirms receipt of source and documents.
- [ ] Buyer confirms ownership/access to each included asset.
- [ ] Both parties sign the acceptance and asset schedule.
- [ ] Seller revokes temporary support access and rotates any credentials that were temporarily shared, if applicable.
- [ ] Buyer stores a secure backup and records recovery contacts.
- [ ] Final commit SHA, buyer deployment URL, buyer domain, buyer-owned service list and exclusions are attached to the handover record.

**Important:** This checklist is operational guidance, not a legal instrument or legal advice. The parties should obtain legal review of the written transfer agreement and third-party account transferability.
