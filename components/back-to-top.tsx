"use client";

import { useEffect, useState } from "react";

/**
 * Floating "back to top" button. Fades/scales in once you've scrolled a screen
 * or so, and smooth-scrolls home on click (honouring prefers-reduced-motion).
 */
export function BackToTop() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setShown(window.scrollY > window.innerHeight * 0.9);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  function toTop() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      tabIndex={shown ? 0 : -1}
      // Desktop only. On a phone it parked itself over the bottom-right of a
      // product card and swallowed taps meant for that card's Size Guide and
      // Add to Cart — verified in Chromium. A floating button always covers
      // *something*, and on mobile the thing it covers is the buy flow. Phones
      // scroll fine without it; fashion apps don't ship one.
      className={`fixed bottom-6 right-6 z-50 hidden h-11 w-11 place-items-center rounded-full bg-foreground text-background shadow-lg transition-all duration-300 ease-out hover:opacity-85 sm:grid ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <svg viewBox="0 0 16 16" aria-hidden className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M8 13V3m0 0L3.5 7.5M8 3l4.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
