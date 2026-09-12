import type { NextRequest } from "next/server";
import { provenanceFor, inspectContent } from "@/lib/agent";
import { recordAudit } from "@/lib/audit-db";

/* GET /api/agent/provenance?slug=... — digital passport chain */
export async function GET(request: NextRequest) {
  const t0 = Date.now();
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug") ?? "";
  const { product, chain } = provenanceFor(slug);
  const scan = inspectContent(chain.map((c) => c.event));
  void recordAudit("getProvenance", "GET", 200, Date.now() - t0);

  return Response.json({
    tool: "getProvenance",
    product: product
      ? { slug: product.slug, sku: product.sku, name: product.name, status: product.status }
      : null,
    origin: "KINESIS ATELIER — PARIS / TOKYO / MILAN",
    chain,
    chip: { type: "NFC SEAL", status: "VERIFIED", policy: "tamper-evident vault seal (mint)" },
    content_quarantine: scan,
    note: "Provenance is machine-verifiable: every artifact ships with a digital passport (see /passport).",
    human_readable: product ? `/passport` : null,
  });
}