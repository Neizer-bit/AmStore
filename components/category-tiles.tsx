import Link from "next/link";
import Image from "next/image";
import type { Category } from "@cimplify/sdk";
import { brand } from "@/lib/brand";

/**
 * Full-bleed category strip — four edge-to-edge tiles directly under the hero.
 * Each is a category photo under a dark scrim with the category name in large
 * serif caps and a "Shop now" link, and it opens that category's marketplace.
 * The image zooms and the scrim lifts on hover.
 */

/** The API returns an `image` on a category; the SDK's type doesn't declare it. */
type CategoryTile = Category & { image?: string | null };

export function CategoryTiles({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;
  const { ctaLabel } = brand.landing.categories;

  return (
    <section aria-label="Shop by category" className="grid grid-cols-2 lg:grid-cols-4">
      {(categories as CategoryTile[]).map((cat, i) => (
        <Link
          key={cat.id}
          href={`/categories/${encodeURIComponent(cat.slug)}`}
          data-reveal
          data-reveal-delay={String((i % 4) + 1)}
          className="group relative block aspect-[3/4] overflow-hidden bg-foreground sm:aspect-[4/5]"
        >
          {cat.image && (
            <Image
              src={cat.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover object-[50%_35%] transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
            />
          )}

          {/* Scrim: keeps the caption legible, lifts slightly on hover. */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10 transition-colors duration-500 group-hover:from-black/60" />

          <div className="absolute inset-x-0 bottom-0 p-5 text-center sm:p-7">
            <h3 className="m-0 [font-family:var(--font-display)] text-[clamp(1.25rem,2.2vw,1.9rem)] font-medium uppercase tracking-[0.06em] text-white">
              {cat.name}
            </h3>
            <span className="mt-1 inline-block text-[13px] text-white/90 underline decoration-white/50 underline-offset-4 transition-colors group-hover:decoration-white">
              {ctaLabel}
            </span>
          </div>
        </Link>
      ))}
    </section>
  );
}
