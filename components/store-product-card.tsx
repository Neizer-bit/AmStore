"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { parsePrice, type Product } from "@cimplify/sdk";
import { brand } from "@/lib/brand";

/**
 * Storefront product card — clean, editorial layout: a large, consistent image,
 * a lightweight wishlist heart, and a centred name + price with room to breathe.
 * No badges, brand line, or struck-through price — just the essentials.
 * Statically pre-renderable.
 */

const money = new Intl.NumberFormat(brand.locale.replace("_", "-"), {
  style: "currency",
  currency: brand.currency,
  maximumFractionDigits: 0,
});

export function StoreProductCard({ product }: { product: Product }) {
  const slug = product.slug || product.id;
  const href = `/products/${encodeURIComponent(slug)}`;
  const img = product.image_url ?? product.images?.[0];
  const price = parsePrice(product.default_price);
  const [wished, setWished] = useState(false);

  return (
    <div className="group flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
        <Link href={href} className="block h-full w-full" aria-label={product.name}>
          {img ? (
            <Image
              src={img}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-xs text-muted-foreground">
              No image
            </div>
          )}
        </Link>

        {/* Lightweight wishlist heart — no chip, just the outline. */}
        <button
          type="button"
          onClick={() => setWished((v) => !v)}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wished}
          className="absolute right-3 top-3 grid place-items-center"
        >
          <svg
            viewBox="0 0 24 24"
            className={`h-6 w-6 [filter:drop-shadow(0_1px_1px_rgba(0,0,0,0.15))] transition-colors ${
              wished ? "fill-foreground stroke-foreground" : "fill-none stroke-foreground/70"
            }`}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
      </div>

      <div className="pt-3 text-left">
        <Link href={href} className="block">
          <h3 className="line-clamp-2 [font-family:var(--font-sans)] text-[13px] font-normal normal-case leading-snug tracking-normal text-muted-foreground transition-colors group-hover:text-foreground">
            {product.name}
          </h3>
        </Link>
        <p className="mt-0.5 text-sm font-semibold tracking-tight text-foreground">
          {money.format(price)}
        </p>
      </div>
    </div>
  );
}
