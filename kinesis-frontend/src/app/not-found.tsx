import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-gutter-mobile py-space-4xl text-center">
      <p className="font-label-micro text-label-micro uppercase tracking-widest text-secondary">
        404 — LOST IN THE ARCHIVE
      </p>
      <h1 className="mt-space-xs font-headline-md text-headline-md uppercase tracking-tight text-primary">
        Không tìm thấy trang
      </h1>
      <Link
        href="/gallery"
        className="mt-space-lg bg-primary-container px-space-lg py-space-md font-label-technical text-label-technical font-bold uppercase tracking-widest text-on-primary-container"
      >
        VÀO ARCHIVE →
      </Link>
    </div>
  );
}
