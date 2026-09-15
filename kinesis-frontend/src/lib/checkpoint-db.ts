import { withDb } from "./db";
import { issueApprovalToken as issueStateless, verifyApprovalToken as verifyStateless } from "./checkpoint";

/* ============================================================
   APPROVAL CHECKPOINTS — DB lifecycle with stateless fallback.
     issue(action, amount, item)   → { id, token }  (status: pending)
     approve(id, token, ...)       → OK | forged | expired
     deny(id)                      → marks denied
     checkpointStatus(id)          → pending | approved | denied | expired
     sweepExpired()                → marks overdue rows expired
   The token is HMAC-signed (see @/lib/checkpoint) AND recorded with
   status, so replays/forgeries/expiry are visible in the audit trail.

   SERVER-ONLY — never import from client components.
   ============================================================ */

export const CHECKPOINT_TTL_S = 300;

export interface DbCheckpoint {
  id: string;
  action: string;
  amount: number;
  currency: string;
  status: "pending" | "approved" | "denied" | "expired";
  created_at: string;
  expires_at: string;
  decided_at: string | null;
}

const rid = () => `CHK-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 36).toString(36).toUpperCase()}`;

export async function issueCheckpoint(
  action: string,
  amount: number,
  currency: string,
  item: unknown,
): Promise<{ id: string; token: string; expires_in_seconds: number }> {
  const id = rid();
  const token = issueStateless(action, id, amount);
  const inDb = await withDb(async (c) => {
    await c.query(
      `INSERT INTO agent_checkpoints (id, action, amount, currency, item, status, expires_at)
       VALUES ($1, $2, $3, $4, $5::jsonb, 'pending', now() + make_interval(secs => $6))`,
      [id, action, amount, currency, JSON.stringify(item ?? null), CHECKPOINT_TTL_S],
    );
  });
  void inDb; /* stateless token works standalone; DB is the record of truth */
  return { id, token, expires_in_seconds: CHECKPOINT_TTL_S };
}

export async function approveCheckpoint(
  action: string,
  id: string,
  amount: number,
  token: string,
  decidedBy?: string,
): Promise<"OK" | "FORGED" | "EXPIRED" | "UNKNOWN" | "ALREADY" | "DB_DOWN"> {
  if (!verifyStateless(token, action, id, amount)) return "FORGED";
  const verdict = await withDb(async (c) => {
    await sweepExpiredTx(c);
    /* Atomic consume: exactly one concurrent approver wins. Plain
       SELECT-then-UPDATE would let two requests both execute the order. */
    const won = await c.query(
      `UPDATE agent_checkpoints
          SET status='approved', decided_at=now(), decided_by=$2
        WHERE id=$1 AND status='pending' AND expires_at >= now()`,
      [id, decidedBy ?? null],
    );
    if ((won.rowCount ?? 0) > 0) return "OK" as const;
    const cur = await c.query(
      `SELECT status, expires_at FROM agent_checkpoints WHERE id = $1`,
      [id],
    );
    if (cur.rowCount === 0) return "UNKNOWN" as const;
    const row = cur.rows[0] as { status: string; expires_at: string };
    if (row.status === "approved") return "ALREADY" as const;
    if (row.status !== "pending" || new Date(row.expires_at).getTime() < Date.now()) {
      await c.query(
        `UPDATE agent_checkpoints SET status='expired' WHERE id=$1 AND status='pending'`,
        [id],
      );
      return "EXPIRED" as const;
    }
    return "ALREADY" as const;
  });
  /* Fail closed: with the DB unreachable we cannot consume the checkpoint
     exactly once, so a consequential action must NOT execute. */
  return verdict ?? "DB_DOWN";
}

export async function denyCheckpoint(id: string, decidedBy?: string): Promise<void> {
  await withDb(async (c) => {
    await c.query(
      `UPDATE agent_checkpoints SET status='denied', decided_at=now(), decided_by=$2
       WHERE id=$1 AND status='pending'`,
      [id, decidedBy ?? null],
    );
  });
}

export async function checkpointStatus(id: string): Promise<DbCheckpoint | null> {
  return (
    (await withDb(async (c) => {
      await sweepExpiredTx(c);
      const r = await c.query(`SELECT * FROM agent_checkpoints WHERE id=$1`, [id]);
      return (r.rows[0] as DbCheckpoint) ?? null;
    })) ?? null
  );
}

export async function listCheckpoints(limit = 30): Promise<DbCheckpoint[]> {
  return (
    (await withDb(async (c) => {
      const r = await c.query(
        `SELECT * FROM agent_checkpoints ORDER BY created_at DESC LIMIT $1`,
        [Math.min(Math.max(limit, 1), 100)],
      );
      return r.rows as DbCheckpoint[];
    })) ?? []
  );
}

export async function sweepExpired(): Promise<number> {
  return (
    (await withDb(async (c) => sweepExpiredTx(c))) ?? 0
  );
}

async function sweepExpiredTx(c: { query: (t: string, v?: unknown[]) => Promise<{ rowCount: number | null }> }): Promise<number> {
  const r = await c.query(
    `UPDATE agent_checkpoints SET status='expired'
     WHERE status='pending' AND expires_at < now()`,
  );
  return r.rowCount ?? 0;
}

export async function persistOrder(o: {
  order_id: string;
  checkpoint_id: string;
  tx_ref: string;
  slug: string;
  sku: string;
  name: string;
  size: string;
  qty: number;
  amount: number;
  currency: string;
  passport_hash: string | null;
}): Promise<void> {
  await withDb(async (c) => {
    await c.query(
      `INSERT INTO agent_orders
         (order_id, checkpoint_id, tx_ref, slug, sku, name, size, qty, amount, currency, passport_hash)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (order_id) DO NOTHING`,
      [
        o.order_id,
        o.checkpoint_id,
        o.tx_ref,
        o.slug,
        o.sku,
        o.name,
        o.size,
        o.qty,
        o.amount,
        o.currency,
        o.passport_hash,
      ],
    );
  });
}