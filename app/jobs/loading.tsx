import { Skeleton } from "@/components/ui/skeleton"

export default function JobsLoading() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8 animate-pulse">
      <Skeleton className="h-10 w-32 rounded" />

      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="border border-neutral-100 rounded-lg p-6 space-y-4 shadow-sm">
            <Skeleton className="h-6 w-1/3 rounded" />
            <div className="flex gap-6">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
