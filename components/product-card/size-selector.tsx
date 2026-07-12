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
    <div role="group" aria-label="Select a size" className="flex flex-wrap items-center gap-1.5">
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
            className={`grid h-9 min-w-9 place-items-center rounded-full border px-2 text-[12px] leading-none transition-colors duration-200 ${
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
