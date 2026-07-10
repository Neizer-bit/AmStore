import { getMockApp } from "@/lib/demo-mock-app";

/**
 * Embedded demo API.
 *
 * In demo mode, `next.config.ts` rewrites same-origin `/api/v1/*` (the SDK
 * client's base path for catalogue reads AND cart writes) to `/api/mock/*`,
 * which this catch-all serves from the in-memory mock. No live backend, no
 * separate mock server.
 *
 * When demo mode is off there is no rewrite pointing here, so this route is
 * dormant and the live `/api/v1/*` rewrite to hosted Cimplify is untouched.
 * (The folder is not underscore-prefixed — those are private and never routed.)
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function handler(req: Request): Promise<Response> {
  const { app } = getMockApp();
  const url = new URL(req.url);
  // Translate /api/mock/<rest> back to the /api/v1/<rest> the mock router expects.
  url.pathname = url.pathname.replace(/^\/api\/mock/, "/api/v1");
  const proxied = new Request(url.toString(), req);
  return app.fetch(proxied);
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
  handler as OPTIONS,
  handler as HEAD,
};
