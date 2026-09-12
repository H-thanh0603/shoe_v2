import type { Metadata } from "next";
import ArtifactClient from "./ArtifactClient";
import ProductJsonLd from "@/components/ProductJsonLd";
import { PRODUCTS } from "@/lib/data";

export const metadata: Metadata = {
  title: "K-09 STRATOS — The Artifact | KINESIS",
};

export default function ArtifactPage() {
  const product = PRODUCTS[0];
  return (
    <>
      <ProductJsonLd product={product} />
      <ArtifactClient product={product} />
    </>
  );
}
