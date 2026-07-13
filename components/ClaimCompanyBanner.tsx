"use client"

import Link from "next/link"
import { ShieldCheck } from "lucide-react"
import type { PlanTier } from "@/lib/packages"

type ClaimCompanyBannerProps = {
  plan?: PlanTier // defaults to "free" if not passed
}

const VERIFIED_BADGE_LABEL: Record<PlanTier, string | false> = {
  free: false,
  basic: "Silver",
  professional: "Gold",
  enterprise: "Platinum",
}

const BADGE_STYLES: Record<string, { bg: string; text: string; ring: string; icon: string }> = {
  Silver: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    ring: "ring-gray-300",
    icon: "text-gray-500",
  },
  Gold: {
    bg: "bg-amber-50",
    text: "text-amber-800",
    ring: "ring-amber-300",
    icon: "text-amber-500",
  },
  Platinum: {
    bg: "bg-slate-900",
    text: "text-white",
    ring: "ring-slate-700",
    icon: "text-cyan-300",
  },
}

export default function ClaimCompanyBanner({ plan = "free" }: ClaimCompanyBannerProps) {
  const badgeLabel = VERIFIED_BADGE_LABEL[plan]

  /* ---------- FREE PLAN: original "claim your company" banner ---------- */
  if (!badgeLabel) {
    return (
      <div className="mt-12">
        <div className="bg-[#e6f0f3] border border-gray-200">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4">

            <div className="text-gray-700 font-semibold tracking-wide uppercase text-sm">
              Is this your company?
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link
                href="/login"
                className="bg-[#0b3954] text-white px-6 py-2 text-sm font-semibold uppercase text-center hover:bg-[#092f46] transition"
              >
                Update Your Listing
              </Link>

              <Link
                href="/login"
                className="bg-black text-white px-6 py-2 text-sm font-semibold uppercase text-center hover:bg-gray-900 transition"
              >
                Submit a Press Release to Our Editorial Teams
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ---------- PAID PLANS: Verified Supplier badge + single CTA ---------- */
  const style = BADGE_STYLES[badgeLabel]

  return (
    <div className="mt-12">
      <div className={`${style.bg} border border-gray-200`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4">

          <div className={`flex items-center gap-2 ${style.text} ring-1 ${style.ring} rounded-full px-4 py-1.5`}>
            <ShieldCheck size={16} className={style.icon} />
            <span className="text-sm font-semibold uppercase tracking-wide">
              {badgeLabel} Verified Supplier
            </span>
          </div>

          <Link
            href="/login"
            className="bg-[#0b3954] text-white px-6 py-2 text-sm font-semibold uppercase text-center hover:bg-[#092f46] transition"
          >
            Update Your Listing
          </Link>
        </div>
      </div>
    </div>
  )
}