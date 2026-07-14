import Header from "@/components/Header"
import AdBanner from "@/components/AdBanner"
import PassionOnWheels from "@/components/PassionOnWheels"
import LatestHero from "@/components/LatestHero"
import TrendingAd from "@/components/TrendingAd"
import ShopTalkAd from "@/components/ShopTalkAd"
import ManufacturingConnected from "@/components/ManufacturingConnected"
import BasicsSection from "@/components/BasicsSection"
import VideosSection from "@/components/VideosSection"
import NewsProductsSection from "@/components/NewsProductsSection"
import LatestIssues from "@/components/LatestIssues"
import Footer from "@/components/Footer"

import type { Post } from "@/types/Post"
import TrendingSection from "@/components/TrendingSection"
import CompanyArticles from "@/components/company/CompanyArticles"
import HomeCompanyArticles from "@/components/HomeCompanyArticles"
import Banner from "@/components/Banners/Banner";


export default async function Home() {
  /* ================= FETCH POSTS ================= */

  const postsRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/posts?limit=50`,
    { cache: "no-store" }
  );

  const text = await postsRes.text();

  console.log("Posts API:", text);

  if (!text) {
    throw new Error("Posts API returned empty response");
  }

  const postsData = JSON.parse(text);

  const posts: Post[] = postsData.data || postsData

  if (!Array.isArray(posts) || posts.length === 0) {
    return <div className="text-center p-10">No posts available</div>
  }

  /* ================= CATEGORY HELPER ================= */

  const getCategorySlug = (post: Post) =>
    typeof post.category === "object"
      ? post.category?.slug?.toLowerCase()
      : String(post.category || "").toLowerCase()

  /* ================= GROUP POSTS ================= */

  const latestPosts = posts.filter(
    (p) => getCategorySlug(p) === "latest"
  )

  const manufacturingPosts = posts.filter(
    (p) => getCategorySlug(p) === "manufacturing"
  )

  /* ================= FEATURED ================= */

  const latestPost = latestPosts[0]

  return (
    <>
       {/* ================= HOME TOP BANNER ================= */}
       <br />
      <Banner placement="HOME_TOP" />

      {/* 🏢 Company Articles */}
      <CompanyArticles  />

      {/* 📰 Latest Hero */}
      {latestPost && (
        <LatestHero post={latestPost} posts={posts} />
      )}

      {/* 📈 Trending */}
      <TrendingSection posts={posts} />

      {/* 📘 Basics */}
      <BasicsSection posts={posts} />

         {/* ================= HOME MIDDLE BANNER ================= */}
      <Banner placement="HOME_MIDDLE" />

      {/* 🎥 Videos */}
      <VideosSection posts={posts} />

      <HomeCompanyArticles />

        {/* ================= HOME BOTTOM BANNER ================= */}
      <Banner placement="HOME_BOTTOM" />
    </>
  )
}
