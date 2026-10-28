import { redirect } from "next/navigation";
import { AccountProvider } from "@/components/shell/account-provider";
import { AppShell } from "@/components/shell/app-shell";
import { getSession } from "@/lib/session";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <AccountProvider>
      <AppShell session={session}>{children}</AppShell>
    </AccountProvider>
  );
}
