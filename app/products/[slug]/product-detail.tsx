"use client";

import Link from "next/link";
import { useState } from "react";
import { parsePrice, type Product, type ProductWithDetails } from "@cimplify/sdk";
import { useCart } from "@cimplify/sdk/react";
import { ProductGallery } from "@/components/product-gallery";
import { SizeGuideModal } from "@/components/size-guide-modal";
import { SizeSheet, type SizeOption } from "@/components/size-sheet";
import { StoreProductCard } from "@/components/store-product-card";
import { brand } from "@/lib/brand";

/**
 * Product detail page — a custom split-screen layout (the SDK's <ProductPage>
 * exposes no slots for this structure, so it's replaced wholesale).
 *
 * Left: the media column, scrolls. Right: the buy column, sticky on desktop.
 *
 * Add-to-cart defers rather than guesses: no size is pre-selected, so tapping
 * the CTA without one opens a bottom sheet, and picking a size completes the
 * add. The header bag pulses off the cart count, so this file doesn't need to
 * know the header exists.
 *
 * Sizes: products carry no real variants yet, so we fall back to a standard
 * size run and record the choice on the cart line via `specialInstructions`.
 * The moment products gain variants, wire `variantId` instead.
 */

const money = new Intl.NumberFormat(brand.locale.replace("_", "-"), {
  style: "currency",
  currency: brand.currency,
  minimumFractionDigits: 2,
});

type Status = "idle" | "adding" | "added";

export function ProductDetail({
  product,
  related,
}: {
  product: ProductWithDetails;
  related: Product[];
}) {
  const { addItem } = useCart();
  const p = brand.pdp;

  const images = (product.images?.length ? product.images : [product.image_url]).filter(
    (src): src is string => Boolean(src),
  );
  const price = parsePrice(product.default_price);

  // Real variants win; otherwise fall back to the standard size run.
  const variantSizes = product.variants?.map((v) => ({ id: v.id, label: v.name ?? v.sku ?? "" })) ?? [];
  const sizes: SizeOption[] =
    variantSizes.length > 0 ? variantSizes : p.sizes.map((s) => ({ id: "", label: s }));

  // Nothing pre-selected — the shopper must choose, or the sheet asks them to.
  const [sizeIdx, setSizeIdx] = useState(-1);
  const selected = sizeIdx >= 0 ? sizes[sizeIdx] : null;

  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState<Status>("idle");
  const [wished, setWished] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [pendingAdd, setPendingAdd] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  /** Perform the add for a known size. */
  async function commit(size: SizeOption | null) {
    if (status !== "idle") return;
    setStatus("adding");
    try {
      await addItem(product, qty, {
        ...(size?.id ? { variantId: size.id } : {}),
        ...(size?.label ? { specialInstructions: `${p.sizeLabel}: ${size.label}` } : {}),
      });
      setStatus("added");
      window.setTimeout(() => setStatus("idle"), 1800);
    } catch {
      setStatus("idle");
    }
  }

  /** CTA entry point: ask for a size first if one is still needed. */
  function request() {
    if (sizes.length > 0 && !selected) {
      setPendingAdd(true);
      setSheetOpen(true);
      return;
    }
    void commit(selected);
  }

  /** Sheet selection resumes the add the shopper originally tapped. */
  function pickSize(i: number) {
    setSizeIdx(i);
    setSheetOpen(false);
    if (pendingAdd) {
      setPendingAdd(false);
      void commit(sizes[i]);
    }
  }

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url });
        return;
      } catch {
        /* user dismissed — fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <>
      <section className="max-w-7xl mx-auto px-6 sm:px-10 py-12 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
          {/* ── Media ───────────────────────────────────────────── */}
          <ProductGallery images={images} alt={product.name} />

          {/* ── Buy column (sticky on desktop) ──────────────────── */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h1 className="m-0 text-[clamp(1.75rem,3vw,2.5rem)] text-foreground">{product.name}</h1>

            <p className="mt-4 text-2xl leading-loose text-foreground">{money.format(price)}</p>

            {product.description && (
              <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            )}

            <hr className="my-9 border-border" />

            {/* Size */}
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground">
                {p.sizeLabel}
              </span>
              <button
                type="button"
                onClick={() => setGuideOpen(true)}
                className="text-[13px] text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
              >
                {p.sizeGuideLabel}
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2.5">
              {sizes.map((s, i) => (
                <button
                  key={s.label + i}
                  type="button"
                  onClick={() => setSizeIdx(i)}
                  aria-pressed={i === sizeIdx}
                  className={`h-12 min-w-[3.5rem] border px-4 text-sm transition-colors duration-200 ${
                    i === sizeIdx
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-foreground hover:border-foreground"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Quantity + purchase actions: stepper on the left, the two CTAs
                stacked beside it. */}
            <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground">
              {p.quantityLabel}
            </p>
            <div className="mt-4 flex items-start gap-4">
              <div className="inline-flex shrink-0 items-center border border-border">
                <QtyButton label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  −
                </QtyButton>
                <span className="w-9 text-center text-sm tabular-nums text-foreground">{qty}</span>
                <QtyButton label="Increase quantity" onClick={() => setQty((q) => Math.min(99, q + 1))}>
                  +
                </QtyButton>
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                <button
                  type="button"
                  onClick={request}
                  disabled={status !== "idle"}
                  className="w-full rounded-full bg-foreground px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-background transition-opacity duration-200 hover:opacity-85 disabled:opacity-60"
                >
                  {ctaLabel(status, p.addToCartLabel)}
                </button>

              </div>
            </div>

            {/* Micro-actions */}
            <div className="mt-6 flex items-center gap-8">
              <button
                type="button"
                onClick={() => setWished((v) => !v)}
                aria-pressed={wished}
                className="inline-flex items-center gap-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`h-4 w-4 ${wished ? "fill-foreground stroke-foreground" : "fill-none stroke-current"}`}
                >
                  <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                {p.wishlistLabel}
              </button>

              <button
                type="button"
                onClick={share}
                className="inline-flex items-center gap-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <circle cx="18" cy="5" r="2.5" />
                  <circle cx="6" cy="12" r="2.5" />
                  <circle cx="18" cy="19" r="2.5" />
                  <path d="M8.2 10.8l7.6-4.1M8.2 13.2l7.6 4.1" />
                </svg>
                {copied ? p.shareCopiedLabel : p.shareLabel}
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ── You may also like ─────────────────────────────────── */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto border-t border-border px-6 sm:px-10 py-16 sm:py-24">
          <div className="mb-10 flex items-baseline justify-between gap-6">
            <h2 className="m-0 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground [font-family:var(--font-sans)]">
              {brand.pdp.relatedTitle}
            </h2>
            <Link
              href="/shop"
              className="text-[13px] text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-8 sm:gap-y-20">
            {related.map((r) => (
              <StoreProductCard key={r.id} product={r} />
            ))}
          </div>
        </section>
      )}

      {/* Measurement chart. */}
      <SizeGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />

      {/* Contextual size prompt. */}
      <SizeSheet
        open={sheetOpen}
        sizes={sizes}
        onPick={pickSize}
        onClose={() => {
          setSheetOpen(false);
          setPendingAdd(false);
        }}
      />
    </>
  );
}

/** Loading → Added → back to rest. */
function ctaLabel(status: Status, rest: string) {
  if (status === "adding") return "Adding…";
  if (status === "added") return "Added";
  return rest;
}

function QtyButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-11 w-10 place-items-center text-base text-foreground transition-colors hover:bg-muted"
    >
      {children}
    </button>
  );
}
