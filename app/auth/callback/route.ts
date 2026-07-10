import { handleOidcCallback, handleRedirectCallback } from "@cimplify/sdk/server";

const CLIENT_ID = process.env.CIMPLIFY_CLIENT_ID ?? "";
const ISSUER = process.env.CIMPLIFY_ISSUER;
const REDIRECT_URI = process.env.CIMPLIFY_REDIRECT_URI ?? "";

// Redirect sign-in: the browser lands here via a top-level GET carrying ?code.
export async function GET(req: Request): Promise<Response> {
  if (!CLIENT_ID || !REDIRECT_URI) {
    return Response.json({ error: "oidc_not_configured" }, { status: 500 });
  }
  return handleRedirectCallback(req, {
    clientId: CLIENT_ID,
    issuer: ISSUER,
    redirectUri: REDIRECT_URI,
    defaultReturnTo: "/account",
  });
}

// Modal/silent sign-in: posts {code, codeVerifier, state} here for exchange.
export async function POST(req: Request): Promise<Response> {
  if (!CLIENT_ID || !REDIRECT_URI) {
    return Response.json({ error: "oidc_not_configured" }, { status: 500 });
  }
  return handleOidcCallback(req, {
    clientId: CLIENT_ID,
    issuer: ISSUER,
    redirectUri: REDIRECT_URI,
  });
}
