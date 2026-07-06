"use client"
import Image from "next/image"
import { useEffect, useState } from "react"
import Link from "next/link"

type Article = {
  id: number
  title: string
  slug: string
  excerpt?: string
  imageUrl?: string
  badge?: string
  status?: string
  createdAt: string
}

export default function RecruiterArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArticles()
  }, [])

  async function fetchArticles() {
    try {
      const token = localStorage.getItem("token")

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/recruiter/articles`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!res.ok) throw new Error("Failed to fetch articles")

      const data = await res.json()

      const articlesArray: Article[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : []

      setArticles(articlesArray)
    } catch (error) {
      console.error("Fetch articles error:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: number) {
    const ok = confirm("Are you sure you want to delete this article?")
    if (!ok) return

    try {
      const token = localStorage.getItem("token")

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/recruiter/articles/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!res.ok) throw new Error("Delete failed")

      setArticles(prev => prev.filter(article => article.id !== id))
    } catch (error) {
      alert("Failed to delete article")
    }
  }

  if (loading) {
    return <p className="p-10">Loading articles...</p>
  }

  return (
    <div className="max-w-6xl mx-auto p-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">My Articles</h1>

        <Link
          href="/recruiter/articles/create"
          className="bg-black text-white px-5 py-2 rounded-lg"
        >
          + Create Article
        </Link>
      </div>

      {articles.length === 0 ? (
        <p className="text-gray-500">No articles created yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {articles.map(article => (
            <div
              key={article.id}
              className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
            >
              {/* IMAGE */}
              {article.imageUrl && (
  <div className="relative w-full h-40">
    <Image
      src={article.imageUrl}
      alt={article.title}
      fill
      className="object-cover"
      sizes="(max-width:768px) 100vw, 50vw"
    />
  </div>
)}

              <div className="p-5 space-y-3">

                {/* BADGE + STATUS */}
                <div className="flex items-center justify-between">
                  {article.badge && (
                    <span className="text-xs px-3 py-1 rounded-full bg-blue-600 text-white">
                      {article.badge}
                    </span>
                  )}

                  {article.status && (
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        article.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {article.status}
                    </span>
                  )}
                </div>

                {/* TITLE */}
                <h2 className="font-semibold text-lg line-clamp-2">
                  {article.title}
                </h2>

                {/* EXCERPT */}
                {article.excerpt && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {article.excerpt}
                  </p>
                )}

                {/* DATE */}
                <p className="text-xs text-gray-400">
                  Created:{" "}
                  {new Date(article.createdAt).toLocaleDateString()}
                </p>

                {/* ACTIONS */}
                <div className="flex gap-4 pt-3 border-t">
                  <Link
                    href={`/recruiter/articles/${article.id}/edit`}
                    className="text-blue-600 text-sm font-medium"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(article.id)}
                    className="text-red-600 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
