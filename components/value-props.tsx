import { brand } from "@/lib/brand";

/**
 * "Made with purpose. Worn with pride." — four brand pillars in a row,
 * separated by hairline dividers. Icon, title, and a short line each.
 */

const ICONS: Record<string, React.ReactNode> = {
  // Hand cradling a leaf — hand-dyed.
  hand: (
    <>
      <path d="M3 17c2.5 2.5 6 3 9 1.5" />
      <path d="M12.5 15.5c4 0 7-2.5 7.5-7-4.5-.5-7.5 2-7.5 7z" />
      <path d="M20 8.5c-3 1-5 3-5.5 6" />
    </>
  ),
  heart: (
    <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  ),
  leaf: (
    <>
      <path d="M20 4c0 9-5 13-11 13a5 5 0 0 1-5-5C4 6 11 4 20 4z" />
      <path d="M4 20c2-6 6-9 11-11" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.7 3.8 5.8 3.8 9S14.5 18.3 12 21c-2.5-2.7-3.8-5.8-3.8-9S9.5 5.7 12 3z" />
    </>
  ),
};

export function ValueProps() {
  const { title, items } = brand.landing.values;

  return (
    <section className="border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-14 sm:py-16">
        <h2
          data-reveal
          className="m-0 text-center [font-family:var(--font-display)] text-[clamp(1.4rem,2.6vw,2rem)] font-medium leading-tight text-foreground"
        >
          {title}
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-y-10 lg:grid-cols-4">
          {items.map((item, i) => (
            <div
              key={item.title}
              data-reveal
              data-reveal-delay={String((i % 4) + 1)}
              className={`px-4 text-center sm:px-6 ${
                i > 0 ? "lg:border-l lg:border-border" : ""
              } ${i % 2 === 1 ? "border-l border-border lg:border-l" : ""}`}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto h-7 w-7 text-foreground/75"
              >
                {ICONS[item.iconKey]}
              </svg>
              <p className="mt-3 text-sm font-semibold text-foreground">{item.title}</p>
              <p className="mx-auto mt-1.5 max-w-[19ch] text-[13px] leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
