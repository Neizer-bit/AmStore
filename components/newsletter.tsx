"use client";

import Image from "next/image";
import { useState } from "react";
import { brand } from "@/lib/brand";

/** Bold any "N% off" fragment inside the body copy. */
function renderBody(body: string) {
  return body.split(/(\d+%\s*off)/i).map((part, i) =>
    /\d+%\s*off/i.test(part) ? (
      <strong key={i} className="font-semibold text-foreground">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

export function Newsletter() {
  const n = brand.newsletter;
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-8 py-14 sm:py-16">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#f3ebdf] via-[#efdfce] to-[#e7d0b7]">
        {/* Decorative editorial image on the right, faded into the warm tan. */}
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 lg:block">
          <Image
            src="/hero/4.jpg"
            alt=""
            fill
            sizes="50vw"
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#efdfce] via-[#efdfce]/55 to-transparent" />
        </div>

        <div className="relative z-10 max-w-xl p-8 sm:p-12">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/55">
            {n.eyebrow}
          </p>
          <h2 className="m-0 [font-family:var(--font-display)] text-[clamp(2rem,4.5vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.01em] text-foreground">
            {n.title}
          </h2>
          <p className="mt-3 max-w-md leading-relaxed text-foreground/75">{renderBody(n.body)}</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="mt-6 flex max-w-md flex-col gap-2.5 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={n.placeholder}
              disabled={submitted}
              className="flex-1 rounded-full border border-foreground/15 bg-background/80 px-5 py-3 text-sm outline-none transition-shadow focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={submitted}
              className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-foreground/85 disabled:opacity-50"
            >
              {submitted ? n.successLabel : n.submitLabel}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
