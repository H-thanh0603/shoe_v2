-- ============================================================
-- KINESIS / ATELIER — database migration 001 (audit + checkpoints)
-- Applies cleanly on an empty Postgres 18 database.
-- Run:  psql "$DATABASE_URL" -f db/migrations/001_agent.sql
-- ============================================================

-- ---------- agent_audit : every tool call, append-only ----------
CREATE TABLE IF NOT EXISTS agent_audit (
  id          BIGSERIAL PRIMARY KEY,
  ts          TIMESTAMPTZ NOT NULL DEFAULT now(),
  tool        TEXT NOT NULL,             -- e.g. searchShoes, createOrder
  method      TEXT NOT NULL DEFAULT 'GET',
  status      TEXT NOT NULL,             -- e.g. 200, 202, 402, 403
  ms          INTEGER NOT NULL DEFAULT 0,
  actor       TEXT NOT NULL DEFAULT 'anonymous'
);

CREATE INDEX IF NOT EXISTS agent_audit_ts_idx ON agent_audit (ts DESC);
CREATE INDEX IF NOT EXISTS agent_audit_tool_idx ON agent_audit (tool);

-- ---------- agent_checkpoints : signed human approvals ----------
-- status: pending -> approved | expired | denied
CREATE TABLE IF NOT EXISTS agent_checkpoints (
  id            TEXT PRIMARY KEY,        -- e.g. CHK-MTX7ABC
  action        TEXT NOT NULL,           -- add_to_cart | create_order
  amount        INTEGER NOT NULL,
  currency      TEXT NOT NULL DEFAULT 'USD',
  item          JSONB,
  status        TEXT NOT NULL DEFAULT 'pending',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at    TIMESTAMPTZ NOT NULL,
  decided_at    TIMESTAMPTZ,
  actor         TEXT NOT NULL DEFAULT 'agent'
);

CREATE INDEX IF NOT EXISTS agent_checkpoints_status_idx ON agent_checkpoints (status, expires_at);

-- ---------- agent_orders : minted orders ----------
CREATE TABLE IF NOT EXISTS agent_orders (
  order_id      TEXT PRIMARY KEY,        -- e.g. ORD-704499-42
  checkpoint_id TEXT REFERENCES agent_checkpoints (id),
  tx_ref        TEXT NOT NULL,
  slug          TEXT NOT NULL,
  sku           TEXT NOT NULL,
  name          TEXT NOT NULL,
  size          TEXT NOT NULL,
  qty           INTEGER NOT NULL DEFAULT 1,
  amount        INTEGER NOT NULL,
  currency      TEXT NOT NULL DEFAULT 'USD',
  passport_hash TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
