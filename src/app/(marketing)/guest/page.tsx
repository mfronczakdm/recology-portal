import type { Metadata } from "next";
import { GuestPayment } from "@/components/guest/guest-payment";

export const metadata: Metadata = { title: "Guest Payment" };

export default function GuestPage() {
  return <GuestPayment />;
}
