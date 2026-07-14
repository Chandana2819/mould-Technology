import { Skeleton } from "@/components/ui/skeleton"

export default function MagazinesLoading() {
  return (
    <div className="w-full space-y-16">
      {/* ================= TOP FEATURED & COVER STORY SECTION ================= */}
      <section className="bg-[#E9ECEF]">
        <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-[420px_1fr]">
          {/* Left: Latest Issue Info */}
          <div className="p-10 flex flex-col justify-center space-y-6">
            <Skeleton className="h-8 w-40 rounded" />
            <Skeleton className="w-[220px] h-[300px] rounded shadow-xl" />
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-8 w-36 rounded" />
          </div>

          {/* Right: Large Featured Banner Cover Story */}
          <div className="relative h-[520px]">
            <Skeleton className="w-full h-full" />
          </div>
        </div>
      </section>

      {/* ================= IN THIS ISSUE SECTION ================= */}
      <section className="max-w-[1320px] mx-auto px-6 space-y-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64 rounded" />
          <Skeleton className="h-4 w-24 rounded" />
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-4">
              <Skeleton className="w-full aspect-[16/10] rounded-lg" />
              <div className="space-y-3">
                <Skeleton className="h-5 w-24 rounded" />
                <Skeleton className="h-6 w-11/12 rounded" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-2/3 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= ARCHIVE SECTION ================= */}
      <section className="bg-[#f2f2f2] py-20">
        <div className="max-w-[1200px] mx-auto px-6 space-y-12">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-44 rounded" />
            <Skeleton className="h-10 w-48 rounded" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-20">
            {/* Left: Magazine List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4 flex flex-col items-center">
                  <Skeleton className="w-[200px] h-[280px] rounded shadow-md" />
                  <Skeleton className="h-5 w-32 rounded" />
                  <Skeleton className="h-4 w-20 rounded" />
                </div>
              ))}
            </div>

            {/* Right: Ad space */}
            <div className="hidden lg:block space-y-6">
              <Skeleton className="w-[250px] h-[300px] rounded" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
