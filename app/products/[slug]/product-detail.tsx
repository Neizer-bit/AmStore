"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { parsePrice, type Product, type ProductWithDetails } from "@cimplify/sdk";
import { useCart } from "@cimplify/sdk/react";
import { ProductGallery } from "@/components/product-gallery";
import { StoreProductCard } from "@/components/store-product-card";
import { brand } from "@/lib/brand";

/**
 * Product detail page — a custom split-screen layout (the SDK's <ProductPage>
 * exposes no slots for this structure, so it's replaced wholesale).
 *
 * Left: the media column, scrolls. Right: the buy column, sticky on desktop.
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

const TRUST_ICONS: Record<string, React.ReactNode> = {
  shipping: (
    <>
      <path d="M2 7h11v9H2z" />
      <path d="M13 10h4l3 3v3h-7z" />
      <circle cx="6" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </>
  ),
  returns: (
    <>
      <path d="M4 9a8 8 0 1 1 1.2 6" />
      <path d="M3 5v4h4" />
    </>
  ),
  secure: (
    <>
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
};

type Status = "idle" | "adding" | "added";

export function ProductDetail({
  product,
  related,
}: {
  product: ProductWithDetails;
  related: Product[];
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const p = brand.pdp;

  const images = (product.images?.length ? product.images : [product.image_url]).filter(
    (src): src is string => Boolean(src),
  );
  const price = parsePrice(product.default_price);

  // Real variants win; otherwise fall back to the standard size run.
  const variantSizes = product.variants?.map((v) => ({ id: v.id, label: v.name ?? v.sku ?? "" })) ?? [];
  const sizes = variantSizes.length > 0 ? variantSizes : p.sizes.map((s) => ({ id: "", label: s }));
  const [sizeIdx, setSizeIdx] = useState(() => Math.min(2, sizes.length - 1)); // default to "M"
  const selected = sizes[sizeIdx];

  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState<Status>("idle");
  const [wished, setWished] = useState(false);
  const [copied, setCopied] = useState(false);

  async function add() {
    if (status !== "idle") return;
    setStatus("adding");
    try {
      await addItem(product, qty, {
        ...(selected?.id ? { variantId: selected.id } : {}),
        ...(selected?.label ? { specialInstructions: `${p.sizeLabel}: ${selected.label}` } : {}),
      });
      setStatus("added");
      window.setTimeout(() => setStatus("idle"), 1800);
      return true;
    } catch {
      setStatus("idle");
      return false;
    }
  }

  async function buyNow() {
    const ok = await add();
    if (ok) router.push("/checkout");
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
              <Link
                href={p.sizeGuideHref}
                className="text-[13px] text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
              >
                {p.sizeGuideLabel}
              </Link>
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
                  onClick={add}
                  disabled={status !== "idle"}
                  className="w-full rounded-full bg-foreground px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-background transition-opacity duration-200 hover:opacity-85 disabled:opacity-60"
                >
                  {status === "added"
                    ? "Added to cart"
                    : status === "adding"
                      ? "Adding…"
                      : p.addToCartLabel}
                </button>

                <button
                  type="button"
                  onClick={buyNow}
                  disabled={status !== "idle"}
                  className="w-full rounded-full border border-foreground/30 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground transition-colors duration-200 hover:bg-foreground hover:text-background disabled:opacity-60"
                >
                  {p.buyNowLabel}
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

            {/* Trust badges */}
            <hr className="my-9 border-border" />
            <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-3 sm:gap-4">
              {p.trust.map((t) => (
                <li key={t.title} className="flex items-start gap-3">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-0.5 h-5 w-5 shrink-0 text-foreground/70"
                  >
                    {TRUST_ICONS[t.iconKey]}
                  </svg>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold text-foreground">{t.title}</span>
                    <span className="block text-[12px] leading-snug text-muted-foreground">{t.body}</span>
                  </span>
                </li>
              ))}
            </ul>
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
          <div className="grid grid-cols-2 gap-x-5 gap-y-14 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-8 sm:gap-y-20">
            {related.map((r) => (
              <StoreProductCard key={r.id} product={r} />
            ))}
          </div>
        </section>
      )}
    </>
  );
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
