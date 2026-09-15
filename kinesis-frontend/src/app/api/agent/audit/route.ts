import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { sweepExpired, listCheckpoints } from "@/lib/checkpoint-db";
import { recentAuditDb } from "@/lib/audit-db";

/* GET /api/agent/audit — server-side trail of every tool call.
   Verifiability: agents act, servers log, humans replay (Postgres-backed).
   Admin only: the trail exposes operational data (traffic, timing, errors)
   that must not be public to crawlers. The /agent console calls this with
   the operator's own admin session. */
export async function GET(request: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }
  const url = new URL(request.url);
  const limitParam = Number(url.searchParams.get("limit") ?? "60");
  const limit = Math.min(Math.max(Number.isFinite(limitParam) ? limitParam : 60, 1), 200);

  const expired = await sweepExpired();
  const [entries, checkpoints] = await Promise.all([
    recentAuditDb(limit),
    listCheckpoints(30),
  ]);

  return Response.json({
    tool: "getAuditTrail",
    source: "postgres",
    total: entries.length,
    swept_expired: expired,
    policy: "Postgres append-only (agent_audit) — production-grade verifiability",
    entries,
    open_checkpoints: checkpoints,
  });
}