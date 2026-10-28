"use server";

import {
  lookupGuestInvoice,
  submitGuestPayment,
  submitServiceRequest,
} from "@/lib/amcs/client";
import type { GuestPaymentInput, ServiceRequestInput } from "@/lib/amcs/types";

export async function findInvoiceAction(accountNumber: string, invoiceNumber: string) {
  return lookupGuestInvoice(accountNumber, invoiceNumber);
}

export async function payInvoiceAction(input: GuestPaymentInput) {
  return submitGuestPayment(input);
}

export async function supportRequestAction(input: ServiceRequestInput) {
  return submitServiceRequest(input);
}
