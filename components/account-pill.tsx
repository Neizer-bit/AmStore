"use client";

import { useEffect, useRef } from "react";
import { CimplifyUserButton, useCimplifySession } from "@cimplify/sdk/react";
import { signInSilent } from "@cimplify/sdk";

const CLIENT_ID = process.env.NEXT_PUBLIC_CIMPLIFY_CLIENT_ID ?? "";

// Attempts silent SSO on mount before showing the button so returning
// shoppers don't see a flash of "Sign in" before landing as signed in.
export function AccountPill() {
  const { session, loading, refresh } = useCimplifySession();
  const triedSilent = useRef(false);

  useEffect(() => {
    if (triedSilent.current || session || !CLIENT_ID) return;
    triedSilent.current = true;
    void signInSilent({
      clientId: CLIENT_ID,
      redirectUri: `${window.location.origin}/auth/callback`,
    }).then((r) => {
      if (r.ok) refresh();
    });
  }, [session, refresh]);

  if (loading) return <span className="h-9 w-24" aria-hidden />;

  return (
    <CimplifyUserButton
      session={session}
      clientId={CLIENT_ID}
      redirectUri={`${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`}
      onSignIn={refresh}
    />
  );
}
