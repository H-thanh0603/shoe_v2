-- ============================================================
-- KINESIS / ATELIER — migration 002 (commerce: users, products, orders)
-- Run: psql "$DATABASE_URL" -f db/migrations/002_commerce.sql
-- ============================================================

-- ---------- users : Google OAuth ----------
CREATE TABLE IF NOT EXISTS users (
  id           TEXT PRIMARY KEY,          -- google sub
  email        TEXT NOT NULL UNIQUE,
  name         TEXT NOT NULL DEFAULT '',
  image        TEXT,
  role         TEXT NOT NULL DEFAULT 'user', -- user | admin
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- products ----------
CREATE TABLE IF NOT EXISTS products (
  slug         TEXT PRIMARY KEY,
  sku          TEXT NOT NULL,
  name         TEXT NOT NULL,
  series       TEXT NOT NULL DEFAULT '',
  price_vnd    INTEGER NOT NULL,          -- VND, no decimals
  category     TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'LIVE', -- LIVE | UPCOMING | SOLD OUT
  edition      TEXT NOT NULL DEFAULT '',
  description  TEXT NOT NULL DEFAULT '',
  materials    TEXT[] NOT NULL DEFAULT '{}',
  image        TEXT NOT NULL,
  colors       TEXT[] NOT NULL DEFAULT '{}',
  sizes        TEXT[] NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- product_stock : per slug+size ----------
CREATE TABLE IF NOT EXISTS product_stock (
  slug         TEXT NOT NULL REFERENCES products (slug) ON DELETE CASCADE,
  size         TEXT NOT NULL,
  qty          INTEGER NOT NULL DEFAULT 0 CHECK (qty >= 0),
  PRIMARY KEY (slug, size)
);

-- ---------- orders ----------
CREATE TABLE IF NOT EXISTS orders (
  id           TEXT PRIMARY KEY,           -- KNS-ORD-<random>
  user_id      TEXT REFERENCES users (id),
  email        TEXT NOT NULL,
  name         TEXT NOT NULL,
  phone        TEXT NOT NULL,
  address      TEXT NOT NULL,
  province     TEXT NOT NULL DEFAULT '',
  note         TEXT NOT NULL DEFAULT '',
  amount_vnd   INTEGER NOT NULL CHECK (amount_vnd >= 0),
  status       TEXT NOT NULL DEFAULT 'pending', -- pending | paid | confirmed | shipped | delivered | cancelled | failed
  payment      TEXT NOT NULL DEFAULT 'vnpay',    -- vnpay | cod
  payment_ref  TEXT,                      -- vnp_TxnRef
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at      TIMESTAMPTZ,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_user_idx ON orders (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders (status, created_at DESC);

-- ---------- order_items ----------
CREATE TABLE IF NOT EXISTS order_items (
  id           BIGSERIAL PRIMARY KEY,
  order_id     TEXT NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  slug         TEXT NOT NULL,
  sku          TEXT NOT NULL,
  name         TEXT NOT NULL,
  size         TEXT NOT NULL,
  color        TEXT NOT NULL DEFAULT '',
  qty          INTEGER NOT NULL CHECK (qty > 0),
  price_vnd    INTEGER NOT NULL CHECK (price_vnd >= 0)
);

CREATE INDEX IF NOT EXISTS order_items_order_idx ON order_items (order_id);
