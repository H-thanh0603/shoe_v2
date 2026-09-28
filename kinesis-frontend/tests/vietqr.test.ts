import { describe, expect, it } from "vitest";
import {
  isOurTransferMemo,
  transferMemo,
  vietqrConfig,
  vietqrImageUrl,
} from "@/lib/vietqr";

describe("vietqr (pure)", () => {
  it("builds a short unique memo from the order id and recognises it", () => {
    const memo = transferMemo("KNS-ORD-MJ9K3XP2-1A2B3C");
    expect(memo).toMatch(/^KNS[A-Z0-9]{10}$/);
    expect(memo.length).toBeLessThanOrEqual(13);
    expect(isOurTransferMemo(memo)).toBe(true);
    expect(isOurTransferMemo("SHOPHO CHUYEN TK")).toBe(false);
  });

  it("two different orders get different memos", () => {
    expect(transferMemo("KNS-ORD-MJ9K3XP2-AAAAAA")).not.toBe(
      transferMemo("KNS-ORD-MJ9K3XP2-BBBBBB"),
    );
  });

  it("config is null until all env vars are valid", () => {
    delete process.env.VIETQR_BIN;
    delete process.env.VIETQR_ACCOUNT;
    delete process.env.VIETQR_OWNER;
    expect(vietqrConfig()).toBeNull();
    process.env.VIETQR_BIN = "970436";
    process.env.VIETQR_ACCOUNT = "0123456789";
    expect(vietqrConfig()).toBeNull(); // owner still missing
    process.env.VIETQR_OWNER = "CONG TY KINESIS";
    const cfg = vietqrConfig();
    expect(cfg).toEqual({ bin: "970436", account: "0123456789", owner: "CONG TY KINESIS" });
    process.env.VIETQR_BIN = "12345"; // 5 digits — invalid
    expect(vietqrConfig()).toBeNull();
    delete process.env.VIETQR_BIN;
    delete process.env.VIETQR_ACCOUNT;
    delete process.env.VIETQR_OWNER;
  });

  it("image URL carries amount and memo", () => {
    const cfg = { bin: "970436", account: "0123456789", owner: "KINESIS SHOP" };
    const url = vietqrImageUrl(cfg, 4_530_000, "KNSABC123DEF4");
    expect(url.startsWith("https://api.vietqr.io/image/970436-0123456789-compact2.jpg?")).toBe(true);
    const q = new URL(url).searchParams;
    expect(q.get("amount")).toBe("4530000");
    expect(q.get("addInfo")).toBe("KNSABC123DEF4");
    expect(q.get("accountName")).toBe("KINESIS SHOP");
  });
});
