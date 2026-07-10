import { buildSignoutCookies } from "@cimplify/sdk/server";

const CLIENT_ID = process.env.CIMPLIFY_CLIENT_ID ?? "";

export async function POST(): Promise<Response> {
  const headers = new Headers({ "Content-Type": "application/json" });
  for (const cookie of buildSignoutCookies({ clientId: CLIENT_ID })) {
    headers.append("Set-Cookie", cookie);
  }
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
}
