import Image from "next/image";
import { brand } from "@/lib/brand";

/**
 * "#AmayaliStyle" — a strip of lifestyle shots with the social links beside
 * it. Thumbnails zoom on hover; the row reveals on scroll.
 */
export function SocialProof({ images }: { images: string[] }) {
  if (images.length === 0) return null;
  const { eyebrow, title, followLabel } = brand.landing.social;

  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-8 py-14 sm:py-16">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
        <div data-reveal className="shrink-0">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/55">
            {eyebrow}
          </p>
          <h2 className="m-0 [font-family:var(--font-display)] text-[clamp(1.6rem,3vw,2.25rem)] font-medium leading-tight text-foreground">
            {title}
          </h2>
        </div>

        <div data-reveal className="flex flex-1 gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((src, i) => (
            <div
              key={src + i}
              className="group relative aspect-[3/4] w-28 shrink-0 overflow-hidden rounded-lg bg-muted sm:w-32"
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="128px"
                className="object-cover object-[50%_30%] transition-transform duration-700 ease-out group-hover:scale-[1.08]"
              />
            </div>
          ))}
        </div>

        <div data-reveal className="shrink-0 lg:text-right">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/55">
            {followLabel}
          </p>
          <div className="flex items-center gap-2.5 lg:justify-end">
            {brand.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background transition-opacity hover:opacity-80"
              >
                <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" fill="currentColor">
                  <circle cx="12" cy="12" r="10" fillOpacity="0" />
                  <SocialGlyph icon={s.icon} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Minimal glyphs matching the footer's social set. */
function SocialGlyph({ icon }: { icon?: string }) {
  switch (icon) {
    case "instagram":
      return (
        <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 1.8.25 2.2.42.6.22 1 .49 1.4.9.4.4.68.8.9 1.4.17.4.36 1 .42 2.2.06 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.06 1.2-.25 1.8-.42 2.2-.22.6-.5 1-.9 1.4-.4.4-.8.68-1.4.9-.4.17-1 .36-2.2.42-1.3.06-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.06-1.8-.25-2.2-.42-.6-.22-1-.5-1.4-.9-.4-.4-.68-.8-.9-1.4-.17-.4-.36-1-.42-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.06-1.2.25-1.8.42-2.2.22-.6.5-1 .9-1.4.4-.4.8-.68 1.4-.9.4-.17 1-.36 2.2-.42C8.4 2.2 8.8 2.2 12 2.2zm0 3.4a6.4 6.4 0 1 0 0 12.8 6.4 6.4 0 0 0 0-12.8zm0 2.2a4.2 4.2 0 1 1 0 8.4 4.2 4.2 0 0 1 0-8.4zm6.6-2.6a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
      );
    case "tiktok":
      return <path d="M16 3v3.5a4.5 4.5 0 0 0 4.5 4.5V14a7.5 7.5 0 0 1-4.5-1.5V16a5 5 0 1 1-5-5v3a2 2 0 1 0 2 2V3z" />;
    case "facebook":
      return <path d="M14 9V7a1 1 0 0 1 1-1h2V3h-3a4 4 0 0 0-4 4v2H8v3h2v9h3v-9h2.5l.5-3H13z" />;
    case "youtube":
      return (
        <path d="M22.5 6.5a2.6 2.6 0 0 0-1.8-1.8C19 4.2 12 4.2 12 4.2s-7 0-8.7.5A2.6 2.6 0 0 0 1.5 6.5C1 8.2 1 12 1 12s0 3.8.5 5.5a2.6 2.6 0 0 0 1.8 1.8c1.7.5 8.7.5 8.7.5s7 0 8.7-.5a2.6 2.6 0 0 0 1.8-1.8c.5-1.7.5-5.5.5-5.5s0-3.8-.5-5.5zM10 15.5v-7l6 3.5-6 3.5z" />
      );
    default:
      return <circle cx="12" cy="12" r="6" />;
  }
}
