import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { isDbError } from "@/lib/db";
import { createOrder, type CreateOrderInput } from "@/lib/shop-orders";
import { notifyOrder } from "@/lib/email";
import { buildPaymentUrl, vnpayConfig } from "@/lib/vnpay";

/* POST /api/orders — create order from validated cart, optionally return a VNPay URL. */
export async function POST(request: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  let body: Partial<CreateOrderInput>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }
  try {
    const order = await createOrder(userId, {
      email: String(body.email ?? ""),
      name: String(body.name ?? ""),
      phone: String(body.phone ?? ""),
      address: String(body.address ?? ""),
      province: String(body.province ?? ""),
      note: String(body.note ?? ""),
      payment: body.payment === "cod" ? "cod" : "vnpay",
      items: Array.isArray(body.items) ? body.items : [],
    });
    if (order && body.payment !== "cod") {
      const cfg = vnpayConfig();
      if (!cfg) return Response.json({ ok: true, orderId: order.id, payUrl: null, note: "vnpay_not_configured" });
      const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "127.0.0.1";
      return Response.json({
        ok: true,
        orderId: order.id,
        amountVnd: order.amountVnd,
        payUrl: buildPaymentUrl({ orderId: order.id, amountVnd: order.amountVnd, ip }, cfg),
      });
    }
    await notifyOrder(order.id, "cod_created");
    return Response.json({ ok: true, orderId: order.id, amountVnd: order.amountVnd });
  } catch (err) {
    if (isDbError(err)) {
      return Response.json({ error: "db_unreachable" }, { status: 503 });
    }
    const msg = err instanceof Error ? err.message : "unknown_error";
    const known = ["empty_cart", "invalid_qty", "invalid_payment", "invalid_customer_info"];
    const status = known.includes(msg) || /^(unknown_product|sold_out|insufficient_stock):/.test(msg) ? 400 : 500;
    return Response.json({ error: msg }, { status });
  }
}
