import type { Product } from "@/lib/data";

/* Server-only component: schema.org Product/Offer JSON-LD.
   Renders machine-readable product data (Agentic Web / structured content). */
export default function ProductJsonLd({ product }: { product: Product }) {
  const url = `/artifact/${product.slug}`;
  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": url,
    name: product.name,
    sku: product.sku,
    description: product.description,
    url,
    image: product.image,
    brand: { "@type": "Brand", name: "KINESIS" },
    category: product.category,
    material: product.materials,
    color: product.colors,
    additionalProperty: [
      { "@type": "PropertyValue", name: "Series", value: product.series },
      { "@type": "PropertyValue", name: "Edition", value: product.edition },
      { "@type": "PropertyValue", name: "Status", value: product.status },
    ],
    offers: {
      "@type": "Offer",
      url,
      price: product.price,
      priceCurrency: "USD",
      availability:
        product.status === "SOLD OUT"
          ? "https://schema.org/SoldOut"
          : "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "KINESIS / ATELIER" },
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  );
}