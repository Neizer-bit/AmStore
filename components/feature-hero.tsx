import Link from "next/link";
import Image from "next/image";
import { HeroCarousel } from "./hero-carousel";
import { HeroSplitCarousel } from "./hero-split-carousel";
import { brand } from "@/lib/brand";

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
 * Two heroes, one per form factor — deliberately, not by accident.
 *
 * Desktop is an editorial split: copy panel left, the model in a column cut to
 * the photograph's own 2:3 on the right. Mobile keeps the full-bleed cinematic
 * banner, with the headline in serif caps over a dark scrim.
 *
 * They are separate markup rather than one responsive block because the two
 * layouts share almost nothing — different crop, different carousel, different
 * type treatment, different Ken Burns budget — and because keeping them apart
 * guarantees that desktop work cannot disturb the mobile banner.
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

      {/* ── Desktop: editorial split ──────────────────────────────────────
          The shots are portrait (2:3) and the banner is 2:1 wide. Full-bleed,
          that geometry only ever gives you one of two bad outcomes: `cover`
          crops 68% of the frame (torso only), or `contain` centres her in ~460px
          of empty studio beige on each side. Neither reads as premium.

          The split makes the width intentional. The image column is cut to the
          photograph's own 2:3, so `cover` crops ~0% — she stands full-length,
          edge to edge, floor to ceiling — and the space that was dead beige
          becomes the copy panel. She goes from 443px wide to ~590px, and every
          pixel beside her is now doing work.

          Desktop only. Mobile keeps the full-bleed banner below, untouched. */}
      {/* The hero is sized to sit inside ONE window: viewport height minus the
          two-row header (~9.5rem), capped at 700px. That cap is what keeps the
          whole banner above the fold on a 900px screen (152 + 700 = 852). */}
      <div className="hidden lg:grid lg:h-[calc(100svh-9.5rem)] lg:max-h-[700px] lg:min-h-[520px] lg:grid-cols-[1fr_auto] lg:bg-muted">
        {/* Copy panel */}
        <div className="flex flex-col justify-center px-10 xl:px-14 2xl:px-20">
          <div data-reveal className="max-w-[24rem]">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
              {brand.hero.eyebrow ?? brand.shortName}
            </p>

            <h1 className="m-0 [font-family:var(--font-display)] text-[clamp(1.9rem,2.6vw,2.75rem)] font-medium uppercase leading-[1.1] tracking-[0.02em] text-foreground">
              {title}
            </h1>

            {/* Hairline rule — the fashion-house full stop. */}
            <span className="mt-7 block h-px w-14 bg-foreground/25" />

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={primaryCta.href}
                className="inline-flex items-center justify-center bg-foreground px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-background transition-opacity hover:opacity-85"
              >
                {primaryCta.label}
              </Link>
              {secondaryCta && (
                <Link
                  href={secondaryCta.href}
                  className="inline-flex items-center justify-center border border-foreground/25 px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
                >
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Image half — a 4:3 region holding two 2:3 frames. Each frame is the
            photograph's own ratio, so `cover` crops ~0% and the model stands
            full-length. Two frames take the imagery from ~39% of the screen to
            ~68%: with the hero capped to one window, more picture is the only
            way to give the picture more room. */}
        <div className="relative aspect-[4/3] h-full justify-self-end overflow-hidden">
          <HeroSplitCarousel images={gallery} alt={imageAlt} />
        </div>
      </div>

      {/* ── Mobile: the original full-bleed banner. Untouched. ───────────── */}
      <div className="relative h-[74vh] max-h-[820px] min-h-[480px] w-full overflow-hidden lg:hidden">
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
