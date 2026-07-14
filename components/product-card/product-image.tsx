"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { brand } from "@/lib/brand";

/**
 * Card media.
 *
 * The catalogue is flat studio product shots on a single tan backdrop — no
 * model, no scene — so left alone they sit dead-flat on the card. Four things
 * give them the depth the photography doesn't:
 *
 *  - a **vignette**, always on. It's what separates the garment from the
 *    backdrop and stops the tile reading as a pasted-on rectangle.
 *  - a **slow push-in** on hover: 1.06 over 1.2s on the same ease the category
 *    tiles use. A fast zoom reads as a UI hover; a slow one reads couture.
 *  - a **sheen** that sweeps across the fabric once per hover — the trick the
 *    fashion houses use to make a still shot feel like satin.
 *  - a **View** line rising from the bottom edge, so the image is visibly a way
 *    into the product rather than decoration.
 *
 * Hover state is driven by the parent's `hovered` prop so the whole card
 * animates as a single gesture. Everything is transform/opacity — GPU only, no
 * layout work — and on touch, where there is no hover, the vignette still
 * carries the depth.
 */
export function ProductImage({
  src,
  alt,
  href,
  hovered,
  pressed = false,
}: {
  src?: string;
  alt: string;
  href: string;
  hovered: boolean;
  /** Touch-only press from the parent card. */
  pressed?: boolean;
}) {
  const EASE = [0.16, 1, 0.3, 1] as const;
  const active = hovered || pressed;

  return (
    <Link href={href} aria-label={alt} className="block">
      <div className="relative aspect-square w-full overflow-hidden bg-muted md:aspect-[3/4]">
        {src ? (
          <motion.div
            className="absolute inset-0"
            // The press answers immediately (0.45s) — a touch that takes 1.2s to
            // respond feels broken. Hover keeps its slow couture pace.
            animate={{ scale: hovered ? 1.06 : pressed ? 1.04 : 1 }}
            transition={{ duration: pressed ? 0.45 : 1.2, ease: EASE }}
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
              className="object-cover"
            />
          </motion.div>
        ) : (
          <div className="grid h-full w-full place-items-center text-xs text-muted-foreground">
            No image
          </div>
        )}

        {/* Vignette — the single biggest lift on a flat backdrop. Always on, so
            touch gets it too; it deepens a touch under the cursor. */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_50%,rgba(0,0,0,0.14)_100%)]"
          animate={{ opacity: active ? 1 : 0.75 }}
          transition={{ duration: pressed ? 0.35 : 0.6, ease: EASE }}
        />

        {/* Sheen: a soft band of light drawn across the garment on hover. */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={false}
          animate={{ x: hovered ? "260%" : "-120%" }}
          transition={{ duration: hovered ? 1.1 : 0, ease: EASE }}
        />

        {/* "View" — rises from the bottom edge with a hairline above it. */}
        <motion.div
          aria-hidden
          data-view-affordance
          className="pointer-events-none absolute inset-x-0 bottom-0 hidden flex-col items-center pb-4 md:flex"
          initial={false}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <span className="mb-1.5 block h-px w-6 bg-white/80" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]">
            {brand.productCard.viewLabel}
          </span>
        </motion.div>
      </div>
    </Link>
  );
}
