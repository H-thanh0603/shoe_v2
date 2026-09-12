"use client";

import { useEffect, useRef, useState } from "react";

function CountUp({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const t0 = performance.now();
          const dur = 1600;
          const tick = (t: number) => {
            const k = Math.min(1, (t - t0) / dur);
            setVal(to * (1 - Math.pow(1 - k, 3)));
            if (k < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to]);

  return (
    <span ref={ref} className="tabular-nums">
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
}

const STATS = [
  { to: 500, suffix: "", label: "ĐÔI GIỚI HẠN / DROP", sub: "Edition đánh số + NFC" },
  { to: 99.4, decimals: 1, suffix: "%", label: "CRAFT INDEX", sub: "Kiểm định Paris Lab" },
  { to: 480, suffix: "H", label: "GIỜ CHẾ TÁC", sub: "Thủ công + in 3D SLS" },
  { to: 18, suffix: "", label: "THIẾT KẾ ARCHIVE", sub: "Từ 2024 đến nay" },
];

export default function StatsBand() {
  return (
    <section className="w-full bg-primary-container">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-px px-gutter-mobile lg:grid-cols-4 lg:px-gutter-desktop">
        {STATS.map((s) => (
          <div key={s.label} className="flex flex-col items-center py-space-xl text-center">
            <span className="font-display-lg text-display-lg font-extrabold leading-none text-on-primary-container">
              <CountUp to={s.to} decimals={s.decimals ?? 0} suffix={s.suffix} />
            </span>
            <span className="mt-space-xs font-label-technical text-label-technical font-bold uppercase tracking-widest text-on-primary-container">
              {s.label}
            </span>
            <span className="mt-space-3xs font-label-micro text-label-micro uppercase tracking-widest text-on-primary-container/70">
              {s.sub}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
