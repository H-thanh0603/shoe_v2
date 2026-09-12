import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { withDb } from "@/lib/db";
import { createProduct, setStock } from "@/lib/shop-products";
import { createOrder, markPaid, setOrderStatus, sweepStalePending, type CreateOrderInput } from "@/lib/shop-orders";

const HAS_DB = !!process.env.DATABASE_URL;
const SLUG = "test-kinesis-ord";
const SIZE = "43";

async function stockOf(): Promise<number> {
  const r = await withDb((c) =>
    c.query<{ qty: number }>(`SELECT qty FROM product_stock WHERE slug = $1 AND size = $2`, [SLUG, SIZE]),
  );
  return r?.rows[0]?.qty ?? -1;
}

async function orderStatus(id: string): Promise<string | null> {
  const r = await withDb((c) => c.query<{ status: string }>(`SELECT status FROM orders WHERE id = $1`, [id]));
  return r?.rows[0]?.status ?? null;
}

function input(payment: "cod" | "vnpay", qty: number): CreateOrderInput {
  return {
    email: "ci@example.com",
    name: "CI Buyer",
    phone: "0909000002",
    address: "2 Test St",
    province: "HCM",
    note: "",
    payment,
    items: [{ slug: SLUG, size: SIZE, color: "VOLT", qty }],
  };
}

describe.skipIf(!HAS_DB)("shop-orders (DB)", () => {
  beforeAll(async () => {
    await withDb((c) => c.query(`DELETE FROM products WHERE slug = $1`, [SLUG]));
    expect(
      await createProduct({ slug: SLUG, sku: "TEST-ORD-001", name: "CI Order Shoe", price_vnd: 5_000_000, sizes: [SIZE] }),
    ).toBe("ok");
    expect(await setStock(SLUG, SIZE, 3)).toBe("ok");
  });

  afterAll(async () => {
    await withDb(async (c) => {
      await c.query(`DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE email = 'ci@example.com')`);
      await c.query(`DELETE FROM orders WHERE email = 'ci@example.com'`);
      await c.query(`DELETE FROM products WHERE slug = $1`, [SLUG]);
    });
  });

  it("creates a COD order and decrements stock", async () => {
    const before = await stockOf();
    const order = await createOrder(null, input("cod", 2));
    expect(order.amountVnd).toBe(10_000_000);
    expect(await stockOf()).toBe(before - 2);
  });

  it("rejects insufficient stock without touching it", async () => {
    const before = await stockOf();
    expect(before).toBeGreaterThanOrEqual(0);
    const tooMany = Math.min(10, before + 1); // within qty limit, above stock
    await expect(createOrder(null, input("cod", tooMany))).rejects.toThrow(/insufficient_stock/);
    expect(await stockOf()).toBe(before);
  });

  it("restores stock on cancel", async () => {
    const order = await createOrder(null, input("cod", 1));
    const reserved = await stockOf();
    expect(await setOrderStatus(order.id, "cancelled")).toBe(true);
    expect(await orderStatus(order.id)).toBe("cancelled");
    expect(await stockOf()).toBe(reserved + 1);
  });

  it("markPaid is idempotent", async () => {
    const order = await createOrder(null, input("vnpay", 1));
    expect(await markPaid(order.id, "TXN-1")).toBe(true);
    expect(await orderStatus(order.id)).toBe("paid");
    expect(await markPaid(order.id, "TXN-1")).toBe(false);
  });

  it("sweeps stale pending VNPay orders and restocks", async () => {
    expect(await setStock(SLUG, SIZE, 2)).toBe("ok");
    const order = await createOrder(null, input("vnpay", 1));
    const reserved = await stockOf();
    expect(reserved).toBe(1);
    await withDb((c) =>
      c.query(`UPDATE orders SET created_at = now() - interval '25 hours' WHERE id = $1`, [order.id]),
    );
    const swept = await sweepStalePending();
    expect(swept).toBeGreaterThanOrEqual(1);
    expect(await orderStatus(order.id)).toBe("failed");
    expect(await stockOf()).toBe(reserved + 1);
  });
});
