/**
 * Minimal tag badges (NEW IN / BESTSELLER / LIMITED / HANDMADE).
 *
 * Only known editorial tags are promoted to badges — anything else on the
 * product is ignored, so the grid never fills up with noise.
 */
const BADGE_LABELS: Record<string, string> = {
  new: "New In",
  bestseller: "Bestseller",
  limited: "Limited",
  handmade: "Handmade",
};

/** Highest-priority badge only — one per card keeps it elegant. */
export function badgeFor(tags: string[] | undefined): string | null {
  if (!tags?.length) return null;
  const normalised = tags.map((t) => t.toLowerCase().replace(/[^a-z]/g, ""));
  for (const key of ["new", "bestseller", "limited", "handmade"]) {
    if (normalised.some((t) => t.includes(key))) return BADGE_LABELS[key];
  }
  return null;
}

export function Badge({ label }: { label: string }) {
  return (
    <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-background/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-foreground shadow-sm backdrop-blur-[2px] md:text-[9px]">
      {label}
    </span>
  );
}
