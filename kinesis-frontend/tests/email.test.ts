import { describe, expect, it } from "vitest";
import { buildOrderMailBody, notifyOrder } from "@/lib/email";

const items = [{ name: "K-09 STRATOS CHRONO", size: "42", color: "VOLT", qty: 2, price_vnd: 17_000_000 }];

describe("buildOrderMailBody", () => {
  it("renders COD confirmation with id, items, total", () => {
    const html = buildOrderMailBody("cod_created", "KNS-ORD-1", "Nguyen Van A", items, 34_000_000);
    expect(html).toContain("KNS-ORD-1");
    expect(html).toContain("Nguyen Van A");
    expect(html).toContain("K-09 STRATOS CHRONO");
    expect(html).toContain("34.000.000 VNĐ");
  });

  it("renders VNPay success variant", () => {
    const html = buildOrderMailBody("vnpay_paid", "KNS-ORD-2", "Tran B", items, 17_000_000);
    expect(html).toContain("KNS-ORD-2");
    expect(html).toContain("VNPay");
  });

  it("escapes user content", () => {
    const html = buildOrderMailBody("cod_created", "KNS-ORD-3", "<script>alert(1)</script>", items, 1);
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });
});

describe("notifyOrder", () => {
  it("skips silently without RESEND_API_KEY (never throws)", async () => {
    delete process.env.RESEND_API_KEY;
    await expect(notifyOrder("KNS-ORD-DOES-NOT-EXIST", "cod_created")).resolves.toBe(false);
  });
});
