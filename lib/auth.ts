import { headers } from "next/headers";
import {
  getAccessTokenFromCookieHeader,
  getSessionFromCookieHeader,
  type CimplifyClient,
  type CimplifySession,
} from "@cimplify/sdk/server";
import { getServerClient } from "@/lib/store-client";

const CLIENT_ID = process.env.CIMPLIFY_CLIENT_ID ?? "";
const ISSUER = process.env.CIMPLIFY_ISSUER;

const oidcConfig = { clientId: CLIENT_ID, issuer: ISSUER };

export async function getSession(): Promise<CimplifySession | null> {
  if (!CLIENT_ID) return null;
  const cookieHeader = (await headers()).get("cookie");
  return getSessionFromCookieHeader(oidcConfig, cookieHeader);
}

// Returns a Cimplify server client with the signed-in customer's access
// token attached (if any). Use this instead of getServerClient() on pages
// that need personalized data: orders, subscriptions, price-list pricing.
// Pages without `revalidate: 0` will share a cache across customers, so
// only use this on routes that opt out of static caching.
export async function getAuthenticatedServerClient(): Promise<CimplifyClient> {
  const cookieHeader = (await headers()).get("cookie");
  const accessToken =
    CLIENT_ID && cookieHeader
      ? getAccessTokenFromCookieHeader(oidcConfig, cookieHeader) ?? undefined
      : undefined;
  return getServerClient({ accessToken });
}

export type { CimplifySession } from "@cimplify/sdk/server";
