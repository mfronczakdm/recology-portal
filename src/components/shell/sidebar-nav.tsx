"use client";

import {
  CalendarDays,
  ChevronDown,
  CreditCard,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  MapPin,
  Settings,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "cn";

type Item = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
};

const items: Item[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/invoices", label: "Invoices & Statements", icon: FileText },
  { href: "/dashboard/payment", label: "Make a Payment", icon: CreditCard },
  { href: "/dashboard/payment-accounts", label: "Payment Accounts", icon: Wallet },
  { href: "/dashboard/calendar", label: "Service Calendar", icon: CalendarDays },
  { href: "/dashboard/locations", label: "Service Locations", icon: MapPin },
];

const accountItems = [
  { href: "/dashboard/account/paper-statements", label: "Stop paper statements" },
  { href: "/dashboard/account/contact", label: "Update contact details" },
  { href: "/dashboard/account/service-change", label: "Request service change" },
];

function active(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarNav({
  onNavigate,
  showTitle = true,
}: {
  onNavigate?: () => void;
  showTitle?: boolean;
}) {
  const pathname = usePathname();
  const accountOpenDefault = pathname.startsWith("/dashboard/account");
  const [accountOpen, setAccountOpen] = useState(accountOpenDefault);

  return (
    <nav className="flex flex-col gap-1 px-3 py-4" aria-label="My Recology Service">
      {showTitle ? (
        <h2 className="px-3 pb-2 text-sm font-semibold text-slate-900">My Recology Service</h2>
      ) : null}
      {items.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          label={item.label}
          icon={item.icon}
          current={active(pathname, item.href, item.exact)}
          onNavigate={onNavigate}
        />
      ))}
      <div>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          aria-expanded={accountOpen}
          onClick={() => setAccountOpen((open) => !open)}
        >
          <Settings className="size-4 shrink-0" aria-hidden />
          <span className="flex-1">Manage My Account</span>
          <ChevronDown className={cn("size-4 transition", accountOpen && "rotate-180")} aria-hidden />
        </button>
        {accountOpen ? (
          <div className="mt-1 space-y-1 pl-7">
            {accountItems.map((item) => {
              const current = active(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={current ? "page" : undefined}
                  className={cn(
                    "block rounded-xl px-3 py-2 text-sm focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                    current ? "bg-brand-tint font-medium text-primary" : "text-slate-600 hover:bg-slate-50",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        ) : null}
      </div>
      <NavLink
        href="/dashboard/support"
        label="Support Request"
        icon={LifeBuoy}
        current={active(pathname, "/dashboard/support")}
        onNavigate={onNavigate}
      />
    </nav>
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
  current,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  current: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={current ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        current ? "bg-brand-tint text-primary" : "text-slate-700 hover:bg-slate-50",
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden />
      {label}
    </Link>
  );
}
