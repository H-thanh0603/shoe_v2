import Image from "next/image";
import Link from "next/link";
import LookbookForm from "./LookbookForm";

const IMG = {
  tokyo:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC56ykELlLxXK3x8EQSwalWzjV8OEEl4b1UWBRh1548EuuQgOcio6qHyZhJQZ5DQH8qGDUpLThRvj0S63nRLvpLPe_rx9sWR6PtJ1dZIpTADFvXsxDS3tRKuiby9XRQdlgcwiLKoxCcgF2lnaq3y7qxaI1vaOLFn7wr7Dz6wXCSWXz0l8taOIBgn8KnDVkXI8a9-gO64LCEErQJwvqvOpcI6WuQQQWeDJqI3amRPv50_ejkzXZ7QB7taQ=s1600",
  milan:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC3_ZDKZJ4Pr1wLskcyBFHaLbseLHsp9gUposGH_2Cg4HtcshCqs5zU_OnTL4IaXn3WCdbZEWIhYmGnZrtpOMVoSjY8zRi6klEfK8hax2IrkfmsUd-VMHqpEzcbGgAanxPNd4ja2q_--RyFyPpNjBYeWQrfSYkyf7XFUCJSG-jASr9_Jh-QCiizAMUwTeBoB494tzXkU5CupznLLCWbM5ghP3Paw6UKnEN5bBMFq79yX-vzWCOxRQxgPA=s1600",
  paris:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBHh0HgaSvtrK5f9hTS-SC4I8hWyT8TIfn-M5ZvGAECw7k8NRVGR4uwEXJI4Y5P4XuHEPoA4Fn_mWkn5yP-VFjFzFfesB8lBtgZcy3VboiYOyoPHivD4rd4EANyZvfPYIM6dh3mzX1z-tQqxhB1-xkt2wI1_b_SKVGU9bg0bqVil5XZvIcXbYWhGahrmLiXtZbencsPmJE6go20pjxXN5rHrFFlXu3ByHqLp8DAklppmWxlwUvXWJuDQA=s1600",
  studioParis:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD2VqZKHcripfYY6bgMyLy3HoB7PTaj2C_RD4ncaT4BBXLGJMCu79AGCycRBldrZZOdTR52V4aYBB4pvJ5b_s6w7YvdBgHPzM6G6m6IKGfkAYyjDUjTWz0izPGJ5VHD8l4cSrxBPaPDZqYSb5a4jUIDS36Bt2gaBN96xVaxs6ch_byTe600b8rXwrlk1fJ4n6LvoAUigf_A0rNmpwgTupJLycNvyPwsoqasmuh1uKVoEfSXWL5pEuj2fA=s1600",
  studioTokyo:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD0OhG18CO2HDGMyjskFzUBunvN-ic0isly3FQVDU-eOjcvD6A70vDvh98na9OsAfX-L2X-mjt5VMfM0gn3U3ZeOFk2t2-HuxN40iVvc3-e_wrJLiMfqmXAFcbmXdjn4AngYKpgJZQwj7Y4iCembFJavO6ydBYzQIyfiiy2acD8NavgfV59cD6_LOyPeoqxXhOB5ZSOg8gmYuFvpGhK2K1x2pYVQmap9BFU0GTBeeGyGXBeCNUjk2R1PA=s1600",
};

const PILLARS = [
  {
    code: "PILLAR 01 // MAT",
    tag: "[ ISO-9001 / AER ]",
    title: "VẬT LIỆU VỊ LAI",
    sub: "(AEROSPACE MATERIALS)",
    body: "Carbon định hướng, bọt ni-tơ lỏng, thanh torsion titan Gr.5 — mỗi bước chân là năng lượng chính xác tuyệt đối.",
    bars: [
      ["TITANIUM DENSITY:", "4.43 g/cm³", "w-4/5"],
      ["ENERGY RETURN:", "87.4% KINETIC", "w-11/12"],
    ],
  },
  {
    code: "PILLAR 02 // LAB",
    tag: "[ 48-HR CRAFT ]",
    title: "CHẾ TÁC THỦ CÔNG & IN 3D",
    sub: "(PARAMETRIC ATELIER)",
    body: "48 giờ thủ công Ý + in 3D SLS — mọi cấu trúc tối ưu bằng mô phỏng sinh học.",
    bars: [
      ["SLS PRINT ACCURACY:", "±0.05 MM", "w-full"],
      ["HAND-FINISHING RUN:", "48 HRS / PAIR", "w-2/3"],
    ],
  },
  {
    code: "PILLAR 03 // FORM",
    tag: "[ NON-CONFORMIST ]",
    title: "TIÊN PHONG BẤT QUY TẮC",
    sub: "(UNAPOLOGETIC DESIGN)",
    body: "Hình học đa diện góc cạnh — giày là điêu khắc kiến trúc di động, không phải phụ kiện.",
    bars: [
      ["AERODYNAMIC DRAG:", "Cd 0.21", "w-10/12"],
      ["SCULPTURAL EDITIONS:", "STRICT CEILING 120", "w-1/4"],
    ],
  },
];

const MARQUEE = [
  "BIOMECHANICAL ATELIER",
  "ARCHITECTURAL GEOMETRY",
  "AEROSPACE MONOFILAMENT",
  "ZERO MASS COMPROMISE",
  "LIMITED RUN DISPATCH",
];

const TOUR = [
  {
    stop: "STOP 01 // KOREA",
    date: "APRIL 14-18, 2025",
    city: "SEOUL // DONGDAEMUN",
    body: "Nghệ thuật số + 12 nguyên mẫu K-Series chưa công bố.",
  },
  {
    stop: "STOP 02 // GERMANY",
    date: "JUNE 02-07, 2025",
    city: "BERLIN // KRAFTWERK",
    body: "Âm học kinetic + vũ đạo thể nghiệm + test giảm chấn.",
  },
  {
    stop: "STOP 03 // USA",
    date: "SEPT 19-24, 2025",
    city: "NEW YORK // THE SHED",
    body: "Dành cho giám tuyển Haute Couture và collector tư nhân.",
  },
];

export default function LookbookPage() {
  return (
    <>
      {/* ============ S1: MANIFESTO HERO ============ */}
      <section className="relative w-full overflow-hidden bg-surface-container-lowest">
        {/* Grid overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern height="48" id="grid-proto" patternUnits="userSpaceOnUse" width="48">
                <line stroke="#e2e8f0" strokeOpacity="0.15" strokeWidth="0.5" x1="0" x2="48" y1="0" y2="0" />
                <line stroke="#e2e8f0" strokeOpacity="0.15" strokeWidth="0.5" x1="0" x2="0" y1="0" y2="48" />
              </pattern>
            </defs>
            <rect fill="url(#grid-proto)" height="100%" width="100%" />
          </svg>
        </div>
        <div className="pointer-events-none absolute top-1/4 -right-40 size-96 rounded-full bg-primary-container/10 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-10 left-[8%] size-80 rounded-full bg-surface-tint/5 blur-[100px]" />

        <div className="relative flex min-h-[92vh] w-full flex-col justify-between px-gutter-mobile pt-36 pb-space-3xl lg:px-gutter-desktop">
          {/* Telemetry header */}
          <div className="mb-space-2xl flex flex-col justify-between gap-space-md md:flex-row md:items-end">
            <div className="flex flex-wrap items-center gap-space-sm font-label-micro text-label-micro uppercase tracking-widest text-secondary">
              <span className="inline-block size-2 animate-pulse bg-primary-container" />
              <span>DOCUMENT NO. {"//"} MNF-2025-X</span>
              <span className="text-secondary/40">•</span>
              <span className="text-on-surface-variant">CURATED BY KINESIS DESIGN BOARD</span>
            </div>
            <div className="flex items-center gap-space-xs font-label-technical text-label-technical uppercase tracking-widest text-primary-container">
              <span>CLASSIFICATION: HAUTE COUTURE / BIOMECHANIC</span>
              <span className="material-symbols-outlined text-[14px]">terminal</span>
            </div>
          </div>

          {/* Headline */}
          <div className="mb-space-2xl grid grid-cols-1 items-end gap-space-lg xl:grid-cols-12">
            <div className="flex flex-col space-y-space-xs xl:col-span-8">
              <span className="font-label-technical text-label-technical uppercase tracking-[0.24em] text-secondary">
                04 {"//"} THE EDITORIAL ESSAY
              </span>
              <h1 className="font-display-xl text-display-xl uppercase leading-none tracking-tighter text-primary">
                THE KINESIS
                <br />
                <span className="text-primary-container">MANIFESTO.</span>
              </h1>
              <p className="pt-space-xs font-headline-sm text-headline-sm uppercase tracking-tight text-secondary">
                TRIẾT LÝ VẬN ĐỘNG &amp; ĐIÊU KHẮC TƯƠNG LAI
              </p>
            </div>
            <div className="flex flex-col justify-end xl:col-span-4">
              <div className="relative bg-surface-container/90 p-space-lg shadow-xl backdrop-blur-xl">
                <div className="absolute top-0 left-0 h-full w-1 bg-primary-container" />
                <p className="font-body-lg font-light leading-relaxed text-on-surface italic">
                  &ldquo;Chúng tôi không chỉ làm giày thể thao. Chúng tôi tạo nên những tác phẩm
                  điêu khắc mang tính ứng dụng dành cho những kẻ tiên phong.&rdquo;
                </p>
                <div className="mt-space-md flex items-center justify-between pt-space-sm font-label-micro text-label-micro uppercase text-secondary">
                  <span>ALEXANDRE CHEN &amp; KENZO MORI</span>
                  <span className="text-primary-container">PARIS {"//"} TOKYO</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status matrix */}
          <div className="grid grid-cols-2 gap-space-sm font-label-technical text-label-technical uppercase text-secondary sm:grid-cols-4">
            {[
              ["CHRONO-CYCLE", "AUTUMN / WINTER 25", "text-primary"],
              ["ARCHITECTURAL TONE", "BRUTALIST TITANIUM", "text-primary"],
              ["LAB EXPERIMENT", "K-09 VOID RUNNER", "text-primary-container"],
              ["DISPATCH AVAILABILITY", "48 PROTO UNITS ONLY", "text-primary"],
            ].map(([label, val, cls]) => (
              <div key={label} className="flex flex-col bg-surface-container-low p-space-sm">
                <span className="text-label-micro text-secondary/70">{label}</span>
                <span className={`text-body-md font-semibold ${cls}`}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ S2: LOOKBOOK COLLAGE ============ */}
      <section className="w-full bg-surface px-gutter-mobile py-space-4xl lg:px-gutter-desktop">
        <div className="mb-space-3xl flex flex-col justify-between gap-space-md md:flex-row md:items-end">
          <div>
            <div className="mb-space-xs flex items-center gap-space-xs font-label-technical text-label-technical uppercase tracking-widest text-primary-container">
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span>CURATED CAPSULE VOL. 04</span>
            </div>
            <h2 className="font-headline-md text-headline-md uppercase tracking-tight text-primary">
              LOOKBOOK {"//"} CAMPAIGN VISIONS
            </h2>
          </div>
          <div className="flex items-center gap-space-md">
            <span className="font-label-micro text-label-micro uppercase tracking-widest text-secondary">
              [ HOVER HOTSPOT TO REVEAL SPECIFICATION ]
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-space-lg lg:grid-cols-12">
          {/* LOOK 01 — large 7col */}
          <div className="flex flex-col space-y-space-sm group lg:col-span-7">
            <div className="relative h-[640px] overflow-hidden bg-surface-container-lowest shadow-2xl">
              <Image
                src={IMG.tokyo}
                alt="LOOK 01 // TOKYO NOCTURNE"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/30 to-transparent" />
              <div className="absolute top-space-md left-space-md flex items-center gap-space-sm bg-surface-container-lowest/80 px-space-md py-space-xs font-label-technical text-label-technical uppercase backdrop-blur-md">
                <span className="size-2 rounded-full bg-primary-container" />
                <span className="font-semibold text-primary">LOOK 01 {"//"} TOKYO NOCTURNE</span>
              </div>
              {/* Hotspot 1 */}
              <div className="group/spot absolute bottom-1/4 left-1/3">
                <button
                  aria-label="Inspect Sneaker"
                  className="flex size-7 animate-pulse items-center justify-center rounded-full bg-primary-container font-label-micro font-bold text-on-primary-container shadow-lg transition-transform hover:scale-125"
                >
                  +
                </button>
                <div className="pointer-events-none absolute bottom-9 left-1/2 w-64 -translate-x-1/2 bg-surface-container-high/95 p-space-sm opacity-0 shadow-2xl backdrop-blur-xl transition-opacity duration-300 group-hover/spot:opacity-100">
                  <span className="mb-space-3xs block font-label-micro text-label-micro uppercase text-primary-container">
                    KINETIC FOOTWEAR
                  </span>
                  <p className="text-[16px] font-bold uppercase text-primary">
                    K-09 VOID STRIDER PROTO
                  </p>
                  <p className="mt-space-3xs font-label-technical text-label-technical text-secondary">
                    TITANIUM PLATE {"//"} SUPERCRITICAL SOLE
                  </p>
                  <div className="mt-space-xs flex items-center justify-between pt-space-xs font-label-technical text-label-technical text-on-surface">
                    <span className="text-primary-container">$890 USD</span>
                    <span className="text-secondary underline">VIEW ARTIFACT →</span>
                  </div>
                </div>
              </div>
              {/* Hotspot 2 */}
              <div className="group/spot2 absolute top-1/3 right-1/4">
                <button
                  aria-label="Inspect Outerwear"
                  className="flex size-7 items-center justify-center rounded-full bg-surface-bright font-label-micro font-bold text-primary shadow-lg transition-transform hover:scale-125"
                >
                  +
                </button>
                <div className="pointer-events-none absolute top-9 left-1/2 w-60 -translate-x-1/2 bg-surface-container-high/95 p-space-sm opacity-0 shadow-2xl backdrop-blur-xl transition-opacity duration-300 group-hover/spot2:opacity-100">
                  <span className="mb-space-3xs block font-label-micro text-label-micro uppercase text-secondary">
                    CAPSULE APPAREL
                  </span>
                  <p className="text-[15px] font-bold uppercase text-primary">
                    EXO-SHELL TRENCH MK-II
                  </p>
                  <p className="mt-space-3xs font-label-technical text-label-technical text-secondary">
                    BALLISTIC DYNEEMA {"//"} WATER-REPELLENT
                  </p>
                </div>
              </div>
              {/* Description panel */}
              <div className="absolute inset-x-0 bottom-0 flex flex-col justify-between gap-space-md p-space-lg sm:flex-row sm:items-end">
                <div>
                  <span className="font-label-micro text-label-micro uppercase tracking-widest text-secondary">
                    SHIBUYA SUB-LEVEL 04 {"//"} 02:40 AM
                  </span>
                  <h3 className="font-headline-md text-headline-md uppercase tracking-tight text-primary">
                    K-09 FIELD VALIDATION
                  </h3>
                  <p className="mt-space-xs max-w-sm font-body-sm text-body-sm text-secondary">
                    A study in silent kinetic motion. Captured on the cold granite escalators of
                    Tokyo underground labs under harsh monochromatic discharge lamps.
                  </p>
                </div>
                <button className="flex shrink-0 items-center gap-space-xs bg-primary-container px-space-md py-space-sm font-label-technical text-label-technical font-semibold uppercase text-on-primary-container transition-colors hover:bg-primary">
                  <span>SHOP THE LOOK</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          {/* LOOK 02 + 03 stack 5col */}
          <div className="flex flex-col space-y-space-xl lg:col-span-5">
            <div className="group relative h-[360px] overflow-hidden bg-surface-container-lowest shadow-xl">
              <Image
                src={IMG.milan}
                alt="LOOK 02 // MILANO CONCRETE"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent" />
              <div className="absolute top-space-md left-space-md flex items-center gap-space-sm bg-surface-container-lowest/80 px-space-md py-space-xs font-label-technical text-label-technical uppercase backdrop-blur-md">
                <span className="size-2 rounded-full bg-secondary" />
                <span className="font-semibold text-primary">LOOK 02 {"//"} MILANO CONCRETE</span>
              </div>
              <div className="group/spot3 absolute bottom-1/3 right-1/3">
                <button
                  aria-label="Inspect Sole Component"
                  className="flex size-6 animate-pulse items-center justify-center rounded-full bg-primary-container font-label-micro font-bold text-on-primary-container shadow-lg"
                >
                  +
                </button>
                <div className="pointer-events-none absolute bottom-8 right-0 w-60 bg-surface-container-high/95 p-space-sm opacity-0 shadow-2xl backdrop-blur-xl transition-opacity duration-300 group-hover/spot3:opacity-100">
                  <span className="font-label-micro text-label-micro uppercase text-primary-container">
                    MODULAR ELEMENT
                  </span>
                  <p className="text-[14px] font-bold uppercase text-primary">
                    K-MATRIX TITANIUM CHASSIS
                  </p>
                  <p className="font-label-technical text-label-technical text-secondary">
                    $520 USD {"//"} LIMITED
                  </p>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-space-md">
                <div>
                  <span className="font-headline-sm text-headline-sm uppercase text-primary">
                    TORRE VELASCA AMBIENCE
                  </span>
                  <span className="block font-label-micro text-label-micro uppercase text-secondary">
                    MILANO {"//"} 45.4600° N
                  </span>
                </div>
                <Link
                  href="/artifact"
                  className="flex items-center gap-space-3xs font-label-technical text-label-technical uppercase text-primary-container transition-colors hover:text-primary"
                >
                  <span>EXPLORE</span>
                  <span className="material-symbols-outlined text-[14px]">north_east</span>
                </Link>
              </div>
            </div>

            <div className="group relative h-[360px] overflow-hidden bg-surface-container-lowest shadow-xl">
              <Image
                src={IMG.paris}
                alt="LOOK 03 // PARIS ATELIER"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent" />
              <div className="absolute top-space-md left-space-md flex items-center gap-space-sm bg-surface-container-lowest/80 px-space-md py-space-xs font-label-technical text-label-technical uppercase backdrop-blur-md">
                <span className="size-2 rounded-full bg-primary-container" />
                <span className="font-semibold text-primary">LOOK 03 {"//"} PARIS ATELIER</span>
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-space-md">
                <div>
                  <span className="font-headline-sm text-headline-sm uppercase text-primary">
                    ATELIER RUE CHARLOT
                  </span>
                  <span className="block font-label-micro text-label-micro uppercase text-secondary">
                    PARIS LE MARAIS {"//"} 48.8627° N
                  </span>
                </div>
                <a
                  href="/vault"
                  className="flex items-center gap-space-3xs font-label-technical text-label-technical uppercase text-primary-container transition-colors hover:text-primary"
                >
                  <span>DISPATCH RECALL</span>
                  <span className="material-symbols-outlined text-[14px]">north_east</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Marquee divider */}
        <div className="mt-space-3xl flex select-none items-center overflow-hidden bg-surface-container-lowest py-space-xl">
          <div className="animate-marquee flex items-center gap-space-xl font-display-lg text-display-lg font-extrabold uppercase tracking-tighter whitespace-nowrap text-secondary/20">
            {[...MARQUEE, ...MARQUEE].map((m, i) => (
              <span key={i} className="flex items-center gap-space-xl">
                <span>{m}</span>
                <span className="text-primary-container">/</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============ S3: THREE PILLARS ============ */}
      <section className="w-full bg-surface-container-low px-gutter-mobile py-space-4xl lg:px-gutter-desktop">
        <div className="mb-space-2xl max-w-3xl">
          <div className="mb-space-xs flex items-center gap-space-xs font-label-technical text-label-technical uppercase tracking-widest text-primary-container">
            <span className="material-symbols-outlined text-[16px]">psychology</span>
            <span>FOUNDATIONAL ARCHITECTURE</span>
          </div>
          <h2 className="font-display-lg text-display-lg uppercase tracking-tight text-primary">
            THE THREE PILLARS
          </h2>
          <p className="mt-space-sm font-body-lg text-body-lg text-secondary">
            Ba nguyên lý bất biến cho từng milimet xuất xưởng — phản kháng tiêu dùng nhanh bằng kiến trúc vi mô.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-space-lg md:grid-cols-3">
          {PILLARS.map((p) => (
            <div
              key={p.code}
              className="group relative flex flex-col justify-between overflow-hidden bg-surface-container-high p-space-xl shadow-xl transition-colors duration-300 hover:bg-surface-bright"
            >
              <div className="pointer-events-none absolute top-0 right-0 size-24 rounded-bl-full bg-primary-container/10" />
              <div>
                <div className="mb-space-lg flex items-center justify-between">
                  <span className="font-label-technical text-label-technical font-bold uppercase tracking-widest text-primary-container">
                    {p.code}
                  </span>
                  <span className="font-label-micro text-label-micro tracking-widest text-secondary">
                    {p.tag}
                  </span>
                </div>
                <h3 className="mb-space-sm font-headline-sm text-headline-sm uppercase tracking-tight text-primary">
                  {p.title}
                  <br />
                  <span className="text-body-sm tracking-wider text-secondary font-label-technical">
                    {p.sub}
                  </span>
                </h3>
                <p className="mb-space-lg font-body-md leading-relaxed text-body-md text-secondary">
                  {p.body}
                </p>
              </div>
              <div className="flex flex-col space-y-space-sm bg-surface-container-lowest p-space-md">
                {p.bars.map(([label, val, w]) => (
                  <div key={label}>
                    <div className="flex items-center justify-between font-label-technical text-label-technical">
                      <span className="uppercase text-secondary">{label}</span>
                      <span className="font-mono text-primary">{val}</span>
                    </div>
                    <div className="h-1 w-full overflow-hidden bg-surface-container">
                      <div className={`h-full bg-primary-container ${w}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ S4: FOUNDERS & ATELIER ============ */}
      <section className="w-full bg-surface px-gutter-mobile py-space-4xl lg:px-gutter-desktop">
        <div className="mb-space-3xl grid grid-cols-1 items-center gap-space-xl xl:grid-cols-12">
          <div className="flex flex-col space-y-space-md xl:col-span-6">
            <div className="flex items-center gap-space-xs font-label-technical text-label-technical uppercase tracking-widest text-primary-container">
              <span className="material-symbols-outlined text-[16px]">domain</span>
              <span>SPATIAL LABORATORY {"//"} ARCHITECTURE</span>
            </div>
            <h2 className="font-headline-md text-headline-md uppercase tracking-tight text-primary">
              PARIS DESIGN ATELIER &amp; TOKYO KINETIC LAB
            </h2>
            <p className="font-body-md leading-relaxed text-body-md text-secondary">
              Điêu khắc gia Pháp Alexandre Chen gặp kỹ sư robot Kenzo Mori tại Tokyo — Haute Couture Pháp lai dung sai nano Nhật Bản.
            </p>
            <div className="grid grid-cols-2 gap-space-md pt-space-sm">
              <div className="bg-surface-container-low p-space-md">
                <span className="block font-label-micro text-label-micro uppercase tracking-widest text-primary-container">
                  ATELIER PARIS {"//"} IX
                </span>
                <p className="mt-space-3xs font-body-sm text-body-sm text-on-surface">
                  Nghiên cứu silhouette, da thuộc cao cấp, hoàn thiện từng chi tiết.
                </p>
              </div>
              <div className="bg-surface-container-low p-space-md">
                <span className="block font-label-micro text-label-micro uppercase tracking-widest text-primary-container">
                  TOKYO LAB {"//"} SHIBUYA
                </span>
                <p className="mt-space-3xs font-body-sm text-body-sm text-on-surface">
                  Thuật toán chịu lực, in 3D SLS, kiểm định -20°C đến +60°C.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2 xl:col-span-6">
            <div className="flex flex-col space-y-space-xs">
              <div className="relative h-96 overflow-hidden bg-surface-container-lowest shadow-xl">
                <Image
                  src={IMG.studioParis}
                  alt="Studio Paris IX"
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-x-0 bottom-0 bg-surface-container-lowest/80 p-space-sm font-label-micro text-label-micro uppercase text-secondary backdrop-blur-sm">
                  STUDIO 01: PARIS IX {"//"} LE MARAIS
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-space-xs sm:mt-space-xl">
              <div className="relative h-96 overflow-hidden bg-surface-container-lowest shadow-xl">
                <Image
                  src={IMG.studioTokyo}
                  alt="Studio Tokyo Meguro Lab"
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-x-0 bottom-0 bg-surface-container-lowest/80 p-space-sm font-label-micro text-label-micro uppercase text-secondary backdrop-blur-sm">
                  STUDIO 02: TOKYO {"//"} MEGURO LAB
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tour */}
        <div className="bg-surface-container-lowest p-space-xl shadow-2xl">
          <div className="flex flex-col justify-between gap-space-sm pb-space-lg md:flex-row md:items-center">
            <div>
              <span className="font-label-technical text-label-technical uppercase tracking-widest text-primary-container">
                CALENDAR 2025
              </span>
              <h3 className="font-headline-sm text-headline-sm uppercase text-primary">
                KINESIS EXHIBITION TOUR {"//"} ARTIFACT REVEAL
              </h3>
            </div>
            <span className="font-label-micro text-label-micro uppercase tracking-widest text-secondary">
              [ RSVP REQUIRED {"//"} LIMITED PASSES ]
            </span>
          </div>
          <div className="grid grid-cols-1 gap-space-md md:grid-cols-3">
            {TOUR.map((t) => (
              <div key={t.stop} className="flex flex-col justify-between space-y-space-md bg-surface-container p-space-lg">
                <div>
                  <div className="flex items-center justify-between pb-space-xs font-label-micro text-label-micro uppercase text-secondary">
                    <span>{t.stop}</span>
                    <span className="text-primary-container">{t.date}</span>
                  </div>
                  <h4 className="text-[20px] font-bold uppercase text-primary">{t.city}</h4>
                  <p className="mt-space-3xs font-body-sm text-body-sm text-secondary">{t.body}</p>
                </div>
                <button className="w-full bg-surface-container-high py-space-xs font-label-technical text-label-technical uppercase text-primary transition-colors hover:bg-primary-container hover:text-on-primary-container">
                  REQUEST ENTRY ACCESS
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ S5: CONSULTATION ============ */}
      <LookbookForm />
    </>
  );
}
