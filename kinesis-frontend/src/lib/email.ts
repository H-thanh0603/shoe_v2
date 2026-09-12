import { getOrder } from "@/lib/shop-orders";

/* ============================================================
   Order emails via Resend (REST, no SDK).
   - No-op when RESEND_API_KEY is missing (local dev).
   - Never throws: email must not break checkout/payment flows.
   ============================================================ */

export type OrderMailKind = "cod_created" | "vnpay_paid";

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

export function buildOrderMailBody(kind: OrderMailKind, orderId: string, name: string, items: MailItem[], amountVnd: number): string {
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
      : `<p>Chào ${esc(name)},</p><p>Thanh toán VNPay cho đơn hàng <b>${esc(orderId)}</b> đã thành công. Chúng tôi đang chuẩn bị hàng:</p>`;
  return `<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#111">
<h2 style="letter-spacing:2px">KINESIS / ATELIER</h2>${head}
<p>Mã đơn: <b>${esc(orderId)}</b></p>
<table style="width:100%;border-collapse:collapse">${rows}</table>
<p style="font-size:18px"><b>Tổng: ${vnd(amountVnd)}</b></p>
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
    kind === "cod_created" ? `[KINESIS] Đã nhận đơn ${orderId}` : `[KINESIS] Thanh toán thành công ${orderId}`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [order.email],
        subject,
        html: buildOrderMailBody(kind, orderId, order.name, order.items as MailItem[], order.amount_vnd),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
