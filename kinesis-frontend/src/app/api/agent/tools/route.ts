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
      approval: "DB-backed checkpoints (agent_checkpoints) + one-time HMAC-signed tokens, 5-minute TTL",
      csrf: "cross-origin POSTs rejected (Origin check)",
      rate_limit: "consequential tools: 12 req/min per client",
      provenance: "every response carries a provenance trail",
      audit: "every tool call is recorded in Postgres agent_audit (/api/agent/audit)",
      orders: "approved orders persisted to Postgres agent_orders",
    },
    tools: AGENT_TOOLS,
  });
}