import type { NextRequest } from "next/server";
import { clientKey } from "@/lib/checkpoint";
import { rateLimitDb } from "@/lib/rate-limit-db";
import { joinWaitlist } from "@/lib/shop-products";

/* POST /api/waitlist {email, slug?} — restock notifications (4.2). */
export async function POST(request: NextRequest) {
  if (!(await rateLimitDb(`waitlist:${clientKey(request)}`, 10, 10 * 60 * 1000))) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }
  const body = (await request.json().catch(() => null)) as { email?: unknown; slug?: unknown } | null;
  const res = await joinWaitlist(String(body?.email ?? ""), String(body?.slug ?? ""));
  if (res === "invalid") return Response.json({ ok: false, error: "invalid_email" }, { status: 400 });
  if (res === "db_unreachable") return Response.json({ ok: false, error: "db_unreachable" }, { status: 503 });
  return Response.json({ ok: true });
}
