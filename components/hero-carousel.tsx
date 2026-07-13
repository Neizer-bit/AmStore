"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

/**
 * Hero slideshow. Slides cross-fade into each other while the active shot
 * slowly drifts in (a Ken Burns zoom), so the change reads as a motion rather
 * than a hard swap. Tap/click anywhere to jump to the next one; progress dots
 * jump straight to a slide. Fully static under prefers-reduced-motion.
 */

/** How long each slide holds before advancing. */
const SLIDE_MS = 3200;
/** Cross-fade duration. */
const FADE_MS = 850;
/** Ken Burns drift duration — longer than the hold, so it never settles. */
const ZOOM_MS = 6000;

export function HeroCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [motion, setMotion] = useState(true);

  const go = useCallback(
    (i: number) => setActive(((i % images.length) + images.length) % images.length),
    [images.length],
  );
  const next = useCallback(() => setActive((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMotion(!reduced);
    if (images.length < 2 || reduced) return;
    const id = window.setInterval(next, SLIDE_MS);
    return () => window.clearInterval(id);
  }, [images.length, next, active]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {images.map((src, i) => {
        const isActive = i === active;
        return (
          <div
            key={src + i}
            aria-hidden={i !== 0}
            className="absolute inset-0 will-change-[opacity,transform]"
            style={
              motion
                ? {
                    opacity: isActive ? 1 : 0,
                    // Active slide keeps drifting in; inactive resets ready for its turn.
                    transform: isActive ? "scale(1.09)" : "scale(1)",
                    transitionProperty: "opacity, transform",
                    transitionDuration: isActive
                      ? `${FADE_MS}ms, ${ZOOM_MS}ms`
                      : `${FADE_MS}ms, ${FADE_MS}ms`,
                    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1), linear",
                  }
                : { opacity: isActive ? 1 : 0 }
            }
          >
            {/* Desktop-only blurred fill. The shots are portrait, so on a wide
                banner `cover` has to blow them up ~1.3x and crops to a tight
                band. Contain shows the whole look instead — and this blurred
                copy of the same frame fills the flanks, so the studio backdrop
                (which differs per slide) never shows a seam. */}
            <Image
              src={src}
              alt=""
              aria-hidden
              fill
              sizes="100vw"
              priority={i === 0}
              className="hidden scale-110 object-cover blur-2xl brightness-[0.92] lg:block"
            />

            {/* The shot itself. Mobile keeps `cover` (framed as before);
                desktop contains it so the model reads full-length. */}
            <Image
              src={src}
              alt={i === 0 ? alt : ""}
              fill
              sizes="100vw"
              priority={i === 0}
              className="object-cover object-[50%_38%] lg:object-contain"
            />
          </div>
        );
      })}

      {/* Tap anywhere to advance. */}
      <button
        type="button"
        onClick={next}
        aria-label="Next image"
        className="absolute inset-0 z-10 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      />

      {/* Progress dots. */}
      {images.length > 1 && (
        <div className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 flex items-center gap-1.5">
          {images.map((src, i) => (
            <button
              key={`dot-${src}-${i}`}
              type="button"
              aria-label={`Show image ${i + 1}`}
              aria-current={i === active}
              onClick={() => go(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? "w-6 bg-white" : "w-1.5 bg-white/55 hover:bg-white/85"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
