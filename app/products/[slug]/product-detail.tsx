"use client";

import Link from "next/link";
import { useState } from "react";
import { parsePrice, type Product, type ProductWithDetails } from "@cimplify/sdk";
import { useCart } from "@cimplify/sdk/react";
import { ProductGallery } from "@/components/product-gallery";
import { SizeGuideModal } from "@/components/size-guide-modal";
import { TapeMeasureIcon } from "@/components/tape-measure-icon";
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
      <section className="max-w-7xl mx-auto px-5 sm:px-10 py-4 sm:py-12">
        <div className="grid gap-5 sm:gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20">
          {/* ── Media ───────────────────────────────────────────── */}
          <ProductGallery images={images} alt={product.name} />

          {/* ── Buy column (sticky on desktop) ──────────────────── */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <h1 className="m-0 text-[20px] leading-[1.2] text-foreground sm:text-[clamp(1.5rem,2.2vw,2rem)]">
              {product.name}
            </h1>

            <p className="mt-1.5 text-[17px] text-foreground sm:mt-3 sm:text-xl">
              {money.format(price)}
            </p>

            {product.description && (
              // Clamped to two lines on mobile: the full blurb runs four lines on
              // a phone and was, on its own, pushing Add to Cart below the fold.
              <p className="mt-2.5 line-clamp-2 max-w-md text-[13px] leading-relaxed text-muted-foreground sm:mt-4 sm:line-clamp-none sm:text-[15px]">
                {product.description}
              </p>
            )}

            <hr className="my-3.5 border-border sm:my-6" />

            {/* Size */}
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground">
                {p.sizeLabel}
              </span>
              <button
                type="button"
                onClick={() => setGuideOpen(true)}
                className="relative inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors before:absolute before:-inset-x-1 before:-inset-y-2.5 before:content-[''] hover:text-foreground sm:before:hidden"
              >
                <TapeMeasureIcon className="h-4 w-4 shrink-0" />
                <span className="underline underline-offset-4">{p.sizeGuideLabel}</span>
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {sizes.map((s, i) => (
                <button
                  key={s.label + i}
                  type="button"
                  onClick={() => setSizeIdx(i)}
                  aria-pressed={i === sizeIdx}
                  className={`h-10 min-w-[3rem] border px-3.5 text-[13px] transition-colors duration-200 ${
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
            <p className="mt-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground sm:mt-6">
              {p.quantityLabel}
            </p>
            <div className="mt-2.5 flex items-start gap-3 sm:mt-3">
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
                  className="w-full rounded-full bg-foreground px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-background transition-opacity duration-200 hover:opacity-85 disabled:opacity-60"
                >
                  {ctaLabel(status, p.addToCartLabel)}
                </button>

              </div>
            </div>

            {/* Micro-actions */}
            <div className="mt-3.5 flex items-center gap-8 sm:mt-5">
              <button
                type="button"
                onClick={share}
                className="relative inline-flex items-center gap-2 text-[13px] text-muted-foreground transition-colors before:absolute before:-inset-x-1 before:-inset-y-2.5 before:content-[''] hover:text-foreground sm:before:hidden"
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
        <section className="max-w-7xl mx-auto border-t border-border px-5 sm:px-10 py-12 sm:py-24">
          <div className="mb-5 flex items-baseline justify-between gap-6 sm:mb-10">
            <h2 className="m-0 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground [font-family:var(--font-sans)]">
              {brand.pdp.relatedTitle}
            </h2>
            <Link
              href="/shop"
              className="relative inline-flex items-center text-[13px] text-muted-foreground underline underline-offset-4 transition-colors before:absolute before:-inset-x-2 before:-inset-y-2.5 before:content-[''] hover:text-foreground sm:before:hidden"
            >
              View all
            </Link>
          </div>

          {/* Mobile: a horizontal snap-rail. Stacked one-per-row, four suggestions
              ran ~2,200px deep — nobody scrolls that far past the thing they came
              for. Swiping sideways keeps the whole set within a thumb's reach, and
              the next card peeks in to advertise there's more. The rail bleeds to
              the screen edge (-mx/px pair) while the first card stays aligned to
              the copy above it. From sm: up the original grid is restored. */}
          <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-20 sm:overflow-visible sm:px-0 sm:pb-0 md:grid-cols-3 lg:grid-cols-4">
            {related.map((r) => (
              <div key={r.id} className="w-[75%] shrink-0 snap-start sm:w-auto sm:shrink">
                <StoreProductCard product={r} />
              </div>
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
      className="grid h-10 w-9 place-items-center text-base text-foreground transition-colors hover:bg-muted"
    >
      {children}
    </button>
  );
}
