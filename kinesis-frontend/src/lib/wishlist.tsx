"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

const KEY = "kinesis-wishlist";

function read(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = JSON.parse(raw ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function write(slugs: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(slugs));
  } catch {
    localStorage.removeItem(KEY);
  }
}

interface WishlistValue {
  slugs: string[];
  count: number;
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
}

const WishlistContext = createContext<WishlistValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>(read);

  const value = useMemo<WishlistValue>(() => {
    const save = (next: string[]) => {
      setSlugs(next);
      write(next);
    };
    return {
      slugs,
      count: slugs.length,
      has: (slug) => slugs.includes(slug),
      toggle: (slug) =>
        save(slugs.includes(slug) ? slugs.filter((s) => s !== slug) : [...slugs, slug]),
      remove: (slug) => save(slugs.filter((s) => s !== slug)),
      clear: () => save([]),
    };
  }, [slugs]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
