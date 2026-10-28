"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";

export function PasswordField({
  id,
  autoComplete,
  registration,
  invalid,
  describedBy,
}: {
  id: string;
  autoComplete: string;
  registration: UseFormRegisterReturn;
  invalid?: boolean;
  describedBy?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className="pr-11"
        {...registration}
      />
      <button
        type="button"
        className="absolute top-1/2 right-1.5 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        aria-label={visible ? "Hide password" : "Show password"}
        onClick={() => setVisible((value) => !value)}
      >
        {visible ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
      </button>
    </div>
  );
}

export function passwordScore(password: string) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return Math.min(score, 4);
}

const labels = ["", "Weak", "Fair", "Good", "Strong"];
const colors = ["bg-slate-200", "bg-red-500", "bg-amber-500", "bg-lime-600", "bg-primary"];

export function PasswordStrength({ password }: { password: string }) {
  const score = password ? passwordScore(password) : 0;

  return (
    <div className="space-y-1.5" aria-live="polite">
      <div className="flex gap-1" aria-hidden>
        {[1, 2, 3, 4].map((bar) => (
          <span
            key={bar}
            className={`h-1.5 flex-1 rounded-full ${bar <= score ? colors[score] : "bg-slate-200"}`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        {password ? `Password strength: ${labels[score]}` : "Use at least 8 characters."}
      </p>
    </div>
  );
}
