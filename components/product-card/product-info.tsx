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
        <h3 className="line-clamp-2 min-h-[2.8em] [font-family:var(--font-sans)] text-[15px] font-medium normal-case leading-[1.4] tracking-normal text-foreground transition-colors hover:text-foreground md:min-h-0 md:text-[13px] md:font-semibold md:leading-snug md:text-foreground/90">
          {name}
        </h3>
      </Link>
      <p className="mt-2.5 [font-family:var(--font-sans)] text-[17px] font-bold tracking-tight text-foreground md:mt-1.5 md:text-[15px]">
        {price}
      </p>
    </div>
  );
}
