"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUS_VI: Record<string, string> = {
  pending: "Chờ thanh toán",
  paid: "Đã thanh toán",
  confirmed: "Đã xác nhận",
  shipped: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
  failed: "Thất bại",
};

const NEXT: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  paid: ["confirmed", "cancelled"],
  confirmed: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
  failed: [],
};

export default function StatusCell({ orderId, status }: { orderId: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const nexts = NEXT[status] ?? [];

  async function set(next: string) {
    setBusy(true);
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status: next }),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-space-2xs">
      <span>{STATUS_VI[status] ?? status}</span>
      {nexts.map((n) => (
        <button
          key={n}
          disabled={busy}
          onClick={() => set(n)}
          className="border border-surface-container-highest px-space-2xs font-label-micro text-label-micro uppercase tracking-widest text-primary-container transition-colors hover:border-primary-container disabled:opacity-40"
        >
          → {STATUS_VI[n] ?? n}
        </button>
      ))}
    </div>
  );
}
