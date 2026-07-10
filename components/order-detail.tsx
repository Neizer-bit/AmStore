"use client";

import { useRouter } from "next/navigation";
import { AccountOrderView, type AccountOrderViewProps } from "@cimplify/sdk/react";

// Thin client wrapper so the server page can pass the (serializable) view-model
// while `onBack` (a function) is supplied on the client.
export function OrderDetail(props: AccountOrderViewProps) {
  const router = useRouter();
  return <AccountOrderView {...props} onBack={() => router.push("/account/orders")} />;
}
