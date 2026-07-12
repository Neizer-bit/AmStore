import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `${brand.journal.title} — ${brand.name}`,
  description: brand.journal.body,
};

export const revalidate = 3600;

/**
 * Journal — linked from the footer. A holding page until the first entries
 * land, so the footer link resolves instead of 404-ing.
 */
export default function JournalPage() {
  return (
    <article className="max-w-3xl mx-auto px-6 sm:px-8 py-20 sm:py-28 text-center">
      <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/55">
        {brand.journal.eyebrow}
      </p>
      <h1 className="m-0 [font-family:var(--font-display)] text-[clamp(1.9rem,4vw,3rem)] font-medium leading-[1.15] text-foreground">
        {brand.journal.title}
      </h1>
      <p className="mx-auto mt-5 max-w-lg leading-relaxed text-muted-foreground">
        {brand.journal.body}
      </p>
      <Link
        href="/shop"
        className="mt-9 inline-flex items-center justify-center bg-foreground px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-background transition-opacity hover:opacity-90"
      >
        Shop the collection
      </Link>
    </article>
  );
}
