"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product } from "@/lib/data";
import Reveal from "@/components/Reveal";
import WishButton from "@/components/WishButton";

const FILTERS = ["TẤT CẢ", "ĐANG MỞ BÁN", "SẮP PHÁT HÀNH", "SOLD OUT"] as const;

function match(p: Product, f: (typeof FILTERS)[number]) {
  if (f === "TẤT CẢ") return true;
  if (f === "ĐANG MỞ BÁN") return p.status === "LIVE";
  if (f === "SẮP PHÁT HÀNH") return p.status === "UPCOMING";
  return p.status === "SOLD OUT";
}

function pill(status: Product["status"]) {
  if (status === "LIVE")
    return "bg-primary-container text-on-primary-container font-bold";
  if (status === "UPCOMING") return "bg-surface-container-highest text-primary font-bold";
  return "bg-surface-container-lowest/90 text-secondary";
}

function dot(status: Product["status"]) {
  if (status === "LIVE") return "bg-on-primary-container";
  if (status === "UPCOMING") return "bg-primary-container animate-pulse";
  return "bg-error";
}

export default function HomeDrops({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("TẤT CẢ");
  const shown = useMemo(() => products.filter((p) => match(p, filter)), [products, filter]);

  return (
    <>
      {/* Filter chips */}
      <div className="flex flex-wrap items-center gap-space-xs">
        {FILTERS.map((f) => {
          const n = products.filter((p) => match(p, f)).length;
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-space-md py-space-xs font-label-technical text-label-technical uppercase transition-colors ${
                active
                  ? "bg-primary-container font-bold text-on-primary-container"
                  : "bg-surface-container-high text-secondary hover:text-primary"
              }`}
            >
              {f} [{String(n).padStart(2, "0")}]
            </button>
          );
        })}
        <Link
          href="/gallery"
          className="ml-auto font-label-technical text-label-technical uppercase tracking-widest text-primary-container transition-colors hover:text-primary"
        >
          XEM TẤT CẢ TRONG ARCHIVE →
        </Link>
      </div>

      {/* Uniform grid */}
      <div className="mt-space-xl grid grid-cols-1 gap-space-lg sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 3) * 0.08} className="h-full">
          <article
            className="group flex h-full flex-col bg-surface-container transition-colors duration-300 hover:bg-surface-container-high"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-container-lowest">
            <Link href={`/artifact/${p.slug}`} className="absolute inset-0 block">
              <Image
                src={p.image}
                alt={p.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={`object-cover transition-transform duration-500 group-hover:scale-105 ${p.status === "SOLD OUT" ? "opacity-70" : ""}`}
                unoptimized
              />
              <span
                className={`absolute top-space-md left-space-md inline-flex items-center gap-space-2xs px-space-xs py-space-3xs font-label-micro text-label-micro uppercase tracking-wider ${pill(p.status)}`}
              >
                <span className={`size-1.5 rounded-full ${dot(p.status)}`} />
                {p.status === "LIVE" ? "ĐANG MỞ BÁN" : p.status === "UPCOMING" ? "SẮP PHÁT HÀNH" : "SOLD OUT"}
              </span>
              <span className="absolute right-space-md bottom-space-md bg-surface-container-lowest px-space-sm py-space-2xs font-label-technical text-label-technical font-bold text-primary">
                ${p.price} USD
              </span>
            </Link>
            <WishButton slug={p.slug} className="absolute top-space-md right-space-md z-10 size-9" />
            </div>
            <div className="flex flex-grow flex-col p-space-lg">
              <span className="font-label-micro text-label-micro uppercase text-primary-container">
                {p.series}
              </span>
              <h3 className="mt-space-3xs font-headline-sm text-headline-sm uppercase tracking-tight text-primary">
                {p.name}
              </h3>
              <p className="mt-space-xs line-clamp-2 font-body-sm text-body-sm text-secondary">
                {p.description}
              </p>
              <p className="mt-space-xs font-label-micro text-label-micro uppercase text-secondary/70">
                {p.materials.slice(0, 2).join(" · ")}
              </p>
              <div className="mt-auto pt-space-md">
                {p.status === "LIVE" ? (
                  <Link
                    href={`/artifact/${p.slug}`}
                    className="flex w-full items-center justify-center gap-space-2xs bg-primary-container py-space-sm font-label-technical text-label-technical font-bold uppercase text-on-primary-container transition-colors hover:bg-primary hover:text-on-secondary"
                  >
                    <span>MUA NGAY</span>
                    <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
                  </Link>
                ) : p.status === "UPCOMING" ? (
                  <button className="flex w-full items-center justify-center gap-space-2xs bg-surface-container-high py-space-sm font-label-technical text-label-technical font-semibold uppercase text-primary transition-colors hover:bg-surface-container-highest">
                    <span>ĐẶT TRƯỚC</span>
                    <span className="material-symbols-outlined text-[16px]">bolt</span>
                  </button>
                ) : (
                  <button className="flex w-full items-center justify-center gap-space-2xs border border-surface-container-highest py-space-sm font-label-technical text-label-technical font-semibold uppercase text-secondary transition-colors hover:border-secondary hover:text-primary">
                    <span>ĐĂNG KÝ HÀNG CHỜ</span>
                    <span className="material-symbols-outlined text-[16px]">notifications</span>
                  </button>
                )}
              </div>
            </div>
          </article>
          </Reveal>
        ))}
      </div>

      {shown.length === 0 && (
        <p className="mt-space-xl border border-surface-container-highest py-space-xl text-center font-label-technical text-label-technical uppercase tracking-widest text-secondary">
          CHƯA CÓ SẢN PHẨM TRONG NHÓM NÀY
        </p>
      )}
    </>
  );
}
