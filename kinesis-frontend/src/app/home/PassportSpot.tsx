import Image from "next/image";
import Link from "next/link";
import { STITCH } from "@/lib/data";

const POINTS = [
  ["CHIP NFC NTAG 424", "TRONG LƯỠI GÀ · CHẠM LÀ XÁC THỰC"],
  ["NFT ERC-721", "POLYGON ZK-EVM · KHÔNG THỂ LÀM GIẢ"],
  ["PROVENANCE 6 BƯỚC", "TỪ XƯỞNG TOKYO ĐẾN TAY BẠN"],
  ["BẢO HÀNH TRỌN ĐỜI", "SYNDICATE LIFETIME PROTOCOL"],
];

export default function PassportSpot() {
  return (
    <section className="w-full border-y border-surface-container-highest bg-surface-container-lowest py-space-4xl">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-space-xl px-gutter-mobile lg:grid-cols-12 lg:px-gutter-desktop">
        {/* Visual: certificate card */}
        <div className="relative lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden bg-surface-container-lowest">
            <Image
              src={STITCH.k09}
              alt="K-09 Stratos kèm hộ chiếu số vĩnh cửu"
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent" />
            <div className="absolute top-space-md left-space-md flex items-center gap-space-2xs bg-surface-container-lowest/90 px-space-sm py-space-2xs backdrop-blur-md">
              <span className="size-2 animate-pulse rounded-full bg-primary-container" />
              <span className="font-label-micro text-label-micro font-bold uppercase tracking-widest text-primary-container">
                ON-CHAIN VERIFIED
              </span>
            </div>
            <div className="absolute inset-x-space-md bottom-space-md border border-primary-container/30 bg-surface-container-lowest/90 p-space-md backdrop-blur-md">
              <p className="font-label-micro text-label-micro uppercase tracking-widest text-secondary">
                CERTIFICATE OF AUTHENTICITY
              </p>
              <p className="mt-space-3xs font-headline-sm text-headline-sm uppercase text-primary">
                K-09 STRATOS CHRONO
              </p>
              <div className="mt-space-xs flex items-center justify-between border-t border-surface-container-highest pt-space-xs font-mono font-label-micro text-label-micro">
                <span className="text-secondary">TOKEN ERC-721 (#0094)</span>
                <span className="text-primary-container">SPECIMEN #04 / 50</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copy */}
        <div className="lg:col-span-7">
          <p className="flex items-center gap-space-xs font-label-technical text-label-technical uppercase tracking-widest text-primary-container">
            <span className="material-symbols-outlined text-[16px]">fingerprint</span>
            11 // PASSPORT VĨNH CỬU
          </p>
          <h2 className="mt-space-2xs font-display-lg text-display-lg uppercase leading-none tracking-tight text-primary">
            MỘT ĐÔI GIÀY —
            <br />
            MỘT HỘ CHIẾU <span className="text-primary-container">VĨNH CỬU</span>
          </h2>
          <p className="mt-space-md max-w-xl font-body-lg text-body-lg text-secondary">
            Mỗi hiện vật Kinesis đúc kèm hộ chiếu số theo giày trọn đời: xác thực một chạm,
            nguồn gốc minh bạch trên chuỗi khối, và đặc quyền Syndicate không thể sang nhượng
            giả mạo.
          </p>

          <div className="mt-space-lg grid grid-cols-1 gap-space-sm sm:grid-cols-2">
            {POINTS.map(([k, v]) => (
              <div key={k} className="border border-surface-container-highest bg-surface-container p-space-md">
                <p className="font-label-technical text-label-technical font-bold uppercase tracking-widest text-primary">
                  {k}
                </p>
                <p className="mt-space-3xs font-label-micro text-label-micro uppercase tracking-widest text-secondary">
                  {v}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-space-lg flex flex-col gap-space-sm sm:flex-row">
            <Link
              href="/passport"
              className="flex items-center justify-center gap-space-xs bg-primary-container px-space-xl py-space-md font-label-technical text-label-technical font-bold uppercase tracking-widest text-on-primary-container transition-colors hover:bg-primary hover:text-on-secondary"
            >
              <span>XEM HỘ CHIẾU SỐ K-09</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
            <Link
              href="/vault"
              className="flex items-center justify-center gap-space-xs border border-surface-container-highest px-space-xl py-space-md font-label-technical text-label-technical font-bold uppercase tracking-widest text-primary transition-colors hover:border-secondary"
            >
              <span>VÀO SYNDICATE VAULT</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
