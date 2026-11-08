-- QR Studio Pro Phase 3A — schema draft
-- Preview-only preparation. This migration is NOT applied to any database.
-- Requires PostgreSQL 13+ (gen_random_uuid is built in on supported versions).

BEGIN;

CREATE TABLE IF NOT EXISTS qr_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(64) NOT NULL UNIQUE,
  title VARCHAR(120) NULL,
  destination_url VARCHAR(2048) NOT NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'active',
  starts_at TIMESTAMPTZ NULL,
  expires_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,

  CONSTRAINT qr_links_slug_format
    CHECK (slug ~ '^[A-Za-z0-9_-]{22,64}$'),
  CONSTRAINT qr_links_destination_http
    CHECK (destination_url ~* '^https?://[^[:space:][:cntrl:]]+$'),
  CONSTRAINT qr_links_status_valid
    CHECK (status IN ('active', 'paused', 'expired', 'deleted')),
  CONSTRAINT qr_links_expiry_after_start
    CHECK (starts_at IS NULL OR expires_at IS NULL OR expires_at > starts_at),
  CONSTRAINT qr_links_deleted_timestamp
    CHECK ((status = 'deleted' AND deleted_at IS NOT NULL) OR
           (status <> 'deleted' AND deleted_at IS NULL))
);

CREATE INDEX IF NOT EXISTS qr_links_created_idx
  ON qr_links (created_at DESC);
CREATE INDEX IF NOT EXISTS qr_links_status_expiry_idx
  ON qr_links (status, expires_at);

CREATE TABLE IF NOT EXISTS qr_scan_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_link_id UUID NOT NULL REFERENCES qr_links(id) ON DELETE RESTRICT,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  country_code CHAR(2) NULL,
  device_class VARCHAR(12) NOT NULL DEFAULT 'unknown',
  referrer_class VARCHAR(12) NOT NULL DEFAULT 'unknown',
  user_agent_family VARCHAR(40) NULL,

  CONSTRAINT qr_scan_country_code
    CHECK (country_code IS NULL OR country_code ~ '^[A-Z]{2}$'),
  CONSTRAINT qr_scan_device_class
    CHECK (device_class IN ('mobile', 'desktop', 'tablet', 'unknown')),
  CONSTRAINT qr_scan_referrer_class
    CHECK (referrer_class IN ('direct', 'search', 'social', 'other', 'unknown'))
);

CREATE INDEX IF NOT EXISTS qr_scan_events_link_time_idx
  ON qr_scan_events (qr_link_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS qr_scan_events_time_idx
  ON qr_scan_events (occurred_at DESC);

COMMENT ON TABLE qr_links IS
  'Persistent first-party redirect definitions. Slugs are immutable after issuance.';
COMMENT ON TABLE qr_scan_events IS
  'Privacy-minimized aggregate input. Do not add raw IP, email, phone, full referrer URL, or full user-agent fields.';

COMMIT;
