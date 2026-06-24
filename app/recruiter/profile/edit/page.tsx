"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import UploadBox from "@/components/UploadBox"

type Industry = {
  id: number
  name: string
}

export default function EditRecruiterProfile() {
  const router = useRouter()

  const [industries, setIndustries] = useState<Industry[]>([])

  const [form, setForm] = useState({
    fullName: "",
    headline: "",
    about: "",
    location: "",
    websiteUrl: "",
    avatarUrl: "",

    companyName: "",
    companyTagline: "",
    companyDescription: "",
    companyIndustryId: "",
    companyLocation: "",
    companyAddress: "",
    companySize: "",
    companyWebsite: "",
    companyLogoUrl: "",
    companyCoverImageUrl: "",
  })

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  /* ================= LOAD PROFILE ================= */

useEffect(() => {
  async function loadData() {
    const token = localStorage.getItem("token")

    console.log("TOKEN:", token)

    const [profileRes, industryRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recruiters/me`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/industries`),
    ])

    console.log("PROFILE STATUS:", profileRes.status)

    const profile = await profileRes.json()

    console.log("PROFILE DATA:", profile)

    const industryData = await industryRes.json()

    setIndustries(industryData || [])

    setForm({
      fullName: profile.fullName || "",
      headline: profile.headline || "",
      about: profile.about || "",
      location: profile.location || "",
      websiteUrl: profile.websiteUrl || "",
      avatarUrl: profile.avatarUrl || "",

      companyName: profile.Company?.name || "",
      companyTagline: profile.Company?.tagline || "",
      companyDescription: profile.Company?.description || "",
      companyIndustryId: profile.Company?.industryId?.toString() || "",
      companyLocation: profile.Company?.location || "",
      companyAddress: profile.Company?.address || "",
      companySize: profile.Company?.companySize || "",
      companyWebsite: profile.Company?.website || "",
      companyLogoUrl: profile.Company?.logoUrl || "",
      companyCoverImageUrl: profile.Company?.coverImageUrl || "",
    })
  }

  loadData()
}, [])

  /* ================= HANDLE INPUT ================= */

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  /* ================= HANDLE IMAGE UPLOAD ================= */

  async function handleImageUpload(file: File, field: string) {
    try {
      setUploading(true)
      const token = localStorage.getItem("token")

      const formData = new FormData()
      formData.append("image", file)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      )

      const data = await res.json()
      if (!res.ok) throw new Error()

      setForm(prev => ({
        ...prev,
        [field]: data.imageUrl,
      }))
    } catch {
      alert("Upload failed")
    } finally {
      setUploading(false)
    }
  }

  /* ================= SUBMIT ================= */

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const token = localStorage.getItem("token")

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/recruiters/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      )

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Failed to update")
        return
      }

      setSuccess("Profile & Company updated successfully 🎉")

      setTimeout(() => {
        router.push("/recruiter/dashboard")
      }, 1200)
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">
          Edit Profile & Company
        </h1>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 text-sm text-green-600 bg-green-50 p-3 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ================= RECRUITER SECTION ================= */}
          <SectionTitle title="Company Owner Information" />

          <UploadBox
            label={uploading ? "Uploading..." : "Profile Avatar"}
            value={form.avatarUrl}
            onUpload={(file) => handleImageUpload(file, "avatarUrl")}
            height="h-40"
            accept="image/*"
          />

          <Input label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} />
          <Input label="Headline" name="headline" value={form.headline} onChange={handleChange} />
          <Input label="Location" name="location" value={form.location} onChange={handleChange} />
          <Input label="Website URL" name="websiteUrl" value={form.websiteUrl} onChange={handleChange} />

          <Textarea label="About" name="about" value={form.about} onChange={handleChange} />

          {/* ================= COMPANY SECTION ================= */}
          <SectionTitle title="Company Information" />

          <UploadBox
            label="Company Logo"
            value={form.companyLogoUrl}
            onUpload={(file) => handleImageUpload(file, "companyLogoUrl")}
            height="h-32"
            accept="image/*"
          />

          <UploadBox
            label="Company Cover Image"
            value={form.companyCoverImageUrl}
            onUpload={(file) => handleImageUpload(file, "companyCoverImageUrl")}
            height="h-40"
            accept="image/*"
          />

          <Input label="Company Name" name="companyName" value={form.companyName} onChange={handleChange} />
          <Input label="Tagline" name="companyTagline" value={form.companyTagline} onChange={handleChange} />
          <Textarea label="Company Description" name="companyDescription" value={form.companyDescription} onChange={handleChange} />

          <div>
            <label className="text-sm font-medium text-gray-700">Industry</label>
            <select
              name="companyIndustryId"
              value={form.companyIndustryId}
              onChange={handleChange}
              className="w-full h-[48px] px-4 mt-1 border rounded-md"
            >
              <option value="">Select Industry</option>
              {industries.map((industry) => (
                <option key={industry.id} value={industry.id}>
                  {industry.name}
                </option>
              ))}
            </select>
          </div>

          <Input label="Company Location" name="companyLocation" value={form.companyLocation} onChange={handleChange} />
          <Input label="Full Address" name="companyAddress" value={form.companyAddress} onChange={handleChange} />
          <Input label="Company Size" name="companySize" value={form.companySize} onChange={handleChange} />
          <Input label="Company Website" name="companyWebsite" value={form.companyWebsite} onChange={handleChange} />

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[50px] bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  )
}

/* ================= COMPONENTS ================= */

function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
      {title}
    </h2>
  )
}

function Input({
  label,
  name,
  value,
  onChange,
}: {
  label: string
  name: string
  value: string
  onChange: any
}) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full h-[48px] px-4 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
    </div>
  )
}

function Textarea({
  label,
  name,
  value,
  onChange,
}: {
  label: string
  name: string
  value: string
  onChange: any
}) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={4}
        className="w-full mt-1 px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
    </div>
  )
}