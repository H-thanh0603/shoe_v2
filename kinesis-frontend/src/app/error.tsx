"use client";

import Link from "next/link";
import { useEffect } from "react";

/* Route-level error boundary: something threw during render/fetch. */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[kinesis-error]", error.digest ?? error.message);
  }, [error]);
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-gutter-mobile py-space-4xl text-center">
      <p className="font-label-micro text-label-micro uppercase tracking-widest text-error">
        SOMETHING BROKE
      </p>
      <h1 className="mt-space-xs font-headline-md text-headline-md uppercase tracking-tight text-primary">
        Có lỗi xảy ra
      </h1>
      <p className="mt-space-sm font-body-md text-body-md text-secondary">
        Thử tải lại trang. Nếu vẫn lỗi, liên hệ shop kèm mã{" "}
        <span className="font-label-technical text-primary-container">
          {error.digest ?? "unknown"}
        </span>
        .
      </p>
      <div className="mt-space-lg flex gap-space-sm">
        <button
          onClick={reset}
          className="bg-primary-container px-space-lg py-space-md font-label-technical text-label-technical font-bold uppercase tracking-widest text-on-primary-container"
        >
          THỬ LẠI
        </button>
        <Link
          href="/"
          className="border border-surface-container-highest px-space-lg py-space-md font-label-technical text-label-technical uppercase tracking-widest text-secondary"
        >
          VỀ TRANG CHỦ
        </Link>
      </div>
    </div>
  );
}
