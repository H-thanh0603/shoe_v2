import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { listAllOrders, setOrderStatus } from "@/lib/shop-orders";

/* GET /api/admin/orders — list orders (admin only). */
export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "admin") return Response.json({ error: "forbidden" }, { status: 403 });
  const orders = await listAllOrders(200);
  return Response.json({ orders });
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
