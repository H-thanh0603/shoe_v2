import { getPool } from "@/lib/db";

/* ============================================================
   Server cart (3.1) — the DB is only consulted for signed-in
   users; guests keep the localStorage cart. The client sends
   the whole cart on each change (≤20 rows) so the two stores
   cannot drift; stock is still reserved at order time only.
   ============================================================ */

export interface CartRow {
  slug: string;
  size: string;
  color: string;
  qty: number;
}

const MAX_ROWS = 20;

function validRow(x: unknown): x is CartRow {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.slug === "string" && o.slug.length > 0 && o.slug.length <= 64 &&
    typeof o.size === "string" && o.size.length <= 8 &&
    typeof o.color === "string" && o.color.length <= 32 &&
    Number.isInteger(o.qty) && (o.qty as number) >= 1 && (o.qty as number) <= 10
  );
}

export async function getCart(userId: string): Promise<CartRow[]> {
  const pool = getPool();
  if (!pool) return [];
  const client = await pool.connect();
  try {
    const { rows } = await client.query<CartRow>(
      `SELECT ci.slug, ci.size, ci.color, ci.qty FROM cart_items ci
       JOIN products p ON p.slug = ci.slug
       WHERE ci.user_id = $1 ORDER BY ci.updated_at`,
      [userId],
    );
    return rows;
  } finally {
    client.release();
  }
}

/* Replace the stored cart with the incoming list; rows whose slug is no
   longer a real product are dropped silently. */
export async function syncCart(userId: string, items: unknown[]): Promise<CartRow[]> {
  const clean = items.filter(validRow).slice(0, MAX_ROWS);
  const pool = getPool();
  if (!pool) throw new Error("db_unreachable");
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(`DELETE FROM cart_items WHERE user_id = $1`, [userId]);
    for (const it of clean) {
      await client.query(
        `INSERT INTO cart_items (user_id, slug, size, color, qty)
         SELECT $1, $2, $3, $4, $5
         WHERE EXISTS (SELECT 1 FROM products WHERE slug = $2)
         ON CONFLICT (user_id, slug, size) DO UPDATE SET qty = $5, color = $4, updated_at = now()`,
        [userId, it.slug, it.size, it.color, it.qty],
      );
    }
    const { rows } = await client.query<CartRow>(
      `SELECT ci.slug, ci.size, ci.color, ci.qty FROM cart_items ci
       JOIN products p ON p.slug = ci.slug
       WHERE ci.user_id = $1 ORDER BY ci.updated_at`,
      [userId],
    );
    await client.query("COMMIT");
    return rows;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
