import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { PRODUCTS } from "@/lib/data";
import { guardConsequential, readJsonBody } from "../_shared";
import { recordAudit } from "@/lib/audit-db";
import { issueCheckpoint, approveCheckpoint } from "@/lib/checkpoint-db";
import { createOrder } from "@/lib/shop-orders";
import { notifyOrder } from "@/lib/email";

/* POST /api/agent/order — createOrder()
   CONSEQUENTIAL tool → hard human boundary:
   without a valid signed approval token the server returns 402 with the
   exact checkpoint an agent must surface to its human operator.
   The minted order goes through the REAL commerce stack
   (@/lib/shop-orders: transaction, stock decrement, orders table). */

import { USD_TO_VND } from "@/lib/data";

export async function POST(request: NextRequest) {
  const b = await readJsonBody(request);
  if (!b) return Response.json({ error: "invalid_json" }, { status: 400 });

  const refused = guardConsequential(request);
  if (refused) return refused;

  /* The approval token alone proves nothing about WHO approved: the 402
     body hands it to the caller itself. Require the human's own login
     session on the execute leg, and record it on the checkpoint. */
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
  const email = typeof b.email === "string" ? b.email : "";
  const name = typeof b.name === "string" ? b.name : "";
  const phone = typeof b.phone === "string" ? b.phone : "";
  const address = typeof b.address === "string" ? b.address : "";
  const checkpoint_id = typeof b.checkpoint_id === "string" ? b.checkpoint_id : "";

  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) {
    return Response.json(
      { error: "unknown_product", known_slugs: PRODUCTS.map((p) => p.slug) },
      { status: 404 },
    );
  }

  const amountVnd = product.price * USD_TO_VND * qty;
  const item = {
    slug: product.slug,
    name: product.name,
    sku: product.sku,
    price_vnd: product.price * USD_TO_VND,
    qty,
    size,
  };

  const t0 = Date.now();
  if (!approvedToken) {
    const { id, token, expires_in_seconds } = await issueCheckpoint(
      "create_order",
      amountVnd,
      "VND",
      item,
    );
    const checkpoint = {
      id,
      action: "create_order",
      tool: "createOrder",
      item,
      amount: amountVnd,
      currency: "VND",
      status: "pending",
      reversible: false,
      consequential: true,
      reason: "creates a real order reserving stock from the drop ledger",
      human_in_the_loop: true,
    };
    await recordAudit("createOrder", "POST", 402, Date.now() - t0);
    return Response.json(
      {
        error: "human_approval_required",
        checkpoint,
        approval_token: token,
        expires_in_seconds,
        required_fields: { email, name, phone, address },
        message:
          "STOP → ASK HUMAN: consequential action. To execute, resend this body + customer fields (email,name,phone,address) + field 'checkpoint_id', with header 'x-human-approval: <approval_token>'.",
      },
      { status: 402 },
    );
  }
  if (!checkpoint_id) {
    return Response.json(
      {
        error: "missing_checkpoint_id",
        hint: "echo back checkpoint.id from the 402 response in field 'checkpoint_id'",
      },
      { status: 400 },
    );
  }
  const verdict = await approveCheckpoint("create_order", checkpoint_id, amountVnd, approvedToken, approver);
  if (verdict !== "OK") {
    const status = verdict === "DB_DOWN" ? 503 : 403;
    await recordAudit("createOrder", "POST", status, Date.now() - t0);
    return Response.json(
      {
        error:
          verdict === "ALREADY"
            ? "checkpoint_already_decided"
            : verdict === "EXPIRED"
              ? "checkpoint_expired"
              : verdict === "UNKNOWN"
                ? "unknown_checkpoint"
                : verdict === "DB_DOWN"
                  ? "approval_store_unreachable"
                  : "invalid_approval_token",
        detail: verdict,
        hint: "tokens are bound to one checkpoint and expire after 5 minutes",
      },
      { status },
    );
  }

  // Real commerce stack: transaction + stock decrement + orders table.
  try {
    const order = await createOrder(null, {
      email,
      name,
      phone,
      address,
      province: "",
      note: `via agent console, checkpoint ${checkpoint_id}`,
      payment: "cod",
      items: [{ slug: product.slug, size, color, qty }],
    });
    await notifyOrder(order.id, "cod_created");
    await recordAudit("createOrder", "POST", 201, Date.now() - t0);
    return Response.json(
      {
        status: "MINTED",
        order_id: order.id,
        amount_vnd: order.amountVnd,
        currency: "VND",
        approved_at: new Date().toISOString(),
        item: { slug: product.slug, name: product.name, sku: product.sku, size, qty },
        note: "Real order persisted (COD). Payment delegated to the human (browser checkout).",
        human_readable: "/checkout/result?order=" + order.id + "&status=cod",
      },
      { status: 201 },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown_error";
    const known = ["empty_cart", "invalid_qty", "invalid_customer_info", "db_unreachable"];
    const status = known.includes(msg) || /^(unknown_product|sold_out|insufficient_stock):/.test(msg) ? 400 : 500;
    await recordAudit("createOrder", "POST", status, Date.now() - t0);
    return Response.json({ error: msg }, { status });
  }
}
