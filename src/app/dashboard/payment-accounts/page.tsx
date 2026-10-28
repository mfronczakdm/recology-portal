import type { Metadata } from "next";
import { PaymentAccountsView } from "@/components/dashboard/payment-accounts-view";
import { getPaymentAccounts } from "@/lib/amcs/client";

export const metadata: Metadata = { title: "Payment Accounts" };

export default async function PaymentAccountsPage() {
  const accounts = await getPaymentAccounts();
  return <PaymentAccountsView accounts={accounts} />;
}
