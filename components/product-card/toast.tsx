"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Small, quiet toast. Portalled to <body> so it escapes the card's (and the
 * sticky header's) stacking context and always floats above the page.
 */
export function Toast({ message, onDone }: { message: string | null; onDone: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!message) return;
    const id = window.setTimeout(onDone, 2000);
    return () => window.clearTimeout(id);
  }, [message, onDone]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {message && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="pointer-events-none fixed inset-x-0 bottom-6 z-[95] flex justify-center px-6"
        >
          <span className="rounded-full bg-foreground px-5 py-3 text-[13px] font-medium text-background shadow-lg">
            {message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
