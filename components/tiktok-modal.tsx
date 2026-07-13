"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { TikTokClip } from "@/components/tiktok-card";

/**
 * Lightbox player for a TikTok clip.
 *
 * Uses TikTok's *official* embed — the blockquote from oEmbed plus their
 * embed.js — not a hand-rolled `/embed/v2/<id>` iframe. The raw iframe renders,
 * then fails to decode its own media (MEDIA_ELEMENT_ERROR: Format error,
 * networkState NO_SOURCE) and degrades to a "Watch now" click-out. Their script
 * builds the player with the parameters the CDN actually honours.
 *
 * Two things React won't do for us:
 *  - `dangerouslySetInnerHTML` never executes a <script> tag, so the script is
 *    stripped from the markup and appended by hand.
 *  - embed.js only scans for un-hydrated blockquotes when it loads, so it is
 *    removed and re-added on each open; otherwise the second clip never builds.
 *
 * Portalled to <body>: the rail sits inside sections that establish stacking
 * contexts, which would trap a fixed overlay beneath the header.
 */
const EMBED_SCRIPT = "https://www.tiktok.com/embed.js";

export function TikTokModal({ clip, onClose }: { clip: TikTokClip; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const holder = useRef<HTMLDivElement | null>(null);

  useEffect(() => setMounted(true), []);

  // Esc to dismiss; hold the page still behind the overlay.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  // Load (or reload) TikTok's builder once the blockquote is in the DOM.
  useEffect(() => {
    if (!mounted || !clip.embedHtml) return;
    document.querySelectorAll(`script[src="${EMBED_SCRIPT}"]`).forEach((s) => s.remove());
    const s = document.createElement("script");
    s.src = EMBED_SCRIPT;
    s.async = true;
    document.body.appendChild(s);
    return () => {
      s.remove();
    };
  }, [mounted, clip.embedHtml]);

  if (!mounted) return null;

  const caption = (clip.caption ?? "").replace(/#[^\s#]+/g, "").trim();
  // The <script> in oEmbed's html is inert inside dangerouslySetInnerHTML —
  // drop it so it can't linger as dead markup, and inject it ourselves above.
  const markup = (clip.embedHtml ?? "").replace(/<script[\s\S]*?<\/script>/gi, "");

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={caption || "TikTok video"}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/85 p-4 backdrop-blur-sm"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close video"
        className="fixed right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      {/* Stop the backdrop's close handler firing on clicks inside the player. */}
      <div onClick={(e) => e.stopPropagation()} className="my-auto w-full max-w-[325px]">
        {markup ? (
          <div
            ref={holder}
            // TikTok's own markup. Its stylesheet expects to own the width.
            className="[&_blockquote]:!m-0 [&_iframe]:!rounded-2xl"
            dangerouslySetInnerHTML={{ __html: markup }}
          />
        ) : (
          // oEmbed was unreachable at render time — never strand the shopper.
          <a
            href={clip.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-2xl bg-white/10 p-8 text-center text-sm text-white"
          >
            Watch this clip on TikTok
          </a>
        )}
      </div>
    </div>,
    document.body,
  );
}
