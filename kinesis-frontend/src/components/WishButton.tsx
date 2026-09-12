"use client";

import { useWishlist } from "@/lib/wishlist";

export default function WishButton({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  const { has, toggle } = useWishlist();
  const on = has(slug);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      aria-label={on ? "Bỏ khỏi wishlist" : "Thêm vào wishlist"}
      aria-pressed={on}
      title={on ? "Đã lưu // Bỏ lưu" : "Lưu vào wishlist"}
      className={`grid place-items-center backdrop-blur-md transition-colors ${className} ${
        on
          ? "bg-primary-container text-on-primary-container"
          : "bg-surface-container-lowest/80 text-secondary hover:text-primary-container"
      }`}
    >
      <span
        className="material-symbols-outlined text-[18px]"
        style={on ? { fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24' } : undefined}
      >
        favorite
      </span>
    </button>
  );
}
