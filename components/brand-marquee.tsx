import { brand } from "@/lib/brand";

/**
 * Brand authority strip. Wordmark-only (avoids licensing issues with real
 * logos), monospaced for the brand-as-typography aesthetic.
 */
export function BrandMarquee() {
  const strip = brand.brandStrip;
  if (!strip || strip.brands.length === 0) return null;
  return (
    <section className="border-y border-border bg-background py-8 sm:py-10 overflow-hidden">
      <p className="text-center text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-6">
        {strip.headline}
      </p>
      <div className="flex items-center justify-around gap-10 sm:gap-14 flex-wrap px-6">
        {strip.brands.map((b) => (
          <span
            key={b}
            className="text-[clamp(1.25rem,2vw,1.75rem)] font-semibold text-muted-foreground hover:text-foreground transition-colors -tracking-[0.025em] opacity-70 hover:opacity-100"
          >
            {b}
          </span>
        ))}
      </div>
    </section>
  );
}
