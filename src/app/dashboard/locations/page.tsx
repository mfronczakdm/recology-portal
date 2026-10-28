import type { Metadata } from "next";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export const metadata: Metadata = { title: "Service Locations" };

export default function LocationsPage() {
  return (
    <ComingSoon
      title="Service Locations"
      description="Service addresses on the account, including carts and collection notes."
    />
  );
}
