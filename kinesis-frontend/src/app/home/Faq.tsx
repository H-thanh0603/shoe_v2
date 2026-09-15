"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "Làm sao biết giày là chính hãng?",
    a: "Mỗi đôi có mã định danh + hồ sơ provenance do shop lưu trữ và đối soát khi cần. Tem NFC và bản ghi on-chain đang triển khai — shop sẽ cập nhật khi mở.",
  },
  {
    q: "Chính sách đổi size thế nào?",
    a: "Đổi size miễn phí trong 14 ngày, hỗ trợ đối soát tận nơi cho thành viên Syndicate. Size chạy chuẩn EU, form Wide có bản riêng.",
  },
  {
    q: "Vận chuyển mất bao lâu?",
    a: "DHL bọc thép 48–72h toàn cầu, miễn phí cho mọi drop. Mỗi kiện có bảo hiểm nguyên giá và mã GPS theo dõi.",
  },
  {
    q: "Bảo hành và bảo dưỡng ra sao?",
    a: "Bảo hành phòng lab 24 tháng. Thành viên Syndicate được phục hồi đệm Nitrogen và đánh bóng Titanium miễn phí mỗi 24 tháng tại Paris / Tokyo / Milan.",
  },
  {
    q: "Có bán lại được không?",
    a: "Được — liên hệ shop để sang tên hồ sơ provenance thủ công. Chuyển giao on-chain tự động đang triển khai.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="w-full bg-surface py-space-4xl">
      <div className="mx-auto max-w-3xl px-gutter-mobile">
        <p className="flex items-center gap-space-xs font-label-technical text-label-technical uppercase tracking-widest text-primary-container">
          <span className="material-symbols-outlined text-[16px]">help</span>
          12 // HỎI NHANH // PROTOCOL FAQ
        </p>
        <h2 className="mt-space-2xs font-headline-md text-headline-md uppercase tracking-tight text-primary">
          Trước khi bạn hỏi
        </h2>
        <div className="mt-space-lg border-t border-surface-container-highest">
          {FAQS.map((f, i) => {
            const on = open === i;
            return (
              <div key={f.q} className="border-b border-surface-container-highest">
                <button
                  onClick={() => setOpen(on ? null : i)}
                  className="flex w-full items-center justify-between gap-space-md py-space-md text-left"
                >
                  <span
                    className={`font-label-technical text-label-technical font-bold uppercase tracking-wider transition-colors ${on ? "text-primary-container" : "text-primary"}`}
                  >
                    {f.q}
                  </span>
                  <span
                    className={`grid size-8 shrink-0 place-items-center border transition-colors ${
                      on
                        ? "border-primary-container bg-primary-container text-on-primary-container"
                        : "border-surface-container-highest text-secondary"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {on ? "remove" : "add"}
                    </span>
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ${on ? "grid-rows-[1fr] pb-space-md opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <p className="overflow-hidden font-body-md text-body-md leading-6 text-secondary">
                    {f.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
