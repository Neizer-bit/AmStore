"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { brand } from "@/lib/brand";

/**
 * Prominent header search (ASOS-style light pill with the magnifier on the
 * right). Submitting navigates to /search with the query. Placeholder comes
 * from `brand.header.searchPlaceholder`.
 */
export function HeaderSearch({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    router.push(term ? `/search?q=${encodeURIComponent(term)}` : "/search");
  }

  return (
    <form onSubmit={submit} role="search" className={`relative ${className}`}>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={brand.header.searchPlaceholder ?? "Search for items and brands"}
        aria-label="Search products"
        className="w-full h-11 rounded-full bg-background text-foreground placeholder:text-muted-foreground pl-5 pr-12 text-sm outline-none border border-transparent transition-colors focus:border-foreground/25"
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 grid place-items-center w-8 h-8 rounded-full text-foreground/70 hover:text-foreground transition-colors"
      >
        <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden>
          <circle cx="9" cy="9" r="6" />
          <path d="M14 14l3 3" strokeLinecap="round" />
        </svg>
      </button>
    </form>
  );
}
