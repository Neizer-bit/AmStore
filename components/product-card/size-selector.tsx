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
      // Mobile: an even 4-up grid. A 2-column card only leaves ~119px of
      // content width, so four 36px pills plus gaps (~168px) could never fit on
      // one line — they wrapped every time. Letting them share the row equally
      // keeps the 36px touch height, kills the wrap, and lines them up exactly.
      // Desktop cards are wide enough, so they keep the original flex-wrap.
      className="grid grid-cols-4 gap-1.5 md:flex md:flex-wrap md:items-center"
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
            className={`grid h-9 w-full place-items-center rounded-full border text-[14px] leading-none transition-colors duration-200 md:w-auto md:min-w-9 md:px-2 md:text-[12px] ${
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
