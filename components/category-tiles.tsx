import Link from "next/link";
import Image from "next/image";
import type { Category } from "@cimplify/sdk";
import { brand } from "@/lib/brand";

/**
 * "Shop by category" — an editorial tile grid under a centred serif heading.
 *
 * The photography carries the section, so there's no heavy scrim: each tile
 * just floats a white serif pill with the category name, which inverts to
 * charcoal on hover while the image slowly pushes in. Opens that category's
 * marketplace.
 */

/** The API returns an `image` on a category; the SDK's type doesn't declare it. */
type CategoryTile = Category & { image?: string | null };

export function CategoryTiles({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <section aria-label="Shop by category" className="py-16 sm:py-20">
      <h2
        data-reveal
        className="m-0 mb-10 px-6 text-center [font-family:var(--font-display)] text-[clamp(1.5rem,2.8vw,2.125rem)] font-medium tracking-[0.01em] text-foreground sm:mb-12"
      >
        {brand.landing.categories.title}
      </h2>

      <div className="grid grid-cols-2 gap-2 px-2 sm:gap-3 sm:px-3 lg:grid-cols-4">
        {(categories as CategoryTile[]).map((cat, i) => (
          <Link
            key={cat.id}
            href={`/categories/${encodeURIComponent(cat.slug)}`}
            aria-label={`Shop ${cat.name}`}
            data-reveal
            data-reveal-delay={String((i % 4) + 1)}
            className="group relative block aspect-[3/4] overflow-hidden bg-muted"
          >
            {cat.image && (
              <Image
                src={cat.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover object-[50%_35%] transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
              />
            )}

            {/* Barely-there wash: adds depth on hover without muddying the shot. */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

            {/* Serif pill — inverts to charcoal on hover. */}
            <span
              className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/95 px-6 py-2 text-[13px] leading-none tracking-[0.02em] text-foreground shadow-[0_2px_10px_rgba(0,0,0,0.08)] backdrop-blur-[2px] transition-all duration-500 ease-out [font-family:var(--font-display)] group-hover:bg-foreground group-hover:text-background sm:bottom-7 sm:px-8 sm:py-2.5 sm:text-[15px]"
            >
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
