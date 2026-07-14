/**
 * Backdrop colour of each photo — the beige the garment or model was shot on.
 *
 * Used wherever a shot is rendered with `object-contain` (the mobile product
 * card, the desktop hero). Contain letterboxes, and these shots were taken
 * under different light, so one shared fill colour bands visibly. Painting each
 * frame in its OWN photo's beige makes the letterbox disappear.
 *
 * GENERATED — median of 160 edge pixels per image, sampled in Chromium.
 * Re-run the sampler if the imagery changes; unknown paths fall back to
 * BACKDROP_FALLBACK, the median of the set.
 */
export const PHOTO_BACKDROPS: Record<string, string> = {
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
  "/hero/1.jpg": "#ebccab",
  "/hero/2.jpg": "#e7c49f",
  "/hero/3.jpg": "#e6bf99",
  "/hero/4.jpg": "#e1b990",
  "/hero/5.jpg": "#ebd1b7",
};

/** Median backdrop across all photos — used for any image not in the map. */
export const BACKDROP_FALLBACK = "#e5c4a2";

/** Resolve a photo's backdrop, tolerating query strings and absolute URLs. */
export function backdropFor(src?: string): string {
  if (!src) return BACKDROP_FALLBACK;
  const path = src.split("?")[0];
  const key = Object.keys(PHOTO_BACKDROPS).find((k) => path.endsWith(k));
  return key ? PHOTO_BACKDROPS[key] : BACKDROP_FALLBACK;
}
