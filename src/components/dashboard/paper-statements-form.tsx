"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { supportRequestAction } from "@/app/actions/portal";
import { PageHeader } from "@/components/page-header";
import { useAccount } from "@/components/shell/account-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const schema = z.object({
  accountId: z.string().min(1, "Select an account."),
  request: z.enum(["stop", "keep"]),
  email: z.string().trim().email("Enter a valid email address."),
});

type FormValues = z.infer<typeof schema>;

export function PaperStatementsForm({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const { accounts } = useAccount();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      accountId: accounts[0]?.id ?? "",
      request: "stop",
      email,
    },
  });

  async function onSubmit(values: FormValues) {
    const account = accounts.find((item) => item.id === values.accountId);
    await supportRequestAction({
      name,
      email: values.email,
      accountNumber: account?.accountNumber ?? "",
      message:
        values.request === "stop"
          ? "Stop paper statements"
          : "Continue paper statements",
    });
    toast.success("Request Submitted Successfully");
    form.reset({ ...values });
  }

  return (
    <div className="max-w-xl">
      <PageHeader
        title="Stop paper statements"
        description="Choose the account and how you want to receive statements."
      />
      <form
        className="space-y-5 rounded-xl bg-white p-6 shadow-sm ring-1 ring-foreground/10"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <div className="space-y-2">
          <Label htmlFor="paper-account">Account Number</Label>
          <Controller
            control={form.control}
            name="accountId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="paper-account" className="w-full" aria-invalid={!!form.formState.errors.accountId}>
                  <SelectValue placeholder="Select an account" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.accountNumber} — {account.serviceAddress}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {form.formState.errors.accountId ? (
            <p role="alert" className="text-sm font-medium text-destructive">
              {form.formState.errors.accountId.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="paper-request">Request</Label>
          <Controller
            control={form.control}
            name="request"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="paper-request" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="stop">Stop paper statements</SelectItem>
                  <SelectItem value="keep">Continue paper statements</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="paper-email">Email</Label>
          <Input
            id="paper-email"
            type="email"
            autoComplete="email"
            aria-invalid={!!form.formState.errors.email}
            {...form.register("email")}
          />
          {form.formState.errors.email ? (
            <p role="alert" className="text-sm font-medium text-destructive">
              {form.formState.errors.email.message}
            </p>
          ) : null}
        </div>
        <p className="rounded-xl bg-brand-tint px-3 py-2 text-sm text-[#00632f]">
          This request can take 1–2 billing cycles.
        </p>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? <Loader2 className="animate-spin" aria-hidden /> : null}
          {form.formState.isSubmitting ? "Submitting…" : "Submit"}
        </Button>
      </form>
    </div>
  );
}
