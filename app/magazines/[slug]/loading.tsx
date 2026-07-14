import { Skeleton } from "@/components/ui/skeleton"

export default function SingleMagazineLoading() {
  return (
    <div className="max-w-[1320px] mx-auto px-4 md:px-6 lg:px-[15px] py-12 space-y-12">
      {/* ================= FLIPBOOK VIEWER MOCKUP SKELETON ================= */}
      <div className="relative flex justify-center py-10">
        <div className="w-full max-w-[800px] aspect-[4/3] md:h-[600px] md:w-[800px] bg-neutral-100 rounded-lg shadow-2xl border border-neutral-200 flex overflow-hidden">
          {/* Left Page */}
          <div className="w-1/2 h-full border-r border-neutral-200 p-8 flex flex-col justify-between">
            <Skeleton className="h-6 w-20 rounded" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4 rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
            </div>
            <Skeleton className="h-4 w-12 rounded" />
          </div>
          {/* Right Page */}
          <div className="w-1/2 h-full p-8 flex flex-col justify-between">
            <Skeleton className="h-6 w-20 rounded self-end" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-2/3 rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-11/12 rounded" />
            </div>
            <Skeleton className="h-4 w-12 rounded self-end" />
          </div>
        </div>
      </div>

      {/* ================= TITLE & DESCRIPTION SKELETONS ================= */}
      <div className="space-y-6">
        <Skeleton className="h-12 w-2/3 rounded" />
        
        <div className="space-y-3">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-11/12 rounded" />
          <Skeleton className="h-4 w-5/6 rounded" />
        </div>
      </div>

      {/* ================= DOWNLOAD BUTTON SKELETON ================= */}
      <div className="pt-6">
        <Skeleton className="h-12 w-48 rounded" />
      </div>
    </div>
  )
}
