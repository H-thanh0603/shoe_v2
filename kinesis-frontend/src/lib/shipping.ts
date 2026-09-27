import { withDb } from "@/lib/db";

/* Shipping quote — shared by the checkout UI (display) and createOrder
   (authoritative). Fees are flat per zone; the order stores the fee that
   was actually charged, so the quote and the DB can never disagree. */

export const FREE_SHIP_THRESHOLD_VND = 5_000_000;
export const FEE_INNER_VND = 30_000; // nội thành thành phố lớn
export const FEE_PROVINCE_VND = 50_000; // tỉnh/thành khác

/* Diacritic-insensitive match so "Hà Nội", "ha noi", "HANOI" all hit. */
const MAJOR_CITIES = [
  "ha noi",
  "hanoi",
  "ho chi minh",
  "hcmc",
  "hcm", // also matches "tphcm"
  "da nang",
  "hai phong",
  "can tho",
];

function isMajorCity(province: string): boolean {
  const norm = province
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
  return MAJOR_CITIES.some((c) => norm.includes(c));
}

export interface ShippingQuote {
  feeVnd: number;
  eta: string; // human-readable delivery estimate
}

/* goodsVnd is the post-discount goods total (never the grand total). */
export function shippingQuote(province: string, goodsVnd: number): ShippingQuote {
  const inner = isMajorCity(province);
  const feeVnd = goodsVnd >= FREE_SHIP_THRESHOLD_VND ? 0 : inner ? FEE_INNER_VND : FEE_PROVINCE_VND;
  const eta = inner ? "1–2 ngày" : "3–5 ngày";
  return { feeVnd, eta };
}

/* Total pairs already sold, from paid/confirmed/shipped/delivered orders.
   Used for real "đã bán" counts instead of invented edition numbers. */
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
