"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import CreateArticleButton from "@/components/recruiter/CreateArticleButton";
import {
  fetchArticlePostingEligibility,
  type ContentLimitEligibility,
} from "@/lib/packageLimits";

type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  imageUrl?: string;
  badge?: string;
  status?: string;
  createdAt: string;
};

export default function RecruiterArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [eligibility, setEligibility] = useState<ContentLimitEligibility | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
    loadEligibility();
  }, []);

  async function loadEligibility() {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const data = await fetchArticlePostingEligibility(token);
      setEligibility(data);
    } catch (error) {
      console.error("Article eligibility error:", error);
    }
  }

  async function fetchArticles() {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/recruiter/articles`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch articles");

      const data = await res.json();

      const articlesArray: Article[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : [];

      setArticles(articlesArray);
    } catch (error) {
      console.error("Fetch articles error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    const ok = confirm("Are you sure you want to delete this article?");
    if (!ok) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/recruiter/articles/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Delete failed");

      setArticles((prev) => prev.filter((article) => article.id !== id));
    } catch (error) {
      alert("Failed to delete article");
    }
  }

  // Check if user can create articles
  const canCreateArticles = eligibility?.canCreate !== false && eligibility?.plan !== "free";

  if (loading) {
    return <p className="p-10">Loading articles...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">My Articles</h1>
          {eligibility && (
            <p className="text-sm text-gray-500 mt-1">
              {eligibility.isUnlimited
                ? "Unlimited technical articles on your plan"
                : eligibility.canCreate
                  ? `${eligibility.remaining ?? 0} article${eligibility.remaining === 1 ? "" : "s"} remaining this year`
                  : eligibility.message || "Upgrade your plan to publish articles"}
            </p>
          )}
          {!eligibility && (
            <p className="text-sm text-gray-400 mt-1">
              Loading plan information...
            </p>
          )}
        </div>

        <CreateArticleButton eligibility={eligibility} />
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500">No articles created yet.</p>
          {canCreateArticles && (
            <p className="text-sm text-gray-400 mt-2">
              Click the "Create Article" button to publish your first article.
            </p>
          )}
          {!canCreateArticles && eligibility?.plan === "free" && (
            <p className="text-sm text-amber-600 mt-2">
              Technical articles are available on Basic plan and above.
              <Link href="/pricing" className="text-blue-600 hover:underline ml-1">
                Upgrade your plan
              </Link>
            </p>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {articles.map((article) => (
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
                      className={`text-xs px-3 py-1 rounded-full ${article.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : article.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
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
                  Created: {new Date(article.createdAt).toLocaleDateString()}
                </p>

                {/* ACTIONS */}
                <div className="flex gap-4 pt-3 border-t">
                  <Link
                    href={`/recruiter/articles/${article.id}/edit`}
                    className="text-blue-600 text-sm font-medium hover:underline"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(article.id)}
                    className="text-red-600 text-sm font-medium hover:underline"
                  >
                    Delete
                  </button>

                  {article.status === "APPROVED" && (
                    <Link
                      href={`/articles/${article.slug}`}
                      target="_blank"
                      className="text-gray-600 text-sm font-medium hover:underline"
                    >
                      View
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}