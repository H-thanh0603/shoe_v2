"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { saveOrder, todayVI } from "@/lib/orders";

const field =
  "h-12 w-full border border-surface-container-highest bg-surface px-space-md font-body-md text-body-md text-primary placeholder:text-secondary/40 focus:border-primary-container focus:outline-none transition-colors";
const flabel =
  "mb-space-2xs block font-label-micro text-label-micro uppercase tracking-widest text-secondary";

const vnd = (usd: number) => `${(usd * 25_000).toLocaleString("vi-VN")} VNĐ`;

export default function CheckoutClient() {
  const { items, setQty, remove, subtotal, count, clear } = useCart();
  const [secs, setSecs] = useState(14 * 60 + 38);
  const [promo, setPromo] = useState("");
  const [promoOk, setPromoOk] = useState<boolean | null>(null);
  const [pay, setPay] = useState("card");
  const [state, setState] = useState<"idle" | "securing" | "done">("idle");
  const [dispatchId, setDispatchId] = useState("KNS-DSP-9042");

  useEffect(() => {
    const t = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const discount = promoOk ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - discount;
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");

  if (state === "done") {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-gutter-mobile py-space-4xl text-center">
        <span className="grid size-16 place-items-center bg-primary-container text-on-primary-container">
          <span className="material-symbols-outlined text-3xl">verified</span>
        </span>
        <p className="mt-space-lg font-label-micro text-label-micro uppercase tracking-widest text-primary-container">
          PAYMENT CONFIRMED
        </p>
        <h1 className="mt-space-xs font-headline-md text-headline-md uppercase tracking-tight text-primary">
          Cảm ơn — đơn hàng đã được ghi nhận
        </h1>
        <p className="mt-space-sm max-w-md font-body-md text-body-md text-secondary">
          Mã dispatch{" "}
          <span className="font-label-technical text-primary-container">{dispatchId}</span>.
          Hộ chiếu số NFT sẽ được đúc vào Syndicate Vault của bạn trong 24h.
        </p>
        <Link
          href="/vault"
          className="mt-space-lg bg-primary-container px-space-xl py-space-md font-label-technical text-label-technical font-bold uppercase tracking-widest text-on-primary-container transition-colors hover:bg-primary hover:text-on-secondary"
        >
          VÀO SYNDICATE VAULT →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-gutter-mobile py-space-xl lg:px-gutter-desktop lg:py-space-2xl">
      {/* ---------- Header ---------- */}
      <div className="flex flex-wrap items-end justify-between gap-space-sm">
        <div>
          <p className="font-label-micro text-label-micro uppercase tracking-widest text-secondary">
            <Link href="/gallery" className="transition-colors hover:text-primary">
              ARCHIVE
            </Link>
            <span className="mx-space-2xs text-secondary/40">/</span>
            <span className="text-primary-container">CHECKOUT</span>
          </p>
          <h1 className="mt-space-2xs font-headline-md text-headline-md uppercase tracking-tight text-primary">
            Thanh toán
          </h1>
        </div>
        <p className="font-label-technical text-label-technical uppercase tracking-widest text-secondary">
          {String(count).padStart(2, "0")} SẢN PHẨM
          <span className="mx-space-xs text-secondary/30">|</span>
          <span className={secs > 0 ? "text-primary-container" : "text-error"}>
            {secs > 0 ? `GIỮ CHỖ ${mm}:${ss}` : "HẾT GIỜ GIỮ CHỖ"}
          </span>
        </p>
      </div>

      <div className="mt-space-xl grid grid-cols-1 items-start gap-space-xl lg:grid-cols-12">
        {/* ---------- Left: items + form ---------- */}
        <div className="lg:col-span-7">
          {/* Items */}
          <div className="border-t border-surface-container-highest">
            {items.map((it) => (
              <div
                key={`${it.slug}-${it.size}`}
                className="flex items-center gap-space-md border-b border-surface-container-highest py-space-md"
              >
                <div className="relative size-20 shrink-0 overflow-hidden bg-surface-container-lowest">
                  <Image
                    src={it.image}
                    alt={it.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-label-technical text-label-technical font-bold uppercase tracking-wider text-primary">
                    {it.name}
                  </h3>
                  <p className="mt-space-3xs font-label-micro text-label-micro uppercase tracking-widest text-secondary">
                    {it.sku} · EU {it.size} · {it.color}
                  </p>
                  <div className="mt-space-xs flex items-center gap-space-sm">
                    <div className="flex items-center border border-surface-container-highest">
                      <button
                        onClick={() => setQty(it.slug, it.size, it.qty - 1)}
                        aria-label="Giảm"
                        className="grid size-7 place-items-center font-body-md text-secondary transition-colors hover:text-primary"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-label-technical text-label-technical text-primary">
                        {String(it.qty).padStart(2, "0")}
                      </span>
                      <button
                        onClick={() => setQty(it.slug, it.size, it.qty + 1)}
                        aria-label="Tăng"
                        className="grid size-7 place-items-center font-body-md text-secondary transition-colors hover:text-primary"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => remove(it.slug, it.size)}
                      className="font-label-micro text-label-micro uppercase tracking-widest text-secondary/60 transition-colors hover:text-error"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-label-technical text-label-technical font-bold text-primary">
                    ${it.qty * it.price}
                  </p>
                  <p className="mt-space-3xs font-label-micro text-label-micro text-secondary/60">
                    ~ {vnd(it.qty * it.price)}
                  </p>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="border-b border-surface-container-highest py-space-xl text-center">
                <p className="font-label-technical text-label-technical uppercase tracking-widest text-secondary">
                  Giỏ trống
                </p>
                <Link
                  href="/gallery"
                  className="mt-space-xs inline-block font-label-technical text-label-technical uppercase tracking-widest text-primary-container hover:underline"
                >
                  VÀO ARCHIVE CHỌN HIỆN VẬT →
                </Link>
              </div>
            )}
          </div>

          {/* Shipping */}
          <h2 className="mt-space-2xl font-label-technical text-label-technical font-bold uppercase tracking-widest text-primary">
            Thông tin giao hàng
          </h2>
          <p className="mt-space-3xs font-label-micro text-label-micro uppercase tracking-widest text-secondary">
            DHL BỌC THÉP 48–72H · MIỄN PHÍ · ĐÃ GỒM THUẾ &amp; HẢI QUAN
          </p>
          <div className="mt-space-md grid grid-cols-1 gap-space-md sm:grid-cols-2">
            <div>
              <label className={flabel} htmlFor="co-name">Họ và tên *</label>
              <input id="co-name" defaultValue="Alexander Trần" className={field} />
            </div>
            <div>
              <label className={flabel} htmlFor="co-phone">Số điện thoại *</label>
              <input id="co-phone" defaultValue="+84 908 241 889" className={field} />
            </div>
            <div className="sm:col-span-2">
              <label className={flabel} htmlFor="co-addr">Địa chỉ *</label>
              <input
                id="co-addr"
                defaultValue="Tòa nhà Landmark 81, Bình Thạnh, TP. Hồ Chí Minh"
                className={field}
              />
            </div>
            <div>
              <label className={flabel} htmlFor="co-country">Quốc gia</label>
              <select id="co-country" className={field}>
                <option>VIỆT NAM</option>
                <option>FRANCE</option>
                <option>JAPAN</option>
                <option>SINGAPORE</option>
              </select>
            </div>
            <div>
              <label className={flabel} htmlFor="co-member">Mã thành viên</label>
              <input id="co-member" defaultValue="SYN-0042" className={field} />
            </div>
          </div>
        </div>

        {/* ---------- Right: summary ---------- */}
        <aside className="lg:col-span-5">
          <div className="border border-surface-container-highest bg-surface-container-low p-space-lg lg:sticky lg:top-24">
            <h2 className="font-label-technical text-label-technical font-bold uppercase tracking-widest text-primary">
              Tổng đơn hàng
            </h2>

            <div className="mt-space-md space-y-space-xs font-body-sm text-body-sm">
              <div className="flex justify-between text-secondary">
                <span>Tạm tính</span>
                <span className="font-label-technical text-primary">
                  ${subtotal.toLocaleString("en-US")}
                </span>
              </div>
              {promoOk && (
                <div className="flex justify-between text-primary-container">
                  <span>Ưu đãi SYNDICATE −10%</span>
                  <span className="font-label-technical">−${discount}</span>
                </div>
              )}
              <div className="flex justify-between text-secondary">
                <span>Vận chuyển</span>
                <span className="font-label-technical font-bold text-primary-container">
                  MIỄN PHÍ
                </span>
              </div>
            </div>

            {/* Promo */}
            <div className="mt-space-md flex gap-space-xs">
              <input
                value={promo}
                onChange={(e) => {
                  setPromo(e.target.value);
                  setPromoOk(null);
                }}
                placeholder="MÃ ƯU ĐÃI"
                className="h-11 min-w-0 flex-1 border border-surface-container-highest bg-surface px-space-sm font-label-technical text-label-technical uppercase tracking-wider text-primary placeholder:text-secondary/40 focus:border-primary-container focus:outline-none"
              />
              <button
                onClick={() => setPromoOk(promo.trim().toUpperCase() === "SYNDICATE")}
                className="h-11 shrink-0 border border-surface-container-highest px-space-md font-label-technical text-label-technical uppercase tracking-wider text-primary transition-colors hover:border-primary-container hover:text-primary-container"
              >
                ÁP DỤNG
              </button>
            </div>
            {promoOk === false && (
              <p className="mt-space-2xs font-label-micro text-label-micro uppercase tracking-widest text-secondary/60">
                Mã không hợp lệ — thử “SYNDICATE”
              </p>
            )}

            <div className="mt-space-md border-t border-surface-container-highest pt-space-md">
              <div className="flex items-baseline justify-between">
                <span className="font-label-technical text-label-technical uppercase tracking-wider text-secondary">
                  Tổng cộng
                </span>
                <span className="font-headline-sm text-headline-sm font-extrabold text-primary-container">
                  ${total.toLocaleString("en-US")}{" "}
                  <span className="font-label-technical text-label-technical text-primary">USD</span>
                </span>
              </div>
              <p className="mt-space-3xs text-right font-label-micro text-label-micro tracking-wider text-secondary">
                ≈ {vnd(total)}
              </p>
            </div>

            {/* Payment */}
            <div className="mt-space-md grid grid-cols-2 gap-space-2xs">
              {[
                ["card", "THẺ QUỐC TẾ"],
                ["wallet", "APPLE / GOOGLE PAY"],
              ].map(([v, label]) => (
                <button
                  key={v}
                  onClick={() => setPay(v)}
                  className={`border py-space-sm font-label-micro text-label-micro uppercase tracking-widest transition-colors ${
                    pay === v
                      ? "border-primary-container text-primary-container"
                      : "border-surface-container-highest text-secondary hover:text-primary"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {pay === "card" && (
              <div className="mt-space-xs space-y-space-2xs">
                <input
                  defaultValue="4111 8890 2341 9002"
                  aria-label="Số thẻ"
                  className="h-11 w-full border border-surface-container-highest bg-surface px-space-sm font-label-technical text-label-technical text-primary focus:border-primary-container focus:outline-none"
                />
                <div className="grid grid-cols-2 gap-space-2xs">
                  <input
                    defaultValue="09/28"
                    aria-label="Hết hạn"
                    className="h-11 w-full border border-surface-container-highest bg-surface px-space-sm font-label-technical text-label-technical text-primary focus:border-primary-container focus:outline-none"
                  />
                  <input
                    defaultValue="889"
                    type="password"
                    aria-label="CVV"
                    className="h-11 w-full border border-surface-container-highest bg-surface px-space-sm font-label-technical text-label-technical text-primary focus:border-primary-container focus:outline-none"
                  />
                </div>
              </div>
            )}

            <button
              onClick={() => {
                if (!items.length || state === "securing") return;
                setState("securing");
                const id = `KNS-DSP-${Math.floor(1000 + Math.random() * 9000)}`;
                const summary = items.map((it) => `${it.name} ×${it.qty}`).join(" + ");
                const amount = items.reduce((n, it) => n + it.qty * it.price, 0);
                setTimeout(() => {
                  saveOrder({
                    id,
                    date: todayVI(),
                    items: summary,
                    sub: `Checkout Protocol // ${items.length} silhouette${items.length > 1 ? "s" : ""}`,
                    total: `$${amount.toLocaleString("en-US")}`,
                  });
                  setDispatchId(id);
                  setState("done");
                  clear();
                }, 1400);
              }}
              disabled={!items.length}
              className={`mt-space-lg flex w-full items-center justify-center gap-space-xs py-space-md font-label-technical text-label-technical font-bold uppercase tracking-widest transition-colors ${
                items.length
                  ? "bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-secondary"
                  : "cursor-not-allowed bg-surface-container-highest text-secondary/40"
              }`}
            >
              {state === "securing" ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">refresh</span>
                  <span>ĐANG MÃ HÓA...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  <span>XÁC NHẬN THANH TOÁN</span>
                </>
              )}
            </button>
            <p className="mt-space-sm flex items-center justify-center gap-space-2xs text-center font-label-micro text-label-micro uppercase tracking-widest text-secondary/50">
              <span className="material-symbols-outlined text-[14px] text-primary-container">
                encrypted
              </span>
              MÃ HÓA 256-BIT · ĐỔI SIZE 14 NGÀY · DEMO
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
