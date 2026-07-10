/**
 * Demo-mode flag.
 *
 * When `NEXT_PUBLIC_DEMO_MODE=true`, the storefront serves an **embedded**
 * mock backend (from `@cimplify/sdk/mock`, seeded by `cimplify.seed.ts`) so
 * the whole site — browsing, product pages, add-to-cart — works with **no
 * live Cimplify tenant and no separate mock process**. This is what we deploy
 * to Vercel to hand a client a clickable demo.
 *
 * To go live: set `NEXT_PUBLIC_DEMO_MODE=false` (or unset) and set
 * `NEXT_PUBLIC_CIMPLIFY_PUBLIC_KEY=cpk_live_…`. Every read/write then routes
 * to hosted Cimplify exactly as the stock template does.
 *
 * `NEXT_PUBLIC_*` is inlined at build time, so the dead branch is dropped from
 * the bundle in whichever mode you build.
 */
export const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
