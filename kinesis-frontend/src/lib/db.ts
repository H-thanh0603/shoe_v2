import { Pool, type PoolClient } from "pg";

/* ============================================================
   DB POOL — lazy singleton over DATABASE_URL.
   If the DB is unreachable the agent layer still works via
   in-memory fallbacks in @/lib/audit and @/lib/checkpoint,
   so the dev experience never hard-fails.

   SERVER-ONLY — never import from client components.
   ============================================================ */

let pool: Pool | null = null;
let warned = false;

export function getPool(): Pool | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: url,
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 4_000,
    });
    pool.on("error", () => {
      /* background pool errors → fall back per-query */
    });
  }
  return pool;
}

export function dbWarnOnce(msg: string) {
  if (!warned) {
    warned = true;
    console.warn(`[kinesis-db] ${msg} — using in-memory fallback`);
  }
}

/* Runs fn(client) when the DB is reachable, else null. */
export async function withDb<T>(fn: (c: PoolClient) => Promise<T>): Promise<T | null> {
  const p = getPool();
  if (!p) return null;
  let client: PoolClient | null = null;
  try {
    client = await p.connect();
    return await fn(client);
  } catch (err) {
    dbWarnOnce(err instanceof Error ? err.message : String(err));
    return null;
  } finally {
    client?.release();
  }
}