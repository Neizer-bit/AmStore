"use client";

import { useRouter } from "next/navigation";
import { CheckoutPage as SdkCheckoutPage } from "@cimplify/sdk/react";

export default function CheckoutPage() {
  const router = useRouter();
  return (
    <SdkCheckoutPage
      onComplete={(result) => {
        if (result.success && result.order) {
          router.push(`/orders/${result.order.id}`);
        }
      }}
    />
  );
}
