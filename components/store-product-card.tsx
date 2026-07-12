"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { parsePrice, type Product } from "@cimplify/sdk";
import { useCart } from "@cimplify/sdk/react";
import { brand } from "@/lib/brand";
import { ProductImage } from "@/components/product-card/product-image";
import { WishlistButton } from "@/components/product-card/wishlist-button";
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
 *  ├── WishlistButton    (spring-pop fill)
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
  const [wished, setWished] = useState(false);
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
          <WishlistButton
            wished={wished}
            onToggle={() => setWished((v) => !v)}
            label={product.name}
          />
        </div>

        <div className="flex flex-1 flex-col gap-3.5 p-3.5">
          <ProductInfo name={product.name} price={money.format(price)} href={href} />

          <SizeSelector sizes={c.sizes} selected={size} onSelect={setSize} idBase={product.id} />

          <SizeGuideLink onOpen={() => setGuideOpen(true)} />

          {/* mt-auto pins the CTA to the bottom so cards stay equal height. */}
          <div className="mt-auto pt-0.5">
            <AddToCartButton
              status={status}
              onClick={handleAdd}
              label={c.addToCartLabel}
              addedLabel={c.addedLabel}
            />
          </div>
        </div>
      </motion.article>

      <SizeGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
      <Toast message={toast} onDone={clearToast} />
    </>
  );
}
