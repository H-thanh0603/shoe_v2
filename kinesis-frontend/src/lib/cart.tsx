"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import { PRODUCTS } from "@/lib/data";

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

/* ---------- Server cart (3.1) ---------- */

interface ServerRow {
  slug: string;
  size: string;
  color: string;
  qty: number;
}

function rowToItem(r: ServerRow): CartItem | null {
  const p = PRODUCTS.find((x) => x.slug === r.slug);
  if (!p) return null;
  return { slug: p.slug, name: p.name, sku: p.sku, price: p.price, image: p.image, size: r.size, color: r.color, qty: r.qty };
}

/* Sign-in merge: same line → quantities add; distinct lines both survive. */
function mergeCarts(local: CartItem[], server: CartItem[]): CartItem[] {
  const out = [...server];
  for (const l of local) {
    const i = out.findIndex((x) => x.slug === l.slug && x.size === l.size);
    if (i >= 0) out[i] = { ...out[i], qty: out[i].qty + l.qty };
    else out.push(l);
  }
  return out;
}

export function CartProvider({ children }: { children: ReactNode }) {
  /* Empty by default — seeding a product silently put an unchosen item in
     every new visitor's checkout. */
  const [items, setItems] = useState<CartItem[]>(() => read() ?? []);
  const { data: session, status } = useSession();
  const authed = status === "authenticated";
  /* Push to the server only after the initial GET has merged for THIS
     session, so a reload can never clobber the server cart with pre-merge
     local state. setState lives only in the fetch callbacks. */
  const sessionKey = session?.user?.email ?? "";
  const [merge, setMerge] = useState<{ key: string; done: boolean } | null>(null);
  const readyToPush = authed && merge?.key === sessionKey && merge.done;
  const pushing = useRef(0);

  useEffect(() => {
    if (!authed) return;
    let alive = true;
    fetch("/api/cart")
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((d: { items?: ServerRow[] }) => {
        if (!alive) return;
        const server = (Array.isArray(d.items) ? d.items : []).map(rowToItem).filter((x): x is CartItem => !!x);
        if (server.length > 0) {
          setItems((prev) => {
            const serverKeys = new Set(server.map((s) => `${s.slug}|${s.size}`));
            return mergeCarts(prev.filter((l) => !serverKeys.has(`${l.slug}|${l.size}`)), server);
          });
        }
        setMerge({ key: sessionKey, done: true });
      })
      .catch(() => alive && setMerge({ key: sessionKey, done: true }));
    return () => {
      alive = false;
    };
  }, [authed, sessionKey]);

  useEffect(() => {
    if (!authed || !readyToPush) return;
    const t = setTimeout(() => {
      const id = ++pushing.current;
      void fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: items.map(({ slug, size, color, qty }) => ({ slug, size, color, qty })) }),
      })
        .then((r) => r.json())
        .then((d: { items?: ServerRow[] }) => {
          /* Server echo wins — it drops rows whose slug stopped existing. */
          if (id === pushing.current && Array.isArray(d.items)) {
            const server = d.items.map(rowToItem).filter((x): x is CartItem => !!x);
            setItems(server);
          }
        })
        .catch(() => {});
    }, 400);
    return () => clearTimeout(t);
  }, [items, authed, readyToPush]);

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
