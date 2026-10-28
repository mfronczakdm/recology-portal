import type { Metadata } from "next";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export const metadata: Metadata = { title: "Request service change" };

export default function ServiceChangePage() {
  return (
    <ComingSoon
      title="Request service change"
      description="Cart size, extra pickups, and other service changes."
    />
  );
}
