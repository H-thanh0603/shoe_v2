"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { STITCH, formatUSD } from "@/lib/data";

const TERRAINS = [
  {
    key: "track",
    slug: "k-12-titan-runner",
    icon: "speed",
    label: "ĐƯỜNG ĐUA",
    desc: "Tốc độ tối đa, phản hồi tức thì",
    img: STITCH.k12,
    name: "K-12 TITAN RUNNER",
    series: "SERIES 12 // BIOMECHANICAL",
    price: 620,
    specs: ["Đế phản lực Volt năng động", "Khuyên Titanium nguyên khối", "280G siêu nhẹ"],
  },
  {
    key: "street",
    slug: "k-07-solaris-glitch",
    icon: "nights_stay",
    label: "PHỐ ĐÊM",
    desc: "Tuyên ngôn thị giác, chrome lỏng",
    img: STITCH.k07,
    name: "K-07 SOLARIS GLITCH",
    series: "SERIES 07 // LIQUID CHROME",
    price: 740,
    specs: ["Phủ thủy ngân lỏng biến sắc", "Túi khí điều áp kỹ thuật số", "Chỉ còn 18 đôi"],
  },
  {
    key: "lab",
    slug: "k-09-stratos-chrono",
    icon: "science",
    label: "PHÒNG LAB",
    desc: "Sưu tầm, nguyên mẫu giới hạn",
    img: STITCH.k09,
    name: "K-09 STRATOS CHRONO",
    series: "SERIES 09 // PROTO SPEC",
    price: 680,
    specs: ["Khung carbon nguyên khối", "Khóa Titanium Grade 5", "Edition 500 đôi"],
  },
] as const;

export default function SilhouetteFinder() {
  const [active, setActive] = useState<(typeof TERRAINS)[number]>(TERRAINS[0]);

  return (
    <section className="w-full bg-surface py-space-4xl">
      <div className="mx-auto max-w-[1400px] px-gutter-mobile lg:px-gutter-desktop">
        <div className="flex items-center gap-space-xs font-label-technical text-label-technical uppercase text-primary-container">
          <span className="material-symbols-outlined text-[16px]">explore</span>
          <span>04 // SILHOUETTE FINDER</span>
        </div>
        <div className="mt-space-2xs flex flex-col justify-between gap-space-md lg:flex-row lg:items-end">
          <h2 className="font-display-lg text-display-lg uppercase leading-none tracking-tight text-primary">
            TÌM SILHOUETTE
            <br />
            CỦA <span className="text-primary-container">BẠN</span>
          </h2>
          <p className="max-w-md font-body-lg text-body-lg text-secondary">
            Chọn địa hình của bạn — Atelier sẽ chỉ định hiện vật phù hợp nhất với chuyển động
            của bạn.
          </p>
        </div>

        {/* Terrain selector */}
        <div className="mt-space-xl grid grid-cols-1 gap-space-sm sm:grid-cols-3">
          {TERRAINS.map((t) => {
            const on = active.key === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActive(t)}
                className={`flex items-center gap-space-md border p-space-md text-left transition-colors ${
                  on
                    ? "border-primary-container bg-surface-container"
                    : "border-surface-container-highest bg-transparent hover:border-secondary/50"
                }`}
              >
                <span
                  className={`grid size-11 shrink-0 place-items-center ${
                    on ? "bg-primary-container text-on-primary-container" : "bg-surface-container-high text-secondary"
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">{t.icon}</span>
                </span>
                <span>
                  <span className={`block font-label-technical text-label-technical font-bold uppercase tracking-widest ${on ? "text-primary" : "text-secondary"}`}>
                    {t.label}
                  </span>
                  <span className="mt-space-3xs block font-body-sm text-body-sm text-secondary">
                    {t.desc}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Result */}
        <div key={active.key} className="mt-space-lg grid grid-cols-1 overflow-hidden bg-surface-container lg:grid-cols-2">
          <div className="relative min-h-[320px] overflow-hidden lg:min-h-[420px]">
            <Image
              src={active.img}
              alt={active.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              unoptimized
            />
            <span className="absolute top-space-md left-space-md bg-surface-container-lowest/90 px-space-sm py-space-2xs font-label-micro text-label-micro uppercase tracking-widest text-primary-container backdrop-blur">
              ĐỀ XUẤT CHO BẠN
            </span>
          </div>
          <div className="flex flex-col justify-center p-space-xl lg:p-space-2xl">
            <p className="font-label-micro text-label-micro uppercase tracking-widest text-primary-container">
              {active.series}
            </p>
            <h3 className="mt-space-xs font-headline-md text-headline-md uppercase tracking-tight text-primary">
              {active.name}
            </h3>
            <ul className="mt-space-md space-y-space-xs">
              {active.specs.map((sp) => (
                <li key={sp} className="flex items-center gap-space-xs font-body-md text-body-md text-secondary">
                  <span className="size-1.5 shrink-0 bg-primary-container" />
                  {sp}
                </li>
              ))}
            </ul>
            <div className="mt-space-lg flex flex-wrap items-center gap-space-md">
              <span className="font-headline-sm text-headline-sm font-bold text-primary">
                {formatUSD(active.price)}
              </span>
              <Link
                href={`/artifact/${active.slug}`}
                className="flex items-center gap-space-xs bg-primary-container px-space-xl py-space-sm font-label-technical text-label-technical font-bold uppercase tracking-widest text-on-primary-container transition-colors hover:bg-primary hover:text-on-secondary"
              >
                <span>XEM HIỆN VẬT</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
