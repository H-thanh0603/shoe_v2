"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const STATUS_VI: Record<string, string> = {
  pending: "CHỜ THANH TOÁN",
  paid: "ĐÃ THANH TOÁN",
  confirmed: "ĐANG ĐIỀU PHỐI",
  shipped: "ĐANG GIAO",
  delivered: "ĐÃ BÀN GIAO",
  cancelled: "ĐÃ HỦY",
  failed: "THẤT BẠI",
};

interface MyOrder {
  id: string;
  amount_vnd: number;
  status: string;
  payment: string;
  created_at: string;
}

export default function VaultClient() {
  const { data: session, status } = useSession();
  const emailKey = session?.user?.email ?? "";
  const [fetched, setFetched] = useState<{ key: string; orders: MyOrder[] } | null>(null);

  useEffect(() => {
    let alive = true;
    if (!session?.user) return;
    const key = emailKey;
    fetch("/api/orders/mine")
      .then((r) => (r.ok ? r.json() : { orders: [] }))
      .then((d: { orders?: MyOrder[] }) => alive && setFetched({ key, orders: d.orders ?? [] }))
      .catch(() => alive && setFetched({ key, orders: [] }));
    return () => {
      alive = false;
    };
  }, [session, emailKey]);

  const loaded = !!session?.user && fetched?.key === emailKey;
  const orders = loaded ? fetched!.orders : [];
  const delivered = orders.filter((o) => o.status === "delivered").length;
  const inFlight = orders.filter((o) => ["paid", "confirmed", "shipped"].includes(o.status)).length;

  return (
    <div className="mx-auto max-w-6xl px-gutter-mobile py-space-xl lg:px-gutter-desktop lg:py-space-2xl">
      {/* ---------- Header ---------- */}
      <div className="flex flex-wrap items-end justify-between gap-space-sm">
        <div>
          <p className="font-label-micro text-label-micro uppercase tracking-widest text-secondary">
            TÀI KHOẢN CỦA BẠN
          </p>
          <h1 className="mt-space-2xs font-headline-md text-headline-md uppercase tracking-tight text-primary">
            Vault — Đơn hàng & Bộ sưu tập
          </h1>
        </div>
        <p className="font-label-technical text-label-technical uppercase tracking-widest text-secondary">
          {String(orders.length).padStart(2, "0")} ĐƠN HÀNG
        </p>
      </div>

      {/* ---------- Profile strip ---------- */}
      <div className="mt-space-lg flex flex-col gap-space-md border-y border-surface-container-highest py-space-lg sm:flex-row sm:items-center">
        <div className="relative size-16 shrink-0 overflow-hidden bg-surface-container-lowest">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name ?? "avatar"}
              width={64}
              height={64}
              sizes="64px"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="grid h-full w-full place-items-center font-label-technical text-label-technical text-secondary">
              ?
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-label-technical text-label-technical text-lg font-bold uppercase tracking-wider text-primary">
            {session?.user?.name ?? (status === "loading" ? "ĐANG TẢI..." : "CHƯA ĐĂNG NHẬP")}
          </h2>
          <p className="mt-space-3xs font-label-micro text-label-micro uppercase tracking-widest text-secondary">
            {session?.user?.email ?? "Đăng nhập để đồng bộ đơn hàng giữa các thiết bị"}
          </p>
        </div>
        {session?.user && (
          <div className="flex shrink-0 items-center gap-space-lg font-label-technical text-label-technical">
            {[
              [String(delivered), "ĐÃ BÀN GIAO"],
              [String(inFlight), "ĐANG XỬ LÝ"],
              [String(orders.filter((o) => o.status === "pending").length), "CHỜ THANH TOÁN"],
            ].map(([n, label]) => (
              <div key={label} className="text-center">
                <p className="text-xl font-bold text-primary">{n}</p>
                <p className="font-label-micro text-label-micro uppercase tracking-widest text-secondary">
                  {label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---------- Orders ---------- */}
      <h2 className="mt-space-2xl font-label-technical text-label-technical font-bold uppercase tracking-widest text-primary">
        Lịch sử đơn hàng
      </h2>
      {!session?.user && status !== "loading" && (
        <div className="mt-space-md border border-surface-container-highest bg-surface-container-low p-space-xl text-center">
          <p className="font-body-md text-body-md text-secondary">
            Đăng nhập để xem đơn hàng và trạng thái giao của bạn.
          </p>
          <Link
            href="/login"
            className="mt-space-md inline-block bg-primary-container px-space-xl py-space-md font-label-technical text-label-technical font-bold uppercase tracking-widest text-on-primary-container transition-colors hover:bg-primary hover:text-on-secondary"
          >
            ĐĂNG NHẬP →
          </Link>
        </div>
      )}
      {loaded && orders.length === 0 && (
        <div className="mt-space-md border border-surface-container-highest bg-surface-container-low p-space-xl text-center">
          <p className="font-body-md text-body-md text-secondary">
            Bạn chưa có đơn hàng nào.
          </p>
          <Link
            href="/gallery"
            className="mt-space-md inline-block font-label-technical text-label-technical uppercase tracking-widest text-primary-container hover:underline"
          >
            XEM BỘ SƯU TẬP →
          </Link>
        </div>
      )}
      {orders.length > 0 && (
        <div className="mt-space-md border-t border-surface-container-highest">
          {orders.map((o) => (
            <div
              key={o.id}
              className="grid grid-cols-12 items-baseline gap-space-xs border-b border-surface-container-highest py-space-sm font-label-technical text-label-technical"
            >
              <span className="col-span-12 font-mono text-primary sm:col-span-4">{o.id}</span>
              <span className="col-span-6 text-secondary sm:col-span-2">
                {new Date(o.created_at).toLocaleDateString("vi-VN")}
              </span>
              <span className="col-span-6 text-secondary sm:col-span-2">
                {o.payment === "cod" ? "COD" : "VNPAY"}
              </span>
              <span className="col-span-6 font-bold text-primary-container sm:col-span-2 sm:text-right">
                {o.amount_vnd.toLocaleString("vi-VN")} VNĐ
              </span>
              <span className="col-span-6 text-right font-label-micro text-label-micro uppercase tracking-widest text-secondary sm:col-span-2">
                {STATUS_VI[o.status] ?? o.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ---------- Support policy ---------- */}
      <h2 className="mt-space-2xl font-label-technical text-label-technical font-bold uppercase tracking-widest text-primary">
        Chính sách hỗ trợ
      </h2>
      <div className="mt-space-md grid grid-cols-1 gap-space-lg border-t border-surface-container-highest pt-space-lg sm:grid-cols-3">
        {[
          {
            icon: "sync_alt",
            title: "Đổi size 14 ngày",
            body: "Liên hệ qua email xác nhận đơn để được hướng dẫn đổi size trong 14 ngày nhận hàng.",
          },
          {
            icon: "workspace_premium",
            title: "Hộ chiếu số theo giày",
            body: "Hồ sơ chế tác và bảo hành 24 tháng được lưu theo mã đơn trên hệ thống của shop.",
          },
          {
            icon: "mail",
            title: "Hỗ trợ qua email",
            body: "Mọi đơn hàng đều có email xác nhận — reply trực tiếp để gặp bộ phận đơn hàng.",
          },
        ].map((p) => (
          <div key={p.title} className="flex gap-space-sm">
            <span className="material-symbols-outlined shrink-0 text-xl text-primary-container">
              {p.icon}
            </span>
            <div>
              <h3 className="font-label-technical text-label-technical font-bold uppercase tracking-wider text-primary">
                {p.title}
              </h3>
              <p className="mt-space-2xs font-body-sm text-body-sm leading-5 text-secondary">
                {p.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
