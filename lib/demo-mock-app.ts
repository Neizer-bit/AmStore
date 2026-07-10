import "server-only";
import { createMockApp, type MockApp } from "@cimplify/sdk/mock";
import seed from "@/cimplify.seed";

/**
 * Singleton in-memory mock backend for demo mode.
 *
 * `createMockApp` builds a Hono app with all the `/api/v1/*` routes the SDK
 * client expects (catalogue, cart, checkout, orders …), holding state in
 * memory. We stash it on `globalThis` so a single warm serverless instance
 * keeps one catalogue + cart across requests.
 *
 * Caveat (documented): serverless instances are ephemeral and not shared, so
 * cart contents can reset on a cold start or when a request lands on a
 * different instance. Fine for a click-through demo; not durable commerce.
 */
const KEY = "__amayali_demo_mock_app__";

type Holder = typeof globalThis & { [KEY]?: MockApp };

export function getMockApp(): MockApp {
  const g = globalThis as Holder;
  if (!g[KEY]) {
    g[KEY] = createMockApp({ seed: { kind: "fn", seed } });
  }
  return g[KEY]!;
}
