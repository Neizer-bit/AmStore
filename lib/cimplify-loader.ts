import type { ImageLoader } from "next/image";

import { assetUrl, isCimplifyAsset } from "@cimplify/sdk";

const cdnBase = process.env.NEXT_PUBLIC_CIMPLIFY_CDN_URL?.trim() || undefined;

const cimplifyImageLoader: ImageLoader = ({ src, width, quality }) => {
  // Local /public assets (our own product photos, logo) are served as-is —
  // never rewritten to the Cimplify asset CDN, which doesn't host them.
  if (
    src.startsWith("/products/") ||
    src.startsWith("/hero/") ||
    src.startsWith("/logo") ||
    src.startsWith("/brand/")
  ) {
    return src;
  }
  if (isCimplifyAsset(src, cdnBase)) {
    return assetUrl(src, {
      base: cdnBase,
      w: width,
      quality,
      format: "auto",
    });
  }
  return src;
};

export default cimplifyImageLoader;
