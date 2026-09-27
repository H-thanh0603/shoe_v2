import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { clientKey } from "@/lib/checkpoint";
import { rateLimitDb } from "@/lib/rate-limit-db";
import { cancelOrder, getOrderForLookup } from "@/lib/shop-orders";

/* GET /api/orders/track?order=…&token=… — status for an order link sent by
   email. The token is the credential; guests and members use the same path.
   Rate-limited per IP so links can't be brute-forced alongside the
   96-bit token entropy. */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const orderId = url.searchParams.get("order")?.trim() ?? "";
  const token = url.searchParams.get("token")?.trim() ?? "";
  if (!orderId || orderId.length > 64) return Response.json({ error: "invalid_order" }, { status: 400 });
  if (!(await rateLimitDb(`track:${clientKey(request)}`, 30, 10 * 60 * 1000))) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }
  const order = await getOrderForLookup(orderId, token);
  if (!order) return Response.json({ error: "not_found" }, { status: 404 });
  return Response.json({ order });
}

/* POST /api/orders/track {order, token} — cancel while still pending.
   Authorized by the token, or by the signed-in owner even without it. */
export async function POST(request: NextRequest) {
  const session = await auth();
  const body = (await request.json().catch(() => null)) as { order?: string; token?: string } | null;
  const orderId = body?.order?.trim() ?? "";
  if (!orderId || orderId.length > 64) return Response.json({ error: "invalid_order" }, { status: 400 });
  if (!(await rateLimitDb(`trackcancel:${clientKey(request)}`, 10, 10 * 60 * 1000))) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }
  const ok = await cancelOrder(orderId, { userId: session?.user?.id ?? null, token: body?.token ?? null });
  if (!ok) return Response.json({ ok: false, error: "cannot_cancel" }, { status: 409 });
  return Response.json({ ok: true });
}
