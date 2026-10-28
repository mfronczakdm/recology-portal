"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { z } from "zod";
import { payInvoiceAction } from "@/app/actions/portal";
import { DemoNotice } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatMoney } from "@/lib/format";
import type { GuestPaymentResult } from "@/lib/amcs/types";

const cardSchema = z.object({
  amount: z.coerce.number().positive("Enter an amount greater than zero."),
  holder: z.string().trim().min(2, "Enter the name on the card."),
  cardNumber: z
    .string()
    .trim()
    .regex(/^[\d\s]{13,23}$/, "Enter a card number."),
  expiry: z.string().trim().regex(/^\d{2}\/\d{2}$/, "Use MM/YY."),
  cvc: z.string().trim().regex(/^\d{3,4}$/, "Enter the CVC."),
});

const achSchema = z.object({
  amount: z.coerce.number().positive("Enter an amount greater than zero."),
  holder: z.string().trim().min(2, "Enter the account holder name."),
  routing: z.string().trim().regex(/^\d{9}$/, "Enter a 9-digit routing number."),
  account: z.string().trim().regex(/^\d{4,17}$/, "Enter the account number."),
});

type CardValues = z.infer<typeof cardSchema>;
type AchValues = z.infer<typeof achSchema>;

export function PayPanel({
  accountNumber,
  invoiceNumber,
  amountDue,
  doneHref,
  onDifferentInvoice,
}: {
  accountNumber: string;
  invoiceNumber: string;
  amountDue: number;
  doneHref: string;
  onDifferentInvoice?: () => void;
}) {
  const [method, setMethod] = useState<"card" | "ach">("card");
  const [result, setResult] = useState<GuestPaymentResult | null>(null);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cardForm = useForm<CardValues>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      amount: amountDue,
      holder: "",
      cardNumber: "",
      expiry: "",
      cvc: "",
    },
  });
  const achForm = useForm<AchValues>({
    resolver: zodResolver(achSchema),
    defaultValues: {
      amount: amountDue,
      holder: "",
      routing: "",
      account: "",
    },
  });

  async function pay(amount: number) {
    if (amount > amountDue) {
      setError("Amount cannot exceed the balance due.");
      return;
    }
    setError(null);
    setPaying(true);
    const payment = await payInvoiceAction({
      accountNumber,
      invoiceNumber,
      amount,
      method,
    });
    setResult(payment);
    setPaying(false);
  }

  if (result) {
    return (
      <div className="rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-foreground/10">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand-tint text-primary">
          <Check className="size-7" aria-hidden />
        </div>
        <h2 className="mt-4 text-2xl font-semibold">Payment submitted</h2>
        <p className="mt-2 text-sm text-slate-600">Demo – no payment processed</p>
        <dl className="mt-6 space-y-3 text-left text-sm">
          <Row label="Reference number" value={result.reference} />
          <Row label="Account Number" value={result.accountNumber} />
          <Row label="Invoice Number" value={result.invoiceNumber} />
          <Row label="Amount" value={formatMoney(result.amount)} />
          <Row label="Method" value={result.method === "card" ? "Card" : "ACH"} />
        </dl>
        <Button asChild className="mt-6 w-full">
          <Link href={doneHref}>{doneHref === "/dashboard" ? "Back to my account" : "Back to My Recology Account"}</Link>
        </Button>
      </div>
    );
  }

  if (amountDue <= 0) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-foreground/10">
        <h2 className="text-xl font-semibold">No balance due</h2>
        <p className="mt-2 text-sm text-slate-600">
          Invoice {invoiceNumber} on account {accountNumber} is already paid.
        </p>
        {onDifferentInvoice ? (
          <Button type="button" variant="outline" className="mt-4" onClick={onDifferentInvoice}>
            Look up another invoice
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-foreground/10">
      <div>
        <p className="text-sm text-slate-500">Balance due</p>
        <p className="text-3xl font-semibold tracking-tight text-slate-900">{formatMoney(amountDue)}</p>
        <p className="mt-1 text-sm text-slate-600">
          Account {accountNumber} · Invoice {invoiceNumber}
        </p>
      </div>
      <DemoNotice>Demo – no payment processed</DemoNotice>
      {error ? (
        <p role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      ) : null}
      <Tabs
        value={method}
        onValueChange={(value) => setMethod(value as "card" | "ach")}
      >
        <TabsList className="h-11 w-full">
          <TabsTrigger value="card" className="flex-1">
            Card
          </TabsTrigger>
          <TabsTrigger value="ach" className="flex-1">
            ACH
          </TabsTrigger>
        </TabsList>
        <TabsContent value="card" className="mt-4">
          <form
            className="space-y-4"
            onSubmit={cardForm.handleSubmit((values) => pay(values.amount))}
            noValidate
          >
            <AmountField
              id="card-amount"
              registration={cardForm.register("amount")}
              error={cardForm.formState.errors.amount?.message}
            />
            <Labeled id="card-holder" label="Name on card" error={cardForm.formState.errors.holder?.message}>
              <Input id="card-holder" autoComplete="cc-name" aria-invalid={!!cardForm.formState.errors.holder} {...cardForm.register("holder")} />
            </Labeled>
            <Labeled id="card-number" label="Card number" error={cardForm.formState.errors.cardNumber?.message}>
              <Input id="card-number" inputMode="numeric" autoComplete="cc-number" placeholder="•••• •••• •••• ••••" aria-invalid={!!cardForm.formState.errors.cardNumber} {...cardForm.register("cardNumber")} />
            </Labeled>
            <div className="grid grid-cols-2 gap-3">
              <Labeled id="card-expiry" label="Expiration" error={cardForm.formState.errors.expiry?.message}>
                <Input id="card-expiry" autoComplete="cc-exp" placeholder="MM/YY" aria-invalid={!!cardForm.formState.errors.expiry} {...cardForm.register("expiry")} />
              </Labeled>
              <Labeled id="card-cvc" label="CVC" error={cardForm.formState.errors.cvc?.message}>
                <Input id="card-cvc" inputMode="numeric" autoComplete="cc-csc" aria-invalid={!!cardForm.formState.errors.cvc} {...cardForm.register("cvc")} />
              </Labeled>
            </div>
            <PayButton pending={paying || cardForm.formState.isSubmitting} />
          </form>
        </TabsContent>
        <TabsContent value="ach" className="mt-4">
          <form className="space-y-4" onSubmit={achForm.handleSubmit((values) => pay(values.amount))} noValidate>
            <AmountField
              id="ach-amount"
              registration={achForm.register("amount")}
              error={achForm.formState.errors.amount?.message}
            />
            <Labeled id="ach-holder" label="Account holder" error={achForm.formState.errors.holder?.message}>
              <Input id="ach-holder" autoComplete="name" aria-invalid={!!achForm.formState.errors.holder} {...achForm.register("holder")} />
            </Labeled>
            <Labeled id="ach-routing" label="Routing number" error={achForm.formState.errors.routing?.message}>
              <Input id="ach-routing" inputMode="numeric" autoComplete="off" aria-invalid={!!achForm.formState.errors.routing} {...achForm.register("routing")} />
            </Labeled>
            <Labeled id="ach-account" label="Account number" error={achForm.formState.errors.account?.message}>
              <Input id="ach-account" inputMode="numeric" autoComplete="off" aria-invalid={!!achForm.formState.errors.account} {...achForm.register("account")} />
            </Labeled>
            <PayButton pending={paying || achForm.formState.isSubmitting} />
          </form>
        </TabsContent>
      </Tabs>
      {onDifferentInvoice ? (
        <button type="button" onClick={onDifferentInvoice} className="text-sm font-medium text-primary hover:underline">
          Look up a different invoice
        </button>
      ) : null}
    </div>
  );
}

function AmountField({
  id,
  registration,
  error,
}: {
  id: string;
  registration: UseFormRegisterReturn;
  error?: string;
}) {
  return (
    <Labeled id={id} label="Amount" error={error}>
      <Input id={id} type="number" min="0" step="0.01" inputMode="decimal" aria-invalid={!!error} {...registration} />
    </Labeled>
  );
}

function Labeled({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function PayButton({ pending }: { pending: boolean }) {
  return (
    <Button type="submit" className="h-11 w-full text-base" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" aria-hidden /> : null}
      {pending ? "Paying…" : "Pay"}
    </Button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-2">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-900">{value}</dd>
    </div>
  );
}
