import "server-only";
import { cache } from "react";
import { createCimplifyClient } from "@cimplify/sdk";
import { getMockApp } from "./demo-mock-app";

type CimplifyClient = ReturnType<typeof createCimplifyClient>;

/**
 * A Cimplify server client whose HTTP layer is short-circuited into the
 * in-memory demo mock (no network, no port). Server Components use this in
 * demo mode so SSR/ISR render the seeded catalogue with zero backend.
 *
 * Memoised per request via React `cache()`, matching the SDK's own
 * `getServerClient` semantics.
 */
export const getDemoServerClient = cache((): CimplifyClient => {
  const { app } = getMockApp();

  const mockFetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const req = input instanceof Request ? input : new Request(String(input), init);
    // Hono routes on the pathname; the demo.local origin just keeps the URL valid.
    return Promise.resolve(app.fetch(req)) as Promise<Response>;
  };

  return createCimplifyClient({
    baseUrl: "http://demo.local",
    publicKey: "mock-dev",
    suppressPublicKeyWarning: true,
    // `fetch` is a supported low-level override on createCimplifyClient but is
    // not in the public option types, so we widen the config object here.
    fetch: mockFetch,
  } as Parameters<typeof createCimplifyClient>[0]);
});
