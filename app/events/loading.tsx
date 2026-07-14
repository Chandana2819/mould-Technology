import { Skeleton } from "@/components/ui/skeleton"

export default function EventsLoading() {
  return (
    <div className="w-full">
      {/* ================= HERO SECTION SKELETON ================= */}
      <div className="relative w-full h-[360px] bg-neutral-200 animate-pulse" />

      {/* ================= MAIN CONTENT SKELETON ================= */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT: EVENTS LIST */}
        <div className="lg:col-span-8 space-y-6">
          <Skeleton className="h-10 w-48 rounded" />

          {/* SEARCH FORM MOCKUP */}
          <div className="border-b pb-6 mb-8 flex gap-4 animate-pulse">
            <Skeleton className="h-10 w-full max-w-md rounded" />
            <Skeleton className="h-10 w-16 rounded" />
          </div>

          <Skeleton className="h-8 w-40 rounded" />

          {/* EVENTS LIST */}
          <div className="space-y-10 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col md:flex-row gap-6 border-b pb-8">
                {/* Thumbnail */}
                <Skeleton className="w-full md:w-60 h-32 rounded flex-shrink-0" />

                {/* Details */}
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-6 w-2/3 rounded" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-5/6 rounded" />
                  </div>
                  <Skeleton className="h-4 w-24 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: ADS */}
        <aside className="lg:col-span-4 animate-pulse">
          <Skeleton className="w-full h-[400px] rounded-lg" />
        </aside>
      </div>
    </div>
  )
}
