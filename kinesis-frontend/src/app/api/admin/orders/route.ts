import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { notifyOrder } from "@/lib/email";
import { listAllOrders, setOrderStatus, setOrderTracking } from "@/lib/shop-orders";

/* GET /api/admin/orders?offset=0&limit=50 — list orders (admin only). */
export async function GET(request: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "admin") return Response.json({ error: "forbidden" }, { status: 403 });
  const url = new URL(request.url);
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") ?? 50)));
  const offset = Math.max(0, Number(url.searchParams.get("offset") ?? 0));
  const { rows, total } = await listAllOrders(limit, offset);
  return Response.json({ orders: rows, total, limit, offset });
}

/* PATCH /api/admin/orders — update status {orderId, status} and/or attach a
   shipment {orderId, trackingCode, carrier}. Moving to "shipped" emails the
   buyer the tracking link. */
export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "admin") return Response.json({ error: "forbidden" }, { status: 403 });
  const body = (await request.json().catch(() => null)) as {
    orderId?: string;
    status?: string;
    trackingCode?: string;
    carrier?: string;
  } | null;
  if (!body?.orderId) return Response.json({ error: "missing_fields" }, { status: 400 });
  if (body.trackingCode) {
    if (!(await setOrderTracking(body.orderId, body.trackingCode, body.carrier ?? ""))) {
      return Response.json({ ok: false, error: "invalid_or_unknown_tracking" }, { status: 400 });
    }
  }
  if (body.status) {
    const ok = await setOrderStatus(body.orderId, body.status);
    if (!ok) return Response.json({ ok: false }, { status: 404 });
    if (body.status === "shipped" && body.trackingCode) void notifyOrder(body.orderId, "shipped");
    return Response.json({ ok: true });
  }
  return Response.json({ ok: true });
}
