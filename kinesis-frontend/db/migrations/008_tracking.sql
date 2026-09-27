-- 008: shipment tracking + guest order lookup
-- tracking_code/carrier are entered by the shop when an order ships.
-- lookup_token is a random secret generated at order creation and sent in
-- the order email, so guests can view/cancel their own order without login.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_code TEXT NOT NULL DEFAULT '';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS carrier TEXT NOT NULL DEFAULT '';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS lookup_token TEXT NOT NULL DEFAULT '';

CREATE UNIQUE INDEX IF NOT EXISTS orders_lookup_idx ON orders (lookup_token) WHERE lookup_token <> '';
