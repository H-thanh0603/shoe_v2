import { withDb } from "./db";
import { rateLimit as memRateLimit } from "./checkpoint";

/* ============================================================
   SHARED RATE LIMIT — Postgres sliding window.
   The in-memory limiter in @/lib/checkpoint is per-process: on
   serverless each instance counts alone, so a flood spread across
   instances passes. This limiter counts in one shared table, so it
   holds across instances. Falls back to the in-memory limiter when
   the DB is unreachable (fail-open for availability; money paths
   still fail closed on their own DB errors elsewhere).

   SERVER-ONLY — never import from client components.
   ============================================================ */

export async function rateLimitDb(key: string, limit: number, windowMs: number): Promise<boolean> {
  const allowed = await withDb(async (c) => {
    await c.query(`INSERT INTO rate_hits (bucket) VALUES ($1)`, [key]);
    const r = await c.query<{ n: string }>(
      `SELECT count(*)::text AS n FROM rate_hits
        WHERE bucket = $1 AND ts > now() - make_interval(secs => $2)`,
      [key, windowMs / 1000],
    );
    return Number(r.rows[0]?.n ?? 0) <= limit;
  });
  if (allowed === null) return memRateLimit(key, limit, windowMs);
  return allowed;
}

/* Retention for the daily cron alongside audit pruning. */
export async function pruneRateHits(): Promise<number> {
  const r = await withDb(async (c) => {
    const d = await c.query(`DELETE FROM rate_hits WHERE ts < now() - interval '2 hours'`);
    return d.rowCount ?? 0;
  });
  return r ?? 0;
}
