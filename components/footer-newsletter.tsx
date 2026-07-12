"use client";

import { useState } from "react";
import { brand } from "@/lib/brand";

/**
 * Footer signup. A hairline, underline-only field with an arrow submit —
 * quieter and more couture than a boxed input + filled button.
 */
export function FooterNewsletter() {
  const n = brand.footer.newsletter;
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div>
      <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground">
        Newsletter
      </p>
      <p className="[font-family:var(--font-display)] text-lg leading-snug text-foreground">
        {n.title}
      </p>
      <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{n.body}</p>

      {submitted ? (
        <p className="mt-4 text-[13px] font-medium text-foreground">{n.successLabel}</p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="group mt-4 flex items-center gap-2 border-b border-foreground/25 pb-2 transition-colors focus-within:border-foreground"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={n.placeholder}
            aria-label={n.placeholder}
            className="min-w-0 flex-1 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            aria-label={n.submitLabel}
            className="shrink-0 text-foreground/60 transition-all duration-300 hover:translate-x-0.5 hover:text-foreground"
          >
            <svg
              viewBox="0 0 16 16"
              aria-hidden
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M3 8h10m0 0-3.5-3.5M13 8l-3.5 3.5" />
            </svg>
          </button>
        </form>
      )}
    </div>
  );
}
