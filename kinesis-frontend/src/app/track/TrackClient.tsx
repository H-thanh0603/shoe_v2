"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

/* Guest/member order status. Authorization = possession of the token that
   was emailed with the order; the server never returns the token itself. */

interface TrackItem {
  name: string;
  size: string;
  color: string;
  qty: number;
  price_vnd: number;
}
interface TrackOrder {
  id: string;
  status: string;
  created_at: string;
  eta_days: string;
  tracking_code: string;
  carrier: string;
  payment: string;
  amount_vnd: number;
  name: string;
  canCancel: boolean;
  items: TrackItem[];
}

const STATUS_VI: Record<string, string> = {
  pending: "Chờ thanh toán",
  paid: "Đã thanh toán",
  confirmed: "Đã xác nhận",
  shipped: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
  failed: "Trượt thanh toán / hết hạn",
};

const FLOW = ["pending", "paid", "confirmed", "shipped", "delivered"] as const;

export default function TrackClient() {
  const params = useSearchParams();
  const orderId = params.get("order") ?? "";
  const token = params.get("token") ?? "";
  const [order, setOrder] = useState<TrackOrder | null>(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);

  async function load() {
    setError("");
    try {
      const res = await fetch(
        `/api/orders/track?order=${encodeURIComponent(orderId)}&token=${encodeURIComponent(token)}`,
      );
      const data = (await res.json()) as { order?: TrackOrder; error?: string };
      if (!res.ok || !data.order) {
        setOrder(null);
        setError(orderId && token ? "Không tìm thấy đơn hàng với đường dẫn này." : "Đường dẫn không hợp lệ.");
        return;
      }
      setOrder(data.order);
    } catch {
      setError("Lỗi kết nối — thử lại sau.");
    } finally {
      setLoaded(true);
    }
  }

  useState(() => {
    if (orderId) void load();
  });

  async function cancel() {
    if (!order || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: order.id, token }),
      });
      if (res.ok) await load();
      else setError("Không thể hủy đơn (đơn chỉ hủy được khi còn chờ thanh toán).");
    } finally {
      setBusy(false);
    }
  }

  const step = order ? FLOW.indexOf(order.status as (typeof FLOW)[number]) : -1;

  return (
    <div className="mx-auto max-w-3xl px-gutter-mobile py-space-xl lg:px-gutter-desktop lg:py-space-2xl">
      <p className="font-label-micro text-label-micro uppercase tracking-widest text-secondary">
        KINESIS / ATELIER
      </p>
      <h1 className="mt-space-2xs font-headline-md text-headline-md uppercase tracking-tight text-primary">
        Trạng thái đơn hàng
      </h1>
      {!loaded && (orderId ? null : (
        <p className="mt-space-lg font-body-md text-body-md text-secondary">
          Mở đường dẫn theo dõi trong email xác nhận đơn hàng của bạn.
        </p>
      ))}
      {loaded && error && (
        <p className="mt-space-lg border border-surface-container-highest bg-surface-container-low p-space-md font-body-md text-body-md text-error">
          {error}
        </p>
      )}
      {order && (
        <div className="mt-space-lg space-y-space-lg">
          <div className="flex flex-wrap items-baseline justify-between gap-space-xs border-b border-surface-container-highest pb-space-sm">
            <span className="font-label-technical text-label-technical font-bold uppercase tracking-widest text-primary">
              {order.id}
            </span>
            <span className="font-label-technical text-label-technical uppercase tracking-widest text-primary-container">
              {STATUS_VI[order.status] ?? order.status}
            </span>
          </div>

          {(order.status === "pending" || order.status === "paid" || order.status === "confirmed" || order.status === "shipped" || order.status === "delivered") && (
            <div className="grid grid-cols-5 gap-space-2xs">
              {FLOW.map((s, i) => (
                <div key={s} className="text-center">
                  <div
                    className={`h-1 w-full ${
                      step >= 0 && i <= step ? "bg-primary-container" : "bg-surface-container-highest"
                    }`}
                  />
                  <p className="mt-space-2xs font-label-micro text-label-micro uppercase tracking-widest text-secondary">
                    {STATUS_VI[s]}
                  </p>
                </div>
              ))}
            </div>
          )}

          {order.status === "shipped" && order.tracking_code && (
            <p className="font-label-technical text-label-technical uppercase tracking-wider text-primary">
              Vận đơn: <span className="text-primary-container">{order.tracking_code}</span>
              {order.carrier && ` · ${order.carrier}`}
            </p>
          )}
          {order.eta_days && order.status !== "delivered" && order.status !== "cancelled" && order.status !== "failed" && (
            <p className="font-body-sm text-body-sm text-secondary">Dự kiến giao: {order.eta_days}</p>
          )}

          <div className="border-t border-surface-container-highest">
            {order.items.map((it, i) => (
              <div
                key={i}
                className="flex items-baseline justify-between gap-space-sm border-b border-surface-container-highest/60 py-space-sm font-label-technical text-label-technical"
              >
                <span className="text-primary">
                  {it.name} · EU {it.size} · {it.color} × {it.qty}
                </span>
                <span className="shrink-0 text-secondary">
                  {(it.price_vnd * it.qty).toLocaleString("vi-VN")}₫
                </span>
              </div>
            ))}
            <div className="flex items-baseline justify-between py-space-sm font-label-technical text-label-technical">
              <span className="uppercase tracking-widest text-secondary">Tổng thanh toán ({order.payment === "cod" ? "COD" : "VNPay"})</span>
              <span className="font-bold text-primary">{order.amount_vnd.toLocaleString("vi-VN")}₫</span>
            </div>
          </div>

          {order.canCancel && (
            <button
              onClick={cancel}
              disabled={busy}
              className="border border-surface-container-highest px-space-md py-space-sm font-label-technical text-label-technical uppercase tracking-widest text-secondary transition-colors hover:border-error hover:text-error disabled:opacity-40"
            >
              {busy ? "Đang hủy…" : "HỦY ĐƠN NÀY (khi còn chờ thanh toán)"}
            </button>
          )}
          <p className="font-label-micro text-label-micro uppercase tracking-widest text-secondary/60">
            Cần hỗ trợ? Reply email xác nhận đơn — đội shop trả lời trong giờ làm việc.
          </p>
        </div>
      )}
      <Link href="/gallery" className="mt-space-xl inline-block font-label-technical text-label-technical uppercase tracking-widest text-primary-container hover:underline">
        ← VỀ ARCHIVE
      </Link>
    </div>
  );
}
