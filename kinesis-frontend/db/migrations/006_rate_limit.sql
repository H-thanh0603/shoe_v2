-- ============================================================
-- KINESIS / ATELIER — migration 006 (shared rate-limit buckets)
-- Run: psql "$DATABASE_URL" -f db/migrations/006_rate_limit.sql
-- ============================================================

-- One row per hit. Short-lived; pruned by cron (older than 2h).
CREATE TABLE IF NOT EXISTS rate_hits (
  id     BIGSERIAL PRIMARY KEY,
  bucket TEXT NOT NULL,  -- e.g. order:ip:1.2.3.4
  ts     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS rate_hits_bucket_ts_idx ON rate_hits (bucket, ts);
