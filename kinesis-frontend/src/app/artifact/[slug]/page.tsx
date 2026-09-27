import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArtifactClient from "../ArtifactClient";
import ProductJsonLd from "@/components/ProductJsonLd";
import { PRODUCTS } from "@/lib/data";
import { getStockForProduct } from "@/lib/shop-products";

/* Stock is read per request (60s cache) — a static build would freeze
   "còn N đôi" labels at build-time numbers and lie about availability. */
export const revalidate = 60;

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  return {
    title: product ? `${product.name} — The Artifact | KINESIS` : "Artifact | KINESIS",
  };
}

export default async function ArtifactSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) notFound();
  const sizeStock = await getStockForProduct(product.slug);
  return (
    <>
      <ProductJsonLd product={product} />
      <ArtifactClient product={product} sizeStock={sizeStock} />
    </>
  );
}
