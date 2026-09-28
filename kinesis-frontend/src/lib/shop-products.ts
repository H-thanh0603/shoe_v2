import { createHash, timingSafeEqual } from "node:crypto";
import { getPool, withDb } from "@/lib/db";

function safeEq(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

/* ============================================================
   Admin product catalog — list / update / create / stock.
   All mutations go through the admin API (role-checked there).
   ============================================================ */

export const PRODUCT_STATUSES = ["LIVE", "UPCOMING", "SOLD OUT"] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

/* Per-size stock for the public product page. Null = DB unreachable, in
   which case the UI must say "confirm at order" instead of inventing a number. */
export async function getStockForProduct(slug: string): Promise<Record<string, number> | null> {
  const r = await withDb((c) =>
    c.query<{ size: string; qty: number }>(
      `SELECT size, qty FROM product_stock WHERE slug = $1`,
      [slug],
    ),
  );
  if (!r) return null;
  const map: Record<string, number> = {};
  for (const row of r.rows) map[row.size] = row.qty;
  return map;
}

/* Total pairs available across every size. Null = DB unreachable. */
export async function getStockTotal(slug: string): Promise<number | null> {
  const r = await withDb((c) =>
    c.query<{ qty: number | null }>(
      `SELECT COALESCE(sum(qty), 0)::int AS qty FROM product_stock WHERE slug = $1`,
      [slug],
    ),
  );
  return r?.rows[0]?.qty ?? null;
}

/* Totals for every slug at once (gallery grid, home ticker). Null = DB unreachable. */
export async function getAllStockTotals(): Promise<Record<string, number> | null> {
  const r = await withDb((c) =>
    c.query<{ slug: string; qty: number }>(
      `SELECT slug, COALESCE(sum(qty), 0)::int AS qty FROM product_stock GROUP BY slug`,
    ),
  );
  if (!r) return null;
  const map: Record<string, number> = {};
  for (const row of r.rows) map[row.slug] = row.qty;
  return map;
}

export interface ProductAdmin {
  slug: string;
  sku: string;
  name: string;
  series: string;
  price_vnd: number;
  category: string;
  status: string;
  edition: string;
  description: string;
  materials: string[];
  image: string;
  colors: string[];
  sizes: string[];
  stock: Record<string, number>;
}

export async function listProductsAdmin(): Promise<ProductAdmin[]> {
  const r = await withDb(async (c) => {
    const p = await c.query(`SELECT * FROM products ORDER BY created_at`);
    const s = await c.query<{ slug: string; size: string; qty: number }>(
      `SELECT slug, size, qty FROM product_stock`,
    );
    const stock = new Map<string, Record<string, number>>();
    for (const row of s.rows) {
      if (!stock.has(row.slug)) stock.set(row.slug, {});
      stock.get(row.slug)![row.size] = row.qty;
    }
    return p.rows.map((row) => ({ ...row, stock: stock.get(row.slug) ?? {} }));
  });
  return (r ?? []) as ProductAdmin[];
}

export interface ProductPatch {
  price_vnd?: number;
  status?: string;
  name?: string;
  edition?: string;
  sku?: string;
}

/* Returns "ok" or an error code. */
export async function updateProduct(slug: string, patch: ProductPatch): Promise<string> {
  if (!slug) return "missing_slug";
  const sets: string[] = [];
  const vals: unknown[] = [];
  if (patch.price_vnd !== undefined) {
    if (!Number.isInteger(patch.price_vnd) || patch.price_vnd < 0) return "invalid_price";
    sets.push(`price_vnd = $${sets.length + 1}`);
    vals.push(patch.price_vnd);
  }
  if (patch.status !== undefined) {
    if (!(PRODUCT_STATUSES as readonly string[]).includes(patch.status)) return "invalid_status";
    sets.push(`status = $${sets.length + 1}`);
    vals.push(patch.status);
  }
  if (patch.name !== undefined) {
    if (!patch.name.trim()) return "invalid_name";
    sets.push(`name = $${sets.length + 1}`);
    vals.push(patch.name.trim());
  }
  if (patch.edition !== undefined) {
    sets.push(`edition = $${sets.length + 1}`);
    vals.push(patch.edition);
  }
  if (patch.sku !== undefined) {
    if (!patch.sku.trim()) return "invalid_sku";
    sets.push(`sku = $${sets.length + 1}`);
    vals.push(patch.sku.trim());
  }
  if (sets.length === 0) return "empty_patch";
  vals.push(slug);
  const r = await withDb((c) =>
    c.query(`UPDATE products SET ${sets.join(", ")} WHERE slug = $${vals.length}`, vals),
  );
  return (r?.rowCount ?? 0) > 0 ? "ok" : "not_found";
}

/* Set absolute stock for one size. Returns "ok" or an error code. */
export async function setStock(slug: string, size: string, qty: number): Promise<string> {
  if (!slug || !size) return "missing_fields";
  if (!Number.isInteger(qty) || qty < 0) return "invalid_qty";
  const exists = await withDb((c) => c.query(`SELECT 1 FROM products WHERE slug = $1`, [slug]));
  if (exists === null) return "db_unreachable";
  if ((exists.rowCount ?? 0) === 0) return "not_found";
  const r = await withDb((c) =>
    c.query(
      `INSERT INTO product_stock (slug, size, qty) VALUES ($1, $2, $3)
       ON CONFLICT (slug, size) DO UPDATE SET qty = $3`,
      [slug, size, qty],
    ),
  );
  return r ? "ok" : "db_unreachable";
}

export interface NewProduct {
  slug: string;
  sku: string;
  name: string;
  price_vnd: number;
  category?: string;
  status?: string;
  series?: string;
  edition?: string;
  description?: string;
  image?: string;
  colors?: string[];
  sizes?: string[];
}

/* Returns "ok" or an error code. New sizes get zero stock. */
export async function createProduct(p: NewProduct): Promise<string> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug ?? "")) return "invalid_slug";
  if (!p.sku?.trim() || !p.name?.trim()) return "missing_fields";
  if (!Number.isInteger(p.price_vnd) || p.price_vnd < 0) return "invalid_price";
  if (p.status !== undefined && !(PRODUCT_STATUSES as readonly string[]).includes(p.status)) {
    return "invalid_status";
  }
  const sizes = (p.sizes ?? []).filter((s) => typeof s === "string" && s.trim()).map((s) => s.trim());
  const exists = await withDb((c) => c.query(`SELECT 1 FROM products WHERE slug = $1`, [p.slug]));
  if (exists === null) return "db_unreachable";
  if ((exists.rowCount ?? 0) > 0) return "duplicate_slug";
  const r = await withDb(async (c) => {
    await c.query(
      `INSERT INTO products (slug, sku, name, series, price_vnd, category, status, edition, description, image, colors, sizes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [
        p.slug, p.sku.trim(), p.name.trim(), p.series ?? "", p.price_vnd,
        p.category ?? "", p.status ?? "UPCOMING", p.edition ?? "", p.description ?? "",
        p.image ?? "", p.colors ?? [], sizes,
      ],
    );
    for (const size of sizes) {
      await c.query(`INSERT INTO product_stock (slug, size, qty) VALUES ($1, $2, 0) ON CONFLICT DO NOTHING`, [
        p.slug,
        size,
      ]);
    }
  });
  if (r === null) return "db_unreachable";
  return "ok";
}

/* ---------- Fit advice + social proof (3.2 / 4.3) ---------- */

/* Per-product fit note written by the shop; '' means "no note yet". */
export async function getFitNote(slug: string): Promise<string | null> {
  const r = await withDb((c) =>
    c.query<{ fit_note: string }>(`SELECT fit_note FROM products WHERE slug = $1`, [slug]),
  );
  if (!r || r.rows.length === 0) return null;
  return r.rows[0].fit_note;
}

/* Pairs already sold (orders that actually progressed past payment). */
export async function getSoldTotal(slug: string): Promise<number | null> {
  const r = await withDb((c) =>
    c.query<{ qty: number | null }>(
      `SELECT COALESCE(sum(oi.qty), 0)::int AS qty
       FROM order_items oi
       JOIN orders o ON o.id = oi.order_id
       WHERE oi.slug = $1 AND o.status IN ('paid','confirmed','shipped','delivered')`,
      [slug],
    ),
  );
  return r?.rows[0]?.qty ?? null;
}

export interface Review {
  rating: number;
  body: string;
  created_at: string;
}

export interface ReviewSummary {
  count: number;
  avg: number;
  latest: Review[];
}

export async function getReviewSummary(slug: string, latest = 5): Promise<ReviewSummary | null> {
  const r = await withDb(async (c) => {
    const agg = await c.query<{ count: string; avg: string }>(
      `SELECT count(*)::text AS count, COALESCE(avg(rating), 0)::text AS avg FROM reviews WHERE slug = $1`, [slug],
    );
    const rows = await c.query<Review>(
      `SELECT rating, body, created_at FROM reviews WHERE slug = $1 ORDER BY created_at DESC LIMIT $2`,
      [slug, latest],
    );
    return {
      count: Number(agg.rows[0]?.count ?? 0),
      avg: Number(agg.rows[0]?.avg ?? 0),
      latest: rows.rows,
    };
  });
  return r;
}

/* One review per delivered order, authorized by the same lookup token the
   customer uses on /track. Returns an error string instead of throwing. */
export async function addReviewForOrder(
  orderId: string,
  token: string,
  rating: number,
  body: string,
): Promise<"ok" | "not_delivered" | "already" | "not_found" | "invalid" | "db_unreachable"> {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return "invalid";
  const text = body.trim().slice(0, 600);
  const pool = getPool();
  if (!pool) return "db_unreachable";
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query<{ status: string; lookup_token: string }>(
      `SELECT status, lookup_token FROM orders WHERE id = $1 FOR UPDATE`,
      [orderId],
    );
    const o = rows[0];
    if (!o || !o.lookup_token || !safeEq(o.lookup_token, token)) {
      await client.query("ROLLBACK");
      return "not_found";
    }
    if (o.status !== "delivered") {
      await client.query("ROLLBACK");
      return "not_delivered";
    }
    const first = await client.query<{ slug: string | null }>(
      `SELECT slug FROM order_items WHERE order_id = $1 ORDER BY id LIMIT 1`,
      [orderId],
    );
    const slug = first.rows[0]?.slug;
    if (!slug) {
      await client.query("ROLLBACK");
      return "not_found";
    }
    const dup = await client.query(`SELECT 1 FROM reviews WHERE order_id = $1`, [orderId]);
    if ((dup.rowCount ?? 0) > 0) {
      await client.query("ROLLBACK");
      return "already";
    }
    await client.query(
      `INSERT INTO reviews (order_id, slug, rating, body) VALUES ($1,$2,$3,$4)`,
      [orderId, slug, rating, text],
    );
    await client.query("COMMIT");
    return "ok";
  } catch {
    await client.query("ROLLBACK");
    return "db_unreachable";
  } finally {
    client.release();
  }
}

/* Waitlist (4.2) — restock alerts. Email re-submission just refreshes the slug. */
export async function joinWaitlist(email: string, slug: string): Promise<"ok" | "invalid" | "db_unreachable"> {
  const e = email.trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e) || e.length > 254) return "invalid";
  const s = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ? slug.slice(0, 64) : "";
  const r = await withDb((c) =>
    c.query(
      `INSERT INTO waitlist (email, slug) VALUES ($1,$2)
       ON CONFLICT (email) DO UPDATE SET slug = EXCLUDED.slug`,
      [e, s],
    ),
  );
  return r === null ? "db_unreachable" : "ok";
}
