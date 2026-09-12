"use client";

import Image from "next/image";
import Link from "next/link";
import { PRODUCTS } from "@/lib/data";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";

export default function WishlistClient() {
  const { slugs, remove, clear, count } = useWishlist();
  const { add } = useCart();
  const items = PRODUCTS.filter((p) => slugs.includes(p.slug));

  return (
    <div className="mx-auto max-w-6xl px-gutter-mobile py-space-xl lg:px-gutter-desktop lg:py-space-2xl">
      <div className="flex flex-wrap items-end justify-between gap-space-sm">
        <div>
          <p className="font-label-micro text-label-micro uppercase tracking-widest text-secondary">
            SAVED SPECIMENS
          </p>
          <h1 className="mt-space-2xs font-headline-md text-headline-md uppercase tracking-tight text-primary">
            Wishlist
          </h1>
        </div>
        <p className="font-label-technical text-label-technical uppercase tracking-widest text-secondary">
          {String(count).padStart(2, "0")} ĐÃ LƯU
          {count > 0 && (
            <button
              onClick={clear}
              className="ml-space-sm font-label-micro text-label-micro uppercase tracking-widest text-secondary/60 transition-colors hover:text-error"
            >
              XÓA HẾT
            </button>
          )}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="mt-space-xl border border-surface-container-highest py-space-4xl text-center">
          <span className="material-symbols-outlined text-4xl text-secondary/40">favorite</span>
          <p className="mt-space-sm font-label-technical text-label-technical uppercase tracking-widest text-secondary">
            CHƯA LƯU HIỆN VẬT NÀO
          </p>
          <p className="mt-space-2xs font-body-sm text-body-sm text-secondary/70">
            Bấm biểu tượng tim trên bất kỳ đôi nào để ghim vào đây.
          </p>
          <Link
            href="/gallery"
            className="mt-space-md inline-block bg-primary-container px-space-xl py-space-sm font-label-technical text-label-technical font-bold uppercase tracking-widest text-on-primary-container transition-colors hover:bg-primary hover:text-on-secondary"
          >
            VÀO ARCHIVE →
          </Link>
        </div>
      ) : (
        <div className="mt-space-xl border-t border-surface-container-highest">
          {items.map((p) => (
            <div
              key={p.slug}
              className="flex items-center gap-space-md border-b border-surface-container-highest py-space-md"
            >
              <Link
                href={`/artifact/${p.slug}`}
                className="relative size-20 shrink-0 overflow-hidden bg-surface-container-lowest"
              >
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                  unoptimized
                />
              </Link>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-label-technical text-label-technical font-bold uppercase tracking-wider text-primary">
                  {p.name}
                </h3>
                <p className="mt-space-3xs font-label-micro text-label-micro uppercase tracking-widest text-secondary">
                  {p.series} · ${p.price} USD
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-space-xs">
                {p.status !== "SOLD OUT" && (
                  <button
                    onClick={() =>
                      add({
                        slug: p.slug,
                        name: p.name,
                        sku: p.sku,
                        price: p.price,
                        image: p.image,
                        size: "42",
                        color: p.colors[0],
                        qty: 1,
                      })
                    }
                    className="bg-primary-container px-space-md py-space-xs font-label-micro text-label-micro font-bold uppercase tracking-widest text-on-primary-container transition-colors hover:bg-primary hover:text-on-secondary"
                  >
                    + GIỎ
                  </button>
                )}
                <button
                  onClick={() => remove(p.slug)}
                  aria-label="Xóa khỏi wishlist"
                  className="grid size-9 place-items-center text-secondary/60 transition-colors hover:text-error"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
