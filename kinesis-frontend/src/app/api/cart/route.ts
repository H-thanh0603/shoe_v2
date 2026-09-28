import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { getCart, syncCart } from "@/lib/shop-cart";

/* GET /api/cart — server cart of the signed-in user (3.1). */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "unauthenticated" }, { status: 401 });
  return Response.json({ items: await getCart(session.user.id) });
}

/* POST /api/cart {items:[{slug,size,color,qty}]} — replace-and-return.
   Guests never call this; their cart lives in localStorage. */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "unauthenticated" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as { items?: unknown } | null;
  if (!Array.isArray(body?.items)) return Response.json({ error: "invalid_items" }, { status: 400 });
  try {
    const items = await syncCart(session.user.id, body.items);
    return Response.json({ ok: true, items });
  } catch (err) {
    if (err instanceof Error && err.message === "db_unreachable") {
      return Response.json({ error: "db_unreachable" }, { status: 503 });
    }
    throw err;
  }
}
