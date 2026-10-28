import { PageHeader } from "@/components/page-header";

export function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <PageHeader title={title} description={description} />
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-foreground/10">
        <h2 className="text-lg font-semibold">Coming soon in demo</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          This screen is on the My Recology Service menu so you can move through the portal. It is not interactive in this demo.
        </p>
      </div>
    </div>
  );
}
