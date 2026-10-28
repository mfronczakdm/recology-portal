"use client";

import { Check, ChevronDown, LogOut, Menu, UserRound } from "lucide-react";
import { useState } from "react";
import { signOutAction } from "@/app/actions/auth";
import { Logo } from "@/components/logo";
import { useAccount } from "@/components/shell/account-provider";
import { SidebarNav } from "@/components/shell/sidebar-nav";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { Session } from "@/lib/session";

export function AppShell({
  session,
  children,
}: {
  session: Session;
  children: React.ReactNode;
}) {
  const { accounts, account, setAccountId } = useAccount();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-3"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-border bg-white">
        <div className="flex h-16 items-center gap-3 px-4">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="lg:hidden"
            aria-label="Open My Recology Service menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu aria-hidden />
          </Button>
          <Logo href="/dashboard" />
          <div className="ml-auto flex min-w-0 items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-11 min-w-0 max-w-[11rem] justify-between gap-2 sm:max-w-xs">
                  <span className="min-w-0 text-left">
                    <span className="block truncate text-xs font-medium text-muted-foreground">
                      Account {account.accountNumber}
                    </span>
                    <span className="hidden truncate text-sm sm:block">{account.serviceAddress}</span>
                  </span>
                  <ChevronDown className="size-4 shrink-0" aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Service accounts</DropdownMenuLabel>
                {accounts.map((item) => (
                  <DropdownMenuItem key={item.id} onSelect={() => setAccountId(item.id)} className="items-start">
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">Account {item.accountNumber}</span>
                      <span className="block text-xs text-muted-foreground">{item.serviceAddress}</span>
                    </span>
                    {item.id === account.id ? <Check className="mt-0.5 size-4 text-primary" aria-hidden /> : null}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-11 w-11 px-0 sm:w-auto sm:max-w-[12rem] sm:px-3" aria-label="Account menu">
                  <UserRound className="sm:hidden" aria-hidden />
                  <span className="hidden truncate sm:inline">{session.name}</span>
                  <ChevronDown className="hidden size-4 sm:block" aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                  <span className="block">{session.name}</span>
                  <span className="block text-xs font-normal text-muted-foreground">{session.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => {
                    void signOutAction();
                  }}
                >
                  <LogOut aria-hidden />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <div className="flex">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-72 shrink-0 overflow-y-auto border-r border-border bg-white lg:block">
          <SidebarNav />
        </aside>
        <main id="main" className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8">
          {children}
        </main>
      </div>
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-80 bg-white p-0">
          <SheetHeader className="border-b px-4 py-4">
            <SheetTitle>My Recology Service</SheetTitle>
          </SheetHeader>
          <SidebarNav showTitle={false} onNavigate={() => setMenuOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
