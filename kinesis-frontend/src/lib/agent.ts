import { PRODUCTS, PROVENANCE } from "./data";
import type { Product } from "./data";

/* ============================================================
   AGENTIC WEB — Shared registry for the KINESIS Agent layer.
   This is the single source of truth used by:
     - /.well-known/agent-tools.json     (static discovery file)
     - /api/agent/tools                  (live manifest route)
     - /api/agent/search|compare|stock|provenance
     - /api/agent/cart  /api/agent/order (consequential tools)
     - /agent                            (Agent Console UI)
   ============================================================ */

export type SecurityClass = "READ-ONLY" | "REVERSIBLE" | "CONSEQUENTIAL";

export interface ToolParam {
  name: string;
  type: "string" | "number" | "boolean";
  required: boolean;
  description: string;
}

export interface AgentTool {
  name: string;
  description: string;
  security: SecurityClass;
  reversible: boolean;
  requires_human_approval: boolean;
  params: ToolParam[];
  endpoint: string;
  example: string;
}

/* The catalog of WebMCP-style tools exposed by the KINESIS website.
   Mirrors the "camera shop" example from the Agentic Web papers:
   searchShoes / compareShoes / checkStock / addToCart / createOrder. */
export const AGENT_TOOLS: AgentTool[] = [
  {
    name: "searchShoes",
    description: "Search the KINESIS catalog by keyword (name, series, category, material) with optional category filter.",
    security: "READ-ONLY",
    reversible: true,
    requires_human_approval: false,
    endpoint: "/api/agent/search",
    example: 'searchShoes({ q: "carbon" })',
    params: [
      { name: "q", type: "string", required: true, description: "Search keyword." },
      {
        name: "category",
        type: "string",
        required: false,
        description: "Filter: HYPER-RUNNING | AVANT-GARDE | LAB EXPERIMENTAL.",
      },
    ],
  },
  {
    name: "getShoe",
    description: "Get the full structured record for one product (specs, materials, edition, status).",
    security: "READ-ONLY",
    reversible: true,
    requires_human_approval: false,
    endpoint: "/api/agent/compare",
    example: 'getShoe({ slug: "k-09-stratos-chrono" })',
    params: [{ name: "slug", type: "string", required: true, description: "Product slug." }],
  },
  {
    name: "compareShoes",
    description: "Side-by-side comparison of up to 4 products across price, materials, status and category.",
    security: "READ-ONLY",
    reversible: true,
    requires_human_approval: false,
    endpoint: "/api/agent/compare",
    example: 'compareShoes({ slugs: "k-09-stratos-chrono,k-07-solaris-glitch" })',
    params: [
      {
        name: "slugs",
        type: "string",
        required: true,
        description: "Comma-separated product slugs (max 4).",
      },
    ],
  },
  {
    name: "checkStock",
    description: "Live availability per EU size for a product, including hot/out-of-stock flags.",
    security: "READ-ONLY",
    reversible: true,
    requires_human_approval: false,
    endpoint: "/api/agent/stock",
    example: 'checkStock({ slug: "k-09-stratos-chrono" })',
    params: [{ name: "slug", type: "string", required: true, description: "Product slug." }],
  },
  {
    name: "getProvenance",
    description: "Digital passport chain for a product (craft log, biometric mint, atelier verification, vault seal).",
    security: "READ-ONLY",
    reversible: true,
    requires_human_approval: false,
    endpoint: "/api/agent/provenance",
    example: 'getProvenance({ slug: "k-09-stratos-chrono" })',
    params: [{ name: "slug", type: "string", required: true, description: "Product slug." }],
  },
  {
    name: "addToCart",
    description: "Add a product to the visitor's cart. Reversible, but requires explicit human approval.",
    security: "REVERSIBLE",
    reversible: true,
    requires_human_approval: true,
    endpoint: "/api/agent/cart",
    example: 'addToCart({ slug: "k-09-stratos-chrono", size: "42", color: "VOLT", qty: 1 })',
    params: [
      { name: "slug", type: "string", required: true, description: "Product slug." },
      { name: "size", type: "string", required: true, description: "EU size (39–45)." },
      { name: "color", type: "string", required: true, description: "Colorway." },
      { name: "qty", type: "number", required: false, description: "Quantity, default 1." },
    ],
  },
  {
    name: "createOrder",
    description: "Place a paid order. CONSEQUENTIAL action — blocked until a human approves the checkpoint.",
    security: "CONSEQUENTIAL",
    reversible: false,
    requires_human_approval: true,
    endpoint: "/api/agent/order",
    example: 'createOrder({ slug: "k-09-stratos-chrono", size: "42", qty: 1 })',
    params: [
      { name: "slug", type: "string", required: true, description: "Product slug." },
      { name: "size", type: "string", required: true, description: "EU size (39–45)." },
      { name: "qty", type: "number", required: false, description: "Quantity, default 1." },
    ],
  },
];

/* ---------- Stock model (demo data, mirrors the ArtifactClient size guide) ---------- */

const ERA = ["39", "40", "41", "42", "43", "44", "45"];

export interface SizeStock {
  size: string;
  available: number;
  state: "IN STOCK" | "HOT" | "SOLD OUT" | "PRE-ORDER" | "ARCHIVE";
  note?: string;
}

export interface StockResult {
  slug: string;
  sku: string;
  name: string;
  status: Product["status"];
  remaining: string;
  sizes: SizeStock[];
}

/* Per-product availability table, keyed by slug. */
const STOCK_TABLE: Record<string, Partial<Record<string, SizeStock["state"]>>> = {
  "k-09-stratos-chrono": {
    "39": "IN STOCK",
    "40": "IN STOCK",
    "41": "IN STOCK",
    "42": "HOT",
    "43": "IN STOCK",
    "44": "IN STOCK",
    "45": "SOLD OUT",
  },
  "k-07-solaris-glitch": {
    "39": "SOLD OUT",
    "40": "HOT",
    "41": "IN STOCK",
    "42": "IN STOCK",
    "43": "IN STOCK",
    "44": "HOT",
    "45": "SOLD OUT",
  },
  "k-01-phantom-shadow": {
    "39": "SOLD OUT",
    "40": "SOLD OUT",
    "41": "SOLD OUT",
    "42": "SOLD OUT",
    "43": "SOLD OUT",
    "44": "SOLD OUT",
    "45": "SOLD OUT",
  },
  "k-12-titan-runner": {
    "39": "PRE-ORDER",
    "40": "PRE-ORDER",
    "41": "PRE-ORDER",
    "42": "PRE-ORDER",
    "43": "PRE-ORDER",
    "44": "PRE-ORDER",
    "45": "PRE-ORDER",
  },
  "k-04-aero-drift": {
    "39": "PRE-ORDER",
    "40": "PRE-ORDER",
    "41": "PRE-ORDER",
    "42": "PRE-ORDER",
    "43": "PRE-ORDER",
    "44": "PRE-ORDER",
    "45": "PRE-ORDER",
  },
  "k-x-lab-null": {
    "39": "ARCHIVE",
    "40": "ARCHIVE",
    "41": "ARCHIVE",
    "42": "ARCHIVE",
    "43": "ARCHIVE",
    "44": "ARCHIVE",
    "45": "ARCHIVE",
  },
};
const STATE_STOCK: Record<SizeStock["state"], number> = {
  "IN STOCK": 4,
  HOT: 2,
  "SOLD OUT": 0,
  "PRE-ORDER": 8,
  ARCHIVE: 0,
};

const STATE_NOTE: Record<SizeStock["state"], string | undefined> = {
  "IN STOCK": undefined,
  HOT: "CHỈ CÒN 2 ĐÔI CUÓI (HIẼM)",
  "SOLD OUT": "ĐÃ HẼT HÀNG TRÊN TOÀN CẦU",
  "PRE-ORDER": "PRE-ORDER // LÔ 02",
  ARCHIVE: "ARCHIVE — NOT FOR SALE",
};

export function stockFor(slug: string): StockResult | null {
  const p = PRODUCTS.find((x) => x.slug === slug);
  if (!p) return null;
  const table = STOCK_TABLE[slug] ?? {};
  const sizes = ERA.map((size) => {
    const state = table[size] ?? (p.status === "SOLD OUT" ? "SOLD OUT" : "IN STOCK");
    return { size, available: STATE_STOCK[state], state, note: STATE_NOTE[state] };
  });
  return { slug: p.slug, sku: p.sku, name: p.name, status: p.status, remaining: p.edition, sizes };
}

/* ---------- Search / compare / provenance helpers ---------- */

export interface SearchHit {
  slug: string;
  sku: string;
  name: string;
  series: string;
  category: Product["category"];
  status: Product["status"];
  price: number;
  edition: string;
  materials: string[];
}

export function searchProducts(q: string, category?: string): SearchHit[] {
  const needle = q.trim().toLowerCase();
  const all = !needle || needle === "*" || needle === "all";
  return PRODUCTS.filter((p) => {
    if (category && p.category !== category) return false;
    if (all) return true;
    const hay = [p.name, p.series, p.category, p.description, ...p.materials]
      .join(" ")
      .toLowerCase();
    return hay.includes(needle);
  }).map((p) => ({
    slug: p.slug,
    sku: p.sku,
    name: p.name,
    series: p.series,
    category: p.category,
    status: p.status,
    price: p.price,
    edition: p.edition,
    materials: p.materials,
  }));
}

export interface ComparisonRow {
  field: string;
  values: Array<{ slug: string; value: string }>;
}

export function compareProducts(
  slugs: string[],
): { products: Product[]; table: ComparisonRow[] } | null {
  const list = slugs
    .map((s) => PRODUCTS.find((p) => p.slug === s.trim()))
    .filter((p): p is Product => Boolean(p))
    .slice(0, 4);
  if (list.length === 0) return null;

  const rows: Array<{ field: string; pick: (p: Product) => string }> = [
    { field: "Price", pick: (p) => `$${p.price}` },
    { field: "Category", pick: (p) => p.category },
    { field: "Status", pick: (p) => p.status },
    { field: "Edition", pick: (p) => p.edition },
    { field: "Materials", pick: (p) => p.materials.join(" · ") },
    { field: "Colorways", pick: (p) => p.colors.join(" / ") },
  ];
  return {
    products: list,
    table: rows.map((r) => ({
      field: r.field,
      values: list.map((p) => ({ slug: p.slug, value: r.pick(p) })),
    })),
  };
}

export type ProvenanceEntry = { time: string; event: string; hash: string };

/* The global provenance chain is the K-09 passport; per-product chains are
   derived deterministically so every Agent response carries a provenance trail. */
export function provenanceFor(
  slug: string,
): { product: Product | null; chain: ProvenanceEntry[] } {
  const product = PRODUCTS.find((p) => p.slug === slug) ?? null;
  const chain = PROVENANCE.map((entry, i) => ({
    time: entry.time,
    event: product ? `${product.name.toUpperCase()} — ${entry.event}` : entry.event,
    hash: i === 0 && product ? `0x${sha8(product.sku)}` : entry.hash,
  }));
  return { product, chain };
}

/* Tiny deterministic 8-hex digest (demo stand-in for a real hash). */
function sha8(input: string): string {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = (h * 16777619) & 0xffffffff;
  }
  return (h ^ (h >> 16)).toString(16).padStart(8, "0");
}

/* ---------- Security boundary ----------
   Per WebMCP-Phalanx: the Agent layer is a NEW trust boundary.
   Page content is never instruction; every consequential tool response
   reports a quarantine inspection result. */
export interface QuarantineReport {
  status: "INSPECTED" | "BLOCKED";
  policy: string;
  scanned_fields: string[];
  injected: boolean;
}

export function inspectContent(fields: string[]): QuarantineReport {
  /* Demo scanner: flags classic "ignore previous instructions" injection patterns. */
  const INJECTION_PATTERN =
    /ignore\s+(previous|all|prior)|system\s+prompt|you are now|send.*(private|secret|password)/i;
  const hit = fields.find((f) => INJECTION_PATTERN.test(f));
  return {
    status: hit ? "BLOCKED" : "INSPECTED",
    policy: "page-content-is-not-instruction",
    scanned_fields: fields.slice(0, 12),
    injected: Boolean(hit),
  };
}

export const AGENT_ORIGIN = "KINESIS / ATELIER — Agent Interface (AWI)";
export const AGENT_VERSION = "webmcp-draft-2026.0";