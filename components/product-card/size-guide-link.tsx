"use client";

import { brand } from "@/lib/brand";

/**
 * Understated "Size Guide" trigger sitting under the size run on the card —
 * a measuring-tape glyph and a hairline label that darkens and underlines on
 * hover. Opens the shared size-guide chart.
 */
export function SizeGuideLink({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group/sg -my-0.5 inline-flex items-center gap-1.5 self-start text-[11px] text-muted-foreground transition-colors duration-200 hover:text-foreground"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3.5 w-3.5 shrink-0"
      >
        <rect x="2" y="9" width="20" height="6" rx="1.6" />
        <path d="M6 9v2.25M10 9v2.25M14 9v2.25M18 9v2.25" />
      </svg>
      <span className="underline decoration-transparent underline-offset-[3px] transition-colors duration-200 group-hover/sg:decoration-foreground">
        {brand.pdp.sizeGuideLabel}
      </span>
    </button>
  );
}
