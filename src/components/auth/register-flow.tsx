"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Info, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { registerAction } from "@/app/actions/auth";
import { trackNewAccount, type TrackingResult } from "@/lib/sitecore/track-account";
import { PasswordField, PasswordStrength } from "@/components/auth/password-field";
import { MockBill } from "@/components/mock-bill";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "cn";

const invoiceSchema = z
  .object({
    telephone: z.string().trim().min(10, "Enter a valid telephone number."),
    email: z.string().trim().email("Enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(1, "Confirm your password."),
    accountNumber: z
      .string()
      .trim()
      .regex(/^\d{6,12}$/, "Enter the Account Number from your bill."),
    invoiceNumber: z
      .string()
      .trim()
      .regex(
        /^[A-Za-z]{0,6}\d{3,12}$/,
        'Please enter a valid Invoice Number; if it contains a prefix please include it, e.g. "INV1000".',
      ),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

const activationSchema = z
  .object({
    email: z.string().trim().email("Enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(1, "Confirm your password."),
    activationCode: z.string().trim().min(4, "Enter your Activation Code."),
    pin: z.string().trim().regex(/^\d{4,8}$/, "Enter the PIN that came with your activation code."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

type InvoiceValues = z.infer<typeof invoiceSchema>;
type ActivationValues = z.infer<typeof activationSchema>;
type Step = "method" | "invoice" | "activation" | "success";

const steps = [
  { n: 1, label: "Method" },
  { n: 2, label: "Details" },
  { n: 3, label: "Done" },
];

export function RegisterFlow() {
  const [step, setStep] = useState<Step>("method");
  const [method, setMethod] = useState<"invoice" | "activation">("invoice");
  const [tracking, setTracking] = useState<TrackingResult | "pending">("pending");
  const current = step === "method" ? 1 : step === "success" ? 3 : 2;

  function onRegistered(account: { email: string; phone?: string; method: "invoice" | "activation" }) {
    setTracking("pending");
    setStep("success");
    void trackNewAccount(account).then(setTracking);
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Register / Create an account</h1>
      <p className="mt-2 text-base text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Sign In
        </Link>
      </p>

      <ol className="mt-6 flex items-center gap-2" aria-label="Registration progress">
        {steps.map((item) => {
          const state = item.n < current ? "done" : item.n === current ? "current" : "upcoming";
          return (
            <li key={item.n} className="flex min-w-0 flex-1 items-center gap-2">
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  state === "upcoming" && "bg-slate-100 text-slate-500",
                  state === "current" && "bg-primary text-white",
                  state === "done" && "bg-brand-tint text-primary",
                )}
                aria-current={state === "current" ? "step" : undefined}
              >
                {state === "done" ? <Check className="size-3.5" aria-hidden /> : item.n}
              </span>
              <span className={cn("truncate text-sm", state === "current" ? "font-semibold text-slate-900" : "text-slate-500")}>
                {item.label}
              </span>
            </li>
          );
        })}
      </ol>

      <div key={step} className="mt-8 animate-[rise-in_350ms_ease]">
        {step === "method" ? (
          <MethodStep
            method={method}
            onMethod={setMethod}
            onContinue={() => setStep(method === "invoice" ? "invoice" : "activation")}
          />
        ) : null}
        {step === "invoice" ? <InvoiceStep onBack={() => setStep("method")} onRegistered={onRegistered} /> : null}
        {step === "activation" ? <ActivationStep onBack={() => setStep("method")} onRegistered={onRegistered} /> : null}
        {step === "success" ? <SuccessStep tracking={tracking} /> : null}
      </div>
    </div>
  );
}

function MethodStep({
  method,
  onMethod,
  onContinue,
}: {
  method: "invoice" | "activation";
  onMethod: (method: "invoice" | "activation") => void;
  onContinue: () => void;
}) {
  return (
    <div className="space-y-4">
      <div role="radiogroup" aria-label="Sign up method" className="space-y-3">
        <MethodCard
          checked={method === "invoice"}
          onSelect={() => onMethod("invoice")}
          title="Sign Up with Invoice Number"
          body="Use your Invoice Number to create an account"
          badge="Recommended"
        />
        <MethodCard
          checked={method === "activation"}
          onSelect={() => onMethod("activation")}
          title="Sign Up with Activation Code"
          body="For customers who received an activation code and PIN"
        />
      </div>
      <Button type="button" className="h-11 w-full text-base" onClick={onContinue}>
        Continue
      </Button>
    </div>
  );
}

function MethodCard({
  checked,
  onSelect,
  title,
  body,
  badge,
}: {
  checked: boolean;
  onSelect: () => void;
  title: string;
  body: string;
  badge?: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onSelect}
      className={cn(
        "w-full rounded-xl border bg-white p-4 text-left shadow-sm transition focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        checked ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/40",
      )}
    >
      <span className="flex items-start justify-between gap-3">
        <span className="font-semibold text-slate-900">{title}</span>
        {badge ? <Badge>{badge}</Badge> : null}
      </span>
      <span className="mt-1 block text-sm text-slate-600">{body}</span>
    </button>
  );
}

function InvoiceStep({
  onBack,
  onRegistered,
}: {
  onBack: () => void;
  onRegistered: (account: { email: string; phone?: string; method: "invoice" | "activation" }) => void;
}) {
  const form = useForm<InvoiceValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      telephone: "",
      email: "",
      password: "",
      confirmPassword: "",
      accountNumber: "",
      invoiceNumber: "",
    },
  });
  const [password, setPassword] = useState("");

  async function onSubmit(values: InvoiceValues) {
    const result = await registerAction({
      method: "invoice",
      email: values.email,
      password: values.password,
      telephone: values.telephone,
      accountNumber: values.accountNumber,
      invoiceNumber: values.invoiceNumber,
    });
    if (result && !result.ok) {
      form.setError("root", { message: result.error });
      return;
    }
    onRegistered({ email: values.email, phone: values.telephone, method: "invoice" });
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      {form.formState.errors.root ? (
        <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-destructive">
          {form.formState.errors.root.message}
        </p>
      ) : null}
      <TextField id="telephone" label="Telephone No" error={form.formState.errors.telephone?.message}>
        <Input id="telephone" type="tel" autoComplete="tel" aria-invalid={!!form.formState.errors.telephone} {...form.register("telephone")} />
      </TextField>
      <TextField id="reg-email" label="Email" error={form.formState.errors.email?.message}>
        <Input id="reg-email" type="email" autoComplete="email" aria-invalid={!!form.formState.errors.email} {...form.register("email")} />
      </TextField>
      <TextField id="reg-password" label="Password" error={form.formState.errors.password?.message}>
        <PasswordField
          id="reg-password"
          autoComplete="new-password"
          registration={form.register("password", {
            onChange: (event) => setPassword(event.target.value),
          })}
          invalid={!!form.formState.errors.password}
        />
        <PasswordStrength password={password} />
      </TextField>
      <TextField id="confirm-password" label="Confirm Password" error={form.formState.errors.confirmPassword?.message}>
        <PasswordField
          id="confirm-password"
          autoComplete="new-password"
          registration={form.register("confirmPassword")}
          invalid={!!form.formState.errors.confirmPassword}
        />
      </TextField>
      <TextField
        id="account-number"
        label="Account Number"
        error={form.formState.errors.accountNumber?.message}
        extra={<BillHelp highlight="account" label="Where to find your Account Number" />}
      >
        <Input
          id="account-number"
          inputMode="numeric"
          autoComplete="off"
          aria-invalid={!!form.formState.errors.accountNumber}
          {...form.register("accountNumber")}
        />
      </TextField>
      <TextField
        id="invoice-number"
        label="Invoice Number"
        error={form.formState.errors.invoiceNumber?.message}
        hint='Please enter a valid Invoice Number; if it contains a prefix please include it, e.g. "INV1000".'
        extra={<BillHelp highlight="invoice" label="Where to find your Invoice Number" />}
      >
        <Input
          id="invoice-number"
          autoComplete="off"
          aria-invalid={!!form.formState.errors.invoiceNumber}
          aria-describedby="invoice-number-hint"
          {...form.register("invoiceNumber")}
        />
      </TextField>
      <Button type="submit" className="h-11 w-full text-base" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? <Loader2 className="animate-spin" aria-hidden /> : null}
        {form.formState.isSubmitting ? "Registering…" : "Register"}
      </Button>
      <button type="button" onClick={onBack} className="block w-full text-center text-sm font-medium text-primary hover:underline">
        Back to Register Methods
      </button>
    </form>
  );
}

function ActivationStep({
  onBack,
  onRegistered,
}: {
  onBack: () => void;
  onRegistered: (account: { email: string; phone?: string; method: "invoice" | "activation" }) => void;
}) {
  const form = useForm<ActivationValues>({
    resolver: zodResolver(activationSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      activationCode: "",
      pin: "",
    },
  });
  const [password, setPassword] = useState("");

  async function onSubmit(values: ActivationValues) {
    const result = await registerAction({
      method: "activation",
      email: values.email,
      password: values.password,
      activationCode: values.activationCode,
      pin: values.pin,
    });
    if (result && !result.ok) {
      form.setError("root", { message: result.error });
      return;
    }
    onRegistered({ email: values.email, method: "activation" });
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      {form.formState.errors.root ? (
        <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-destructive">
          {form.formState.errors.root.message}
        </p>
      ) : null}
      <TextField id="act-email" label="Email" error={form.formState.errors.email?.message}>
        <Input id="act-email" type="email" autoComplete="email" aria-invalid={!!form.formState.errors.email} {...form.register("email")} />
      </TextField>
      <TextField id="act-password" label="Password" error={form.formState.errors.password?.message}>
        <PasswordField
          id="act-password"
          autoComplete="new-password"
          registration={form.register("password", {
            onChange: (event) => setPassword(event.target.value),
          })}
          invalid={!!form.formState.errors.password}
        />
        <PasswordStrength password={password} />
      </TextField>
      <TextField id="act-confirm" label="Confirm Password" error={form.formState.errors.confirmPassword?.message}>
        <PasswordField
          id="act-confirm"
          autoComplete="new-password"
          registration={form.register("confirmPassword")}
          invalid={!!form.formState.errors.confirmPassword}
        />
      </TextField>
      <TextField id="activation-code" label="Activation Code" error={form.formState.errors.activationCode?.message}>
        <Input
          id="activation-code"
          autoComplete="off"
          aria-invalid={!!form.formState.errors.activationCode}
          {...form.register("activationCode")}
        />
      </TextField>
      <TextField id="pin" label="PIN" error={form.formState.errors.pin?.message}>
        <Input id="pin" inputMode="numeric" autoComplete="off" aria-invalid={!!form.formState.errors.pin} {...form.register("pin")} />
      </TextField>
      <Button type="submit" className="h-11 w-full text-base" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? <Loader2 className="animate-spin" aria-hidden /> : null}
        {form.formState.isSubmitting ? "Registering…" : "Register"}
      </Button>
      <button type="button" onClick={onBack} className="block w-full text-center text-sm font-medium text-primary hover:underline">
        Back to Register Methods
      </button>
    </form>
  );
}

function SuccessStep({ tracking }: { tracking: TrackingResult | "pending" }) {
  const trackingCopy =
    tracking === "sent"
      ? "Sitecore CDP received an IDENTITY event for this email and the custom event New Account Created."
      : tracking === "failed"
        ? "Sitecore CDP did not accept the events. In the browser network log, filter for edge-platform.sitecorecloud.io."
        : tracking === "skipped"
          ? "Sitecore CDP is waiting for NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID before it can record this account."
          : "Sending this account to Sitecore CDP…";

  return (
    <div className="text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand-tint text-primary">
        <Check className="size-7" aria-hidden />
      </div>
      <h2 className="mt-4 text-2xl font-semibold text-slate-900">Your account is ready</h2>
      <p role="status" className="mt-3 text-left text-sm text-slate-600">
        {trackingCopy}
      </p>
      <p className="mt-2 text-sm text-slate-600">
        These must be re-done in the new portal. They do not carry over from your previous enrollment.
      </p>
      <ul className="mt-5 space-y-2 text-left text-sm text-slate-700">
        <li className="rounded-xl bg-brand-tint px-3 py-2">Re-enroll in Autopay</li>
        <li className="rounded-xl bg-brand-tint px-3 py-2">Go paperless</li>
      </ul>
      <Button asChild className="mt-6 h-11 w-full text-base">
        <Link href="/dashboard">Go to my account</Link>
      </Button>
    </div>
  );
}

function TextField({
  id,
  label,
  error,
  hint,
  extra,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={id}>{label}</Label>
        {extra}
      </div>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="text-sm text-muted-foreground italic">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function BillHelp({
  highlight,
  label,
}: {
  highlight: "invoice" | "account";
  label: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="rounded-md text-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          aria-label={label}
        >
          <Info className="size-4" aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <MockBill highlight={highlight} />
      </PopoverContent>
    </Popover>
  );
}
