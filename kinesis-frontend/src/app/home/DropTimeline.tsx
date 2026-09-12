"use client";

import Link from "next/link";
import { useState } from "react";

const STOPS = [
  {
    id: "04",
    date: "ĐANG DIỄN RA",
    name: "DROP 04 // K-09 STRATOS",
    desc: "142/500 đôi còn lại. Đóng drop khi hết allocation.",
    live: true,
  },
  {
    id: "05",
    date: "Q4 / 2026",
    name: "DROP 05 // K-12 TITAN FULL RELEASE",
    desc: "Mở bán công khai toàn bộ size run. Ưu tiên Syndicate 60 phút.",
    live: false,
  },
  {
    id: "06",
    date: "Q1 / 2027",
    name: "DROP 06 // K-X LAB PUBLIC MINT",
    desc: "Nguyên mẫu phòng lab mở mint hộ chiếu số lần đầu.",
    live: false,
  },
];

export default function DropTimeline() {
  const [notified, setNotified] = useState<string[]>([]);

  return (
    <section className="w-full bg-surface py-space-4xl">
      <div className="mx-auto max-w-[1400px] px-gutter-mobile lg:px-gutter-desktop">
        <p className="flex items-center gap-space-xs font-label-technical text-label-technical uppercase tracking-widest text-primary-container">
          <span className="material-symbols-outlined text-[16px]">calendar_month</span>
          10 // DROP CALENDAR
        </p>
        <div className="mt-space-2xs flex flex-col justify-between gap-space-md lg:flex-row lg:items-end">
          <h2 className="font-display-lg text-display-lg uppercase leading-none tracking-tight text-primary">
            ĐỪNG BỎ LỠ <span className="text-primary-container">DROP KẾ</span>
          </h2>
          <p className="max-w-md font-body-lg text-body-lg text-secondary">
            Mỗi drop chỉ mở một lần. Đăng ký để nhận tín hiệu mở bán trước công chúng.
          </p>
        </div>

        <div className="relative mt-space-xl grid grid-cols-1 gap-space-lg md:grid-cols-3">
          <div className="absolute top-6 right-[16%] left-[16%] hidden h-px bg-surface-container-highest md:block" />
          {STOPS.map((s) => {
            const done = notified.includes(s.id);
            return (
              <div key={s.id} className="relative bg-surface-container p-space-lg">
                <div className="flex items-center justify-between">
                  <span
                    className={`grid size-12 place-items-center font-headline-sm text-headline-sm font-bold ${
                      s.live
                        ? "bg-primary-container text-on-primary-container"
                        : "border border-surface-container-highest text-secondary"
                    }`}
                  >
                    {s.id}
                  </span>
                  <span
                    className={`flex items-center gap-space-2xs font-label-micro text-label-micro font-bold uppercase tracking-widest ${
                      s.live ? "text-primary-container" : "text-secondary"
                    }`}
                  >
                    {s.live && <span className="size-1.5 animate-pulse rounded-full bg-primary-container" />}
                    {s.date}
                  </span>
                </div>
                <h3 className="mt-space-md font-headline-sm text-headline-sm uppercase tracking-tight text-primary">
                  {s.name}
                </h3>
                <p className="mt-space-xs font-body-sm text-body-sm leading-5 text-secondary">{s.desc}</p>
                <div className="mt-space-md">
                  {s.live ? (
                    <Link
                      href="/artifact"
                      className="flex w-full items-center justify-center gap-space-2xs bg-primary-container py-space-sm font-label-technical text-label-technical font-bold uppercase tracking-widest text-on-primary-container transition-colors hover:bg-primary hover:text-on-secondary"
                    >
                      <span>VÀO DROP NGAY</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </Link>
                  ) : (
                    <button
                      onClick={() =>
                        setNotified((n) => (n.includes(s.id) ? n : [...n, s.id]))
                      }
                      disabled={done}
                      className={`flex w-full items-center justify-center gap-space-2xs py-space-sm font-label-technical text-label-technical font-bold uppercase tracking-widest transition-colors ${
                        done
                          ? "bg-primary-container/20 text-primary-container"
                          : "border border-surface-container-highest text-primary hover:border-primary-container hover:text-primary-container"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {done ? "check" : "notifications"}
                      </span>
                      <span>{done ? "ĐÃ ĐĂNG KÝ NHẬN TIN" : "NHẬN THÔNG BÁO"}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
