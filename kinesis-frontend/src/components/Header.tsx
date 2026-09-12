"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import Wordmark from "./Wordmark";

const NAV = [
  { index: "01", label: "DISCOVERY", href: "/" },
  { index: "02", label: "ARCHIVE", href: "/gallery" },
  { index: "03", label: "ARTIFACT", href: "/artifact" },
  { index: "04", label: "MANIFESTO", href: "/lookbook" },
  { index: "05", label: "SYNDICATE", href: "/vault" },
  { index: "06", label: "AGENT", href: "/agent" },
];

export default function Header() {
  const pathname = usePathname();
  // Remount on navigation so menu/search state always resets cleanly
  return <HeaderBar key={pathname} pathname={pathname} />;
}

function HeaderBar({ pathname }: { pathname: string }) {
  const router = useRouter();
  const { count } = useCart();
  const { count: wishCount } = useWishlist();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const submitSearch = () => {
    router.push(`/gallery${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""}`);
  };

  return (
    <>
      <div className="flex w-full items-center justify-between bg-primary-container px-gutter-mobile py-space-3xs lg:px-gutter-desktop">
        <p className="flex items-center gap-space-2xs font-label-micro text-label-micro font-bold uppercase tracking-widest text-on-primary-container">
          <span className="size-1.5 animate-pulse rounded-full bg-on-primary-container" />
          DROP 04 LIVE — CÒN 142/500 SUẤT
        </p>
        <p className="hidden font-label-micro text-label-micro font-bold uppercase tracking-widest text-on-primary-container sm:block">
          MIỄN PHÍ DHL 48–72H · HOTLINE 1900 8888
        </p>
      </div>

      <header
        className={`sticky top-0 z-50 -mb-20 w-full backdrop-blur-md transition-colors ${
          scrolled ? "border-b border-surface-container-highest bg-background/95" : "bg-background/60"
        }`}
      >
        <div className="flex w-full items-center justify-between gap-space-sm px-gutter-mobile py-space-sm lg:px-gutter-desktop">
          <Link href="/" aria-label="Kinesis Atelier — Trang chủ">
            <Wordmark size="sm" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-space-lg lg:flex">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.index}
                  href={item.href}
                  className={`relative py-space-2xs font-label-technical uppercase tracking-widest transition-colors ${
                    active ? "text-primary" : "text-secondary/70 hover:text-primary"
                  }`}
                >
                  <span className={active ? "text-primary-container" : "text-secondary/40"}>
                    {item.index}
                  </span>{" "}
                  {item.label}
                  {active && (
                    <span className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-primary-container" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-space-2xs">
            {searchOpen ? (
              <div className="flex items-center border border-surface-container-highest bg-surface-container-low pl-space-xs">
                <span className="material-symbols-outlined text-[18px] text-secondary">search</span>
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitSearch();
                    if (e.key === "Escape") setSearchOpen(false);
                  }}
                  placeholder="TÌM GIÀY, SKU..."
                  className="h-9 w-36 bg-transparent px-space-2xs font-label-technical text-label-technical uppercase tracking-wider text-primary placeholder:text-secondary/40 focus:outline-none sm:w-48"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  aria-label="Đóng tìm kiếm"
                  className="grid size-9 place-items-center text-secondary hover:text-primary"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Tìm kiếm"
                className="grid size-9 place-items-center text-secondary transition-colors hover:text-primary"
              >
                <span className="material-symbols-outlined text-[20px]">search</span>
              </button>
            )}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative grid size-9 place-items-center text-secondary transition-colors hover:text-primary"
            >
              <span className="material-symbols-outlined text-[20px]">favorite</span>
              {wishCount > 0 && (
                <span className="absolute right-0 top-0.5 bg-primary-container px-1 font-label-micro text-[9px] font-bold text-on-primary-container">
                  {wishCount}
                </span>
              )}
            </Link>
            <Link
              href="/checkout"
              aria-label="Giỏ hàng"
              className="relative grid size-9 place-items-center text-secondary transition-colors hover:text-primary"
            >
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              {count > 0 && (
                <span className="absolute right-0 top-0.5 bg-primary-container px-1 font-label-micro text-[9px] font-bold text-on-primary-container">
                  {count}
                </span>
              )}
            </Link>
            <Link
              href="/artifact/k-09-stratos-chrono"
              className="ml-space-xs hidden bg-primary-container px-space-md py-space-2xs font-label-technical text-label-technical font-bold uppercase tracking-widest text-on-primary-container transition-colors hover:bg-primary hover:text-on-secondary md:block"
            >
              ENTER DROP
            </Link>
            <button
              aria-label="Menu"
              onClick={() => setOpen(true)}
              className="grid size-9 place-items-center text-secondary lg:hidden"
            >
              <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen menu */}
      {open && (
        <div className="fixed inset-0 z-[70] flex flex-col bg-surface-container-lowest/98 backdrop-blur-xl">
          <div className="flex items-center justify-between px-gutter-mobile py-space-sm">
            <Wordmark size="sm" />
            <button
              onClick={() => setOpen(false)}
              aria-label="Đóng menu"
              className="grid size-10 place-items-center border border-surface-container-highest text-primary"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <nav className="flex flex-1 flex-col justify-center gap-space-xs px-gutter-mobile">
            {NAV.map((item, i) => (
              <Link
                key={item.index}
                href={item.href}
                onClick={() => setOpen(false)}
                className="group flex items-baseline gap-space-sm border-b border-surface-container-highest py-space-sm"
              >
                <span className="font-label-technical text-label-technical text-primary-container">
                  {item.index}
                </span>
                <span
                  className={`font-display-lg text-display-lg-mobile uppercase tracking-tight transition-colors ${
                    pathname === item.href ? "text-primary-container" : "text-primary group-hover:text-primary-container"
                  }`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
          <div className="flex gap-space-xs px-gutter-mobile pb-space-xl">
            <Link
              href="/artifact/k-09-stratos-chrono"
              onClick={() => setOpen(false)}
              className="flex-1 bg-primary-container py-space-md text-center font-label-technical text-label-technical font-bold uppercase tracking-widest text-on-primary-container"
            >
              ENTER DROP
            </Link>
            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className="flex-1 border border-surface-container-highest py-space-md text-center font-label-technical text-label-technical font-bold uppercase tracking-widest text-primary"
            >
              GIỎ HÀNG [{String(count).padStart(2, "0")}]
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
