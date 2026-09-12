import type { NextRequest } from "next/server";
import { stockFor } from "@/lib/agent";
import { PRODUCTS } from "@/lib/data";
import { recordAudit } from "@/lib/audit-db";

/* GET /api/agent/stock?slug=k-09-stratos-chrono */
export async function GET(request: NextRequest) {
  const t0 = Date.now();
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug") ?? "";
  const stock = stockFor(slug);
  if (!stock) {
    return Response.json(
      { error: "unknown_product", known_slugs: PRODUCTS.map((p) => p.slug) },
      { status: 404 },
    );
  }
  void recordAudit("checkStock", "GET", 200, Date.now() - t0);
  return Response.json({
    tool: "checkStock",
    ...stock,
    verified_at: new Date().toISOString(),
    note: "Availability is a demo snapshot; sizes flagged HOT/SOLD OUT are authoritative per drop ledger.",
    human_readable: `/artifact/${stock.slug}`,
  });
}