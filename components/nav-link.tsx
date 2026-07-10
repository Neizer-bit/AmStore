"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={[
        "text-[13px] font-medium tracking-wide transition-colors",
        active ? "text-primary" : "text-muted-foreground hover:text-foreground",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
