import Link from "next/link";
import Image from "next/image";
import { HeroCarousel } from "./hero-carousel";

interface FeatureHeroProps {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  imageUrl: string;
  imageAlt: string;
  /** When 2+ images are supplied, the hero cross-fades through them. */
  images?: string[];
  badge?: string;
}

/**
 * Light, big-type hero. A rounded panel with an oversized headline + CTAs on
 * the left and a full-bleed product image on the right. Stacks on mobile.
 * Strings come from `brand.hero` at the call site — design-only otherwise.
 */
export function FeatureHero({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  imageUrl,
  imageAlt,
  images,
  badge,
}: FeatureHeroProps) {
  const gallery = (images && images.length > 1 ? images : [imageUrl]).filter(Boolean);
  return (
    <section className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      <div className="max-w-7xl mx-auto overflow-hidden rounded-[1.75rem] bg-secondary">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] items-stretch">
          {/* Copy */}
          <div className="relative p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
            {badge && (
              <span className="inline-flex items-center gap-2 mb-5 w-fit px-3 py-1.5 rounded-full bg-foreground/[0.06] border border-foreground/20 text-foreground text-[11px] font-medium uppercase tracking-[0.16em]">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
                {badge}
              </span>
            )}
            <p className="text-[12px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-3">
              {eyebrow}
            </p>
            <h1 className="text-[clamp(2.75rem,6.5vw,5.25rem)] leading-[0.95] m-0 text-foreground">
              {title}
            </h1>
            <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-md">
              {description}
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <Link
                href={primaryCta.href}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                {primaryCta.label}
                <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M3 6h7m0 0L7 3m3 3L7 9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              {secondaryCta && (
                <Link
                  href={secondaryCta.href}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-foreground/20 text-foreground hover:bg-foreground/5 transition-colors text-sm font-medium"
                >
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          </div>

          {/* Image */}
          <div className="relative min-h-[340px] sm:min-h-[420px] lg:min-h-[560px]">
            {gallery.length > 1 ? (
              <HeroCarousel images={gallery} alt={imageAlt} />
            ) : (
              <Image
                src={gallery[0]}
                alt={imageAlt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                priority
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
