"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const AVATAR =
  "https://lh3.googleusercontent.com/aida/AEtjO1Wi5jXuIs3FPwUNC6pKq3_cDdLE2y4DMDul6fNPYYND3bJBuJzWtxhx4LaIRdVQDJX_2ijmCDbd4bdwu1Mf3jJ9bVTTH-1W4wMr-MNw0wMvVNTIzV6Yb3icJRW4Z5B8cj4No-LN3y0K9ZS8o2WPIDQgzRy4X1E2fVgaBJUNQSlqOT1tdlESUiUYd2mFG0SAuoEmO8Mo1xmAzw2OXDdJ_Ltmxacq5FLx-C7XcTPjdAsWWtY7A0dufiHtTvST";

const VAULT = [
  {
    group: "received",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKGtumhyOFa_SmxKGY2ypuzDZbBWm8FdjncMa9IvTfcT5Bb2vW5RQEV9naRlYHyduyKjeXa1G5bRtvsxh8PktUd_R4TDOzdp7AFOMxXNvYIVR3ZgLh5xzeyq6YFvE0SlLz14_-u-yxxAEUPjZ3ndjSQObYpbTBM8-rVQfZ1hcCaIRmYPjNRzyTp2LMHPllqK9ZjojRkcT9dX-9fYn7KDqvzL7HxHsn-lZBM2dr9Lz13VoQ5Wssc1xukA=s1600",
    title: "K-09 STRATOS CHRONO",
    meta: "PROTOTYPE #04 / 50 · SERIAL KNS-779X",
    status: "TẠI TƯ GIA",
    live: true,
    action: { label: "HỘ CHIẾU SỐ", href: "/passport" },
  },
  {
    group: "transit",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD73ob0Zjbm1yJWZEps94gbE1fAVpR1u1Z7WRWvfAN1fViBqp8Ztru-EQkqO9nBR5cKNlEhPLOLroKbzXZ2gi5Zro41ihYonYfXciLgXnPZy2MAxXdo4DQvq5JzaymLrVK2607FeMqukdJySM4tNNJ70-zKg8cBFJcrmu7YJ4C5QDlrtcYP6tlCyrQvV4HMDiIaSizqexxmIh4ZkNwpLFPH0cHMDgZiqhPfTREuXSyNYj8apWrwLku84g=s1600",
    title: "K-07 SOLARIS GLITCH",
    meta: "SPECIMEN #18 / 24 · DHL-ARM-99182-VN",
    status: "ĐANG VẬN CHUYỂN · PARIS IX → SGN",
    live: true,
    action: { label: "THEO DÕI GPS" },
  },
  {
    group: "milan",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqcG7j002FdKLD-nbwJfg0T2a8G2_3_ROw46hwuEmM_IXA315Rt-ihwUIPT2IczdpYR_xXN01-BNub2ECKPUfQqjTKwyvtAGyEesxCSIHmeAsrjHULDYKq9lZxfZezXV1D3f_sutivDq2eaCiGYhYt4P_EPdu3IRLw9wGkKdXBqO3Q1V1BFPnS29ORW_3SIWq4__J5pbyk20wxC-SC8xq6TFLYmoUEYyR7a6IFgRH0RaWLd5cupgeKTw=s1600",
    title: "K-01 PHANTOM MATRIX",
    meta: "FOUNDERS #02 / 10 · BOX 082",
    status: "KHO LẠNH MILAN · MINT 10/10",
    live: false,
    action: { label: "YÊU CẦU XUẤT KHO" },
  },
];

const TABS = [
  ["all", "TẤT CẢ"],
  ["received", "ĐÃ NHẬN"],
  ["transit", "ĐANG VẬN CHUYỂN"],
  ["milan", "KHO MILAN"],
] as const;

const PRIVILEGES = [
  {
    icon: "timer_10",
    title: "Ưu tiên mua drop trước 60 phút",
    body: "Allocation hash riêng cho mọi capsule giới hạn trước khi mở bán công khai.",
  },
  {
    icon: "room_service",
    title: "Fitting 1-kèm-1 Paris / Tokyo",
    body: "Phòng thử VIP biệt lập, đo bespoke cùng Giám đốc Kỹ thuật Biomechanics.",
  },
  {
    icon: "precision_manufacturing",
    title: "Khắc laser & sơn mài thủ công",
    body: "Định danh tọa độ chìm + sơn mài chống ăn mòn, miễn phí mọi đơn hàng.",
  },
];

const LOGS = [
  ["#ORD-8924", "K-09 Stratos Chrono + K-07 Solaris Glitch", "26/10/2025", "$1,420", "ĐANG ĐIỀU PHỐI"],
  ["#ORD-7710", "K-01 Phantom Matrix (Founders)", "14/08/2025", "$590", "HOÀN TẤT"],
  ["#ORD-6502", "Khắc laser & sơn mài bespoke", "02/07/2025", "MIỄN PHÍ", "ĐÃ BÀN GIAO"],
];

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
  created_at: string;
}

export default function VaultClient() {
  const [tab, setTab] = useState<string>("all");
  const shown = tab === "all" ? VAULT : VAULT.filter((v) => v.group === tab);
  const { data: session } = useSession();
  const [mine, setMine] = useState<MyOrder[]>([]);

  useEffect(() => {
    let alive = true;
    if (!session?.user) return;
    fetch("/api/orders/mine")
      .then((r) => (r.ok ? r.json() : { orders: [] }))
      .then((d: { orders?: MyOrder[] }) => alive && setMine(d.orders ?? []))
      .catch(() => alive && setMine([]));
    return () => {
      alive = false;
    };
  }, [session]);

  const myRows = (session?.user ? mine : []).map((o) => [
    o.id,
    `Đơn hàng ${o.id}`,
    new Date(o.created_at).toLocaleDateString("vi-VN"),
    `${o.amount_vnd.toLocaleString("vi-VN")} VNĐ`,
    STATUS_VI[o.status] ?? o.status.toUpperCase(),
  ] as string[]);
  const logs = [...myRows, ...LOGS];

  return (
    <div className="mx-auto max-w-6xl px-gutter-mobile py-space-xl lg:px-gutter-desktop lg:py-space-2xl">
      {/* ---------- Header ---------- */}
      <div className="flex flex-wrap items-end justify-between gap-space-sm">
        <div>
          <p className="font-label-micro text-label-micro uppercase tracking-widest text-secondary">
            MEMBERS ONLY
          </p>
          <h1 className="mt-space-2xs font-headline-md text-headline-md uppercase tracking-tight text-primary">
            Syndicate Vault
          </h1>
        </div>
        <p className="flex items-center gap-space-2xs font-label-technical text-label-technical uppercase tracking-widest">
          <span className="material-symbols-outlined text-base text-primary-container">diamond</span>
          <span className="text-primary-container">OBSIDIAN ELITE</span>
          <span className="text-secondary/40">·</span>
          <span className="text-secondary">LVL 03/04</span>
        </p>
      </div>

      {/* ---------- Profile strip ---------- */}
      <div className="mt-space-lg flex flex-col gap-space-md border-y border-surface-container-highest py-space-lg sm:flex-row sm:items-center">
        <div className="relative size-16 shrink-0 overflow-hidden bg-surface-container-lowest">
          <Image
            src={AVATAR}
            alt="Alexander Trần"
            fill
            sizes="64px"
            className="object-cover grayscale"
            unoptimized
          />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-label-technical text-label-technical text-lg font-bold uppercase tracking-wider text-primary">
            ALEXANDER TRẦN
          </h2>
          <p className="mt-space-3xs font-label-micro text-label-micro uppercase tracking-widest text-secondary">
            SYN-9941-X · PARIS IX / TOKYO · EU 42.5 · LAB VERIFIED 99.8%
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-space-lg font-label-technical text-label-technical">
          {[
            ["06", "SỞ HỮU"],
            ["02", "ĐANG GIA CÔNG"],
            ["01", "VẬN CHUYỂN"],
          ].map(([n, label]) => (
            <div key={label} className="text-center">
              <p className="text-xl font-bold text-primary">{n}</p>
              <p className="font-label-micro text-label-micro uppercase tracking-widest text-secondary">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Tier progress (slim) ---------- */}
      <div className="mt-space-md flex items-center gap-space-md">
        <p className="shrink-0 font-label-micro text-label-micro uppercase tracking-widest text-secondary">
          CHRONO MONOLITH · 82%
        </p>
        <div className="h-1 flex-1 bg-surface-container-highest">
          <div className="h-full w-[82%] bg-primary-container" />
        </div>
        <p className="shrink-0 font-label-micro text-label-micro uppercase tracking-widest text-secondary">
          8,200 / 10,000 XP
        </p>
      </div>

      {/* ---------- Collection ---------- */}
      <div className="mt-space-2xl flex flex-wrap items-end justify-between gap-space-sm">
        <h2 className="font-label-technical text-label-technical font-bold uppercase tracking-widest text-primary">
          Bộ sưu tập · {String(shown.length).padStart(2, "0")}
        </h2>
        <div className="flex gap-space-md">
          {TABS.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`font-label-micro text-label-micro uppercase tracking-widest transition-colors ${
                tab === key ? "text-primary-container" : "text-secondary/60 hover:text-primary"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-space-md grid grid-cols-1 gap-space-lg sm:grid-cols-3">
        {shown.map((v) => (
          <article key={v.title} className="group">
            <div className="relative aspect-[4/3] overflow-hidden bg-surface-container-lowest">
              <Image
                src={v.img}
                alt={v.title}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                unoptimized
              />
            </div>
            <h3 className="mt-space-sm font-label-technical text-label-technical font-bold uppercase tracking-wider text-primary">
              {v.title}
            </h3>
            <p className="mt-space-3xs font-label-micro text-label-micro uppercase tracking-widest text-secondary">
              {v.meta}
            </p>
            <p className="mt-space-3xs flex items-center gap-space-2xs font-label-micro text-label-micro uppercase tracking-widest text-primary-container">
              {v.live && <span className="size-1.5 animate-pulse rounded-full bg-primary-container" />}
              {v.status}
            </p>
            {v.action.href ? (
              <Link
                href={v.action.href}
                className="mt-space-xs inline-block font-label-micro text-label-micro uppercase tracking-widest text-primary underline-offset-4 hover:text-primary-container hover:underline"
              >
                {v.action.label} →
              </Link>
            ) : (
              <button className="mt-space-xs font-label-micro text-label-micro uppercase tracking-widest text-secondary transition-colors hover:text-primary-container">
                {v.action.label} →
              </button>
            )}
          </article>
        ))}
      </div>

      {/* ---------- Privileges ---------- */}
      <h2 className="mt-space-2xl font-label-technical text-label-technical font-bold uppercase tracking-widest text-primary">
        Đặc quyền Syndicate
      </h2>
      <div className="mt-space-md grid grid-cols-1 gap-space-lg border-t border-surface-container-highest pt-space-lg sm:grid-cols-3">
        {PRIVILEGES.map((p) => (
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

      {/* ---------- Transactions ---------- */}
      <h2 className="mt-space-2xl font-label-technical text-label-technical font-bold uppercase tracking-widest text-primary">
        Lịch sử giao dịch
      </h2>
      <div className="mt-space-md border-t border-surface-container-highest">
        {logs.map(([id, item, date, value, status]) => (
          <div
            key={id}
            className="grid grid-cols-12 items-baseline gap-space-xs border-b border-surface-container-highest py-space-sm font-label-technical text-label-technical"
          >
            <span className="col-span-3 font-mono text-primary sm:col-span-2">{id}</span>
            <span className="col-span-9 text-primary sm:col-span-5">{item}</span>
            <span className="col-span-4 text-secondary sm:col-span-2">{date}</span>
            <span className="col-span-4 font-bold text-primary-container sm:col-span-1 sm:text-right">
              {value}
            </span>
            <span className="col-span-4 text-right font-label-micro text-label-micro uppercase tracking-widest text-secondary sm:col-span-2">
              {status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
