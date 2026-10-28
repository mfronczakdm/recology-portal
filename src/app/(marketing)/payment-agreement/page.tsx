import type { Metadata } from "next";
import { LegalDocument } from "@/components/site-chrome";

export const metadata: Metadata = { title: "Electronic Bill Payment Service Agreement" };

export default function PaymentAgreementPage() {
  return (
    <LegalDocument title="Electronic Bill Payment Service Agreement">
      <p>
        This is a demo placeholder for the electronic bill payment service agreement. Guest payments and signed-in
        payments in this front end show a confirmation only.
      </p>
      <p>No card or bank account is charged. The reference number on the confirmation is sample data.</p>
    </LegalDocument>
  );
}
