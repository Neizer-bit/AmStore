"use client";

import { useMemo, useState } from "react";
import { parsePrice, type Category, type Product } from "@cimplify/sdk";
import { StoreProductCard } from "@/components/store-product-card";

/**
 * Storefront catalogue: category filter + a Sort dropdown (Newest /
 * Price low→high / Price high→low). Filtering and sorting run client-side over
 * the server-fetched products (ISR-cached, passed in from the page).
 *
 * The category filter is a row of chip "cards" (styled like the desktop menu
 * bar) on every breakpoint — a horizontal scroller on mobile, wrapping inline
 * on desktop. Sort stays a native <select>.
 */

type SortKey = "newest" | "price-asc" | "price-desc";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

function isNew(p: Product): boolean {
  return (p.tags ?? []).some((t) => /new/i.test(t));
}

const selectClass =
  "h-9 rounded-md border border-border bg-card px-3 pr-8 text-sm text-foreground outline-none transition-colors focus:border-foreground/40 cursor-pointer";

/** A single category "card" chip used in the mobile category bar. */
function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors ${
        active
          ? "border-foreground bg-foreground text-background font-medium"
          : "border-border bg-card text-foreground hover:border-foreground/40"
      }`}
    >
      {label}
    </button>
  );
}

export function ShopClient({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [sort, setSort] = useState<SortKey>("newest");
  const [categoryId, setCategoryId] = useState<string>("");

  const visible = useMemo(() => {
    const filtered = categoryId
      ? products.filter((p) => p.category_id === categoryId)
      : products;
    const arr = [...filtered];
    if (sort === "price-asc") {
      arr.sort((a, b) => parsePrice(a.default_price) - parsePrice(b.default_price));
    } else if (sort === "price-desc") {
      arr.sort((a, b) => parsePrice(b.default_price) - parsePrice(a.default_price));
    } else {
      // Newest: new-arrivals first, otherwise keep catalogue order (stable sort).
      arr.sort((a, b) => Number(isNew(b)) - Number(isNew(a)));
    }
    return arr;
  }, [products, categoryId, sort]);

  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-8 py-8 sm:py-10">
      <div className="border-b border-border pb-3 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {visible.length} {visible.length === 1 ? "item" : "items"}
          </p>
          <label className="flex items-center gap-2 text-sm">
            <span className="hidden sm:inline text-muted-foreground">Sort by</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              aria-label="Sort products"
              className={selectClass}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Category chip "cards" — every breakpoint. A single edge-to-edge
            horizontal scroller on mobile; wraps inline on desktop. Mirrors the
            desktop menu bar. */}
        <div className="-mx-6 mt-4 overflow-x-auto px-6 sm:mx-0 sm:overflow-visible sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
            <CategoryChip
              label="All"
              active={categoryId === ""}
              onClick={() => setCategoryId("")}
            />
            {categories.map((c) => (
              <CategoryChip
                key={c.id}
                label={c.name}
                active={categoryId === c.id}
                onClick={() => setCategoryId(c.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {visible.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12">
          {visible.map((p) => (
            <StoreProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-muted-foreground">
          No products in this category yet.
        </p>
      )}
    </section>
  );
}
