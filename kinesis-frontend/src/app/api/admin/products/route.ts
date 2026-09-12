import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { createProduct, listProductsAdmin, setStock, updateProduct, type NewProduct, type ProductPatch } from "@/lib/shop-products";

/* GET /api/admin/products — full catalog with stock (admin only). */
export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "admin") return Response.json({ error: "forbidden" }, { status: 403 });
  const products = await listProductsAdmin();
  return Response.json({ products });
}

/* PATCH /api/admin/products — {slug, fields?, stock?} (admin only).
   fields: price_vnd | status | name | edition | sku. stock: {size: qty}. */
export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "admin") return Response.json({ error: "forbidden" }, { status: 403 });
  const body = (await request.json().catch(() => null)) as {
    slug?: string;
    fields?: ProductPatch;
    stock?: Record<string, number>;
  } | null;
  if (!body?.slug) return Response.json({ error: "missing_slug" }, { status: 400 });
  if (body.fields) {
    const code = await updateProduct(body.slug, body.fields);
    if (code !== "ok") return Response.json({ error: code }, { status: code === "not_found" ? 404 : 400 });
  }
  if (body.stock) {
    for (const [size, qty] of Object.entries(body.stock)) {
      const code = await setStock(body.slug, size, qty);
      if (code !== "ok") return Response.json({ error: code }, { status: code === "not_found" ? 404 : 400 });
    }
  }
  if (!body.fields && !body.stock) return Response.json({ error: "empty_patch" }, { status: 400 });
  return Response.json({ ok: true });
}

/* POST /api/admin/products — create product (admin only). */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "admin") return Response.json({ error: "forbidden" }, { status: 403 });
  const body = (await request.json().catch(() => null)) as NewProduct | null;
  if (!body) return Response.json({ error: "invalid_json" }, { status: 400 });
  const code = await createProduct(body);
  if (code !== "ok") return Response.json({ error: code }, { status: code === "duplicate_slug" ? 409 : 400 });
  return Response.json({ ok: true, slug: body.slug }, { status: 201 });
}
