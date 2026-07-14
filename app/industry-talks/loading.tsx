import { Skeleton } from "@/components/ui/skeleton"

export default function IndustryTalksLoading() {
  return (
    <div className="bg-white pb-24">
      {/* ================= HERO BANNER SKELETON ================= */}
      <section className="w-full bg-black animate-pulse">
        <div className="w-full h-[260px] md:h-[320px] lg:h-[380px] bg-neutral-900" />
      </section>

      {/* ================= CONTENT AREA SKELETON ================= */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-16">
          
          {/* LEFT COLUMN */}
          <div className="space-y-16 animate-pulse">
            {[1, 2, 3].map((i) => (
              <article
                key={i}
                className="grid md:grid-cols-[280px_1fr] gap-8 border-b border-gray-200 pb-12"
              >
                {/* IMAGE */}
                <div className="relative w-full h-[200px] md:h-[180px] bg-neutral-200 rounded flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/40 rounded-full flex items-center justify-center text-black text-xl shadow">
                    ▶
                  </div>
                </div>

                {/* TEXT CONTENT */}
                <div className="space-y-4">
                  {/* CATEGORY + DATE */}
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-6 w-20 rounded" />
                    <Skeleton className="h-4 w-24 rounded" />
                  </div>

                  {/* TITLE */}
                  <Skeleton className="h-8 w-3/4 rounded" />

                  {/* DESCRIPTION */}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-4/5 rounded" />
                  </div>

                  {/* WATCH LINK */}
                  <Skeleton className="h-5 w-16 rounded" />
                </div>
              </article>
            ))}
          </div>

          {/* RIGHT COLUMN (ADS) */}
          <aside className="hidden lg:block space-y-8 animate-pulse">
            <Skeleton className="w-[320px] h-[400px] rounded-lg" />
          </aside>

        </div>
      </section>
    </div>
  )
}
