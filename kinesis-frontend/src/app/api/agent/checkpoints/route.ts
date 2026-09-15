import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { checkpointStatus, denyCheckpoint } from "@/lib/checkpoint-db";
import { recordAudit } from "@/lib/audit-db";

/* GET /api/agent/checkpoints — live checkpoint board (pending/approved/denied/expired).
   ?id=<CHK>   → one checkpoint detail
   ?sweep=1    → sweep expired now (demo convenience) */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (id) {
    const cp = await checkpointStatus(id);
    if (!cp) return Response.json({ error: "unknown_checkpoint" }, { status: 404 });
    return Response.json({ tool: "getCheckpoint", checkpoint: cp });
  }
  const t0 = Date.now();
  const { listCheckpoints, sweepExpired } = await import("@/lib/checkpoint-db");
  let swept = 0;
  if (url.searchParams.get("sweep") === "1") swept = await sweepExpired();
  const checkpoints = await listCheckpoints(40);
  await recordAudit("getCheckpoints", "GET", 200, Date.now() - t0);
  return Response.json({
    tool: "getCheckpoints",
    source: "postgres",
    total: checkpoints.length,
    swept_expired: swept,
    checkpoints,
  });
}

/* POST /api/agent/checkpoints — human decision OUTSIDE the agent console:
   { id, decision: "approve" | "deny", token? }
   approve still requires the signed token (humans get it from the modal). */
export async function POST(request: NextRequest) {
  const t0 = Date.now();
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }
  const b = (body ?? {}) as Record<string, unknown>;
  const id = typeof b.id === "string" ? b.id : "";
  const decision = typeof b.decision === "string" ? b.decision : "";

  if (!id || (decision !== "approve" && decision !== "deny")) {
    return Response.json(
      { error: "bad_request", usage: "{ id, decision: 'approve' | 'deny', token }" },
      { status: 400 },
    );
  }

  /* Both legs require the human's own login session: checkpoint ids are
     guessable (CHK-<time><char>), so an unauthenticated deny/approve is
     someone else's decision, not the human's. */
  const session = await auth();
  const decider = session?.user?.id || session?.user?.email || undefined;
  if (!decider) {
    return Response.json({ error: "human_login_required" }, { status: 401 });
  }

  if (decision === "deny") {
    await denyCheckpoint(id, decider);
    await recordAudit("decideCheckpoint", "POST", 200, Date.now() - t0);
    return Response.json({ status: "denied", id });
  }

  /* Approve via this route still needs the signed token from the checkpoint. */
  const token = typeof b.token === "string" ? b.token : "";
  const cp = await checkpointStatus(id);
  if (!cp) return Response.json({ error: "unknown_checkpoint" }, { status: 404 });
  const { approveCheckpoint } = await import("@/lib/checkpoint-db");
  const verdict = await approveCheckpoint(cp.action, id, cp.amount, token, decider);
  const status = verdict === "OK" ? 200 : verdict === "DB_DOWN" ? 503 : 403;
  await recordAudit("decideCheckpoint", "POST", status, Date.now() - t0);
  if (verdict !== "OK") {
    return Response.json({ error: "cannot_approve", detail: verdict }, { status });
  }
  return Response.json({ status: "approved", id });
}