"use client";

import { useEffect, useState } from "react";

const START = 2 * 86400 + 4 * 3600 + 12 * 60 + 33;
const KEY = "kinesis-drop-end";

function loadEnd(): number {
  try {
    const saved = Number(localStorage.getItem(KEY));
    if (saved > Date.now()) return saved;
  } catch {
    localStorage.removeItem(KEY);
  }
  const end = Date.now() + START * 1000;
  try {
    localStorage.setItem(KEY, String(end));
  } catch {
    localStorage.removeItem(KEY);
  }
  return end;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function CountdownStrip() {
  const [secs, setSecs] = useState(START);

  useEffect(() => {
    const end = loadEnd();
    const update = () => setSecs(Math.max(0, Math.round((end - Date.now()) / 1000)));
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  const d = Math.floor(secs / 86400);
  const h = Math.floor((secs % 86400) / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;

  return (
    <div className="w-full border-y border-surface-container-highest bg-surface-container-lowest">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-space-sm px-gutter-mobile py-space-md sm:flex-row sm:items-center sm:justify-between lg:px-gutter-desktop">
        <p className="flex items-center gap-space-xs font-label-technical text-label-technical uppercase tracking-widest text-secondary">
          <span className="size-2 animate-pulse rounded-full bg-primary-container" />
          DROP 04 SẼ ĐÓNG SAU
        </p>
        <div className="flex items-center gap-space-sm">
          {[
            [d, "NGÀY"],
            [h, "GIỜ"],
            [m, "PHÚT"],
            [s, "GIÂY"],
          ].map(([v, label]) => (
            <div key={label as string} className="flex items-center gap-space-sm">
              <div className="flex flex-col items-center">
                <span className="bg-surface-container-high px-space-sm py-space-2xs font-headline-sm text-headline-sm font-bold tabular-nums text-primary">
                  {pad(v as number)}
                </span>
                <span className="mt-space-3xs font-label-micro text-label-micro text-secondary">
                  {label}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-space-sm sm:min-w-[220px]">
          <div className="h-1.5 flex-1 bg-surface-container-high">
            <div className="h-full w-[71.6%] bg-primary-container" />
          </div>
          <span className="font-label-technical text-label-technical text-primary-container">
            358/500
          </span>
        </div>
      </div>
    </div>
  );
}
