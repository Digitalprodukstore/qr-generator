# QR Generator — Full Ownership Sale & Transfer Readiness

Date: 2026-11-08
Branch: `fix/qrnode-phase1-adoption-2026-11-02`
Status: planning and safeguards only. No transfer endpoint or credential-change feature is live.

## 1. Product decision

QR Generator is intended to be sellable as a **full-ownership website handover** in the future.

The product continues to use one primary Admin at a time. It does not need multi-user accounts, customer workspaces, or tenant-level ownership.

When a sale is completed, the buyer becomes the sole owner/operator. The seller must no longer have Admin access or control over transferred infrastructure, unless a separate support/maintenance agreement explicitly grants limited access.

This is a future product requirement, not a claim that the current app can already perform a complete transfer automatically.

## 2. Scope of a full-ownership handover

The sale agreement and handover checklist must identify which of these assets are included and which are excluded:

- Application source code and repository ownership/access.
- Vercel project, team/project billing responsibility, deployment settings, domains, and environment variables.
- Custom domain registration and DNS control.
- Neon PostgreSQL project/database, schema, records, backups, and connection configuration.
- Upstash Redis project/data used for Admin sessions, rate limits, and any persisted application settings.
- Email delivery provider, sender domain, templates, and API credentials.
- Any analytics, QR rendering, storage, monitoring, or other third-party integrations.
- Brand assets, logo, fonts, design files, documentation, and commercial rights that the seller is legally able to transfer.
- Relevant third-party licenses, subscription costs, usage limits, and provider terms.

A source-code transfer alone is not a complete operational handover.

## 3. Admin identity and credentials

Current implementation facts:
- Admin email, password, PIN, and session signing secret are configured as server environment variables.
- Admin sessions use signed HttpOnly cookies and an Upstash-backed session record.
- Current Admin settings API validates the same-origin request and active Admin session before writes.

Future transfer requirements:
- Buyer sets a new Admin email, password, and PIN through a secure setup/claim flow.
- Password and PIN are never exported, emailed, displayed to the seller, or copied from the seller's credentials.
- Store only appropriately salted password/PIN hashes if credential storage is migrated into the application database. Never store plaintext credentials.
- The session-signing secret must be rotated during handover.
- Revoke every active Admin session and invalidate old session records/cookies.
- Rotate all integration/API credentials and remove seller-controlled credentials from the transferred environment.
- Require buyer verification before activating the new Admin identity.
- Log the transfer event without logging secrets, password values, PIN values, tokens, or private connection strings.

Do not add a transfer UI that merely changes the displayed Admin email while leaving the old environment credentials or sessions active.

## 4. Secure transfer workflow (future implementation)

1. Seller initiates a transfer and reviews a generated asset inventory.
2. Seller explicitly confirms that the listed assets and data are included in the sale.
3. System creates a short-lived, single-use transfer invitation. It must not contain credentials or database secrets.
4. Buyer accepts the invitation and proves control of the buyer email/account.
5. Buyer establishes new Admin credentials and required recovery factors.
6. Operator transfers the repository, Vercel project/team responsibility, domain, database, Redis, and provider accounts using each provider's supported ownership-transfer process.
7. Replace server environment variables with buyer-controlled secrets; rotate session signing keys and third-party API tokens.
8. Revoke seller sessions, remove seller access from GitHub/Vercel/providers, and verify no seller-owned credential remains active.
9. Run post-transfer checks: Admin login, QR generation, saved settings, database reads/writes, redirect resolution, analytics, email delivery, domain TLS/DNS, and deployment.
10. Buyer signs off on the asset inventory and successful acceptance test. Preserve a non-secret transfer audit record.

If a provider does not support transferring an account/project safely, migrate the relevant data and configuration to a buyer-owned resource instead.

## 5. Data portability and privacy

- Provide a documented export/import path for Dynamic QR records, settings, and analytics.
- Exports must exclude secrets, session cookies, password/PIN hashes, raw access tokens, and unnecessary visitor-identifying data.
- Use encrypted transfer/storage for backup archives and verify integrity with checksums.
- Define retention and deletion responsibilities in the sale agreement, including visitor analytics and any personal data.
- Do not transfer data the seller does not own or have permission to transfer.
- Keep an export manifest with schema version, record counts, creation time, and checksum; do not expose private data in logs.

## 6. Acceptance criteria before advertising "full ownership transfer"

- Buyer can access the repository and deploy from buyer-controlled accounts.
- Buyer controls the domain, hosting, database, Redis, and required provider accounts.
- Buyer can set new Admin email/password/PIN; seller credentials no longer authenticate.
- All old Admin sessions are invalidated.
- All relevant API keys, session secrets, and database credentials are rotated.
- Static QR generation and all included QR types work.
- Dynamic QR CRUD, redirects, and analytics continue to work after transfer and redeployment.
- Settings and agreed historical data are present and integrity-checked.
- Email and other included integrations work using buyer-owned credentials.
- No hidden seller dependency remains (personal account, billing, domain, webhook, token, or storage).
- Buyer has documentation for operations, backups, recovery, renewal, and support boundaries.

## 7. Explicit exclusions and safety gates

- Do not implement or advertise one-click ownership transfer until the secure workflow is designed, tested, and reviewed.
- Do not transmit credentials through chat, email, ZIP archives, Git commits, or plaintext exports.
- Do not change Production or real customer data as part of Preview development.
- Do not create buyer/seller account roles or multi-tenant ownership; the runtime model remains one primary Admin.
- Legal sale terms, intellectual-property ownership, third-party license transferability, tax, and privacy obligations require separate review and cannot be guaranteed by application code.

## 8. Current status

- Owner has confirmed the intention to sell the website as a full-ownership product.
- Single-primary-Admin model remains selected.
- Neon Postgres is approved for Preview, but provisioning and database connection are still pending.
- No ownership-transfer API, credential rotation UI, data export/import tool, or handover automation has been implemented yet.
- Current work is documentation/planning on the Preview feature branch only. Production remains untouched.
