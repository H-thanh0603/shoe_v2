"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const input =
  "h-10 w-full border border-surface-container-highest bg-surface px-space-sm font-body-md text-body-md text-primary placeholder:text-secondary/40 focus:border-primary-container focus:outline-none";

export default function NewProductForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [sizes, setSizes] = useState("39,40,41,42,43,44,45");

  async function create() {
    const priceVnd = Number(price);
    if (!slug.trim() || !sku.trim() || !name.trim() || !Number.isInteger(priceVnd) || priceVnd < 0) {
      setMsg("Điền slug/sku/tên + giá nguyên ≥ 0");
      return;
    }
    setBusy(true);
    setMsg("");
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: slug.trim().toLowerCase(),
        sku: sku.trim(),
        name: name.trim(),
        price_vnd: priceVnd,
        sizes: sizes.split(",").map((s) => s.trim()).filter(Boolean),
      }),
    });
    const data = (await res.json()) as { ok?: boolean; error?: string };
    setBusy(false);
    if (!res.ok) {
      setMsg(`Lỗi: ${data.error ?? res.status}`);
      return;
    }
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="bg-primary-container px-space-lg py-space-sm font-label-technical text-label-technical font-bold uppercase tracking-widest text-on-primary-container"
      >
        + THÊM SẢN PHẨM
      </button>
    );
  }

  return (
    <div className="border border-surface-container-highest p-space-md">
      {msg && (
        <p className="mb-space-sm font-label-micro text-label-micro uppercase tracking-widest text-error">{msg}</p>
      )}
      <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-3">
        <input className={input} placeholder="slug (vd: k-13-nova)" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <input className={input} placeholder="SKU" value={sku} onChange={(e) => setSku(e.target.value)} />
        <input className={input} placeholder="Tên sản phẩm" value={name} onChange={(e) => setName(e.target.value)} />
        <input className={input} placeholder="Giá VNĐ" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input className={input} placeholder="Sizes (cách nhau dấu phẩy)" value={sizes} onChange={(e) => setSizes(e.target.value)} />
      </div>
      <div className="mt-space-sm flex gap-space-xs">
        <button
          disabled={busy}
          onClick={create}
          className="bg-primary-container px-space-lg py-space-sm font-label-technical text-label-technical font-bold uppercase tracking-widest text-on-primary-container disabled:opacity-40"
        >
          TẠO
        </button>
        <button
          onClick={() => setOpen(false)}
          className="border border-surface-container-highest px-space-lg py-space-sm font-label-technical text-label-technical uppercase tracking-widest text-secondary"
        >
          HỦY
        </button>
      </div>
    </div>
  );
}
