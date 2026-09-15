import { getPool } from "@/lib/db";

/* GET /api/health — liveness + DB reachability for uptime monitors.
   200 healthy, 503 when the DB is unreachable. No auth (status only). */
export async function GET() {
  const pool = getPool();
  if (!pool) {
    return Response.json({ ok: false, db: "unconfigured" }, { status: 503 });
  }
  try {
    const client = await pool.connect();
    try {
      await client.query("SELECT 1");
    } finally {
      client.release();
    }
    return Response.json({ ok: true, db: "up" });
  } catch {
    return Response.json({ ok: false, db: "down" }, { status: 503 });
  }
}
