"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { useAccount } from "@/components/shell/account-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Invoice } from "@/lib/amcs/types";
import { formatDate, formatMoney } from "@/lib/format";

export function InvoicesView({ invoices }: { invoices: Invoice[] }) {
  const { account } = useAccount();
  const rows = invoices
    .filter((invoice) => invoice.accountId === account.id)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  const [openId, setOpenId] = useState<string | null>(null);
  const selected = rows.find((invoice) => invoice.id === openId) ?? null;

  return (
    <div>
      <PageHeader
        title="Invoices & Statements"
        description={`Documents for account ${account.accountNumber}.`}
      />
      {rows.length === 0 ? (
        <div className="rounded-xl bg-white p-8 text-sm text-slate-600 shadow-sm ring-1 ring-foreground/10">
          No invoices for this account.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-foreground/10">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.number}</TableCell>
                  <TableCell>{formatDate(invoice.date)}</TableCell>
                  <TableCell>
                    <Badge variant={invoice.type === "Invoice" ? "secondary" : "outline"}>{invoice.type}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{formatMoney(invoice.amount)}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        invoice.status === "Paid"
                          ? "border-transparent bg-brand-tint text-[#00632f]"
                          : "border-transparent bg-amber-100 text-amber-900"
                      }
                    >
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button type="button" variant="outline" size="sm" onClick={() => setOpenId(invoice.id)}>
                      View PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(open) => !open && setOpenId(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {selected ? <InvoiceDocument invoice={selected} address={account.serviceAddress} accountNumber={account.accountNumber} /> : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InvoiceDocument({
  invoice,
  address,
  accountNumber,
}: {
  invoice: Invoice;
  address: string;
  accountNumber: string;
}) {
  return (
    <article className="bg-white p-2 sm:p-4">
      <DialogHeader>
        <DialogTitle className="text-primary">Recology</DialogTitle>
        <DialogDescription>
          Mock {invoice.type.toLowerCase()} for demo purposes. No PDF file is downloaded.
        </DialogDescription>
      </DialogHeader>
      <div className="mt-4 rounded-xl border border-slate-200 p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs tracking-wide text-slate-500 uppercase">{invoice.type}</p>
            <p className="text-xl font-semibold">{invoice.number}</p>
          </div>
          <div className="text-sm text-slate-600">
            <p>Date {formatDate(invoice.date)}</p>
            <p>Service period {invoice.period}</p>
          </div>
        </div>
        <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">Account Number</dt>
            <dd className="font-medium">{accountNumber}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Service address</dt>
            <dd className="font-medium">{address}</dd>
          </div>
        </dl>
        <table className="mt-6 w-full text-sm">
          <caption className="sr-only">Line items for {invoice.number}</caption>
          <thead>
            <tr className="border-b text-left text-slate-500">
              <th className="py-2 font-medium">Description</th>
              <th className="py-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.map((line) => (
              <tr key={line.description} className="border-b border-slate-100">
                <td className="py-2">{line.description}</td>
                <td className="py-2 text-right">{formatMoney(line.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-slate-500">Status: {invoice.status}</span>
          <p className="text-lg font-semibold">Total {formatMoney(invoice.amount)}</p>
        </div>
      </div>
    </article>
  );
}
