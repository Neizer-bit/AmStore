import Link from "next/link";
import Image from "next/image";
import type { Category } from "@cimplify/sdk";
import { brand } from "@/lib/brand";

/**
 * "Shop by category" — editorial tiles.
 *
 * The old version was a photo with a white pill dropped on top: readable, but
 * it read like a template. This is styled after the way the fashion houses cut
 * a category card — a numbered index, the name set large in the display serif,
 * a hairline frame inset into the image, and a rule that draws itself under an
 * "Explore" line.
 *
 * Motion is CSS-only (`group-hover` + `data-reveal` on scroll), so this stays a
 * Server Component — no Framer Motion, no client bundle for a section that is
 * mostly photography. Everything is transform/opacity, so it composites on the
 * GPU and doesn't cause layout work.
 *
 * Touch has no hover: the name, number and scrim are always painted. Hover only
 * ever *adds* (frame, rule, arrow, push-in), so a phone loses nothing.
 */

/** The API returns an `image` on a category; the SDK's type doesn't declare it. */
type CategoryTile = Category & { image?: string | null };

export function CategoryTiles({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;
  const c = brand.landing.categories;

  return (
    <section aria-label="Shop by category" className="pt-12 pb-20 sm:pt-16 sm:pb-28">
      <h2
        data-reveal
        className="m-0 mb-8 px-5 text-center [font-family:var(--font-display)] text-[clamp(1.5rem,2.6vw,2rem)] font-medium tracking-[0.02em] text-foreground sm:mb-12 sm:px-6"
      >
        {c.title}
      </h2>

      <div className="grid grid-cols-2 gap-2.5 px-3 sm:gap-4 sm:px-4 lg:grid-cols-4">
        {(categories as CategoryTile[]).map((cat, i) => (
          <Link
            key={cat.id}
            href={`/categories/${encodeURIComponent(cat.slug)}`}
            aria-label={`Shop ${cat.name}`}
            data-reveal
            data-reveal-delay={String((i % 4) + 1)}
            // `active:` is the touch equivalent of hover: the tile presses in
            // under the thumb and springs back. Scoped to max-sm so a desktop
            // mouse-down is unaffected.
            className="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-muted shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out max-sm:active:scale-[0.97] sm:shadow-none"
          >
            {cat.image && (
              <Image
                src={cat.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                // Slow, heavy push-in — the fashion-house pace, not a UI hover.
                // On touch there's no hover, so the press drives it instead.
                className="object-cover object-[50%_35%] transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08] max-sm:group-active:scale-[1.04] max-sm:duration-500"
              />
            )}

            {/* Scrim. Lighter through the middle on mobile — at 178px wide the
                garment is small enough that a heavy wash muddied it. */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent transition-opacity duration-700 group-hover:from-black/85 sm:from-black/75 sm:via-black/20" />

            {/* Couture frame. Hover draws it in on desktop; touch has no hover,
                so mobile simply wears it — the detail is the point, and a phone
                shouldn't get the plainer card. */}
            <div className="pointer-events-none absolute inset-3 rounded-md border border-white/35 opacity-100 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:inset-4 sm:scale-[1.03] sm:border-white/50 sm:opacity-0 sm:group-hover:scale-100 sm:group-hover:opacity-100" />

            {/* Index — the editorial tell. */}
            <span className="absolute left-4 top-4 text-[9px] font-medium tabular-nums tracking-[0.2em] text-white/70 transition-colors duration-500 group-hover:text-white sm:left-5 sm:top-5 sm:text-[11px] sm:text-white/60">
              {String(i + 1).padStart(2, "0")}
            </span>

            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
              {/* The name lifts as the rule sweeps out beneath it. */}
              <h3 className="m-0 [font-family:var(--font-display)] text-[16px] font-medium leading-tight tracking-[0.01em] text-white transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 sm:text-[22px]">
                {cat.name}
              </h3>

              {/* Rule. Drawn at rest on mobile (no hover to trigger it); on
                  desktop it still sweeps 0 → 40px. */}
              <span className="mt-1.5 block h-px w-6 bg-white/70 transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:mt-2.5 sm:w-0 sm:group-hover:w-10" />

              {/* Explore → : fades up under the rule. Hidden on touch, where
                  there's no hover to reveal it and the whole tile is the target. */}
              <span className="mt-0 hidden translate-y-1 items-center gap-1.5 overflow-hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-white opacity-0 transition-all duration-500 ease-out group-hover:mt-2 group-hover:translate-y-0 group-hover:opacity-100 sm:inline-flex">
                {c.ctaLabel}
                <svg
                  viewBox="0 0 16 16"
                  aria-hidden
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3 transition-transform duration-500 ease-out group-hover:translate-x-0.5"
                >
                  <path d="M2 8h11M9 4l4 4-4 4" />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
