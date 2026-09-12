import Link from "next/link";
import Image from "next/image";
import ParticleField from "@/components/ParticleField";
import Reveal from "@/components/Reveal";
import VipInviteForm from "./VipInviteForm";
import HomeDrops from "./HomeDrops";
import CountdownStrip from "./home/CountdownStrip";
import SilhouetteFinder from "./home/SilhouetteFinder";
import ZeroG from "./home/ZeroG";
import ColorMixer from "./home/ColorMixer";
import ChromeStory from "./home/ChromeStory";
import StatsBand from "./home/StatsBand";
import Voices from "./home/Voices";
import DropTimeline from "./home/DropTimeline";
import ValueProps from "./home/ValueProps";
import PassportSpot from "./home/PassportSpot";
import Faq from "./home/Faq";
import { PRODUCTS } from "@/lib/data";

const STITCH_IMG = {
  hero: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKMHELlXfmNzxocRGSAjON35prEgJPZjsYlAfMKYCCfqwxd6aY4-uUNR1HA8yK7HcQUcK8kaNyQqCRIJCynxLP9tXsHuN4Yaezbo1jTrLvU9KMzBCQDmlBCgU-so9ekm3ZowgOXeNobEtioZunVf3Q-NhJQguHlMsPtPxCdJ421Z3X9JGV814NN-FbLpO6r3fmdp-RW4d4cKCq4WMTkwFv6InA7O7aUqJILUqSN8BCyiVHAG9xPMT9hQ=s1600",
  macro:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDwXkxDC-Ee-xe4H3g4W8wNp9YowY8lBpgt1YbBzsvaRHAxZnXokPQl395mlSwNrbf3flExkYJ0tySCCdXJQHCP3wj_knmYjQNQD8M9kH3isFy34jLEtmYcWzCWPM6JvchTFceS6h-hYbxB4iaH43Z9wD6rFSH1VpMOyq40xTEa5GYzwFZqbY3dKKc_pKSzq6k8jWBrjI8czfUGn8BKJmJFH8Y5YGn940rimeXFjAKw-pElPJMcoDv8Dw=s1600",
  phantom:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBz8-yeFEDeIs-jAZZUXAtuDXnLaZ4VQTdmNHN_i75Wz4_y8ZbFa0mg_dTqPjhLXzTWcOOZ6-NGSZlQvvmxR5Vv_UROzhF10dy8llDAXshnW9CBujWmLrF9jm5WXUJntMCLRjgacxpCiYnfdETcR594K7igdMFTMrV26AUrmCEirGPSNBsOns-oWWzZX94Pj6s7ZzFjOTBtBkB52BdNo9HmcftMlzxlmcauVvwA0-PKJgrGKMWw_AlZew=s1600",
  solaris:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAZ_OZmGr3GbWgsJCHn1nTSHOv-hcKMjcr8Z00VKaOhGIHa2SFsQuYPj7Pdc253Ha_rvmxFd7LztDgrhhWyfw8I9Bl1_n-9rpzdUcYv4hqRwYnadh1ErQGCTV6ObX1391p8pjZSyXG4G5QOuM_in_7BoZXPkL-q9mhDkUVWcCfwJJCaMzNI3ckyyShLmYu33TYJcGlqCir2ouHQsRtSHsNfJYiztF0VH9GibIRtgWMasKEp-zLlPyfYAw=s1600",
  titan:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCg0NuGsXVSyXjXfl0SYe3nQxUZbXJJTOfffTQAHjxBSaVkBnbV7cfcTouVsD76cxQd5TSXZZurhODLRQDTybn8ek8JNksJ0BhiY9GNXM7n15PjMaC0K4SBa1zJSbxk1XedaHSjyuj3UUM9NmcphRYlGVpN0nvRqEelC7Vck7vTpunxL12JR8IAioTcQ2fLkcvbUU_bvO0Yps8v5F526Cbu91AxO2zHTqbFr3GzuSyNqixUmL9qBLSZ6g=s1600",
  lab: "https://lh3.googleusercontent.com/aida-public/AB6AXuAgUvQZchaRXP6_hlo-Zigs6FSdxvLMvZC6OMRYhuNBdgxufZmv1ab5AqBwGSRWUGcvhCUKjAuTBRtZCy7VXZaRYCiBYkcb7hRXWtU3Q6PZBbGTtcVwajQH66sD3xi_4QXet4KgwFNwpob6rmOVXNr-XXLyTIiJ8t_3hs-xeSw5mlUNL895j3-Vpz2jcfpDdC-7prYRjb7OBCg82FQ8VmfRC7ecM_ESM23Yzx4WBHvI721rFHsR1G_GVA=s1600",
};

export default function HomePage() {
  return (
    <>
      {/* ============ HERO — cinematic full-bleed ============ */}
      <section className="relative flex min-h-[100svh] w-full flex-col overflow-hidden">
        {/* Full-bleed backdrop */}
        <Image
          src={STITCH_IMG.hero}
          alt="K-09 Stratos Chrono floating in zero gravity dark laboratory"
          fill
          priority
          sizes="100vw"
          className="animate-kenburns object-cover"
          unoptimized
        />
        {/* Cinematic gradients */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/35 to-surface-container-lowest/60" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-surface-container-lowest/85 via-transparent to-transparent" />
        <ParticleField density={50} />

        {/* Content */}
        <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-end px-gutter-mobile pt-36 pb-space-xl lg:px-gutter-desktop">
          <Reveal delay={0.05}>
            <div className="flex flex-wrap items-center gap-space-xs">
              <span className="inline-flex items-center gap-space-xs bg-primary-container px-space-sm py-space-3xs font-label-micro text-label-micro font-bold uppercase tracking-widest text-on-primary-container">
                <span className="size-1.5 animate-ping rounded-full bg-on-primary-container" />
                DROP 04 // LIVE
              </span>
              <span className="bg-surface-container-lowest/80 px-space-sm py-space-3xs font-label-micro text-label-micro uppercase tracking-widest text-secondary backdrop-blur-md">
                TOKYO — PARIS // EDITION OF 500
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-space-md font-label-technical text-label-technical uppercase tracking-[0.24em] text-primary-container">
              EXPERIMENTAL SILHOUETTE NO. 09
            </p>
            <h1 className="select-none font-display-xl text-display-xl uppercase leading-[0.88] tracking-tight text-primary">
              BEYOND
              <br />
              <span className="animate-gradientShift bg-gradient-to-r from-primary via-on-surface to-secondary/40 bg-clip-text text-transparent">
                GRAVITY
              </span>
            </h1>
            <p className="mt-space-sm max-w-xl font-headline-sm text-headline-sm uppercase tracking-tight text-secondary">
              K-09 STRATOS CHRONO — $680 USD
            </p>
            <p className="mt-space-xs max-w-xl font-body-md text-body-md leading-6 text-secondary">
              Khung carbon nguyên khối, khóa Titanium Grade 5, hộ chiếu số NFT. Giới hạn 500
              đôi toàn cầu — 142 suất còn lại.
            </p>
          </Reveal>
          <Reveal delay={0.28}>
            <div className="mt-space-lg flex flex-col gap-space-sm sm:flex-row">
              <Link
                href="/artifact/k-09-stratos-chrono"
                className="flex items-center justify-center gap-space-sm bg-primary-container px-space-2xl py-space-md font-label-technical text-label-technical font-bold uppercase tracking-widest text-on-primary-container shadow-xl transition-all hover:bg-primary hover:text-on-secondary"
              >
                <span>ENTER DROP // $680</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              <Link
                href="/artifact/k-09-stratos-chrono"
                className="flex items-center justify-center gap-space-sm border border-primary/40 bg-surface-container-lowest/60 px-space-xl py-space-md font-label-technical text-label-technical font-semibold uppercase tracking-widest text-primary backdrop-blur-md transition-colors hover:border-primary hover:bg-surface-container-lowest"
              >
                <span className="material-symbols-outlined text-[18px]">view_in_ar</span>
                <span>EXPLORE CRAFT</span>
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Bottom ticker */}
        <div className="relative z-10 border-t border-primary/15 bg-surface-container-lowest/70 backdrop-blur-md">
          <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-space-xs px-gutter-mobile py-space-sm lg:px-gutter-desktop">
            <span className="flex items-center gap-space-2xs font-label-technical text-label-technical uppercase tracking-widest text-primary">
              <span className="material-symbols-outlined text-[16px] text-primary-container">lock_open</span>
              SECURE CLEARANCE
            </span>
            <span className="font-label-technical text-label-technical uppercase tracking-widest text-secondary">
              SLOT ALLOCATION: <strong className="text-primary">142/500 REMAINING</strong>
            </span>
            <span className="hidden items-center gap-space-2xs font-label-micro text-label-micro uppercase tracking-widest text-secondary sm:flex">
              CUỘN XUỐNG
              <span className="material-symbols-outlined animate-bounce text-[16px] text-primary-container">expand_more</span>
            </span>
          </div>
        </div>
      </section>

      {/* ============ HERO SPEC STRIP ============ */}
      <section className="w-full border-b border-surface-container-highest bg-surface-container-lowest">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 divide-x divide-surface-container-highest px-gutter-mobile lg:grid-cols-4 lg:px-gutter-desktop">
          {[
            ["NET WEIGHT", "310G", "NHẸ HƠN EVA 38%"],
            ["TORSION INDEX", "9.8 / 10", "CARBON NGUYÊN KHỐI"],
            ["RECYCLED CARBON", "74%", "VẬT LIỆU TÁI CHẾ"],
            ["XÁC THỰC", "NFC + NFT", "CHIP MÃ HÓA ĐỘC BẢN"],
          ].map(([k, v, sub]) => (
            <div key={k} className="flex flex-col gap-space-3xs px-space-md py-space-md">
              <span className="font-label-micro text-label-micro uppercase tracking-widest text-secondary">{k}</span>
              <span className="font-headline-sm text-headline-sm font-bold text-primary">{v}</span>
              <span className="font-label-micro text-label-micro uppercase tracking-widest text-primary-container">{sub}</span>
            </div>
          ))}
        </div>
      </section>


      <CountdownStrip />

      {/* ============ CURATED DROPS — filterable uniform grid ============ */}
      <section className="w-full bg-surface py-space-4xl">
        <div className="w-full px-gutter-mobile lg:px-gutter-desktop">
          <div className="pb-space-xl">
            <div className="flex items-center gap-space-xs font-label-technical text-label-technical text-primary-container uppercase">
              <span>02 {"//"} ARCHIVE CAPSULES</span>
            </div>
            <div className="mt-space-2xs flex flex-col justify-between gap-space-md lg:flex-row lg:items-end">
              <h2 className="font-display-lg text-display-lg uppercase tracking-tight text-primary">
                CURATED DROPS
              </h2>
              <p className="max-w-xl font-body-lg text-body-lg text-secondary">
                Bộ sưu tập biểu tượng kiến tạo từ tinh thần Haute Couture và kỹ nghệ tương lai.
                Mỗi dòng sản phẩm được chế tác giới hạn theo từng đợt thử nghiệm độc lập.
              </p>
            </div>
          </div>

          <HomeDrops products={PRODUCTS} />
        </div>
      </section>


      {/* ============ MARQUEE DIVIDER ============ */}
      <div className="flex select-none items-center overflow-hidden border-y border-surface-container-highest bg-surface-container-lowest py-space-md">
        <div className="animate-marquee flex items-center gap-space-xl font-label-technical text-label-technical font-bold uppercase tracking-widest whitespace-nowrap text-secondary">
          {["DROP 04 // LIVE", "MIỄN PHÍ VẬN CHUYỂN TOÀN CẦU", "NFC CERTIFIED", "500 ĐÔI GIỚI HẠN", "PARIS — TOKYO — MILAN", "DROP 04 // LIVE", "MIỄN PHÍ VẬN CHUYỂN TOÀN CẦU", "NFC CERTIFIED", "500 ĐÔI GIỚI HẠN", "PARIS — TOKYO — MILAN"].map((m, i) => (
            <span key={i} className="flex items-center gap-space-xl">
              <span>{m}</span>
              <span className="size-1.5 bg-primary-container" />
            </span>
          ))}
        </div>
      </div>

      <Reveal>
        <ValueProps />
      </Reveal>

      <Reveal>
        <SilhouetteFinder />
      </Reveal>

      <Reveal>
        <ZeroG />
      </Reveal>

      {/* ============ LAB PLAYGROUND — bespoke mixer ============ */}
      <section className="w-full bg-surface py-space-4xl">
        <div className="mx-auto max-w-[1400px] px-gutter-mobile lg:px-gutter-desktop">
          <div className="flex items-center gap-space-xs font-label-technical text-label-technical uppercase text-primary-container">
            <span className="material-symbols-outlined text-[16px]">experiment</span>
            <span>06 // LAB PLAYGROUND // THÍ NGHIỆM MỞ</span>
          </div>
          <h2 className="mt-space-2xs font-display-lg text-display-lg uppercase leading-none tracking-tight text-primary">
            SỜ VÀO <span className="text-primary-container">KHOA HỌC</span>
          </h2>
          <div className="mt-space-xl grid grid-cols-1 gap-space-lg lg:grid-cols-2">
            <ColorMixer />
            <ChromeStory />
          </div>
        </div>
      </section>

      {/* ============ KINETIC LABORATORY — bento 8/4 ============ */}
      <section className="relative w-full overflow-hidden bg-surface-container-lowest py-space-4xl">
        <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary-container/5 blur-3xl" />
        <div className="relative z-10 w-full px-gutter-mobile lg:px-gutter-desktop">
          <div className="flex items-center gap-space-xs pb-space-xs font-label-technical text-label-technical text-primary-container uppercase">
            <span className="size-2 bg-primary-container" />
            <span>07 {"//"} KINETIC LABORATORY &amp; BIOMECHANICS</span>
          </div>
          <div className="grid grid-cols-1 items-center gap-space-xl pb-space-2xl lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 className="font-display-lg text-display-lg uppercase leading-none tracking-tight text-primary">
                INNOVATION &amp;
                <br />
                CRAFT ARCHITECTURE
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="font-body-lg text-body-lg text-secondary">
                Tại phòng thí nghiệm Kinesis, chúng tôi loại bỏ ranh giới giữa quy trình thủ công
                thời trang may đo cao cấp và thuật toán in cấu trúc nano. Không có sự thỏa hiệp
                về độ êm và độ bền vận hành.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-space-lg md:grid-cols-12">
            {/* Bento 1: engineering showcase 8col */}
            <div className="flex flex-col justify-between overflow-hidden bg-surface-container group md:col-span-8">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-container-high">
                <Image
                  src={STITCH_IMG.lab}
                  alt="Phòng lab Kinesis — robotic arm và nghệ nhân thủ công"
                  fill
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute bottom-space-md left-space-md flex items-center gap-space-md bg-surface-container-lowest/90 px-space-md py-space-xs backdrop-blur">
                  <span className="font-label-technical text-label-technical text-primary-container uppercase">
                    ROBOTIC PRECISION {"//"} HAND FINISHED
                  </span>
                  <span className="font-label-micro text-label-micro text-secondary">
                    0.05MM TOLERANCE
                  </span>
                </div>
              </div>
              <div className="flex flex-col justify-between gap-space-lg p-space-xl md:flex-row md:items-center">
                <div className="space-y-space-2xs">
                  <h3 className="font-headline-sm text-headline-sm uppercase text-primary">
                    CÔNG NGHỆ ĐẾ LATTICE TẾ BÀO MỞ
                  </h3>
                  <p className="max-w-md font-body-sm text-body-sm text-secondary">
                    Được tổng hợp từ hạt vi sợi đàn hồi không dùng keo hóa học, giúp giảm 45%
                    trọng lượng nhưng gia tăng độ nảy quán tính ở từng bước chuyển động.
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-space-lg">
                  <div className="flex flex-col">
                    <span className="font-label-micro text-label-micro text-secondary uppercase">
                      THỜI GIAN CHẾ TÁC
                    </span>
                    <span className="font-headline-md text-headline-md text-primary">480H</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-micro text-label-micro text-secondary uppercase">
                      TIÊU CHUẨN XẢ THẢI
                    </span>
                    <span className="font-headline-md text-headline-md text-primary-container">
                      0% RESIDUE
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento 2 column 4col */}
            <div className="flex flex-col gap-space-lg md:col-span-4">
              {/* Card A: bio material */}
              <div className="flex flex-1 flex-col justify-between bg-surface-container p-space-lg">
                <div className="space-y-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-label-technical text-label-technical text-primary-container uppercase">
                      BIO-MATERIAL PROTO
                    </span>
                    <span className="material-symbols-outlined text-[20px] text-primary">
                      biotech
                    </span>
                  </div>
                  <h4 className="font-headline-sm text-headline-sm uppercase text-primary">
                    DA SINH HỌC TỔNG HỢP
                  </h4>
                  <p className="font-body-sm text-body-sm text-secondary">
                    Nuôi cấy từ sợi tơ nấm Mycelium xử lý phủ titan mỏng, cho bề mặt mềm mại
                    tương đương da bê Paris nhưng chống xước và kháng nước tuyệt đối.
                  </p>
                </div>
                <div className="pt-space-md">
                  <div className="flex items-center justify-between pb-space-xs font-label-micro text-label-micro text-secondary">
                    <span>TENSILE STRENGTH</span>
                    <span className="font-bold text-primary">140 MPA</span>
                  </div>
                  <svg className="h-8 w-full" fill="none" preserveAspectRatio="none" viewBox="0 0 200 32">
                    <path
                      className="text-primary-container"
                      d="M0 24 L30 20 L60 22 L90 14 L120 16 L150 6 L180 8 L200 2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      className="text-primary-container/10"
                      d="M0 24 L30 20 L60 22 L90 14 L120 16 L150 6 L180 8 L200 2 L200 32 L0 32 Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </div>
              {/* Card B: dampening */}
              <div className="flex flex-1 flex-col justify-between bg-surface-container p-space-lg">
                <div className="space-y-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-label-technical text-label-technical text-secondary uppercase">
                      DAMPENING MATRIX
                    </span>
                    <span className="material-symbols-outlined text-[20px] text-primary-container">
                      graphic_eq
                    </span>
                  </div>
                  <h4 className="font-headline-sm text-headline-sm uppercase text-primary">
                    TRIỆT TIÊU CHẤN ĐỘNG
                  </h4>
                  <p className="font-body-sm text-body-sm text-secondary">
                    Hấp thụ 94% lực va chạm khi tiếp đất, bảo vệ khớp cổ chân trong mọi tình
                    huống di chuyển cường độ cao.
                  </p>
                </div>
                <div className="flex items-center gap-space-xs pt-space-sm font-label-technical text-label-technical text-primary">
                  <span className="size-1.5 bg-primary-container" />
                  <span>ZERO COMPROMISE STANDARDS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Reveal>
        <StatsBand />
      </Reveal>

      <Reveal>
        <Voices />
      </Reveal>

      {/* ============ DIGITAL FITTING ROOM ============ */}
      <section className="w-full bg-surface-container-lowest py-space-3xl">
        <div className="w-full px-gutter-mobile lg:px-gutter-desktop">
          <div className="flex flex-col items-center justify-between gap-space-xl bg-surface-container p-space-xl lg:flex-row lg:p-space-2xl">
            <div className="max-w-2xl space-y-space-sm">
              <div className="flex items-center gap-space-xs font-label-technical text-label-technical text-primary-container uppercase">
                <span className="material-symbols-outlined text-[16px]">tune</span>
                <span>09 // DIGITAL FITTING ROOM &amp; BESPOKE LAST</span>
              </div>
              <h3 className="font-headline-md text-headline-md uppercase tracking-tight text-primary">
                TRẢI NGHIỆM ĐO NI BÀN CHÂN 3D TẠI ATELIER
              </h3>
              <p className="font-body-md text-body-md text-secondary">
                Khách hàng tại Hà Nội, TP. Hồ Chí Minh, Tokyo hoặc Paris có thể đặt lịch hẹn
                đo quét quang học bàn chân 3D chuyên sâu để chế tác phom giày cá nhân hóa độc
                quyền.
              </p>
            </div>
            <div className="flex w-full shrink-0 flex-col items-center gap-space-md sm:flex-row lg:w-auto">
              <button className="w-full bg-primary px-space-xl py-space-md font-label-technical text-label-technical font-bold uppercase text-on-secondary transition-colors hover:bg-primary-container hover:text-on-primary-container sm:w-auto">
                ĐẶT LỊCH PHÒNG LAB
              </button>
              <a
                href="#"
                className="w-full px-space-md py-space-md text-center font-label-technical text-label-technical uppercase text-secondary transition-colors hover:text-primary sm:w-auto"
              >
                XEM BẢNG SIZE CHI TIẾT
              </a>
            </div>
          </div>
        </div>
      </section>

      <Reveal>
        <DropTimeline />
      </Reveal>

      <Reveal>
        <PassportSpot />
      </Reveal>

      <Faq />

      {/* ============ VIP SYNDICATE INVITATION ============ */}
      <section className="w-full bg-surface-container-high py-space-3xl">
        <div className="w-full px-gutter-mobile lg:px-gutter-desktop">
          <div className="grid grid-cols-1 items-center gap-space-xl lg:grid-cols-12">
            <div className="space-y-space-sm lg:col-span-7">
              <div className="flex items-center gap-space-xs font-label-technical text-label-technical text-primary-container uppercase">
                <span className="size-2 animate-pulse rounded-full bg-primary-container" />
                <span>13 // VIP ARCHIVE INVITATION {"//"} KINESIS SYNDICATE</span>
              </div>
              <h3 className="font-headline-md text-headline-md uppercase tracking-tight text-primary">
                JOIN PRIVATE CLIENT LIST FOR EARLY ARCHIVE RELEASES
              </h3>
              <p className="max-w-xl font-body-md text-body-md text-secondary">
                Đặc quyền nhận thông báo drop trước 60 phút, quyền truy cập phòng trưng bày mật
                và đặt hàng trước các phiên bản thử nghiệm giới hạn dưới 50 đôi trên thế giới.
              </p>
            </div>
            <div className="flex flex-col space-y-space-sm lg:col-span-5">
              <VipInviteForm />
              <span className="font-label-micro text-label-micro text-secondary/60 uppercase">
                BẢO MẬT TUYỆT ĐỐI THEO CHUẨN ENCRYPTED PROTOCOL 256-BIT.
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
