import Link from "next/link";
import { AuthArtwork } from "@/components/auth/auth-artwork";
import { Logo } from "@/components/logo";

const links = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/payment-agreement", label: "Electronic Bill Payment Service Agreement" },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-2">
      <div className="flex min-h-screen flex-col">
        <header className="px-6 py-5 sm:px-10">
          <Logo />
        </header>
        <div className="flex flex-1 items-center px-6 py-6 sm:px-10">
          <div className="mx-auto w-full max-w-md">{children}</div>
        </div>
        <footer className="px-6 py-5 sm:px-10">
          <nav className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground" aria-label="Legal">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-primary">
                {link.label}
              </Link>
            ))}
          </nav>
        </footer>
      </div>
      <AuthArtwork />
    </div>
  );
}
