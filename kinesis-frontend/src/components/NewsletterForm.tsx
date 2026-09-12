"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <p className="flex items-center gap-space-2xs border border-primary-container/40 bg-surface-container px-space-md py-space-md font-label-technical text-label-technical font-bold uppercase tracking-widest text-primary-container">
        <span className="material-symbols-outlined text-[18px]">check_circle</span>
        ĐÃ GHI NHẬN // HẸN GẶP Ở DROP KẾ
      </p>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="flex flex-col gap-space-2xs sm:flex-row sm:items-stretch"
    >
      <input
        type="email"
        required
        placeholder="EMAIL NHẬN TÍN HIỆU DROP"
        aria-label="Email nhận tín hiệu drop"
        className="h-12 flex-1 border border-surface-container-highest bg-surface-container px-space-md font-label-technical text-label-technical uppercase tracking-wider text-primary placeholder:text-secondary/40 focus:border-primary-container focus:outline-none"
      />
      <button
        type="submit"
        className="h-12 shrink-0 bg-primary-container px-space-xl font-label-technical text-label-technical font-bold uppercase tracking-widest text-on-primary-container transition-colors hover:bg-primary hover:text-on-secondary"
      >
        ĐĂNG KÝ
      </button>
    </form>
  );
}
