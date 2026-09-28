/* VietQR bank transfer (2.3) — a static personal/business bank account
   rendered as a NAPAS QR via the public api.vietqr.io image service, with a
   UNIQUE transfer content per order so incoming transfers can be matched by
   the shop (manually for now; bank-API auto-reconciliation is future work).
   Pure module: builds URLs and memo strings, never touches the DB. */

export interface VietqrConfig {
  bin: string; // 6-digit bank BIN, e.g. "970436" (Vietcombank)
  account: string; // recipient account number
  owner: string; // account holder name shown on the QR
}

export function vietqrConfig(): VietqrConfig | null {
  const bin = process.env.VIETQR_BIN ?? "";
  const account = process.env.VIETQR_ACCOUNT ?? "";
  const owner = process.env.VIETQR_OWNER ?? "";
  if (!/^\d{6}$/.test(bin) || !/^\d{8,16}$/.test(account) || !owner.trim()) return null;
  return { bin, account, owner: owner.trim().slice(0, 60) };
}

/* Short, bank-safe transfer content: "KNS" + the tail of the order id.
   Vietnamese banks cap the adhesion at ~34 chars and strip some symbols. */
export function transferMemo(orderId: string): string {
  const tail = orderId.replace(/[^A-Za-z0-9]/g, "").slice(-10).toUpperCase();
  return `KNS${tail}`;
}

export function vietqrImageUrl(cfg: VietqrConfig, amountVnd: number, memo: string): string {
  const p = new URLSearchParams({
    accountName: cfg.owner,
    amount: String(Math.round(amountVnd)),
    addInfo: memo,
    amount1: "200000", // decorative label on the compact2 template, not the charge
  });
  return `https://api.vietqr.io/image/${cfg.bin}-${cfg.account}-compact2.jpg?${p.toString()}`;
}

/* Matches the order id shape used by shop-orders (KNS-ORD-...). */
export function isOurTransferMemo(memo: string): boolean {
  return /^KNS[A-Z0-9]{4,12}$/.test(memo.trim().toUpperCase());
}
