import Link from "next/link";
import Image from "next/image";
import type { Category } from "@cimplify/sdk";
import { brand } from "@/lib/brand";

/**
 * "Shop by category" tile grid — the landing page's main way into the
 * marketplace. Each tile is a category photo that zooms on hover (Gucci /
 * Nike style) and links to that category's listing, where the pieces can be
 * browsed and bought. Tiles reveal on scroll in a staggered cascade.
 */
/**
 * The catalogue API returns an `image` on a category, but the SDK's `Category`
 * type doesn't declare it. Widen locally.
 */
type CategoryTile = Category & { image?: string | null };

export function CategoryTiles({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;
  const copy = brand.landing.categories;

  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-8 py-14 sm:py-20">
      <div data-reveal className="mb-8 sm:mb-10 max-w-xl">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/55">
          {copy.eyebrow}
        </p>
        <h2 className="m-0 [font-family:var(--font-display)] text-[clamp(1.75rem,3.5vw,2.75rem)] font-medium leading-tight text-foreground">
          {copy.title}
        </h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">{copy.body}</p>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
        {(categories as CategoryTile[]).map((cat, i) => {
          return (
            <Link
              key={cat.id}
              href={`/categories/${encodeURIComponent(cat.slug)}`}
              data-reveal
              data-reveal-delay={String((i % 4) + 1)}
              className="group block"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover object-[50%_35%] transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-xs text-muted-foreground">
                    {cat.name}
                  </div>
                )}
                {/* Subtle wash that deepens on hover. */}
                <div className="absolute inset-0 bg-foreground/0 transition-colors duration-500 group-hover:bg-foreground/10" />
              </div>

              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-foreground">{cat.name}</span>
                {/* Arrow slides in on hover. */}
                <svg
                  viewBox="0 0 12 12"
                  aria-hidden
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="h-3.5 w-3.5 shrink-0 -translate-x-1 text-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <path d="M3 6h6m0 0L6.5 3.5M9 6l-2.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
