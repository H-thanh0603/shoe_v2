import type { Metadata } from "next";
import { Archivo, Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { WishlistProvider } from "@/lib/wishlist";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import ScrollChrome from "@/components/ScrollChrome";

const display = Archivo({
  variable: "--font-display-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["600", "700", "800", "900"],
});

const bodySans = Be_Vietnam_Pro({
  variable: "--font-body-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "KINESIS / ATELIER — Beyond Gravity",
  description:
    "Haute couture sneaker atelier. Paris — Tokyo. Experimental silhouettes, carbon artifacts, limited drops.",
};

/* Organization + WebSite structured data (schema.org / JSON-LD).
   Machine-readable for both search engines and AI agents (Agentic Web). */
const ORGANIZATION_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://kinesis.example/#org",
      name: "KINESIS / ATELIER",
      url: "/",
      description: "Haute couture sneaker atelier — Paris, Tokyo, Milan.",
      brand: "KINESIS",
      knowsAbout: ["experimental sneakers", "carbon artifacts", "digital passports"],
      areaServed: ["Paris", "Tokyo", "Milan"],
      department: [
        { "@type": "Place", name: "PARIS IX" },
        { "@type": "Place", name: "TOKYO KINETIC LAB" },
        { "@type": "Place", name: "MILANO BRERA VAULT" },
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://kinesis.example/#site",
      url: "/",
      name: "KINESIS / ATELIER — Beyond Gravity",
      inLanguage: ["vi", "en", "fr"],
      about: {
        "@type": "Brand",
        name: "KINESIS",
        slogan: "Beyond Gravity",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${display.variable} ${bodySans.variable} ${jetbrains.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=block"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_LD) }}
        />
      </head>
      <body className="min-h-screen font-body-md text-on-surface">
        <Providers>
          <CartProvider>
            <WishlistProvider>
              <ScrollChrome />
              <Header />
              <main className="-mt-20 pt-20">{children}</main>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
