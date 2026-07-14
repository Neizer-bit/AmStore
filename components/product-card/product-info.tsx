import Link from "next/link";

/**
 * Name (clamped to 2 lines) over a bolder price.
 *
 * Mobile reserves two lines for the name (`min-h-[2.6em]` at 1.3 line-height),
 * so a one-line title can't make its card shorter than its neighbour — every
 * card in the 2-up grid ends up the same height without relying on `mt-auto`.
 * Desktop keeps its existing type scale via the `md:` restores.
 */
export function ProductInfo({
  name,
  price,
  href,
}: {
  name: string;
  price: string;
  href: string;
}) {
  return (
    <div>
      <Link href={href} className="block">
        <h3 className="line-clamp-2 min-h-[2.7em] [font-family:var(--font-sans)] text-[14px] font-medium normal-case leading-[1.35] tracking-[0.005em] text-foreground/95 transition-colors hover:text-foreground md:min-h-0 md:text-[13px] md:font-semibold md:tracking-normal md:leading-snug md:text-foreground/90">
          {name}
        </h3>
      </Link>
      {/* Semibold + tabular on mobile: bold read shouty next to the quiet name,
          and tabular figures keep every price on the same optical column down
          the grid — the detail that makes a list of prices look set rather than
          typed. Desktop keeps its original bold/15px. */}
      <p className="mt-1.5 [font-family:var(--font-sans)] text-[16px] font-semibold tabular-nums tracking-[-0.01em] text-foreground md:mt-1.5 md:text-[15px] md:font-bold md:tracking-tight">
        {price}
      </p>
    </div>
  );
}
