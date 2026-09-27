import type { Metadata } from "next";
import ArtifactClient from "./ArtifactClient";
import ProductJsonLd from "@/components/ProductJsonLd";
import { PRODUCTS } from "@/lib/data";
import { getStockForProduct } from "@/lib/shop-products";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "K-09 STRATOS — The Artifact | KINESIS",
};

export default async function ArtifactPage() {
  const product = PRODUCTS[0];
  const sizeStock = await getStockForProduct(product.slug);
  return (
    <>
      <ProductJsonLd product={product} />
      <ArtifactClient product={product} sizeStock={sizeStock} />
    </>
  );
}
