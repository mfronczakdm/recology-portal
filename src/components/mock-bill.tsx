import { cn } from "cn";

function Callout({
  n,
  label,
  value,
  active,
}: {
  n: number;
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg px-2 py-2",
        active ? "bg-brand-tint" : "opacity-50",
      )}
    >
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
        {n}
      </span>
      <div>
        <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">{label}</p>
        <p className="font-mono text-base font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

export function MockBill({
  highlight = "both",
}: {
  highlight?: "invoice" | "account" | "both";
}) {
  return (
    <figure
      className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm"
      aria-label="Example bill showing where to find the Invoice Number and Account Number"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <span className="text-sm font-bold text-primary">Recology</span>
        <span className="text-xs text-slate-500">Service Invoice</span>
      </div>
      <p className="mt-3 text-xs text-slate-500">1234 Market Street, San Francisco, CA 94103</p>
      <div className="mt-3 space-y-2">
        <Callout
          n={1}
          label="Invoice Number"
          value="INV104582"
          active={highlight === "invoice" || highlight === "both"}
        />
        <Callout
          n={2}
          label="Account Number"
          value="10458291"
          active={highlight === "account" || highlight === "both"}
        />
      </div>
      <div className="mt-3 flex items-end justify-between border-t border-dashed border-slate-200 pt-3 text-sm">
        <span className="text-slate-500">Amount due</span>
        <span className="text-base font-semibold text-slate-900">$86.42</span>
      </div>
    </figure>
  );
}
