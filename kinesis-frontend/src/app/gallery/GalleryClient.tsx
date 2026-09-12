"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { PRODUCTS } from "@/lib/data";
import { useCart } from "@/lib/cart";
import WishButton from "@/components/WishButton";

const CATEGORIES = ["TẤT CẢ", "HYPER-RUNNING", "AVANT-GARDE LIFESTYLE", "LAB EXPERIMENTAL"] as const;
const SORTS = [
  "MỚI NHẤT // DROP DATE",
  "GIÁ CAO NHẤT // VALUE",
  "GIÁ THẤP NHẤT // ENTRY",
] as const;
const EU_SIZES = ["39", "40", "41", "42", "43", "44", "45"];

/* Gắn nhãn theo hệ màu badge của từng card Stitch */
const CAT_MAP: Record<string, string> = {
  "HYPER-RUNNING": "HYPER-RUNNING",
  "AVANT-GARDE LIFESTYLE": "AVANT-GARDE",
  "LAB EXPERIMENTAL": "LAB EXPERIMENTAL",
};

function badges(status: string) {
  switch (status) {
    case "LIVE":
      return { text: "NEW DROP", cls: "bg-primary-container text-on-primary-container font-bold" };
    case "UPCOMING":
      return { text: "ATELIER EXCLUSIVE", cls: "bg-surface-container-high text-primary font-bold" };
    default:
      return { text: "SOLD OUT", cls: "bg-error-container text-on-error-container font-bold" };
  }
}

export default function GalleryClient({ initialQuery = "" }: { initialQuery?: string }) {
  const { add } = useCart();
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("TẤT CẢ");
  const [sort, setSort] = useState<(typeof SORTS)[number]>("MỚI NHẤT // DROP DATE");
  const [maxPrice, setMaxPrice] = useState(1200);
  const [size, setSize] = useState("42");
  const [cols, setCols] = useState<3 | 2>(3);
  const [addedSlug, setAddedSlug] = useState<string | null>(null);
  const [query, setQuery] = useState(initialQuery);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = PRODUCTS.filter(
      (p) =>
        (cat === "TẤT CẢ" || p.category === CAT_MAP[cat]) &&
        p.price <= maxPrice &&
        (!q ||
          [p.name, p.sku, p.series, p.category, ...p.materials]
            .join(" ")
            .toLowerCase()
            .includes(q)),
    );
    if (sort === "GIÁ CAO NHẤT // VALUE") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "GIÁ THẤP NHẤT // ENTRY") list = [...list].sort((a, b) => a.price - b.price);
    return list;
  }, [cat, sort, maxPrice, query]);

  const quickAdd = (slug: string, name: string, sku: string, price: number, image: string) => {
    add({ slug, name, sku, price, image, size, color: "OBSIDIAN / ACID VOLT", qty: 1 });
    setAddedSlug(slug);
    setTimeout(() => setAddedSlug(null), 1500);
  };

  return (
    <>
      {/* ============ S1: REGISTRY HEAD + FILTER BAR ============ */}
      <section className="w-full bg-surface-container-lowest px-gutter-mobile pt-space-xl pb-space-lg lg:px-gutter-desktop">
        <div className="flex flex-col justify-between gap-space-md lg:flex-row lg:items-end">
          <div className="max-w-2xl space-y-space-2xs">
            <div className="flex items-center gap-space-xs font-label-micro text-label-micro uppercase tracking-widest text-secondary">
              <span className="inline-block size-2 rounded-full bg-primary-container" />
              <span>SYSTEM SPECIMEN REGISTRY {"//"} VER. 2025.4</span>
              <span className="text-secondary/40">/</span>
              <span className="text-primary-container">CURATED DROP</span>
            </div>
            <h1 className="font-headline-md text-headline-md uppercase tracking-tight text-primary">
              ARCHIVE &amp; CURRENT SPECIMENS {"//"} 2025
            </h1>
            <p className="font-body-sm text-body-sm text-secondary">
              Toàn bộ hiện vật giới hạn — Haute Couture gặp động cơ học sinh thể học.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-space-sm font-label-technical text-label-technical">
            <div className="flex items-center gap-space-xs bg-surface-container-high px-space-sm py-space-2xs text-secondary">
              <span className="text-primary-container">BATCH:</span>
              <span className="text-primary">K-SYN-04</span>
            </div>
            <div className="flex items-center gap-space-xs bg-surface-container-high px-space-sm py-space-2xs text-secondary">
              <span className="text-primary-container">GLOBAL ALLOCATION:</span>
              <span className="text-primary">18 DESIGNS</span>
            </div>
            <div className="hidden items-center gap-space-3xs bg-surface-container-high p-space-3xs sm:flex">
              <button
                onClick={() => setCols(3)}
                className={`px-space-xs py-space-3xs transition-colors ${
                  cols === 3
                    ? "bg-primary-container font-medium text-on-primary-container"
                    : "text-secondary hover:text-primary"
                }`}
              >
                GRID 3 CỘT
              </button>
              <button
                onClick={() => setCols(2)}
                className={`px-space-xs py-space-3xs transition-colors ${
                  cols === 2
                    ? "bg-primary-container font-medium text-on-primary-container"
                    : "text-secondary hover:text-primary"
                }`}
              >
                GRID 2 CỘT
              </button>
            </div>
          </div>
        </div>

        {/* Category chips + sort */}
        <div className="mt-space-lg flex flex-wrap items-center justify-between gap-space-sm bg-surface-container-low px-space-md py-space-xs">
          <div className="flex flex-wrap items-center gap-space-2xs font-label-technical text-label-technical uppercase">
            {CATEGORIES.map((c) => {
              const n =
                c === "TẤT CẢ"
                  ? PRODUCTS.length
                  : PRODUCTS.filter((p) => p.category === CAT_MAP[c]).length;
              return (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`px-space-sm py-space-2xs transition-all ${
                    cat === c
                      ? "bg-primary font-semibold tracking-wider text-surface"
                      : "bg-surface-container text-secondary hover:text-primary"
                  }`}
                >
                  {c} ({n})
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-space-sm font-label-technical text-label-technical">
            <div className="flex items-center gap-space-2xs border border-surface-container-highest bg-surface-container-high px-space-sm py-space-2xs focus-within:border-primary-container">
              <span className="material-symbols-outlined text-[16px] text-secondary">search</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="TÌM TÊN / SKU / VẬT LIỆU"
                aria-label="Tìm kiếm hiện vật"
                className="w-44 bg-transparent uppercase tracking-wider text-primary placeholder:text-secondary/40 focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Xóa tìm kiếm"
                  className="text-secondary transition-colors hover:text-primary"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>
            <span className="uppercase text-secondary/70">SẮP XẾP:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as (typeof SORTS)[number])}
              className="bg-surface-container-high px-space-sm py-space-2xs uppercase tracking-wider text-primary focus:outline-none"
            >
              {SORTS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* ============ S2: WORKSPACE — SIDEBAR + GRID ============ */}
      <section className="w-full bg-surface px-gutter-mobile py-space-xl lg:px-gutter-desktop">
        <div className="grid grid-cols-1 items-start gap-space-xl lg:grid-cols-12">
          {/* Sidebar */}
          <aside className="space-y-space-lg bg-surface-container-low p-space-md lg:col-span-3 lg:p-space-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="size-1.5 bg-primary-container" />
                <span className="font-label-technical text-label-technical font-bold uppercase tracking-widest text-primary">
                  BỘ LỌC ĐẶC TÍNH
                </span>
              </div>
              <button
                onClick={() => {
                  setMaxPrice(1200);
                  setCat("TẤT CẢ");
                  setSize("42");
                }}
                className="font-label-micro text-label-micro uppercase text-secondary transition-colors hover:text-primary-container"
              >
                ĐẶT LẠI [RESET]
              </button>
            </div>

            {/* Price range */}
            <div className="space-y-space-xs pt-space-xs">
              <div className="flex items-center justify-between font-label-technical text-label-technical">
                <span className="uppercase text-secondary">KHOẢNG GIÁ (CAP)</span>
                <span className="font-mono text-primary-container">$450 - ${maxPrice}</span>
              </div>
              <div className="relative my-space-xs h-1.5 w-full bg-surface-container-highest">
                <div
                  className="absolute h-full bg-primary-container"
                  style={{ left: 0, width: `${((maxPrice - 300) / 1550) * 100}%` }}
                />
                <div
                  className="absolute top-1/2 size-3 -translate-y-1/2 cursor-pointer bg-primary shadow-md"
                  style={{ left: `calc(${((maxPrice - 300) / 1550) * 100}% - 6px)` }}
                />
              </div>
              <input
                type="range"
                min={300}
                max={1850}
                step={10}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full cursor-pointer appearance-none bg-transparent accent-primary-container"
                aria-label="Cap giá"
              />
              <div className="flex justify-between font-label-micro text-label-micro text-secondary/60">
                <span>MIN: $300</span>
                <span>CAP: $1,850</span>
              </div>
            </div>

            {/* Size matrix */}
            <div className="space-y-space-xs pt-space-xs">
              <div className="flex items-center justify-between font-label-technical text-label-technical">
                <span className="uppercase tracking-widest text-primary">KÍCH THƯỚC (EU)</span>
                <span className="cursor-pointer font-label-micro text-label-micro text-primary-container">
                  BẢNG SIZE LAB
                </span>
              </div>
              <div className="grid grid-cols-4 gap-space-2xs font-label-technical text-label-technical">
                {EU_SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`py-space-2xs transition-colors ${
                      size === s
                        ? "bg-primary-container font-bold text-on-primary-container"
                        : "bg-surface-container-high text-secondary hover:bg-primary hover:text-on-secondary"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Color swatches */}
            <div className="space-y-space-xs pt-space-xs">
              <span className="block font-label-technical text-label-technical uppercase tracking-widest text-primary">
                HỆ MÀU SẮC CHỦ ĐẠO
              </span>
              <div className="grid grid-cols-5 gap-space-2xs pt-space-3xs">
                {[
                  ["OBSIDIAN", "bg-surface-container-lowest", "bg-surface-container-high"],
                  ["CHROME", "bg-[#c1c7cf]", "bg-surface-container-high"],
                  ["ACID VOLT", "bg-[#caf300]", "bg-surface-container-high"],
                  ["BONE", "bg-[#e5e1e4]", "bg-surface-container-high"],
                  ["CYAN", "bg-[#38bdf8]", "bg-surface-container-high"],
                ].map(([name, chip, wrap], i) => (
                  <button
                    key={name as string}
                    title={name as string}
                    className={`group relative h-8 p-0.5 ${wrap} ${i === 2 ? "ring-1 ring-primary-container" : ""}`}
                  >
                    <span className={`block h-full w-full ${chip}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Telemetry guarantee */}
            <div className="mt-space-md space-y-space-2xs bg-surface-container p-space-sm pt-space-md font-label-micro text-label-micro text-secondary">
              <div className="flex items-center gap-space-xs text-primary">
                <span className="material-symbols-outlined text-[16px] text-primary-container">
                  verified
                </span>
                <span className="font-semibold uppercase tracking-widest">
                  AUTHENTICATED IN MILAN
                </span>
              </div>
              <p className="text-secondary/80">
                Mỗi cá thể giày đều được đính kèm chip NFC mã hoá chuỗi khối và số series chế tác
                thủ công.
              </p>
            </div>
          </aside>

          {/* Product grid */}
          <div
            className={`grid grid-cols-1 gap-space-md md:grid-cols-2 lg:col-span-9 ${cols === 3 ? "xl:grid-cols-3" : ""}`}
          >
            {shown.map((p) => {
              const b = badges(p.status);
              return (
                <article
                  key={p.slug}
                  className="group relative flex flex-col bg-surface-container-low transition-all duration-300 hover:shadow-2xl"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-container-lowest">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className={`object-cover transition-transform duration-500 group-hover:scale-105 ${p.status === "SOLD OUT" ? "opacity-60" : ""}`}
                      unoptimized
                    />
                    {/* Top badges + wishlist */}
                    <div className="pointer-events-none absolute inset-x-space-xs top-space-xs z-10 flex items-center justify-between">
                      <div className="pointer-events-auto flex items-center gap-space-2xs">
                        <span
                          className={`px-space-xs py-space-3xs font-label-micro text-label-micro uppercase tracking-widest ${b.cls}`}
                        >
                          {b.text}
                        </span>
                        {p.status === "LIVE" && (
                          <span className="bg-surface-container-lowest/80 px-space-xs py-space-3xs font-label-micro text-label-micro uppercase text-secondary backdrop-blur-md">
                            {p.edition.includes("500") ? "142 PAIRS" : "48 PAIRS"}
                          </span>
                        )}
                      </div>
                      <WishButton
                        slug={p.slug}
                        className="pointer-events-auto p-space-xs"
                      />
                    </div>
                    {/* Quick size reveal */}
                    <div className="absolute bottom-0 left-0 right-0 flex translate-y-full flex-col gap-space-2xs bg-surface-container-lowest/90 p-space-xs backdrop-blur-md transition-transform duration-300 group-hover:translate-y-0">
                      <span className="font-label-micro text-label-micro uppercase text-secondary/70">
                        CHỌN NHANH SIZE:
                      </span>
                      <div className="flex items-center justify-between gap-space-3xs font-label-micro text-label-micro text-primary">
                        {["40", "41", "42", "43", "44"].map((s) => (
                          <button
                            key={s}
                            onClick={() => setSize(s)}
                            className={`px-2 py-1 transition-colors ${
                              size === s
                                ? "bg-primary-container font-bold text-on-primary-container"
                                : "bg-surface-container hover:bg-primary hover:text-on-secondary"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-grow flex-col justify-between space-y-space-sm bg-surface-container-low p-space-md">
                    <div className="space-y-space-3xs">
                      <div className="flex items-center justify-between">
                        <span className="font-label-micro text-label-micro uppercase tracking-widest text-primary-container">
                          {p.sku} {"//"} {p.series.split("//")[1]?.trim() ?? "SPEC"}
                        </span>
                        <span className="font-label-technical text-label-technical font-bold text-primary">
                          ${p.price}
                        </span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm uppercase tracking-tight text-primary">
                        {p.name}
                      </h3>
                      <p className="line-clamp-2 font-body-sm text-body-sm text-secondary/80">
                        {p.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-space-xs pt-space-xs">
                      <button
                        onClick={() =>
                          quickAdd(p.slug, p.name, p.sku, p.price, p.image)
                        }
                        className={`flex w-full items-center justify-center gap-space-xs px-space-sm py-space-xs font-label-technical text-label-technical font-semibold uppercase tracking-wider transition-colors ${
                          p.status === "SOLD OUT"
                            ? "cursor-not-allowed bg-surface-container-highest text-secondary/40"
                            : addedSlug === p.slug
                              ? "bg-primary text-surface"
                              : "bg-primary-container text-on-primary-container hover:bg-primary hover:text-surface"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {addedSlug === p.slug ? "check" : "add_shopping_cart"}
                        </span>
                        <span>
                          {p.status === "SOLD OUT"
                            ? "HẾT HÀNG // WAITLIST"
                            : addedSlug === p.slug
                              ? "ĐÃ THÊM"
                              : "THÊM VÀO GIỎ"}
                        </span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
