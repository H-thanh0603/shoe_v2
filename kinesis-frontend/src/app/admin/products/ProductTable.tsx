"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ProductAdmin } from "@/lib/shop-products";

const input =
  "h-9 w-full border border-surface-container-highest bg-surface px-space-xs font-label-technical text-label-technical text-primary focus:border-primary-container focus:outline-none";

export default function ProductTable({ products }: { products: ProductAdmin[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [draft, setDraft] = useState<Record<string, { price: string; status: string; stock: Record<string, string> }>>({});

  const d = (p: ProductAdmin) =>
    draft[p.slug] ?? {
      price: String(p.price_vnd),
      status: p.status,
      stock: Object.fromEntries(p.sizes.map((s) => [s, String(p.stock[s] ?? 0)])),
    };

  const set = (slug: string, patch: Partial<{ price: string; status: string; stock: Record<string, string> }>, base: ProductAdmin) =>
    setDraft((prev) => ({ ...prev, [slug]: { ...d(base), ...patch } }));

  async function save(p: ProductAdmin) {
    const cur = d(p);
    const price = Number(cur.price);
    const stock: Record<string, number> = {};
    for (const [size, v] of Object.entries(cur.stock)) stock[size] = Number(v);
    if (!Number.isInteger(price) || price < 0 || Object.values(stock).some((q) => !Number.isInteger(q) || q < 0)) {
      setMsg("Giá/tồn kho phải là số nguyên ≥ 0");
      return;
    }
    setBusy(p.slug);
    setMsg("");
    const res = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: p.slug, fields: { price_vnd: price, status: cur.status }, stock }),
    });
    const data = (await res.json()) as { ok?: boolean; error?: string };
    setBusy(null);
    if (!res.ok) {
      setMsg(`Lỗi: ${data.error ?? res.status}`);
      return;
    }
    setMsg(`Đã lưu ${p.slug}`);
    router.refresh();
  }

  return (
    <div>
      {msg && (
        <p className="mb-space-sm font-label-micro text-label-micro uppercase tracking-widest text-primary-container">
          {msg}
        </p>
      )}
      <div className="overflow-x-auto border border-surface-container-highest">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="border-b border-surface-container-highest font-label-micro text-label-micro uppercase tracking-widest text-secondary">
              <th className="px-space-md py-space-sm">Sản phẩm</th>
              <th className="px-space-md py-space-sm">Giá (VNĐ)</th>
              <th className="px-space-md py-space-sm">Trạng thái</th>
              <th className="px-space-md py-space-sm">Tồn kho theo size</th>
              <th className="px-space-md py-space-sm"></th>
            </tr>
          </thead>
          <tbody className="font-body-sm text-body-sm text-primary">
            {products.map((p) => (
              <tr key={p.slug} className="border-b border-surface-container-highest/50 align-top">
                <td className="px-space-md py-space-sm">
                  <p className="font-label-technical font-bold">{p.name}</p>
                  <p className="font-mono text-secondary">{p.slug} · {p.sku}</p>
                </td>
                <td className="px-space-md py-space-sm">
                  <input
                    className={input}
                    inputMode="numeric"
                    value={d(p).price}
                    onChange={(e) => set(p.slug, { price: e.target.value }, p)}
                  />
                </td>
                <td className="px-space-md py-space-sm">
                  <select
                    className={input}
                    value={d(p).status}
                    onChange={(e) => set(p.slug, { status: e.target.value }, p)}
                  >
                    {["LIVE", "UPCOMING", "SOLD OUT"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-space-md py-space-sm">
                  <div className="grid grid-cols-4 gap-space-2xs">
                    {p.sizes.map((s) => (
                      <label key={s} className="block">
                        <span className="font-label-micro text-label-micro text-secondary">EU {s}</span>
                        <input
                          className={input}
                          inputMode="numeric"
                          value={d(p).stock[s] ?? "0"}
                          onChange={(e) => set(p.slug, { stock: { ...d(p).stock, [s]: e.target.value } }, p)}
                        />
                      </label>
                    ))}
                  </div>
                </td>
                <td className="px-space-md py-space-sm">
                  <button
                    disabled={busy === p.slug}
                    onClick={() => save(p)}
                    className="border border-surface-container-highest px-space-md py-space-2xs font-label-technical text-label-technical uppercase tracking-widest text-primary-container transition-colors hover:border-primary-container disabled:opacity-40"
                  >
                    {busy === p.slug ? "…" : "LƯU"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
