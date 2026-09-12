import type { PoolClient } from "pg";
import { getPool, withDb } from "@/lib/db";

/* ============================================================
   Shop orders — real DB persistence (orders + order_items).
   Replaces the localStorage demo in @/lib/orders.
   ============================================================ */

export interface OrderItemInput {
  slug: string;
  size: string;
  color: string;
  qty: number;
}

export interface CreateOrderInput {
  email: string;
  name: string;
  phone: string;
  address: string;
  province: string;
  note: string;
  payment: "vnpay" | "cod";
  items: OrderItemInput[];
}

export interface OrderRow {
  id: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  province: string;
  note: string;
  amount_vnd: number;
  status: string;
  payment: string;
  created_at: string;
}

function orderId(): string {
  return `KNS-ORD-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
}

/* Fetch product rows (price, name, sku) for the cart slugs — server-side pricing, never trust client. */
interface ProductRow { slug: string; sku: string; name: string; price_vnd: number; status: string }
async function loadProducts(client: PoolClient, slugs: string[]): Promise<Map<string, ProductRow>> {
  const { rows } = await client.query<ProductRow>(
    `SELECT slug, sku, name, price_vnd, status FROM products WHERE slug = ANY($1)`,
    [slugs],
  );
  return new Map(rows.map((r) => [r.slug, r]));
}

/* Atomically decrement stock and create the order in one transaction.
   Throws Error with code/message on: unknown product, sold out product, insufficient stock. */
export async function createOrder(userId: string | null, input: CreateOrderInput): Promise<{ id: string; amountVnd: number }> {
  if (!input.items?.length) throw new Error("empty_cart");
  for (const it of input.items) {
    if (!Number.isInteger(it.qty) || it.qty < 1 || it.qty > 10) throw new Error("invalid_qty");
    if (input.payment !== "vnpay" && input.payment !== "cod") throw new Error("invalid_payment");
  }
  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.email);
  if (!emailOk || !input.name.trim() || !input.phone.trim() || !input.address.trim()) {
    throw new Error("invalid_customer_info");
  }

  const pool = getPool();
  if (!pool) throw new Error("db_unreachable");
  const client = await pool.connect();
  try {
    return await createOrderTx(client, userId, input);
  } finally {
    client.release();
  }
}

async function createOrderTx(client: PoolClient, userId: string | null, input: CreateOrderInput): Promise<{ id: string; amountVnd: number }> {
  await client.query("BEGIN");
  try {
    const products = await loadProducts(client, input.items.map((i) => i.slug));
    const id = orderId();
    let total = 0;
    const lines: { slug: string; sku: string; name: string; size: string; color: string; qty: number; price_vnd: number }[] = [];

    for (const it of input.items) {
      const p = products.get(it.slug);
      if (!p) throw new Error(`unknown_product:${it.slug}`);
      if (p.status === "SOLD OUT") throw new Error(`sold_out:${it.slug}`);
      // Decrement atomically; 0 rows means insufficient stock.
      const st = await client.query(
        `UPDATE product_stock SET qty = qty - $3
         WHERE slug = $1 AND size = $2 AND qty >= $3
         RETURNING qty`,
        [it.slug, it.size, it.qty],
      );
      if (st.rowCount === 0) throw new Error(`insufficient_stock:${it.slug}:${it.size}`);
      total += p.price_vnd * it.qty;
      lines.push({ slug: it.slug, sku: p.sku, name: p.name, size: it.size, color: it.color, qty: it.qty, price_vnd: p.price_vnd });
    }

    await client.query(
      `INSERT INTO orders (id, user_id, email, name, phone, address, province, note, amount_vnd, status, payment)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'pending',$10)`,
      [id, userId, input.email, input.name, input.phone, input.address, input.province, input.note, total, input.payment],
    );
    for (const l of lines) {
      await client.query(
        `INSERT INTO order_items (order_id, slug, sku, name, size, color, qty, price_vnd) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [id, l.slug, l.sku, l.name, l.size, l.color, l.qty, l.price_vnd],
      );
    }
    await client.query("COMMIT");
    return { id, amountVnd: total };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  }
}

export async function markPaid(orderId: string, paymentRef: string): Promise<boolean> {
  const r = await withDb(
    (c) => c.query(`UPDATE orders SET status='paid', paid_at=now(), payment_ref=$2, updated_at=now() WHERE id=$1 AND status='pending'`, [orderId, paymentRef]),
  );
  return (r?.rowCount ?? 0) > 0;
}

export async function setOrderStatus(orderId: string, status: string): Promise<boolean> {
  const allowed = ["pending", "paid", "confirmed", "shipped", "delivered", "cancelled", "failed"];
  if (!allowed.includes(status)) return false;
  const pool = getPool();
  if (!pool) return false;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const prev = await client.query<{ status: string }>(`SELECT status FROM orders WHERE id=$1 FOR UPDATE`, [orderId]);
    if (prev.rows.length === 0) {
      await client.query("ROLLBACK");
      return false;
    }
    const was = prev.rows[0].status;
    const isCancel = status === "cancelled" && was !== "cancelled" && was !== "delivered";
    await client.query(`UPDATE orders SET status=$2, updated_at=now() WHERE id=$1`, [orderId, status]);
    if (isCancel) {
      // Restock the reserved items.
      const { rows } = await client.query<{ slug: string; size: string; qty: number }>(
        `SELECT slug, size, qty FROM order_items WHERE order_id=$1`, [orderId],
      );
      for (const it of rows) {
        await client.query(
          `INSERT INTO product_stock (slug, size, qty) VALUES ($1,$2,$3)
           ON CONFLICT (slug, size) DO UPDATE SET qty = product_stock.qty + $3`,
          [it.slug, it.size, it.qty],
        );
      }
    }
    await client.query("COMMIT");
    return true;
  } catch {
    await client.query("ROLLBACK");
    return false;
  } finally {
    client.release();
  }
}

export async function listOrdersForUser(userId: string): Promise<OrderRow[]> {
  const r = await withDb((c) =>
    c.query(`SELECT id, email, name, phone, address, province, note, amount_vnd, status, payment, created_at
             FROM orders WHERE user_id=$1 ORDER BY created_at DESC LIMIT 50`, [userId]),
  );
  return r?.rows ?? [];
}

export async function listAllOrders(limit = 100): Promise<OrderRow[]> {
  const r = await withDb((c) =>
    c.query(`SELECT id, email, name, phone, address, province, note, amount_vnd, status, payment, created_at
             FROM orders ORDER BY created_at DESC LIMIT $1`, [limit]),
  );
  return r?.rows ?? [];
}

export async function getOrder(orderId: string) {
  const r = await withDb(async (c) => {
    const o = await c.query(`SELECT * FROM orders WHERE id=$1`, [orderId]);
    if (o.rows.length === 0) return null;
    const items = await c.query(`SELECT slug, sku, name, size, color, qty, price_vnd FROM order_items WHERE order_id=$1`, [orderId]);
    return { ...o.rows[0], items: items.rows };
  });
  return r;
}
