import type { Metadata } from "next";
import { SupportForm } from "@/components/dashboard/support-form";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "Support Request" };

export default async function SupportPage() {
  const session = await getSession();
  return (
    <SupportForm name={session?.name ?? ""} email={session?.email ?? ""} />
  );
}
