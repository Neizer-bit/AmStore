"use client";

import type { Product } from "@cimplify/sdk";
import { StoreProductCard } from "@/components/store-product-card";

/**
 * Client island for the collection listing.
 *
 * Renders its own grid rather than the SDK's <ProductGrid>, which owns its
 * columns and gutters — we need the same airy 2-up rhythm the shop grid uses.
 */
export function ListingClient({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="py-16 text-center text-muted-foreground">
        No products in this collection yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-8 sm:gap-y-20">
      {products.map((p) => (
        <StoreProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
