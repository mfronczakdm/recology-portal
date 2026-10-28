"use client";

import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { PayPanel } from "@/components/payment/pay-panel";
import { useAccount } from "@/components/shell/account-provider";
import { Button } from "@/components/ui/button";
import type { Invoice } from "@/lib/amcs/types";

export function PaymentView({ invoices }: { invoices: Invoice[] }) {
  const { account } = useAccount();
  const open = invoices.find(
    (invoice) =>
      invoice.accountId === account.id && invoice.type === "Invoice" && invoice.status === "Unpaid",
  );

  return (
    <div className="max-w-xl">
      <PageHeader
        title="Make a Payment"
        description="Pay the balance due on the account selected in the header."
      />
      {open && account.balanceDue > 0 ? (
        <PayPanel
          accountNumber={account.accountNumber}
          invoiceNumber={open.number}
          amountDue={account.balanceDue}
          doneHref="/dashboard"
        />
      ) : (
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-foreground/10">
          <h2 className="text-xl font-semibold">No balance due</h2>
          <p className="mt-2 text-sm text-slate-600">
            Account {account.accountNumber} does not have an unpaid invoice.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/dashboard/invoices">View invoices</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
