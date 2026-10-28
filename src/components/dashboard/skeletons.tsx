import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-hidden>
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-44 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-72 rounded-xl" />
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="space-y-4" aria-hidden>
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-80 rounded-xl" />
    </div>
  );
}

export function PanelSkeleton() {
  return (
    <div className="max-w-xl space-y-4" aria-hidden>
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-96 rounded-xl" />
    </div>
  );
}
