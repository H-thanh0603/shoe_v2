import type { NextRequest } from "next/server";
import { clientKey } from "@/lib/checkpoint";
import { rateLimitDb } from "@/lib/rate-limit-db";
import { addReviewForOrder } from "@/lib/shop-products";

/* POST /api/reviews {order, token, rating, body} — one review per DELIVERED
   order (4.3). Authorization is the emailed lookup token, same as /track. */
export async function POST(request: NextRequest) {
  if (!(await rateLimitDb(`review:${clientKey(request)}`, 10, 10 * 60 * 1000))) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }
  const body = (await request.json().catch(() => null)) as {
    order?: string;
    token?: string;
    rating?: number;
    body?: string;
  } | null;
  const orderId = body?.order?.trim() ?? "";
  if (!orderId || orderId.length > 64) return Response.json({ ok: false, error: "invalid_order" }, { status: 400 });
  const res = await addReviewForOrder(orderId, body?.token ?? "", Number(body?.rating), String(body?.body ?? ""));
  if (res === "ok") return Response.json({ ok: true });
  const vi: Record<string, string> = {
    not_found: "Không tìm thấy đơn hàng với đường dẫn này.",
    not_delivered: "Chỉ đánh giá được đơn đã giao thành công.",
    already: "Đơn này đã được đánh giá rồi.",
    invalid: "Đánh giá không hợp lệ.",
    db_unreachable: "Lỗi hệ thống — thử lại sau.",
  };
  return Response.json({ ok: false, error: res, message: vi[res] }, { status: res === "db_unreachable" ? 503 : 400 });
}
