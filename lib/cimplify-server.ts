import { cookies } from "next/headers";
import {
  getAccessTokenFromCookieHeader,
  getSessionFromCookieHeader,
} from "@cimplify/sdk/server";
import type { NavItem } from "@cimplify/sdk/react";

export const ACCOUNT_NAV: NavItem[] = [
  { label: "Dashboard", href: "/account" },
  { label: "Orders", href: "/account/orders" },
  { label: "Cimplify identity", href: "https://link.cimplify.io", external: true },
];

const CLIENT_ID = process.env.CIMPLIFY_CLIENT_ID ?? "";
const ISSUER = (process.env.CIMPLIFY_ISSUER ?? "https://api.cimplify.io").replace(/\/$/, "");

const OIDC_CONFIG = { clientId: CLIENT_ID, issuer: ISSUER };

async function cookieHeader(): Promise<string> {
  const store = await cookies();
  return store.getAll().map((c) => `${c.name}=${c.value}`).join("; ");
}

export async function serverSession() {
  return getSessionFromCookieHeader(OIDC_CONFIG, await cookieHeader());
}

export async function serverAccessToken(): Promise<string | null> {
  return getAccessTokenFromCookieHeader(OIDC_CONFIG, await cookieHeader());
}

interface Envelope<T> {
  data: T;
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit & { bearer: string | null },
): Promise<T | null> {
  if (!init.bearer) return null;
  const { bearer, ...rest } = init;
  const headers = new Headers(rest.headers);
  headers.set("Authorization", `Bearer ${bearer}`);
  headers.set("Accept", "application/json");
  if (rest.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(`${ISSUER}${path}`, { ...rest, headers, cache: "no-store" });
  if (!res.ok) return null;
  const envelope = (await res.json()) as Envelope<T>;
  return envelope.data;
}
