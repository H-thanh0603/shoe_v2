import Image from "next/image";
import Link from "next/link";
import { STITCH, formatUSD } from "@/lib/data";

const POINTS = [
  ["BIẾN SẮC QUANG HỌC", "7 GÓC NHÌN · 7 SẮC THÁI"],
  ["TÚI KHÍ ĐIỀU ÁP", "KỸ THUẬT SỐ · REALTIME"],
  ["TỒN KHO", "CHỈ CÒN 18 ĐÔI"],
];

export default function ChromeStory() {
  return (
    <div className="flex h-full flex-col bg-surface-container">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-container-lowest">
        <Image
          src={STITCH.k07}
          alt="K-07 Solaris Glitch — liquid mercury chrome"
          fill
          sizes="(max-width: 1024px) 100vw, 40vw"
          className="object-cover transition-transform duration-700 hover:scale-105"
          unoptimized
        />
        <span className="absolute top-space-md left-space-md bg-primary-container px-space-xs py-space-3xs font-label-micro text-label-micro font-bold uppercase tracking-widest text-on-primary-container">
          READY TO SHIP
        </span>
        <span className="absolute right-space-md bottom-space-md bg-surface-container-lowest px-space-sm py-space-2xs font-label-technical text-label-technical font-bold text-primary-container">
          {formatUSD(740)}
        </span>
      </div>

      <div className="flex flex-grow flex-col p-space-lg">
        <p className="font-label-micro text-label-micro uppercase tracking-widest text-primary-container">
          SERIES 07 // LIQUID CHROME
        </p>
        <h3 className="mt-space-3xs font-headline-sm text-headline-sm uppercase tracking-tight text-primary">
          K-07 SOLARIS GLITCH — THỦY NGÂN LỎNG
        </h3>
        <p className="mt-space-xs font-body-sm text-body-sm leading-5 text-secondary">
          Bề mặt phủ thủy ngân lỏng quang học biến sắc theo góc nhìn, kết hợp túi đệm khí điều
          áp kỹ thuật số. Đỉnh cao tạo hình điêu khắc của Atelier — không đôi nào giống đôi nào
          dưới ánh đèn khác nhau.
        </p>

        <div className="mt-space-md space-y-space-2xs border-t border-surface-container-highest pt-space-md">
          {POINTS.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between font-label-technical text-label-technical">
              <span className="uppercase text-secondary">{k}</span>
              <span className="font-bold text-primary">{v}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto flex gap-space-2xs pt-space-md">
          <Link
            href="/artifact/k-07-solaris-glitch"
            className="flex flex-1 items-center justify-center gap-space-2xs bg-primary-container py-space-sm font-label-technical text-label-technical font-bold uppercase tracking-widest text-on-primary-container transition-colors hover:bg-primary hover:text-on-secondary"
          >
            <span>MUA NGAY</span>
            <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
          </Link>
          <Link
            href="/gallery"
            className="flex flex-1 items-center justify-center gap-space-2xs border border-surface-container-highest py-space-sm font-label-technical text-label-technical font-bold uppercase tracking-widest text-primary transition-colors hover:border-secondary"
          >
            <span>ARCHIVE</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
