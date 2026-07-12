/**
 * Shopping-trolley glyph — the single source for the cart mark, used by the
 * header bag and the Add-to-Cart CTAs so they never drift apart.
 *
 * Drawn as a thin, open line-art trolley (handle → basket rail → two wheels).
 * The reference art fills the basket with a grid; at 16–22px those dividers
 * turn to mush, so the basket is left open — it reads cleaner and more
 * couture at the sizes we actually render.
 */
export function CartIcon({ className = "h-[22px] w-[22px]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="1.45"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Handle, up-rail and basket. */}
      <path d="M2.4 2.6h2.05l2.63 12.3a1.85 1.85 0 0 0 1.81 1.46h9.06a1.85 1.85 0 0 0 1.8-1.43L21.6 7.7H5.5" />
      {/* Wheels. */}
      <circle cx="9.35" cy="20.3" r="1.4" />
      <circle cx="18.15" cy="20.3" r="1.4" />
    </svg>
  );
}
