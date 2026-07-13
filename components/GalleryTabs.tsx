// GalleryTabs.tsx
"use client"

import { useState } from "react"
import VideoGallery from "./VideoGallery"

type GalleryTabsProps = {
  videoGallery?: string[]
  productGallery?: string[]
  companyGallery?: string[]
  factoryGallery?: string[]
  isPaid?: boolean
}

const NO_PLAN_MESSAGE =
  "This supplier hasn't purchased a plan to upload gallery content."

function EmptyState({ message }: { message: string }) {
  return (
    <div className="h-72 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 text-center px-6">
      {message}
    </div>
  )
}

/* Simple responsive image grid reused for product/company/factory galleries */
function ImageGrid({ images }: { images: string[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {images.filter(Boolean).map((src, i) => (
        <a
          key={i}
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="block aspect-square rounded-lg overflow-hidden border border-gray-200"
        >
          <img
            src={src}
            alt={`Gallery image ${i + 1}`}
            className="w-full h-full object-cover"
          />
        </a>
      ))}
    </div >
  )
}

export default function GalleryTabs({
  videoGallery,
  productGallery,
  companyGallery,
  factoryGallery,
  isPaid = false,
}: GalleryTabsProps) {
  const [activeTab, setActiveTab] = useState("video")

  return (
    <div>
      {/* Tab Navigation - Side by Side */}
      <div className="border-b border-gray-200 mb-8">
        <div className="flex gap-8 overflow-x-auto">
          {[
            { id: "video", label: "Video Gallery" },
            { id: "product", label: "Product Gallery" },
            { id: "company", label: "Company Gallery" },
            { id: "factory", label: "Factory Gallery" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium border-b-2 transition whitespace-nowrap px-1
                ${activeTab === tab.id
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-500 hover:text-black hover:border-gray-300"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "video" &&
        (videoGallery && videoGallery.filter(Boolean).length > 0 ? (
          <VideoGallery videos={videoGallery} />
        ) : (
          <EmptyState message="No videos available" />
        ))}

      {activeTab === "product" &&
        (!isPaid ? (
          <EmptyState message={NO_PLAN_MESSAGE} />
        ) : productGallery && productGallery.filter(Boolean).length > 0 ? (
          <ImageGrid images={productGallery} />
        ) : (
          <EmptyState message="No product images available" />
        ))}

      {activeTab === "company" &&
        (!isPaid ? (
          <EmptyState message={NO_PLAN_MESSAGE} />
        ) : companyGallery && companyGallery.filter(Boolean).length > 0 ? (
          <ImageGrid images={companyGallery} />
        ) : (
          <EmptyState message="No company images available" />
        ))}

      {activeTab === "factory" &&
        (!isPaid ? (
          <EmptyState message={NO_PLAN_MESSAGE} />
        ) : factoryGallery && factoryGallery.filter(Boolean).length > 0 ? (
          <ImageGrid images={factoryGallery} />
        ) : (
          <EmptyState message="No factory images available" />
        ))}
    </div>
  )
}