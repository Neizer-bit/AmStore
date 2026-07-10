import { brand } from "@/lib/brand";

/**
 * Thin trust / announcement bar pinned above the header: region on the left,
 * shipping & security signals on the right. Renders nothing if `brand.announceBar`
 * is absent. Strings come from `brand.announceBar`.
 */
export function AnnouncementBar() {
  const bar = brand.announceBar;
  if (!bar) return null;
  return (
    <div className="w-full bg-foreground text-background/90 text-[11px]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 h-9 flex items-center justify-between gap-4">
        <span className="inline-flex items-center gap-1.5 font-medium tracking-wide whitespace-nowrap">
          {bar.region}
        </span>
        <ul className="flex items-center gap-4 sm:gap-6 overflow-hidden">
          {bar.items.map((item, i) => (
            <li
              key={item}
              className={`items-center gap-1.5 whitespace-nowrap tracking-wide ${i === 0 ? "flex" : "hidden sm:flex"}`}
            >
              <svg viewBox="0 0 16 16" className="w-3 h-3 text-background/60" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
