import { Skeleton } from "@/components/ui/skeleton";

export default function SalesLoading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3.5">
        <Skeleton className="size-11 rounded-2xl" />
        <Skeleton className="h-7 w-28 rounded-lg" />
      </div>
      <Skeleton className="h-64 w-full rounded-2xl" />
      <div className="overflow-hidden rounded-2xl bg-card shadow-(--shadow-soft)">
        <div className="flex flex-col gap-4 p-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
