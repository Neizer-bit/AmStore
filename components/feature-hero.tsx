import Link from "next/link";
import Image from "next/image";
import { HeroCarousel } from "./hero-carousel";

interface FeatureHeroProps {
  eyebrow?: string;
  title: React.ReactNode;
  description: string;
  /** Optional highlighted perk line, shown with a flourish icon. */
  perk?: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  imageUrl: string;
  imageAlt: string;
  /** When 2+ images are supplied, the hero cross-fades through them. */
  images?: string[];
  badge?: string;
}

/**
 * Two-tone serif headline: the last sentence renders in a warm antique-gold,
 * the rest in charcoal. Falls back to a plain node if `title` isn't a string.
 */
function Headline({ title }: { title: React.ReactNode }) {
  if (typeof title !== "string") return <>{title}</>;
  const sentences = (title.match(/[^.!?]+[.!?]*/g) ?? [title]).map((s) => s.trim()).filter(Boolean);
  return (
    <>
      {sentences.map((s, i) => (
        // .hero-line clips the line; the inner span slides up from behind it.
        <span key={i} className="hero-line">
          <span
            className={
              i === sentences.length - 1 && sentences.length > 1
                ? "text-[#a17c48]"
                : "text-foreground"
            }
          >
            {s}
          </span>
        </span>
      ))}
    </>
  );
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
  perk,
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
          <div className="relative p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
            {badge && (
              <span className="inline-flex items-center gap-2 mb-5 w-fit px-3 py-1.5 rounded-full bg-foreground/[0.06] border border-foreground/20 text-foreground text-[11px] font-medium uppercase tracking-[0.16em]">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
                {badge}
              </span>
            )}
            {eyebrow && (
              <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/55">
                {eyebrow}
              </p>
            )}
            <h1 className="text-[clamp(2.25rem,5vw,4rem)] leading-[1.08] tracking-[-0.005em] m-0">
              <Headline title={title} />
            </h1>
            <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-md">
              {description}
            </p>
            {perk && (
              <p className="mt-4 flex items-center gap-2 text-sm text-foreground/70">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  aria-hidden
                  className="h-4 w-4 shrink-0 text-[#a17c48]"
                >
                  <path d="M12 3v18M4.5 8l15 8M19.5 8l-15 8" />
                </svg>
                {perk}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <Link
                href={primaryCta.href}
                className="inline-flex items-center justify-center bg-foreground px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-background transition-opacity hover:opacity-90"
              >
                {primaryCta.label}
              </Link>
              {secondaryCta && (
                <Link
                  href={secondaryCta.href}
                  className="inline-flex items-center justify-center border border-foreground/30 px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-foreground hover:text-background"
                >
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          </div>

          {/* Image */}
          <div className="relative min-h-[300px] sm:min-h-[380px] lg:min-h-[460px]">
            {gallery.length > 1 ? (
              <HeroCarousel images={gallery} alt={imageAlt} />
            ) : (
              <Image
                src={gallery[0]}
                alt={imageAlt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-[50%_38%]"
                priority
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
