-- 007: shipping fee stored per order
-- Fee + ETA are computed server-side at order creation (src/lib/shipping.ts)
-- and persisted so receipts/emails never disagree with the charged amount.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_fee_vnd INTEGER NOT NULL DEFAULT 0 CHECK (shipping_fee_vnd >= 0);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS eta_days TEXT NOT NULL DEFAULT '';
