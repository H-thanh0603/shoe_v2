import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { PRODUCTS } from "@/lib/data";
import { guardConsequential, readJsonBody } from "../_shared";
import { recordAudit } from "@/lib/audit-db";
import { issueCheckpoint, approveCheckpoint } from "@/lib/checkpoint-db";

export interface AgentCartItem {
  slug: string;
  name: string;
  sku: string;
  price: number;
  image: string;
  size: string;
  color: string;
  qty: number;
}

const CART_COOKIE = "kinesis-agent-cart";

function readCart(request: NextRequest): AgentCartItem[] {
  try {
    const raw = request.cookies.get(CART_COOKIE)?.value;
    if (!raw) return [];
    const decoded = JSON.parse(Buffer.from(raw, "base64").toString("utf-8"));
    return Array.isArray(decoded) ? decoded : [];
  } catch {
    return [];
  }
}

const validSize = (s: string) => /^(\d{2}|4[0-5])$/.test(s);

/* POST /api/agent/cart — addToCart()
   REVERSIBLE tool → human-in-the-loop with DB lifecycle:
   202 → pending checkpoint + signed token; resend with
   {checkpoint_id} + header 'x-human-approval: <token>' → 201. */
export async function POST(request: NextRequest) {
  const b = await readJsonBody(request);
  if (!b) return Response.json({ error: "invalid_json" }, { status: 400 });

  const refused = guardConsequential(request);
  if (refused) return refused;

  const session = await auth();
  const approver = session?.user?.id || session?.user?.email || undefined;
  const approvedToken = request.headers.get("x-human-approval");
  if (approvedToken && !approver) {
    return Response.json(
      {
        error: "human_login_required",
        hint: "sign in (Google) in this browser, then resend with the approval token",
      },
      { status: 401 },
    );
  }

  const slug = typeof b.slug === "string" ? b.slug : "";
  const size = typeof b.size === "string" ? b.size : "";
  const color = typeof b.color === "string" ? b.color : "";
  const qty = typeof b.qty === "number" && b.qty >= 1 ? Math.floor(b.qty) : 1;
  const checkpoint_id = typeof b.checkpoint_id === "string" ? b.checkpoint_id : "";

  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) {
    return Response.json(
      { error: "unknown_product", known_slugs: PRODUCTS.map((p) => p.slug) },
      { status: 404 },
    );
  }
  if (!validSize(size)) {
    return Response.json(
      { error: "invalid_size", hint: "EU sizes: 39–45" },
      { status: 400 },
    );
  }

  const amount = product.price * qty;
  const item = {
    slug: product.slug,
    name: product.name,
    sku: product.sku,
    price: product.price,
    qty,
    size,
    color,
  };

  const t0 = Date.now();
  if (!approvedToken) {
    const { id, token, expires_in_seconds } = await issueCheckpoint(
      "add_to_cart",
      amount,
      "USD",
      item,
      approver,
    );
    const checkpoint = {
      id,
      action: "add_to_cart",
      tool: "addToCart",
      item,
      amount,
      currency: "USD",
      status: "pending",
      reversible: true,
      reason: "mutates the visitor's cart state",
      human_in_the_loop: true,
    };
    await recordAudit("addToCart", "POST", 202, Date.now() - t0);
    return Response.json(
      {
        status: "requires_human_approval",
        checkpoint,
        approval_token: token,
        expires_in_seconds,
        message:
          "STOP → ASK HUMAN: this tool changes cart state. To execute, resend this exact body + field 'checkpoint_id' from the response, with header 'x-human-approval: <approval_token>'.",
        note: "WebMCP human-in-the-loop — checkpoint lifecycle lives in Postgres (GET /api/agent/checkpoints).",
      },
      { status: 202 },
    );
  }

  if (!checkpoint_id) {
    return Response.json(
      {
        error: "missing_checkpoint_id",
        hint: "echo back checkpoint.id from the 202 response in field 'checkpoint_id'",
      },
      { status: 400 },
    );
  }

  const verdict = await approveCheckpoint("add_to_cart", checkpoint_id, amount, approvedToken, approver);
  if (verdict !== "OK") {
    const status = verdict === "DB_DOWN" ? 503 : 403;
    await recordAudit("addToCart", "POST", status, Date.now() - t0);
    return Response.json(
      {
        error:
          verdict === "ALREADY"
            ? "checkpoint_already_decided"
            : verdict === "DB_DOWN"
              ? "approval_store_unreachable"
              : verdict === "WRONG_HUMAN"
                ? "checkpoint_issued_to_another_human"
                : "invalid_approval_token",
        detail: verdict,
        hint: "tokens are bound to one checkpoint and expire after 5 minutes",
      },
      { status },
    );
  }

  const cart = readCart(request).filter((x) => !(x.slug === slug && x.size === size));
  const cartItem: AgentCartItem = {
    slug: product.slug,
    name: product.name,
    sku: product.sku,
    price: product.price,
    image: product.image,
    size,
    color,
    qty,
  };
  cart.push(cartItem);

  const encoded = Buffer.from(JSON.stringify(cart)).toString("base64");
  await recordAudit("addToCart", "POST", 201, Date.now() - t0);
  const res = Response.json(
    {
      status: "approved",
      checkpoint_approved: checkpoint_id,
      action: { ...cartItem, amount, currency: "USD" },
      cart,
      cart_total: cart.reduce((n, x) => n + x.price * x.qty, 0),
      note: "Item committed to the agent cart cookie; the visitor can continue in /checkout.",
      human_readable: "/checkout",
    },
    { status: 201 },
  );
  res.headers.set("Set-Cookie", `${CART_COOKIE}=${encoded}; Path=/; SameSite=Lax; Max-Age=86400`);
  return res;
}