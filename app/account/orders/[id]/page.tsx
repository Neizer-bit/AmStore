import { notFound } from "next/navigation";
import { AccountSignedOutPrompt, toAccountOrderView } from "@cimplify/sdk/react";
import type { EnrichedOrder } from "@cimplify/sdk";
import { brand } from "@/lib/brand";
import { apiFetch, serverAccessToken, serverSession } from "@/lib/cimplify-server";
import { OrderDetail } from "@/components/order-detail";

const CLIENT_ID = process.env.NEXT_PUBLIC_CIMPLIFY_CLIENT_ID ?? "";
const REDIRECT_URI = process.env.CIMPLIFY_REDIRECT_URI ?? "";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await serverSession();
  if (!session) {
    return (
      <AccountSignedOutPrompt
        clientId={CLIENT_ID}
        redirectUri={REDIRECT_URI}
        eyebrow={brand.account.loginEyebrow}
        title={brand.account.loginTitle}
        description={brand.account.loginSubtitle}
      />
    );
  }

  const bearer = await serverAccessToken();
  const order = await apiFetch<EnrichedOrder>(`/api/v1/orders/${encodeURIComponent(id)}`, {
    bearer,
  });
  if (!order) notFound();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <OrderDetail {...toAccountOrderView(order)} />
    </div>
  );
}
