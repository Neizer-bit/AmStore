import Link from "next/link";
import { Suspense } from "react";
import { CartIconButton, CartIconSkeleton } from "./cart-pill";
import { MobileNav } from "./mobile-nav";
import { MobileSearch } from "./mobile-search";
import { HeaderSearch } from "./header-search";
import { brand } from "@/lib/brand";

/**
 * Storefront header — charcoal bar over the cream page.
 *
 * Mobile: a single minimal row — hamburger, perfectly centred wordmark, and
 * search / account / bag icons. All primary links live in the slide-out drawer,
 * and search hides behind a magnifier so it never dominates the bar.
 *
 * Desktop (md+): wordmark left, a large light search pill, and account /
 * wishlist / bag icons on the right, over a second nav row that leads with a
 * highlighted Sale tab.
 */
function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.5 3.1-5.5 7-5.5s7 2 7 5.5" strokeLinecap="round" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );
}

export function Header() {
  const saleLink = brand.header.nav.find((l) => /sale/i.test(l.label));
  const mainLinks = brand.header.nav.filter((l) => l !== saleLink);

  return (
    <header className="sticky top-0 z-40 bg-foreground text-background">
      {/* ── Mobile bar: hamburger · centred wordmark · icons ─────────────
          `1fr auto 1fr` keeps the side groups equal width, so the logo is
          perfectly centred no matter how many icons sit either side. */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-2 py-1.5 md:hidden">
        <div className="flex justify-start">
          <MobileNav />
        </div>

        <Link href="/" aria-label={brand.name} className="group flex justify-center px-2">
          <span className="[font-family:var(--font-brand)] font-bold normal-case text-[28px] leading-none text-background transition-opacity group-hover:opacity-80">
            {brand.shortName}
            <span className="ml-0.5 align-super text-[17px]" aria-hidden>♥</span>
          </span>
        </Link>

        <div className="flex items-center justify-end text-background">
          <MobileSearch />
          <Link
            href="/account"
            aria-label="Account"
            className="grid h-11 w-11 place-items-center transition-opacity hover:opacity-70"
          >
            <PersonIcon />
          </Link>
          <Suspense fallback={<CartIconSkeleton />}>
            <CartIconButton />
          </Suspense>
        </div>
      </div>

      {/* ── Desktop bar: wordmark · search · icons ───────────────────── */}
      <div className="hidden md:flex items-center gap-6 px-6 lg:px-8 py-2.5">
        <Link href="/" className="flex items-baseline gap-2 group shrink-0">
          <span className="[font-family:var(--font-brand)] font-bold normal-case text-[38px] leading-none text-background group-hover:opacity-80 transition-opacity">
            {brand.shortName}
            <span className="text-[19px] align-super ml-0.5" aria-hidden>♥</span>
          </span>
        </Link>

        <HeaderSearch className="flex-1 max-w-2xl mx-auto" />

        <div className="flex items-center gap-2.5 shrink-0 ml-auto text-background">
          <Link
            href="/account"
            aria-label="Account"
            className="grid place-items-center w-9 h-9 hover:opacity-70 transition-opacity"
          >
            <PersonIcon />
          </Link>
          <Link
            href="/account"
            aria-label="Wishlist"
            className="grid place-items-center w-9 h-9 hover:opacity-70 transition-opacity"
          >
            <HeartIcon />
          </Link>
          <Suspense fallback={<CartIconSkeleton />}>
            <CartIconButton />
          </Suspense>
        </div>
      </div>

      {/* Row 2: category nav, leading with the Sale tab */}
      <div className="hidden md:block border-t border-background/15">
        <nav className="flex items-stretch px-4 sm:px-6 lg:px-8">
          {saleLink && (
            <Link
              href={saleLink.href}
              className="flex items-center px-3.5 mr-4 bg-[#d21f3c] text-white text-[13px] font-bold tracking-wide hover:bg-[#b81a33] transition-colors"
            >
              {saleLink.label}
            </Link>
          )}
          <ul className="flex items-center gap-6 py-2.5 overflow-x-auto">
            {mainLinks.map((link) => (
              <li key={link.href} className="whitespace-nowrap">
                <Link
                  href={link.href}
                  className="text-[13px] text-background hover:text-neutral-400 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
