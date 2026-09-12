"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { VIEWS } from "@/lib/views";

const DUST = [
  { left: "12%", top: "22%", size: 3, depth: 18 },
  { left: "24%", top: "68%", size: 2, depth: 30 },
  { left: "38%", top: "14%", size: 2, depth: 12 },
  { left: "55%", top: "78%", size: 3, depth: 24 },
  { left: "68%", top: "20%", size: 2, depth: 36 },
  { left: "78%", top: "60%", size: 3, depth: 14 },
  { left: "88%", top: "34%", size: 2, depth: 26 },
  { left: "46%", top: "46%", size: 2, depth: 20 },
];

export default function ZeroG() {
  const stage = useRef<HTMLDivElement>(null);
  const imgs = useRef<Array<HTMLDivElement | null>>([]);
  const sweep = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const dustBox = useRef<HTMLDivElement>(null);
  const rotText = useRef<HTMLSpanElement>(null);
  const mouse = useRef({ x: 0.5, y: 0.5, inside: false });
  const sim = useRef({ cur: 0, target: 0, dir: 1, lastTouch: 0, dragging: false, startX: 0, startA: 0 });
  const [viewIdx, setViewIdx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const viewIdxRef = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      const s = sim.current;
      // Idle: slow auto-turntable, ping-pong across angles
      if (!s.dragging && t - s.lastTouch > 2500) {
        s.target += s.dir * dt * 0.35;
        if (s.target >= 3) {
          s.target = 3;
          s.dir = -1;
        } else if (s.target <= 0) {
          s.target = 0;
          s.dir = 1;
        }
      }
      // Inertia toward target
      s.cur += (s.target - s.cur) * 0.09;
      if (Math.abs(s.target - s.cur) < 0.0005) s.cur = s.target;

      for (let i = 0; i < 4; i++) {
        const el = imgs.current[i];
        if (el) el.style.opacity = String(Math.max(0, 1 - Math.abs(s.cur - i)));
      }
      if (sweep.current) {
        sweep.current.style.left = `${8 + (s.cur / 3) * 70}%`;
      }
      if (rotText.current) {
        rotText.current.textContent = `${Math.round((s.cur / 3) * 180 - 90)}°`;
      }
      // Parallax dust drifts against the cursor
      if (dustBox.current) {
        const dx = (mouse.current.x - 0.5) * 2;
        const dy = (mouse.current.y - 0.5) * 2;
        const kids = dustBox.current.children;
        for (let k = 0; k < kids.length; k++) {
          const depth = DUST[k]?.depth ?? 16;
          (kids[k] as HTMLElement).style.transform = `translate(${-dx * depth}px, ${-dy * depth}px)`;
        }
      }
      const vi = Math.round(s.cur);
      if (vi !== viewIdxRef.current) {
        viewIdxRef.current = vi;
        setViewIdx(vi);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    const s = sim.current;
    s.dragging = true;
    s.startX = e.clientX;
    s.startA = s.target;
    s.lastTouch = performance.now();
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const r = stage.current?.getBoundingClientRect();
    if (r) {
      mouse.current = {
        x: (e.clientX - r.left) / r.width,
        y: (e.clientY - r.top) / r.height,
        inside: true,
      };
      if (glow.current) {
        glow.current.style.left = `${mouse.current.x * 100}%`;
        glow.current.style.top = `${mouse.current.y * 100}%`;
      }
    }
    const s = sim.current;
    if (s.dragging && r) {
      const dx = (e.clientX - s.startX) / r.width;
      s.target = Math.min(3, Math.max(0, s.startA + dx * 4));
      s.dir = dx >= 0 ? 1 : -1;
      s.lastTouch = performance.now();
    }
  };
  const endDrag = () => {
    sim.current.dragging = false;
    sim.current.lastTouch = performance.now();
    setDragging(false);
  };

  return (
    <section className="relative w-full overflow-hidden bg-surface-container-lowest py-space-4xl">
      <div className="mx-auto max-w-[1400px] px-gutter-mobile lg:px-gutter-desktop">
        <div className="flex items-center gap-space-xs font-label-technical text-label-technical uppercase text-primary-container">
          <span className="material-symbols-outlined text-[16px]">orbit</span>
          <span>05 // TURNTABLE 360° // KÉO NGANG ĐỂ XOAY</span>
        </div>
        <div className="mt-space-2xs flex flex-col justify-between gap-space-md lg:flex-row lg:items-end">
          <h2 className="font-display-lg text-display-lg uppercase leading-none tracking-tight text-primary">
            XOAY HIỆN VẬT <span className="text-primary-container">BẰNG TAY</span>
          </h2>
          <p className="max-w-md font-body-lg text-body-lg text-secondary">
            Nắm và kéo để xoay qua 4 góc chụp thật — thả ra bàn xoay tự chạy tiếp.
          </p>
        </div>

        <div
          ref={stage}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={endDrag}
          className="relative mt-space-xl touch-none overflow-hidden border border-surface-container-highest bg-surface select-none"
          style={{ cursor: dragging ? "grabbing" : "grab" }}
        >
          {/* Cursor glow */}
          <div
            ref={glow}
            className="pointer-events-none absolute z-20 size-72 rounded-full bg-primary-container/10 blur-[100px]"
            style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
          />
          {/* Parallax dust */}
          <div ref={dustBox} className="pointer-events-none absolute inset-0 z-20">
            {DUST.map((d, i) => (
              <span
                key={i}
                className="absolute rounded-full bg-primary-container/50"
                style={{ left: d.left, top: d.top, width: d.size, height: d.size }}
              />
            ))}
          </div>

          {/* Rotating shoe stack with floor reflection */}
          <div
            className="relative mx-auto aspect-[16/10] max-w-4xl"
            style={{ WebkitBoxReflect: "below 4px linear-gradient(transparent 62%, rgba(255,255,255,0.14))" } as React.CSSProperties}
          >
            {VIEWS.map((v, i) => (
              <div
                key={v.label}
                ref={(el) => {
                  imgs.current[i] = el;
                }}
                className="absolute inset-0"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                <Image
                  src={v.src}
                  alt={`K-09 — ${v.title}`}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 1024px) 100vw, 900px"
                  className="object-cover"
                  unoptimized
                  draggable={false}
                />
              </div>
            ))}
            {/* Traveling studio light */}
            <div
              ref={sweep}
              className="pointer-events-none absolute inset-y-0 z-10 w-1/3"
              style={{
                left: "8%",
                background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.10), transparent)",
              }}
            />
          </div>

          {/* Readouts */}
          <div className="absolute bottom-space-md left-space-md z-30 flex items-center gap-space-md bg-surface-container-lowest/85 px-space-md py-space-sm backdrop-blur-md">
            <span className="font-label-technical text-label-technical font-bold text-primary-container">
              {VIEWS[viewIdx].title}
            </span>
            <span className="font-label-micro text-label-micro text-secondary">
              ROT Y <span ref={rotText} className="tabular-nums text-primary">-90°</span>
            </span>
          </div>
          <div className="absolute bottom-space-md right-space-md z-30 flex gap-space-2xs">
            {VIEWS.map((v, i) => (
              <button
                key={v.label}
                onClick={() => {
                  sim.current.target = i;
                  sim.current.lastTouch = performance.now();
                }}
                aria-label={v.label}
                className={`h-1.5 transition-all ${
                  viewIdx === i ? "w-8 bg-primary-container" : "w-4 bg-surface-container-highest hover:bg-secondary"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
