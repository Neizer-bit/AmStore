"use client";

import { useEffect, useRef, useState } from "react";
import { useCartDrawer } from "@cimplify/sdk/react";
import { useCartCount } from "@/lib/cart";

/**
 * Pulses whenever the cart count goes UP. Driven off the live count rather
 * than an event, so any add — quick-add from the grid, the PDP, the sticky
 * bar — animates the bag without those callers knowing about the header.
 */
function useAddedPulse(count: number) {
  const [pulse, setPulse] = useState(false);
  const prev = useRef(count);

  useEffect(() => {
    const grew = count > prev.current;
    prev.current = count;
    if (!grew) return;
    setPulse(true);
    const id = window.setTimeout(() => setPulse(false), 650);
    return () => window.clearTimeout(id);
  }, [count]);

  return pulse;
}

/**
 * Cart pill — dynamic island. Reads the live cart count via the SDK and
 * opens the side cart drawer on click (instead of navigating to /cart).
 * Wrap in `<Suspense fallback={<CartPillSkeleton/>}>` so the cached
 * header chrome streams without blocking on the cart fetch.
 */
export function CartPill() {
  const { count } = useCartCount();
  const { open } = useCartDrawer();
  return (
    <button
      type="button"
      onClick={open}
      aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}
      className="inline-flex items-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-full bg-foreground text-background text-xs font-semibold tracking-wide transition-transform hover:scale-105 cursor-pointer"
    >
      Cart · {count}
    </button>
  );
}

export function CartPillSkeleton() {
  return (
    <span
      aria-hidden
      className="inline-flex items-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-full bg-foreground/80 text-background text-xs font-semibold tracking-wide"
    >
      Cart · …
    </span>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M6 8h12l-1 12H7L6 8z" strokeLinejoin="round" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Icon-style cart button for the dark ASOS header. Same behaviour as CartPill
 * (opens the drawer, live count) but rendered as a bag glyph with a count badge.
 */
export function CartIconButton() {
  const { count } = useCartCount();
  const { open } = useCartDrawer();
  const pulse = useAddedPulse(count);

  return (
    <button
      type="button"
      onClick={open}
      aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}
      className="relative inline-grid place-items-center w-9 h-9 text-current hover:opacity-70 transition-opacity cursor-pointer"
    >
      <span className={pulse ? "cart-pulse inline-grid place-items-center" : "inline-grid place-items-center"}>
        <BagIcon />
      </span>
      {count > 0 && (
        <span className="absolute top-0 right-0 min-w-[16px] h-4 px-1 grid place-items-center rounded-full bg-background text-foreground text-[10px] font-bold leading-none">
          {count}
        </span>
      )}
    </button>
  );
}

export function CartIconSkeleton() {
  return <span aria-hidden className="inline-block w-9 h-9" />;
}
