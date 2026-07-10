import {
  AccountDashboardPage,
  AccountSignedOutPrompt,
} from "@cimplify/sdk/react";
import type { CustomerAddress, CustomerMobileMoney } from "@cimplify/sdk";
import { brand } from "@/lib/brand";
import { ACCOUNT_NAV, apiFetch, serverAccessToken, serverSession } from "@/lib/cimplify-server";

const CLIENT_ID = process.env.NEXT_PUBLIC_CIMPLIFY_CLIENT_ID ?? "";
const REDIRECT_URI = process.env.CIMPLIFY_REDIRECT_URI ?? "";

export default async function AccountPage() {
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
  const [addresses, wallets] = await Promise.all([
    apiFetch<CustomerAddress[]>("/v1/link/addresses", { bearer }),
    apiFetch<CustomerMobileMoney[]>("/v1/link/mobile-money", { bearer }),
  ]);

  return (
    <AccountDashboardPage
      customerName={session.name ?? ""}
      customerEmail={session.email}
      customerId={session.sub}
      merchantName={brand.name}
      nav={ACCOUNT_NAV}
      identitySummary={{
        addresses: addresses?.length ?? 0,
        paymentMethods: wallets?.length ?? 0,
      }}
    />
  );
}
