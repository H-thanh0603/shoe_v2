import { withDb } from "@/lib/db";

/* ============================================================
   Admin product catalog — list / update / create / stock.
   All mutations go through the admin API (role-checked there).
   ============================================================ */

export const PRODUCT_STATUSES = ["LIVE", "UPCOMING", "SOLD OUT"] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

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
