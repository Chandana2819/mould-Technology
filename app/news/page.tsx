// import Link from "next/link"
// import Image from "next/image"
// import type { Post } from "@/types/Post"
// import SupplierAds from "@/components/SupplierAds"
// import NewsletterForm from "@/components/news/NewsletterForm"

// export default async function NewsPage() {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/api/posts?limit=50`,
//     { cache: "no-store" }
//   )

//   const data = await res.json()
//   const posts: Post[] = data.data || data

//   const slugOf = (post: Post) =>
//     typeof post.category === "object"
//       ? post.category?.slug?.toLowerCase()
//       : String(post.category || "").toLowerCase()

//   const getImage = (url?: string | null) => {
//     if (!url) return "/placeholder.svg"
//     if (url.startsWith("http")) return url
//     return `${process.env.NEXT_PUBLIC_API_URL}${url}`
//   }

//   // ================= WHAT'S NEW =================
//   const whatsNewPosts = posts
//     .filter((p) => slugOf(p).includes("whatsnew"))
//     .slice(0, 5)

//   // ================= NEWS POSTS =================
//   const newsPosts = posts.filter(
//     (p) => slugOf(p) === "news"
//   )

//   return (
//     <main className="bg-white">

//       {/* ================= WHAT'S NEW STRIP ================= */}
//       <section className="border-b border-gray-200">
//         <div className="max-w-[1320px] mx-auto px-6 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
//           {whatsNewPosts.map((post) => (
//             <Link key={post.id} href={`/post/${post.slug}`}>
//               <p className="text-sm font-semibold hover:text-[#C8102E]">
//                 {post.title}
//               </p>
//             </Link>
//           ))}
//         </div>
//       </section>

//       {/* ================= NEWSLETTER ================= */}
//       <NewsletterForm />

//       {/* ================= NEWS LIST ================= */}
//       <section className="max-w-[1320px] mx-auto px-6 py-16">
//         <h1 className="text-[36px] font-bold text-[#003B5C] mb-10">
//           News
//         </h1>

//         <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">

//           {/* LEFT */}
//           <div className="space-y-12">
//             {newsPosts.map((post) => (
//               <article
//                 key={post.id}
//                 className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 pb-10 border-b"
//               >
//                <div className="relative w-full h-[160px]">
//   <Image
//     src={getImage(post.imageUrl)}
//     alt={post.title}
//     fill
//     className="object-cover rounded"
//     sizes="(max-width:768px) 100vw, 260px"
//   />
// </div>

//                 <div>
//                   <span className="text-xs text-gray-500 block mb-1">
//                     {post.publishedAt
//                       ? new Date(post.publishedAt).toLocaleDateString("en-US", {
//                           day: "2-digit",
//                           month: "short",
//                           year: "numeric",
//                         })
//                       : ""}
//                   </span>

//                   <h2 className="text-[22px] font-bold mb-2">
//                     {post.title}
//                   </h2>

//                   <p className="text-gray-600 mb-3">
//                     {post.excerpt ||
//                       post.content
//                         ?.replace(/<[^>]+>/g, "")
//                         .slice(0, 140) + "..."}
//                   </p>

//                   <Link
//                     href={`/post/${post.slug}`}
//                     className="text-[#0072BC] font-bold uppercase text-sm"
//                   >
//                     Read More →
//                   </Link>
//                 </div>
//               </article>
//             ))}

//             {/* PAGINATION */}
//             <div className="flex gap-2">
//               <button className="border px-3 py-2">‹</button>
//               <button className="border px-3 py-2 bg-[#003B5C] text-white">1</button>
//               <button className="border px-3 py-2">2</button>
//               <button className="border px-3 py-2">3</button>
//               <button className="border px-3 py-2">›</button>
//             </div>
//           </div>

//           {/* RIGHT ADS */}
//           <aside className="sticky top-24 space-y-6">
//             <SupplierAds />
//           </aside>
//         </div>
//       </section>
//     </main>
//   )
// }
"use client"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import type { Post } from "@/types/Post"
import SupplierAds from "@/components/SupplierAds"
import NewsletterForm from "@/components/news/NewsletterForm"

const POSTS_PER_PAGE = 6 // Number of posts per page

export default function NewsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts?limit=100`,
          { cache: "no-store" }
        )
        const data = await res.json()
        const allPosts: Post[] = data.data || data
        setPosts(allPosts)
      } catch (error) {
        console.error("Failed to fetch posts:", error)
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  // Helper functions
  const slugOf = (post: Post) =>
    typeof post.category === "object"
      ? post.category?.slug?.toLowerCase()
      : String(post.category || "").toLowerCase()

  const getImage = (url?: string | null) => {
    if (!url) return "/placeholder.svg"
    if (url.startsWith("http")) return url
    return `${process.env.NEXT_PUBLIC_API_URL}${url}`
  }

  // ================= WHAT'S NEW =================
  const whatsNewPosts = posts
    .filter((p) => slugOf(p).includes("whatsnew"))
    .slice(0, 5)

  // ================= NEWS POSTS =================
  const newsPosts = posts.filter(
    (p) => slugOf(p) === "news"
  )

  // ================= PAGINATION =================
  const totalPages = Math.ceil(newsPosts.length / POSTS_PER_PAGE)
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const endIndex = startIndex + POSTS_PER_PAGE
  const currentPosts = newsPosts.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of the section
    document.getElementById('news-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  if (loading) {
    return (
      <main className="bg-white">
        <div className="max-w-[1320px] mx-auto px-6 py-16">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C8102E]"></div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-white">

      {/* ================= WHAT'S NEW STRIP ================= */}
      {whatsNewPosts.length > 0 && (
        <section className="border-b border-gray-200">
          <div className="max-w-[1320px] mx-auto px-6 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {whatsNewPosts.map((post) => (
              <Link key={post.id} href={`/post/${post.slug}`}>
                <p className="text-sm font-semibold hover:text-[#C8102E] transition-colors">
                  {post.title}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ================= NEWSLETTER ================= */}
      <NewsletterForm hasNewsletterContent={newsPosts.length > 0} />

      {/* ================= NEWS LIST ================= */}
      <section id="news-section" className="max-w-[1320px] mx-auto px-6 py-16">
        <h1 className="text-[36px] font-bold text-[#003B5C] mb-10">
          News
        </h1>

        {newsPosts.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">No news articles available at the moment.</p>
            <p className="text-gray-400 text-sm mt-2">Check back later for updates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">

            {/* LEFT */}
            <div className="space-y-12">
              {currentPosts.map((post) => (
                <article
                  key={post.id}
                  className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 pb-10 border-b border-gray-200 last:border-0"
                >
                  <div className="relative w-full h-[160px]">
                    <Image
                      src={getImage(post.imageUrl)}
                      alt={post.title}
                      fill
                      className="object-cover rounded"
                      sizes="(max-width:768px) 100vw, 260px"
                    />
                  </div>

                  <div>
                    <span className="text-xs text-gray-500 block mb-1">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                        : ""}
                    </span>

                    <h2 className="text-[22px] font-bold mb-2 hover:text-[#C8102E] transition-colors">
                      <Link href={`/post/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>

                    <p className="text-gray-600 mb-3 line-clamp-3">
                      {post.excerpt ||
                        post.content
                          ?.replace(/<[^>]+>/g, "")
                          .slice(0, 140) + "..."}
                    </p>

                    <Link
                      href={`/post/${post.slug}`}
                      className="text-[#0072BC] font-bold uppercase text-sm hover:underline"
                    >
                      Read More →
                    </Link>
                  </div>
                </article>
              ))}

              {/* ================= DYNAMIC PAGINATION ================= */}
              {totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2 pt-8 border-t border-gray-200">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-md transition ${currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    ‹ Previous
                  </button>

                  {/* Page Numbers */}
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-md transition ${currentPage === page
                          ? 'bg-[#003B5C] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {page}
                    </button>
                  ))}

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-md transition ${currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    Next ›
                  </button>
                </div>
              )}

              {/* Show total posts count */}
              <div className="text-center text-sm text-gray-500 mt-4">
                Showing {startIndex + 1} - {Math.min(endIndex, newsPosts.length)} of {newsPosts.length} news articles
              </div>
            </div>

            {/* RIGHT ADS */}
            <aside className="sticky top-24 space-y-6">
              <SupplierAds />
            </aside>
          </div>
        )}
      </section>
    </main>
  )
}