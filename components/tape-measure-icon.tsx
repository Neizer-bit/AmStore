/**
 * Coiled tape-measure glyph — the size-guide mark, shared by the product-card
 * link and the modal's footnote so they can't drift apart.
 *
 * A reel with its hub, the tape unspooling right into a ticked strip with the
 * end-tab dot. Thin, open strokes so it stays legible at 14–20px.
 */
export function TapeMeasureIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Reel + hub. */}
      <circle cx="8.9" cy="8.7" r="5.6" />
      <ellipse cx="8.9" cy="8.7" rx="2.05" ry="1.6" />

      {/* Tape unspooling into the strip. */}
      <path d="M8.9 13.3h10.9a1.2 1.2 0 0 1 1.2 1.2v3.1a1.2 1.2 0 0 1-1.2 1.2H10.4" />
      {/* Left edge of the tape curving back into the reel. */}
      <path d="M10.4 18.8A6.7 6.7 0 0 1 3.4 12.1" />

      {/* Measure ticks. */}
      <path d="M12.5 13.3v2M15.1 13.3v2M17.7 13.3v2" />

      {/* End-tab dot. */}
      <circle cx="19.6" cy="16.1" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
