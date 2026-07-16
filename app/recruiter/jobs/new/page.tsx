"use client"
import dynamic from "next/dynamic"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import "react-quill-new/dist/quill.snow.css"
import { fetchJobPostingEligibility, type JobPostingEligibility, type JobPostingEligibilityResponse } from "@/lib/jobPosting"
import JobPostingPolicySummary from "@/components/recruiter/JobPostingPolicySummary"

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
})


export default function CreateJobPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    employmentType: "Full-time",
    experience: "",
    salaryRange: "",
    location: "",
    isRemote: false,
    acceptedPolicy: false,
  })

  const [loading, setLoading] = useState(false)
  const [checkingEligibility, setCheckingEligibility] = useState(true)
  const [eligibility, setEligibility] = useState<JobPostingEligibilityResponse | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    async function checkEligibility() {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/login")
          return
        }

        const data = await fetchJobPostingEligibility(token)
        setEligibility(data)
      } catch {
        setError("Failed to verify your job posting allowance")
      } finally {
        setCheckingEligibility(false)
      }
    }

    checkEligibility()
  }, [router])

  const isInternship = form.employmentType === "Internship"

  // 🔹 Whichever quota applies to the currently selected Employment Type.
  // Falls back to the flat/top-level fields (job eligibility) if the
  // backend response hasn't been updated yet, so this never crashes.
  const activeEligibility: JobPostingEligibility | null = useMemo(() => {
    if (!eligibility) return null
    return isInternship ? eligibility.internship ?? eligibility : eligibility.job ?? eligibility
  }, [eligibility, isInternship])

  const blockedByLimit = !checkingEligibility && activeEligibility != null && !activeEligibility.canPost

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target

    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    })

    // Clear a stale limit-reached error message when switching Job Type,
    // since the new type may not be blocked.
    if (name === "employmentType") {
      setError("")
    }
  }

  function handleTitleChange(
  e: React.ChangeEvent<HTMLInputElement>
) {
  const title = e.target.value

  setForm(prev => ({
    ...prev,
    title,
    slug: generateSlug(title),
  }))
}

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!form.acceptedPolicy) {
      setError("Please read and agree to the Job Posting Policy.")
      return
    }

    if (blockedByLimit) {
      setError(
        activeEligibility?.message ||
          (isInternship
            ? "Internship listings are not available on your current plan."
            : "You've reached your job posting limit.")
      )
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      const { acceptedPolicy: _acceptedPolicy, ...payload } = form

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        if (data.code === "JOB_POSTING_LIMIT_REACHED") {
          setEligibility(prev => (prev ? { ...prev, job: data.eligibility } : prev))
        } else if (data.code === "INTERNSHIP_LISTING_LIMIT_REACHED") {
          setEligibility(prev => (prev ? { ...prev, internship: data.eligibility } : prev))
        }
        setError(data.error || "Failed to create job")
        return
      }

      router.push("/recruiter/jobs")
    } catch (err) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  function generateSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}



  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-6">Create Job</h1>

      {checkingEligibility ? (
        <p className="text-gray-600">Checking your job posting allowance...</p>
      ) : (
        <>
          {/* 🔹 Quota summary — always shows BOTH allowances, regardless of
              which Employment Type is currently selected in the form */}
          {(eligibility?.job || eligibility?.internship) && (
            <div className="mb-6 space-y-1 text-sm text-gray-600">
              {eligibility?.job?.message && (
                <p>{eligibility.job.message}</p>
              )}
              {eligibility?.internship?.message && (
                <p className={!eligibility.internship.canPost ? "text-amber-700 font-medium" : undefined}>
                  {eligibility.internship.message}
                </p>
              )}
            </div>
          )}

          {/* 🔹 Upgrade banner — reflects whichever quota (job vs internship)
              matches the currently selected Employment Type */}
          {blockedByLimit && (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <h2 className="text-lg font-semibold text-amber-900">
                {isInternship ? "Internship listing limit reached" : "Job posting limit reached"}
              </h2>
              <p className="mt-2 text-sm text-amber-800">
                {activeEligibility?.message ||
                  (isInternship
                    ? "Internship listings are not available on your current plan. Upgrade to continue."
                    : "You've reached your job posting limit. Upgrade your package to post more jobs.")}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/packages"
                  className="rounded-lg bg-[#004d73] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#003a59]"
                >
                  View Packages
                </Link>
                <Link
                  href="/recruiter/dashboard"
                  className="rounded-lg border border-amber-200 bg-white px-5 py-2.5 text-sm font-semibold text-amber-900 hover:bg-amber-100"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">
              {error}
              {activeEligibility?.upgradeRequired && (
                <div className="mt-3">
                  <Link href="/packages" className="font-semibold text-[#004d73] hover:underline">
                    Upgrade package →
                  </Link>
                </div>
              )}
            </div>
          )}

      <form onSubmit={handleSubmit} className="space-y-5">

     {/* Title */}
<input
  name="title"
  required
  placeholder="Job Title"
  className="w-full border p-3 rounded"
  value={form.title}
  onChange={handleTitleChange}
/>

      {/* Slug */}
<input
  name="slug"
  required
  readOnly
  className="w-full border p-3 rounded bg-gray-100"
  value={form.slug}
/>

        {/* Employment Type */}
        <select
          name="employmentType"
          className="w-full border p-3 rounded"
          value={form.employmentType}
          onChange={handleChange}
        >
          <option value="Full-time">Full-time</option>
          {/* <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option> */}
          <option value="Internship">Internship</option>
        </select>

        {/* Experience */}
        <input
          name="experience"
          placeholder="Experience (e.g. 2-5 years)"
          className="w-full border p-3 rounded"
          value={form.experience}
          onChange={handleChange}
        />

        {/* Salary */}
        <input
          name="salaryRange"
          placeholder="Salary Range (e.g. ₹6L - ₹12L)"
          className="w-full border p-3 rounded"
          value={form.salaryRange}
          onChange={handleChange}
        />

        {/* Location */}
        <input
          name="location"
          required
          placeholder="Location"
          className="w-full border p-3 rounded"
          value={form.location}
          onChange={handleChange}
        />

        {/* Remote Option */}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isRemote"
            checked={form.isRemote}
            onChange={handleChange}
          />
          Remote Job
        </label>

        {/* Description */}
       <div>
  <label className="block font-semibold mb-2">
    Job Description
  </label>

  <ReactQuill
    theme="snow"
    value={form.description}
    onChange={(value) =>
      setForm(prev => ({ ...prev, description: value }))
    }
    className="bg-white"
  />
</div>

        <div className="space-y-5 pt-2">
          <JobPostingPolicySummary />

          <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-[16px] text-slate-900">
            <input
              type="checkbox"
              name="acceptedPolicy"
              checked={form.acceptedPolicy}
              onChange={handleChange}
              className="mt-1 h-5 w-5 rounded border border-slate-300 text-blue-600 focus:ring-blue-600"
            />
            <span>I have read and agree to the Job Posting Policy.</span>
          </label>

          <div className="flex justify-start pt-2">
            <button
              disabled={loading || !form.acceptedPolicy || blockedByLimit}
              className="w-full max-w-[220px] rounded-xl bg-blue-600 px-8 py-4 text-[16px] font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading
                ? "Publishing..."
                : blockedByLimit
                  ? "Upgrade to Continue"
                  : "Publish Job"}
            </button>
          </div>
        </div>
      </form>
        </>
      )}
    </div>
  )
}