import type { NextRequest } from "next/server";
import { PRODUCTS } from "@/lib/data";
import { compareProducts, inspectContent } from "@/lib/agent";
import { recordAudit } from "@/lib/audit-db";

/* GET /api/agent/compare?slugs=a,b,c,d   (compareShoes)
   GET /api/agent/compare?slug=a           (getShoe — full record) */
export async function GET(request: NextRequest) {
  const t0 = Date.now();
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");
  const slugs = (url.searchParams.get("slugs") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (slug) {
    const res = compareProducts([slug]);
    if (!res) return unknown(slug);
    const p = res.products[0];
    const scan = inspectContent([p.description, p.name, p.series]);
    void recordAudit("getShoe", "GET", 200, Date.now() - t0);
    return Response.json({
      tool: "getShoe",
      product: {
        slug: p.slug,
        sku: p.sku,
        name: p.name,
        series: p.series,
        price: p.price,
        category: p.category,
        status: p.status,
        edition: p.edition,
        description: p.description,
        materials: p.materials,
        colors: p.colors,
        image: p.image,
      },
      content_quarantine: scan,
      human_readable: `/artifact/${p.slug}`,
    });
  }

  if (slugs.length === 0) {
    return Response.json(
      { error: "missing_param", usage: "/api/agent/compare?slugs=a,b,c|?slug=a" },
      { status: 400 },
    );
  }

  const res = compareProducts(slugs);
  if (!res) return unknown(slugs.join(", "));
  const scan = inspectContent(res.products.map((p) => `${p.name} ${p.description}`));
  void recordAudit("compareShoes", "GET", 200, Date.now() - t0);
  return Response.json({
    tool: "compareShoes",
    compared: res.products.length,
    products: res.products.map((p) => ({
      slug: p.slug,
      name: p.name,
      price: p.price,
      category: p.category,
      status: p.status,
      sku: p.sku,
    })),
    table: res.table,
    content_quarantine: scan,
    note: "Structured comparison — no screenshots or vision needed.",
  });
}

function unknown(slugs: string) {
  return Response.json(
    {
      error: "unknown_product",
      requested: slugs,
      known_slugs: PRODUCTS.map((p) => p.slug),
    },
    { status: 404 },
  );
}