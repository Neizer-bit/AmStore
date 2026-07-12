import Link from "next/link";
import Image from "next/image";
import { brand } from "@/lib/brand";

/**
 * Sale promo band: a deep charcoal panel with the campaign copy and CTA on the
 * left and a full-bleed model shot on the right, blended into the panel.
 * Renders nothing when `brand.promo` is unset. Reveals on scroll.
 */
export function PromoBanner({ imageUrl }: { imageUrl?: string }) {
  const promo = brand.promo;
  if (!promo) return null;

  return (
    <section data-reveal className="relative overflow-hidden bg-foreground text-background">
      <div className="grid lg:grid-cols-2">
        {/* Copy */}
        <div className="relative z-10 flex flex-col items-start justify-center px-6 py-14 sm:px-10 sm:py-20 lg:pl-[max(2.5rem,calc((100vw-80rem)/2+2rem))]">
          <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-background/55">
            {promo.badge}
          </span>
          <h2 className="m-0 mt-4 max-w-md [font-family:var(--font-display)] text-[clamp(1.9rem,4vw,3rem)] font-medium leading-[1.1]">
            {promo.title}
          </h2>
          <p className="mt-4 max-w-md leading-relaxed text-background/70">{promo.body}</p>

          <Link
            href={promo.ctaHref}
            className="group mt-7 inline-flex items-center gap-2 bg-background px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-foreground transition-opacity hover:opacity-90"
          >
            {promo.ctaLabel}
            <svg
              viewBox="0 0 12 12"
              aria-hidden
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"
            >
              <path d="M3 6h6m0 0L6.5 3.5M9 6l-2.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* Model shot, faded into the panel on its left edge. */}
        {imageUrl && (
          <div className="relative min-h-[280px] lg:min-h-[440px]">
            <Image
              src={imageUrl}
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-[50%_30%]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/45 to-transparent lg:via-foreground/30" />
          </div>
        )}
      </div>
    </section>
  );
}
