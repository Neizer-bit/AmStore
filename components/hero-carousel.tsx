"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

/**
 * Hero image slider. Tap/click anywhere on the image to advance to the next
 * one; it also auto-cross-fades on a timer (paused under prefers-reduced-motion).
 * Progress dots jump straight to a specific image.
 */
export function HeroCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);

  const go = useCallback(
    (i: number) => setActive(((i % images.length) + images.length) % images.length),
    [images.length],
  );
  const next = useCallback(() => setActive((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    if (images.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(next, 4000);
    return () => window.clearInterval(id);
  }, [images.length, next, active]);

  return (
    <div className="absolute inset-0">
      {images.map((src, i) => (
        <Image
          key={src + i}
          src={src}
          alt={i === 0 ? alt : ""}
          aria-hidden={i !== 0}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition-opacity duration-[1000ms] ease-in-out"
          style={{ opacity: i === active ? 1 : 0 }}
          priority={i === 0}
        />
      ))}

      {/* Tap anywhere to go to the next image */}
      <button
        type="button"
        onClick={next}
        aria-label="Next image"
        className="absolute inset-0 z-10 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      />

      {/* Progress dots */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 flex items-center gap-1.5">
          {images.map((src, i) => (
            <button
              key={`dot-${src}-${i}`}
              type="button"
              aria-label={`Show image ${i + 1}`}
              aria-current={i === active}
              onClick={() => go(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? "w-5 bg-white" : "w-1.5 bg-white/55 hover:bg-white/85"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
