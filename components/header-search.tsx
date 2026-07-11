"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { parsePrice, type Money } from "@cimplify/sdk";
import { brand } from "@/lib/brand";

/**
 * Prominent header search (ASOS-style light pill with the magnifier on the
 * right). As the shopper types, a suggestion dropdown lists matching
 * categories and products they can jump straight to. There is no search-results
 * page: submitting (or picking a suggestion) resolves the term and navigates to
 * the best destination —
 *   1. a category / Sale / Shop All (e.g. "dresses", "skirts", "sale"), else
 *   2. a matching product's page (e.g. "afua", "kimono", "gingham"), else
 *   3. the full shop.
 * Placeholder comes from `brand.header.searchPlaceholder`.
 */

type LiteProduct = { slug: string; name: string; image?: string; price?: number };

/** A single row in the suggestion dropdown. */
type Suggestion =
  | { kind: "category"; label: string; href: string }
  | { kind: "product"; label: string; href: string; image?: string; price?: number };

const money = new Intl.NumberFormat(brand.locale.replace("_", "-"), {
  style: "currency",
  currency: brand.currency,
  maximumFractionDigits: 0,
});

/**
 * Placeholder that names the actual searchable categories, e.g.
 * "Search dresses, rompers, skirts, activewear…". Derived from the nav's
 * category links so it always reflects what you can search for.
 */
const SEARCH_PLACEHOLDER = (() => {
  const categories = brand.header.nav
    .filter((item) => item.href.startsWith("/categories/"))
    .map((item) => item.label.toLowerCase());
  return categories.length
    ? `Search ${categories.join(", ")}…`
    : brand.header.searchPlaceholder ?? "Search products…";
})();

/** Strip to comparable letters/digits so "Shop All" → "shopall". */
function slugKey(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Map a typed term to a nav destination (category, Sale, Shop All). Exact
 * normalised match first, then a loose singular/plural/partial match
 * ("dress" → Dresses, "active" → Activewear). Returns null when nothing fits.
 */
function matchCategory(key: string): string | null {
  if (!key) return null;
  const targets = brand.header.nav.map((item) => ({
    href: item.href,
    key: slugKey(item.label),
  }));

  const exact = targets.find((t) => t.key === key);
  if (exact) return exact.href;

  if (key.length >= 3) {
    const partial = targets.find(
      (t) => t.key !== "shopall" && (t.key.includes(key) || key.includes(t.key)),
    );
    if (partial) return partial.href;
  }
  return null;
}

/** Find the product whose name/slug best matches the term. */
function matchProduct(termRaw: string, products: LiteProduct[]): string | null {
  const term = termRaw.trim().toLowerCase();
  if (term.length < 2 || products.length === 0) return null;

  const hay = (p: LiteProduct) => `${p.name} ${p.slug.replace(/-/g, " ")}`.toLowerCase();

  // Whole phrase contained in the name/slug.
  let hit = products.find((p) => hay(p).includes(term));

  // Otherwise any distinctive word (≥3 chars) of the query.
  if (!hit) {
    const words = term.split(/\s+/).filter((w) => w.length >= 3);
    if (words.length) hit = products.find((p) => words.some((w) => hay(p).includes(w)));
  }

  return hit ? `/products/${encodeURIComponent(hit.slug)}` : null;
}

/**
 * Build the live suggestion list for the current query: nav categories whose
 * label contains the term, then up to six products matching every typed word.
 */
function buildSuggestions(termRaw: string, products: LiteProduct[]): Suggestion[] {
  const term = termRaw.trim().toLowerCase();
  if (term.length < 2) return [];

  const key = slugKey(term);
  const categories: Suggestion[] = brand.header.nav
    .filter((item) => {
      const k = slugKey(item.label);
      return k !== "shopall" && (k.includes(key) || key.includes(k) || item.label.toLowerCase().includes(term));
    })
    .slice(0, 3)
    .map((item) => ({ kind: "category", label: item.label, href: item.href }));

  const words = term.split(/\s+/).filter(Boolean);
  const hay = (p: LiteProduct) => `${p.name} ${p.slug.replace(/-/g, " ")}`.toLowerCase();
  const productMatches = products
    .filter((p) => words.every((w) => hay(p).includes(w)))
    .slice(0, 6)
    .map<Suggestion>((p) => ({
      kind: "product",
      label: p.name,
      href: `/products/${encodeURIComponent(p.slug)}`,
      image: p.image,
      price: p.price,
    }));

  return [...categories, ...productMatches];
}

export function HeaderSearch({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [products, setProducts] = useState<LiteProduct[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const loadingRef = useRef<Promise<LiteProduct[]> | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // Lazily load the (small) catalogue once — on first focus so submit and
  // suggestions are instant, but also awaited on submit if the user is quick.
  const loadProducts = useCallback((): Promise<LiteProduct[]> => {
    if (!loadingRef.current) {
      loadingRef.current = fetch("/api/v1/catalogue/products?limit=100", {
        headers: { accept: "application/json" },
      })
        .then((r) => (r.ok ? r.json() : { items: [] }))
        .then((d) => {
          const items: LiteProduct[] = (d?.items ?? [])
            .filter((p: { slug?: string; name?: string }) => p?.slug && p?.name)
            .map(
              (p: {
                slug: string;
                name: string;
                image_url?: string;
                images?: string[];
                default_price?: Money | string | number | null;
              }) => ({
                slug: p.slug,
                name: p.name,
                image: p.image_url ?? p.images?.[0],
                price: p.default_price != null ? parsePrice(p.default_price) : undefined,
              }),
            );
          setProducts(items);
          return items;
        })
        .catch(() => {
          setProducts([]);
          return [] as LiteProduct[];
        });
    }
    return loadingRef.current;
  }, []);

  const suggestions = useMemo(() => buildSuggestions(q, products), [q, products]);

  // Close the dropdown on an outside click.
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  function go(href: string) {
    setOpen(false);
    setActive(-1);
    router.push(href);
  }

  /** Resolve the raw term the same way a bare submit does (category → product → shop). */
  async function resolveTerm(raw: string) {
    // 1) Category / Sale / Shop All.
    const category = matchCategory(slugKey(raw));
    if (category) return go(category);

    // 2) A specific product → straight to its page.
    const product = matchProduct(raw, await loadProducts());
    if (product) return go(product);

    // 3) Nothing matched — show the full shop.
    go("/");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const raw = q.trim();
    if (!raw) return go("/");
    // Enter on a highlighted suggestion follows that row; otherwise resolve.
    if (open && active >= 0 && suggestions[active]) return go(suggestions[active].href);
    void resolveTerm(raw);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
      return;
    }
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    }
  }

  const showDropdown = open && suggestions.length > 0;

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <form onSubmit={submit} role="search">
        <input
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(-1);
            setOpen(true);
            void loadProducts();
          }}
          onFocus={() => {
            setOpen(true);
            void loadProducts();
          }}
          onKeyDown={onKeyDown}
          placeholder={SEARCH_PLACEHOLDER}
          aria-label="Search products"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="header-search-suggestions"
          aria-activedescendant={active >= 0 ? `header-search-option-${active}` : undefined}
          autoComplete="off"
          className="w-full h-11 rounded-full bg-background text-foreground placeholder:text-muted-foreground pl-5 pr-12 text-sm outline-none border border-transparent transition-colors focus:border-foreground/25"
        />
        <button
          type="submit"
          aria-label="Search"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 grid place-items-center w-8 h-8 rounded-full text-foreground/70 hover:text-foreground transition-colors"
        >
          <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden>
            <circle cx="9" cy="9" r="6" />
            <path d="M14 14l3 3" strokeLinecap="round" />
          </svg>
        </button>
      </form>

      {showDropdown && (
        <ul
          id="header-search-suggestions"
          role="listbox"
          className="absolute left-0 right-0 top-full mt-2 z-40 overflow-hidden rounded-2xl border border-foreground/10 bg-background text-foreground shadow-xl"
        >
          {suggestions.map((s, i) => (
            <li key={`${s.kind}-${s.href}`} role="option" id={`header-search-option-${i}`} aria-selected={i === active}>
              <button
                type="button"
                // onMouseDown (before the input's blur) so the click registers.
                onMouseDown={(e) => {
                  e.preventDefault();
                  go(s.href);
                }}
                onMouseEnter={() => setActive(i)}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  i === active ? "bg-muted" : "hover:bg-muted/60"
                }`}
              >
                {s.kind === "product" ? (
                  <span className="relative h-12 w-9 shrink-0 overflow-hidden rounded-md bg-muted">
                    {s.image && (
                      <Image src={s.image} alt="" fill sizes="36px" className="object-cover" />
                    )}
                  </span>
                ) : (
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-muted text-foreground/60">
                    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                      <circle cx="9" cy="9" r="6" />
                      <path d="M14 14l3 3" strokeLinecap="round" />
                    </svg>
                  </span>
                )}

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-foreground">{s.label}</span>
                  <span className="block text-[11px] text-muted-foreground">
                    {s.kind === "category" ? "Category" : brand.shortName}
                  </span>
                </span>

                {s.kind === "product" && s.price != null && (
                  <span className="shrink-0 text-sm font-semibold text-foreground">{money.format(s.price)}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
