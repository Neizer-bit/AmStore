import type { Metadata } from "next";
import Link from "next/link";
import { getServerClient, tags } from "@/lib/store-client";
import { FeatureHero } from "@/components/feature-hero";
import { CategoryTiles } from "@/components/category-tiles";
import { MarqueeStrip } from "@/components/marquee-strip";
import { PromoBanner } from "@/components/promo-banner";
import { SocialProof } from "@/components/social-proof";
import { StoreProductCard } from "@/components/store-product-card";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: brand.hero.title,
  description: brand.description,
};

export const revalidate = 3600;

/** Hero slideshow: cross-fades with a slow Ken Burns drift; tap to advance. */
const HERO_IMAGES = [
  "/hero/1.jpg",
  "/hero/2.jpg",
  "/hero/3.jpg",
  "/hero/4.jpg",
  "/hero/5.jpg",
];

/** Lifestyle shots reused for the sale band and the #AmayaliStyle strip. */
const PROMO_IMAGE = "/hero/2.jpg";
const SOCIAL_IMAGES = ["/hero/1.jpg", "/hero/2.jpg", "/hero/3.jpg", "/hero/4.jpg"];

/** How many pieces to preview in the "New in" rail before sending shoppers to /shop. */
const FEATURED_COUNT = 3;

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

      {/* Full-bleed category strip — the way into the marketplace. */}
      <CategoryTiles categories={categories} />

      {/* Scrolling craft marquee: batik · adire · tie-dye … */}
      <MarqueeStrip />

      {/* New in — heading on the left, a taste of the catalogue on the right. */}
      {products.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 sm:px-10 py-20 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,3fr)] lg:gap-20">
            <div data-reveal className="lg:self-center">
              <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/55">
                {featured.eyebrow}
              </p>
              <h2 className="m-0 [font-family:var(--font-display)] text-[clamp(1.75rem,3.2vw,2.5rem)] font-medium leading-[1.15] text-foreground">
                {featured.title}
              </h2>
              <Link
                href={featured.ctaHref}
                className="mt-6 inline-flex items-center justify-center bg-foreground px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-background transition-opacity hover:opacity-90"
              >
                {featured.ctaLabel}
              </Link>
            </div>

            {/* Mobile: a horizontal snap-scroller. The 2x2 grid squeezed each
                card to ~150px, which is what made this feel cramped — one row
                lets the cards be ~72% of the viewport, and the next card peeks
                in to signal there's more to swipe. It bleeds to the screen edge
                (-mx/px pair) while the first card stays aligned to the content.
                Desktop keeps its 4-up grid untouched. */}
            <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-1 sm:-mx-10 sm:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12 lg:overflow-visible lg:px-0 lg:pb-0">
              {products.map((p, i) => (
                <div
                  key={p.id}
                  data-reveal
                  data-reveal-delay={String((i % 3) + 1)}
                  className="w-[72%] shrink-0 snap-start sm:w-[44%] lg:w-auto lg:shrink"
                >
                  <StoreProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sale band with a model shot. */}
      <PromoBanner imageUrl={PROMO_IMAGE} />

      {/* #AmayaliStyle */}
      <SocialProof images={SOCIAL_IMAGES} />
    </>
  );
}
