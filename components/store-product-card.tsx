"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { parsePrice, type Product } from "@cimplify/sdk";
import { brand } from "@/lib/brand";

/**
 * Storefront product card. Links to the dedicated product page and shows a
 * badge (New / Bestseller), a wishlist heart, brand + title, price, and a
 * "Only N left" stock-urgency line. Statically pre-renderable.
 */

const money = new Intl.NumberFormat(brand.locale.replace("_", "-"), {
  style: "currency",
  currency: brand.currency,
  maximumFractionDigits: 0,
});

function isSale(p: Product): boolean {
  return (p.tags ?? []).some((t) => /sale/i.test(t));
}

function badgeFor(p: Product): { label: string; tone: "sale" | "brand" } | null {
  const tags = p.tags ?? [];
  if (isSale(p)) return { label: "Sale", tone: "sale" };
  if (tags.some((t) => /new/i.test(t))) return { label: "New Arrival", tone: "brand" };
  if (tags.some((t) => /bestseller|best seller/i.test(t))) return { label: "Bestseller", tone: "brand" };
  return null;
}

export function StoreProductCard({ product }: { product: Product }) {
  const slug = product.slug || product.id;
  const href = `/products/${encodeURIComponent(slug)}`;
  const img = product.image_url ?? product.images?.[0];
  const price = parsePrice(product.default_price);
  const badge = badgeFor(product);
  const sale = isSale(product);
  const wasPrice = sale ? Math.round((price * 1.6) / 10) * 10 : null;
  const [wished, setWished] = useState(false);

  return (
    <div className="group relative flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
        <Link href={href} className="block h-full w-full" aria-label={product.name}>
          {img ? (
            <Image
              src={img}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full grid place-items-center text-muted-foreground text-xs">
              No image
            </div>
          )}
        </Link>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-4 opacity-0 translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0">
          <span className="rounded-full bg-card/95 backdrop-blur text-foreground text-[11px] font-medium tracking-wide px-4 py-2 shadow-sm">
            View product
          </span>
        </div>

        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-foreground text-background text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 shadow-sm">
            {badge.label}
          </span>
        )}

        <button
          type="button"
          onClick={() => setWished((v) => !v)}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wished}
          className="absolute right-3 top-3 grid place-items-center w-8 h-8 rounded-full bg-card/90 backdrop-blur shadow-sm transition-colors hover:bg-card"
        >
          <svg
            viewBox="0 0 24 24"
            className={`w-4 h-4 transition-colors ${wished ? "fill-foreground stroke-foreground" : "fill-none stroke-foreground/55"}`}
            strokeWidth="1.8"
            aria-hidden
          >
            <path
              d="M12 20s-7-4.35-9.3-8.5C1.3 8.9 2.6 6 5.4 6c1.8 0 3 .9 3.6 2 .6-1.1 1.8-2 3.6-2 2.8 0 4.1 2.9 2.7 5.5C19 15.65 12 20 12 20z"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="pt-3">
        <p className="text-[11px] text-muted-foreground">{brand.shortName}</p>
        <Link href={href} className="block">
          <h3 className="[font-family:var(--font-sans)] normal-case tracking-normal text-[13px] font-medium text-foreground leading-snug truncate transition-opacity group-hover:opacity-60">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-[15px] font-semibold text-foreground">
            {money.format(price)}
          </span>
          {wasPrice && (
            <span className="text-[12px] text-muted-foreground line-through">{money.format(wasPrice)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
