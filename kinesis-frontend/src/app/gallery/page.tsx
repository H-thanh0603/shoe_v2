import type { Metadata } from "next";
import GalleryClient from "./GalleryClient";
import { getAllStockTotals } from "@/lib/shop-products";

/* 60s cache — "còn N đôi" badges must come from product_stock, never a
   build-time fake number. */
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Archive & Specimens | KINESIS",
};

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const stockTotals = await getAllStockTotals();
  return <GalleryClient initialQuery={q ?? ""} stockTotals={stockTotals} />;
}
