import { beforeAll, describe, expect, it } from "vitest";
import { buildPaymentUrl, vnpayConfig, vnpaySign, vnpayVerify } from "@/lib/vnpay";

beforeAll(() => {
  process.env.VNPAY_TMN_CODE = "TESTCODE";
  process.env.VNPAY_HASH_SECRET = "test-secret-123";
  process.env.VNPAY_PAY_URL = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  process.env.VNPAY_RETURN_URL = "https://example.com/api/payment/vnpay/return";
});

function parseQuery(url: string): Record<string, string> {
  const out: Record<string, string> = {};
  new URL(url).searchParams.forEach((v, k) => {
    out[k] = v;
  });
  return out;
}

describe("vnpaySign / vnpayVerify", () => {
  it("round-trips: signed params verify", () => {
    const params = { vnp_TmnCode: "TESTCODE", vnp_Amount: "1700000000", vnp_TxnRef: "KNS-ORD-1" };
    const { secureHash } = vnpaySign(params, "test-secret-123");
    expect(vnpayVerify({ ...params, vnp_SecureHash: secureHash })).toBe(true);
  });

  it("rejects tampered amount", () => {
    const params = { vnp_TmnCode: "TESTCODE", vnp_Amount: "1700000000", vnp_TxnRef: "KNS-ORD-1" };
    const { secureHash } = vnpaySign(params, "test-secret-123");
    expect(vnpayVerify({ ...params, vnp_Amount: "100", vnp_SecureHash: secureHash })).toBe(false);
  });

  it("rejects wrong secret", () => {
    const params = { vnp_TmnCode: "TESTCODE", vnp_Amount: "1700000000" };
    const { secureHash } = vnpaySign(params, "other-secret");
    expect(vnpayVerify({ ...params, vnp_SecureHash: secureHash })).toBe(false);
  });

  it("rejects missing hash", () => {
    expect(vnpayVerify({ vnp_TmnCode: "TESTCODE" })).toBe(false);
  });

  it("ignores vnp_SecureHashType (sent by real VNPay v2 callbacks)", () => {
    const params = { vnp_TmnCode: "TESTCODE", vnp_Amount: "1700000000", vnp_TxnRef: "KNS-ORD-1" };
    const { secureHash } = vnpaySign(params, "test-secret-123");
    expect(
      vnpayVerify({ ...params, vnp_SecureHash: secureHash, vnp_SecureHashType: "SHA256" }),
    ).toBe(true);
  });

  it("rejects truncated hash without throwing", () => {
    expect(vnpayVerify({ vnp_TmnCode: "TESTCODE", vnp_SecureHash: "ab" })).toBe(false);
  });

  it("returns null config when keys missing", () => {
    const tmn = process.env.VNPAY_TMN_CODE;
    delete process.env.VNPAY_TMN_CODE;
    expect(vnpayConfig()).toBeNull();
    expect(vnpayVerify({ vnp_SecureHash: "x" })).toBe(false);
    process.env.VNPAY_TMN_CODE = tmn;
  });
});

describe("buildPaymentUrl", () => {
  it("encodes order, amount x100, and a verifiable signature", () => {
    const cfg = vnpayConfig()!;
    const url = buildPaymentUrl({ orderId: "KNS-ORD-TEST", amountVnd: 17_000_000, ip: "127.0.0.1" }, cfg);
    expect(url.startsWith("https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?")).toBe(true);
    const q = parseQuery(url);
    expect(q.vnp_TxnRef).toBe("KNS-ORD-TEST");
    expect(q.vnp_Amount).toBe("1700000000");
    expect(q.vnp_CurrCode).toBe("VND");
    expect(vnpayVerify(q)).toBe(true);
  });
});
