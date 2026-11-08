# Phase 3 — Dynamic QR & Analytics: implementation gate

Date: 2026-11-02  
Branch: `fix/qrnode-phase1-adoption-2026-11-02`  
Status: architecture and security gate only; no dynamic-QR feature is advertised as live.

## 1. Current repository facts

- The application is a static HTML/JavaScript site deployed on Vercel.
- Existing server functions are limited to admin login, logout, session validation, and their helpers.
- Admin authentication uses signed HttpOnly cookies and fails closed when its required server secrets are absent.
- Shared login rate limiting is optional and depends on Upstash Redis environment variables; it is inactive when neither variable is configured.
- There is no application database, migration directory, dynamic-link resolver, QR-link CRUD API, or analytics event store in this branch.
- The original ZIP's SQLite/FastAPI/backend and secrets were intentionally not copied. Its origin-verification helper contains an unconditional `or True` fallback and is not safe to migrate unchanged.

## 2. Phase 3 outcome

Deliver a real, durable Dynamic QR service:
1. A QR encodes a stable first-party redirect URL, not the final destination.
2. The owner can change, pause, resume, and expire the destination without reprinting the QR.
3. Each valid redirect can generate an analytics event.
4. A dashboard reports aggregate scans by time, country/region where reliably available, device class, referrer class, and QR campaign.
5. Existing static QR generation remains available and unchanged.

A client-only implementation or localStorage counter is not Dynamic QR and must not be labelled as such.

## 3. Infrastructure decision

**Selected: Neon Postgres for the QR Generator Preview environment.** The owner approved Neon on 2026-11-08. Provisioning and account authorization are still pending; no Neon database or credentials have been created/connected by this change.

Use a dedicated Neon project/database for QR Generator, with TLS and pooled serverless connections. Do not reuse BoothPro's Supabase project, credentials, or data. Do not copy database credentials into Git, browser JavaScript, ZIP files, issues, or chat. Use Preview-only environment variables first. Production credentials and domain remain untouched until separate explicit approval.

Required server environment configuration after provider selection:
- `DATABASE_URL` (server-only pooled connection string).
- `APP_BASE_URL` (Preview origin during QA; production origin only after approval).
- A cryptographically random `QR_LINK_HASH_SECRET` (server-only, at least 32 bytes) if identifiers or event data require keyed hashing.
- Optional analytics/geolocation provider keys only if the owner approves an external provider; do not make them required for core redirects.

## 4. Proposed data model

### `qr_links`
- `id` UUID primary key.
- No `owner_id`: this product uses one primary Admin and does not support customer accounts/workspaces.
- `slug` unique, random, URL-safe identifier (at least 128 bits of entropy; never sequential).
- `title` nullable, bounded length.
- `destination_url` validated HTTP/HTTPS URL.
- `status` enum: `active`, `paused`, `expired`, `deleted`.
- `starts_at`, `expires_at` nullable timestamps.
- `created_at`, `updated_at` timestamps.
- `deleted_at` nullable timestamp for soft deletion/audit retention.

### `qr_scan_events`
- `id` UUID primary key.
- `qr_link_id` foreign key.
- `occurred_at` timestamp.
- `country_code` nullable coarse location only when supplied by trusted infrastructure.
- `device_class` enum: `mobile`, `desktop`, `tablet`, `unknown`.
- `referrer_class` coarse category; avoid storing full referrer URLs by default.
- `user_agent_family` coarse category only.
- No raw IP address, email, phone, or full user-agent string in the analytics table. If abuse protection needs IP-based limits, use a short-lived keyed hash in the rate-limit store and define its TTL.

Indexes:
- unique index on `qr_links.slug`.
- index on `qr_links.created_at` for the single-Admin dashboard listing.
- index on `qr_scan_events.qr_link_id, occurred_at`.
- time partitioning/retention can be added only after measured volume justifies it.

## 5. API contract

### Create link — `POST /api/qr-links`
- Requires the existing authenticated primary Admin session; reject requests without a valid server-side Admin session.
- Accepts `destinationUrl`, optional `title`, optional `expiresAt`.
- Validates URL scheme strictly: HTTP/HTTPS only; reject credentials in URLs, malformed hostnames, control characters, and oversized fields.
- Creates a cryptographically random slug and persists it.
- Returns the short URL, status, and timestamps. Never returns database internals.

### Update link — `PATCH /api/qr-links/:id`
- Requires the existing authenticated primary Admin session. No client-supplied owner ID or customer ownership check exists.
- Supports destination, title, status, and expiry changes.
- Uses optimistic concurrency or updated-at checks to avoid silent overwrites.
- Never allows a user to change the slug after printing.

### Resolve link — `GET /r/:slug`
- Accepts only a syntactically valid slug and performs a parameterized lookup.
- Returns 404 for unknown/deleted links; 410 for expired links; a safe paused page for paused links.
- Redirects active links with HTTP 302/307 to the stored destination.
- Destination is read from the database; never accept a redirect target from query parameters.
- Set `Cache-Control: no-store` until cache invalidation semantics are explicitly implemented.
- Record analytics asynchronously or with a bounded, failure-tolerant event write. Analytics failure must not prevent a valid redirect.
- Apply per-link and per-IP abuse controls without storing raw IPs in analytics.

### Analytics — `GET /api/qr-links/:id/analytics`
- Requires the existing authenticated primary Admin session.
- Supports bounded date ranges and pagination/aggregation.
- Returns aggregate counts, not raw visitor records.
- Enforce query limits and indexes to prevent expensive unbounded scans.

## 6. Security requirements

- Never trust a client-supplied owner ID, slug, scan count, or role.
- Use server-side authentication and authorization on every management endpoint.
- Use parameterized SQL and database constraints.
- Prevent open redirects: only redirect to the destination persisted for the slug; validate destination at create/update time.
- Apply request body size limits, schema validation, rate limits, and safe error responses.
- Protect state-changing requests against CSRF; retain Secure, HttpOnly, SameSite cookies and validate Origin/Host without permissive fallbacks.
- Do not copy the ZIP's origin-verification implementation; its `or True` fallback must be removed and covered by negative tests before any reuse.
- Add audit records for owner changes to destination/status/expiry.
- Keep secrets server-only and use Preview-scoped variables during implementation.
- Define a data retention period and privacy notice before enabling detailed analytics.

## 7. Required automated tests

1. Create/update/pause/resume/expire/delete lifecycle persists across cold starts.
2. Random slugs are unique and non-sequential.
3. Unknown, malformed, paused, expired, and deleted slugs return the correct safe response.
4. Redirect destination cannot be overridden using query parameters or headers.
5. Reject `javascript:`, `data:`, `file:`, protocol-relative, malformed, credential-bearing, and control-character URLs.
6. Requests without a valid Admin session cannot read, create, update, or delete QR links or analytics.
7. SQL injection payloads are treated as data.
8. Rate limits and CSRF/origin protections fail closed.
9. Analytics aggregation is correct across time zones and date boundaries.
10. Analytics write/database outage does not break an otherwise valid redirect.
11. Retention removes or aggregates old event data according to policy.
12. Load test resolver latency and database connection behavior before public rollout.

## 8. Rollout sequence

- **3A — Infrastructure:** Neon selected by owner; complete Neon account authorization/provision a dedicated Preview database, add Preview-only secrets, then apply migration.
- **3B — Server API:** implement repository layer, CRUD, redirect resolver, validation, auth, rate limits, and audit trail.
- **3C — Analytics:** implement privacy-minimized event collection and aggregate queries.
- **3D — UI:** add Dynamic QR controls and analytics dashboard only after API tests pass.
- **3E — Preview QA:** verify persistence after redeploy/cold start, redirect behavior, abuse controls, mobile UX, and physical QR scans.
- **3F — Release gate:** owner reviews Preview; Production remains unchanged until explicit approval.

## 9. Acceptance rule

Phase 3 is complete only when a QR printed from Preview continues to resolve after a deployment, its destination can be changed without reprinting, analytics are persisted server-side, and authorization/security tests pass. A static QR, a localStorage-only demo, or a UI mockup does not satisfy acceptance.


## 10. Phase 3A preflight work (2026-11-07)

Prepared on the Preview feature branch only:
- `db/migrations/001_create_dynamic_qr_tables.sql` defines `qr_links` and privacy-minimized `qr_scan_events`, with slug, URL scheme, lifecycle, expiry, foreign-key, and analytics indexes.
- `scripts/check-phase3-schema.js` statically checks the migration structure and confirms visitor-identifying columns are not present.
- `.github/workflows/qr-generator-phase3-schema.yml` runs the schema guard on feature-branch pushes and pull requests.

Validation:
- The schema guard was executed locally with Node.js and all 15 assertions passed.
- Vercel Preview deployment for commit `2358a58ac2580e7df295cf975f20ccf27f0f7ab4` reached READY.
- The migration has NOT been applied to any database.
- No database, environment variable, credential, Production deployment, or merge was created/changed.

Still blocked:
- Owner approval and provisioning of a dedicated Preview PostgreSQL provider.
- Database-level migration execution and integration tests against a real Preview database.
- API authentication/ownership model must be selected before implementing QR-link CRUD.


## 11. Phase 3B pre-implementation security findings (2026-11-07)

A focused review of the existing Admin API confirms:
- The current account model is one shared Admin identity configured through server environment variables; there is no per-customer account or authenticated owner identifier in the signed session.
- The session cookie is HttpOnly, Secure, and SameSite=Strict, but session issuance and validation require the shared Upstash Redis store.
- Admin settings writes already enforce same-origin Origin/Host validation and require a valid server session.
- The existing Admin login limiter also fails closed when Upstash is unavailable.

Implementation consequence:
- Do not assign customer ownership to a fabricated `owner_id` or treat a valid Admin cookie as a customer account.
- Dynamic QR CRUD must remain Admin-only until an explicit account/workspace ownership model is designed. If the product intentionally uses a single-owner dashboard, document that as a product decision before enabling writes.
- Added `api/_dynamicQrValidation.js` as a database-independent validation boundary for destination URLs, titles, expirations, and 128-bit random slugs.
- Added `scripts/check-phase3-validation.js` with negative tests for dangerous URL schemes, credentials, malformed values, whitespace/control characters, and invalid slugs.
- Extended the Phase 3 schema workflow to run the new validation suite. No API route or redirect endpoint is exposed by this change.

Remaining gate:
- Product ownership model and provider were explicitly decided on 2026-11-08: one primary Admin; Neon Postgres for Preview.
- Remaining: complete Neon provisioning/authorization and configure Preview-only connection secrets before implementing persistence and redirect resolution.


Validation update (2026-11-07):
- Executed `node scripts/check-phase3-validation.js` locally against the committed helper logic: 8/8 validation groups passed.
- Vercel Preview for commit `c7ce5d40f96882cbe7a1d5a570fd67db1e635fff` reached READY and the Vercel commit status is SUCCESS.
- GitHub Actions execution for the latest commit has not been independently confirmed; do not treat the workflow as passed until its run result is visible.


Validation update (2026-11-08):
- The extracted shared same-origin helper passed 7/7 test groups in a local Node.js run.
- The Admin settings endpoint now imports the shared helper; its existing PUT path still checks Origin/Host before validating the Admin session.
- Preview deployment and GitHub Actions for the security refactor must be checked separately; local tests do not establish remote CI status.


## 12. Owner decisions confirmed (2026-11-08)

- Ownership: **single primary Admin only**. No customer login, tenant/workspace model, or per-customer `owner_id` is in scope.
- Authorization: all Dynamic QR management and analytics endpoints require the existing valid server-side Admin session. Requests without that session fail closed.
- Database: **Neon Postgres approved for Preview**. This approval authorizes using Neon as the selected provider, but does not imply that a Neon account/project has been provisioned or that credentials are available.
- Production remains locked: no Production database, environment variables, deployment, custom domain, or release action is authorized.
- CI verification for commit `70c18945113c5554b29ea33d74561c8a291e6df2`: Phase 3 schema/security workflow run `42434158811` completed SUCCESS; Phase 2 premium static checks run `42434158805` completed SUCCESS. Vercel Preview status for the same commit is SUCCESS.

Next implementation gate: provision the dedicated Neon Preview database through the authorized Vercel/Neon account flow. Only after the real Preview connection variables are present should the migration be applied and database-backed integration tests begin.
