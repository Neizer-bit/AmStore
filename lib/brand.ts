/**
 * Brand & content configuration — the **single source of truth** for every
 * visible string in this storefront.
 *
 * To rebrand the entire site, edit this file. Every page, component,
 * metadata block, JSON-LD object, sitemap, robots.txt, and llms.txt entry
 * reads from `brand`.
 *
 * Schema is intentionally generous: optional fields (tradeIn, trustItems,
 * brandStrip, promo) only render when present, so the same Brand type
 * works across industry templates.
 */
import type { SeedName } from "@cimplify/sdk/testing/suite";

export interface BrandSocial {
  /** Display label (Instagram, X, YouTube, …). Used as aria-label and footer chip. */
  label: string;
  href: string;
  /** Optional icon override — defaults to inline SVG keyed by `label`. */
  icon?: "instagram" | "x" | "tiktok" | "facebook" | "youtube" | "linkedin" | "whatsapp";
}

export interface BrandFaqEntry {
  q: string;
  a: string;
}

export interface BrandFaqSection {
  title: string;
  items: BrandFaqEntry[];
}

export interface BrandPolicySection {
  heading: string;
  /** Plain prose, or { intro + bullets } for list-style sections. */
  body: string | { intro: string; bullets: string[] };
}

export interface BrandSitemapSection {
  title: string;
  links: { label: string; href: string }[];
}

export interface Brand {
  // ─── Identity ─────────────────────────────────────────────────
  name: string;
  /** Short brand mark for compact spaces. */
  shortName: string;
  /** Microtag shown in the header beside the brand mark. */
  microTag: string;
  /** SEO description and default OG description. */
  description: string;
  /** Schema.org `@type` for the Organization JSON-LD on the layout. */
  schemaType:
    | "Store"
    | "Bakery"
    | "Restaurant"
    | "BeautySalon"
    | "GroceryStore"
    | "LocalBusiness"
    | "Organization";

  // ─── Currency / locale ────────────────────────────────────────
  currency: string;
  locale: string;

  // ─── Contact ──────────────────────────────────────────────────
  contact: {
    address: string;
    streetAddress: string;
    city: string;
    countryCode: string;
    /** Display phone, with formatting. */
    phone: string;
    /** Phone in `tel:` format (digits + country code). */
    phoneTel: string;
    email: string;
    privacyEmail: string;
    supportEmail?: string;
    businessEmail?: string;
    hours: string;
  };

  socials: BrandSocial[];

  // ─── Header ───────────────────────────────────────────────────
  header: {
    /** Top-level nav links. Order is preserved. */
    nav: { label: string; href: string }[];
    /** Placeholder for the header search box. */
    searchPlaceholder?: string;
    /** Copy for the search dropdown's no-results state. */
    searchEmpty: {
      title: string;
      hint: string;
      categoriesLabel: string;
      popularLabel: string;
    };
  };

  /** Thin announcement / trust bar above the header (optional). */
  announceBar?: {
    /** Left-side region label, e.g. "Ship to Ghana 🇬🇭". */
    region: string;
    /** Right-side trust signals. */
    items: string[];
    /** Single centred message shown as a thin strip above the hero. */
    message?: string;
  };

  // ─── Hero ─────────────────────────────────────────────────────
  hero: {
    badge: string;
    /** Small letter-spaced line above the headline. */
    eyebrow?: string;
    title: string;
    /** Subtitle. May span multiple paragraphs by separating with \n\n. */
    subtitle: string;
    /** Optional highlighted perk line (e.g. free-delivery threshold). */
    perk?: string;
    primaryCtaLabel: string;
    secondaryCtaLabel?: string;
    secondaryCtaHref?: string;
  };

  // ─── Trust bar (optional) ─────────────────────────────────────
  trustItems?: { label: string; value: string; description: string; iconKey: string }[];

  // ─── Brand authority strip (optional) ─────────────────────────
  brandStrip?: {
    headline: string;
    brands: string[];
  };

  // ─── Promo banner (optional) ──────────────────────────────────
  promo?: {
    badge: string;
    title: string;
    body: string;
    ctaLabel: string;
    ctaHref: string;
  };

  // ─── Landing page sections ────────────────────────────────────
  landing: {
    /** "Shop by category" tile grid. */
    categories: { title: string; ctaLabel: string };
    /** Featured product rail + link into the full marketplace. */
    featured: { eyebrow: string; title: string; ctaLabel: string; ctaHref: string };
    /**
     * TikTok rail. `videoIds` are the numeric IDs from
     * tiktok.com/@handle/video/<id>. Thumbnail, caption and author are pulled
     * from TikTok's public oEmbed endpoint at render time, so adding a clip
     * here is the only step needed to feature it.
     */
    tiktok: {
      eyebrow: string;
      title: string;
      body: string;
      followLabel: string;
      handle: string;
      profileUrl: string;
      watchLabel: string;
      videoIds: string[];
    };
  };

  // ─── Marketplace (/shop) header ───────────────────────────────
  shopPage: {
    eyebrow: string;
    title: string;
    body: string;
  };

  // ─── Trade-in CTA (optional) ──────────────────────────────────
  tradeIn?: {
    eyebrow: string;
    title: string;
    body: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
    steps: { step: string; title: string; body: string }[];
  };

  // ─── About page ───────────────────────────────────────────────
  about: {
    eyebrow: string;
    /** Title — supports a single \n for a hard line break. */
    title: string;
    paragraphs: string[];
    sections: { heading: string; body: string }[];
  };

  // ─── FAQ ──────────────────────────────────────────────────────
  faq: {
    eyebrow: string;
    title: string;
    sections: BrandFaqSection[];
    contactPrompt: string;
    contactEmail: string;
  };

  // ─── Terms ────────────────────────────────────────────────────
  terms: {
    eyebrow: string;
    title: string;
    lastUpdated: string;
    sections: BrandPolicySection[];
  };

  // ─── Privacy ──────────────────────────────────────────────────
  privacy: {
    eyebrow: string;
    title: string;
    lastUpdated: string;
    sections: BrandPolicySection[];
  };

  // ─── Standalone policy pages ──────────────────────────────────
  shipping: { eyebrow: string; title: string; lastUpdated: string; sections: BrandPolicySection[] };
  returns: { eyebrow: string; title: string; lastUpdated: string; sections: BrandPolicySection[] };
  accessibility: { eyebrow: string; title: string; lastUpdated: string; sections: BrandPolicySection[] };

  // ─── Auth + account UX copy ───────────────────────────────────
  account: {
    loginEyebrow: string; loginTitle: string; loginSubtitle: string;
    signupEyebrow: string; signupTitle: string; signupSubtitle: string;
    accountEyebrow: string; accountTitle: string;
  };

  // ─── Contact form copy ────────────────────────────────────────
  contactPage: {
    eyebrow: string; title: string; body: string;
    reasons: string[];
    directLines: { label: string; value: string; href: string }[];
  };

  // ─── Track-order page copy ────────────────────────────────────
  trackOrder: { eyebrow: string; title: string; body: string };

  // ─── Footer ───────────────────────────────────────────────────
  footer: {
    blurb: string;
    sitemap: BrandSitemapSection[];
    /** Signup block in the footer's last column. */
    newsletter: {
      title: string;
      body: string;
      placeholder: string;
      submitLabel: string;
      successLabel: string;
    };
    poweredBy?: { label: string; href: string };
  };

  // ─── Product card (grid) ──────────────────────────────────────
  productCard: {
    /** Inline size run offered on the card. Kept short so it never wraps in a
     *  2-up mobile grid. */
    sizes: string[];
    /** Understated affordance revealed over the image on hover. */
    viewLabel: string;
    addToCartLabel: string;
    addedLabel: string;
    selectSizeToast: string;
  };

  // ─── Product detail page ──────────────────────────────────────
  pdp: {
    sizeLabel: string;
    sizeGuideLabel: string;
    /** Chart shown in the size-guide modal. */
    sizeGuide: {
      title: string;
      body: string;
      columns: string[];
      rows: string[][];
      note: string;
    };
    /** Fallback size run, used when a product carries no real variants. */
    sizes: string[];
    quantityLabel: string;
    addToCartLabel: string;
    /** Bottom-sheet heading when a size still has to be chosen. */
    selectSizeLabel: string;
    shareLabel: string;
    shareCopiedLabel: string;
    relatedTitle: string;
  };

  // ─── Journal (linked from the footer) ─────────────────────────
  journal: {
    eyebrow: string;
    title: string;
    body: string;
  };

  // ─── llms.txt summary (LLM-friendly site index) ───────────────
  llms: {
    summary: string;
  };

  // ─── Mock seed ────────────────────────────────────────────────
  mock: {
    seed: SeedName;
    businessId: string;
  };
}

export const brand: Brand = {
  name: "Amayali",
  shortName: "Amayali",
  microTag: "Your bubu plug",
  description:
    "Hand-dyed batik and adire fashion, made in Accra. Flowy maxi dresses, oversized boubou tops, and easy rompers — bold prints, effortless fits, your new go-to plug.",
  schemaType: "Store",

  currency: "GHS",
  locale: "en_GH",

  contact: {
    address: "Oxford Street, Osu, Accra",
    streetAddress: "12 Oxford Street, Osu",
    city: "Accra",
    countryCode: "GH",
    phone: "+233 24 000 0142",
    phoneTel: "+233240000142",
    email: "hello@amayali.test",
    privacyEmail: "privacy@amayali.test",
    supportEmail: "support@amayali.test",
    businessEmail: "wholesale@amayali.test",
    hours: "Mon–Sat · 9am–7pm GMT",
  },

  socials: [
    { label: "Instagram", href: "https://instagram.com/amayali", icon: "instagram" },
    { label: "TikTok", href: "https://tiktok.com/@amayali", icon: "tiktok" },
    { label: "YouTube", href: "https://youtube.com/@amayali", icon: "youtube" },
    { label: "Facebook", href: "https://facebook.com/amayali", icon: "facebook" },
  ],

  header: {
    /** Shown in the search dropdown when a query matches nothing. */
    searchEmpty: {
      title: "No results found",
      hint: "We couldn't find a match. Explore these instead.",
      categoriesLabel: "Shop by category",
      popularLabel: "Popular right now",
    },
    nav: [
      { label: "Dresses", href: "/categories/dresses" },
      { label: "Rompers", href: "/categories/rompers" },
      { label: "Skirts", href: "/categories/skirts" },
      { label: "Activewear", href: "/categories/activewear" },
      { label: "Sale", href: "/collections/sale" },
    ],
    searchPlaceholder: "Search dresses, tops, rompers…",
  },

  announceBar: {
    region: "Ship to Ghana 🇬🇭",
    items: ["Free delivery over GH₵500", "Easy 14-day returns", "Secure checkout"],
    message: "Free delivery within Accra on orders over GH₵300 · Nationwide shipping",
  },

  hero: {
    badge: "New in · Hand-dyed batik",
    eyebrow: "Hand-dyed. Ethically made.",
    title: "Bold prints, Easy fits.",
    subtitle:
      "Hand-dyed batik and adire, crafted into flowy maxi dresses, oversized boubou tops, and easy-to-wear rompers — proudly made in Ghana.",
    perk: "Free delivery within Accra on orders over GH₵300.",
    primaryCtaLabel: "Shop all",
    secondaryCtaLabel: "Shop sale",
    secondaryCtaHref: "/collections/sale",
  },

  trustItems: [
    {
      label: "Delivery",
      value: "Free over GH₵500",
      description: "Same-day in Accra, nationwide in 2–4 days.",
      iconKey: "delivery",
    },
    {
      label: "Hand-dyed",
      value: "Made in Ghana",
      description: "Each piece dyed and sewn by our studio.",
      iconKey: "warranty",
    },
    {
      label: "Easy returns",
      value: "14-day exchanges",
      description: "Fit not right? Swap the size, free in Accra.",
      iconKey: "payment",
    },
    {
      label: "Pay your way",
      value: "Momo, card & COD",
      description: "MTN MoMo, cards, or pay on delivery.",
      iconKey: "verified",
    },
  ],

  brandStrip: {
    headline: "Handcrafted in Ghana — authentic batik and adire, made to last",
    brands: [
      "Handcrafted in Ghana",
      "Limited Collections",
      "Authentic Batik & Adire",
      "Slow Fashion",
      "Made to Last",
      "Natural Fabrics",
      "Modern African Elegance",
    ],
  },

  promo: {
    badge: "Limited · while stock lasts",
    title: "The Sale Edit Has Arrived.",
    body: "Discover handpicked batik and adire pieces—now at exclusive prices for a limited time.",
    ctaLabel: "Shop the sale",
    ctaHref: "/collections/sale",
  },

  landing: {
    categories: {
      title: "Shop By Category",
      ctaLabel: "Explore",
    },

    featured: {
      eyebrow: "New in",
      title: "Fresh off the dye table.",
      ctaLabel: "Shop all new in",
      ctaHref: "/shop",
    },

    tiktok: {
      eyebrow: "As seen on TikTok",
      title: "#AmayaliStyle",
      body: "New drops, dye days and fittings — straight from the studio in Accra.",
      followLabel: "Follow @amasdaughter",
      handle: "@amasdaughter",
      profileUrl: "https://www.tiktok.com/@amasdaughter",
      watchLabel: "Watch",
      // Verified embeddable via TikTok's oEmbed endpoint.
      videoIds: [
        "7513863646192176390",
        "7508708088594140421",
        "7478969133573393669",
        "7463426280361430278",
        "7496460470627814662",
      ],
    },
  },

  shopPage: {
    eyebrow: "The marketplace",
    title: "Every piece, in one place.",
    body: "Filter by category and sort by price. Hand-dyed batik and adire, made in Ghana.",
  },

  tradeIn: {
    eyebrow: "Made to measure",
    title: "Cut to your measurements.",
    body: "Love a piece but want it in your exact size, or a different colourway? Send us your measurements and our Accra studio will hand-dye and sew it to order — usually within two weeks, no rush fee.",
    primaryCtaLabel: "Request made-to-measure",
    primaryCtaHref: "/contact",
    secondaryCtaLabel: "How it works",
    secondaryCtaHref: "/faq",
    steps: [
      { step: "01", title: "Pick your piece", body: "Choose a style and the colourway you'd like. 2 minutes." },
      { step: "02", title: "Send measurements", body: "We'll message you a simple guide — bust, waist, hip, length." },
      { step: "03", title: "We make it", body: "Hand-dyed and sewn to order, delivered in ~2 weeks." },
    ],
  },


  about: {
    eyebrow: "About Amayali",
    title: "Made for the work.\nProven on the job.",
    paragraphs: [
      "Amayali started in 1998 in a Columbus garage, cutting canvas work pants for a framing crew who kept blowing out the knees of everything else on the market. Word got around the site. Then the site next door. Twenty-five years later we still design for the same person: someone who wears their clothes to work, not to look like they might.",
      "Every piece is over-built on purpose — triple-needle stitching at the stress points, bar-tacked pockets, YKK zippers, and rivets where a seam would fail. We test on real crews before anything ships: electricians, welders, mechanics, landscapers, line cooks. If it doesn't survive a season in the field, it doesn't get a hangtag.",
      "We keep it honest on price by selling direct and skipping the middleman markup. And we stand behind all of it — a one-year build guarantee, 90-day returns even after you've worn it, and a $12 repair program so your gear earns a second life instead of a landfill.",
    ],
    sections: [
      {
        heading: "The build guarantee",
        body: "If a seam blows, a rivet pops, or a zipper quits within a year of normal work, we replace it — no receipt hunt, no runaround. Email support@amayali.test with a photo and your order number.",
      },
      {
        heading: "Outfitting a crew",
        body: "Kitting out a team or a whole shop? We do volume pricing, custom embroidery, size-run sampling, and net terms for trade accounts. Email trade@amayali.test.",
      },
      {
        heading: "Visit the shop",
        body: "1420 Foundry Row, Building C, Columbus, OH · Mon–Fri, 7am–7pm ET. Fit specialists on the floor, no appointment needed.",
      },
    ],
  },

  faq: {
    eyebrow: "Support",
    title: "Questions, answered.",
    sections: [
      {
        title: "Fit & sizing",
        items: [
          {
            q: "How do your pants fit?",
            a: "True to waist, cut with an athletic-friendly thigh and a gusseted crotch so you can crouch, climb, and kneel without splitting a seam. If you're between sizes, size down for a slim fit or stay true for a relaxed one. Every product page lists the model's height and the size they're wearing.",
          },
          {
            q: "Do you carry Big & Tall and Women's fits?",
            a: "Yes. Most core styles run waists 28–46 and lengths 28–36, with dedicated Women's cuts and a Big & Tall extension on best-sellers. Look for the fit tabs on each product page.",
          },
          {
            q: "Will they shrink?",
            a: "Our cotton canvas is pre-washed to hold its size. Expect no more than about 2% shrinkage after the first few washes. Wash cold, hang or tumble low, and skip the fabric softener — it clogs the weave.",
          },
          {
            q: "What if I order the wrong size?",
            a: "Send it back within 90 days — worn, washed, whatever. We'll swap the size or refund you. Exchanges ship free within the US.",
          },
        ],
      },
      {
        title: "Shipping & delivery",
        items: [
          {
            q: "How fast is shipping?",
            a: "Orders placed before 2pm ET ship the same business day. Standard delivery is 3–5 business days; expedited 2-day and overnight are available at checkout. Free standard shipping on orders over $99.",
          },
          {
            q: "Do you ship internationally?",
            a: "We ship to Canada and Mexico via DHL, with duties and ETA calculated at checkout. Broader international shipping is coming — join the Crew List to hear first.",
          },
          {
            q: "Can I track my order?",
            a: "Yes — you'll get a tracking link by email the moment your order leaves our warehouse, and again with any delivery updates.",
          },
        ],
      },
      {
        title: "Durability & repairs",
        items: [
          {
            q: "What does the build guarantee cover?",
            a: "Manufacturing and construction failures within one year of purchase under normal work use: blown seams, popped rivets, failed zippers, and delaminated coatings. Ordinary wear-through, abrasion, and damage from modifications aren't covered — but that's what the $12 repair program is for.",
          },
          {
            q: "How does the repair program work?",
            a: "Send us any Amayali piece that's worn but fixable. For a flat $12 (shipping both ways included) our menders patch, re-rivet, and re-proof it and send it back — usually within two weeks. Start one from the Reproof & Repair page.",
          },
          {
            q: "Are your jackets actually waterproof?",
            a: "Our shell and duck-canvas outerwear is water-resistant with taped or sealed seams on rated styles — check the spec panel on each product page for the exact rating. We re-proof coatings as part of the repair program when they wear thin.",
          },
        ],
      },
      {
        title: "Orders, payment & returns",
        items: [
          {
            q: "What payment methods do you accept?",
            a: "All major cards, Apple Pay, Google Pay, and Shop Pay. Pay-in-4 interest-free installments are available at checkout on orders over $75.",
          },
          {
            q: "What's your return policy?",
            a: "90 days, even if you've worn and washed it. If the gear didn't hold up to normal work or the fit's wrong, send it back for a refund or exchange. US returns are free; we email you a prepaid label.",
          },
          {
            q: "Do you offer trade or bulk accounts?",
            a: "Yes. Trade accounts get volume pricing, custom embroidery, and net terms. Email trade@amayali.test with your crew size and typical order and we'll set you up.",
          },
        ],
      },
    ],
    contactPrompt: "Still stuck? Email",
    contactEmail: "support@amayali.test",
  },

  terms: {
    eyebrow: "Terms of service",
    title: "Terms of Service",
    lastUpdated: "1 June 2026",
    sections: [
      {
        heading: "1. Who we are",
        body: "Amayali (\"we\", \"us\") is a direct-to-consumer workwear brand based at 1420 Foundry Row, Columbus, Ohio. By placing an order, you (\"you\", \"customer\") agree to these terms.",
      },
      {
        heading: "2. Products and sizing",
        body: "We describe fit, fabric, and construction as accurately as we can, including model measurements on every product page. Screens vary, so actual colors may differ slightly. If a product arrives not as described, our returns policy has you covered.",
      },
      {
        heading: "3. Pricing and payment",
        body: "Prices are in US dollars and exclude sales tax, which is calculated at checkout based on your delivery address. Payment is due at checkout via card, digital wallet, or an installment provider. We reserve the right to correct pricing errors and cancel affected orders with a full refund.",
      },
      {
        heading: "4. Build guarantee",
        body: "Every product carries a one-year guarantee against construction failures under normal work use — blown seams, popped rivets, and failed zippers. Ordinary wear, abrasion, and damage from alterations are excluded and eligible for our paid repair program instead.",
      },
      {
        heading: "5. Returns",
        body: "We accept returns within 90 days of delivery, including worn and washed items, for a refund or exchange. Final-sale and custom-embroidered items are non-returnable except for defects. US return shipping is free via the prepaid label we provide.",
      },
      {
        heading: "6. Repair program",
        body: "The Reproof & Repair service is offered at a flat fee per item, subject to the garment being repairable. We may decline items damaged beyond reasonable repair and will return them to you at no cost.",
      },
      {
        heading: "7. Liability",
        body: "To the maximum extent permitted by law, our liability for any claim arising from this website or your order is limited to the value of the order. Our workwear is protective apparel, not certified personal protective equipment (PPE) unless a product is explicitly labeled and rated as such.",
      },
      {
        heading: "8. Governing law",
        body: "These terms are governed by the laws of the State of Ohio, USA. Disputes will be resolved in the state or federal courts located in Franklin County, Ohio.",
      },
      {
        heading: "9. Contact",
        body: "Questions? Email crew@amayali.test.",
      },
    ],
  },

  privacy: {
    eyebrow: "Privacy",
    title: "Privacy Policy",
    lastUpdated: "1 June 2026",
    sections: [
      {
        heading: "What we collect",
        body: "We collect what we need to fulfill your order: name, shipping and billing address, email, phone, and the items in your order. Payment details are handled by our payment processors (Stripe, Shop Pay) and are never stored on our servers.",
      },
      {
        heading: "How we use it",
        body: {
          intro: "We use your data to:",
          bullets: [
            "Process, ship, and confirm your order.",
            "Handle returns, exchanges, guarantee claims, and repairs.",
            "Send order and delivery updates by email.",
            "Send product news and crew-only deals — only if you opted in. Unsubscribe anytime in one click.",
            "Analyze aggregated, anonymized browsing so we can improve fit guidance and the site.",
          ],
        },
      },
      {
        heading: "Who we share it with",
        body: "We share data only with the partners needed to run the store: payment processors (Stripe, Shop Pay), shipping carriers (UPS, USPS, DHL), our warehouse and repair partners, and our email provider. We never sell or rent your personal data.",
      },
      {
        heading: "Cookies",
        body: "We use strictly-necessary cookies to keep your cart and session working, plus optional analytics cookies you can disable in our cookie banner.",
      },
      {
        heading: "Your rights",
        body: "Depending on where you live (including under the CCPA and GDPR), you may have the right to access, correct, or delete the data we hold about you. Email privacy@amayali.test and we'll respond within 30 days.",
      },
      {
        heading: "Retention",
        body: "We keep order records for as long as needed to meet tax and accounting obligations. Marketing opt-ins are kept until you unsubscribe.",
      },
      {
        heading: "Changes",
        body: "If we make material changes to this policy, we'll email customers on our marketing list and update the \"last updated\" date above.",
      },
    ],
  },

  shipping: {
    eyebrow: "Shipping",
    title: "Shipping & Delivery",
    lastUpdated: "1 June 2026",
    sections: [
      { heading: "Free standard shipping", body: "Free on US orders over $99. Under $99, a flat $6 applies. Standard delivery is 3–5 business days." },
      { heading: "Same-day dispatch", body: "Orders placed before 2pm ET ship the same business day. Orders after that go out the next morning." },
      { heading: "Expedited options", body: "2-day and overnight shipping are available at checkout, priced live by your address and order weight." },
      { heading: "Canada & Mexico", body: "Shipped via DHL with duties and ETA calculated at checkout — typically 5–8 business days." },
      { heading: "Tracking", body: "You'll get a tracking link by email the moment your order leaves the warehouse, plus delivery updates along the way." },
    ],
  },

  returns: {
    eyebrow: "Returns",
    title: "Returns & Guarantee",
    lastUpdated: "1 June 2026",
    sections: [
      { heading: "90-day returns", body: "Return anything within 90 days — even worn and washed — for a refund or exchange. US return shipping is free." },
      { heading: "Free exchanges", body: "Wrong size or fit? Exchanges ship free within the US. Start one from your account or the track-order page." },
      { heading: "One-year build guarantee", body: "Blown seams, popped rivets, or failed zippers under normal work use within a year? We replace it. Email a photo and your order number." },
      { heading: "Final sale & custom", body: "Clearance final-sale items and custom-embroidered orders are non-returnable except for defects." },
      { heading: "How to start", body: "Email support@amayali.test with your order number, or use the track-order page. We'll email a prepaid label." },
    ],
  },

  accessibility: {
    eyebrow: "Accessibility",
    title: "Accessibility Statement",
    lastUpdated: "1 June 2026",
    sections: [
      { heading: "Our commitment", body: "We aim for WCAG 2.1 AA on this site and test against it on every release." },
      { heading: "What we've done", body: { intro: "Specifically, we've:", bullets: [
        "Maintained a minimum 4.5:1 contrast ratio on body text.",
        "Ensured every interactive element is keyboard-reachable with visible focus.",
        "Labelled images, icons, and form fields for screen-reader users.",
        "Respected `prefers-reduced-motion` and avoided motion-gated interactions.",
      ] } },
      { heading: "Reporting issues", body: "Email accessibility@amayali.test. We respond within 5 business days." },
    ],
  },

  account: {
    loginEyebrow: "Welcome back",
    loginTitle: "Sign in to Amayali",
    loginSubtitle: "Track orders, start returns and repairs, and check out faster.",
    signupEyebrow: "Join the crew",
    signupTitle: "Create your Amayali account",
    signupSubtitle: "Save your sizes and addresses, track orders, start repairs, and unlock crew-only deals.",
    accountEyebrow: "Your account",
    accountTitle: "Welcome back",
  },

  contactPage: {
    eyebrow: "Contact",
    title: "Talk to a real human.",
    body: "Sizing help, an order issue, a guarantee claim, or a trade account — send a note and we'll reply within a business day.",
    reasons: ["Fit & sizing help", "An order issue", "Return or exchange", "Guarantee claim", "Reproof & repair", "Trade / bulk account"],
    directLines: [
      { label: "Email", value: "crew@amayali.test", href: "mailto:crew@amayali.test" },
      { label: "Phone", value: "+1 (614) 555-0142", href: "tel:+16145550142" },
      { label: "Trade sales", value: "trade@amayali.test", href: "mailto:trade@amayali.test" },
    ],
  },

  trackOrder: {
    eyebrow: "Track an order",
    title: "Where's my order?",
    body: "Enter your order number and email. We'll show the live status, courier tracking, and estimated delivery.",
  },

  footer: {
    blurb:
      "Hand-dyed batik and adire, made in Ghana. Flowy maxis, boubou tops, and easy rompers — cut in small batches, never mass-produced.",
    sitemap: [
      {
        title: "Shop",
        links: [
          { label: "Dresses", href: "/categories/dresses" },
          { label: "Skirts", href: "/categories/skirts" },
          { label: "Rompers", href: "/categories/rompers" },
        ],
      },
      {
        title: "About",
        links: [
          { label: "Our Story", href: "/about" },
          { label: "Journal", href: "/journal" },
          { label: "Contact", href: "/contact" },
        ],
      },
      {
        title: "Help",
        links: [
          { label: "Shipping", href: "/shipping" },
          { label: "Returns", href: "/returns" },
          { label: "FAQ", href: "/faq" },
        ],
      },
    ],
    newsletter: {
      title: "Join our community.",
      body: "New drops, restocks, and subscriber-only perks.",
      placeholder: "Email address",
      submitLabel: "Subscribe",
      successLabel: "You're in — welcome.",
    },
    poweredBy: { label: "Cimplify", href: "https://app.cimplify.io" },
  },

  productCard: {
    sizes: ["S", "M", "L", "XL"],
    viewLabel: "View",
    addToCartLabel: "Add to Cart",
    addedLabel: "Added to Cart",
    selectSizeToast: "Please select a size.",
  },

  pdp: {
    sizeLabel: "Size",
    sizeGuideLabel: "Size Guide",
    sizeGuide: {
      title: "Size Guide",
      body: "Find your perfect fit with our size guide.",
      columns: ["Size", "UK", "Bust", "Waist", "Hips"],
      rows: [
        ["S", "8–10", "84–89 cm", "66–71 cm", "91–96 cm"],
        ["M", "12", "90–95 cm", "72–77 cm", "97–102 cm"],
        ["L", "14", "96–101 cm", "78–83 cm", "103–108 cm"],
        ["XL", "16", "102–107 cm", "84–89 cm", "109–114 cm"],
      ],
      note: "All measurements are in centimeters (cm). Measurements may vary slightly by style.",
    },
    sizes: ["S", "M", "L", "XL"],
    quantityLabel: "Quantity",
    addToCartLabel: "Add to Cart",
    selectSizeLabel: "Select a size",
    shareLabel: "Share",
    shareCopiedLabel: "Link copied",
    relatedTitle: "You may also like",
  },

  journal: {
    eyebrow: "Journal",
    title: "Stories from the dye table.",
    body: "Notes on batik and adire, the artisans behind each print, and how a piece travels from wax to wardrobe. First entries landing soon.",
  },

  llms: {
    summary:
      "Amayali is a Ghanaian direct-to-consumer fashion boutique specialising in hand-dyed batik and adire womenswear: flowy maxi dresses, oversized boubou tops, and rompers, made in Accra. Free Accra delivery over GH₵500, nationwide shipping, 14-day exchanges, made-to-measure on request, and payment by MTN MoMo, card, or cash on delivery.",
  },

  mock: {
    seed: "retail",
    businessId: "bus_bedrock",
  },
};
