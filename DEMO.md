# Amayali — Demo mode

This storefront can run as a **self-contained demo** (no Cimplify backend, no
mock process) or **live** against hosted Cimplify. One env flag switches it.

## How it works

`NEXT_PUBLIC_DEMO_MODE=true` mounts the SDK's in-memory mock
(`@cimplify/sdk/mock`, seeded from [`cimplify.seed.ts`](cimplify.seed.ts))
*inside* the Next app:

- **Server reads** (catalogue, categories, product pages) use an in-memory
  client — [`lib/demo-server-client.ts`](lib/demo-server-client.ts) via the
  demo-aware wrapper [`lib/store-client.ts`](lib/store-client.ts).
- **Browser cart writes** go same-origin to `/api/v1/*`, which
  [`next.config.ts`](next.config.ts) rewrites to the in-app route handler
  [`app/api/mock/[...path]/route.ts`](app/api/mock/[...path]/route.ts) wrapping
  the same mock.

So browsing, product detail, and **add-to-cart all work with no backend** —
deploy it straight to Vercel and hand a client the link.

**Caveat:** the mock holds state in memory. On serverless (Vercel), instances
are ephemeral and not shared, so a cart can reset on a cold start or if a
request lands on a different instance. Fine for a click-through demo; not
durable commerce. That's what going live fixes.

## Deploy the demo to Vercel

1. Import the repo in Vercel (framework auto-detects Next.js).
2. Deploy. `.env.production` already sets `NEXT_PUBLIC_DEMO_MODE=true`, so no
   env config is needed.
3. `bun run build` is the exact command Vercel runs — keep it green.

## Switch to live (when the client agrees)

No code change. In **Vercel → Settings → Environment Variables** (these
override `.env.production`):

```
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_CIMPLIFY_PUBLIC_KEY=cpk_live_xxxxxxxx
```

Redeploy. Every read/write now routes to hosted Cimplify. To deploy to
Cimplify's own hosting instead, follow the steps in the storefront skill
(`cimplify login` → `projects create` → `link` → `env push` → `deploy --prod`).

## Products

The 11 demo products are defined in [`cimplify.seed.ts`](cimplify.seed.ts) with
photos in [`public/products/`](public/products/). Edit the seed to change
names, prices, categories, or images, then rebuild.
