"use client";

import { useState } from "react";

export default function VipInviteForm() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <form
        className="flex flex-col items-stretch gap-space-2xs sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
      >
        <input
          type="text"
          required
          placeholder="SỐ ĐIỆN THOẠI HOẶC EMAIL VIP"
          className="flex-grow bg-surface-container-lowest px-space-md py-space-md font-label-technical text-label-technical text-on-surface placeholder:text-secondary/50 focus:outline-none focus:ring-1 focus:ring-primary-container"
        />
        <button
          type="submit"
          className="whitespace-nowrap bg-primary-container px-space-xl py-space-md font-label-technical text-label-technical font-bold uppercase text-on-primary-container transition-colors hover:bg-primary hover:text-on-secondary"
        >
          REQUEST INVITE
        </button>
      </form>
      {sent && (
        <div className="font-label-micro text-label-micro uppercase text-primary-container">
          ✓ YÊU CẦU ĐÃ ĐƯỢC CHUYỂN TIẾP ĐẾN QUẢN TRỊ VIÊN ATELIER.
        </div>
      )}
    </>
  );
}
