# QR Studio Pro — Installation Guide

This guide describes a buyer-owned installation of the Static QR Generator Edition.

## 1. Prerequisites

- Node.js 20 or later and npm.
- A GitHub account (recommended for deployment from source).
- A Vercel account or compatible host for the included serverless API routes.
- An Upstash Redis REST database for Admin authentication, session validation, login rate limiting, and shared Admin settings.
- Optional: a Neon PostgreSQL database for the Admin database-health diagnostic only.

The source package does not include hosting, domains, Redis, PostgreSQL subscriptions, or third-party provider accounts.

## 2. Extract and install

1. Extract the purchased ZIP into a new project directory.
2. Open a terminal in the project directory.
3. Install the exact dependency versions from the lockfile:

   ```bash
   npm ci
   ```

4. Build the committed Tailwind input into the local stylesheet:

   ```bash
   npm run build:css
   ```

5. Confirm that `assets/tailwind.generated.css` exists and is not empty.

## 3. Configure environment variables

1. Copy `.env.example` to `.env`.
2. Create a new Upstash Redis database in an account owned by the buyer.
3. Copy its REST URL and REST token into:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
4. Set fresh buyer-owned values for:
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `ADMIN_PIN`
   - `ADMIN_SESSION_SECRET`

   The session secret must contain at least 32 characters. Use a cryptographically secure random value. Do not reuse demo credentials or seller credentials.

5. Optionally set `DATABASE_URL` to a buyer-owned Neon PostgreSQL connection string if the Admin database-health diagnostic is required.

Do not commit `.env`. The repository `.gitignore` excludes local environment files.

## 4. Run locally

The project includes Vercel-style serverless API routes under `api/`. Use Vercel's local development server to test both the frontend and API routes:

1. Install the Vercel CLI using the official Vercel installation instructions.
2. Link the local project to a buyer-owned Vercel project when prompted, or use the CLI's local development workflow.
3. Add the required local environment variables through the supported Vercel environment workflow.
4. Run:

   ```bash
   vercel dev
   ```

5. Open the local URL printed by the CLI.

A plain static HTTP server can display the public generator, but it will not execute the Admin API routes. Do not use a static-only server to accept Admin login or persistence as tested.

## 5. Deploy to Vercel

1. Create a new Vercel project under the buyer's own account/team.
2. Import the buyer-owned source repository or upload the project using Vercel's supported workflow.
3. Confirm the project root is the directory containing `vercel.json` and `package.json`.
4. Add the environment variables from Section 3 to the intended Preview environment first.
5. Deploy a Preview build.
6. Verify public QR generation and downloads.
7. Verify Admin login, session persistence, logout, rate limiting, and global settings using buyer-owned Upstash credentials.
8. Only after Preview acceptance, configure Production variables and domains according to the buyer's own release process.

Do not reuse the seller's Vercel project, domain, Redis database, Neon database, or credentials.

## 6. Admin configuration and behavior

Admin login requires all four Admin variables and both Upstash variables. If the required configuration or Redis service is unavailable, Admin authentication and global settings fail closed. There is no insecure local-storage authentication fallback.

The global settings endpoint stores the enabled/disabled QR categories and sponsor/ad configuration in Upstash Redis. AdSense remains inactive unless a separate valid account and integration are configured; the presence of settings fields does not activate it.

## 7. Optional Neon diagnostic

If `DATABASE_URL` is configured, the Admin database-health endpoint performs a read-only `SELECT 1` check against a Neon PostgreSQL host. This edition does not include Dynamic QR create/update/delete, redirect resolution, or persistent scan analytics. The SQL migration under `db/migrations/` is a draft only and must not be applied for this edition.

## 8. Post-install acceptance checklist

- [ ] Public page loads in Indonesian and English.
- [ ] Generate and independently scan representative QR codes from all 18 categories.
- [ ] PNG and SVG downloads open correctly.
- [ ] Test colors, patterns, logo placement, and export sizes.
- [ ] Test local saved projects and understand that they are browser/device-local.
- [ ] Test the responsive layout on phone, tablet, and desktop.
- [ ] Admin login works with buyer-owned credentials.
- [ ] Admin logout revokes the active session.
- [ ] Login rate limiting is active.
- [ ] Global settings persist after reload and in a second browser/device.
- [ ] No seller-owned domain, account, secret, or service remains in the deployment.
- [ ] Privacy, Terms, Contact, and support information have been reviewed and replaced with buyer details.

## 9. Troubleshooting

### Admin login returns a configuration error

Check that all Admin variables are set in the correct environment and that the deployment was redeployed after adding them.

### Admin login reports that protection or session storage is unavailable

Check the Upstash REST URL/token, database status, and provider quota. Admin login intentionally fails closed when Redis is unavailable.

### Admin settings do not synchronize

Check Upstash connectivity and confirm the deployment uses the same buyer-owned Redis database for all serverless functions.

### The public page works but Admin APIs do not

Confirm the application is running on Vercel or a compatible serverless host that implements the included API route convention. A static file server alone does not run the API handlers.

### QR styling looks incomplete

Run `npm ci` followed by `npm run build:css`, then confirm the generated stylesheet is present.

## 10. Scope and support

Dynamic QR management, redirect resolution, persistent scan analytics, cloud-synced projects, active AdSense, and verified live Neon application features are outside this edition. Any support, update, warranty, or customization commitments must be agreed separately with the marketplace seller.
