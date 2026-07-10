import {
  AccountOrdersPage,
  AccountSignedOutPrompt,
} from "@cimplify/sdk/react";
import type { OrderRowData, OrderRowStatus } from "@cimplify/sdk/react";
import type { Order, OrderStatus } from "@cimplify/sdk";
import { formatMoney } from "@cimplify/sdk";
import { brand } from "@/lib/brand";
import { ACCOUNT_NAV, apiFetch, serverAccessToken, serverSession } from "@/lib/cimplify-server";

const CLIENT_ID = process.env.NEXT_PUBLIC_CIMPLIFY_CLIENT_ID ?? "";
const REDIRECT_URI = process.env.CIMPLIFY_REDIRECT_URI ?? "";

function mapStatus(status: OrderStatus): OrderRowStatus {
  switch (status) {
    case "in_preparation":
    case "ready_to_serve":
    case "partially_served":
      return { kind: "preparing", label: "Preparing" };
    case "delivered":
      return { kind: "delivered" };
    case "picked_up":
      return { kind: "delivered", label: "Picked up" };
    case "served":
    case "completed":
      return { kind: "completed" };
    case "cancelled":
    case "refunded":
      return { kind: "cancelled", label: status === "refunded" ? "Refunded" : undefined };
    case "pending":
    case "created":
    case "confirmed":
    default:
      return { kind: "active", label: "Confirmed" };
  }
}

function relativeMeta(iso: string, orderNumber: string): string {
  const when = new Date(iso);
  const formatted = when.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: when.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
  });
  return `Order ${orderNumber} · ${formatted}`;
}

function toRowData(order: Order): OrderRowData {
  const count = order.items?.length ?? 0;
  return {
    id: order.id,
    href: `/account/orders/${order.id}`,
    summary: count > 0 ? `${count} ${count === 1 ? "item" : "items"}` : "Order",
    meta: relativeMeta(order.created_at, order.user_friendly_id ?? order.id),
    status: mapStatus(order.status),
    total: formatMoney(order.total_price, order.currency),
  };
}

export default async function OrdersPage() {
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
  const orders = await apiFetch<Order[]>(
    `/v1/link/orders?business_id=${encodeURIComponent(brand.mock.businessId)}`,
    { bearer },
  );

  return (
    <AccountOrdersPage
      customerName={session.name ?? ""}
      customerEmail={session.email}
      customerId={session.sub}
      merchantName={brand.name}
      nav={ACCOUNT_NAV}
      orders={(orders ?? []).map(toRowData)}
    />
  );
}
