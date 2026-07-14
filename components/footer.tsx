import Link from "next/link";
import { brand } from "@/lib/brand";
import { FooterNewsletter } from "@/components/footer-newsletter";

const ICONS: Record<string, React.ReactNode> = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden className="w-5 h-5">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="w-5 h-5">
      <path d="M18 2h3l-7.5 8.6L22 22h-6.6l-5-6.5L4 22H1l8-9.2L1.4 2H8l4.6 6 5.4-6z" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="w-5 h-5">
      <path d="M16 3v3.5a4.5 4.5 0 0 0 4.5 4.5V14a7.5 7.5 0 0 1-4.5-1.5V16a5 5 0 1 1-5-5v3a2 2 0 1 0 2 2V3z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="w-5 h-5">
      <path d="M14 9V7a1 1 0 0 1 1-1h2V3h-3a4 4 0 0 0-4 4v2H8v3h2v9h3v-9h2.5l.5-3H13z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="w-5 h-5">
      <path d="M22.5 6.5a2.6 2.6 0 0 0-1.8-1.8C19 4.2 12 4.2 12 4.2s-7 0-8.7.5A2.6 2.6 0 0 0 1.5 6.5C1 8.2 1 12 1 12s0 3.8.5 5.5a2.6 2.6 0 0 0 1.8 1.8C5 19.8 12 19.8 12 19.8s7 0 8.7-.5a2.6 2.6 0 0 0 1.8-1.8c.5-1.7.5-5.5.5-5.5s0-3.8-.5-5.5zM10 15.5v-7l6 3.5-6 3.5z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="w-5 h-5">
      <path d="M4 4h4v16H4zM6 2.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM10 8h4v2.5h.1c.6-1.1 2-2.5 4-2.5 4 0 4.9 2.6 4.9 6V20h-4v-5c0-1.5-.5-3-2.3-3-1.7 0-2.5 1.3-2.5 3v5h-4z" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="w-5 h-5">
      <path d="M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.2-1.4A10 10 0 1 0 12 2zm5 14.2c-.2.6-1.2 1.2-1.7 1.2-.5.1-1.1.1-1.7-.1-.4-.1-.9-.3-1.5-.6a8.4 8.4 0 0 1-3.7-3.4c-.7-1-1-1.8-1-2.5 0-.7.4-1.1.6-1.3.2-.2.4-.2.5-.2h.4c.1 0 .3 0 .4.3l.6 1.4c.1.2 0 .3 0 .4l-.3.4-.3.3c-.1.1-.2.2-.1.4.2.4.7 1.1 1.4 1.8.9.8 1.7 1.1 1.9 1.2.2.1.3.1.5-.1l.6-.7c.2-.2.3-.2.5-.1l1.4.7c.2.1.3.2.4.3.1.2.1.6 0 1z" />
    </svg>
  ),
};

const FALLBACK_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden className="w-5 h-5">
    <circle cx="12" cy="12" r="9" />
  </svg>
);

/** Small line icons for the contact block. */
const CONTACT_ICONS = {
  pin: (
    <>
      <path d="M12 21s-7-5.2-7-11a7 7 0 0 1 14 0c0 5.8-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  phone: (
    <path d="M5 4h3l1.5 4.5-2 1.5a11 11 0 0 0 5 5l1.5-2L18.5 15V18a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
} as const;

function ContactRow({ icon, children }: { icon: keyof typeof CONTACT_ICONS; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="mt-0.5 h-4 w-4 shrink-0 text-foreground/60"
      >
        {CONTACT_ICONS[icon]}
      </svg>
      <span className="min-w-0">{children}</span>
    </li>
  );
}

export async function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-8 border-t border-border bg-muted text-sm text-muted-foreground">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-10 pb-6 sm:pt-16 sm:pb-7">
        <div className="grid gap-7 gap-x-8 sm:gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(3,minmax(0,0.7fr))_1.4fr] lg:gap-x-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1 lg:max-w-xs">
            <span className="[font-family:var(--font-display)] text-[22px] font-medium leading-none tracking-[0.02em] text-foreground sm:text-[26px]">
              {brand.name}
            </span>
            <p className="mt-3 text-[13px] leading-relaxed sm:mt-4">{brand.footer.blurb}</p>

            {/* Socials — hairline circles, fill on hover. */}
            <div className="mt-5 flex items-center gap-2 sm:mt-6">
              {brand.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-foreground/15 text-foreground/60 transition-colors duration-300 hover:border-foreground hover:bg-foreground hover:text-background"
                >
                  {(s.icon && ICONS[s.icon]) ?? FALLBACK_ICON}
                </a>
              ))}
            </div>
          </div>

          {/* Shop / About / Help.
              On mobile these three sit side by side in their own 3-up grid —
              stacked, they were most of the footer's height. `sm:contents`
              dissolves the wrapper from sm up, so each <nav> becomes a direct
              child of the outer grid again and desktop is untouched. */}
          <div className="grid grid-cols-3 gap-x-4 sm:contents">
            {brand.footer.sitemap.map((section) => (
              <nav key={section.title} aria-labelledby={`footer-${section.title}`}>
                <p
                  id={`footer-${section.title}`}
                  className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground sm:mb-4"
                >
                  {section.title}
                </p>
                {/* Mobile links were 16px tall — a miss-tap every time. The
                    min-height gives each a 36px target; dropping the list gap on
                    mobile pays for most of the extra height, so the footer stays
                    compact. Desktop keeps its original 13px links and 12px gap. */}
                <ul className="m-0 list-none space-y-0 p-0 sm:space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="inline-flex min-h-9 items-center text-[13px] text-muted-foreground transition-colors duration-300 hover:text-foreground sm:min-h-0"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          {/* Newsletter */}
          <FooterNewsletter />
        </div>

        {/* Contact — a quiet hairline row under the columns. */}
        <address className="mt-7 not-italic border-t border-border pt-5 sm:mt-12 sm:pt-6">
          {/* Mobile pairs the four lines into two rows instead of four; the
              hairline `sm:flex` restore hands desktop back its single row. */}
          <ul className="m-0 grid list-none grid-cols-2 gap-x-4 gap-y-2.5 p-0 text-[13px] sm:flex sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-3">
            <ContactRow icon="pin">{brand.contact.address}</ContactRow>
            <ContactRow icon="phone">
              <a href={`tel:${brand.contact.phoneTel}`} className="inline-flex min-h-9 items-center transition-colors hover:text-foreground sm:min-h-0">
                {brand.contact.phone}
              </a>
            </ContactRow>
            <ContactRow icon="mail">
              <a href={`mailto:${brand.contact.email}`} className="inline-flex min-h-9 items-center transition-colors hover:text-foreground sm:min-h-0">
                {brand.contact.email}
              </a>
            </ContactRow>
            <ContactRow icon="clock">{brand.contact.hours}</ContactRow>
          </ul>
        </address>

        <div className="mt-5 flex flex-col items-center justify-between gap-2 border-t border-border pt-4 text-xs sm:mt-6 sm:flex-row sm:gap-3 sm:pt-5">
          <p className="m-0">© {year} {brand.name}. All rights reserved.</p>
          {brand.footer.poweredBy && (
            <p className="m-0 inline-flex items-center gap-1.5">
              <span className="opacity-70">Powered by</span>
              <a
                href={brand.footer.poweredBy.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={brand.footer.poweredBy.label}
                className="inline-flex min-h-9 items-center gap-1 text-foreground transition-colors hover:text-foreground/70 sm:min-h-0"
              >
                <span className="font-semibold tracking-tight">{brand.footer.poweredBy.label}</span>
                <svg
                  viewBox="0 0 12 12"
                  aria-hidden
                  className="w-3 h-3 opacity-70"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M3 9L9 3M9 3H4M9 3v5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
