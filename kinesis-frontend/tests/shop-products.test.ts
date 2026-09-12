import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { withDb } from "@/lib/db";
import { createProduct, listProductsAdmin, setStock, updateProduct } from "@/lib/shop-products";

const HAS_DB = !!process.env.DATABASE_URL;
const SLUG = "test-kinesis-ci";

async function cleanup() {
  await withDb((c) => c.query(`DELETE FROM products WHERE slug = $1`, [SLUG]));
}

describe.skipIf(!HAS_DB)("shop-products (DB)", () => {
  beforeAll(async () => {
    await cleanup();
    expect(
      await createProduct({ slug: SLUG, sku: "TEST-CI-001", name: "CI Test Shoe", price_vnd: 1_000_000, sizes: ["42"] }),
    ).toBe("ok");
    expect(await setStock(SLUG, "42", 5)).toBe("ok");
  });

  afterAll(async () => {
    await cleanup();
  });

  it("lists the product with stock", async () => {
    const all = await listProductsAdmin();
    const p = all.find((x) => x.slug === SLUG);
    expect(p).toBeDefined();
    expect(p!.price_vnd).toBe(1_000_000);
    expect(p!.stock["42"]).toBe(5);
  });

  it("updates price and status", async () => {
    expect(await updateProduct(SLUG, { price_vnd: 2_000_000, status: "LIVE" })).toBe("ok");
    const p = (await listProductsAdmin()).find((x) => x.slug === SLUG);
    expect(p!.price_vnd).toBe(2_000_000);
    expect(p!.status).toBe("LIVE");
  });

  it("rejects bad patches", async () => {
    expect(await updateProduct(SLUG, { price_vnd: -1 })).toBe("invalid_price");
    expect(await updateProduct(SLUG, { status: "XXX" })).toBe("invalid_status");
    expect(await updateProduct(SLUG, {})).toBe("empty_patch");
    expect(await updateProduct("no-such-slug", { price_vnd: 1 })).toBe("not_found");
    expect(await setStock(SLUG, "42", -1)).toBe("invalid_qty");
    expect(await setStock("no-such-slug", "42", 1)).toBe("not_found");
  });

  it("rejects duplicate / bad slugs on create", async () => {
    expect(await createProduct({ slug: SLUG, sku: "X", name: "Y", price_vnd: 1 })).toBe("duplicate_slug");
    expect(await createProduct({ slug: "Bad Slug!", sku: "X", name: "Y", price_vnd: 1 })).toBe("invalid_slug");
  });
});
