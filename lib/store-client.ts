/**
 * Demo-aware server client.
 *
 * `getServerClient()` returns the in-memory demo client when
 * `NEXT_PUBLIC_DEMO_MODE=true`, otherwise the stock SDK server client (which
 * talks to hosted Cimplify). Catalogue pages import `getServerClient`, `tags`,
 * and the product/category/collection types from here instead of directly from
 * `@cimplify/sdk/server`, so a single flag flips the whole storefront between
 * "demo, no backend" and "live".
 *
 * NOTE: the demo mock engine is statically imported, so it is bundled in both
 * modes. That's intended for the Vercel demo. If a live build targets a
 * size-constrained runtime (e.g. Cloudflare Workers via opennext), lazy-load
 * `getDemoServerClient` behind the flag before that deploy.
 */
export { tags } from "@cimplify/sdk/server";
export type {
  Product,
  Category,
  Collection,
  ProductWithDetails,
} from "@cimplify/sdk/server";

import { getServerClient as sdkGetServerClient } from "@cimplify/sdk/server";
import { getDemoServerClient } from "./demo-server-client";
import { IS_DEMO } from "./demo";

export function getServerClient(
  opts?: Parameters<typeof sdkGetServerClient>[0],
): ReturnType<typeof sdkGetServerClient> {
  return IS_DEMO ? getDemoServerClient() : sdkGetServerClient(opts);
}
