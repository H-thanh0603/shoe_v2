import type { NextRequest } from "next/server";
import { searchProducts, inspectContent } from "@/lib/agent";
import { recordAudit } from "@/lib/audit-db";

/* GET /api/agent/search?q=carbon&category=LAB EXPERIMENTAL */
export async function GET(request: NextRequest) {
  const t0 = Date.now();
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";
  const categoryParam = url.searchParams.get("category");

  const CATEGORIES = ["HYPER-RUNNING", "AVANT-GARDE", "LAB EXPERIMENTAL"];
  const category = categoryParam && CATEGORIES.includes(categoryParam) ? categoryParam : undefined;

  const results = searchProducts(q, category);
  const scan = inspectContent(results.map((r) => `${r.name} ${r.series} ${r.materials.join(" ")}`));
  void recordAudit("searchShoes", "GET", 200, Date.now() - t0);

  return Response.json({
    tool: "searchShoes",
    query: q.trim() || "*",
    category,
    total: results.length,
    results,
    content_quarantine: scan,
    note: "Catalog is agent-friendly: structured fields, no UI scraping required (AWI — Agentic Web Interface).",
    human_readable: "/gallery",
  });
}