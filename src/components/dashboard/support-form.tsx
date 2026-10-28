"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { supportRequestAction } from "@/app/actions/portal";
import { PageHeader } from "@/components/page-header";
import { useAccount } from "@/components/shell/account-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name."),
  email: z.string().trim().email("Enter a valid email address."),
  accountNumber: z.string().trim().min(4, "Enter your account number."),
  message: z.string().trim().min(10, "Enter a message so we can help."),
});

type FormValues = z.infer<typeof schema>;

export function SupportForm({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const { account } = useAccount();
  const [done, setDone] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name, email, accountNumber: account.accountNumber, message: "" },
  });

  async function onSubmit(values: FormValues) {
    await supportRequestAction(values);
    toast.success("Request Submitted Successfully");
    setDone(true);
  }

  if (done) {
    return (
      <div className="max-w-xl">
        <PageHeader title="Support Request" />
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-foreground/10" role="status">
          <div className="flex size-12 items-center justify-center rounded-full bg-brand-tint text-primary">
            <Check className="size-6" aria-hidden />
          </div>
          <h2 className="mt-4 text-xl font-semibold">Request Submitted Successfully</h2>
          <p className="mt-2 text-sm text-slate-600">This demo does not send the request to a support queue.</p>
          <Button type="button" className="mt-5" variant="outline" onClick={() => setDone(false)}>
            Send another request
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <PageHeader
        title="Support Request"
        description="Tell us how we can help with your Recology service."
      />
      <form
        className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-foreground/10"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <Field id="dash-support-name" label="Name" error={form.formState.errors.name?.message}>
          <Input id="dash-support-name" autoComplete="name" aria-invalid={!!form.formState.errors.name} {...form.register("name")} />
        </Field>
        <Field id="dash-support-email" label="Email" error={form.formState.errors.email?.message}>
          <Input id="dash-support-email" type="email" autoComplete="email" aria-invalid={!!form.formState.errors.email} {...form.register("email")} />
        </Field>
        <Field id="dash-support-account" label="Account Number" error={form.formState.errors.accountNumber?.message}>
          <Input id="dash-support-account" aria-invalid={!!form.formState.errors.accountNumber} {...form.register("accountNumber")} />
        </Field>
        <Field id="dash-support-message" label="Message" error={form.formState.errors.message?.message}>
          <textarea
            id="dash-support-message"
            rows={5}
            aria-invalid={!!form.formState.errors.message}
            className="w-full rounded-xl border border-input bg-white px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive"
            {...form.register("message")}
          />
        </Field>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? <Loader2 className="animate-spin" aria-hidden /> : null}
          {form.formState.isSubmitting ? "Submitting…" : "Submit"}
        </Button>
      </form>
    </div>
  );
}

function Field({
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
