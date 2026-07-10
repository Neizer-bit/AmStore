"use client";

import { useEffect, useState } from "react";

const MESSAGES: Record<string, string> = {
  state_mismatch: "Sign-in didn't complete. Please try again.",
  exchange_failed: "We couldn't finish signing you in. Please try again.",
  missing_code: "Sign-in didn't complete. Please try again.",
  missing_id_token: "Sign-in didn't complete. Please try again.",
  id_token_invalid: "Sign-in didn't complete. Please try again.",
  access_denied: "Sign-in was cancelled.",
  login_required: "Please sign in to continue.",
};

export function AuthErrorToast() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const err = url.searchParams.get("cimplify_auth_error");
    if (!err) return;
    setMessage(MESSAGES[err] ?? "Sign-in didn't complete. Please try again.");
    url.searchParams.delete("cimplify_auth_error");
    window.history.replaceState(null, "", url.toString());
  }, []);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-sm rounded-lg bg-zinc-900 text-white px-4 py-3 text-sm shadow-lg flex items-center gap-3"
    >
      <span>{message}</span>
      <button
        type="button"
        onClick={() => setMessage(null)}
        aria-label="Dismiss"
        className="text-zinc-400 hover:text-white transition-colors text-base leading-none"
      >
        ×
      </button>
    </div>
  );
}
