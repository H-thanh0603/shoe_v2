import type { NextRequest } from "next/server";
import { PRODUCTS } from "@/lib/data";
import { guardConsequential, readJsonBody } from "../_shared";
import { recordAudit } from "@/lib/audit-db";
import { issueCheckpoint, approveCheckpoint, persistOrder } from "@/lib/checkpoint-db";

/* POST /api/agent/order — createOrder()
   CONSEQUENTIAL tool → hard human boundary:
   without a valid signed approval token the server returns 402 with the
   exact checkpoint an agent must surface to its human operator. */
export async function POST(request: NextRequest) {
  const b = await readJsonBody(request);
  if (!b) return Response.json({ error: "invalid_json" }, { status: 400 });

  const refused = guardConsequential(request);
  if (refused) return refused;

  const slug = typeof b.slug === "string" ? b.slug : "";
  const size = typeof b.size === "string" ? b.size : "";
  const qty = typeof b.qty === "number" && b.qty >= 1 ? Math.floor(b.qty) : 1;
  const checkpoint_id = typeof b.checkpoint_id === "string" ? b.checkpoint_id : "";

  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) {
    return Response.json(
      { error: "unknown_product", known_slugs: PRODUCTS.map((p) => p.slug) },
      { status: 404 },
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
  };

  const t0 = Date.now();
  const approvedToken = request.headers.get("x-human-approval");
  if (!approvedToken) {
    const { id, token, expires_in_seconds } = await issueCheckpoint(
      "create_order",
      amount,
      "USD",
      item,
    );
    const checkpoint = {
      id,
      action: "create_order",
      tool: "createOrder",
      item,
      amount,
      currency: "USD",
      status: "pending",
      reversible: false,
      consequential: true,
      reason: "creates a paid order binding the atelier and minting a digital passport",
      human_in_the_loop: true,
    };
    await recordAudit("createOrder", "POST", 402, Date.now() - t0);
    return Response.json(
      {
        error: "human_approval_required",
        checkpoint,
        approval_token: token,
        expires_in_seconds,
        message:
          "STOP → ASK HUMAN: consequential action. To execute, resend this exact body + field 'checkpoint_id' from the response, with header 'x-human-approval: <approval_token>'.",
        note: "READ-ONLY tools never reach this boundary. WebMCP security is NOT solved by trust — it is enforced by DB-backed checkpoints.",
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
  const verdict = await approveCheckpoint("create_order", checkpoint_id, amount, approvedToken);
  if (verdict !== "OK") {
    await recordAudit("createOrder", "POST", 403, Date.now() - t0);
    return Response.json(
      {
        error:
          verdict === "ALREADY"
            ? "checkpoint_already_decided"
            : verdict === "EXPIRED"
              ? "checkpoint_expired"
              : verdict === "UNKNOWN"
                ? "unknown_checkpoint"
                : "invalid_approval_token",
        detail: verdict,
        hint: "tokens are bound to one checkpoint and expire after 5 minutes",
      },
      { status: 403 },
    );
  }

  const txRef = `TX-${String(Math.floor(Math.random() * 9000) + 1000)}`;
  const orderId = `ORD-${String(Date.now()).slice(-6)}-${size}`;
  const passportHash = `0x${bufferHash(`${product.sku}:${size}:${orderId}`)}`;

  await persistOrder({
    order_id: orderId,
    checkpoint_id,
    tx_ref: txRef,
    slug: product.slug,
    sku: product.sku,
    name: product.name,
    size,
    qty,
    amount,
    currency: "USD",
    passport_hash: passportHash,
  });

  await recordAudit("createOrder", "POST", 201, Date.now() - t0);

  return Response.json(
    {
      status: "MINTED",
      order_id: orderId,
      tx_ref: txRef,
      approved_at: new Date().toISOString(),
      item: { slug: product.slug, name: product.name, sku: product.sku, size, qty },
      amount,
      currency: "USD",
      passport: {
        minted: true,
        chip: "NFC SEAL",
        hash: passportHash,
        policy: "digital passport — see /passport",
      },
      note: "Order persisted to Postgres. Payment is delegated back to the human (browser checkout).",
      human_readable: "/passport",
    },
    { status: 201 },
  );
}

/* Tiny FNV-1a digest for demo order hashes. */
function bufferHash(input: string): string {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = (h * 16777619) & 0xffffffff;
  }
  return (h ^ (h >> 16)).toString(16).padStart(8, "0");
}