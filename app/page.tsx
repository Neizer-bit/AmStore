import type { Metadata } from "next";
import Link from "next/link";
import { getServerClient, tags } from "@/lib/store-client";
import { FeatureHero } from "@/components/feature-hero";
import { CategoryTiles } from "@/components/category-tiles";
import { PromoBanner } from "@/components/promo-banner";
import { Newsletter } from "@/components/newsletter";
import { StoreProductCard } from "@/components/store-product-card";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: brand.hero.title,
  description: brand.description,
};

export const revalidate = 3600;

// Hero slider images (public/hero/). Tap to advance; also auto-cross-fades.
const HERO_IMAGES = ["/hero/1.jpg", "/hero/2.jpg", "/hero/3.jpg", "/hero/4.jpg"];

/** How many pieces to preview in the "New in" rail before sending shoppers to /shop. */
const FEATURED_COUNT = 8;

async function getLandingData() {
  const client = getServerClient();
  const [p, c] = await Promise.all([
    client.catalogue.getProducts(
      { limit: FEATURED_COUNT },
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
  const { products, categories } = await getLandingData();
  const featured = brand.landing.featured;

  return (
    <>
      <FeatureHero
        title={brand.hero.title}
        description={brand.hero.subtitle}
        perk={brand.hero.perk}
        primaryCta={{ label: brand.hero.primaryCtaLabel, href: "/shop" }}
        secondaryCta={
          brand.hero.secondaryCtaLabel && brand.hero.secondaryCtaHref
            ? { label: brand.hero.secondaryCtaLabel, href: brand.hero.secondaryCtaHref }
            : undefined
        }
        imageUrl={HERO_IMAGES[0]}
        imageAlt="Amayali hand-dyed fashion"
        images={HERO_IMAGES}
      />

      {/* Shop by category — the way into the marketplace. */}
      <CategoryTiles categories={categories} />

      {/* New in — a taste of the catalogue, then straight to the full shop. */}
      {products.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 sm:px-8 pb-14 sm:pb-20">
          <div data-reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/55">
                {featured.eyebrow}
              </p>
              <h2 className="m-0 [font-family:var(--font-display)] text-[clamp(1.75rem,3.5vw,2.75rem)] font-medium leading-tight text-foreground">
                {featured.title}
              </h2>
            </div>
            <Link
              href={featured.ctaHref}
              className="group inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              {featured.ctaLabel}
              <svg
                viewBox="0 0 12 12"
                aria-hidden
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M3 6h6m0 0L6.5 3.5M9 6l-2.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p, i) => (
              <div key={p.id} data-reveal data-reveal-delay={String((i % 4) + 1)}>
                <StoreProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Sale promo band. */}
      <PromoBanner />

      <div data-reveal>
        <Newsletter />
      </div>
    </>
  );
}
