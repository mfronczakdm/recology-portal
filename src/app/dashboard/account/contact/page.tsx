import type { Metadata } from "next";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export const metadata: Metadata = { title: "Update contact details" };

export default function ContactPage() {
  return (
    <ComingSoon
      title="Update contact details"
      description="Phone, email, and mailing address on the account."
    />
  );
}
