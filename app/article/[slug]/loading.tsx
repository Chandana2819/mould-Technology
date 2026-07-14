import { Skeleton } from "@/components/ui/skeleton"

export default function ArticleDetailLoading() {
  return (
    <main className="max-w-[1320px] mx-auto px-6 py-10 space-y-8 animate-pulse">
      {/* Title */}
      <Skeleton className="h-10 md:h-12 w-3/4 rounded" />

      {/* Meta (Date / Author) */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-4 w-32 rounded" />
      </div>

      {/* Image */}
      <Skeleton className="w-full h-[380px] md:h-[520px] rounded-xl" />

      {/* Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-[8fr_4fr] gap-10">
        {/* Left Column: Content Body */}
        <div className="space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-11/12 rounded" />
            <Skeleton className="h-4 w-5/6 rounded" />
            <Skeleton className="h-4 w-4/5 rounded" />
          </div>
          
          <div className="space-y-3 pt-4">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-11/12 rounded" />
            <Skeleton className="h-4 w-3/4 rounded" />
          </div>

          <div className="space-y-3 pt-4">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-5/6 rounded" />
            <Skeleton className="h-4 w-2/3 rounded" />
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-6 hidden lg:block">
          <div className="border border-gray-100 rounded-xl p-6 space-y-4">
            <Skeleton className="h-6 w-36 rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-11/12 rounded" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </main>
  )
}
