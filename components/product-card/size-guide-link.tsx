"use client";

import { brand } from "@/lib/brand";
import { TapeMeasureIcon } from "@/components/tape-measure-icon";

/**
 * Understated "Size Guide" trigger sitting under the size run on the card — a
 * coiled tape-measure glyph and a hairline label that darkens and underlines on
 * hover. Opens the shared size-guide chart.
 */
export function SizeGuideLink({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group/sg -my-0.5 inline-flex items-center gap-1.5 self-start text-[11px] text-muted-foreground transition-colors duration-200 hover:text-foreground"
    >
      <TapeMeasureIcon className="h-4 w-4 shrink-0" />
      <span className="underline decoration-transparent underline-offset-[3px] transition-colors duration-200 group-hover/sg:decoration-foreground">
        {brand.pdp.sizeGuideLabel}
      </span>
    </button>
  );
}
