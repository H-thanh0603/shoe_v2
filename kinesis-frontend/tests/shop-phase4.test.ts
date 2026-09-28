import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { randomUUID } from "node:crypto";
import { withDb } from "@/lib/db";
import { createProduct, setStock, addReviewForOrder, getReviewSummary, getSoldTotal, joinWaitlist } from "@/lib/shop-products";
import { createOrder, setOrderStatus, type CreateOrderInput } from "@/lib/shop-orders";
import { getCart, syncCart } from "@/lib/shop-cart";

const HAS_DB = !!process.env.DATABASE_URL;
const SLUG = "test-kinesis-p4";
const SIZE = "42";
const EMAIL = "ci-p4@example.com";
const USER = `ci-user-${randomUUID().slice(0, 8)}`;

function input(qty: number): CreateOrderInput {
  return {
    email: EMAIL,
    name: "P4 Buyer",
    phone: "0909000003",
    address: "4 Test St",
    province: "HN",
    note: "",
    payment: "cod",
    items: [{ slug: SLUG, size: SIZE, color: "VOLT", qty }],
  };
}

describe.skipIf(!HAS_DB)("phase-4: cart, reviews, waitlist, sold count (DB)", () => {
  beforeAll(async () => {
    await withDb(async (c) => {
      await c.query(`DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE email = $1)`, [EMAIL]);
      await c.query(`DELETE FROM orders WHERE email = $1`, [EMAIL]);
      await c.query(`DELETE FROM waitlist WHERE email = $1`, [EMAIL]);
      await c.query(`DELETE FROM products WHERE slug = $1`, [SLUG]);
      await c.query(`DELETE FROM users WHERE id = $1`, [USER]);
    });
    expect(
      await createProduct({ slug: SLUG, sku: "TEST-P4-001", name: "P4 Shoe", price_vnd: 3_000_000, sizes: [SIZE] }),
    ).toBe("ok");
    expect(await setStock(SLUG, SIZE, 10)).toBe("ok");
    await withDb((c) =>
      c.query(`INSERT INTO users (id, email, name) VALUES ($1, $2, 'CI P4 User')`, [USER, EMAIL]),
    );
  });

  afterAll(async () => {
    await withDb(async (c) => {
      await c.query(`DELETE FROM users WHERE id = $1`, [USER]); // cascades cart_items
      await c.query(`DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE email = $1)`, [EMAIL]);
      await c.query(`DELETE FROM reviews WHERE slug = $1`, [SLUG]);
      await c.query(`DELETE FROM orders WHERE email = $1`, [EMAIL]);
      await c.query(`DELETE FROM waitlist WHERE email = $1`, [EMAIL]);
      await c.query(`DELETE FROM products WHERE slug = $1`, [SLUG]);
    });
  });

  it("syncCart replaces the stored cart, drops junk and ghost slugs", async () => {
    const echo = await syncCart(USER, [
      { slug: SLUG, size: SIZE, color: "VOLT", qty: 2 },
      { slug: "not-a-product", size: SIZE, color: "", qty: 1 },
      { slug: SLUG, size: "99", color: "", qty: 0 }, // qty < 1 → invalid row
      "junk",
    ]);
    expect(echo).toHaveLength(1);
    expect(echo[0]).toMatchObject({ slug: SLUG, size: SIZE, qty: 2 });
    expect(await getCart(USER)).toEqual(echo);

    const replaced = await syncCart(USER, [{ slug: SLUG, size: SIZE, color: "CHROME", qty: 5 }]);
    expect(replaced).toHaveLength(1);
    expect(replaced[0]).toMatchObject({ color: "CHROME", qty: 5 });

    const emptied = await syncCart(USER, []);
    expect(emptied).toHaveLength(0);
  });

  it("sold count only counts orders that passed payment", async () => {
    expect(await getSoldTotal(SLUG)).toBe(0);
    const pending = await createOrder(null, input(2));
    expect(await getSoldTotal(SLUG)).toBe(0); // still pending → not sold
    expect(await setOrderStatus(pending.id, "paid")).toBe(true);
    expect(await getSoldTotal(SLUG)).toBe(2);
  });

  it("reviews require a delivered order + token, one per order", async () => {
    const order = await createOrder(null, input(1));
    // Not delivered yet.
    expect(await addReviewForOrder(order.id, order.token!, 5, "good")).toBe("not_delivered");
    expect(await setOrderStatus(order.id, "delivered")).toBe(true);

    expect(await addReviewForOrder(order.id, "wrong-token-0000", 5, "x")).toBe("not_found");
    expect(await addReviewForOrder(order.id, order.token!, 7, "x")).toBe("invalid");
    expect(await addReviewForOrder(order.id, order.token!, 5, "Êm như bay, đúng size tư vấn.")).toBe("ok");
    expect(await addReviewForOrder(order.id, order.token!, 1, "đổi ý")).toBe("already");

    const summary = await getReviewSummary(SLUG);
    expect(summary?.count).toBe(1);
    expect(summary?.avg).toBe(5);
    expect(summary?.latest[0]?.body).toContain("Êm như bay");
  });

  it("waitlist upserts on email", async () => {
    expect(await joinWaitlist("Bad@@mail", SLUG)).toBe("invalid");
    expect(await joinWaitlist(EMAIL, SLUG)).toBe("ok");
    expect(await joinWaitlist(EMAIL, "other-slug")).toBe("ok"); // upsert, no duplicate error
    const r = await withDb((c) =>
      c.query<{ slug: string }>(`SELECT slug FROM waitlist WHERE email = $1`, [EMAIL]),
    );
    expect(r?.rows[0]?.slug).toBe("other-slug");
  });
});
