"use client";

import { useState } from "react";

const inputCls =
  "bg-surface-container-lowest text-primary font-label-technical text-label-technical px-space-md py-space-sm focus:outline-none focus:bg-surface-container-high placeholder:text-secondary/40";
const labelCls =
  "font-label-technical text-label-technical text-secondary uppercase tracking-widest";

export default function LookbookForm() {
  const [sent, setSent] = useState(false);

  return (
    <section className="relative w-full overflow-hidden bg-surface-container-lowest px-gutter-mobile py-space-4xl lg:px-gutter-desktop">
      <div className="pointer-events-none absolute -bottom-24 left-1/2 h-[350px] w-[700px] -translate-x-1/2 rounded-full bg-primary-container/10 blur-[130px]" />
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="mb-space-md inline-flex items-center gap-space-xs bg-surface-container-high px-space-md py-space-2xs font-label-technical text-label-technical uppercase tracking-widest text-primary-container">
          <span className="size-1.5 animate-pulse rounded-full bg-primary-container" />
          <span>EXCLUSIVE CONCIERGE PROTOCOL</span>
        </div>
        <h2 className="max-w-2xl font-display-lg text-display-lg uppercase leading-none tracking-tight text-primary">
          ĐẶT LỊCH TƯ VẤN THỜI TRANG CÙNG GIÁM ĐỐC SÁNG TẠO
        </h2>
        <p className="mt-space-md mb-space-2xl max-w-xl font-body-lg text-body-lg text-secondary">
          Tư vấn bespoke 1-kèm-1 trực tiếp hoặc mã hóa — đo sinh trắc, thiết kế bản phối độc bản.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="flex w-full max-w-2xl flex-col space-y-space-md bg-surface-container p-space-xl text-left shadow-2xl"
        >
          <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
            <div className="flex flex-col space-y-space-2xs">
              <label className={labelCls} htmlFor="clientName">
                HỌ &amp; TÊN {"//"} CODENAME
              </label>
              <input
                id="clientName"
                required
                type="text"
                placeholder="VD: NGUYEN VAN A"
                className={inputCls}
              />
            </div>
            <div className="flex flex-col space-y-space-2xs">
              <label className={labelCls} htmlFor="clientContact">
                LIÊN HỆ {"//"} SECURE COMM
              </label>
              <input
                id="clientContact"
                required
                type="email"
                placeholder="EMAIL / TELEGRAM ID"
                className={inputCls}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
            <div className="flex flex-col space-y-space-2xs">
              <label className={labelCls} htmlFor="citySelect">
                ĐỊA ĐIỂM FITTING
              </label>
              <select id="citySelect" className={inputCls}>
                <option value="paris">PARIS ATELIER {"//"} LE MARAIS</option>
                <option value="tokyo">TOKYO LAB {"//"} SHIBUYA</option>
                <option value="milano">MILANO SALON {"//"} BRERA</option>
                <option value="virtual">VIRTUAL HOLOGRAPHIC {"//"} ENCRYPTED</option>
              </select>
            </div>
            <div className="flex flex-col space-y-space-2xs">
              <label className={labelCls} htmlFor="shoeSize">
                CỠ CHÂN THAM CHIẾU (EU/US)
              </label>
              <input
                id="shoeSize"
                type="text"
                placeholder="EU 42.5 / US 9.0"
                className={inputCls}
              />
            </div>
          </div>
          <div className="flex flex-col space-y-space-2xs">
            <label className={labelCls} htmlFor="interestNote">
              GHI CHÚ PHONG CÁCH HOẶC NHU CẦU BESPOKE
            </label>
            <textarea
              id="interestNote"
              rows={3}
              placeholder="Mô tả phong cách cá nhân, nhu cầu chất liệu hoặc mục đích sử dụng..."
              className="resize-none bg-surface-container-lowest p-space-md font-body-sm text-body-sm text-primary placeholder:text-secondary/40 focus:outline-none focus:bg-surface-container-high"
            />
          </div>
          <div className="pt-space-xs">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-space-sm bg-primary-container py-space-md font-label-technical text-label-technical font-bold uppercase tracking-widest text-on-primary-container transition-colors hover:bg-primary"
            >
              <span>TRANSMIT CONSULTATION REQUEST</span>
              <span className="material-symbols-outlined text-[18px]">bolt</span>
            </button>
          </div>
          {sent && (
            <div className="bg-surface-container-highest p-space-md text-center">
              <span className="flex items-center justify-center gap-space-2xs font-label-technical text-label-technical font-bold uppercase tracking-widest text-primary-container">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                TÍN HIỆU ĐÃ GỬI {"//"} ĐỘI NGŨ CONCIERGE SẼ PHẢN HỒI TRONG VÒNG 12 GIỜ
              </span>
            </div>
          )}
        </form>

        <div className="mt-space-lg flex items-center gap-space-sm font-label-micro text-label-micro uppercase text-secondary/60">
          <span>SECURITY LEVEL: ZERO-KNOWLEDGE ENCRYPTED</span>
          <span>•</span>
          <span>NO COMMERCIAL RESALE INTENT</span>
        </div>
      </div>
    </section>
  );
}
