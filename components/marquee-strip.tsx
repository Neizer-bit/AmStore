import { brand } from "@/lib/brand";

/**
 * Infinite marquee of the craft techniques (batik, adire, tie-dye…). The track
 * renders the list twice and slides -50%, so the loop is seamless. Pauses on
 * hover; static under prefers-reduced-motion.
 */
export function MarqueeStrip() {
  const strip = brand.brandStrip;
  if (!strip || strip.brands.length === 0) return null;

  // Duplicated so the -50% translate wraps without a visible seam.
  const items = [...strip.brands, ...strip.brands];

  return (
    <section
      aria-label={strip.headline}
      className="marquee group relative overflow-hidden border-y border-border bg-foreground py-5 text-background"
    >
      <div className="marquee-track flex w-max items-center gap-10 sm:gap-14">
        {items.map((label, i) => (
          <span key={`${label}-${i}`} className="flex shrink-0 items-center gap-10 sm:gap-14">
            <span className="[font-family:var(--font-display)] text-lg font-medium tracking-[0.02em] sm:text-2xl">
              {label}
            </span>
            <span aria-hidden className="text-sm text-background/50 sm:text-base">
              ✦
            </span>
          </span>
        ))}
      </div>

      {/* Fade the strip into the page at both edges. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-foreground to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-foreground to-transparent" />
    </section>
  );
}
