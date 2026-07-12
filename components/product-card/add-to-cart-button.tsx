"use client";

import { AnimatePresence, motion } from "framer-motion";

export type AddStatus = "idle" | "adding" | "added";

function BagIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="h-[15px] w-[15px] shrink-0"
    >
      <path d="M6 8h12l-1 12H7L6 8z" strokeLinejoin="round" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" strokeLinecap="round" />
    </svg>
  );
}

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
      className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-4 text-[13px] font-semibold text-background transition-colors duration-200 hover:bg-black disabled:opacity-70"
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
          {added ? <CheckIcon /> : <BagIcon />}
          {added ? addedLabel : label}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
