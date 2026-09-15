"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface CartItem {
  slug: string;
  name: string;
  sku: string;
  price: number;
  image: string;
  size: string;
  color: string;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (slug: string, size: string) => void;
  setQty: (slug: string, size: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const KEY = "kinesis-cart";

function validItem(x: unknown): x is CartItem {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.slug === "string" &&
    typeof o.name === "string" &&
    typeof o.sku === "string" &&
    typeof o.price === "number" &&
    typeof o.image === "string" &&
    typeof o.size === "string" &&
    typeof o.color === "string" &&
    typeof o.qty === "number"
  );
}

function read(): CartItem[] | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter(validItem);
  } catch {
    return null;
  }
}

function write(items: CartItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    localStorage.removeItem(KEY);
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  /* Empty by default — seeding a product silently put an unchosen item in
     every new visitor's checkout. */
  const [items, setItems] = useState<CartItem[]>(() => read() ?? []);

  useEffect(() => {
    write(items);
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const add = (item: CartItem) =>
      setItems((prev) => {
        const i = prev.findIndex((x) => x.slug === item.slug && x.size === item.size);
        if (i >= 0) {
          const next = [...prev];
          next[i] = { ...next[i], qty: next[i].qty + item.qty };
          return next;
        }
        return [...prev, item];
      });

    const remove = (slug: string, size: string) =>
      setItems((prev) => prev.filter((x) => !(x.slug === slug && x.size === size)));

    const setQty = (slug: string, size: string, qty: number) =>
      setItems((prev) =>
        qty <= 0
          ? prev.filter((x) => !(x.slug === slug && x.size === size))
          : prev.map((x) => (x.slug === slug && x.size === size ? { ...x, qty } : x)),
      );

    return {
      items,
      add,
      remove,
      setQty,
      clear: () => setItems([]),
      count: items.reduce((n, x) => n + x.qty, 0),
      subtotal: items.reduce((n, x) => n + x.qty * x.price, 0),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
