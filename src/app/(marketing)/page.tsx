import { CreditCard, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import { MockBill } from "@/components/mock-bill";
import { PersonalizedBanner } from "@/components/sitecore/personalized-banner";
import { Button } from "@/components/ui/button";

const actions = [
  {
    href: "/login",
    title: "Login",
    body: "Login to manage your Recology service.",
    action: "Login",
    icon: LogIn,
  },
  {
    href: "/create-an-account",
    title: "Create Account",
    body: "Register to get access to this portal and manage your Recology service.",
    action: "Register",
    icon: UserPlus,
  },
  {
    href: "/guest",
    title: "Guest Payment",
    body: "Make an ad-hoc payment as a guest without logging into the portal.",
    action: "Guest Payment",
    icon: CreditCard,
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Remove PersonalizedBanner to restore this page without the headless experience. */}
      <PersonalizedBanner />
      <div className="max-w-2xl">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">Customer portal</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          My Recology Account
        </h1>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {actions.map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.href}
              className="flex h-full flex-col rounded-xl bg-white p-6 shadow-sm ring-1 ring-foreground/10"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-brand-tint text-primary">
                <Icon aria-hidden />
              </div>
              <h2 className="mt-4 text-xl font-semibold">{item.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{item.body}</p>
              <Button asChild className="mt-6 w-full sm:w-fit">
                <Link href={item.href}>{item.action}</Link>
              </Button>
            </article>
          );
        })}
      </div>

      <section className="mt-12 grid items-center gap-8 rounded-xl bg-white p-6 shadow-sm ring-1 ring-foreground/10 md:grid-cols-[1fr_18rem] md:p-8">
        <div>
          <h2 className="text-2xl font-semibold">Where do I find my numbers?</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
            Both numbers are printed on your Recology bill. Use them to register or to make a guest payment.
          </p>
          <ol className="mt-4 space-y-2 text-sm text-slate-700">
            <li>
              <span className="mr-2 inline-flex size-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                1
              </span>
              Invoice Number
            </li>
            <li>
              <span className="mr-2 inline-flex size-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                2
              </span>
              Account Number
            </li>
          </ol>
        </div>
        <MockBill />
      </section>
    </div>
  );
}
