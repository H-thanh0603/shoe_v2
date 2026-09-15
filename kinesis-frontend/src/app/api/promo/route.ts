import type { NextRequest } from "next/server";
import { promoRate } from "@/lib/shop-orders";

/* GET /api/promo?code=SYNDICATE — validate a promo code before display.
   The discount itself is computed server-side in createOrder. */
export async function GET(request: NextRequest) {
  const code = (new URL(request.url).searchParams.get("code") ?? "").trim().toUpperCase();
  const rate = promoRate(code);
  if (!code || !rate) return Response.json({ ok: false }, { status: 404 });
  return Response.json({ ok: true, code, rate });
}
