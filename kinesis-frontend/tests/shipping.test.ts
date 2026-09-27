import { describe, expect, it } from "vitest";
import { shippingQuote, FREE_SHIP_THRESHOLD_VND } from "@/lib/shipping";

describe("shippingQuote", () => {
  it("charges the province fee below the threshold", () => {
    expect(shippingQuote("Thái Nguyên", 1_000_000)).toEqual({ feeVnd: 50_000, eta: "3–5 ngày" });
  });

  it("charges the inner-city fee for major cities, diacritic-insensitive", () => {
    for (const p of ["Hà Nội", "ha noi", "HANOI", "TP. Hồ Chí Minh", "Đà Nẵng", "da nang"]) {
      expect(shippingQuote(p, 1_000_000).feeVnd).toBe(30_000);
    }
    expect(shippingQuote("Hà Nội", 1_000_000).eta).toBe("1–2 ngày");
  });

  it("is free at or above the threshold", () => {
    expect(shippingQuote("Thái Nguyên", FREE_SHIP_THRESHOLD_VND).feeVnd).toBe(0);
  });

  it("defaults an empty province to the higher fee", () => {
    expect(shippingQuote("", 1_000_000).feeVnd).toBe(50_000);
  });
});
