"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import RichTextEditor from "@/components/RichTextField"
import UploadBox from "@/components/UploadBox"
import { loadGeo } from "@/lib/geo"
import {
  fetchProductListingEligibility,
  type ContentLimitEligibility,
} from "@/lib/packageLimits"

/* ---------------- SHARED FILE UPLOAD HELPER ---------------- */
/**
 * Uploads a single file to the existing /api/upload endpoint and
 * returns the resulting URL. Reused by logo upload, galleries and
 * document uploads so we only have one place that talks to the API.
 */
async function uploadFile(file: File): Promise<string> {
  const formData = new FormData()
  formData.append("image", file)
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
    method: "POST",
    body: formData,
  })
  const data = await res.json()
  return data.imageUrl
}

export default function EditDirectoryPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [directory, setDirectory] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [listingEligibility, setListingEligibility] =
    useState<ContentLimitEligibility | null>(null)
  const [geo, setGeo] = useState<Awaited<ReturnType<typeof loadGeo>> | null>(null)

  const [industryLevels, setIndustryLevels] = useState<any[][]>([])
  const [industrySelected, setIndustrySelected] = useState<number[]>([])

  useEffect(() => {
    loadGeo().then(setGeo).catch(console.error)
  }, [])

  useEffect(() => {
    async function loadEligibility() {
      try {
        const token = localStorage.getItem("token")
        if (!token) return
        setListingEligibility(await fetchProductListingEligibility(token))
      } catch (error) {
        console.error("Product listing eligibility error:", error)
      }
    }
    loadEligibility()
  }, [])

  useEffect(() => {
    async function fetchIndustries() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/industries`)
      const data = await res.json()
      const list = Array.isArray(data) ? data : data.data ?? []
      setIndustryLevels([list])
    }
    fetchIndustries()
  }, [])

  useEffect(() => {
    async function loadDirectory() {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/suppliers/recruiter/directories/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const data = await res.json()
        setDirectory({
          ...data,
          tradeNames: data.tradeNames || [""],
          videoGallery: data.videoGallery || [""],
          productSupplies: data.productSupplies || [""],
          socialLinks: data.socialLinks || {},
          country: data.country || "",
          state: data.state || "",
          city: data.city || "",
          address: data.address || "",
          industryId: data.industryId || "",

          // ---- NEW FIELDS ----
          productGallery: data.productGallery || [""],
          companyGallery: data.companyGallery || [""],
          factoryGallery: data.factoryGallery || [""],

          companyBrochure: data.companyBrochure || [""],
          certifications: data.certifications || [""],

          brandsRepresented: data.brandsRepresented || [""],
          industriesServed: data.industriesServed || [""],
          exportMarkets: data.exportMarkets || [""],

          manufacturingCapabilities: data.manufacturingCapabilities || "",
          machineryList: data.machineryList || "",
          qualityStandards: data.qualityStandards || "",

          enableInquiryForm: data.enableInquiryForm ?? true,
        })
      } catch {
        alert("Unable to load directory")
      } finally {
        setLoading(false)
      }
    }
    loadDirectory()
  }, [id])

  const handleIndustrySelect = async (levelIndex: number, id: number) => {
    const newSelected = [...industrySelected.slice(0, levelIndex), id]
    const newLevels = industryLevels.slice(0, levelIndex + 1)
    setIndustrySelected(newSelected)
    setIndustryLevels(newLevels)
    setDirectory((prev: any) => ({ ...prev, industryId: "" }))

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/industries/${id}/children`)
    const children = await res.json()

    if (children.length > 0) {
      setIndustryLevels([...newLevels, children])
    } else {
      setDirectory((prev: any) => ({ ...prev, industryId: id }))
    }
  }

  /* ---------------- GENERIC ARRAY FIELD HELPERS ---------------- */
  // Used by the new gallery / document / list fields so we don't
  // duplicate the same add/remove/update JSX logic over and over.

  const updateArrayItem = (field: string, index: number, value: string) => {
    setDirectory((prev: any) => {
      const arr = [...(prev[field] || [])]
      arr[index] = value
      return { ...prev, [field]: arr }
    })
  }

  const addArrayItem = (field: string) => {
    setDirectory((prev: any) => ({
      ...prev,
      [field]: [...(prev[field] || []), ""],
    }))
  }

  const removeArrayItem = (field: string, index: number) => {
    setDirectory((prev: any) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_: any, idx: number) => idx !== index),
    }))
  }

  const handleGalleryUpload = async (field: string, index: number, file: File) => {
    const url = await uploadFile(file)
    updateArrayItem(field, index, url)
  }

  async function saveChanges() {
    if (!directory?.isLiveEditable) {
      alert("Directory is not approved yet")
      return
    }
    try {
      setSaving(true)
      const token = localStorage.getItem("token")
      const geoLib = geo ?? (await loadGeo())

      const selectedCountry = geoLib.Country.getAllCountries().find(c => c.isoCode === directory.country)
      const selectedState = geoLib.State.getStatesOfCountry(directory.country).find(s => s.isoCode === directory.state)
      const location = [directory.city, selectedState?.name, selectedCountry?.name].filter(Boolean).join(", ")

      // directory already contains every existing field plus all of the
      // new fields (galleries, documents, list fields, rich text sections,
      // enableInquiryForm), so spreading it here sends everything to the API
      // without needing to enumerate each property manually.
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/suppliers/${directory.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...directory, location }),
      })

      router.push("/recruiter/dashboard")
    } finally {
      setSaving(false)
    }
  }

  if (loading || !geo) return <div className="p-10">Loading directory...</div>
  if (!directory) return <div className="p-10">Directory not found</div>

  const states = directory.country ? geo.State.getStatesOfCountry(directory.country) : []
  const cities = directory.state ? geo.City.getCitiesOfState(directory.country, directory.state) : []
  const countries = geo.Country.getAllCountries()

  return (
    <div className="max-w-4xl mx-auto p-10 space-y-6">
      <h1 className="text-2xl font-bold">Edit Supplier Directory</h1>

      {/* NAME + SLUG */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Company Name</label>
          <input
            className="input"
            value={directory.name}
            onChange={(e) => setDirectory({ ...directory, name: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Slug (read only)</label>
          <input className="input bg-gray-100" value={directory.slug} disabled />
        </div>
      </div>

      {/* PHONE + EMAIL */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Phone Number</label>
          <input
            className="input"
            value={directory.phoneNumber || ""}
            onChange={(e) => setDirectory({ ...directory, phoneNumber: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Email</label>
          <input
            className="input"
            value={directory.email || ""}
            onChange={(e) => setDirectory({ ...directory, email: e.target.value })}
          />
        </div>
      </div>

      {/* COUNTRY + STATE */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Country</label>
          <select
            className="input"
            value={directory.country}
            onChange={(e) => setDirectory({ ...directory, country: e.target.value, state: "", city: "" })}
          >
            <option value="">Select Country</option>
            {countries.map(c => (
              <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">State</label>
          <select
            className="input"
            value={directory.state}
            onChange={(e) => setDirectory({ ...directory, state: e.target.value, city: "" })}
          >
            <option value="">Select State</option>
            {states.map(s => (
              <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* CITY + ADDRESS */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">City</label>
          <select
            className="input"
            value={directory.city}
            onChange={(e) => setDirectory({ ...directory, city: e.target.value })}
          >
            <option value="">Select City</option>
            {cities.map(c => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Full Address</label>
          <input
            className="input"
            value={directory.address || ""}
            onChange={(e) => setDirectory({ ...directory, address: e.target.value })}
          />
        </div>
      </div>

      {/* INDUSTRY + WEBSITE */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Industry</label>
          {industryLevels.map((levelOptions, levelIndex) => (
            <select
              key={levelIndex}
              className="input mb-2"
              value={industrySelected[levelIndex] ?? ""}
              onChange={(e) => handleIndustrySelect(levelIndex, Number(e.target.value))}
            >
              <option value="">Select Industry</option>
              {levelOptions.map((industry: any) => (
                <option key={industry.id} value={industry.id}>{industry.name}</option>
              ))}
            </select>
          ))}
        </div>
        <div>
          <label className="label">Website</label>
          <input
            className="input"
            value={directory.website || ""}
            onChange={(e) => setDirectory({ ...directory, website: e.target.value })}
          />
        </div>
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="label">Description</label>
        <RichTextEditor
          value={directory.description}
          onChange={(val: string) => setDirectory({ ...directory, description: val })}
        />
      </div>

      {/* LOGO + COVER */}
      <div className="grid grid-cols-2 gap-6">
        <UploadBox
          label="Company Logo"
          value={directory.logoUrl}
          onUpload={(file) => handleImageUpload(file, directory, setDirectory, "logoUrl")}
        />
        {/* <UploadBox
          label="Cover Image"
          value={directory.coverImageUrl}
          onUpload={(file) => handleImageUpload(file, directory, setDirectory, "coverImageUrl")}
        /> */}
      </div>

      {/* PRODUCT SUPPLIES */}
      <Section title="Product Supplies">
        {listingEligibility && (
          <p className="text-sm text-gray-500 mb-3">
            Products inside your directory do not count toward your directory slot limit.
          </p>
        )}
        {directory.productSupplies.map((item: string, i: number) => (
          <div key={i} className="flex gap-2">
            <input
              className="input flex-1"
              value={item}
              onChange={(e) => {
                const arr = [...directory.productSupplies]
                arr[i] = e.target.value
                setDirectory({ ...directory, productSupplies: arr })
              }}
            />
            {i > 0 && (
              <button type="button" onClick={() => {
                const arr = directory.productSupplies.filter((_: any, idx: number) => idx !== i)
                setDirectory({ ...directory, productSupplies: arr })
              }}>✕</button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setDirectory({
              ...directory,
              productSupplies: [...directory.productSupplies, ""],
            })
          }
        >
          + Add product
        </button>
      </Section>

      {/* SOCIAL LINKS */}
      <Section title="Social Media">
        <div className="grid grid-cols-2 gap-4">
          {["facebook", "linkedin", "twitter", "youtube", "whatsapp"].map((key) => (
            <div key={key}>
              <label className="label capitalize">{key}</label>
              <input
                className="input"
                placeholder={key}
                value={directory.socialLinks?.[key] || ""}
                onChange={(e) =>
                  setDirectory({ ...directory, socialLinks: { ...directory.socialLinks, [key]: e.target.value } })
                }
              />
            </div>
          ))}
        </div>
      </Section>

      {/* TRADE NAMES */}
      <Section title="Trade Names">
        {directory.tradeNames.map((item: string, i: number) => (
          <div key={i} className="flex gap-2">
            <input
              className="input flex-1"
              value={item}
              onChange={(e) => {
                const arr = [...directory.tradeNames]
                arr[i] = e.target.value
                setDirectory({ ...directory, tradeNames: arr })
              }}
            />
            {i > 0 && (
              <button type="button" onClick={() => {
                const arr = directory.tradeNames.filter((_: any, idx: number) => idx !== i)
                setDirectory({ ...directory, tradeNames: arr })
              }}>✕</button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => setDirectory({ ...directory, tradeNames: [...directory.tradeNames, ""] })}>
          + Add trade name
        </button>
      </Section>

      {/* VIDEO GALLERY */}
      <Section title="YouTube Video Links">
        {directory.videoGallery.map((item: string, i: number) => (
          <div key={i} className="flex gap-2">
            <input
              className="input flex-1"
              value={item}
              onChange={(e) => {
                const arr = [...directory.videoGallery]
                arr[i] = e.target.value
                setDirectory({ ...directory, videoGallery: arr })
              }}
            />
            {i > 0 && (
              <button type="button" onClick={() => {
                const arr = directory.videoGallery.filter((_: any, idx: number) => idx !== i)
                setDirectory({ ...directory, videoGallery: arr })
              }}>✕</button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => setDirectory({ ...directory, videoGallery: [...directory.videoGallery, ""] })}>
          + Add video
        </button>
      </Section>

      {/* ===================== NEW FIELDS BELOW ===================== */}

      {/* IMAGE GALLERIES */}
      <Section title="Product Gallery">
        <GallerySection
          field="productGallery"
          items={directory.productGallery}
          onUpload={handleGalleryUpload}
          onAdd={addArrayItem}
          onRemove={removeArrayItem}
          addLabel="+ Add product image"
        />
      </Section>

      <Section title="Company Gallery">
        <GallerySection
          field="companyGallery"
          items={directory.companyGallery}
          onUpload={handleGalleryUpload}
          onAdd={addArrayItem}
          onRemove={removeArrayItem}
          addLabel="+ Add company image"
        />
      </Section>

      <Section title="Factory Gallery">
        <GallerySection
          field="factoryGallery"
          items={directory.factoryGallery}
          onUpload={handleGalleryUpload}
          onAdd={addArrayItem}
          onRemove={removeArrayItem}
          addLabel="+ Add factory image"
        />
      </Section>

      {/* DOCUMENTS */}
      <Section title="Company Brochure">
        <GallerySection
          field="companyBrochure"
          items={directory.companyBrochure}
          onUpload={handleGalleryUpload}
          onAdd={addArrayItem}
          onRemove={removeArrayItem}
          addLabel="+ Add brochure file"
          uploadLabel="Brochure File"
        />
      </Section>

      <Section title="Certifications">
        <GallerySection
          field="certifications"
          items={directory.certifications}
          onUpload={handleGalleryUpload}
          onAdd={addArrayItem}
          onRemove={removeArrayItem}
          addLabel="+ Add certification file"
          uploadLabel="Certification File"
        />
      </Section>

      {/* LIST FIELDS (same UX as Trade Names) */}
      <Section title="Brands Represented">
        <DynamicListField
          field="brandsRepresented"
          items={directory.brandsRepresented}
          onChange={updateArrayItem}
          onAdd={addArrayItem}
          onRemove={removeArrayItem}
          addLabel="+ Add brand"
        />
      </Section>

      <Section title="Industries Served">
        <DynamicListField
          field="industriesServed"
          items={directory.industriesServed}
          onChange={updateArrayItem}
          onAdd={addArrayItem}
          onRemove={removeArrayItem}
          addLabel="+ Add industry served"
        />
      </Section>

      <Section title="Export Markets">
        <DynamicListField
          field="exportMarkets"
          items={directory.exportMarkets}
          onChange={updateArrayItem}
          onAdd={addArrayItem}
          onRemove={removeArrayItem}
          addLabel="+ Add export market"
        />
      </Section>

      {/* LONG TEXT SECTIONS — full-width, full-size, same treatment as Description */}
      <Section title="Manufacturing Capabilities">
        <RichTextEditor
          value={directory.manufacturingCapabilities}
          onChange={(val: string) => setDirectory({ ...directory, manufacturingCapabilities: val })}
        />
      </Section>

      <Section title="Machinery List">
        <RichTextEditor
          value={directory.machineryList}
          onChange={(val: string) => setDirectory({ ...directory, machineryList: val })}
        />
      </Section>

      <Section title="Quality Standards">
        <RichTextEditor
          value={directory.qualityStandards}
          onChange={(val: string) => setDirectory({ ...directory, qualityStandards: val })}
        />
      </Section>

      {/* BOOLEAN TOGGLE */}
      <Section title="Inquiry Form">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={directory.enableInquiryForm ?? true}
            onChange={(e) => setDirectory({ ...directory, enableInquiryForm: e.target.checked })}
          />
          <span>Enable inquiry form on public showroom page</span>
        </label>
      </Section>

      <button
        onClick={saveChanges}
        disabled={saving}
        className="bg-black text-white px-6 py-2 rounded"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  )
}

/* ---------------- IMAGE UPLOAD (existing, unchanged) ---------------- */
async function handleImageUpload(file: File, directory: any, setDirectory: any, field: "logoUrl" | "coverImageUrl") {
  const url = await uploadFile(file)
  setDirectory({ ...directory, [field]: url })
}

/* ---------------- SECTION ---------------- */
function Section({ title, children }: any) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold">{title}</h3>
      {children}
    </div>
  )
}

/* ---------------- REUSABLE: DYNAMIC STRING LIST ---------------- */
/**
 * Generic add/remove/edit list of plain text rows, matching the same
 * UX already used for Trade Names / Product Supplies / Video Gallery.
 */
function DynamicListField({
  field,
  items,
  onChange,
  onAdd,
  onRemove,
  addLabel,
  placeholder,
}: {
  field: string
  items: string[]
  onChange: (field: string, index: number, value: string) => void
  onAdd: (field: string) => void
  onRemove: (field: string, index: number) => void
  addLabel: string
  placeholder?: string
}) {
  return (
    <>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            className="input flex-1"
            placeholder={placeholder}
            value={item}
            onChange={(e) => onChange(field, i, e.target.value)}
          />
          {i > 0 && (
            <button type="button" onClick={() => onRemove(field, i)}>✕</button>
          )}
        </div>
      ))}
      <button type="button" onClick={() => onAdd(field)}>{addLabel}</button>
    </>
  )
}

/* ---------------- REUSABLE: GALLERY / DOCUMENT UPLOAD ---------------- */
/**
 * Generic add/remove list of file uploads backed by UploadBox, reused
 * for productGallery, companyGallery, factoryGallery, companyBrochure
 * and certifications. Each slot uploads independently and stores the
 * resulting URL into the directory state array at that index.
 */
function GallerySection({
  field,
  items,
  onUpload,
  onAdd,
  onRemove,
  addLabel,
  uploadLabel = "File",
}: {
  field: string
  items: string[]
  onUpload: (field: string, index: number, file: File) => void | Promise<void>
  onAdd: (field: string) => void
  onRemove: (field: string, index: number) => void
  addLabel: string
  uploadLabel?: string
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item, i) => (
        <div key={i} className="space-y-1">
          <UploadBox
            label={`${uploadLabel} ${i + 1}`}
            value={item}
            onUpload={(file) => onUpload(field, i, file)}
          />
          {i > 0 && (
            <button type="button" onClick={() => onRemove(field, i)}>
              ✕ Remove
            </button>
          )}
        </div>
      ))}
      <div className="col-span-2">
        <button type="button" onClick={() => onAdd(field)}>{addLabel}</button>
      </div>
    </div>
  )
}