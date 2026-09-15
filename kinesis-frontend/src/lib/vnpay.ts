import crypto from "node:crypto";

/* ============================================================
   VNPay v2 sandbox — build payment URL + verify return/IPN.
   Docs: https://sandbox.vnpayment.vn/apis/docs/huong-dan-tich-heap/
   ============================================================ */

export interface VnpayConfig {
  tmnCode: string;
  hashSecret: string;
  payUrl: string;
  returnUrl: string;
}

export function vnpayConfig(): VnpayConfig | null {
  const tmnCode = process.env.VNPAY_TMN_CODE;
  const hashSecret = process.env.VNPAY_HASH_SECRET;
  if (!tmnCode || !hashSecret) return null;
  return {
    tmnCode,
    hashSecret,
    payUrl: process.env.VNPAY_PAY_URL ?? "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    returnUrl: process.env.VNPAY_RETURN_URL ?? "",
  };
}

function hmacSha512(secret: string, data: string): string {
  return crypto.createHmac("sha512", secret).update(Buffer.from(data, "utf8")).digest("hex");
}

function escape(s: string): string {
  return encodeURIComponent(s).replace(/%20/g, "+");
}

/* Sort params (excluding signature fields), build query string without empty
   values, sign with HMAC SHA512. Mirrors VNPay v2 spec: vnp_SecureHash and
   vnp_SecureHashType are never part of the signed data. */
export function vnpaySign(params: Record<string, string>, hashSecret: string): { query: string; secureHash: string } {
  const filtered = Object.entries(params)
    .filter(([, v]) => v !== "" && v !== undefined && v !== null)
    .map(([k, v]) => [k, escape(String(v))] as const)
    .sort(([a], [b]) => a.localeCompare(b));
  const query = filtered.map(([k, v]) => `${k}=${v}`).join("&");
  return { query, secureHash: hmacSha512(hashSecret, query) };
}

export function vnpayVerify(params: Record<string, string>): boolean {
  const cfg = vnpayConfig();
  if (!cfg) return false;
  const { vnp_SecureHash, ...rest } = params;
  delete rest.vnp_SecureHashType;
  if (!vnp_SecureHash) return false;
  const { secureHash } = vnpaySign(rest, cfg.hashSecret);
  if (secureHash.length !== vnp_SecureHash.length) return false;
  return crypto.timingSafeEqual(Buffer.from(secureHash), Buffer.from(vnp_SecureHash));
}

export interface CreatePaymentInput {
  orderId: string;
  amountVnd: number;
  ip: string;
  locale?: string;
}

export function buildPaymentUrl(input: CreatePaymentInput, cfg: VnpayConfig): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const dt =
    `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}` +
    `${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}`;
  const params: Record<string, string> = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: cfg.tmnCode,
    vnp_Amount: String(Math.round(input.amountVnd) * 100),
    vnp_CurrCode: "VND",
    vnp_TxnRef: input.orderId,
    vnp_OrderInfo: `Thanh toan don hang ${input.orderId}`,
    vnp_OrderType: "other",
    vnp_Locale: input.locale ?? "vn",
    vnp_ReturnURL: cfg.returnUrl,
    vnp_IpAddr: input.ip,
    vnp_CreateDate: dt,
  };
  const { query, secureHash } = vnpaySign(params, cfg.hashSecret);
  return `${cfg.payUrl}?${query}&vnp_SecureHash=${secureHash}`;
}
