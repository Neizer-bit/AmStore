"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { parsePrice, type Product } from "@cimplify/sdk";
import { useCart } from "@cimplify/sdk/react";
import { brand } from "@/lib/brand";

/**
 * Storefront product card — clean, editorial layout: a large, consistent image,
 * a lightweight wishlist heart, and a left-aligned name + price.
 *
 * Includes a quick "Add to cart" that adds the piece straight from the grid,
 * so shoppers never have to open the product page. It slides up over the image
 * on hover (desktop) and sits visible on touch screens.
 */

const money = new Intl.NumberFormat(brand.locale.replace("_", "-"), {
  style: "currency",
  currency: brand.currency,
  maximumFractionDigits: 0,
});

type AddState = "idle" | "adding" | "added";

export function StoreProductCard({ product }: { product: Product }) {
  const slug = product.slug || product.id;
  const href = `/products/${encodeURIComponent(slug)}`;
  const img = product.image_url ?? product.images?.[0];
  const price = parsePrice(product.default_price);
  const [wished, setWished] = useState(false);
  const { addItem } = useCart();
  const [addState, setAddState] = useState<AddState>("idle");

  async function quickAdd(e: React.MouseEvent) {
    // The button sits over the image; never let the click navigate.
    e.preventDefault();
    e.stopPropagation();
    if (addState !== "idle") return;
    setAddState("adding");
    try {
      await addItem(product, 1);
      setAddState("added");
      window.setTimeout(() => setAddState("idle"), 1600);
    } catch {
      setAddState("idle");
    }
  }

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

        {/* Quick add — buy straight from the grid, no product page needed.
            Always visible on touch; slides up on hover from sm+ . */}
        <button
          type="button"
          onClick={quickAdd}
          disabled={addState !== "idle"}
          aria-label={`Add ${product.name} to cart`}
          className={`absolute inset-x-2.5 bottom-2.5 z-10 inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold shadow-sm backdrop-blur transition-all duration-300 ease-out
            translate-y-0 opacity-100
            sm:translate-y-3 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100
            focus-visible:translate-y-0 focus-visible:opacity-100
            ${
              addState === "added"
                ? "bg-foreground text-background"
                : "bg-background/95 text-foreground hover:bg-foreground hover:text-background"
            }`}
        >
          {addState === "added" ? (
            <>
              <svg viewBox="0 0 20 20" aria-hidden className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Added
            </>
          ) : addState === "adding" ? (
            <>
              <svg viewBox="0 0 20 20" aria-hidden className="h-3.5 w-3.5 animate-spin" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="10" cy="10" r="7" className="opacity-25" />
                <path d="M17 10a7 7 0 0 0-7-7" strokeLinecap="round" />
              </svg>
              Adding
            </>
          ) : (
            <>
              <svg viewBox="0 0 20 20" aria-hidden className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 6V5a4 4 0 0 1 8 0v1" strokeLinecap="round" />
                <path d="M4 6h12l-1 10.5a1.5 1.5 0 0 1-1.5 1.4h-7A1.5 1.5 0 0 1 5 16.5z" strokeLinejoin="round" />
              </svg>
              Add to cart
            </>
          )}
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
