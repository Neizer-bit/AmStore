/**
 * Ambient types for `@cimplify/sdk/mock`, which ships as JS without a `.d.ts`.
 * Covers the `defineSeed` builder surface used by `cimplify.seed.ts` so the
 * seed (and any test that imports it) type-checks under `noImplicitAny`.
 */
declare module "@cimplify/sdk/mock" {
  interface SeedEntity {
    id: string;
  }

  // Inputs are typed loosely (the underlying mock builder accepts broad,
  // industry-varying shapes). `any` here keeps this ambient `SeedFn`
  // structurally compatible with the SDK's stricter internal `SeedFn` when the
  // seed is handed to `createCartFlowSuite({ seed: { kind: "fn", … } })`.
  interface SeedContext {
    readonly registry: unknown;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    business(input: any): SeedEntity;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    category(input: any): SeedEntity;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    collection(input: any): SeedEntity;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    product(input: any): SeedEntity;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    service(input: any): SeedEntity;
    image(industry: string, slug: string): string;
    extend(name: string): { businessId: string };
  }

  export type SeedFn = (ctx: SeedContext) => { businessId: string };

  export function defineSeed(seed: SeedFn): SeedFn;

  /** Seed source accepted by `createMockApp`. */
  export type SeedSource =
    | string
    | { kind: "fn"; seed: SeedFn }
    | { kind: "builtin"; name: string }
    | { kind: "json"; data: unknown; businessId?: string };

  /** Minimal shape of the in-memory Hono mock app used by the embedded demo. */
  export interface MockApp {
    app: {
      fetch: (req: Request) => Response | Promise<Response>;
      request: (path: string, init?: RequestInit) => Promise<Response>;
    };
    deps: { defaultBusinessId: string; resetAll: (seed?: SeedSource) => string };
    request: (path: string, init?: RequestInit) => Promise<Response>;
  }

  /**
   * Build an in-process mock backend (a Hono app) with no HTTP server.
   * Mount `app.fetch` in a Next.js route handler, or drive `app.request`
   * directly from a server-side client. Node runtime only.
   */
  export function createMockApp(options?: { seed?: SeedSource; [key: string]: unknown }): MockApp;
}
