"use client";

import { useState } from "react";
import { brand } from "@/lib/brand";

export function Newsletter() {
  const n = brand.newsletter;
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-8 py-14 sm:py-20">
      <div className="rounded-3xl border border-border bg-card p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-primary mb-2">
            {n.eyebrow}
          </p>
          <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold m-0 mb-3 -tracking-[0.025em]">
            {n.title}
          </h2>
          <p className="text-muted-foreground leading-relaxed">{n.body}</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="flex flex-col sm:flex-row gap-2"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={n.placeholder}
            disabled={submitted}
            className="flex-1 px-4 py-3 rounded-md bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-shadow text-sm disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={submitted}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-foreground text-background font-semibold text-sm hover:bg-primary transition-colors disabled:opacity-50"
          >
            {submitted ? n.successLabel : n.submitLabel}
          </button>
        </form>
      </div>
    </section>
  );
}
