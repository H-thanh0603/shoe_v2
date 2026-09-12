import { withDb } from "./db";
import type { AuditEntry } from "./audit";

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