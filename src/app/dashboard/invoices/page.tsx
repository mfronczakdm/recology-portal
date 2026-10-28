import type { Metadata } from "next";
import { InvoicesView } from "@/components/dashboard/invoices-view";
import { getInvoices } from "@/lib/amcs/client";

export const metadata: Metadata = { title: "Invoices & Statements" };

export default async function InvoicesPage() {
  const invoices = await getInvoices();
  return <InvoicesView invoices={invoices} />;
}
