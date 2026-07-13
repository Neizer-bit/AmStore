"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CartIcon } from "@/components/cart-icon";

export type AddStatus = "idle" | "adding" | "added";

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[15px] w-[15px] shrink-0"
    >
      <path d="M4 10.5l4 4 8-9" />
    </svg>
  );
}

/**
 * Full-width pill CTA. Lifts + darkens on hover, presses to 98%, and swaps to
 * a "✓ Added to Cart" state for ~1s before settling back.
 */
export function AddToCartButton({
  status,
  onClick,
  label,
  addedLabel,
}: {
  status: AddStatus;
  onClick: () => void;
  label: string;
  addedLabel: string;
}) {
  const added = status === "added";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={status === "adding"}
      aria-label={label}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 26 }}
      // 48px tall, fully rounded, 16px horizontal padding. Label is 14px on
      // mobile rather than the specified 16px: at 16px the icon + "Add to Cart"
      // measures ~123px against ~119px of card content width in a 2-up grid,
      // so it would overflow (and blow out entirely at a 320px viewport).
      className="flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-foreground px-4 text-[14px] font-semibold text-background transition-colors duration-200 hover:bg-black disabled:opacity-70 md:text-[13px]"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={added ? "added" : "idle"}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className="flex items-center gap-2"
        >
          {added ? <CheckIcon /> : <CartIcon className="h-[15px] w-[15px] shrink-0" />}
          {added ? addedLabel : label}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
