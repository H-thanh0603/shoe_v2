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

const CARRIERS = ["GHN", "GHTK", "Viettel Post", "VNPost", "Hỏa tốc"];

export default function StatusCell({
  orderId,
  status,
  tracking,
}: {
  orderId: string;
  status: string;
  tracking?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [askTrack, setAskTrack] = useState(false);
  const [code, setCode] = useState("");
  const [carrier, setCarrier] = useState(CARRIERS[0]);
  const nexts = NEXT[status] ?? [];

  async function set(next: string, shipment?: { trackingCode: string; carrier: string }) {
    setBusy(true);
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status: next, ...shipment }),
    });
    setBusy(false);
    setAskTrack(false);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-space-2xs">
      <span>
        {STATUS_VI[status] ?? status}
        {tracking && status === "shipped" && (
          <span className="ml-space-2xs font-mono text-secondary">({tracking})</span>
        )}
      </span>
      {nexts.map((n) => (
        <button
          key={n}
          disabled={busy}
          onClick={() => (n === "shipped" ? setAskTrack((v) => !v) : set(n))}
          className="border border-surface-container-highest px-space-2xs font-label-micro text-label-micro uppercase tracking-widest text-primary-container transition-colors hover:border-primary-container disabled:opacity-40"
        >
          → {STATUS_VI[n] ?? n}
        </button>
      ))}
      {askTrack && (
        <div className="mt-space-2xs flex w-full flex-wrap items-center gap-space-2xs">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="MÃ VẬN ĐƠN"
            className="h-8 w-40 border border-surface-container-highest bg-surface px-space-2xs font-mono text-sm text-primary"
          />
          <select
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
            className="h-8 border border-surface-container-highest bg-surface px-space-2xs text-sm text-primary"
          >
            {CARRIERS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            disabled={busy || !/^[A-Za-z0-9_-]{4,64}$/.test(code.trim())}
            onClick={() => set("shipped", { trackingCode: code.trim(), carrier })}
            className="h-8 border border-primary-container px-space-2xs font-label-micro text-label-micro uppercase tracking-widest text-primary-container disabled:opacity-40"
          >
            XÁC NHẬN GỬI
          </button>
          <button
            onClick={() => setAskTrack(false)}
            className="h-8 px-space-2xs font-label-micro text-label-micro uppercase tracking-widest text-secondary"
          >
            BỎ
          </button>
        </div>
      )}
    </div>
  );
}
