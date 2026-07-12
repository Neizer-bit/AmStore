import Link from "next/link";

/** Name (semi-bold, clamped to 2 lines) over a bolder, slightly larger price. */
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
        <h3 className="line-clamp-2 [font-family:var(--font-sans)] text-[13px] font-semibold normal-case leading-snug tracking-normal text-foreground/90 transition-colors hover:text-foreground">
          {name}
        </h3>
      </Link>
      <p className="mt-1.5 [font-family:var(--font-sans)] text-[15px] font-bold tracking-tight text-foreground">
        {price}
      </p>
    </div>
  );
}
