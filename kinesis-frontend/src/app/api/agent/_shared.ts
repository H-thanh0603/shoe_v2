import type { NextRequest } from "next/server";
import { isSameOrigin, rateLimit, clientKey } from "@/lib/checkpoint";
import { recordAudit } from "@/lib/audit-db";

/* Shared guard for consequential agent tools.
   Returns a 403/429 Response when the request must be refused, else null. */
export function guardConsequential(request: NextRequest): Response | null {
  if (!isSameOrigin(request)) {
    return Response.json({ error: "cross_origin_forbidden" }, { status: 403 });
  }
  if (!rateLimit(clientKey(request))) {
    return Response.json(
      {
        error: "rate_limited",
        retry_after_ms: 60_000,
        note: "consequential tools are rate-limited per client",
      },
      { status: 429 },
    );
  }
  return null;
}

export async function readJsonBody(request: NextRequest): Promise<Record<string, unknown> | null> {
  try {
    const body: unknown = await request.json();
    return ((body ?? {}) as Record<string, unknown>) ?? null;
  } catch {
    return null;
  }
}

export { recordAudit };