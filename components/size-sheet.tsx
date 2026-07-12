"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { brand } from "@/lib/brand";

export type SizeOption = { id: string; label: string };

/**
 * Minimal bottom sheet that asks for a size before the add-to-bag is confirmed.
 *
 * Rather than letting a shopper add an unsized item, the CTA defers: it opens
 * this, and picking a size completes the original action. Portalled to <body>
 * so it escapes the sticky header's stacking context.
 */
export function SizeSheet({
  open,
  sizes,
  onPick,
  onClose,
}: {
  open: boolean;
  sizes: SizeOption[];
  onPick: (index: number) => void;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[95]" role="dialog" aria-modal="true" aria-label={brand.pdp.selectSizeLabel}>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
      />

      <div className="sheet-rise absolute inset-x-0 bottom-0 rounded-t-2xl bg-background pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 shadow-2xl">
        {/* Grab handle */}
        <span aria-hidden className="mx-auto mb-5 block h-1 w-10 rounded-full bg-foreground/15" />

        <div className="flex items-center justify-between px-6">
          <h2 className="m-0 [font-family:var(--font-display)] text-xl font-medium text-foreground">
            {brand.pdp.selectSizeLabel}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 grid h-10 w-10 place-items-center text-foreground transition-opacity hover:opacity-60"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="h-5 w-5"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <ul className="m-0 mt-4 flex list-none flex-col border-t border-border p-0">
          {sizes.map((s, i) => (
            <li key={s.label + i} className="border-b border-border">
              <button
                type="button"
                onClick={() => onPick(i)}
                className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-muted/50"
              >
                <span className="text-base text-foreground">{s.label}</span>
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
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>,
    document.body,
  );
}
