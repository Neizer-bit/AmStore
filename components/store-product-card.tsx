"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { parsePrice, type Product } from "@cimplify/sdk";
import { useCart } from "@cimplify/sdk/react";
import { brand } from "@/lib/brand";
import { ProductImage } from "@/components/product-card/product-image";
import { ProductInfo } from "@/components/product-card/product-info";
import { SizeSelector } from "@/components/product-card/size-selector";
import { AddToCartButton, type AddStatus } from "@/components/product-card/add-to-cart-button";
import { SizeGuideLink } from "@/components/product-card/size-guide-link";
import { Badge, badgeFor } from "@/components/product-card/badges";
import { Toast } from "@/components/product-card/toast";
import { SizeGuideModal } from "@/components/size-guide-modal";

/**
 * Premium product card.
 *
 * ProductCard
 *  ├── ProductImage      (scales 1.03 while the card is hovered)
 *  ├── Badge             (one editorial tag, if any)
 *  ├── ProductInfo       (semi-bold name clamped to 2 lines, bold price)
 *  ├── SizeSelector      (own state per card, defaults to the first size)
 *  ├── SizeGuideLink     (opens the shared measurement chart)
 *  └── AddToCartButton   (pill CTA → "✓ Added to Cart" → back)
 *
 * Cards sit in a stretched grid, so `h-full` + `mt-auto` on the CTA keeps every
 * card the same height regardless of how long the product name runs.
 */

const money = new Intl.NumberFormat(brand.locale.replace("_", "-"), {
  style: "currency",
  currency: brand.currency,
  maximumFractionDigits: 0,
});

export function StoreProductCard({ product }: { product: Product }) {
  const c = brand.productCard;
  const slug = product.slug || product.id;
  const href = `/products/${encodeURIComponent(slug)}`;
  const img = product.image_url ?? product.images?.[0];
  const price = parsePrice(product.default_price);
  const badge = badgeFor(product.tags);

  const { addItem } = useCart();
  const [hovered, setHovered] = useState(false);
  // Each card owns its size. Defaults to the first available one.
  const [size, setSize] = useState<string | null>(c.sizes[0] ?? null);
  const [status, setStatus] = useState<AddStatus>("idle");
  const [toast, setToast] = useState<string | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);

  const clearToast = useCallback(() => setToast(null), []);

  async function handleAdd() {
    if (status !== "idle") return;

    // Defensive: only reachable if a product ships with no size run at all.
    if (c.sizes.length > 0 && !size) {
      setToast(c.selectSizeToast);
      return;
    }

    setStatus("adding");
    try {
      await addItem(product, 1, size ? { specialInstructions: `Size: ${size}` } : undefined);
      setStatus("added");
      window.setTimeout(() => setStatus("idle"), 1100);
    } catch {
      setStatus("idle");
    }
  }

  return (
    <>
      <motion.article
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        animate={{ y: hovered ? -4 : 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className="flex h-full flex-col overflow-hidden rounded-2xl bg-card shadow-[0_6px_24px_rgba(0,0,0,0.06)]"
      >
        <div className="relative">
          <ProductImage src={img} alt={product.name} href={href} hovered={hovered} />
          {badge && <Badge label={badge} />}
        </div>

        {/* Mobile runs an explicit 4/8/16px spacing scale between blocks rather
            than one uniform gap, so each pair sits at its intended distance.
            Desktop keeps its original uniform `gap-3.5` + `mt-auto`. */}
        <div className="flex flex-1 flex-col p-3.5 md:gap-3.5 md:p-3.5">
          <ProductInfo name={product.name} price={money.format(price)} href={href} />

          {/* Sizes, Size Guide and the CTA share one wrapping flex container, so
              a single copy of each element yields two different layouts:

                mobile   [ S M L XL ] [Size Guide]     desktop   [ S M L XL     ]
                         [   ADD TO CART           ]             [Size Guide][ADD TO CART]

              Mobile: the pills grow (`flex-1`) and the Size Guide sits in the
              gap beside them; the CTA is `basis-full`, so it takes its own row.
              Desktop (unchanged): the pills go `md:basis-full` to claim a whole
              row, pushing the Size Guide and the CTA together onto the next one,
              ordered explicitly. */}
          {/* One copy of each element, two layouts — driven by `display:contents`
              rather than duplicated markup:

                mobile   [ S M L XL ][Size Guide]   desktop   [ S M L XL          ]
                         [    ADD TO CART       ]             [Size Guide][ADD TO CART]

              Mobile: this is a wrapping flex row. The pills grow, the Size Guide
              takes the gap beside them, and the CTA is `basis-full` so it drops
              to its own line.
              Desktop: `md:contents` dissolves this wrapper and `md:flex` re-forms
              the inner one, handing the column back the exact child structure it
              had before — pills on their own, then Size Guide + CTA on one row,
              bottom-pinned by `mt-auto` so every card's CTA aligns. */}
          <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2.5 md:mt-0 md:contents">
            {/* `min-w-fit` is the guard. With `min-w-0` the pill run was
                compressible, so in the narrow landing rail the Size Guide won
                the row and squeezed the four pills into five stacked lines.
                Refusing to shrink below their content means the pills always
                hold one clean row, and it's the Size Guide that wraps beneath
                them when a card is too narrow to seat both. */}
            <div className="min-w-fit flex-1 md:flex-none">
              <SizeSelector sizes={c.sizes} selected={size} onSelect={setSize} idBase={product.id} />
            </div>

            <div className="contents md:mt-auto md:flex md:items-center md:gap-2 md:pt-0.5">
              <div className="shrink-0">
                <SizeGuideLink onOpen={() => setGuideOpen(true)} />
              </div>
              <div className="basis-full md:min-w-[8.5rem] md:flex-1 md:basis-auto">
                <AddToCartButton
                  status={status}
                  onClick={handleAdd}
                  label={c.addToCartLabel}
                  addedLabel={c.addedLabel}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.article>

      <SizeGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
      <Toast message={toast} onDone={clearToast} />
    </>
  );
}
