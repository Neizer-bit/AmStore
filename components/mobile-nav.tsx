"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { brand } from "@/lib/brand";

/**
 * Hamburger button + slide-in drawer for narrow viewports. Header hides
 * its inline nav links below `sm` and renders this in their place; the
 * cart pill stays in the header chrome.
 *
 * The drawer is portalled to <body>. The header is a `sticky z-*` element,
 * which creates a stacking context — so a drawer rendered inside it can never
 * paint above page content that sits higher in the root context (the hero's
 * caption layer would show straight through it). Portalling lifts the drawer
 * into the root stacking context, where its z-index actually means something.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const drawer = (
    <div className="fixed inset-0 z-[90] sm:hidden">
      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-label="Close menu"
        className="absolute inset-0 bg-background/90 backdrop-blur-sm"
      />
      <nav
        id="mobile-nav-drawer"
        aria-label="Mobile navigation"
        className="absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col bg-background shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 py-5">
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Menu
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="-mr-3 grid h-11 w-11 place-items-center text-foreground transition-opacity hover:opacity-60"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Category names in serif, separated by 1px hairlines. */}
        <ul className="m-0 flex list-none flex-col border-t border-border p-0">
          {brand.header.nav.map((link) => (
            <li key={link.href} className="border-b border-border">
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-6 py-5 transition-colors hover:bg-muted/50"
              >
                <span className="[font-family:var(--font-display)] text-2xl font-medium text-foreground">
                  {link.label}
                </span>
                <svg
                  viewBox="0 0 12 12"
                  aria-hidden
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3 text-foreground/35"
                >
                  <path d="M3 6h6m0 0L6.5 3.5M9 6l-2.5 2.5" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        className="grid place-items-center w-11 h-11 -mr-2 rounded-md text-inherit hover:bg-background/10 transition-colors"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {open && mounted ? createPortal(drawer, document.body) : null}
    </>
  );
}
