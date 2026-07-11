import Link from "next/link";
import { brand } from "@/lib/brand";

/**
 * Full-width promo band (Dickies-style sale callout). Charcoal panel, big
 * serif line, one CTA into the sale collection. Renders nothing when
 * `brand.promo` is unset. Reveals on scroll.
 */
export function PromoBanner() {
  const promo = brand.promo;
  if (!promo) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-8 py-4">
      <div
        data-reveal
        className="relative overflow-hidden rounded-3xl bg-foreground px-8 py-12 text-background sm:px-12 sm:py-16"
      >
        {/* Faint dot texture for depth. */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] [background-size:28px_28px]" />

        <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-background/25 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-background/80">
              <span className="h-1.5 w-1.5 rounded-full bg-background" />
              {promo.badge}
            </span>
            <h2 className="m-0 mt-4 [font-family:var(--font-display)] text-[clamp(1.9rem,4vw,3rem)] font-medium leading-[1.1]">
              {promo.title}
            </h2>
            <p className="mt-3 leading-relaxed text-background/70">{promo.body}</p>
          </div>

          <Link
            href={promo.ctaHref}
            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-background px-7 py-3.5 text-sm font-semibold text-foreground transition-opacity hover:opacity-90"
          >
            {promo.ctaLabel}
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
      </div>
    </section>
  );
}
