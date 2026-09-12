"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { STITCH } from "@/lib/data";

const UPPERS = [
  { name: "OBSIDIAN", filter: "none", chip: "bg-surface-container-lowest" },
  { name: "VOLT SURGE", filter: "hue-rotate(-30deg) saturate(1.8)", chip: "bg-primary-container" },
  { name: "BLOODLINE", filter: "hue-rotate(-120deg) saturate(1.6)", chip: "bg-[#ff2d55]" },
  { name: "ABYSS", filter: "hue-rotate(140deg) saturate(1.7)", chip: "bg-[#38bdf8]" },
];

const SOLES = [
  { name: "VOLT", glow: "rgba(202,243,0,0.25)", chip: "bg-primary-container" },
  { name: "MAGMA", glow: "rgba(255,80,40,0.3)", chip: "bg-[#ff5028]" },
  { name: "GLACIER", glow: "rgba(56,189,248,0.3)", chip: "bg-[#38bdf8]" },
  { name: "GHOST", glow: "rgba(229,225,228,0.25)", chip: "bg-[#e5e1e4]" },
];

export default function ColorMixer() {
  const [upper, setUpper] = useState(UPPERS[1]);
  const [sole, setSole] = useState(SOLES[0]);
  const [saved, setSaved] = useState(false);

  const code = useMemo(
    () => `K09-${upper.name.split(" ")[0]}-${sole.name}-1OF1`,
    [upper, sole],
  );

  return (
    <div className="flex h-full flex-col bg-surface-container p-space-lg">
      <p className="flex items-center gap-space-xs font-label-technical text-label-technical uppercase tracking-widest text-primary-container">
        <span className="material-symbols-outlined text-[16px]">palette</span>
        PHÒNG PHỐI MÀU BESPOKE
      </p>

      <div className="relative mt-space-md aspect-[4/3] overflow-hidden bg-surface-container-lowest">
        <Image
          src={STITCH.k07}
          alt="Bespoke colorway preview"
          fill
          sizes="(max-width: 1024px) 100vw, 40vw"
          className="object-cover transition-all duration-500"
          style={{ filter: upper.filter }}
          unoptimized
          draggable={false}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 transition-all duration-500"
          style={{ background: `linear-gradient(to top, ${sole.glow}, transparent)` }}
        />
        <span className="absolute bottom-space-sm left-space-sm bg-surface-container-lowest/90 px-space-xs py-space-3xs font-mono font-label-micro text-label-micro tracking-widest text-primary-container">
          {code}
        </span>
      </div>

      <div className="mt-space-md space-y-space-sm">
        <div>
          <p className="font-label-micro text-label-micro uppercase tracking-widest text-secondary">
            THÂN GIÀY // {upper.name}
          </p>
          <div className="mt-space-2xs flex gap-space-2xs">
            {UPPERS.map((u) => (
              <button
                key={u.name}
                title={u.name}
                onClick={() => {
                  setUpper(u);
                  setSaved(false);
                }}
                className={`h-9 flex-1 border p-1 transition-all ${
                  upper.name === u.name ? "border-primary-container" : "border-surface-container-highest hover:border-secondary/50"
                }`}
              >
                <span className={`block h-full w-full ${u.chip}`} />
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="font-label-micro text-label-micro uppercase tracking-widest text-secondary">
            ĐẾ PHÁT QUANG // {sole.name}
          </p>
          <div className="mt-space-2xs flex gap-space-2xs">
            {SOLES.map((s) => (
              <button
                key={s.name}
                title={s.name}
                onClick={() => {
                  setSole(s);
                  setSaved(false);
                }}
                className={`h-9 flex-1 border p-1 transition-all ${
                  sole.name === s.name ? "border-primary-container" : "border-surface-container-highest hover:border-secondary/50"
                }`}
              >
                <span className={`block h-full w-full ${s.chip}`} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => setSaved(true)}
        className={`mt-space-md flex w-full items-center justify-center gap-space-2xs py-space-sm font-label-technical text-label-technical font-bold uppercase tracking-widest transition-colors ${
          saved
            ? "bg-primary text-on-secondary"
            : "bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-secondary"
        }`}
      >
        <span className="material-symbols-outlined text-[16px]">{saved ? "check" : "fingerprint"}</span>
        <span>{saved ? "ĐÃ LƯU VÀO VAULT" : "LƯU CẤU HÌNH 1-OF-1"}</span>
      </button>
      <p className="mt-space-xs text-center font-label-micro text-label-micro uppercase tracking-widest text-secondary/60">
        Minh họa ý tưởng · 16 phối màu khả thi
      </p>
    </div>
  );
}
