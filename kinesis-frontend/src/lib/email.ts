import { getOrder } from "@/lib/shop-orders";
import { transferMemo } from "@/lib/vietqr";

/* ============================================================
   Order emails via Resend (REST, no SDK).
   - No-op when RESEND_API_KEY is missing (local dev).
   - Never throws: email must not break checkout/payment flows.
   ============================================================ */

export type OrderMailKind = "cod_created" | "vnpay_paid" | "shipped" | "vietqr_created";

/* Absolute base for links inside mail; set SITE_URL in production. */
const siteUrl = () => (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");

export interface MailItem {
  name: string;
  size: string;
  color: string;
  qty: number;
  price_vnd: number;
}

const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const vnd = (n: number) => `${Number(n).toLocaleString("vi-VN")} VNĐ`;

export function buildOrderMailBody(
  kind: OrderMailKind,
  orderId: string,
  name: string,
  items: MailItem[],
  amountVnd: number,
  shipping?: { feeVnd: number; eta: string },
  opts?: { trackUrl?: string; tracking?: { code: string; carrier: string }; memo?: string },
): string {
  const rows = items
    .map(
      (it) =>
        `<tr><td style="padding:8px;border-bottom:1px solid #eee">${esc(it.name)} · EU ${esc(it.size)} · ${esc(it.color)} × ${it.qty}</td>` +
        `<td align="right" style="padding:8px;border-bottom:1px solid #eee">${vnd(it.price_vnd * it.qty)}</td></tr>`,
    )
    .join("");
  const head =
    kind === "cod_created"
      ? `<p>Chào ${esc(name)},</p><p>Cảm ơn bạn đã đặt hàng <b>KINESIS / ATELIER</b>. Đơn hàng của bạn (thanh toán khi nhận hàng):</p>`
      : kind === "shipped"
        ? `<p>Chào ${esc(name)},</p><p>Đơn hàng <b>${esc(orderId)}</b> đã được giao cho đơn vị vận chuyển:</p>`
        : kind === "vietqr_created"
          ? `<p>Chào ${esc(name)},</p><p>Cảm ơn bạn đã đặt hàng <b>KINESIS / ATELIER</b>. Đơn của bạn chọn thanh toán chuyển khoản. Vui lòng chuyển <b>${vnd(amountVnd)}</b> với nội dung: <b>${esc(opts?.memo ?? "")}</b> — shop giữ hàng 24h chờ xác nhận giao dịch.</p>`
          : `<p>Chào ${esc(name)},</p><p>Thanh toán VNPay cho đơn hàng <b>${esc(orderId)}</b> đã thành công. Chúng tôi đang chuẩn bị hàng:</p>`;
  const trackLine = opts?.tracking?.code
    ? `<p style="margin:4px 0">Vận đơn: <b>${esc(opts.tracking.code)}</b>${opts.tracking.carrier ? ` · ${esc(opts.tracking.carrier)}` : ""}</p>`
    : "";
  const linkLine = opts?.trackUrl
    ? `<p style="margin:8px 0"><a href="${esc(opts.trackUrl)}">Theo dõi trạng thái đơn hàng</a> — lưu lại đường dẫn này; bạn cũng có thể hủy đơn khi còn chờ thanh toán.</p>`
    : "";
  return `<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#111">
<h2 style="letter-spacing:2px">KINESIS / ATELIER</h2>${head}
<p>Mã đơn: <b>${esc(orderId)}</b></p>
<table style="width:100%;border-collapse:collapse">${rows}</table>
${
  shipping && shipping.feeVnd > 0
    ? `<p style="margin:4px 0">Vận chuyển: <b>${vnd(shipping.feeVnd)}</b>${shipping.eta ? ` · Dự kiến giao: ${esc(shipping.eta)}` : ""}</p>`
    : `<p style="margin:4px 0">Vận chuyển: <b>Miễn phí</b>${shipping?.eta ? ` · Dự kiến giao: ${esc(shipping.eta)}` : ""}</p>`
}
<p style="font-size:18px"><b>Tổng: ${vnd(amountVnd)}</b></p>
${trackLine}${linkLine}
<p style="color:#666;font-size:13px">Đổi size trong 14 ngày · Hỗ trợ: reply email này.</p></div>`;
}

/* Fetch the order and send the mail. Returns false when skipped/failed. */
export async function notifyOrder(orderId: string, kind: OrderMailKind): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.ORDER_FROM_EMAIL;
  if (!key || !from) return false;
  let order: Awaited<ReturnType<typeof getOrder>>;
  try {
    order = await getOrder(orderId);
  } catch {
    return false;
  }
  if (!order || !order.email) return false;
  const subject =
    kind === "cod_created"
      ? `[KINESIS] Đã nhận đơn ${orderId}`
      : kind === "shipped"
        ? `[KINESIS] Đơn ${orderId} đã gửi đi`
        : kind === "vietqr_created"
          ? `[KINESIS] Hướng dẫn chuyển khoản đơn ${orderId}`
          : `[KINESIS] Thanh toán thành công ${orderId}`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [order.email],
        subject,
        html: buildOrderMailBody(kind, orderId, order.name, order.items as MailItem[], order.amount_vnd, {
          feeVnd: Number(order.shipping_fee_vnd ?? 0),
          eta: String(order.eta_days ?? ""),
        }, {
          trackUrl: order.lookup_token ? `${siteUrl()}/track?order=${encodeURIComponent(orderId)}&token=${encodeURIComponent(String(order.lookup_token))}` : undefined,
          tracking: order.tracking_code ? { code: String(order.tracking_code), carrier: String(order.carrier ?? "") } : undefined,
          memo: transferMemo(orderId),
        }),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
