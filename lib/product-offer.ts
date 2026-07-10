import { parsePrice, type ProductWithDetails } from "@cimplify/sdk";

const IN_STOCK = "https://schema.org/InStock";
const OUT_OF_STOCK = "https://schema.org/OutOfStock";

interface SaleOverlay {
  price: string | number;
  ends_at: string;
  // Present only for capped, claims-driven sales, whose price moves per purchase.
  cap?: { claimed: number; of: number } | null;
}

export interface ProductOffer {
  "@type": "Offer";
  price: number;
  priceCurrency: string;
  priceValidUntil?: string;
  availability: string;
  url: string;
}

/**
 * schema.org Offer for a product page. Indexes the price a shopper actually
 * sees: a scheduled/time sale carries the sale price plus a validity window; a
 * capped (claims-driven) sale keeps the base price out of the index, since its
 * number moves on every purchase and would mismatch the product feed.
 */
export function buildProductOffer(
  product: ProductWithDetails & { sale?: SaleOverlay | null },
  opts: { url: string; currency: string },
): ProductOffer {
  const inStock = product.inventory_status?.in_stock !== false;
  const sale = product.sale;
  const indexableSale = sale && !sale.cap ? sale : null;
  const offer: ProductOffer = {
    "@type": "Offer",
    price: parsePrice(indexableSale ? indexableSale.price : product.default_price),
    priceCurrency: opts.currency,
    availability: inStock ? IN_STOCK : OUT_OF_STOCK,
    url: opts.url,
  };
  if (indexableSale) {
    offer.priceValidUntil = indexableSale.ends_at;
  }
  return offer;
}
