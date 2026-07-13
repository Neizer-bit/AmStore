"use client";

import { AnimatePresence, motion } from "framer-motion";

export type AddStatus = "idle" | "adding" | "added";

/**
 * Full-width pill CTA — type only, no icon.
 *
 * House style follows the PDP button and the luxury houses it's modelled on
 * (COS, Toteme, Jacquemus): a slim bar of small, wide-tracked uppercase text.
 * The cart glyph read as utility-app rather than boutique, and it was stealing
 * width from the label on a 2-up mobile card. Swaps to "Added" for ~1s.
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
      className="flex h-10 w-full items-center justify-center whitespace-nowrap rounded-full bg-foreground px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-background transition-colors duration-200 hover:bg-black disabled:opacity-70 md:h-9 md:text-[10px]"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={added ? "added" : "idle"}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
        >
          {added ? addedLabel : label}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
