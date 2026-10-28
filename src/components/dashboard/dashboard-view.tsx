"use client";

import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { useAccount } from "@/components/shell/account-provider";
import { StreamBadge } from "@/components/stream-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AccountSummary } from "@/lib/amcs/types";
import { formatDate, formatMoney } from "@/lib/format";

export function DashboardView({
  summary,
  name,
}: {
  summary: AccountSummary;
  name: string;
}) {
  const { account: selected } = useAccount();
  const account = summary.accounts.find((item) => item.id === selected.id) ?? selected;
  const rows = summary.activity.filter((item) => item.accountId === account.id);

  return (
    <div>
      <PageHeader
        title={`Hello, ${name}`}
        description="Balance, upcoming collection, and recent activity for the account you have selected."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <p className="text-sm font-medium text-slate-500">Balance Due</p>
            <p className="text-3xl font-semibold tracking-tight">{formatMoney(account.balanceDue)}</p>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            {account.dueDate ? <p>Due {formatDate(account.dueDate)}</p> : <p>No payment is due.</p>}
            <Button asChild className="mt-4">
              <Link href="/dashboard/payment">Pay now</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <p className="text-sm font-medium text-slate-500">Next Collection</p>
            <p className="text-lg font-semibold">{formatDate(account.nextCollection.date)}</p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {account.nextCollection.streams.map((stream) => (
                <StreamBadge key={stream} stream={stream} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <p className="text-sm font-medium text-slate-500">Autopay</p>
            <StatusPill on={account.autopay} />
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            <p>{account.autopay ? "Automatic payments are on for this account." : "Automatic payments are off for this account."}</p>
            <Button asChild variant={account.autopay ? "outline" : "default"} className="mt-4">
              <Link href="/dashboard/payment-accounts">{account.autopay ? "Manage" : "Enroll"}</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <p className="text-sm font-medium text-slate-500">Paperless</p>
            <StatusPill on={account.paperless} />
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            <p>
              {account.paperless
                ? "Statements are delivered by email."
                : "Paper statements are still being mailed."}
            </p>
            <Button asChild variant={account.paperless ? "outline" : "default"} className="mt-4">
              <Link href="/dashboard/account/paper-statements">
                {account.paperless ? "Manage" : "Go paperless"}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <h2 className="text-lg font-semibold">Recent Activity</h2>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="text-sm text-slate-600">No recent activity for this account.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{formatDate(row.date)}</TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{row.type}</Badge>
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${row.amount < 0 ? "text-primary" : ""}`}
                      >
                        {formatMoney(row.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatusPill({ on }: { on: boolean }) {
  return (
    <p className="text-2xl font-semibold">
      <span className={on ? "text-primary" : "text-slate-900"}>{on ? "On" : "Off"}</span>
    </p>
  );
}
