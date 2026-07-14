"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

/**
 * The image half of the desktop split hero — a two-frame diptych.
 *
 * Why two frames: the model's rendered width is strictly `column height × 2/3`
 * (that is her photograph's aspect, and cropping is not available — the shots
 * carry only 1.5–4% head/foot margin). So once the hero is capped to fit one
 * window, a single frame can only ever be ~39% of the screen. The only way to
 * give the imagery more of the page is to show more imagery. Two frames take
 * the picture area from 39% to ~68% of the width, and a diptych is the fashion
 * house's own device rather than a workaround.
 *
 * Each frame is cut to 2:3 and `object-cover`, so the crop is ~0% — she stands
 * full-length, floor to ceiling. The frames run one slide apart, so the pair is
 * always a look and its follow-up rather than the same shot twice.
 *
 * Kept separate from <HeroCarousel> (the mobile banner) on purpose: that one
 * applies a 1.09x Ken Burns drift, which here would eat straight through her
 * head and feet. This uses 1.03x, which stays inside the margin — and the
 * separation means desktop work cannot disturb mobile.
 */
const SLIDE_MS = 4600;
const FADE_MS = 900;
const ZOOM_MS = 7000;

function Frame({
  src,
  alt,
  priority,
  motion,
  className = "",
}: {
  src: string;
  alt: string;
  priority: boolean;
  motion: boolean;
  className?: string;
}) {
  return (
    <div className={`relative h-full overflow-hidden ${className}`}>
      <div
        key={src}
        className="absolute inset-0 will-change-[opacity,transform]"
        style={
          motion
            ? {
                animation: `heroFade ${FADE_MS}ms cubic-bezier(0.4,0,0.2,1) both`,
                transform: "scale(1.03)",
                transition: `transform ${ZOOM_MS}ms linear`,
              }
            : undefined
        }
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="34vw"
          priority={priority}
          className="object-cover object-[50%_45%]"
        />
      </div>
    </div>
  );
}

export function HeroSplitCarousel({ images, alt }: { images: string[]; alt: string }) {
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

  const second = images[(active + 1) % images.length];

  return (
    <div className="absolute inset-0 flex">
      <style>{`@keyframes heroFade { from { opacity: 0 } to { opacity: 1 } }`}</style>

      {/* Left frame: the current look. */}
      <Frame
        src={images[active]}
        alt={alt}
        priority
        motion={motion}
        className="aspect-[2/3] shrink-0"
      />

      {/* Right frame: the next look, so the pair always reads as an edit rather
          than the same shot printed twice. */}
      <Frame
        src={second}
        alt=""
        priority={false}
        motion={motion}
        className="aspect-[2/3] shrink-0"
      />

      <button
        type="button"
        onClick={next}
        aria-label="Next image"
        className="absolute inset-0 z-10 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      />

      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5">
          {images.map((src, i) => (
            <button
              key={`sdot-${src}-${i}`}
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
