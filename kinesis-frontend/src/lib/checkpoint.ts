import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

/* ============================================================
   CHECKPOINT SECURITY — WebMCP human-in-the-loop hardening.
   Per W3C WebMCP security review (2026): a checkpoint must not be
   a static string. This module issues ONE-TIME signed approval tokens
   (HMAC-SHA256, 5 min TTL) and adds CSRF + rate-limit guards.

   SERVER-ONLY — never import from client components.
   ============================================================ */

const SECRET =
  process.env.KINESIS_CHECKPOINT_SECRET ?? `kinesis-dev-secret-${process.pid}`;
const TTL_MS = 5 * 60 * 1000; /* tokens expire after 5 minutes */

function sign(payload: string): Buffer {
  return createHmac("sha256", SECRET).update(payload).digest();
}

function b64(b: Buffer): string {
  return b
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function unb64(s: string): Buffer {
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

/* issueToken → "v1.eyJ...p17.ytJ...sig"  bound to action + checkpoint id + amount */
export function issueApprovalToken(action: string, id: string, amount: number): string {
  const payload = `${action}|${id}|${amount}|${Date.now() + TTL_MS}`;
  return `v1.${b64(Buffer.from(payload, "utf-8"))}.${b64(sign(payload))}`;
}

export function verifyApprovalToken(
  token: string | null,
  action: string,
  id: string,
  amount: number,
): boolean {
  if (!token) return false;
  const [ver, p64, s64] = token.split(".");
  if (ver !== "v1" || !p64 || !s64) return false;
  try {
    const payload = Buffer.from(p64.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8");
    const [tAction, tId, tAmount, tExpiry] = payload.split("|");
    if (tAction !== action || tId !== id || Number(tAmount) !== amount) return false;
    if (Number(tExpiry) < Date.now()) return false;
    const expected = sign(payload);
    const given = unb64(s64);
    if (expected.length !== given.length) return false;
    return timingSafeEqual(expected, given);
  } catch {
    return false;
  }
}

/* ---------- CSRF guard ----------
   Browsers always send Origin on POST. Agents/curl (no Origin) are allowed,
   but a cross-site page can never invoke a consequential tool. */
export function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const o = new URL(origin);
    const u = new URL(request.url);
    return o.host === u.host && o.protocol === u.protocol;
  } catch {
    return false;
  }
}

/* ---------- Rate limiting (in-memory sliding window) ---------- */
const WINDOW_MS = 60_000;
const buckets = new Map<string, number[]>();

export function rateLimit(key: string, limit = 12): boolean {
  const now = Date.now();
  const arr = (buckets.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= limit) {
    buckets.set(key, arr);
    return false;
  }
  arr.push(now);
  buckets.set(key, arr);
  return true;
}

export function clientKey(request: NextRequest): string {
  /* Next 16 dropped request.ip/geo; use forwarded headers (proxy-safe),
     fall back to a shared demo bucket when unknown. */
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  return "local";
}