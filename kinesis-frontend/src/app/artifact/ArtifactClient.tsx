"use client";

import { VIEWS } from "@/lib/views";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import WishButton from "@/components/WishButton";
import { USD_TO_VND, type Product } from "@/lib/data";

/* Ảnh Stitch gốc — các góc nhìn K-09 */
const EXPLODED =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCvSzpVhtQ_Lf5Cv8wiOojPhxV9UKUrMpawhKVcEdGJzkgSHPRbvpNRIdx36ipJdaBLYf728NW0RVKg0i5qOU51KV2gerlqGe0pU2PzcZdXBsLop0zRYYKAGJKQqh_H9tOB6FM3l0OjhOhIVwXHKF01zdofaw_dRKq3aXXokh5IQESJNRtJAml9fZlNEOVDpGvioWIrzFWSFitQ6A3l0k8SKUS5Jmbh-TCVLGd8XBEiTFYZGKJYIzpCsA=s1600";
const NFC_SCAN =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBv6_9_iBLzN9EBltWruJGdrc2aa70udUhlOESIbsulo2Dc5D03aDXc-bIyKwLnR1UrokK7Tm8wlIl6G4-xysqvMGJz4gj-VeOP4qkgX9P21pKEVjEupeoh1lnvxSWlVr8yrpAsCvVwYRVNEs4oyeLsm9K-aW_F6nExcmZlKS7MkJbzAIV1Ajc2Cn_5SDOqr8B9-kKWL6GJN0MYuxMSYHaGDeijTdHawmD9ic4eEl2wCLjtK-Nyz3G5_g=s1600";

const SWATCH: Record<string, string> = {
  VOLT: "bg-primary-container",
  CHROME: "bg-secondary",
  NOIR: "bg-surface-bright",
};

const SIZEGUIDE: Array<[string, string, string]> = [
  ["39", "6.5", "24.5 CM"],
  ["40", "7.0", "25.0 CM"],
  ["41", "7.5", "25.7 CM"],
  ["42", "8.5", "26.5 CM"],
  ["43", "9.5", "27.5 CM"],
  ["44", "10.0", "28.0 CM"],
  ["45", "11.0", "29.0 CM"],
];

const SIZES: Array<{ v: string; stock: string; out?: boolean; hot?: boolean }> = [
  { v: "39", stock: "4 đôi khả dụng" },
  { v: "40", stock: "3 đôi khả dụng" },
  { v: "41", stock: "5 đôi khả dụng" },
  { v: "42", stock: "CHỈ CÒN 2 ĐÔI CUỐI (HIẾM)", hot: true },
  { v: "43", stock: "6 đôi khả dụng" },
  { v: "44", stock: "1 đôi duy nhất" },
  { v: "45", stock: "ĐÃ HẾT HÀNG TRÊN TOÀN CẦU", out: true },
];

const LAYERS = [
  {
    code: "L-01",
    title: "CARBON STABILIZATION SHANK",
    tag: "AEROSPACE 3K WEAVE",
    body: "Carbon nguyên khối dưới vòm chân — triệt tiêu 94% lực xoắn, phản hồi năng lượng tối đa.",
  },
  {
    code: "L-02",
    title: "REBOUND NITROGEN FOAM",
    tag: "INFUSED N₂ CELL",
    body: "Bọt ni-tơ lỏng nhẹ hơn EVA 38% — êm bồng bềnh, bền trên 1.500 km.",
  },
  {
    code: "L-03",
    title: "SEAMLESS KEVLAR UPPER",
    tag: "BALLISTIC HYBRID",
    body: "Kevlar chống đạn dệt liền mạch — ôm chân theo bản đồ áp suất sinh học.",
  },
  {
    code: "L-04",
    title: "MAGNETIC TITANIUM LACING",
    tag: "FIDLOCK ADAPTIVE",
    body: "Khóa cáp từ Titanium một chạm — siết vi điểm, không tức mu chân.",
  },
];

const LOOKS = [
  {
    badge: "LOOK 01 // NEO-TAILORING",
    title: "AVANT-GARDE FORMALISM",
    body: "Blazer oversized vuông vai + quần len xếp ly — cổ điển đối lập tương lai.",
    hint: "GỢI Ý: BLAZER OVERSIZED + WOOL CARGO SLACKS",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDd76KOFPy9xRU_AmFR1xHsCXtmyxgIcFAEZVlCPHJddsomGgmKOHYHk4TznnM_BVW8rRJuZqTadZUmJ_nHC0vVZ3LEgNl2_nkdpjnRv650cwSwhzKUA5eTpDLo90Q8m7cHMT1ZLLEMyKu8hRzfg4jCOwCNgWpChy1KCTvbl8peezJKGELxl1Bs15Tv714okIGm19xN_FM9oOO33yPtmw3Y1aa47sDmYeAgry8P1npfKwkmN_g0fBYpKw=s1600",
  },
  {
    badge: "LOOK 02 // TACTICAL CYBER-SHELL",
    title: "BIOMECHANICAL TECHWEAR",
    body: "Anorak Gore-Tex 3 lớp + harness Fidlock — diện mạo đô thị viễn tưởng.",
    hint: "GỢI Ý: MODULAR HARNESS + 3L WATERPROOF ANORAK",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLLJxe9THfUhEJcacp5r5evhXGJjPQMQN2nznHCczRbBZejBm2F7BBTw1D5KZNT07J3j7Ii3166FRJct6VD1EevtSXcaIszIEpkMDwufGBSDrkcSyKgBmILJ6gr41Wd0w3myDzUtLaj49bvRpPYb5vTnvMWbDDdAHcsiYowsbKm4P0KHBgADFJmKPv2HWWVkaulIVTK4INR6pOmoPOQ12GYn59DY7TN-tO9XpU_pQxd-33mMKQ3CrQHA=s1600",
  },
  {
    badge: "LOOK 03 // MINIMAL DECONSTRUCT",
    title: "HAUTE RAW MONOCHROME",
    body: "Knit lụa thô + denim ống rộng — phô trọn điểm sáng volt ở đế.",
    hint: "GỢI Ý: DECONSTRUCTED KNIT + RIGID WIDE DENIM",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCnYFC7NI0OCCA6efgmV63DFy3KeBcIsfm611CpokQ6-s7-jZFIJTE91Vm63mKMsiXeAeKEVwf0KRV6oun3jq1fbTmIBWGyIxyRe3l1C8R4g3VxpITY2XdhNMoZs_h6wdA6VPbs8Z2zV0Zkhv9b-cLkRQ97jcipUjPPvbxeG8T9p1NPVxg5dRdNPs6JWiZXBmm7L1UykMNfJS5zJhEmt2OJItErVN18M7feFsOmhuW8rj-SXMunoUr9HA=s1600",
  },
];

const GUARANTEES = [
  {
    icon: "flight_takeoff",
    title: "GIAO BẢO HIỂM VIP",
    body: "Vận chuyển bọc thép bảo mật 72 giờ qua DHL Express Global.",
  },
  {
    icon: "sync_alt",
    title: "ĐỔI SIZE 14 NGÀY",
    body: "Hỗ trợ đối soát size tận nơi miễn phí cho mọi thành viên Syndicate.",
  },
  {
    icon: "precision_manufacturing",
    title: "BẢO TRÌ VÒNG ĐỜI",
    body: "Dịch vụ thay thế đệm khí và đánh bóng titanium định kỳ tại Atelier.",
  },
  {
    icon: "encrypted",
    title: "XÁC THỰC SỞ HỮU",
    body: "Hợp đồng điện tử kèm mã QR vật lý gắn niêm phong chân không.",
  },
];

export default function ArtifactClient({ product }: { product: Product }) {
  const { add } = useCart();
  const [view, setView] = useState(0);
  const [color, setColor] = useState(0);
  const [size, setSize] = useState("42");
  const [stock, setStock] = useState("EU 42: CÒN HÀNG TẠI KHO PARIS");
  const [added, setAdded] = useState(false);
  const [showSize, setShowSize] = useState(false);
  const short = product.name.split(" ").slice(0, 2).join(" ");
  const isK09 = product.slug === "k-09-stratos-chrono";
  const views = isK09
    ? VIEWS
    : [{ label: "01 / PROFILE", title: "[01] PROFILE", src: product.image }];
  const colorways = product.colors.map((c, i) => ({
    name: c,
    label: `0${i + 1} // ${c}`,
    swatch: SWATCH[c] ?? "bg-secondary",
  }));
  const soldOut = product.status === "SOLD OUT";
  const vnd = `${(product.price * USD_TO_VND).toLocaleString("vi-VN")} VNĐ`;

  const pickSize = (s: (typeof SIZES)[number]) => {
    if (s.out) return;
    setSize(s.v);
    setStock(`EU ${s.v}: ${s.stock.toUpperCase()}`);
  };

  const buy = () => {
    if (soldOut) return;
    add({
      slug: product.slug,
      name: product.name,
      sku: product.sku,
      price: product.price,
      image: product.image,
      size,
      color: colorways[color].name,
      qty: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <>
      {/* ============ REGISTRY STRIP ============ */}
      <section className="w-full bg-surface-container-lowest px-gutter-mobile py-space-xs lg:px-gutter-desktop">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-space-xs font-label-technical text-label-technical uppercase text-secondary">
          <div className="flex items-center gap-space-sm">
            <span className="size-2 animate-ping rounded-full bg-primary-container" />
            <span className="font-bold text-primary">ARTIFACT REGISTRY {"//"} {product.sku}</span>
            <span className="text-secondary/40">/</span>
            <span className="text-primary-container">{product.edition}</span>
          </div>
          <div className="flex items-center gap-space-md font-label-micro text-label-micro">
            <span className="text-on-surface-variant">SERIAL: SPEC-{product.sku}</span>
            <span className="text-secondary/40">•</span>
            <span className="text-on-surface-variant">CERTIFIED CRYPTO-NFC</span>
            <span className="text-secondary/40">•</span>
            <span className="text-primary">PARIS LAB RELEASE</span>
          </div>
        </div>
      </section>

      {/* ============ S1: HERO SPLIT 7/5 ============ */}
      <section className="w-full bg-surface px-gutter-mobile py-space-xl lg:px-gutter-desktop lg:py-space-2xl">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-space-xl lg:grid-cols-12">
          {/* Left: showcase */}
          <div className="flex flex-col gap-space-md lg:col-span-7">
            {/* Main stage */}
            <div className="group relative aspect-[4/3] w-full overflow-hidden bg-surface-container-low lg:aspect-[16/11]">
              <div className="pointer-events-none absolute -top-12 -left-12 size-64 rounded-full bg-primary-container/10 blur-3xl" />
              <div className="pointer-events-none absolute -right-16 -bottom-16 size-80 rounded-full bg-surface-container-highest/40 blur-2xl" />
              <Image
                src={views[view].src}
                alt={`${short} — ${views[view].title}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                unoptimized
              />
              {/* Telemetry watermark */}
              <div className="pointer-events-none absolute top-space-md left-space-md flex flex-col gap-space-2xs">
                <div className="flex items-center gap-space-xs bg-surface-container-lowest/80 px-space-sm py-space-3xs backdrop-blur-md">
                  <span className="size-1.5 rounded-full bg-primary-container" />
                  <span className="font-label-technical text-label-technical uppercase tracking-widest text-primary">
                    LAB CAD 360° {"//"} CALIBRATED
                  </span>
                </div>
                <span className="pl-space-3xs font-label-micro text-label-micro tracking-widest text-secondary">
                  LATITUDE: 48.8566° N {"//"} AXIS: 0.941
                </span>
              </div>
              {/* Viewport badges */}
              <div className="absolute right-space-md bottom-space-md flex items-center gap-space-xs">
                <button className="flex items-center gap-space-2xs bg-surface-container-lowest/90 px-space-sm py-space-xs font-label-technical text-label-technical text-primary backdrop-blur-md transition-colors hover:bg-primary-container hover:text-on-primary-container">
                  <span className="material-symbols-outlined text-[16px]">view_in_ar</span>
                  <span>360° AR VIEW</span>
                </button>
                <button className="flex items-center gap-space-2xs bg-surface-container-lowest/90 px-space-sm py-space-xs font-label-technical text-label-technical text-primary backdrop-blur-md transition-colors hover:bg-primary hover:text-on-secondary">
                  <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                  <span>SUPER MACRO</span>
                </button>
              </div>
              {/* Perspective indicator */}
              <div className="absolute bottom-space-md left-space-md bg-surface-container-lowest/60 px-space-xs py-space-3xs font-label-micro text-label-micro text-secondary backdrop-blur-sm">
                VIEW:{" "}
                <span className="font-semibold text-primary-container">{views[view].title}</span>
              </div>
            </div>

            {/* Thumbnail ribbon */}
            {views.length > 1 && (
            <div className="grid grid-cols-4 gap-space-xs">
              {views.map((v, i) => (
                <button
                  key={v.label}
                  onClick={() => setView(i)}
                  className={`group relative aspect-[4/3] overflow-hidden bg-surface-container-high transition-all ${
                    view === i ? "ring-2 ring-primary-container" : "hover:ring-1 hover:ring-secondary/40"
                  }`}
                >
                  <Image
                    src={v.src}
                    alt={v.label}
                    fill
                    sizes="25vw"
                    className="object-cover transition-opacity group-hover:opacity-90"
                    unoptimized
                  />
                  <span
                    className={`absolute inset-x-0 bottom-0 py-space-3xs text-center font-label-micro text-label-micro uppercase tracking-widest backdrop-blur-sm ${
                      view === i
                        ? "bg-surface-container-lowest/80 text-primary"
                        : "bg-surface-container-lowest/80 text-secondary"
                    }`}
                  >
                    {v.label}
                  </span>
                </button>
              ))}
            </div>
            )}

            {/* Telemetry strip */}
            <div className="grid grid-cols-3 gap-space-sm bg-surface-container-low p-space-md text-center">
              <div>
                <div className="font-label-micro text-label-micro uppercase tracking-widest text-secondary">
                  UNIT WEIGHT
                </div>
                <div className="font-headline-sm text-headline-sm font-bold text-primary">
                  342<span className="text-body-sm text-primary-container">G</span>
                </div>
              </div>
              <div>
                <div className="font-label-micro text-label-micro uppercase tracking-widest text-secondary">
                  CUSHION MATRIX
                </div>
                <div className="font-headline-sm text-headline-sm font-bold text-primary">
                  N₂ REBOUND
                </div>
              </div>
              <div>
                <div className="font-label-micro text-label-micro uppercase tracking-widest text-secondary">
                  TORQUE RIGIDITY
                </div>
                <div className="font-headline-sm text-headline-sm font-bold text-primary">
                  98.4<span className="text-body-sm text-primary-container">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: purchase engine */}
          <div className="flex flex-col justify-between bg-surface-container-low p-space-lg lg:col-span-5 lg:p-space-xl">
            <div className="flex flex-col gap-space-md">
              <div className="flex flex-wrap items-center justify-between gap-space-xs">
                <div className="inline-flex items-center gap-space-xs bg-surface-container-lowest px-space-sm py-space-3xs">
                  <span className="size-1.5 rounded-full bg-primary-container" />
                  <span className="font-label-technical text-label-technical uppercase tracking-widest text-primary-container">
                    SPECIMEN {"//"} {product.sku.replace(/-/g, "_")}
                  </span>
                </div>
                <span className="font-label-micro text-label-micro uppercase tracking-widest text-secondary">
                  LIMITED RUN / DROP 04
                </span>
              </div>

              <div className="space-y-space-3xs">
                <div className="flex items-start justify-between gap-space-sm">
                  <h1 className="font-headline-md text-headline-md uppercase tracking-tight text-primary">
                    {product.name}
                  </h1>
                  <WishButton slug={product.slug} className="size-10 shrink-0" />
                </div>
                <p className="font-label-technical text-label-technical uppercase tracking-widest text-secondary">
                  {product.series}
                </p>
                <p className="font-body-sm text-body-sm text-secondary">{product.description}</p>
              </div>

              {/* Pricing */}
              <div className="flex flex-col gap-space-3xs bg-surface-container-lowest p-space-md">
                <div className="flex flex-wrap items-baseline justify-between gap-space-xs">
                  <span className="font-display-lg text-display-lg font-bold leading-none text-primary">
                    ${product.price}{" "}
                    <span className="font-label-technical text-label-technical font-normal text-secondary">
                      USD
                    </span>
                  </span>
                  <span className="font-headline-sm text-headline-sm text-primary-container">
                    ≈ {vnd}
                  </span>
                </div>
                <div className="flex items-center gap-space-xs pt-space-2xs font-label-micro text-label-micro uppercase text-secondary/80">
                  <span className="material-symbols-outlined text-[14px] text-primary-container">
                    verified
                  </span>
                  <span>ĐÃ BAO GỒM THUẾ NHẬP KHẨU &amp; BẢO HIỂM VẬN CHUYỂN TOÀN CẦU</span>
                </div>
              </div>

              {/* Colorway */}
              <div className="space-y-space-xs">
                <div className="flex items-center justify-between font-label-technical text-label-technical uppercase">
                  <span className="text-secondary">CHỌN PHỐI MÀU:</span>
                  <span className="font-semibold text-primary">{colorways[color].name}</span>
                </div>
                <div className="flex items-center gap-space-sm">
                  {colorways.map((c, i) => (
                    <button
                      key={c.name}
                      onClick={() => setColor(i)}
                      className={`flex items-center gap-space-xs p-1 transition-all ${
                        color === i
                          ? "bg-surface-container-highest ring-2 ring-primary-container"
                          : "bg-surface-container-high hover:bg-surface-container-highest"
                      }`}
                    >
                      <span className="flex size-6 items-center justify-center bg-surface-container-lowest">
                        <span className={`size-3 ${c.swatch}`} />
                      </span>
                      <span
                        className={`pr-space-xs font-label-micro text-label-micro uppercase ${
                          color === i ? "text-primary" : "text-secondary"
                        }`}
                      >
                        {c.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size matrix */}
              <div className="space-y-space-xs">
                <div className="flex items-center justify-between font-label-technical text-label-technical uppercase">
                  <span className="text-secondary">KÍCH THƯỚC (EU STANDARD):</span>
                  <button
                    onClick={() => setShowSize(true)}
                    className="flex items-center gap-space-3xs font-label-micro text-label-micro uppercase text-primary-container transition-colors hover:text-primary"
                  >
                    <span className="material-symbols-outlined text-[14px]">straighten</span>
                    <span>BẢNG SIZE CHI TIẾT</span>
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-space-2xs">
                  {SIZES.map((s) => (
                    <button
                      key={s.v}
                      onClick={() => pickSize(s)}
                      disabled={s.out}
                      className={`py-space-xs text-center font-label-technical text-label-technical uppercase transition-colors ${
                        s.out
                          ? "cursor-not-allowed bg-surface-container-highest text-secondary/40 line-through"
                          : size === s.v
                            ? "bg-primary-container font-bold text-on-primary-container"
                            : "bg-surface-container-highest text-secondary hover:bg-surface-bright"
                      }`}
                    >
                      {s.v}
                    </button>
                  ))}
                </div>
                {/* Live stock indicator */}
                <div className="flex items-center justify-between bg-surface-container-lowest px-space-sm py-space-xs">
                  <div className="flex items-center gap-space-xs font-label-technical text-label-technical text-primary-container">
                    <span className="inline-block size-1.5 animate-pulse bg-primary-container" />
                    <span>{stock}</span>
                  </div>
                  <span className="font-label-micro text-label-micro uppercase text-secondary/60">
                    LOCK RESERVATION: 10:00
                  </span>
                </div>
              </div>

              {/* Triggers */}
              <div className="space-y-space-xs pt-space-xs">
                <button
                  onClick={buy}
                  disabled={soldOut}
                  className={`group flex w-full items-center justify-center gap-space-sm py-space-md font-label-technical text-label-technical font-bold uppercase tracking-widest transition-all ${
                    soldOut
                      ? "cursor-not-allowed bg-surface-container-highest text-secondary/50"
                      : "bg-primary-container text-on-primary-container hover:bg-tertiary hover:text-on-secondary"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] transition-transform group-hover:scale-110">
                    {soldOut ? "notifications" : "bolt"}
                  </span>
                  <span>
                    {soldOut
                      ? "HẾT HÀNG // ĐĂNG KÝ WAITLIST"
                      : added
                        ? "ĐÃ THÊM VÀO GIỎ ✓"
                        : "ĐẶT MUA NGAY // PURCHASE ARTIFACT"}
                  </span>
                </button>
                <button className="flex w-full items-center justify-center gap-space-sm bg-surface-container-high py-space-sm font-label-technical text-label-technical uppercase tracking-widest text-primary transition-colors hover:bg-surface-bright">
                  <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                  <span>ĐẶT LỊCH THỬ TẠI ATELIER VIP (PARIS / TOKYO)</span>
                </button>
              </div>
            </div>

            {/* Micro footnote */}
            <div className="mt-space-md flex items-center justify-between bg-surface-container-lowest p-space-sm font-label-micro text-label-micro uppercase text-secondary">
              <span className="flex items-center gap-space-2xs">
                <span className="material-symbols-outlined text-[14px] text-primary-container">
                  lock
                </span>
                MÃ HÓA ARTIFACT TOKEN
              </span>
              <span>BẢO HÀNH CẤP PHÒNG THÍ NGHIỆM 24 THÁNG</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ S2: ANATOMY EXPLODED 6/6 ============ */}
      <section className="w-full bg-surface-container-lowest px-gutter-mobile py-space-3xl lg:px-gutter-desktop">
        <div className="mx-auto max-w-7xl space-y-space-2xl">
          <div className="flex flex-col justify-between gap-space-md md:flex-row md:items-end">
            <div className="space-y-space-2xs">
              <div className="flex items-center gap-space-xs font-label-technical text-label-technical uppercase text-primary-container">
                <span>[ ANATOMY &amp; KINETIC ARCHITECTURE ]</span>
                <span>{"//"}</span>
                <span>EXPLODED FORM ANALYSIS</span>
              </div>
              <h2 className="font-display-lg text-display-lg uppercase tracking-tight text-primary">
                KỸ NGHỆ CẤU THÀNH SIÊU THỂ
              </h2>
            </div>
            <p className="max-w-md font-body-sm text-body-sm text-secondary">
              Mỗi cấu phần của {short} — hàng không vũ trụ gặp bàn tay haute couture Paris.
            </p>
          </div>

          <div className="grid grid-cols-1 items-center gap-space-lg lg:grid-cols-12">
            {/* Exploded render + crosshair */}
            <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-surface-container-low p-space-md lg:col-span-6">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-surface-container-lowest via-transparent to-primary-container/5" />
              <Image
                src={EXPLODED}
                alt={`Exploded 3D anatomical render ${short}`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain"
                unoptimized
              />
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full text-secondary/20"
                fill="none"
                viewBox="0 0 400 400"
              >
                <line stroke="currentColor" strokeDasharray="4 4" x1="20" x2="380" y1="200" y2="200" />
                <line stroke="currentColor" strokeDasharray="4 4" x1="200" x2="200" y1="20" y2="380" />
                <circle cx="200" cy="200" r="160" stroke="currentColor" strokeDasharray="2 6" />
                <circle cx="200" cy="200" fill="#caf300" r="6" />
              </svg>
              <div className="absolute top-space-sm right-space-sm bg-surface-container-lowest px-space-xs py-space-3xs font-label-micro text-label-micro text-primary-container">
                CAD EXP {"//"} 04 STRATA
              </div>
            </div>

            {/* Layer cards */}
            <div className="flex flex-col gap-space-sm lg:col-span-6">
              {LAYERS.map((l) => (
                <div
                  key={l.code}
                  className="group bg-surface-container p-space-lg transition-colors hover:bg-surface-container-high"
                >
                  <div className="mb-space-xs flex items-start justify-between gap-space-md">
                    <div className="flex items-center gap-space-xs">
                      <span className="bg-surface-container-lowest px-space-xs py-space-3xs font-label-technical text-label-technical font-bold text-primary-container">
                        {l.code}
                      </span>
                      <h3 className="font-headline-sm text-headline-sm uppercase text-primary">
                        {l.title}
                      </h3>
                    </div>
                    <span className="font-label-micro text-label-micro text-secondary">{l.tag}</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-secondary">{l.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ S3: NFC CRYPTO CERTIFICATE 5/7 ============ */}
      <section className="w-full bg-surface px-gutter-mobile py-space-3xl lg:px-gutter-desktop">
        <div className="relative mx-auto max-w-7xl overflow-hidden bg-surface-container-low p-space-xl lg:p-space-2xl">
          <div className="pointer-events-none absolute -right-20 -top-20 size-96 rounded-full bg-primary-container/10 blur-3xl" />
          <div className="relative z-10 grid grid-cols-1 items-center gap-space-xl lg:grid-cols-12">
            <div className="space-y-space-md lg:col-span-5">
              <div className="inline-flex items-center gap-space-xs bg-surface-container-lowest px-space-sm py-space-3xs font-label-technical text-label-technical uppercase text-primary-container">
                <span className="material-symbols-outlined text-[16px]">nfc</span>
                <span>CHIP NFC XÁC THỰC BLOCKCHAIN</span>
              </div>
              <h3 className="font-headline-md text-headline-md uppercase tracking-tight text-primary">
                ĐẶC QUYỀN SỞ HỮU SỐ ĐỘC BẢN {"//"} DIGITAL ARTIFACT
              </h3>
              <p className="font-body-md text-body-md text-secondary">
                Mỗi specimen {short} giấu chip NFC dưới gờ gót Titanium — 1 chạm để kích hoạt chứng chỉ sở hữu số.
              </p>
              <div className="space-y-space-xs bg-surface-container-lowest p-space-md">
                <div className="flex items-center justify-between font-label-technical text-label-technical">
                  <span className="text-secondary">CHIP ID PROTOCOL:</span>
                  <span className="font-mono text-primary">0x4F92...B99C</span>
                </div>
                <div className="flex items-center justify-between font-label-technical text-label-technical">
                  <span className="text-secondary">TRẠNG THÁI KHẢ DỤNG:</span>
                  <span className="font-bold uppercase text-primary-container">
                    SẴN SÀNG ĐĂNG KÝ DANH CHÍNH
                  </span>
                </div>
                <div className="flex items-center justify-between font-label-technical text-label-technical">
                  <span className="text-secondary">NGUYÊN LIỆU TÁI CHẾ LAB:</span>
                  <span className="font-semibold text-primary">68.4% CIRCULAR REBOUND</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2 lg:col-span-7">
              <div className="group relative aspect-square overflow-hidden bg-surface-container">
                <Image
                  src={NFC_SCAN}
                  alt="NFC heel scan zone"
                  fill
                  sizes="(max-width: 768px) 100vw, 29vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-surface-container-lowest to-transparent p-space-sm font-label-micro text-label-micro uppercase text-primary">
                  {"//"} HEEL SCAN ZONE [ANTENNA FREQ: 13.56 MHZ]
                </div>
              </div>
              <div className="flex flex-col justify-between bg-surface-container p-space-lg">
                <div className="space-y-space-xs">
                  <div className="flex size-10 items-center justify-center bg-primary-container text-on-primary-container">
                    <span className="material-symbols-outlined text-[24px]">fingerprint</span>
                  </div>
                  <h4 className="font-headline-sm text-headline-sm uppercase text-primary">
                    PASSPORT VĨNH CỬU
                  </h4>
                  <p className="font-body-sm text-body-sm text-secondary">
                    Vào private showroom Paris, pre-order Collab độc quyền, xác thực nguồn gốc khi bán lại.
                  </p>
                </div>
                <Link
                  href="/passport"
                  className="flex items-center gap-space-2xs pt-space-md font-label-technical text-label-technical uppercase text-primary-container"
                >
                  <span>XEM SMART CONTRACT CÔNG KHAI</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ S4: STYLING LOOKS 3 CỘT ============ */}
      <section className="w-full bg-surface-container-lowest px-gutter-mobile py-space-3xl lg:px-gutter-desktop">
        <div className="mx-auto max-w-7xl space-y-space-2xl">
          <div className="flex flex-col justify-between gap-space-md md:flex-row md:items-end">
            <div className="space-y-space-2xs">
              <span className="font-label-technical text-label-technical uppercase tracking-widest text-primary-container">
                [ EDITORIAL RUNWAY CURATION ]
              </span>
              <h2 className="font-display-lg text-display-lg uppercase tracking-tight text-primary">
                HƯỚNG DẪN PHỐI ĐỒ CÙNG TÁC PHẨM
              </h2>
            </div>
            <div className="font-label-technical text-label-technical uppercase text-secondary">
              CURATED BY KINESIS STYLING DIRECTION {"//"} MILANO &amp; TOKYO
            </div>
          </div>

          <div className="grid grid-cols-1 gap-space-lg md:grid-cols-3">
            {LOOKS.map((look) => (
              <div key={look.title} className="group flex flex-col overflow-hidden bg-surface-container-low">
                <div className="relative aspect-[3/4] overflow-hidden bg-surface-container">
                  <Image
                    src={look.src}
                    alt={look.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    unoptimized
                  />
                  <div className="absolute top-space-sm left-space-sm bg-surface-container-lowest/80 px-space-xs py-space-3xs font-label-micro text-label-micro uppercase text-primary-container backdrop-blur-md">
                    {look.badge}
                  </div>
                </div>
                <div className="flex flex-grow flex-col justify-between space-y-space-xs p-space-md">
                  <div>
                    <h3 className="mb-space-3xs font-headline-sm text-headline-sm uppercase text-primary">
                      {look.title}
                    </h3>
                    <p className="font-body-sm text-body-sm text-secondary">{look.body}</p>
                  </div>
                  <div className="pt-space-xs font-label-micro text-label-micro uppercase tracking-widest text-secondary">
                    {look.hint}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Size guide modal */}
      {showSize && (
        <div
          onClick={() => setShowSize(false)}
          className="fixed inset-0 z-[70] grid place-items-center bg-surface-container-lowest/80 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md border border-surface-container-highest bg-surface-container-low p-space-lg"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-headline-sm uppercase text-primary">
                BẢNG SIZE CHI TIẾT
              </h3>
              <button
                onClick={() => setShowSize(false)}
                aria-label="Đóng"
                className="grid size-9 place-items-center text-secondary transition-colors hover:text-primary"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="mt-space-2xs font-body-sm text-body-sm text-secondary">
              Form {short} chạy chuẩn EU. Chân bè chọn lên nửa size. Đo dài nhất của bàn chân để
              đối chiếu cột CM.
            </p>
            <table className="mt-space-md w-full font-label-technical text-label-technical">
              <thead>
                <tr className="border-b border-surface-container-highest text-left font-label-micro text-label-micro uppercase tracking-widest text-secondary">
                  <th className="py-space-xs">EU</th>
                  <th className="py-space-xs">US</th>
                  <th className="py-space-xs text-right">DÀI CHÂN</th>
                </tr>
              </thead>
              <tbody>
                {SIZEGUIDE.map(([eu, us, cm]) => (
                  <tr
                    key={eu}
                    className={`border-b border-surface-container-highest/50 ${
                      size === eu ? "text-primary-container" : "text-primary"
                    }`}
                  >
                    <td className="py-space-xs font-bold">
                      {eu} {size === eu && "← ĐANG CHỌN"}
                    </td>
                    <td className="py-space-xs">{us}</td>
                    <td className="py-space-xs text-right">{cm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============ S5: GUARANTEE 4 CỘT ============ */}
      <section className="w-full bg-surface px-gutter-mobile py-space-2xl lg:px-gutter-desktop">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-space-md md:grid-cols-4">
          {GUARANTEES.map((g) => (
            <div key={g.title} className="flex items-start gap-space-sm bg-surface-container-low p-space-md">
              <span className="material-symbols-outlined text-[24px] text-primary-container">
                {g.icon}
              </span>
              <div className="space-y-space-3xs">
                <h4 className="font-headline-sm text-headline-sm uppercase text-primary">
                  {g.title}
                </h4>
                <p className="font-body-sm text-body-sm text-secondary">{g.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
