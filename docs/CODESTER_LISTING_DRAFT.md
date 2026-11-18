# Codester Listing Draft — QR Studio Pro

Status: Draft for seller review. Do not publish until licence, source package, demo, screenshots, and final QA are approved.

## Product title

QR Studio Pro — 18-Type Static QR Code Generator with PNG/SVG Export

## Short description

18-type static QR generator with custom designs and PNG/SVG export. Bilingual and responsive.

## Product category

Choose the closest available JavaScript / HTML5 / Scripts & Code category. Do not select PHP: this product uses browser JavaScript and Vercel serverless API routes, not a PHP backend.

## Suggested tags

QR Code, QR Generator, Static QR, JavaScript, PNG Export, SVG Export, Responsive, Admin Dashboard, Vercel, Upstash Redis, Bilingual

## Full description

### Create and customize QR codes in your browser

QR Studio Pro is a browser-first QR code generator designed for personal use, creators, and businesses that need a straightforward way to create and export static QR codes.

The interface includes 18 QR categories grouped into Basic, Communication, Business, and Marketing & Event. Users can enter the relevant data, customize the visual appearance, preview the result, and export the QR code as PNG or SVG.

### Main features

- 18 static QR categories across four groups.
- Category-specific input and payload validation.
- PNG and SVG export.
- Logo, color, gradient, and preset customization.
- Premium Design Studio.
- Indonesian and English interfaces.
- Responsive layout for modern desktop and mobile browsers.
- Up to eight recent projects stored locally in the visitor's browser.
- Optional server-protected Admin area.
- Admin controls to enable or disable the available QR types globally.
- Shared Admin settings stored through buyer-configured Upstash Redis.
- Signed Admin session cookies and login rate limiting.

### Technology

- HTML, CSS, and browser JavaScript.
- Vercel serverless API routes for Admin features.
- Upstash Redis REST for Admin sessions, login rate limiting, and shared settings.
- Optional Neon PostgreSQL connectivity probe for Admin diagnostics.
- Precompiled responsive stylesheet served locally; no Tailwind CLI/build dependency is required for installation.

### Installation

The buyer deploys an independent copy using their own GitHub repository and Vercel project. Admin functionality requires the buyer's own Upstash Redis database and environment variables. A custom domain can be connected through the buyer's Vercel project and DNS provider.

The download includes a buyer installation guide covering deployment, Admin credential setup, Redis configuration, custom domain setup, and a Preview acceptance checklist.

### Important scope and limitations

- This is a **static QR generator**. The destination/content is embedded in the QR code and cannot be changed after generation.
- Dynamic QR CRUD, redirect resolution, campaign analytics, and campaign management are not included.
- Recent projects are stored in browser localStorage and are not synchronized to the cloud.
- The optional Neon health check only tests database connectivity; it does not enable Dynamic QR functionality.
- Ad/sponsor settings are configuration placeholders. Active AdSense integration and approval are not included.
- Hosting, domain, database, and third-party service accounts are not included. Buyers create and pay for their own provider accounts as applicable.
- Buyers must replace example domain, contact, legal, privacy, and business details before public launch.

## Included files

- Complete application source code.
- Vercel serverless Admin API routes.
- Compiled local CSS stylesheet.
- Package manifest and lockfile.
- Buyer Installation Guide.
- Buyer Handover Checklist.
- Third-party notices and licence texts.
- AS-IS Feature Matrix.
- Security & Distribution Audit.
- Third-party Asset & Licence Inventory.

## Requirements

- Node.js and npm for dependency installation; no CSS build toolchain is required.
- GitHub account for buyer-owned source repository (recommended).
- Vercel account/project for serverless Admin API deployment.
- Upstash Redis database for Admin login, sessions, rate limiting, and global settings.
- Optional Neon PostgreSQL database only for the Admin database-health probe.
- Optional buyer-owned domain and DNS access.

## Licence and support fields to complete before submission

- Codester licence type(s): use the platform's supported Regular and Extended licence options.
- Seller support policy: [seller to define].
- Updates policy: [seller to define].
- Final price: [seller to set in Codester].
- Demo URL: [insert buyer-accessible Preview/demo URL after final QA].
- Screenshots: [prepare original screenshots from the approved release build].
- Application source licence and third-party notices: [complete legal/licence review before upload].

## Claims intentionally not made

Do not advertise Dynamic QR, editable QR destinations, scan analytics, campaign tracking, cloud-synced project history, active AdSense monetization, independent security certification, or guaranteed universal compatibility.
