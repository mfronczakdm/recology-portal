"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signInAction } from "@/app/actions/auth";
import { PasswordField } from "@/components/auth/password-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm({ nextPath }: { nextPath?: string }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: FormValues) {
    const result = await signInAction(values.email, values.password, nextPath);
    if (result && !result.ok) {
      form.setError("root", { message: result.error });
    }
  }

  const rootError = form.formState.errors.root?.message;

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Sign In</h1>
      <p className="mt-2 text-base text-slate-600">
        Welcome back! Please login below or{" "}
        <Link href="/create-an-account" className="font-semibold text-primary hover:underline">
          Sign Up
        </Link>
      </p>

      <form className="mt-8 space-y-5" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        {rootError ? (
          <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-destructive">
            {rootError}
          </p>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!form.formState.errors.email}
            aria-describedby={form.formState.errors.email ? "email-error" : undefined}
            {...form.register("email")}
          />
          {form.formState.errors.email ? (
            <p id="email-error" role="alert" className="text-sm font-medium text-destructive">
              {form.formState.errors.email.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
              Forgot Password?
            </Link>
          </div>
          <PasswordField
            id="password"
            autoComplete="current-password"
            registration={form.register("password")}
            invalid={!!form.formState.errors.password || !!rootError}
            describedBy={form.formState.errors.password ? "password-error" : "password-hint"}
          />
          {form.formState.errors.password ? (
            <p id="password-error" role="alert" className="text-sm font-medium text-destructive">
              {form.formState.errors.password.message}
            </p>
          ) : (
            <p id="password-hint" className="text-xs text-muted-foreground">
              Demo: use demo1234
            </p>
          )}
        </div>

        <Button type="submit" className="h-11 w-full text-base" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? <Loader2 className="animate-spin" aria-hidden /> : null}
          {form.formState.isSubmitting ? "Signing in…" : "Sign In"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-slate-600">
        Paying an Invoice?{" "}
        <Link href="/guest" className="font-semibold text-primary hover:underline">
          Make a Guest Payment
        </Link>
      </p>
    </div>
  );
}
