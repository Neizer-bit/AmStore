"use client";

import { motion } from "framer-motion";

/**
 * Inline size run on the card. Selected inverts to solid charcoal; the rest
 * are white pills with a hairline border that darkens on hover.
 */
export function SizeSelector({
  sizes,
  selected,
  onSelect,
  idBase,
}: {
  sizes: string[];
  selected: string | null;
  onSelect: (size: string) => void;
  idBase: string;
}) {
  if (sizes.length === 0) return null;

  return (
    <div
      role="group"
      aria-label="Select a size"
      // One intrinsic row at every width. The old mobile 4-up grid existed to
      // stop wrapping inside a cramped 2-column card; the mobile grid is
      // single-column now, so stretched full-width pills would just look
      // distended. Same treatment as desktop, with a 36px touch height.
      className="flex flex-wrap items-center gap-2"
    >
      {sizes.map((size) => {
        const active = size === selected;
        return (
          <motion.button
            key={`${idBase}-${size}`}
            type="button"
            onClick={() => onSelect(size)}
            aria-pressed={active}
            aria-label={`Size ${size}`}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
            className={`grid h-9 min-w-9 place-items-center rounded-full border px-3 text-[13px] leading-none transition-colors duration-200 md:min-w-9 md:px-2 md:text-[12px] ${
              active
                ? "border-foreground bg-foreground text-background font-semibold"
                : "border-foreground/20 bg-background text-foreground hover:border-foreground"
            }`}
          >
            {size}
          </motion.button>
        );
      })}
    </div>
  );
}
