"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

/**
 * PDP media column: one unobstructed main shot with arrow overlays, and a row
 * of square thumbnails beneath.
 *
 * Arrows and thumbnails only appear when there's more than one image, so a
 * single-image product stays clean instead of showing dead controls.
 */
export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const many = images.length > 1;

  const go = useCallback(
    (i: number) => setActive(((i % images.length) + images.length) % images.length),
    [images.length],
  );

  if (images.length === 0) {
    return <div className="aspect-[4/5] w-full bg-muted" />;
  }

  return (
    <div>
      {/* The frame keeps its 4:5 crop, but its width is capped against viewport
          height so the derived height (width × 1.25) can never outgrow the
          screen — uncapped, it renders ~700px tall on desktop and ~450px on a
          phone, pushing the buy column off-screen either way. Capping width
          rather than height preserves the ratio exactly instead of cropping.
          Mobile targets ~38svh of image; desktop keeps its larger budget. */}
      <div className="group relative mx-auto aspect-[4/5] w-full max-w-[max(9rem,calc(100svh_*_0.3))] overflow-hidden bg-muted sm:max-w-none lg:max-w-[max(18rem,calc((100svh_-_13rem)_*_0.8))]">
        <Image
          key={images[active]}
          src={images[active]}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority
          className="object-cover"
        />

        {many && (
          <>
            <GalleryArrow side="left" onClick={() => go(active - 1)} />
            <GalleryArrow side="right" onClick={() => go(active + 1)} />
          </>
        )}
      </div>

      {many && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === active}
              className={`relative aspect-square w-20 shrink-0 overflow-hidden border transition-colors duration-300 sm:w-24 ${
                i === active ? "border-foreground" : "border-transparent hover:border-foreground/30"
              }`}
            >
              <Image src={src} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function GalleryArrow({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous image" : "Next image"}
      className={`absolute top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur transition-all duration-300 hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 ${
        side === "left" ? "left-4" : "right-4"
      } opacity-0 group-hover:opacity-100 max-lg:opacity-100`}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        {side === "left" ? <path d="M15 5l-7 7 7 7" /> : <path d="M9 5l7 7-7 7" />}
      </svg>
    </button>
  );
}
