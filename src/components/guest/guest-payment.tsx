"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { findInvoiceAction } from "@/app/actions/portal";
import { PayPanel } from "@/components/payment/pay-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { GuestInvoiceMatch } from "@/lib/amcs/types";

const schema = z.object({
  accountNumber: z.string().trim().min(1, "Account Number is required."),
  invoiceNumber: z.string().trim().min(1, "Invoice Number is required."),
});

type FormValues = z.infer<typeof schema>;

export function GuestPayment() {
  const [match, setMatch] = useState<GuestInvoiceMatch | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { accountNumber: "", invoiceNumber: "" },
  });

  async function onSubmit(values: FormValues) {
    setLookupError(null);
    const result = await findInvoiceAction(values.accountNumber, values.invoiceNumber);
    if (!result.ok) {
      setMatch(null);
      setLookupError(result.error);
      return;
    }
    setMatch(result.match);
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Guest Payment</h1>
      <p className="mt-2 text-slate-600">
        Make an ad-hoc payment as a guest without logging into the portal.
      </p>
      <p className="mt-3 text-sm text-muted-foreground">
        Demo: account <span className="font-medium text-slate-700">10458291</span> and invoice{" "}
        <span className="font-medium text-slate-700">INV104582</span> has a balance due. Account 20933104 /
        INV209331 is already paid.
      </p>

      {match ? (
        <div className="mt-8">
          <PayPanel
            accountNumber={match.account.accountNumber}
            invoiceNumber={match.invoice.number}
            amountDue={match.invoice.status === "Paid" ? 0 : match.invoice.amount}
            doneHref="/"
            onDifferentInvoice={() => setMatch(null)}
          />
        </div>
      ) : (
        <form
          className="mt-8 space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-foreground/10"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          {lookupError ? (
            <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-destructive">
              {lookupError}
            </p>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="guest-account">Account Number</Label>
            <Input
              id="guest-account"
              inputMode="numeric"
              autoComplete="off"
              aria-invalid={!!form.formState.errors.accountNumber}
              {...form.register("accountNumber")}
            />
            {form.formState.errors.accountNumber ? (
              <p role="alert" className="text-sm font-medium text-destructive">
                {form.formState.errors.accountNumber.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="guest-invoice">Invoice Number</Label>
            <Input
              id="guest-invoice"
              autoComplete="off"
              aria-invalid={!!form.formState.errors.invoiceNumber}
              {...form.register("invoiceNumber")}
            />
            {form.formState.errors.invoiceNumber ? (
              <p role="alert" className="text-sm font-medium text-destructive">
                {form.formState.errors.invoiceNumber.message}
              </p>
            ) : null}
          </div>
          <Button type="submit" className="h-11 w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? <Loader2 className="animate-spin" aria-hidden /> : null}
            {form.formState.isSubmitting ? "Finding invoice…" : "Find Invoice"}
          </Button>
        </form>
      )}
    </div>
  );
}
