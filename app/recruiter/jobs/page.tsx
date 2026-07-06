"use client"

import { useEffect, useState } from "react"
import { MapPin, Users, Eye, Pencil } from "lucide-react"
import Link from "next/link"
import { useRecruiterGuard } from "@/lib/useRecruiterGuard"
import PostJobButton from "@/components/recruiter/PostJobButton"
import { fetchJobPostingEligibility, type JobPostingEligibility } from "@/lib/jobPosting"

type Job = {
  id: number
  title: string
  slug: string
  location: string
  createdAt: string
  views: number
  isActive?: boolean
  employmentType?: string
  _count?: {
    JobApplication: number
  }
}

export default function MyJobsPage() {
  const allowed = useRecruiterGuard()

  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [eligibility, setEligibility] = useState<JobPostingEligibility | null>(null)

  useEffect(() => {
    if (!allowed) return

    async function loadJobs() {
      try {
        const token = localStorage.getItem("token")

        if (!token) {
          console.error("Auth token missing")
          return
        }

        const [jobsRes, eligibilityData] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/recruiter/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              cache: "no-store",
            }
          ),
          fetchJobPostingEligibility(token),
        ])

        if (!jobsRes.ok) {
          throw new Error("Failed to fetch recruiter jobs")
        }

        const data = await jobsRes.json()
        setJobs(Array.isArray(data) ? data : [])
        setEligibility(eligibilityData)
      } catch (err) {
        console.error("Failed to load recruiter jobs", err)
        setJobs([])
      } finally {
        setLoading(false)
      }
    }

    loadJobs()
  }, [allowed])

  function getPostedText(createdAt: string) {
    const created = new Date(createdAt)
    const now = new Date()

    const diffMs = now.getTime() - created.getTime()

    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffMinutes < 60) {
      return "Posted just now"
    }

    if (diffHours < 24) {
      return `Posted ${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
    }

    if (diffDays === 1) {
      return "Posted yesterday"
    }

    return `Posted ${diffDays} days ago`
  }

  if (!allowed) return null

  if (loading) {
    return <div className="p-10">Loading jobs...</div>
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc] px-6 py-10">
      <div className="max-w-[1200px] mx-auto">

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">My Jobs</h1>

          <PostJobButton eligibility={eligibility} />
        </div>

        {eligibility && (
          <p className="mb-8 text-sm text-gray-600">{eligibility.message}</p>
        )}

        {jobs.some((job) => job.isActive === false) && eligibility && (
          <p className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Your {eligibility.planLabel} plan allows {eligibility.effectiveLimit} active job
            postings. Only your newest {eligibility.effectiveLimit} jobs appear on the feed —
            older jobs are marked inactive until you upgrade.
          </p>
        )}

        {jobs.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow">
            <h2 className="text-lg font-semibold text-gray-900">No jobs posted yet</h2>
            <p className="mt-2 text-sm text-gray-600">
              {eligibility?.canPost
                ? "Create your first job listing to start receiving applications."
                : "Upgrade your package to start posting jobs."}
            </p>
            <div className="mt-6 flex justify-center">
              <PostJobButton eligibility={eligibility} label="Post Your First Job" />
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between mb-3">
                  <h2 className="text-lg font-semibold">{job.title}</h2>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    job.isActive
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {job.isActive ? "Active" : "Inactive (plan limit)"}
                </span>
                </div>

                <div className="flex gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {job.location}
                  </span>

                  {job.employmentType && (
                    <span className="bg-gray-100 px-3 py-1 rounded-full">
                      {job.employmentType}
                    </span>
                  )}
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">
                    {getPostedText(job.createdAt)}
                  </span>

                  <div className="flex flex-wrap gap-4">
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <Eye size={14} />
                      {job.views} Views
                    </span>

                    <Link
                      href={`/jobs/${job.slug}`}
                      className="flex items-center gap-1 text-sm text-blue-600"
                    >
                      <Eye size={14} />
                      View
                    </Link>

                    <Link
                      href={`/recruiter/jobs/${job.id}/edit`}
                      className="flex items-center gap-1 text-sm text-green-600"
                    >
                      <Pencil size={14} />
                      Edit
                    </Link>

                    <Link
                      href={`/recruiter/jobs/${job.id}/applications`}
                      className="flex items-center gap-1 text-sm text-gray-600"
                    >
                      <Users size={14} />
                      Applicants ({job._count?.JobApplication ?? 0})
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
