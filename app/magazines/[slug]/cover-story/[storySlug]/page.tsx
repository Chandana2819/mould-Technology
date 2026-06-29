import Image from "next/image"

type Props = {
  params: Promise<{
    slug: string
    storySlug: string
  }>
}

async function getStory(storySlug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/magazines/cover-stories/${storySlug}`,
    { cache: "no-store" }
  )

  if (!res.ok) throw new Error("Failed to fetch story")

  return res.json()
}

export default async function CoverStoryPage({ params }: Props) {
  const { storySlug } = await  params
  const story = await getStory(storySlug)

  const publishedDate = new Date(story.createdAt).toLocaleDateString(
    "en-US",
    { month: "2-digit", day: "2-digit", year: "numeric" }
  )

  return (
    <main className="bg-[#f5f5f5]">

      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full h-[520px] overflow-hidden">
        
        <Image
          src={story.coverImageUrl || "/placeholder.svg"}
          alt={story.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        {/* White Overlay Card */}
        <div className="absolute bottom-0 left-[8%] bg-white p-10 w-[60%] shadow-xl">

          <p className="text-sm text-gray-500 mb-3">
            Published {publishedDate}
          </p>

          <h1 className="text-4xl font-bold text-[#003049] mb-4">
            {story.title}
          </h1>

          {story.shortDescription && (
            <p className="text-gray-700 mb-6">
              {story.shortDescription}
            </p>
          )}

          {/* TAGS */}
          {story.keyCategories && (
            <div className="flex flex-wrap gap-3">
              {story.keyCategories.map((tag: string, i: number) => (
                <span
                  key={i}
                  className="bg-[#003049] text-white text-xs px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= CONTENT + SIDEBAR ================= */}
      <section className="grid grid-cols-1 lg:grid-cols-[8fr_4fr] gap-12 px-8 lg:px-[80px] py-16">

        {/* ARTICLE CONTENT */}
        <article className="prose prose-lg max-w-none">
          <div
            dangerouslySetInnerHTML={{
              __html: story.fullDescription,
            }}
          />
        </article>

        {/* SIDEBAR */}
        <aside>
          <div className="bg-white p-6 shadow">
            <h3 className="font-semibold mb-4">
              Sponsored Content
            </h3>
            <p className="text-sm text-gray-600">
              Your advertisement area
            </p>
          </div>
        </aside>

      </section>
    </main>
  )
}