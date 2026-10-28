"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { supportRequestAction } from "@/app/actions/portal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name."),
  email: z.string().trim().email("Enter a valid email address."),
  accountNumber: z.string().trim().min(4, "Enter your account number."),
  message: z.string().trim().min(10, "Enter a message so we can help."),
});

type FormValues = z.infer<typeof schema>;

export function SupportRequestDialog({
  triggerClassName,
}: {
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", accountNumber: "", message: "" },
  });

  async function onSubmit(values: FormValues) {
    await supportRequestAction(values);
    toast.success("Request Submitted Successfully");
    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className={triggerClassName}>
          Support Request
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Support Request</DialogTitle>
          <DialogDescription>
            Tell us how we can help with your Recology service. This demo does not send the request.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <Field
            id="support-name"
            label="Name"
            error={form.formState.errors.name?.message}
          >
            <Input
              id="support-name"
              autoComplete="name"
              aria-invalid={!!form.formState.errors.name}
              {...form.register("name")}
            />
          </Field>
          <Field
            id="support-email"
            label="Email"
            error={form.formState.errors.email?.message}
          >
            <Input
              id="support-email"
              type="email"
              autoComplete="email"
              aria-invalid={!!form.formState.errors.email}
              {...form.register("email")}
            />
          </Field>
          <Field
            id="support-account"
            label="Account Number"
            error={form.formState.errors.accountNumber?.message}
          >
            <Input
              id="support-account"
              inputMode="numeric"
              autoComplete="off"
              aria-invalid={!!form.formState.errors.accountNumber}
              {...form.register("accountNumber")}
            />
          </Field>
          <Field
            id="support-message"
            label="Message"
            error={form.formState.errors.message?.message}
          >
            <textarea
              id="support-message"
              rows={4}
              aria-invalid={!!form.formState.errors.message}
              className="w-full rounded-xl border border-input bg-white px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive"
              {...form.register("message")}
            />
          </Field>
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Submitting…" : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
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
        <p id={`${id}-error`} role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
