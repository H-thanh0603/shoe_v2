import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArtifactClient from "../ArtifactClient";
import ProductJsonLd from "@/components/ProductJsonLd";
import { PRODUCTS } from "@/lib/data";

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
  return (
    <>
      <ProductJsonLd product={product} />
      <ArtifactClient product={product} />
    </>
  );
}
