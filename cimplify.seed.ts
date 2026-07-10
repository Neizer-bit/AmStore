import { defineSeed } from "@cimplify/sdk/mock";

/**
 * Amayali — local mock catalogue.
 *
 * A Ghanaian hand-dyed batik / adire women's-fashion boutique. Built from
 * scratch so the storefront serves real fashion categories, collections, and
 * products. The mock server loads this via `--seed-module ./cimplify.seed.ts`
 * (see package.json `dev`).
 *
 * Product photography is served from `public/products/` (same-origin).
 * Photos 1–11 are the current studio range (tan-backdrop lookbook shots).
 */

/** Same-origin product photo from public/products/. */
const shot = (n: number) => `/products/${n}.jpg`;

export default defineSeed((ctx) => {
  const biz = ctx.business({
    name: "Amayali",
    handle: "bedrock", // keep stable — businessId (bus_bedrock) is referenced by tests + orders page
    business_type: "retail",
    default_currency: "GHS",
    country_code: "GH",
    timezone: "Africa/Accra",
    email: "hello@amayali.test",
    is_online_only: true,
  });

  // ─── Categories ────────────────────────────────────────────────
  const dresses = ctx.category({ name: "Dresses", slug: "dresses", displayOrder: 1, image: shot(7) });
  const rompers = ctx.category({ name: "Rompers", slug: "rompers", displayOrder: 2, image: shot(1) });
  const skirts = ctx.category({ name: "Skirts", slug: "skirts", displayOrder: 3, image: shot(4) });
  const activewear = ctx.category({ name: "Activewear", slug: "activewear", displayOrder: 4, image: shot(5) });

  // ─── Collections ───────────────────────────────────────────────
  const sale = ctx.collection({ name: "Sale", slug: "sale", description: "Marked-down pieces while stock lasts — GH₵100–250." });

  // ─── On Sale (GH₵100–250) ──────────────────────────────────────
  ctx.product({
    name: "Afua Colour-Stripe Camp Romper", slug: "afua-colour-stripe-camp-romper", price: "140.00", category: rompers, collection: sale,
    description: "A breezy camp-collar romper in bold rainbow stripes on black, with a drawstring waist and roomy shorts. Throw it on for market runs or a beach day — zero fuss, all colour.",
    image: shot(1), tags: ["Sale"],
  });
  ctx.product({
    name: "Yaa Gingham Cami & Tiered Skirt Set", slug: "yaa-gingham-cami-tiered-skirt-set", price: "165.00", category: skirts, collection: sale,
    description: "A two-piece set pairing a ribbed white cami with an asymmetric, tiered black-and-white gingham skirt. Picnic-perfect and easy to mix back with what you already own.",
    image: shot(2), tags: ["Sale"],
  });
  ctx.product({
    name: "Adjoa Smocked Batik Mini · Wine", slug: "adjoa-smocked-batik-mini-wine", price: "150.00", category: dresses, collection: sale,
    description: "Wine-red batik mini with a stretchy smocked bodice and a triple-ruffle skirt. Adjustable straps, playful movement. Your go-to for a night out.",
    image: shot(3), tags: ["Sale"],
  });
  ctx.product({
    name: "Abena Tiered Batik Maxi Skirt", slug: "abena-tiered-batik-maxi-skirt", price: "210.00", category: skirts, collection: sale,
    description: "A full, twirl-worthy maxi skirt panelled in five hand-dyed batik tiers — marigold, forest, rose, indigo, and red. Elastic waist, deep gathers. Pairs with a plain tank for instant drama.",
    image: shot(4), tags: ["Sale"],
  });
  ctx.product({
    name: "Kekeli Active Zip Set · Olive", slug: "kekeli-active-zip-set-olive", price: "250.00", category: activewear, collection: sale,
    description: "Two-piece activewear set: a colour-blocked zip jacket with a sculpting olive-and-black panel and matching high-waist leggings. Soft, squat-proof stretch that moves with you from studio to street.",
    image: shot(5), tags: ["Sale"],
  });
  ctx.product({
    name: "Ama Adire Slip Maxi · Emerald", slug: "ama-adire-slip-maxi-emerald", price: "230.00", category: dresses, collection: sale,
    description: "A featherlight, gathered-neck slip maxi in an emerald adire wash streaked with lime and gold. Floaty spaghetti straps and endless drape — pure holiday ease.",
    image: shot(6), tags: ["Sale"],
  });
  ctx.product({
    name: "Akosua Adire Halter Maxi · Marigold", slug: "akosua-adire-halter-maxi-marigold", price: "225.00", category: dresses, collection: sale,
    description: "Sunny marigold halter maxi splashed with cream tie-dye blooms. A tie-neck, gathered yoke, and generous swing make it a warm-weather statement.",
    image: shot(7), tags: ["Sale"],
  });
  ctx.product({
    name: "Efua Batik Halter Maxi · Rust", slug: "efua-batik-halter-maxi-rust", price: "220.00", category: dresses, collection: sale,
    description: "Deep rust-and-black batik halter maxi with a hand-drawn scallop print. Self-tie neck and a soft, columnar drape that skims and flatters.",
    image: shot(8), tags: ["Sale"],
  });
  ctx.product({
    name: "Nana Batik Halter Playsuit · Forest", slug: "nana-batik-halter-playsuit-forest", price: "130.00", category: rompers, collection: sale,
    description: "Forest-green batik playsuit in an indigo-dot tie-dye, with a tie halter neck and swingy wide-leg shorts. Effortless, breezy, and made to move.",
    image: shot(9), tags: ["Sale"],
  });
  ctx.product({
    name: "Serwaa Batik Kimono Tunic · Sunflower", slug: "serwaa-batik-kimono-tunic-sunflower", price: "100.00", category: dresses, collection: sale,
    description: "Sunflower-yellow batik tunic with sunburst tie-dye motifs, a contrast magenta shawl collar and patch pocket. Oversized kimono cut — layer it or wear it solo.",
    image: shot(10), tags: ["Sale"],
  });
  ctx.product({
    name: "Maabena Cross-Print Fringe Tunic · Cobalt", slug: "maabena-cross-print-fringe-tunic-cobalt", price: "190.00", category: dresses, collection: sale,
    description: "A bold cobalt cross-print tunic dress with a sky-blue shawl panel and burgundy fringed kimono sleeves. Art-piece energy, everyday comfort.",
    image: shot(11), tags: ["Sale"],
  });

  return { businessId: biz.id };
});
