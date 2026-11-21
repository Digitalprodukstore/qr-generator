'use strict';

const crypto = require('node:crypto');

const MAX_DESTINATION_LENGTH = 2048;
const MAX_TITLE_LENGTH = 120;
const SLUG_PATTERN = /^[A-Za-z0-9_-]{22,64}$/;

function isValidSlug(value) {
  return typeof value === 'string' && SLUG_PATTERN.test(value);
}

function createSlug() {
  // 16 random bytes = 128 bits of entropy; base64url is QR/path friendly.
  return crypto.randomBytes(16).toString('base64url');
}

function validateDestinationUrl(value) {
  if (typeof value !== 'string') return { valid: false, error: 'destination_url_required' };
  const raw = value.trim();
  if (!raw || raw.length > MAX_DESTINATION_LENGTH) {
    return { valid: false, error: 'destination_url_length' };
  }
  // Reject control characters, whitespace, and backslashes before URL parsing.
  if (/[\u0000-\u0020\u007f\\]/.test(raw)) {
    return { valid: false, error: 'destination_url_characters' };
  }
  if (!/^https?:\/\//i.test(raw)) {
    return { valid: false, error: 'destination_url_scheme' };
  }
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { valid: false, error: 'destination_url_scheme' };
    }
    if (!parsed.hostname || parsed.username || parsed.password) {
      return { valid: false, error: 'destination_url_authority' };
    }
    return { valid: true, value: parsed.href };
  } catch {
    return { valid: false, error: 'destination_url_invalid' };
  }
}

function normalizeLinkInput(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { valid: false, error: 'body_invalid' };
  }
  const destination = validateDestinationUrl(input.destinationUrl);
  if (!destination.valid) return destination;

  let title = null;
  if (input.title !== undefined && input.title !== null && input.title !== '') {
    if (typeof input.title !== 'string' || input.title.trim().length > MAX_TITLE_LENGTH) {
      return { valid: false, error: 'title_invalid' };
    }
    title = input.title.trim();
  }

  let expiresAt = null;
  if (input.expiresAt !== undefined && input.expiresAt !== null && input.expiresAt !== '') {
    if (typeof input.expiresAt !== 'string') return { valid: false, error: 'expires_at_invalid' };
    const timestamp = Date.parse(input.expiresAt);
    if (!Number.isFinite(timestamp) || timestamp <= Date.now()) {
      return { valid: false, error: 'expires_at_invalid' };
    }
    expiresAt = new Date(timestamp).toISOString();
  }

  return {
    valid: true,
    value: {
      destinationUrl: destination.value,
      title,
      expiresAt
    }
  };
}

module.exports = {
  MAX_DESTINATION_LENGTH,
  MAX_TITLE_LENGTH,
  isValidSlug,
  createSlug,
  validateDestinationUrl,
  normalizeLinkInput
};
