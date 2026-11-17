# Codester ZIP Package Manifest

This manifest defines the intended buyer-facing archive. It is a preparation checklist, not a generated release archive.

## Include

- Application pages and static assets required by the app.
- `api/` serverless endpoints required by Admin authentication/settings.
- `assets/tailwind.generated.css`, `styles/`, and `tailwind.config.cjs`.
- `package.json` and `package-lock.json`.
- `vercel.json`.
- `.gitignore` and `.env.example`.
- `README.md`.
- `docs/CODESTER_INSTALLATION.md`.
- `docs/AS_IS_FEATURE_MATRIX.md`.
- `docs/THIRD_PARTY_ASSET_INVENTORY.md`.
- A final seller-approved application licence / marketplace notice once the rights decision is made.

## Exclude from the buyer ZIP

- `.git/`, local `.vercel/`, `node_modules/`, local environment files, logs, caches, and temporary artifacts.
- GitHub Actions workflow files and internal development-only test scripts unless a final release decision explicitly includes them.
- Internal audit and planning documents: `docs/MASTER_COMPLETION_AUDIT_AND_MEGA_PROMPT.md`, `docs/PRE_SALE_AUDIT.md`, `docs/TECHNICAL_AUDIT_FINDINGS.md`, `docs/OWNERSHIP_TRANSFER_PLAN.md`, `docs/PHASE3_DYNAMIC_QR_ANALYTICS_PLAN.md`, and this manifest.
- `db/migrations/001_create_dynamic_qr_tables.sql`: draft migration for Dynamic QR functionality that is not included in this Static QR Edition.
- Any seller-owned domains, credentials, account exports, database backups, Redis data, or private customer information.

## Release blockers

- The application's own licence / commercial rights notice has not yet been approved by the owner.
- Third-party inventory is partial; complete the transitive dependency and asset notice review.
- Verify that no seller-specific values remain in the buyer-facing source or documentation.
- Complete a clean install and buyer-owned Preview acceptance before generating the final archive.
- Re-run the release tests against the exact commit used for the ZIP.
- Confirm the final archive can be installed without seller accounts or credentials.

Do not generate or submit a marketplace ZIP until every release blocker is resolved or explicitly disclosed in the listing and accepted by the seller.
