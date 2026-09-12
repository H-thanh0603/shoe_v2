import type { NextRequest } from "next/server";
import { vnpayVerify } from "@/lib/vnpay";
import { markPaid, setOrderStatus } from "@/lib/shop-orders";

/* GET /api/payment/vnpay/ipn — server-to-server confirmation from VNPay.
   Must always answer 200 with vnp_SecureHash; idempotent. */
export async function GET(request: NextRequest) {
  const params: Record<string, string> = {};
  new URL(request.url).searchParams.forEach((v, k) => {
    params[k] = v;
  });
  const orderId = params.vnp_TxnRef ?? "";

  if (!vnpayVerify(params) || !orderId) {
    return Response.json({ RspCode: "97", Message: "Invalid signature" });
  }
  if (params.vnp_ResponseCode === "00") {
    await markPaid(orderId, params.vnp_TransactionNo ?? "");
    return Response.json({ RspCode: "00", Message: "Confirm success" });
  }
  await setOrderStatus(orderId, "failed");
  return Response.json({ RspCode: "00", Message: "Confirm success" });
}
