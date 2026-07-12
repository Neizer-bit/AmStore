"use client";

import { motion } from "framer-motion";

/**
 * Wishlist heart, top-right of the image. Scales on hover; fills with a spring
 * pop when tapped.
 */
export function WishlistButton({
  wished,
  onToggle,
  label,
}: {
  wished: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      aria-label={wished ? `Remove ${label} from wishlist` : `Add ${label} to wishlist`}
      aria-pressed={wished}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.88 }}
      transition={{ type: "spring", stiffness: 500, damping: 15 }}
      className="absolute right-2.5 top-2.5 z-10 grid h-9 w-9 place-items-center"
    >
      <motion.svg
        viewBox="0 0 24 24"
        aria-hidden
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        // The spring "pop" on fill.
        animate={wished ? { scale: [1, 1.35, 1] } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 12 }}
        className={`h-[22px] w-[22px] [filter:drop-shadow(0_1px_1px_rgba(0,0,0,0.12))] transition-colors duration-200 ${
          wished ? "fill-foreground stroke-foreground" : "fill-none stroke-foreground/70"
        }`}
      >
        <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </motion.svg>
    </motion.button>
  );
}
