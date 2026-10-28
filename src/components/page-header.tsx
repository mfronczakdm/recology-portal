export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">{title}</h1>
      {description ? <p className="mt-2 max-w-2xl text-base text-slate-600">{description}</p> : null}
    </header>
  );
}

export function DemoNotice({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl bg-brand-tint px-3 py-2 text-sm text-[#00632f]">{children}</p>
  );
}
