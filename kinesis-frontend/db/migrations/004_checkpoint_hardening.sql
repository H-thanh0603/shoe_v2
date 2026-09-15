-- ============================================================
-- KINESIS / ATELIER — migration 004 (checkpoint hardening)
-- Run: psql "$DATABASE_URL" -f db/migrations/004_checkpoint_hardening.sql
-- ============================================================

-- Who consumed the checkpoint (session user id / email). NULL = legacy.
ALTER TABLE agent_checkpoints
  ADD COLUMN IF NOT EXISTS decided_by TEXT;

-- Audit trail retention: keep 90 days of tool calls, checkpoints, audit.
-- Run from cron alongside /api/admin/sweep, or schedule separately.
-- DELETE FROM agent_audit WHERE ts < now() - interval '90 days';
-- DELETE FROM agent_checkpoints WHERE created_at < now() - interval '90 days'
--   AND status <> 'pending';
