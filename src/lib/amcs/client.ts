/**
 * In production these call the existing AMCS Customer Portal APIs — the UI is a
 * drop-in replacement; no back-office change required.
 */

import {
  accounts,
  achAccounts,
  activity,
  cards,
  collectionSchedules,
  demoPassword,
  guestPaymentReference,
  invoices,
} from "@/lib/amcs/mock-data";
import type {
  AccountSummary,
  CollectionSchedule,
  GuestInvoiceMatch,
  GuestPaymentInput,
  GuestPaymentResult,
  LoginResult,
  PaymentAccounts,
  PortalUser,
  RegisterInput,
  RegisterResult,
  ServiceRequestInput,
  ServiceRequestResult,
  Invoice,
} from "@/lib/amcs/types";

function delay(ms = 300 + Math.floor(Math.random() * 301)) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function displayNameFromEmail(email: string) {
  const local = email.split("@")[0] ?? "";
  const parts = local.split(/[._-]+/).filter(Boolean);
  if (parts.length === 0) return "Customer";
  return parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function userFromEmail(email: string): PortalUser {
  return { email: email.trim().toLowerCase(), name: displayNameFromEmail(email) };
}

export async function login(email: string, password: string): Promise<LoginResult> {
  await delay();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  if (!validEmail || password !== demoPassword) {
    return {
      ok: false,
      error: "The email or password you entered is incorrect.",
    };
  }
  return { ok: true, user: userFromEmail(email) };
}

export async function registerWithInvoice(input: RegisterInput): Promise<RegisterResult> {
  await delay();
  if (!input.email || !input.accountNumber || !input.invoiceNumber) {
    return { ok: false, error: "Account Number and Invoice Number are required." };
  }
  return { ok: true, user: userFromEmail(input.email) };
}

export async function registerWithActivationCode(
  input: RegisterInput,
): Promise<RegisterResult> {
  await delay();
  if (!input.email || !input.activationCode || !input.pin) {
    return { ok: false, error: "Activation Code and PIN are required." };
  }
  return { ok: true, user: userFromEmail(input.email) };
}

export async function getAccountSummary(): Promise<AccountSummary> {
  await delay();
  return {
    accounts,
    activity,
  };
}

export async function getInvoices(): Promise<Invoice[]> {
  await delay();
  return invoices;
}

export async function getServiceCalendar(): Promise<Record<string, CollectionSchedule>> {
  await delay();
  return collectionSchedules;
}

export async function getPaymentAccounts(): Promise<PaymentAccounts> {
  await delay();
  return {
    cards,
    ach: achAccounts,
  };
}

export async function lookupGuestInvoice(
  accountNumber: string,
  invoiceNumber: string,
): Promise<{ ok: true; match: GuestInvoiceMatch } | { ok: false; error: string }> {
  await delay();
  const account = accounts.find(
    (item) => item.accountNumber === accountNumber.trim(),
  );
  const invoice = invoices.find(
    (item) =>
      item.number.toLowerCase() === invoiceNumber.trim().toLowerCase() &&
      item.accountId === account?.id &&
      item.type === "Invoice",
  );
  if (!account || !invoice) {
    return {
      ok: false,
      error:
        "We couldn't find that invoice. Check the Account Number and Invoice Number on your bill.",
    };
  }
  return { ok: true, match: { account, invoice } };
}

export async function submitGuestPayment(
  input: GuestPaymentInput,
): Promise<GuestPaymentResult> {
  await delay();
  return {
    reference: guestPaymentReference,
    amount: input.amount,
    accountNumber: input.accountNumber,
    invoiceNumber: input.invoiceNumber,
    method: input.method,
    paidOn: "2026-10-28",
  };
}

export async function submitServiceRequest(
  input: ServiceRequestInput,
): Promise<ServiceRequestResult> {
  await delay();
  void input;
  return { ok: true, confirmation: "SR-100284" };
}
