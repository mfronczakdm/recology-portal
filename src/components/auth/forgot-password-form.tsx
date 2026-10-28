"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
});

type FormValues = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  function onSubmit() {
    setSent(true);
  }

  if (sent) {
    return (
      <div>
        <div className="flex size-12 items-center justify-center rounded-full bg-brand-tint text-primary">
          <Check className="size-6" aria-hidden />
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Check your email</h1>
        <p className="mt-2 text-slate-600" role="status">
          If an account exists for that email, a reset link has been sent. This demo does not send email.
        </p>
        <Button asChild className="mt-6">
          <Link href="/login">Back to Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Forgot Password?</h1>
      <p className="mt-2 text-slate-600">
        Enter the email on your account. We&apos;ll show a confirmation here — no message is sent in this demo.
      </p>
      <form className="mt-8 space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div className="space-y-2">
          <Label htmlFor="reset-email">Email</Label>
          <Input
            id="reset-email"
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
        <Button type="submit" className="h-11 w-full">
          Send reset link
        </Button>
      </form>
    </div>
  );
}
