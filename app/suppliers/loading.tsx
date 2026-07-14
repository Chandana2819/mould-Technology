import { Skeleton } from "@/components/ui/skeleton"

export default function SuppliersLoading() {
  return (
    <div className="min-h-screen w-full">
      <div className="w-full max-w-full mx-auto px-4 lg:px-6 lg:pr-8 pt-0 pb-4 md:py-6">
        <div className="w-full grid grid-cols-1 lg:[grid-template-columns:300px_minmax(0,1fr)_360px] gap-6 lg:gap-8">
          
          {/* LEFT FILTERS — DESKTOP PLACEHOLDER */}
          <aside className="hidden lg:block animate-pulse">
            <div className="border border-neutral-100 rounded-lg p-6 space-y-6">
              <Skeleton className="h-6 w-24 rounded" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-10 w-full rounded" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-10 w-full rounded" />
              </div>
            </div>
          </aside>

          {/* CENTER CONTENT */}
          <main className="space-y-4 md:space-y-6">
            {/* HERO */}
            <Skeleton className="w-full h-[96px] sm:h-[140px] md:h-[160px] rounded-lg" />

            {/* BREADCRUMB */}
            <div className="flex gap-2">
              <Skeleton className="h-4 w-12 rounded" />
              <span className="text-gray-300">/</span>
              <Skeleton className="h-4 w-24 rounded" />
            </div>

            {/* SEARCH HEADER */}
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <Skeleton className="h-8 w-48 rounded" />
                <Skeleton className="h-4 w-32 rounded" />
              </div>
              <Skeleton className="h-10 w-32 rounded" />
            </div>

            {/* RESULTS SKELETON LIST */}
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white border border-[#dee2e6] rounded-md p-4 sm:p-6 flex flex-col lg:flex-row gap-6">
                  {/* Logo */}
                  <Skeleton className="w-full lg:w-40 h-24 rounded shrink-0" />
                  
                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-1/3 rounded" />
                    <Skeleton className="h-4 w-1/4 rounded" />
                    <div className="space-y-2 pt-2">
                      <Skeleton className="h-4 w-full rounded" />
                      <Skeleton className="h-4 w-5/6 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>

          {/* RIGHT ADS */}
          <aside className="hidden lg:block animate-pulse">
            <Skeleton className="w-[300px] h-[600px] rounded-lg" />
          </aside>

        </div>
      </div>
    </div>
  )
}
