import { handleSessionRequest } from "@cimplify/sdk/server";

const CLIENT_ID = process.env.CIMPLIFY_CLIENT_ID ?? "";
const ISSUER = process.env.CIMPLIFY_ISSUER;

export async function GET(req: Request): Promise<Response> {
  if (!CLIENT_ID) {
    return Response.json({ sub: null }, { status: 200 });
  }
  return handleSessionRequest(req, { clientId: CLIENT_ID, issuer: ISSUER });
}
