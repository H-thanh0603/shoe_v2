import { AGENT_TOOLS, AGENT_ORIGIN, AGENT_VERSION } from "@/lib/agent";
import { recordAudit } from "@/lib/audit-db";

/* GET /api/agent/tools — live WebMCP-style tool manifest.
   Discovery entry points: /.well-known/agent-tools.json (static), /llms.txt */
export async function GET() {
  await recordAudit("tools", "GET", 200, 0);
  return Response.json({
    origin: AGENT_ORIGIN,
    version: AGENT_VERSION,
    protocol: "webmcp-draft — W3C Web Machine Learning Community Group incubation (2026)",
    discovery: ["/llms.txt", "/.well-known/agent-tools.json", "/robots.txt", "/api/agent/audit"],
    security_boundary: {
      policy: "page-content-is-not-instruction",
      quarantine: "all tool inputs are inspected before execution (WebMCP-Phalanx style)",
      human_in_the_loop: "REQUIRED for REVERSIBLE and CONSEQUENTIAL tools",
      approval:
        "DB-backed checkpoints (agent_checkpoints) + one-time HMAC-signed tokens, 5-minute TTL. The execute leg additionally requires the human's own login session (Google) — the token alone is not enough, and each checkpoint is consumed exactly once",
      csrf: "cross-origin POSTs rejected (Origin check)",
      rate_limit: "consequential tools: 12 req/min per client (per-process; not a hard cap on serverless)",
      provenance: "every response carries a provenance trail",
      audit: "every tool call is recorded in Postgres agent_audit (/api/agent/audit, 90-day retention)",
      orders: "approved orders persisted to Postgres orders + agent_orders",
      stock: "stock/price are read live from Postgres; static snapshots are fallback only",
    },
    tools: AGENT_TOOLS,
  });
}