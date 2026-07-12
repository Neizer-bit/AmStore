"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { brand } from "@/lib/brand";
import { TapeMeasureIcon } from "@/components/tape-measure-icon";

/**
 * Size-guide modal. Serif heading over a hairline measurement chart.
 *
 * Portalled to <body> so it escapes the sticky header's stacking context, and
 * the table scrolls horizontally on narrow screens rather than overflowing.
 */
export function SizeGuideModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const guide = brand.pdp.sizeGuide;

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

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] grid place-items-center p-4 sm:p-6">
          <motion.button
            type="button"
            onClick={onClose}
            aria-label="Close size guide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-foreground/55 backdrop-blur-[2px]"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={guide.title}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 0.61, 0.2, 1] }}
            className="relative w-full max-w-lg overflow-hidden rounded-xl bg-card shadow-2xl"
          >
            <div className="px-7 pt-7 sm:px-9 sm:pt-9">
              <div className="flex items-start justify-between gap-4">
                <h2 className="m-0 [font-family:var(--font-display)] text-[28px] font-medium leading-none text-foreground">
                  {guide.title}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="-mr-2 -mt-1 grid h-10 w-10 shrink-0 place-items-center text-foreground transition-opacity hover:opacity-60"
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

              <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">{guide.body}</p>
            </div>

            {/* Chart — scrolls sideways on narrow screens instead of overflowing. */}
            <div className="mt-6 overflow-x-auto px-7 sm:px-9">
              <table className="w-full min-w-[420px] border-collapse text-left">
                <thead>
                  <tr>
                    {guide.columns.map((col) => (
                      <th
                        key={col}
                        scope="col"
                        className="border border-border bg-muted/70 px-4 py-3 text-[12px] font-semibold text-foreground"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {guide.rows.map((row) => (
                    <tr key={row[0]}>
                      {row.map((cell, i) => (
                        <td
                          key={`${row[0]}-${i}`}
                          className={`border border-border px-4 py-3 text-[13px] tabular-nums ${
                            i === 0
                              ? "font-semibold text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Measuring-tape note */}
            <div className="flex items-start gap-3 px-7 pb-8 pt-6 sm:px-9">
              <TapeMeasureIcon className="mt-0.5 h-5 w-5 shrink-0 text-foreground/60" />
              <p className="m-0 text-[12px] leading-relaxed text-muted-foreground">{guide.note}</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
