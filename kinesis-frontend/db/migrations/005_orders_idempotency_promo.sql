-- ============================================================
-- KINESIS / ATELIER — migration 005 (order idempotency + promo)
-- Run: psql "$DATABASE_URL" -f db/migrations/005_orders_idempotency_promo.sql
-- ============================================================

-- Client-generated UUID per checkout attempt. Double-click / retry with
-- the same key returns the existing order instead of reserving stock twice.
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS idempotency_key TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS orders_idempotency_idx
  ON orders (idempotency_key) WHERE idempotency_key IS NOT NULL;

-- Promo actually granted at order time (was UI-only before).
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS promo_code TEXT,
  ADD COLUMN IF NOT EXISTS discount_vnd INTEGER NOT NULL DEFAULT 0
    CHECK (discount_vnd >= 0);
