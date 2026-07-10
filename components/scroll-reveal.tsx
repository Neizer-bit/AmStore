"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Toggles `.is-visible` on any `[data-reveal]` element as it scrolls into
 * view, driving the CSS fade-and-rise transition (see globals.css). Re-scans
 * on route change and watches for late-mounted nodes (Suspense/streamed grids).
 * No-ops under prefers-reduced-motion. Renders nothing.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    const observeAll = () => {
      document.querySelectorAll("[data-reveal]:not(.is-visible)").forEach((el) => io.observe(el));
    };
    observeAll();

    // Catch nodes that mount after first paint (streamed Suspense boundaries).
    const mo = new MutationObserver(() => observeAll());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
