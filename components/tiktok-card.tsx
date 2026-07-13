"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export interface TikTokClip {
  id: string;
  url: string;
  caption?: string;
  poster?: string;
  author?: string;
}

/**
 * One 9:16 TikTok tile.
 *
 * Rest: the poster with a scrim, a glass play button, and the caption.
 * Tapped: the poster is swapped for TikTok's own player, so the clip plays
 * in place on the site rather than kicking the shopper out to the app.
 *
 * The poster is a plain <img>: next/image is wired to a custom Cimplify loader
 * in next.config, which would rewrite these TikTok CDN URLs and 404 them.
 */
export function TikTokCard({ clip, watchLabel }: { clip: TikTokClip; watchLabel: string }) {
  const [playing, setPlaying] = useState(false);

  // TikTok's caption is the whole post body, hashtags and all. Strip them for
  // the tile — "#fyp #ghanatiktok🇬🇭" is noise next to a garment.
  const caption = (clip.caption ?? "").replace(/#[^\s#]+/g, "").trim();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      className="group relative aspect-[9/16] w-[62%] shrink-0 snap-start overflow-hidden rounded-2xl bg-muted shadow-[0_6px_24px_rgba(0,0,0,0.08)] sm:w-[40%] lg:w-[calc((100%-4*0.75rem)/5)]"
    >
      {playing ? (
        <iframe
          src={`https://www.tiktok.com/embed/v2/${clip.id}`}
          title={caption || "TikTok video"}
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          className="h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`${watchLabel}: ${caption || "TikTok video"}`}
          className="block h-full w-full text-left"
        >
          {clip.poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={clip.poster}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
          ) : (
            <div className="absolute inset-0 bg-foreground/10" />
          )}

          {/* Scrim: keeps the caption and play glyph legible over any frame. */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/70" />

          {/* Play button — glass disc, grows on hover. */}
          <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/25 text-white backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
            <svg viewBox="0 0 24 24" aria-hidden className="ml-0.5 h-5 w-5" fill="currentColor">
              <path d="M8 5.5v13l11-6.5-11-6.5z" />
            </svg>
          </span>

          <div className="absolute inset-x-0 bottom-0 p-3.5">
            {caption && (
              <p className="m-0 line-clamp-2 text-[12px] font-medium leading-snug text-white">
                {caption}
              </p>
            )}
            <span className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/85">
              <svg viewBox="0 0 24 24" aria-hidden className="h-3 w-3" fill="currentColor">
                <path d="M16 3v3.5a4.5 4.5 0 0 0 4.5 4.5V14a7.5 7.5 0 0 1-4.5-1.5V16a5 5 0 1 1-5-5v3a2 2 0 1 0 2 2V3z" />
              </svg>
              {watchLabel}
            </span>
          </div>
        </button>
      )}
    </motion.div>
  );
}
