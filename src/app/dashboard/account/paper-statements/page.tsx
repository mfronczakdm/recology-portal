import type { Metadata } from "next";
import { PaperStatementsForm } from "@/components/dashboard/paper-statements-form";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "Stop paper statements" };

export default async function PaperStatementsPage() {
  const session = await getSession();
  return <PaperStatementsForm name={session?.name ?? ""} email={session?.email ?? ""} />;
}
