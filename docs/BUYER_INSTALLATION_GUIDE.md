# Buyer Installation Guide — QR Studio Pro

This guide explains how a buyer can deploy an independent copy of QR Studio Pro using their own accounts, credentials, and domain.

> **Product scope:** This package is the Static QR Generator Commercial Edition (AS-IS). Dynamic QR, redirect management, analytics, cloud project sync, and active AdSense integration are not included.

## 1. What the buyer needs

- A GitHub account and a copy of the source code.
- A Vercel account for hosting the web app and serverless Admin API.
- An Upstash Redis database for Admin sessions, login rate limiting, and shared Admin settings.
- A domain name only if the buyer wants a custom domain. The default Vercel deployment domain can be used.
- A Neon PostgreSQL database only if the buyer wants to use the optional Admin database-health probe. It is not required for static QR generation or the Admin settings store.

Create these resources in the buyer's own accounts. The seller's Vercel, Upstash, Neon, GitHub, domain, and credentials are not part of the source-code handover.

## 2. Deploy a private copy

1. Download and extract the source package.
2. Create a new private GitHub repository owned by the buyer.
3. Upload the source files to that repository. Do not upload `.env` files, local credentials, access tokens, `node_modules`, or the seller's `.git` history.
4. In Vercel, create a new project and import the buyer-owned repository.
5. Keep the first deployment in Preview while configuring and testing.
6. Use the repository's normal build settings. Install dependencies with `npm ci`; the project does not currently provide a standalone `npm start` command.

Do not connect the buyer's copy to the seller's repository or Vercel project.

## 3. Create the buyer's own Admin credentials

In the buyer's Vercel project, open **Project Settings → Environment Variables** and add the following variables for the **Preview** environment first:

| Variable | Buyer action |
|---|---|
| `ADMIN_EMAIL` | Set the email address the buyer wants to use for Admin login. |
| `ADMIN_PASSWORD` | Set a unique, strong password. |
| `ADMIN_PIN` | Set a private PIN or passphrase. |
| `ADMIN_SESSION_SECRET` | Generate a cryptographically random secret of at least 32 characters. |
| `UPSTASH_REDIS_REST_URL` | Paste the REST URL from the buyer's Upstash Redis database. |
| `UPSTASH_REDIS_REST_TOKEN` | Paste the REST token from the buyer's Upstash Redis database. |

Optional:

| Variable | When to configure |
|---|---|
| `DATABASE_URL` | Only when using the Admin database-health probe; this endpoint expects a Neon PostgreSQL connection URL. |

**Security rules**

- Never put real values in source files, README files, screenshots, support tickets, or Git commits.
- Never reuse the seller's credentials or Upstash tokens.
- Do not share environment-variable values with the seller or other buyers.
- Store the generated session secret securely. Anyone with the required credentials and secrets may be able to administer the deployment.
- Admin authentication requires Upstash Redis. If the required variables or Redis service are unavailable, login fails closed; there is no insecure local fallback.

After saving or changing environment variables, trigger a new deployment for the matching environment. Changing environment variables does not retroactively update an already-built deployment.

### Changing Admin email, password, or PIN later

The current edition does not provide an in-dashboard credential editor. The buyer changes credentials in their own Vercel project's Environment Variables:

1. Update `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and/or `ADMIN_PIN`.
2. If rotating the session signing key, update `ADMIN_SESSION_SECRET` to a new random value as well. Existing signed sessions will no longer validate.
3. Redeploy the target environment.
4. Sign in using the new values and verify the Admin functions.

Use Preview for testing first. Update Production variables only when the buyer is ready to release their own deployment.

## 4. Configure Upstash Redis

1. Create a Redis database in the buyer's Upstash account.
2. Open its REST API details.
3. Copy the REST URL into `UPSTASH_REDIS_REST_URL`.
4. Copy the REST token into `UPSTASH_REDIS_REST_TOKEN`.
5. Redeploy the Vercel Preview project.
6. Test Admin login, page refresh/session validation, and saving a global setting.

The Redis database stores active Admin session records, login attempt counters, and shared global settings. Use a database dedicated to this deployment, or an appropriately isolated keyspace. Do not reuse another customer's Redis credentials.

## 5. Use a custom domain

A custom domain is optional. The buyer can keep the Vercel-provided deployment domain or connect a domain they own.

1. In the buyer's Vercel project, open **Settings → Domains**.
2. Add the buyer's domain or subdomain, for example `qr.example.com`.
3. Follow the exact DNS instructions Vercel displays for that domain.
4. Add or update the DNS records at the buyer's domain registrar/DNS provider.
5. Wait for Vercel to verify the domain and issue HTTPS.
6. Set the preferred domain/redirect behavior in Vercel if the buyer has added more than one domain.
7. Test the public generator and Admin login on the final HTTPS domain.

DNS records can vary by domain and Vercel configuration. Use the records shown in the buyer's own Vercel dashboard; do not copy DNS values from the seller's domain.

The generator itself does not require a domain-specific code change to create static QR codes. The supplied source uses `https://example.com` placeholders in canonical/hreflang metadata, `sitemap.xml`, and `robots.txt`. Buyers must replace those placeholders with their own final HTTPS domain before a public Production release. Also review sample payloads, sponsor links, social links, contact details, and legal/business disclosures.

## 6. Preview acceptance checklist

Before using a Production domain, verify:

- [ ] Public app loads over HTTPS on the buyer's deployment.
- [ ] A QR code can be generated from a URL.
- [ ] The generated QR scans and opens the expected destination.
- [ ] PNG export works.
- [ ] SVG export works.
- [ ] Admin login works with the buyer's email, password, and PIN.
- [ ] Admin session remains valid after a page refresh.
- [ ] Admin can save a global setting and the setting persists after refresh.
- [ ] The same setting is visible in another browser/device using the same deployment.
- [ ] Disabled QR types are hidden from the public selector as expected.
- [ ] Login rate limiting is active.
- [ ] The buyer has replaced legal, privacy, terms, contact, and business details with accurate information.
- [ ] No seller credentials, tokens, private URLs, or account-specific identifiers remain in the buyer's repository or deployment.

Record any failed test and resolve it before Production release.

## 7. Important limitations

- QR codes are static. Changing a destination requires generating a new QR code.
- Dynamic QR management, redirect resolver, campaign analytics, and cloud-synced projects are not included.
- Recent projects are stored in the visitor's browser localStorage and are not shared across devices.
- The optional Neon database-health endpoint is only a connectivity check; it does not enable Dynamic QR functionality.
- Ad/sponsor settings are configuration placeholders; this package does not activate AdSense or guarantee advertising approval.
- Third-party libraries, fonts, icons, and external services remain subject to their own terms and licences.

## 8. Independent ownership of deployment resources

Each buyer should operate a separate installation:

- Their own GitHub repository.
- Their own Vercel project and environment variables.
- Their own Admin credentials and session secret.
- Their own Upstash Redis database.
- Their own optional Neon database.
- Their own domain and DNS account, if using a custom domain.

The source package does not transfer the seller's hosting accounts, domain names, API keys, database accounts, subscriptions, or third-party service agreements.