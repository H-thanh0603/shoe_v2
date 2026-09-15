"use client";

import Image from "next/image";
import { useState } from "react";

const TWIN =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAV6DTZnaGL9BTyntww2WoU_MJLmQcB7iRMlKUoOCCuJbY2gzRLSzDD99j-6A4ppFhMOcHI91Wh9fr2s6naWWnsGZknR_XwQplChsf8Y38VmwgW5BP9vKojIqqDnd6e8XBu4_YR1s80iMxKUWlLM3Ru3KLJngKUm3S4EKYbUuISpkhM_jrJjweZGhwRb9LphnRaMIBGMBIjmIWWnIJSGWJawIsEbG6QjwhlzlZet_s-AMrmFdHzx8O_Yw=s1600";

const MODES = [
  { key: "natural", icon: "view_in_ar", label: "CHẾ ĐỘ TỰ NHIÊN" },
  { key: "xray", icon: "grain", label: "X-RAY CAD RAY" },
  { key: "wire", icon: "grid_3x3", label: "LƯỚI WIREFRAME" },
  { key: "kinetic", icon: "view_agenda", label: "ĐỘNG LỰC KINETIC" },
] as const;

const FILTER: Record<string, string> = {
  natural: "",
  xray: "invert hue-rotate-180 contrast-125 brightness-75",
  wire: "grayscale contrast-200 brightness-50",
  kinetic: "saturate-200 contrast-125 hue-rotate-15",
};

const HOTSPOTS = [
  { top: "38%", right: "22%", title: "KHUNG TITAN GR.5 DMLS", sub: "KHẮC LASER SỐ #04/50" },
  { top: "28%", left: "32%", title: "MŨI KEVLAR ĐỆM LIỀN KHỐI", sub: "CHỐNG MÀI MÒN CẤP ĐỘ 5" },
  { top: undefined, bottom: "24%", left: "45%", title: "ĐỆM KHÍ NITƠ LỎNG N2", sub: "HOÀN TRẢ ĐỘNG LỰC 98.4%" },
];

const META = [
  ["CHỦ SỞ HỮU HIỆN TẠI:", "ALEXANDER TRẦN"],
  ["THỜI ĐIỂM ĐÚC KHỐI:", "24/10/2025 // 14:22:09 UTC"],
  ["XƯỞNG CHẾ TÁC GỐC:", "PARIS IX // STUDIO BIOMECHANICS"],
  ["TỌA ĐỘ VẬT LÝ:", "48.8744° N, 2.3522° E"],
  ["TOKEN CHUỖI KHỐI:", "ERC-721 (#0094)"],
  ["HỢP ĐỒNG MINH CHỨNG:", "0x8a929fb01c3d82a1"],
];

const TRAIL = [
  {
    n: "01",
    title: "CHẾ TÁC ĐẾ CARBON & IN 3D TITANIUM",
    tag: "LAB TOKYO",
    body: "Kenzo Mori kiểm định khung gót #04 bằng cắt gọt vi tính DMLS.",
    time: "08/10/2025 // 09:14 JST",
    hash: "0xaa4f...728b",
    active: false,
  },
  {
    n: "02",
    title: "CẮT MAY UPPER KEVLAR & LẮP RÁP THỦ CÔNG",
    tag: "ATELIER RUE CHARLOT, PARIS",
    body: "Alexandre Chen ráp tay 18 giờ — seamless, định hình phom.",
    time: "15/10/2025 // 16:30 CEST",
    hash: "0x33b1...e589",
    active: false,
  },
  {
    n: "03",
    title: "ĐO ĐẠC SINH TRẮC & CẤY CHIP NFC NTAG 424",
    tag: "BIOMETRIC LAB",
    body: "Cấy chip NTAG 424 chuẩn ngân hàng vào lưỡi gà phải.",
    time: "19/10/2025 // 11:05 CEST",
    hash: "0x88c2...12ad",
    active: false,
  },
  {
    n: "04",
    title: "CHỨNG NHẬN XUẤT XƯỞNG & ĐÚC NFT HỘ CHIẾU SỐ",
    tag: "POLYGON ZK-EVM CORE",
    body: "Đúc NFT định danh vĩnh viễn — ký bởi Khóa Master Syndicate.",
    time: "24/10/2025 // 14:22 UTC",
    hash: "0x77d9...90ff",
    active: false,
  },
  {
    n: "05",
    title: "VẬN CHUYỂN BỌC THÉP BẢO MẬT CAO CẤP",
    tag: "PARIS → TP. HỒ CHÍ MINH",
    body: "Vali nhôm khóa sinh trắc + GPS vệ tinh toàn trình.",
    time: "27/10/2025 // 08:45 UTC",
    hash: "0x11ee...443c",
    active: false,
  },
  {
    n: "06",
    title: "KÍCH HOẠT QUYỀN SỞ HỮU TƯ GIA",
    tag: "STATUS: CONFIRMED BY OWNER",
    body: "Chủ sở hữu chạm NFC và ghép ví thành công tại tư gia.",
    time: "28/10/2025 // 19:12 ICT",
    hash: "0x94f2...899c",
    active: true,
  },
];

const UTILITIES = [
  {
    icon: "deployed_code",
    title: "MÔ HÌNH 3D CHUẨN ENGINE",
    body: "Unreal 5 Nanite + Blender (.GLB/.FBX), texture 8K PBR đầy đủ.",
    cta: { icon: "download", label: "TẢI ASSET 8K (.ZIP 1.4GB)", primary: false },
    note: "BẢN QUYỀN SỬ DỤNG PHI THƯƠNG MẠI",
  },
  {
    icon: "view_in_ar",
    title: "APPLE VISION PRO .USDZ",
    body: "Chạy trên Vision Pro và Quest 3 qua WebXR.",
    cta: { icon: "spatial_audio_off", label: "KHỞI CHẠY VISIONOS AR", primary: false },
    note: "ĐỒNG BỘ AIRDROP TỨC THỜI",
  },
  {
    icon: "lock_open",
    title: "ĐẶC QUYỀN SYNDICATE ELITE",
    body: "Discord mật, vé Private Showroom Paris, bảo dưỡng trọn đời.",
    cta: { icon: "forum", label: "VÀO KÊNH BẢO MẬT DISCORD", primary: true },
    note: "YÊU CẦU KÝ XÁC THỰC MẬT MÃ VÍ",
  },
];

export default function PassportClient() {
  const [mode, setMode] = useState<string>("natural");

  return (
    <>
      {/* ============ BREADCRUMB ============ */}
      <section className="w-full bg-surface-container-lowest px-gutter-mobile py-space-sm lg:px-gutter-desktop">
        <div className="flex flex-col justify-between gap-space-sm md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-space-xs font-label-technical text-label-technical text-secondary">
            <span className="cursor-pointer transition-colors hover:text-primary">SYNDICATE VAULT</span>
            <span>{"//"}</span>
            <span className="text-secondary/60">ARCHIVE SPECIMENS</span>
            <span>{"//"}</span>
            <span className="font-semibold text-primary">SPECIMEN K-09 STRATOS</span>
            <span>{"//"}</span>
            <span className="bg-surface-container-high px-space-xs py-space-3xs font-label-micro text-label-micro text-primary-container">
              PASSPORT: KNS-779X-TITANIUM
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-space-sm">
            <div className="flex items-center gap-space-2xs bg-surface-container px-space-sm py-space-3xs">
              <span className="size-2 animate-ping rounded-full bg-primary-container" />
              <span className="font-label-micro text-label-micro uppercase tracking-wider text-primary-container">
                ON-CHAIN VERIFIED {"//"} POLYGON ZK-EVM
              </span>
            </div>
            <div className="flex items-center gap-space-2xs bg-surface-container-high px-space-sm py-space-3xs">
              <span className="material-symbols-outlined text-[14px] text-secondary">nfc</span>
              <span className="font-label-micro text-label-micro uppercase tracking-widest text-secondary">
                NTAG 424 DNA CRYPTO-PAIRED
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ QUICK ACTION BANNER ============ */}
      <section className="w-full bg-surface-container-low px-gutter-mobile py-space-md lg:px-gutter-desktop">
        <div className="flex flex-col items-start justify-between gap-space-md lg:flex-row lg:items-center">
          <div className="flex flex-col">
            <div className="mb-space-3xs flex items-center gap-space-xs">
              <span className="font-label-micro text-label-micro uppercase tracking-[0.24em] text-primary-container">
                DIGITAL ARTIFACT CERTIFICATION
              </span>
              <span className="text-secondary/40">{"//"}</span>
              <span className="font-label-micro text-label-micro uppercase text-secondary">
                ISO-8402 CRYPTOGRAPHIC ASSET COMPLIANT
              </span>
            </div>
            <h1 className="font-display-lg text-display-lg uppercase tracking-tighter text-primary">
              HỘ CHIẾU SỐ HIỆN VẬT {"//"} K-09
            </h1>
          </div>
          <div className="flex w-full flex-wrap items-center gap-space-sm lg:w-auto">
            <button className="flex items-center justify-center gap-space-xs bg-surface-container-highest px-space-lg py-space-sm font-label-technical text-label-technical uppercase tracking-wider text-primary transition-all hover:bg-surface-bright">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>XUẤT BẢNG KHAI CHỨNG THỰC (.PDF)</span>
            </button>
            <button
              disabled
              title="Chuyển giao on-chain chưa mở — liên hệ shop để sang tên thủ công"
              className="flex cursor-not-allowed items-center justify-center gap-space-xs bg-primary-container px-space-lg py-space-sm font-label-technical text-label-technical font-semibold uppercase tracking-wider text-on-primary-container opacity-60"
            >
              <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
              <span>CHUYỂN GIAO QUYỀN SỞ HỮU SỐ (SẮP MỞ)</span>
            </button>
          </div>
          <p className="mt-space-xs w-full font-label-micro text-label-micro uppercase tracking-widest text-secondary/60">
            Hồ sơ provenance hiện do shop lưu trữ và đối soát — bản ghi on-chain đang triển khai.
          </p>
        </div>
      </section>

      {/* ============ HERO 7/5 ============ */}
      <section className="w-full px-gutter-mobile py-space-xl lg:px-gutter-desktop">
        <div className="grid grid-cols-1 items-stretch gap-space-lg lg:grid-cols-12">
          {/* Left: 3D viewport */}
          <div className="relative flex flex-col overflow-hidden bg-surface-container-lowest p-space-md shadow-xl lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-space-sm pb-space-md">
              <div className="flex items-center gap-space-xs">
                <span className="size-2.5 bg-primary-container" />
                <span className="font-label-technical text-label-technical uppercase tracking-widest text-primary">
                  3D TELEMETRIC CANVAS {"//"} SPECIMEN #04
                </span>
              </div>
              <div className="flex items-center gap-space-2xs bg-surface-container-high px-space-xs py-space-3xs">
                <span className="material-symbols-outlined text-[16px] text-primary-container">visibility</span>
                <span className="font-label-micro text-label-micro uppercase text-primary">
                  RADAR SCANNER ACTIVE
                </span>
              </div>
            </div>

            {/* Canvas */}
            <div className="group relative flex h-[460px] w-full items-center justify-center overflow-hidden bg-surface-container-low md:h-[540px]">
              <div className="pointer-events-none absolute inset-0 bg-gradient-radial from-primary-container/20 via-transparent to-transparent opacity-15" />
              <svg className="pointer-events-none absolute inset-0 h-full w-full text-secondary opacity-10">
                <defs>
                  <pattern height="40" id="cad-grid" patternUnits="userSpaceOnUse" width="40">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect fill="url(#cad-grid)" height="100%" width="100%" />
              </svg>
              <Image
                src={TWIN}
                alt="K-09 STRATOS digital twin hologram"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className={`object-contain p-space-lg transition-all duration-700 group-hover:scale-105 ${FILTER[mode]}`}
                unoptimized
              />
              {/* Hotspots */}
              {HOTSPOTS.map((h) => (
                <div
                  key={h.title}
                  className="absolute z-20 flex flex-col items-center"
                  style={{ top: h.top, right: h.right, left: h.left, bottom: h.bottom }}
                >
                  <div className="flex size-4 animate-pulse items-center justify-center rounded-full bg-primary-container/20">
                    <span className="size-2 rounded-full bg-primary-container" />
                  </div>
                  <div className="mt-space-2xs bg-surface-container-highest/95 px-space-xs py-space-3xs text-left shadow-md backdrop-blur-md">
                    <span className="block font-label-micro text-label-micro font-bold text-primary-container">
                      {h.title}
                    </span>
                    <span className="block font-label-micro text-label-micro text-secondary">
                      {h.sub}
                    </span>
                  </div>
                </div>
              ))}
              {/* Scanline */}
              <div className="pointer-events-none absolute inset-x-0 h-1 animate-pulse bg-gradient-to-r from-transparent via-primary-container/60 to-transparent" />
              {/* Axis overlay */}
              <div className="pointer-events-none absolute bottom-space-sm left-space-sm flex flex-col font-label-micro text-label-micro text-secondary/60">
                <span>ROTATION: [ X: 14.2° | Y: -42.8° | Z: 0.0° ]</span>
                <span>POLYGON COUNT: 842,910 QUADS {"//"} VERTICES: 421,458</span>
              </div>
            </div>

            {/* Mode toggles */}
            <div className="grid grid-cols-2 gap-space-2xs pt-space-md sm:grid-cols-4">
              {MODES.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMode(m.key)}
                  className={`flex items-center justify-center gap-space-2xs px-space-xs py-space-sm font-label-technical text-label-technical uppercase transition-colors ${
                    mode === m.key
                      ? "bg-primary text-on-secondary"
                      : "bg-surface-container-high text-secondary hover:bg-surface-bright hover:text-primary"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{m.icon}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: passport card */}
          <div className="flex flex-col justify-between bg-surface-container p-space-lg shadow-xl lg:col-span-5">
            <div className="space-y-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-2xs">
                  <span className="size-2 bg-primary-container" />
                  <span className="font-label-technical text-label-technical uppercase tracking-widest text-primary-container">
                    CERTIFICATE OF AUTHENTICITY
                  </span>
                </div>
                <span className="bg-surface-container-lowest px-space-xs py-space-3xs font-label-micro text-label-micro uppercase tracking-widest text-secondary">
                  SPECIMEN #04 / 50
                </span>
              </div>

              <div>
                <span className="block font-label-micro text-label-micro uppercase tracking-[0.2em] text-secondary">
                  TÊN HIỆN VẬT ĐƯỢC CHỨNG THỰC
                </span>
                <h2 className="mt-space-3xs font-headline-md text-headline-md uppercase tracking-tight text-primary">
                  K-09 STRATOS CHRONO
                </h2>
                <p className="mt-space-2xs font-body-sm text-body-sm text-secondary">
                  Prototype Run — khung Titanium Gr.5 + Kevlar Ballistic không viền may.
                </p>
              </div>

              <div className="space-y-space-sm bg-surface-container-lowest p-space-md">
                {META.map(([k, v]) => (
                  <div key={k} className="flex items-start justify-between gap-space-xs">
                    <span className="font-label-technical text-label-technical uppercase text-secondary">
                      {k}
                    </span>
                    <span
                      className={`text-right font-label-technical text-label-technical ${
                        v.includes("ERC") || v.includes("0x8")
                          ? "text-primary-container"
                          : v.includes("TRẦN")
                            ? "font-semibold text-primary"
                            : "text-primary"
                      }`}
                    >
                      {v}
                      {v.includes("TRẦN") && (
                        <span className="block font-label-micro text-label-micro text-primary-container">
                          0x94F2...899C [OBSIDIAN ELITE]
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-space-md bg-surface-container-high p-space-md">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-surface-container-lowest">
                  <span className="material-symbols-outlined text-[24px] text-primary-container">
                    contactless
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-technical text-label-technical font-medium uppercase text-primary">
                    CHIP NFC NTAG 424 DNA TRONG LƯỠI GÀ
                  </span>
                  <span className="font-body-sm text-body-sm text-secondary">
                    Mã định danh sinh mã xác thực động SUN (Secure Unique NFC) ngăn ngừa sao chép
                    tuyệt đối.
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-space-xs pt-space-md sm:flex-row">
              <button className="flex w-full items-center justify-center gap-space-2xs bg-primary-container px-space-md py-space-sm font-label-technical text-label-technical font-semibold uppercase text-on-primary-container transition-colors hover:bg-primary hover:text-on-secondary">
                <span className="material-symbols-outlined text-[18px]">cell_tower</span>
                <span>CHẠM NFC ĐỂ ĐỐI CHIẾU THỰC ĐỊA</span>
              </button>
              <span
                title="Block explorer chưa kết nối — provenance hiện lưu trong hồ sơ shop"
                className="flex w-full cursor-not-allowed items-center justify-center gap-space-2xs whitespace-nowrap bg-surface-container-high px-space-md py-space-sm font-label-technical text-label-technical uppercase text-secondary/60 sm:w-auto"
              >
                <span>EXPLORER (SẮP MỞ)</span>
                <span className="material-symbols-outlined text-[16px]">north_east</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ BIOMETRIC & MATERIAL MATRIX ============ */}
      <section className="w-full bg-surface-container-lowest px-gutter-mobile py-space-2xl lg:px-gutter-desktop">
        <div className="mx-auto max-w-7xl space-y-space-xl">
          <div className="flex flex-col justify-between gap-space-md md:flex-row md:items-end">
            <div>
              <div className="mb-space-3xs flex items-center gap-space-2xs">
                <span className="size-2 bg-primary-container" />
                <span className="font-label-technical text-label-technical uppercase tracking-widest text-primary-container">
                  KỸ NGHỆ VẬT LIỆU &amp; SINH TRẮC HỌC CÁ NHÂN HÓA
                </span>
              </div>
              <h2 className="font-headline-md text-headline-md uppercase tracking-tight text-primary">
                BESPOKE BIOMETRIC &amp; MATERIAL MATRIX
              </h2>
            </div>
            <div className="text-right font-label-technical text-label-technical text-secondary">
              <span>CALIBRATED AT: TOKYO LAB {"//"} 23°C 45% HUMIDITY</span>
            </div>
          </div>

          {/* Bento 4 cards */}
          <div className="grid grid-cols-1 gap-space-md md:grid-cols-2 lg:grid-cols-4">
            {/* Card 1 */}
            <div className="flex flex-col justify-between space-y-space-md bg-surface-container p-space-md">
              <div className="flex items-center justify-between">
                <span className="font-label-micro text-label-micro uppercase tracking-widest text-secondary">
                  THÔNG SỐ BÀN CHÂN CHỦ SỞ HỮU
                </span>
                <span className="material-symbols-outlined text-[20px] text-primary-container">
                  footprint
                </span>
              </div>
              <div className="space-y-space-xs">
                <div className="text-[40px] font-bold uppercase leading-tight text-primary">
                  EU 42.5
                </div>
                <div className="font-label-technical text-label-technical uppercase text-primary-container">
                  WIDE FIT PROTOTYPE
                </div>
              </div>
              <div className="space-y-space-3xs bg-surface-container-lowest p-space-sm font-label-micro text-label-micro text-secondary">
                {[
                  ["BÀN CHÂN TRÁI:", "268.4 MM"],
                  ["BÀN CHÂN PHẢI:", "269.1 MM"],
                  ["GÓC VÒM BÀN CHÂN:", "14.8° HIGH ARCH"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span>{k}</span>
                    <span className="font-bold text-primary">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Card 2 */}
            <div className="flex flex-col justify-between space-y-space-md bg-surface-container p-space-md">
              <div className="flex items-center justify-between">
                <span className="font-label-micro text-label-micro uppercase tracking-widest text-secondary">
                  BỌC GÓT TITANIUM GR.5
                </span>
                <span className="material-symbols-outlined text-[20px] text-primary-container">
                  precision_manufacturing
                </span>
              </div>
              <div className="space-y-space-xs">
                <div className="font-headline-md text-headline-md uppercase text-primary">
                  DMLS IN 3D
                </div>
                <div className="font-label-technical text-label-technical uppercase text-secondary">
                  TI-6AL-4V GRADE 5 AERO
                </div>
              </div>
              <p className="font-body-sm text-body-sm text-secondary">
                Gót in laser chịu ép 450 MPa — anot xám Obsidian, khắc tên chủ sở hữu.
              </p>
            </div>
            {/* Card 3 */}
            <div className="flex flex-col justify-between space-y-space-md bg-surface-container p-space-md">
              <div className="flex items-center justify-between">
                <span className="font-label-micro text-label-micro uppercase tracking-widest text-secondary">
                  SỢI BALLISTIC KEVLAR
                </span>
                <span className="material-symbols-outlined text-[20px] text-primary-container">
                  shield
                </span>
              </div>
              <div className="space-y-space-xs">
                <div className="font-headline-md text-headline-md uppercase text-primary">
                  CẤP ĐỘ 5
                </div>
                <div className="font-label-technical text-label-technical uppercase text-secondary">
                  DỆT NGUYÊN KHỐI SEAMLESS
                </div>
              </div>
              <p className="font-body-sm text-body-sm text-secondary">
                Sợi aramid liên kết chéo — kháng xé, chống nước nano, thoáng tối ưu.
              </p>
            </div>
            {/* Card 4 */}
            <div className="flex flex-col justify-between space-y-space-md bg-surface-container p-space-md">
              <div className="flex items-center justify-between">
                <span className="font-label-micro text-label-micro uppercase tracking-widest text-secondary">
                  ĐỆM KHÍ VÀ KHỐI LƯỢNG
                </span>
                <span className="material-symbols-outlined text-[20px] text-primary-container">
                  scale
                </span>
              </div>
              <div className="space-y-space-xs">
                <div className="text-[40px] font-bold uppercase leading-tight text-primary-container">
                  342.6 g
                </div>
                <div className="font-label-technical text-label-technical uppercase text-secondary">
                  INFUSED N2 CELLULAR FOAM
                </div>
              </div>
              <div className="space-y-space-2xs">
                <div className="flex justify-between font-label-micro text-label-micro text-secondary">
                  <span>HẤP THỤ XUNG LỰC:</span>
                  <span className="font-bold text-primary">98.4%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden bg-surface-container-high">
                  <div className="h-full w-[98.4%] bg-primary-container" />
                </div>
                <span className="block pt-space-3xs font-label-micro text-label-micro text-secondary/70">
                  Cân chỉnh độ chính xác vi lượng tại Lab Tokyo.
                </span>
              </div>
            </div>
          </div>

          {/* Breakdown banner */}
          <div className="grid grid-cols-1 items-center gap-space-lg bg-surface-container p-space-lg md:grid-cols-3">
            {[
              ["biotech", "KIỂM ĐỊNH ĐỘ BỀN CƠ HỌC", "Đạt chu kỳ nén 1.200.000 bước chân không biến dạng."],
              ["ac_unit", "CHỊU NHIỆT ĐỘ CỰC HẠN", "Từ -30°C đến +65°C với độ ổn định đàn hồi trơ."],
              ["fingerprint", "CHỮ KÝ ĐỘC BẢN LAB", "Mã số khuôn đúc vật lý: KNS-SPEC-2025-04"],
            ].map(([icon, title, body]) => (
              <div key={title} className="flex items-center gap-space-md">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-container-high">
                  <span className="material-symbols-outlined text-[20px] text-primary-container">
                    {icon}
                  </span>
                </div>
                <div>
                  <span className="block font-label-technical text-label-technical uppercase text-primary">
                    {title}
                  </span>
                  <span className="font-body-sm text-body-sm text-secondary">{body}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PROVENANCE TRAIL ============ */}
      <section className="w-full px-gutter-mobile py-space-3xl lg:px-gutter-desktop">
        <div className="mx-auto max-w-7xl space-y-space-xl">
          <div>
            <div className="mb-space-3xs flex items-center gap-space-2xs">
              <span className="size-2 bg-primary-container" />
              <span className="font-label-technical text-label-technical uppercase tracking-widest text-primary-container">
                SỔ CÁI NGUỒN GỐC VÀ HÀNH TRÌNH CHẾ TÁC MINH BẠCH
              </span>
            </div>
            <h2 className="font-headline-md text-headline-md uppercase tracking-tight text-primary">
              PROVENANCE &amp; CRYPTOGRAPHIC AUDIT TRAIL
            </h2>
            <p className="mt-space-2xs max-w-2xl font-body-sm text-body-sm text-secondary">
              Mọi mắt xích chuỗi cung ứng bảo chứng on-chain Polygon ZK-EVM.
            </p>
          </div>

          <div className="space-y-space-sm">
            {TRAIL.map((s) => (
              <div
                key={s.n}
                className={`flex flex-col justify-between gap-space-md p-space-md transition-colors md:flex-row md:items-center ${
                  s.active
                    ? "bg-surface-container-high"
                    : "bg-surface-container hover:bg-surface-container-high"
                }`}
              >
                <div className="flex items-start gap-space-md">
                  <div
                    className={`flex size-8 shrink-0 items-center justify-center font-label-technical text-label-technical font-bold ${
                      s.active
                        ? "bg-primary-container text-on-primary-container"
                        : "bg-surface-container-lowest text-primary-container"
                    }`}
                  >
                    {s.n}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-space-xs">
                      <span
                        className={`font-label-technical text-label-technical uppercase text-primary ${s.active ? "font-bold" : "font-semibold"}`}
                      >
                        {s.title}
                      </span>
                      <span
                        className={`px-space-xs py-space-3xs font-label-micro text-label-micro ${
                          s.active
                            ? "bg-primary-container/20 font-bold text-primary-container"
                            : "bg-surface-container-lowest text-secondary"
                        }`}
                      >
                        {s.tag}
                      </span>
                    </div>
                    <p className="mt-space-3xs font-body-sm text-body-sm text-secondary">{s.body}</p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col text-left md:items-end md:text-right">
                  <span className="font-label-micro text-label-micro text-secondary">{s.time}</span>
                  <span
                    className={`font-label-technical text-label-technical text-primary-container ${s.active ? "font-bold" : ""}`}
                  >
                    HASH: {s.hash}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SPATIAL UTILITIES ============ */}
      <section className="w-full bg-surface-container-low px-gutter-mobile py-space-2xl lg:px-gutter-desktop">
        <div className="mx-auto max-w-7xl space-y-space-xl">
          <div className="flex flex-col justify-between gap-space-md md:flex-row md:items-end">
            <div>
              <div className="mb-space-3xs flex items-center gap-space-2xs">
                <span className="size-2 bg-primary-container" />
                <span className="font-label-technical text-label-technical uppercase tracking-widest text-primary-container">
                  ĐẶC QUYỀN VÀ MÔI TRƯỜNG THỰC TẾ KHÔNG GIAN
                </span>
              </div>
              <h2 className="font-headline-md text-headline-md uppercase tracking-tight text-primary">
                SPATIAL COMPUTING &amp; DIGITAL UTILITIES
              </h2>
            </div>
            <div className="font-label-micro text-label-micro uppercase text-secondary">
              [ TẤT CẢ FILE ĐÃ MÃ HÓA CHO VÍ 0x94F2 ]
            </div>
          </div>

          <div className="grid grid-cols-1 gap-space-lg md:grid-cols-3">
            {UTILITIES.map((u) => (
              <div key={u.title} className="flex flex-col justify-between space-y-space-md bg-surface-container p-space-lg">
                <div className="space-y-space-sm">
                  <div className="flex size-12 items-center justify-center bg-surface-container-lowest">
                    <span className="material-symbols-outlined text-[24px] text-primary-container">
                      {u.icon}
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm uppercase text-primary">
                    {u.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-secondary">{u.body}</p>
                </div>
                <div className="space-y-space-xs pt-space-sm">
                  <button
                    className={`flex w-full items-center justify-center gap-space-2xs px-space-sm py-space-xs font-label-technical text-label-technical uppercase transition-colors ${
                      u.cta.primary
                        ? "bg-primary-container font-bold text-on-primary-container hover:bg-primary hover:text-on-secondary"
                        : "bg-surface-container-highest text-primary hover:bg-surface-bright"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{u.cta.icon}</span>
                    <span>{u.cta.label}</span>
                  </button>
                  <span className="block text-center font-label-micro text-label-micro text-secondary/60">
                    {u.note}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ LIFETIME WARRANTY ============ */}
      <section className="w-full bg-surface-container-lowest px-gutter-mobile py-space-2xl lg:px-gutter-desktop">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-space-xl bg-surface-container p-space-xl lg:flex-row lg:items-center">
          <div className="max-w-2xl space-y-space-xs">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-[22px] text-primary-container">verified</span>
              <span className="font-label-technical text-label-technical font-semibold uppercase tracking-wider text-primary">
                CAM KẾT BẢO HÀNH SỐ VĨNH VIỄN {"//"} SYNDICATE LIFETIME PROTOCOL
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm uppercase text-primary">
              DỊCH VỤ PHỤC HỒI &amp; TÁI BẢO DƯỠNG NGUYÊN MẪU
            </h3>
            <p className="font-body-sm text-body-sm text-secondary">
              Gửi K-09 về Paris/Tokyo/Milano mỗi 24 tháng — phục hồi đệm Nitrogen, làm sạch siêu âm, khắc laser bổ sung, miễn phí.
            </p>
          </div>
          <div className="flex w-full shrink-0 flex-col items-center gap-space-sm sm:flex-row lg:w-auto">
            <button className="w-full bg-surface-container-highest px-space-lg py-space-sm font-label-technical text-label-technical uppercase text-primary transition-colors hover:bg-surface-bright sm:w-auto">
              ĐIỀU KHOẢN BẢO HÀNH
            </button>
            <button className="w-full whitespace-nowrap bg-primary-container px-space-lg py-space-sm font-label-technical text-label-technical font-semibold uppercase text-on-primary-container transition-colors hover:bg-primary hover:text-on-secondary sm:w-auto">
              ĐẶT LỊCH BẢO DƯỠNG ATELIER
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
