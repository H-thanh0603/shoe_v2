import type { NextRequest } from "next/server";
import { vnpayVerify } from "@/lib/vnpay";
import { markPaid } from "@/lib/shop-orders";

/* GET /api/payment/vnpay/return — browser redirect back from VNPay.
   Verify HMAC, then redirect the user to the result page. */
export async function GET(request: NextRequest) {
  const params: Record<string, string> = {};
  new URL(request.url).searchParams.forEach((v, k) => {
    params[k] = v;
  });
  const orderId = params.vnp_TxnRef ?? "";
  const responseCode = params.vnp_ResponseCode ?? "";

  if (!vnpayVerify(params) || !orderId) {
    return Response.redirect(new URL(`/checkout/result?order=${orderId}&status=invalid`, request.url), 302);
  }
  if (responseCode === "00") {
    await markPaid(orderId, params.vnp_TransactionNo ?? "");
    return Response.redirect(new URL(`/checkout/result?order=${orderId}&status=success`, request.url), 302);
  }
  return Response.redirect(new URL(`/checkout/result?order=${orderId}&status=failed&code=${responseCode}`, request.url), 302);
}
