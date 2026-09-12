"use client";

import { useState } from "react";

const PRESS = [
  ["VOGUE", "Tuyên ngôn điêu khắc của giày thể thao đương đại"],
  ["GQ", "Kỹ nghệ vượt xa mọi bàn cãi về giá"],
  ["HYPEBEAST", "Drop đáng săn nhất mùa"],
  ["ESQUIRE", "Haute couture gặp phòng lab"],
];

const VOICES = [
  {
    quote: "Đi K-09 xuống phố, người ta không hỏi giá — họ hỏi đó là cái gì.",
    name: "MINH K.",
    meta: "SỞ HỮU K-09 · TP. HỒ CHÍ MINH",
  },
  {
    quote: "Tôi đã chạy marathon bằng nhiều đôi, nhưng chưa đôi nào khiến gót chân im lặng như vậy.",
    name: "THẢO ANH",
    meta: "SỞ HỮU K-12 · HÀ NỘI",
  },
  {
    quote: "Hộ chiếu NFT nghe như chiêu trò, cho đến khi tôi bán lại đôi K-01 với provenance đầy đủ.",
    name: "KENJI M.",
    meta: "OBSIDIAN ELITE · TOKYO",
  },
];

export default function Voices() {
  const [i, setI] = useState(0);
  const v = VOICES[i];

  return (
    <section className="w-full bg-surface py-space-4xl">
      <div className="mx-auto max-w-[1400px] px-gutter-mobile lg:px-gutter-desktop">
        <p className="flex items-center gap-space-xs font-label-technical text-label-technical uppercase tracking-widest text-primary-container">
          <span className="material-symbols-outlined text-[16px]">forum</span>
          08 // NGƯỜI TA NÓI GÌ
        </p>
        <h2 className="mt-space-2xs font-display-lg text-display-lg uppercase leading-none tracking-tight text-primary">
          BẰNG CHỨNG <span className="text-primary-container">THAY LỜI QUẢNG CÁO</span>
        </h2>
      </div>

      {/* Press marquee */}
      <div className="mt-space-xl flex select-none items-center overflow-hidden border-y border-surface-container-highest bg-surface-container-lowest py-space-md">
        <div className="animate-marquee flex items-center gap-space-2xl whitespace-nowrap">
          {[...PRESS, ...PRESS].map(([paper, quote], d) => (
            <span key={d} className="flex items-center gap-space-md">
              <span className="font-headline-sm text-headline-sm font-bold uppercase text-primary">
                {paper}
              </span>
              <span className="font-body-md text-body-md italic text-secondary">
                &ldquo;{quote}&rdquo;
              </span>
              <span className="ml-space-lg size-1.5 bg-primary-container" />
            </span>
          ))}
        </div>
      </div>

      {/* Voices carousel */}
      <div className="mx-auto mt-space-xl max-w-4xl px-gutter-mobile text-center">
        <div key={i}>
          <blockquote className="font-headline-md text-headline-md leading-snug text-primary">
            &ldquo;{v.quote}&rdquo;
          </blockquote>
          <p className="mt-space-md font-label-technical text-label-technical font-bold uppercase tracking-widest text-primary-container">
            {v.name}
          </p>
          <p className="mt-space-3xs font-label-micro text-label-micro uppercase tracking-widest text-secondary">
            {v.meta}
          </p>
        </div>
        <div className="mt-space-lg flex items-center justify-center gap-space-md">
          <button
            onClick={() => setI((i - 1 + VOICES.length) % VOICES.length)}
            aria-label="Trước"
            className="grid size-10 place-items-center border border-surface-container-highest text-secondary transition-colors hover:border-primary-container hover:text-primary-container"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex gap-space-2xs">
            {VOICES.map((_, d) => (
              <button
                key={d}
                onClick={() => setI(d)}
                aria-label={`Đánh giá ${d + 1}`}
                className={`h-1 w-8 transition-colors ${d === i ? "bg-primary-container" : "bg-surface-container-highest"}`}
              />
            ))}
          </div>
          <button
            onClick={() => setI((i + 1) % VOICES.length)}
            aria-label="Sau"
            className="grid size-10 place-items-center border border-surface-container-highest text-secondary transition-colors hover:border-primary-container hover:text-primary-container"
          >
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    </section>
  );
}
