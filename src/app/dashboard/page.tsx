import type { Metadata } from "next";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { getAccountSummary } from "@/lib/amcs/client";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const [summary, session] = await Promise.all([getAccountSummary(), getSession()]);
  return <DashboardView summary={summary} name={session?.name ?? "there"} />;
}
