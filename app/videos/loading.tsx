import { Skeleton } from "@/components/ui/skeleton"

export default function VideosLoading() {
  return (
    <div className="bg-white space-y-12 pb-24">
      {/* ================= WHAT'S NEW STRIP SKELETON ================= */}
      <section className="border-b border-gray-200 bg-white">
        <div className="max-w-[1320px] mx-auto px-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-16 rounded" />
                  <Skeleton className="h-3 w-16 rounded" />
                </div>
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-5/6 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= MAIN CONTENT AREA SKELETON ================= */}
      <section className="max-w-[1320px] mx-auto px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
          {/* Left Column: Video List */}
          <div className="space-y-12">
            <Skeleton className="h-10 w-44 rounded" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-4">
                  {/* Thumbnail with Play Icon Mockup */}
                  <div className="relative aspect-[16/9] w-full bg-neutral-200 rounded-lg flex items-center justify-center shadow-sm overflow-hidden animate-pulse">
                    <div className="w-14 h-14 rounded-full bg-white/30 border border-white/50 flex items-center justify-center">
                      <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-12 border-l-white ml-1" />
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-16 rounded" />
                    <Skeleton className="h-3 w-20 rounded" />
                  </div>

                  {/* Title */}
                  <Skeleton className="h-6 w-11/12 rounded" />

                  {/* Excerpt */}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-5/6 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Sidebar Ads */}
          <div className="space-y-8 hidden lg:block">
            <div className="border border-gray-100 rounded-xl p-6 space-y-4 animate-pulse">
              <Skeleton className="h-6 w-36 rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-11/12 rounded" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <Skeleton className="w-full h-[250px] rounded-xl animate-pulse" />
          </div>
        </div>
      </section>
    </div>
  )
}
