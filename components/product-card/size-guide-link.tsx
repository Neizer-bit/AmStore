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
      // `items-center` on the flex row is what actually baselines the glyph
      // against the label. Mobile gets a 44px-high tap target; desktop keeps
      // its original compact 11px link.
      // `whitespace-nowrap` is load-bearing: sharing a flex row with the CTA,
      // the label was breaking after "Size" and stacking "Guide" beneath it.
      // 12px, not 13: at 13px the label is 94px, and in the narrow landing rail
      // the pills (66px) + gap + label came to exactly the 168px interior — so
      // it wrapped on sub-pixel rounding. A couple of pixels of headroom keeps
      // it on the same line as the size run at every card width.
      className="group/sg inline-flex min-h-10 items-center gap-1.5 self-start whitespace-nowrap text-[12px] font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground md:-my-0.5 md:min-h-0 md:text-[11px] md:font-normal"
    >
      <TapeMeasureIcon className="h-4 w-4 shrink-0" />
      <span className="whitespace-nowrap underline decoration-transparent underline-offset-[3px] transition-colors duration-200 group-hover/sg:decoration-foreground">
        {brand.pdp.sizeGuideLabel}
      </span>
    </button>
  );
}
