import Link from "next/link";
import Wordmark from "./Wordmark";
import NewsletterForm from "./NewsletterForm";

const SHOP = [
  { label: "Trang chủ", href: "/" },
  { label: "Archive & Shop", href: "/gallery" },
  { label: "K-09 Stratos Chrono", href: "/artifact/k-09-stratos-chrono" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Giỏ hàng & Thanh toán", href: "/checkout" },
];

const AGENT_LAYER = [
  { label: "Agent Console", href: "/agent" },
  { label: "llms.txt (index)", href: "/llms.txt" },
  { label: "WebMCP manifest", href: "/.well-known/agent-tools.json" },
  { label: "Tools API", href: "/api/agent/tools" },
];

const SUPPORT = [
  { label: "Hộ chiếu số (Provenance)", href: "/passport" },
  { label: "Syndicate Vault", href: "/vault" },
  { label: "Manifesto & Lookbook", href: "/lookbook" },
  { label: "Bảng size & Fitting", href: "/artifact/k-09-stratos-chrono" },
];

const SOCIALS = ["IG", "X", "DC", "YT"];

const SITES = [
  ["PARIS IX", "48.8744° N, 2.3522° E"],
  ["TOKYO SHIBUYA", "35.6617° N, 139.7040° E"],
  ["MILANO BRERA", "45.4721° N, 9.1878° E"],
];

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest text-on-surface">
      {/* Newsletter band */}
      <div className="border-b border-surface-container-highest">
        <div className="mx-auto grid max-w-[1400px] items-center gap-space-md px-gutter-mobile py-space-xl lg:grid-cols-2 lg:px-gutter-desktop">
          <div>
            <p className="flex items-center gap-space-xs font-label-technical text-label-technical uppercase tracking-widest text-primary-container">
              <span className="size-2 animate-pulse rounded-full bg-primary-container" />
              TÍN HIỆU DROP
            </p>
            <h3 className="mt-space-2xs font-headline-sm text-headline-sm uppercase tracking-tight text-primary">
              NHẬN TIN MỞ BÁN TRƯỚC CÔNG CHÚNG 60 PHÚT
            </h3>
          </div>
          <div>
            <NewsletterForm />
            <p className="mt-space-2xs font-label-micro text-label-micro uppercase tracking-widest text-secondary/50">
              MÃ HÓA ĐẦU CUỐI · KHÔNG SPAM · HỦY ĐĂNG KÝ 1 CHẠM
            </p>
          </div>
        </div>
      </div>

      {/* Main columns */}
      <div className="mx-auto grid max-w-[1400px] gap-space-xl px-gutter-mobile py-space-2xl sm:grid-cols-2 lg:grid-cols-12 lg:px-gutter-desktop">
        <div className="lg:col-span-4">
          <Wordmark size="md" />
          <p className="mt-space-md max-w-xs font-body-sm text-body-sm leading-5 text-secondary">
            Hiện vật sneaker haute couture — carbon, titanium và hộ chiếu số. Sản xuất giới
            hạn, phân phối toàn cầu.
          </p>
          <div className="mt-space-md flex gap-space-2xs">
            {SOCIALS.map((s) => (
              <button
                key={s}
                aria-label={`Kinesis trên ${s}`}
                className="grid size-10 place-items-center border border-surface-container-highest font-label-technical text-label-technical font-bold text-secondary transition-colors hover:border-primary-container hover:text-primary-container"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <nav className="lg:col-span-2" aria-label="Mua sắm">
          <p className="font-label-micro text-label-micro font-bold uppercase tracking-widest text-primary-container">
            MUA SẮM
          </p>
          <ul className="mt-space-sm space-y-space-2xs">
            {SHOP.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="font-label-technical text-label-technical uppercase tracking-wider text-secondary transition-colors hover:text-primary"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="lg:col-span-2" aria-label="Hỗ trợ">
          <p className="font-label-micro text-label-micro font-bold uppercase tracking-widest text-primary-container">
            HỖ TRỢ
          </p>
          <ul className="mt-space-sm space-y-space-2xs">
            {SUPPORT.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="font-label-technical text-label-technical uppercase tracking-wider text-secondary transition-colors hover:text-primary"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="lg:col-span-2" aria-label="Agent layer">
          <p className="font-label-micro text-label-micro font-bold uppercase tracking-widest text-primary-container">
            AGENT LAYER
          </p>
          <ul className="mt-space-sm space-y-space-2xs">
            {AGENT_LAYER.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="font-label-technical text-label-technical uppercase tracking-wider text-secondary transition-colors hover:text-primary"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-2">
          <p className="font-label-micro text-label-micro font-bold uppercase tracking-widest text-primary-container">
            ATELIER TOÀN CẦU
          </p>
          <ul className="mt-space-sm space-y-space-xs">
            {SITES.map(([city, coord]) => (
              <li
                key={city}
                className="flex items-center justify-between border-b border-surface-container-highest pb-space-2xs font-label-technical text-label-technical"
              >
                <span className="text-primary">{city}</span>
                <span className="font-label-micro text-label-micro text-secondary">{coord}</span>
              </li>
            ))}
          </ul>
          <p className="mt-space-sm font-label-micro text-label-micro uppercase tracking-widest text-secondary/60">
            HOTLINE 1900 8888 · CONCIERGE 24/7
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-surface-container-highest">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-space-xs px-gutter-mobile py-space-sm lg:px-gutter-desktop">
          <span className="font-label-micro text-label-micro uppercase tracking-widest text-secondary/50">
            © 2026 KINESIS / ATELIER
          </span>
          <span className="flex gap-space-2xs">
            {["VISA", "AMEX", "PAY", "COD"].map((p) => (
              <span
                key={p}
                className="border border-surface-container-highest px-space-2xs py-space-3xs font-label-micro text-label-micro font-bold tracking-widest text-secondary/70"
              >
                {p}
              </span>
            ))}
          </span>
          <span className="flex items-center gap-space-2xs font-label-micro text-label-micro uppercase tracking-widest text-secondary/50">
            <span className="inline-block size-1.5 animate-pulse rounded-full bg-primary-container" />
            OPERATIONAL
          </span>
        </div>
      </div>
    </footer>
  );
}
