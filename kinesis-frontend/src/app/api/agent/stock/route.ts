import type { NextRequest } from "next/server";
import { withDb } from "@/lib/db";
import { PRODUCTS } from "@/lib/data";
import { recordAudit } from "@/lib/audit-db";

/* GET /api/agent/stock?slug=k-09-stratos-chrono — live DB stock.
   Falls back to the static demo table only when the DB is unreachable. */
export async function GET(request: NextRequest) {
  const t0 = Date.now();
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug") ?? "";
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) {
    return Response.json(
      { error: "unknown_product", known_slugs: PRODUCTS.map((p) => p.slug) },
      { status: 404 },
    );
  }
  const live = await withDb(async (c) => {
    const p = await c.query<{ status: string }>(
      `SELECT status FROM products WHERE slug=$1`, [slug],
    );
    if (p.rows.length === 0) return null;
    const s = await c.query<{ size: string; qty: number }>(
      `SELECT size, qty FROM product_stock WHERE slug=$1 ORDER BY size`, [slug],
    );
    return {
      status: p.rows[0].status,
      sizes: s.rows.map((r) => ({
        size: r.size,
        available: r.qty,
        state: r.qty <= 0 ? "SOLD OUT" : r.qty <= 2 ? "HOT" : "IN STOCK",
      })),
    };
  });
  void recordAudit("checkStock", "GET", 200, Date.now() - t0);
  if (live) {
    return Response.json({
      tool: "checkStock",
      slug: product.slug,
      sku: product.sku,
      name: product.name,
      status: live.status,
      remaining: product.edition,
      sizes: live.sizes,
      verified_at: new Date().toISOString(),
      source: "postgres",
      human_readable: `/artifact/${product.slug}`,
    });
  }
  const { stockFor } = await import("@/lib/agent");
  const stock = stockFor(slug);
  return Response.json({
    tool: "checkStock",
    ...stock,
    verified_at: new Date().toISOString(),
    source: "static-fallback",
    note: "DB unreachable — demo snapshot, not authoritative.",
    human_readable: `/artifact/${slug}`,
  });
}