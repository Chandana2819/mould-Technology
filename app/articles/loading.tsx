import { Skeleton } from "@/components/ui/skeleton"

export default function ArticlesLoading() {
  return (
    <div className="bg-white space-y-12 pb-24">
      {/* ================= ARTICLE TOP BANNER SKELETON ================= */}
      <div className="w-full flex justify-center py-4">
        <Skeleton className="w-full max-w-[970px] h-[90px] md:h-[120px] rounded-lg" />
      </div>

      {/* ================= WHAT'S NEW STRIP SKELETON ================= */}
      <section className="border-b border-gray-200 bg-white">
        <div className="max-w-[1320px] mx-auto px-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
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

      {/* ================= TOP SPLIT SECTION SKELETON ================= */}
      <section className="bg-[#E9ECEF]">
        <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-[420px_1fr]">
          {/* LEFT – LATEST ISSUE */}
          <div className="p-10 flex flex-col justify-center space-y-6">
            <Skeleton className="h-8 w-44 rounded" />
            <Skeleton className="w-[220px] h-[300px] rounded shadow-xl" />
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-8 w-36 rounded" />
          </div>

          {/* RIGHT – LATEST MAGAZINE HERO */}
          <div className="relative h-[520px] bg-neutral-200 flex flex-col justify-end p-10 space-y-4">
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-10 w-3/4 rounded" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
            </div>
            <Skeleton className="h-4 w-24 rounded" />
          </div>
        </div>
      </section>

      {/* ================= ARTICLE MIDDLE BANNER SKELETON ================= */}
      <div className="w-full flex justify-center py-2">
        <Skeleton className="w-full max-w-[970px] h-[90px] md:h-[120px] rounded-lg" />
      </div>

      {/* ================= IN THIS ISSUE SKELETON ================= */}
      <section className="max-w-[1320px] mx-auto px-6 py-8">
        <Skeleton className="h-10 w-56 rounded mb-10" />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
          {/* Left Grid of Articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-14">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="w-full aspect-[16/9] rounded-lg" />
                <Skeleton className="h-5 w-20 rounded" />
                <Skeleton className="h-7 w-11/12 rounded" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-4/5 rounded" />
                </div>
              </div>
            ))}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8 hidden lg:block">
            <div className="border border-gray-100 rounded-xl p-6 space-y-4">
              <Skeleton className="h-6 w-36 rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-11/12 rounded" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <Skeleton className="w-full h-[250px] rounded-xl" />
          </div>
        </div>
      </section>
    </div>
  )
}
