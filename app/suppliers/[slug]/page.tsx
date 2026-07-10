import CompanyArticlesCarousel from "@/components/CompanyArticlesCarousel"
import SocialLinksTracker from "@/components/SocialLinksTracker"
import {
  LucideFacebook,
  LucideLinkedin,
  LucideTwitter,
  LucideYoutube,
  Globe,
  MapPin,
  Phone,
  Mail,
} from "lucide-react"
import ClaimCompanyBanner from "@/components/ClaimCompanyBanner"
import GalleryTabs from "@/components/GalleryTabs" // 👈 NEW IMPORT

/* ================= TYPES ================= */

type Article = {
  id: number
  title: string
  slug: string
  excerpt?: string | null
  imageUrl?: string | null
  publishedAt: string
}

type Supplier = {
  id: number
  companyId: number
  name: string
  slug: string
  description: string
  website?: string
  logoUrl?: string
  coverImageUrl?: string
  phoneNumber?: string
  email?: string
  tradeNames?: string[]
  videoGallery?: string[]
  socialLinks?: {
    facebook?: string
    linkedin?: string
    twitter?: string
    youtube?: string
  }
  Company?: {
    id: number
    name: string
    location?: string
    industry?: string
    website?: string
  }
}

/* ================= PAGE ================= */

export default async function SupplierShowroomPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  /* ---------- FETCH SUPPLIER ---------- */
  const supplierRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/suppliers/${slug}`,
    { cache: "no-store" }
  )

  if (!supplierRes.ok) {
    return (
      <div className="p-10 text-center text-gray-600">
        Supplier not found
      </div>
    )
  }

  const supplier: Supplier = await supplierRes.json()
  const social = supplier.socialLinks || {}

  /* ---------- FETCH COMPANY ARTICLES ---------- */
  const articlesRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/companies/${supplier.companyId}/articles`,
    { cache: "no-store" }
  )

  let articles: Article[] = []
  if (articlesRes.ok) {
    articles = await articlesRes.json()
  }

  const websiteLink = supplier.website || supplier.Company?.website

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}
      <div className="relative h-[300px] bg-black">
        {supplier.coverImageUrl && (
          <img
            src={supplier.coverImageUrl}
            alt={supplier.name}
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          />
        )}
      </div>

      {/* MAIN CARD */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 -mt-36">
        <div className="bg-white rounded-lg shadow p-10 border-t-4 border-red-700">

          {/* TITLE */}
          <h1 className="text-3xl font-bold text-center text-[#0b3954]">
            {supplier.name}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-14 mt-12">

            {/* LEFT SIDEBAR */}
            <aside className="space-y-8 md:col-span-1">

              {supplier.logoUrl && (
                <img
                  src={supplier.logoUrl}
                  alt={supplier.name}
                  className="w-full max-w-[160px] object-contain"
                />
              )}

              {/* LOCATION */}
              {supplier.Company?.location && (
                <p className="flex items-center justify-center gap-2 text-gray-500 mt-2">
                  <MapPin size={16} />
                  {supplier.Company.location}
                </p>
              )}

              {/* CONTACT INFO */}
              <div className="text-sm space-y-3">

                {supplier.tradeNames && supplier.tradeNames.length > 0 && (
                  <p className="text-gray-600">
                    <strong>Trade Names:</strong>{" "}
                    {supplier.tradeNames.join(", ")}
                  </p>
                )}

                {supplier.phoneNumber && (
                  <p className="flex items-center gap-2">
                    <Phone size={14} />
                    {supplier.phoneNumber}
                  </p>
                )}

                {supplier.email && (
                  <p className="flex items-center gap-2">
                    <Mail size={14} />
                    {supplier.email}
                  </p>
                )}

                {websiteLink && (
                  <p className="flex items-center gap-2">
                    <Globe size={14} />
                    <a
                      href={websiteLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {websiteLink}
                    </a>
                  </p>
                )}
              </div>

              {/* SOCIAL LINKS */}
              {(social.facebook ||
                social.linkedin ||
                social.twitter ||
                social.youtube) && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 uppercase mb-3">
                    Connect
                  </h4>

                  <SocialLinksTracker supplierId={supplier.id}>
                    <div className="flex gap-4">
                      {social.facebook && (
                        <a href={social.facebook} target="_blank">
                          <LucideFacebook className="w-5 h-5 text-[#3b5998]" />
                        </a>
                      )}
                      {social.linkedin && (
                        <a href={social.linkedin} target="_blank">
                          <LucideLinkedin className="w-5 h-5 text-[#0077b5]" />
                        </a>
                      )}
                      {social.twitter && (
                        <a href={social.twitter} target="_blank">
                          <LucideTwitter className="w-5 h-5" />
                        </a>
                      )}
                      {social.youtube && (
                        <a href={social.youtube} target="_blank">
                          <LucideYoutube className="w-5 h-5 text-red-600" />
                        </a>
                      )}
                    </div>
                  </SocialLinksTracker>
                </div>
              )}
            </aside>

            {/* RIGHT CONTENT */}
            <section className="md:col-span-2">
              <div
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: supplier.description }}
              />
            </section>
          </div>

          {/* Update Your Listing */}
          <ClaimCompanyBanner />

          {/* ====== GALLERY TABS - REPLACES VIDEO GALLERY ====== */}
          <hr className="my-12" />
          <GalleryTabs videoGallery={supplier.videoGallery} />

          {/* ARTICLES */}
          {articles.length > 0 && (
            <>
              <hr className="my-12" />
              <CompanyArticlesCarousel articles={articles} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}