import { brand } from "@/lib/brand";
import { TikTokCard, type TikTokClip } from "@/components/tiktok-card";

/**
 * "#AmayaliStyle" — the TikTok rail. Replaces the old lifestyle-image strip.
 *
 * Posters, captions and author come from TikTok's public oEmbed endpoint at
 * render time (ISR-cached for an hour), so featuring a clip only ever means
 * adding its ID to `brand.landing.tiktok.videoIds` — no thumbnails to export,
 * nothing to keep in sync by hand.
 *
 * Playback is click-to-load: the card shows a poster until tapped, then mounts
 * the real TikTok player. Mounting five third-party iframes on page load would
 * cost megabytes and tank the landing page's LCP for a section most visitors
 * scroll past.
 */

interface OEmbed {
  title?: string;
  thumbnail_url?: string;
  author_name?: string;
}

async function getClip(id: string): Promise<TikTokClip> {
  const url = `https://www.tiktok.com/@${brand.landing.tiktok.handle.replace(/^@/, "")}/video/${id}`;
  try {
    const res = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { id, url };
    const data = (await res.json()) as OEmbed;
    return {
      id,
      url,
      caption: data.title,
      poster: data.thumbnail_url,
      author: data.author_name,
    };
  } catch {
    // TikTok unreachable at build/revalidate time — the card still renders and
    // still plays; it just opens without a poster rather than breaking the page.
    return { id, url };
  }
}

export async function TikTokRail() {
  const t = brand.landing.tiktok;
  if (t.videoIds.length === 0) return null;

  const clips = await Promise.all(t.videoIds.map(getClip));

  return (
    <section className="max-w-7xl mx-auto px-5 py-16 sm:px-10 sm:py-24">
      {/* Header: editorial left, follow CTA right. */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
        <div data-reveal>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/55">
            {t.eyebrow}
          </p>
          <h2 className="m-0 [font-family:var(--font-display)] text-[clamp(1.6rem,3vw,2.25rem)] font-medium leading-tight text-foreground">
            {t.title}
          </h2>
          <p className="mt-2 max-w-md text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
            {t.body}
          </p>
        </div>

        <a
          data-reveal
          href={t.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-foreground/20 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground transition-colors duration-300 hover:border-foreground hover:bg-foreground hover:text-background sm:self-auto"
        >
          <TikTokGlyph className="h-3.5 w-3.5 shrink-0" />
          {t.followLabel}
        </a>
      </div>

      {/* Rail: scrolls on every size. Bleeds to the screen edge on mobile so a
          card peeks in and signals there's more to swipe. */}
      <div
        data-reveal
        className="-mx-5 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-10 sm:gap-4 sm:px-10 lg:mx-0 lg:px-0"
      >
        {clips.map((clip) => (
          <TikTokCard key={clip.id} clip={clip} watchLabel={t.watchLabel} />
        ))}
      </div>
    </section>
  );
}

function TikTokGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M16 3v3.5a4.5 4.5 0 0 0 4.5 4.5V14a7.5 7.5 0 0 1-4.5-1.5V16a5 5 0 1 1-5-5v3a2 2 0 1 0 2 2V3z" />
    </svg>
  );
}
