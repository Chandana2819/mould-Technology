import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="max-w-[1320px] mx-auto px-6 space-y-12">
      {/* ================= TOP AD BANNER SKELETON ================= */}
      <div className="w-full flex justify-center py-4">
        <Skeleton className="w-full max-w-[970px] h-[90px] md:h-[120px] rounded-lg" />
      </div>

      {/* ================= HERO ARTICLE SKELETON ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        {/* Left: Large Featured Article Skeleton */}
        <div className="space-y-6">
          <Skeleton className="w-full aspect-[16/9] md:h-[450px] rounded-xl" />
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-8 w-3/4 rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-5/6 rounded" />
          </div>
        </div>

        {/* Right: Sidebar / Small Featured Items Skeleton */}
        <div className="space-y-6 border-l border-gray-100 lg:pl-6 hidden lg:block">
          <Skeleton className="h-7 w-40 rounded mb-4" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 pb-6 border-b border-gray-100 last:border-b-0">
              <Skeleton className="w-20 h-20 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-16 rounded" />
                <Skeleton className="h-5 w-full rounded" />
                <Skeleton className="h-3 w-12 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= CARD GRID SKELETON (3 COLUMNS) ================= */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-4">
              <Skeleton className="w-full aspect-[16/10] rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-24 rounded" />
                <Skeleton className="h-6 w-11/12 rounded" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-4/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= MIDDLE BANNER SKELETON ================= */}
      <div className="w-full flex justify-center py-2">
        <Skeleton className="w-full max-w-[970px] h-[90px] md:h-[120px] rounded-lg" />
      </div>

      {/* ================= HORIZONTAL LIST / RECENT POSTS SKELETON ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
        {/* Left List of rows */}
        <div className="space-y-8">
          <Skeleton className="h-8 w-56 rounded mb-2" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-6 pb-6 border-b border-gray-150 last:border-b-0">
              <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-20 rounded" />
                  <Skeleton className="h-3 w-24 rounded" />
                </div>
                <Skeleton className="h-6 w-3/4 rounded" />
                <Skeleton className="h-4 w-full rounded hidden md:block" />
                <Skeleton className="h-4 w-5/6 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Right Sidebar Widgets */}
        <div className="space-y-6 hidden lg:block">
          <div className="border border-gray-100 rounded-xl p-6 space-y-4">
            <Skeleton className="h-6 w-36 rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-11/12 rounded" />
            <Skeleton className="h-4 w-5/6 rounded" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <Skeleton className="w-full h-[250px] rounded-xl" />
        </div>
      </div>
    </div>
  )
}
