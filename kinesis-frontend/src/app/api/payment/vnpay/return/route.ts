import type { NextRequest } from "next/server";
import { vnpayVerify } from "@/lib/vnpay";
import { getOrderAmount, markPaid } from "@/lib/shop-orders";

/* GET /api/payment/vnpay/return — browser redirect back from VNPay.
   Verify HMAC + amount, then redirect the user to the result page. */
export async function GET(request: NextRequest) {
  const params: Record<string, string> = {};
  new URL(request.url).searchParams.forEach((v, k) => {
    params[k] = v;
  });
  const orderId = params.vnp_TxnRef ?? "";
  const responseCode = params.vnp_ResponseCode ?? "";
  const amountVnd = Math.round(Number(params.vnp_Amount ?? 0) / 100);

  const fail = (reason: string) =>
    Response.redirect(new URL(`/checkout/result?order=${orderId}&status=${reason}${params.vnp_ResponseCode ? `&code=${params.vnp_ResponseCode}` : ""}`, request.url), 302);

  if (!vnpayVerify(params) || !orderId) return fail("invalid");

  const expected = await getOrderAmount(orderId);
  if (expected === null || expected !== amountVnd) return fail("invalid");

  if (responseCode === "00") {
    await markPaid(orderId, params.vnp_TransactionNo ?? "");
    return Response.redirect(new URL(`/checkout/result?order=${orderId}&status=success`, request.url), 302);
  }
  return fail("failed");
}
