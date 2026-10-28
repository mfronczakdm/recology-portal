import type { Metadata } from "next";
import { PaymentView } from "@/components/dashboard/payment-view";
import { getInvoices } from "@/lib/amcs/client";

export const metadata: Metadata = { title: "Make a Payment" };

export default async function PaymentPage() {
  const invoices = await getInvoices();
  return <PaymentView invoices={invoices} />;
}
