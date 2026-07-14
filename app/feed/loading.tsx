import { Skeleton } from "@/components/ui/skeleton"

export default function FeedLoading() {
  return (
    <div className="bg-[#f4f6f8] min-h-screen">
      {/* ================= HERO SKELETON ================= */}
      <section className="relative bg-[#0F5B78] py-20 animate-pulse">
        <div className="max-w-[1200px] mx-auto px-6 space-y-4">
          <Skeleton className="h-12 w-1/2 bg-white/20 rounded" />
          <Skeleton className="h-6 w-2/3 bg-white/20 rounded" />
          
          {/* CTA Mockups */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 border border-white/20 rounded-md p-6 h-60 space-y-4">
              <Skeleton className="h-6 w-1/3 bg-white/20 rounded" />
              <Skeleton className="h-4 w-5/6 bg-white/20 rounded" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-1/2 bg-white/20 rounded" />
                <Skeleton className="h-3 w-2/3 bg-white/20 rounded" />
              </div>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-md p-6 h-60 space-y-4">
              <Skeleton className="h-6 w-1/3 bg-white/20 rounded" />
              <Skeleton className="h-4 w-5/6 bg-white/20 rounded" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-1/2 bg-white/20 rounded" />
                <Skeleton className="h-3 w-2/3 bg-white/20 rounded" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= JOB LIST SKELETON ================= */}
      <section className="max-w-[1200px] mx-auto px-4 py-14">
        <div className="mb-8 space-y-2">
          <Skeleton className="h-8 w-44 rounded" />
          <Skeleton className="h-4 w-64 rounded" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          {/* Left Column: Job Cards */}
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-md shadow-sm p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/4 rounded" />
                    <Skeleton className="h-3 w-1/6 rounded" />
                  </div>
                </div>
                <Skeleton className="h-5 w-1/3 rounded" />
                <div className="flex gap-4">
                  <Skeleton className="h-3 w-16 rounded" />
                  <Skeleton className="h-3 w-20 rounded" />
                  <Skeleton className="h-3.5 w-24 rounded" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-5/6 rounded" />
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Sidebar Ad */}
          <aside className="hidden lg:block animate-pulse">
            <Skeleton className="w-full h-[400px] rounded-lg" />
          </aside>
        </div>
      </section>
    </div>
  )
}
