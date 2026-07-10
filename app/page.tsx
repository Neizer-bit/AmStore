import type { Metadata } from "next";
import { Suspense } from "react";
import { getServerClient, tags } from "@/lib/store-client";
import { FeatureHero } from "@/components/feature-hero";
import { Newsletter } from "@/components/newsletter";
import { ShopClient } from "./shop/shop-client";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: brand.hero.title,
  description: brand.description,
};

export const revalidate = 3600;

// Hero slider images (public/hero/). Tap to advance; also auto-cross-fades.
const HERO_IMAGES = [
  "/hero/1.jpg",
  "/hero/2.jpg",
  "/hero/3.jpg",
  "/hero/4.jpg",
];

async function getShopData() {
  const client = getServerClient();
  const [p, c] = await Promise.all([
    client.catalogue.getProducts(
      { limit: 50 },
      { cacheOptions: { revalidate: 3600, tags: [tags.products()] } },
    ),
    client.catalogue.getCategories({
      cacheOptions: { revalidate: 3600, tags: [tags.categories()] },
    }),
  ]);
  return {
    products: p.ok ? p.value.items : [],
    categories: c.ok ? c.value : [],
  };
}

export default async function HomePage() {
  const { products, categories } = await getShopData();
  return (
    <>
      <FeatureHero
        eyebrow="New in · hand-dyed batik"
        badge="Made in Ghana"
        title={brand.hero.title}
        description={brand.hero.subtitle}
        primaryCta={{ label: brand.hero.primaryCtaLabel, href: "#shop" }}
        secondaryCta={
          brand.hero.secondaryCtaLabel && brand.hero.secondaryCtaHref
            ? { label: brand.hero.secondaryCtaLabel, href: brand.hero.secondaryCtaHref }
            : undefined
        }
        imageUrl={HERO_IMAGES[0]}
        imageAlt="Amayali hand-dyed fashion"
        images={HERO_IMAGES}
      />

      <div id="shop" data-reveal className="scroll-mt-28">
        <Suspense
          fallback={
            <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          }
        >
          <ShopClient products={products} categories={categories} />
        </Suspense>
      </div>

      <div data-reveal>
        <Newsletter />
      </div>
    </>
  );
}
