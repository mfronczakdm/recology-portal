"use server";

import { login, registerWithActivationCode, registerWithInvoice } from "@/lib/amcs/client";
import type { RegisterInput } from "@/lib/amcs/types";
import { clearSession, setSession } from "@/lib/session";
import { redirect } from "next/navigation";

function safeNext(next: string | null | undefined) {
  if (!next || !next.startsWith("/dashboard")) return "/dashboard";
  return next;
}

export async function signInAction(email: string, password: string, next?: string) {
  const result = await login(email, password);
  if (!result.ok) return result;
  await setSession(result.user);
  redirect(safeNext(next));
}

export async function registerAction(input: RegisterInput & { method: "invoice" | "activation" }) {
  const result =
    input.method === "invoice"
      ? await registerWithInvoice(input)
      : await registerWithActivationCode(input);
  if (!result.ok) return result;
  await setSession(result.user);
  return result;
}

export async function signOutAction() {
  await clearSession();
  redirect("/");
}
