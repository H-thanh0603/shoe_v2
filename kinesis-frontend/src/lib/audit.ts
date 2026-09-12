/* ============================================================
   AGENT AUDIT TRAIL — server-side record of every tool call.
   Verifiability is part of the WebMCP trust model (W3C security
   review, 2026): agents act, servers log, humans can replay.

   In-memory ring buffer (demo); swap for Postgres in production.
   SERVER-ONLY — exposed read-side via GET /api/agent/audit.
   ============================================================ */

export interface AuditEntry {
  id: number;
  ts: string;
  tool: string;
  method: string;
  status: number | string;
  ms: number;
}

const RING: AuditEntry[] = [];
const MAX = 150;
let seq = 0;

export function record(
  tool: string,
  method: string,
  status: number | string,
  ms: number,
): AuditEntry {
  seq += 1;
  const entry: AuditEntry = {
    id: seq,
    ts: new Date().toISOString(),
    tool,
    method,
    status,
    ms,
  };
  RING.push(entry);
  if (RING.length > MAX) RING.splice(0, RING.length - MAX);
  return entry;
}

export function recentAudit(count = 60): AuditEntry[] {
  return RING.slice(-count).reverse();
}