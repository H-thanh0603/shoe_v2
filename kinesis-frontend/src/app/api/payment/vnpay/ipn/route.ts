import type { NextRequest } from "next/server";
import { vnpayVerify } from "@/lib/vnpay";
import { getOrderAmount, markPaid, setOrderStatus } from "@/lib/shop-orders";

/* GET /api/payment/vnpay/ipn — server-to-server confirmation from VNPay.
   Must always answer 200 with vnp_SecureHash; idempotent.
   RspCode per VNPay spec: 00 success, 97 invalid signature, 01 order not found,
   04 wrong amount, 02 already confirmed. */
export async function GET(request: NextRequest) {
  const params: Record<string, string> = {};
  new URL(request.url).searchParams.forEach((v, k) => {
    params[k] = v;
  });
  const orderId = params.vnp_TxnRef ?? "";
  const amountVnd = Math.round(Number(params.vnp_Amount ?? 0) / 100);

  if (!vnpayVerify(params) || !orderId) {
    return Response.json({ RspCode: "97", Message: "Invalid signature" });
  }

  const expected = await getOrderAmount(orderId);
  if (expected === null) {
    return Response.json({ RspCode: "01", Message: "Order not found" });
  }
  if (expected !== amountVnd) {
    return Response.json({ RspCode: "04", Message: "Amount invalid" });
  }

  if (params.vnp_ResponseCode === "00") {
    const ok = await markPaid(orderId, params.vnp_TransactionNo ?? "");
    return Response.json({ RspCode: "00", Message: ok ? "Confirm success" : "Order already confirmed" });
  }
  await setOrderStatus(orderId, "failed");
  return Response.json({ RspCode: "00", Message: "Confirm success" });
}
