"use client"

import { useState } from "react"
import VideoGallery from "./VideoGallery"

type GalleryTabsProps = {
  videoGallery?: string[]
}

export default function GalleryTabs({ videoGallery }: GalleryTabsProps) {
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
                ${
                  activeTab === tab.id
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
      {activeTab === "video" && (
        videoGallery && videoGallery.length > 0 ? (
          <VideoGallery videos={videoGallery} />
        ) : (
          <div className="h-72 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400">
            No videos available
          </div>
        )
      )}

      {activeTab === "product" && (
        <div className="h-72 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400">
          Product Gallery Coming Soon
        </div>
      )}

      {activeTab === "company" && (
        <div className="h-72 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400">
          Company Gallery Coming Soon
        </div>
      )}

      {activeTab === "factory" && (
        <div className="h-72 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400">
          Factory Gallery Coming Soon
        </div>
      )}
    </div>
  )
}