import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Cormorant_Garamond, Chewy } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { getServerClient, tags } from "@/lib/store-client";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductModal } from "@/components/product-modal";
import { CartDrawer } from "@/components/cart-drawer";
import { OrganizationJsonLd } from "@/components/json-ld";
import { Suspense } from "react";
import { brand } from "@/lib/brand";
import { getSiteUrl } from "@/lib/site-url";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

// Rounded, bubbly wordmark font — matches the Amayali logo lettering.
const brandFont = Chewy({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-brand",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = await getSiteUrl();
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: brand.name,
      template: `%s — ${brand.name}`,
    },
    description: brand.description,
    openGraph: {
      type: "website",
      siteName: brand.name,
      locale: brand.locale,
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const server = getServerClient();
  const [bizResult, locResult] = await Promise.all([
    server.business.getInfo({ cacheOptions: { revalidate: 3600, tags: [tags.business()] } }),
    server.business.getLocations({ cacheOptions: { revalidate: 3600, tags: [tags.locations()] } }),
  ]);
  const initialBusiness = bizResult.ok ? bizResult.value : null;
  const initialLocations = locResult.ok ? locResult.value : [];

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${mono.variable} ${display.variable} ${brandFont.variable}`}>
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col bg-background text-foreground font-sans"
      >
        <Suspense fallback={null}>
          <OrganizationJsonLd />
        </Suspense>
        <Providers initialBusiness={initialBusiness} initialLocations={initialLocations}>
          <ScrollReveal />
          <Header />
          <main className="flex-1 pb-12 w-full">
            <Suspense fallback={null}>{children}</Suspense>
          </main>
          <Footer />
          <Suspense fallback={null}>
            <ProductModal />
          </Suspense>
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
