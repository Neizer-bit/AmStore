import Link from "next/link";
import Image from "next/image";
import { HeroCarousel } from "./hero-carousel";

interface FeatureHeroProps {
  title: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  imageUrl: string;
  imageAlt: string;
  /** When 2+ images are supplied, the hero cross-fades through them. */
  images?: string[];
  /** Thin centred strip shown directly above the banner. */
  announcement?: string;
}

/**
 * Full-bleed cinematic hero: the campaign shot covers the entire slide, with
 * the headline in serif caps and the CTAs centred over a dark scrim.
 *
 * The imagery still cross-fades and advances on tap — the caption layer is
 * pointer-transparent so taps reach the carousel, while the links stay
 * clickable.
 */
export function FeatureHero({
  title,
  primaryCta,
  secondaryCta,
  imageUrl,
  imageAlt,
  images,
  announcement,
}: FeatureHeroProps) {
  const gallery = (images && images.length > 1 ? images : [imageUrl]).filter(Boolean);

  return (
    <section>
      {announcement && (
        <div className="bg-foreground px-4 py-2.5 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-background sm:text-[11px]">
          {announcement}
        </div>
      )}

      <div className="relative h-[74vh] max-h-[820px] min-h-[480px] w-full overflow-hidden">
        {gallery.length > 1 ? (
          <HeroCarousel images={gallery} alt={imageAlt} />
        ) : (
          <Image
            src={gallery[0]}
            alt={imageAlt}
            fill
            sizes="100vw"
            className="object-cover object-[50%_35%]"
            priority
          />
        )}

        {/* Scrim — keeps the caption legible. Pointer-transparent so taps still
            advance the carousel; sits below the progress dots (z-20). */}
        <div className="pointer-events-none absolute inset-0 z-[15] bg-gradient-to-b from-black/30 via-black/35 to-black/50" />

        {/* Centred caption over the full-bleed shot. */}
        <div className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center">
          {/* Mobile: the line was breaking mid-phrase and orphaning "FITS." on a
              line of its own. `text-balance` splits it evenly instead — "BOLD
              PRINTS, / EASY FITS." — and the smaller, wider-tracked setting is
              the house treatment the fashion titles use at this size. Restored
              to the original clamp/tracking from sm: up, so desktop is unchanged. */}
          <h1
            data-reveal
            className="m-0 max-w-[16ch] text-balance [font-family:var(--font-display)] text-[26px] font-medium uppercase leading-[1.35] tracking-[0.11em] text-white [text-shadow:0_1px_24px_rgba(0,0,0,0.35)] sm:max-w-4xl sm:text-wrap sm:text-[clamp(1.75rem,4.5vw,3.5rem)] sm:leading-[1.15] sm:tracking-[0.06em]"
          >
            {title}
          </h1>

          <div
            data-reveal
            data-reveal-delay="1"
            className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:mt-8"
          >
            <Link
              href={primaryCta.href}
              className="pointer-events-auto inline-flex items-center justify-center bg-white px-9 py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-foreground transition-opacity hover:opacity-90"
            >
              {primaryCta.label}
            </Link>
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="pointer-events-auto inline-flex items-center justify-center border border-white/70 px-9 py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-white hover:text-foreground"
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
