import type { Metadata } from "next";
import Link from "next/link";
import { getServerClient, tags } from "@/lib/store-client";
import { FeatureHero } from "@/components/feature-hero";
import { CategoryTiles } from "@/components/category-tiles";
import { MarqueeStrip } from "@/components/marquee-strip";
import { ValueProps } from "@/components/value-props";
import { PromoBanner } from "@/components/promo-banner";
import { SocialProof } from "@/components/social-proof";
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

/** Lifestyle shots reused for the sale band and the #AmayaliStyle strip. */
const PROMO_IMAGE = "/hero/2.jpg";
const SOCIAL_IMAGES = ["/hero/1.jpg", "/hero/2.jpg", "/hero/3.jpg", "/hero/4.jpg"];

/** How many pieces to preview in the "New in" rail before sending shoppers to /shop. */
const FEATURED_COUNT = 4;

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
        eyebrow={brand.hero.eyebrow}
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

      {/* Full-bleed category strip — the way into the marketplace. */}
      <CategoryTiles categories={categories} />

      {/* Scrolling craft marquee: batik · adire · tie-dye … */}
      <MarqueeStrip />

      {/* Made with purpose. Worn with pride. */}
      <ValueProps />

      {/* New in — heading on the left, a taste of the catalogue on the right. */}
      {products.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 sm:px-8 py-14 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,3fr)] lg:gap-14">
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

            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
              {products.map((p, i) => (
                <div key={p.id} data-reveal data-reveal-delay={String((i % 4) + 1)}>
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

      <div data-reveal>
        <Newsletter />
      </div>
    </>
  );
}
