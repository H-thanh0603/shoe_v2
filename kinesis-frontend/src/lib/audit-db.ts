import { withDb } from "./db";

export interface AuditEntry {
  id: number;
  ts: string;
  tool: string;
  method: string;
  status: number | string;
  ms: number;
}

/* ============================================================
   AUDIT — Postgres-backed trail with in-memory fallback.
   Every agent tool call is recorded (tool, method, status, ms, actor).
   Read-side: GET /api/agent/audit → recentAudit().

   SERVER-ONLY — never import from client components.
   ============================================================ */

const MEM: AuditEntry[] = [];
const MAX = 150;
let seq = 0;

export async function recordAudit(
  tool: string,
  method: string,
  status: number | string,
  ms: number,
  actor = "anonymous",
): Promise<void> {
  const inDb = await withDb(async (c) => {
    await c.query(
      `INSERT INTO agent_audit (tool, method, status, ms, actor)
       VALUES ($1, $2, $3, $4, $5)`,
      [tool, method, String(status), Math.max(0, Math.round(ms)), actor],
    );
  });
  if (inDb === null) {
    seq += 1;
    MEM.push({
      id: seq,
      ts: new Date().toISOString(),
      tool,
      method,
      status,
      ms: Math.max(0, Math.round(ms)),
    });
    if (MEM.length > MAX) MEM.splice(0, MEM.length - MAX);
  }
}

export async function recentAuditDb(count = 60): Promise<AuditEntry[]> {
  const rows = await withDb(async (c) => {
    const r = await c.query(
      `SELECT id, ts, tool, method, status, ms
       FROM agent_audit ORDER BY id DESC LIMIT $1`,
      [Math.min(Math.max(count, 1), 200)],
    );
    return r.rows as AuditEntry[];
  });
  if (rows !== null) return rows;
  return MEM.slice(-count).reverse();
}

/* Retention for the daily cron: agent_audit grows on every tool call.
   Checkpoints keep 90 days too (decided ones; pending rows are swept live). */
export const AUDIT_RETENTION_DAYS = 90;

export async function pruneAudit(): Promise<{ audit: number; checkpoints: number }> {
  const r = await withDb(async (c) => {
    const a = await c.query(
      `DELETE FROM agent_audit WHERE ts < now() - make_interval(days => $1)`,
      [AUDIT_RETENTION_DAYS],
    );
    const k = await c.query(
      `DELETE FROM agent_checkpoints
        WHERE status <> 'pending'
          AND created_at < now() - make_interval(days => $1)`,
      [AUDIT_RETENTION_DAYS],
    );
    return { audit: a.rowCount ?? 0, checkpoints: k.rowCount ?? 0 };
  });
  return r ?? { audit: 0, checkpoints: 0 };
}