/**
 * Backdrop colour of each product photo — the beige the garment was shot on.
 *
 * The mobile card renders the photo with `object-contain` so no part of the
 * garment is ever cropped; that letterboxes, and these shots were taken under
 * different light (their backdrops span #dab790 to #edddc6), so one flat fill
 * would band visibly on nearly every card. Painting each frame in its OWN
 * photo's beige makes the letterbox disappear.
 *
 * GENERATED — median of 160 edge pixels per image, sampled in Chromium.
 * Regenerate if the catalogue imagery changes; unknown paths fall back to
 * BACKDROP_FALLBACK, which is the median of the set.
 */
export const PRODUCT_BACKDROPS: Record<string, string> = {
  "/products/1.jpg": "#dbb892",
  "/products/10.jpg": "#ebcdaa",
  "/products/11.jpg": "#dfbd98",
  "/products/2.jpg": "#dcbb97",
  "/products/3.jpg": "#d9ba99",
  "/products/4.jpg": "#dfc2a2",
  "/products/5.jpg": "#e0c6ab",
  "/products/6.jpg": "#e1c4a2",
  "/products/7.jpg": "#eaceae",
  "/products/8.jpg": "#e5ccb0",
  "/products/9.jpg": "#ebdbc3",
};

/** Median backdrop across the catalogue — used for any image not in the map. */
export const BACKDROP_FALLBACK = "#e0c4a2";

/** Resolve a photo's backdrop, tolerating query strings and absolute URLs. */
export function backdropFor(src?: string): string {
  if (!src) return BACKDROP_FALLBACK;
  const path = src.split("?")[0];
  const key = Object.keys(PRODUCT_BACKDROPS).find((k) => path.endsWith(k));
  return key ? PRODUCT_BACKDROPS[key] : BACKDROP_FALLBACK;
}
