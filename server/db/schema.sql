-- ============================================================
-- Neon Serverless SQL Schema — Reuse Before Return Email System
-- Run this once in your Neon project's SQL editor, OR
-- execute: node server/db/migrate.js
-- ============================================================

-- Email delivery log
-- Tracks every email attempted, sent, skipped, or failed.
CREATE TABLE IF NOT EXISTS email_logs (
  id               SERIAL PRIMARY KEY,
  user_id          TEXT,
  email_type       TEXT        NOT NULL,
  recipient_email  TEXT        NOT NULL,
  status           TEXT        NOT NULL DEFAULT 'pending'
                               CHECK (status IN ('pending', 'sent', 'skipped', 'failed')),
  error_message    TEXT,
  idempotency_key  TEXT        UNIQUE,
  sent_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_logs_user_id    ON email_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_email_type ON email_logs (email_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_status     ON email_logs (status);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at    ON email_logs (sent_at DESC);

-- Email accounts (SMTP configurations stored in DB, not just in .env)
-- Allows multiple sending accounts (e.g., transactional vs. marketing).
CREATE TABLE IF NOT EXISTS email_accounts (
  id             SERIAL PRIMARY KEY,
  label          TEXT        NOT NULL,          -- Human label e.g. "Gmail - Transactional"
  smtp_host      TEXT        NOT NULL,          -- e.g. smtp.gmail.com
  smtp_port      INTEGER     NOT NULL DEFAULT 587,
  smtp_user      TEXT        NOT NULL,          -- Gmail address
  smtp_pass      TEXT        NOT NULL,          -- App password (16-char)
  from_address   TEXT        NOT NULL,          -- e.g. "Reuse Before Return" <noreply@...>
  is_active      BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed the default SMTP account from env vars.
-- This will be filled by the migrate script at runtime.
-- You can also add rows directly in the Neon SQL editor.
