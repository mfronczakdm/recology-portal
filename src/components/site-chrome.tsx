import Link from "next/link";
import { Logo } from "@/components/logo";
import { SupportRequestDialog } from "@/components/support-request-dialog";
import { Button } from "@/components/ui/button";

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/payment-agreement", label: "Electronic Bill Payment Service Agreement" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav className="flex shrink-0 items-center gap-2" aria-label="Account">
          <Button variant="outline" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/create-an-account">Register</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6">
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm" aria-label="Legal">
          {legalLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-slate-600 hover:text-primary">
              {link.label}
            </Link>
          ))}
          <SupportRequestDialog triggerClassName="text-left text-sm text-slate-600 hover:text-primary" />
        </nav>
        <p className="text-xs text-muted-foreground">
          Demo front end for the Recology customer portal. No payment is processed and no account is created.
        </p>
      </div>
    </footer>
  );
}

export function LegalDocument({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
      <div className="mt-6 space-y-4 text-base leading-7 text-slate-600">{children}</div>
    </article>
  );
}
