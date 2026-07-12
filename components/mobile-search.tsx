"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { HeaderSearch } from "./header-search";

/**
 * Mobile search: a magnifier in the header bar that opens a top sheet with the
 * full search field, so the input never dominates the header.
 *
 * Portalled to <body> for the same reason the nav drawer is — the header is a
 * `sticky z-*` element and creates a stacking context, so anything rendered
 * inside it can't reliably paint above the page.
 */
export function MobileSearch() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const sheet = (
    <div className="fixed inset-0 z-[95] md:hidden">
      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-label="Close search"
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
      />
      <div className="relative border-b border-border bg-background px-4 pb-5 pt-4 shadow-xl">
        <div className="flex items-center gap-3">
          <HeaderSearch className="flex-1" />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="shrink-0 px-1 py-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search"
        aria-expanded={open}
        className="grid h-11 w-11 place-items-center text-inherit transition-opacity hover:opacity-70"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          className="h-[22px] w-[22px]"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M16.5 16.5 21 21" />
        </svg>
      </button>

      {open && mounted ? createPortal(sheet, document.body) : null}
    </>
  );
}
