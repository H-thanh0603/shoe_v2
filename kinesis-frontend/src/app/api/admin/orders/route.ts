import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { listAllOrders, setOrderStatus } from "@/lib/shop-orders";

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

/* PATCH /api/admin/orders — update status {orderId, status}. */
export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "admin") return Response.json({ error: "forbidden" }, { status: 403 });
  const body = (await request.json().catch(() => null)) as { orderId?: string; status?: string } | null;
  if (!body?.orderId || !body.status) return Response.json({ error: "missing_fields" }, { status: 400 });
  const ok = await setOrderStatus(body.orderId, body.status);
  return Response.json({ ok }, { status: ok ? 200 : 404 });
}
