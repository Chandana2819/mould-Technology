"use client"

import { useRouter } from "next/navigation"
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik"
import * as Yup from "yup"
import RichTextEditor from "@/components/RichTextField"
import UploadBox from "@/components/UploadBox"
import { useState, useEffect } from "react"
import { loadGeo } from "@/lib/geo"
import PackageLimitModal from "@/components/recruiter/PackageLimitModal"
import BusinessListingGuidelinesSummary from "@/components/recruiter/BusinessListingGuidelinesSummary"
import {
  fetchProductListingEligibility,
  type ContentLimitEligibility,
} from "@/lib/packageLimits"

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

/* ---------------- VALIDATION ---------------- */
const DirectorySchema = Yup.object({
  name: Yup.string().min(3).required("Company name is required"),
  slug: Yup.string()
    .matches(/^[a-z0-9-]+$/, "Only lowercase letters, numbers and hyphens")
    .required("Slug is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  email: Yup.string().email().required("Email is required"),
  description: Yup.string().min(20).required("Description is required"),

  website: Yup.string().url().nullable(),
  logoUrl: Yup.string().url().nullable(),

  coverImages: Yup.array().of(Yup.string().url()),

  tradeNames: Yup.array().of(Yup.string()).min(1),
  videoGallery: Yup.array().of(Yup.string().url()),
  productSupplies: Yup.array().of(Yup.string().min(2)),

  productGallery: Yup.array().of(Yup.string().url()),
  companyGallery: Yup.array().of(Yup.string().url()),
  factoryGallery: Yup.array().of(Yup.string().url()),

  productCatalogues: Yup.array().of(Yup.string().url()),

  companyBrochure: Yup.array().of(Yup.string().url()),
  certifications: Yup.array().of(Yup.string().url()),

  brandsRepresented: Yup.array().of(Yup.string()),
  industriesServed: Yup.array().of(Yup.string()),
  exportMarkets: Yup.array().of(Yup.string()),

  manufacturingCapabilities: Yup.string(),
  machineryList: Yup.string(),
  qualityStandards: Yup.string(),

  enableInquiryForm: Yup.boolean(),

  socialLinks: Yup.object({
    facebook: Yup.string().url().nullable(),
    linkedin: Yup.string().url().nullable(),
    twitter: Yup.string().url().nullable(),
    youtube: Yup.string().url().nullable(),
    whatsapp: Yup.string().nullable(),
  }),

  country: Yup.string().required("Country required"),
  state: Yup.string().required("State required"),
  city: Yup.string().required("City required"),
  address: Yup.string().min(10).required("Address required"),
  industryId: Yup.number().required("Industry required"),
  acceptedGuidelines: Yup.boolean().oneOf(
    [true],
    "Please agree to the Business Listing Guidelines."
  ),
})

export default function AddDirectoryPage() {
  const router = useRouter()

  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingCatalogue, setUploadingCatalogue] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [listingEligibility, setListingEligibility] =
    useState<ContentLimitEligibility | null>(null)
  const [showLimitModal, setShowLimitModal] = useState(false)

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

  const maxCoverImages = listingEligibility?.maxCoverImages ?? 0
  const allowWhatsapp = listingEligibility?.allowWhatsapp ?? false

  /* ================= INDUSTRY CASCADE ================= */
  const [industryLevels, setIndustryLevels] = useState<any[][]>([])
  const [industrySelected, setIndustrySelected] = useState<number[]>([])
  const [geo, setGeo] = useState<Awaited<ReturnType<typeof loadGeo>> | null>(null)

  useEffect(() => {
    loadGeo().then(setGeo).catch(console.error)
  }, [])

  useEffect(() => {
    async function fetchIndustries() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/industries`
      )
      const data = await res.json()
      const list = Array.isArray(data) ? data : data.data ?? []
      setIndustryLevels([list])
    }
    fetchIndustries()
  }, [])

  const handleIndustrySelect = async (
    levelIndex: number,
    id: number,
    setFieldValue: any
  ) => {
    const newSelected = [...industrySelected.slice(0, levelIndex), id]
    const newLevels = industryLevels.slice(0, levelIndex + 1)

    setIndustrySelected(newSelected)
    setIndustryLevels(newLevels)
    setFieldValue("industryId", "")

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/industries/${id}/children`
    )
    const children = await res.json()

    if (children.length > 0) {
      setIndustryLevels([...newLevels, children])
    } else {
      setFieldValue("industryId", id)
    }
  }

  /* ================= IMAGE UPLOAD (logo) ================= */
  const handleImageUpload = async (
    file: File,
    setFieldValue: any,
    fieldName: "logoUrl",
    type: "logo"
  ) => {
    setUploadingLogo(true)
    setUploadError("")

    try {
      const formData = new FormData()
      formData.append("image", file)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
        { method: "POST", body: formData }
      )

      if (!res.ok) throw new Error("Image upload failed")

      const data = await res.json()
      setFieldValue(fieldName, data.imageUrl)

    } catch (err: any) {
      setUploadError(err.message)
    } finally {
      setUploadingLogo(false)
    }
  }

  /* ================= COVER IMAGE UPLOAD ================= */
  const handleCoverImageUpload = async (
    file: File,
    setFieldValue: any,
    values: any,
    index: number
  ) => {
    setUploadingCover(true)
    setUploadError("")

    try {
      const formData = new FormData()
      formData.append("image", file)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
        { method: "POST", body: formData }
      )

      if (!res.ok) throw new Error("Image upload failed")

      const data = await res.json()
      const arr = [...values.coverImages]
      arr[index] = data.imageUrl
      setFieldValue("coverImages", arr)

    } catch (err: any) {
      setUploadError(err.message)
    } finally {
      setUploadingCover(false)
    }
  }

  /* ================= PRODUCT CATALOGUE UPLOAD ================= */
  const handleCatalogueUpload = async (
    file: File,
    setFieldValue: any,
    values: any,
    index: number
  ) => {
    setUploadingCatalogue(true)
    setUploadError("")

    try {
      const formData = new FormData()
      formData.append("document", file) // ✅ Use "document" field name

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/upload/document`, // ✅ Use document endpoint
        { method: "POST", body: formData }
      )

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "File upload failed")
      }

      const data = await res.json()
      const arr = [...values.productCatalogues]
      arr[index] = data.documentUrl // ✅ Use documentUrl
      setFieldValue("productCatalogues", arr)

    } catch (err: any) {
      setUploadError(err.message)
    } finally {
      setUploadingCatalogue(false)
    }
  }

  /* ================= SUBMIT ================= */
  async function submit(values: any, { setSubmitting, setStatus }: any) {
    try {
      const token = localStorage.getItem("token")
      const geoLib = geo ?? (await loadGeo())

      const selectedCountry = geoLib.Country.getAllCountries().find(
        c => c.isoCode === values.country
      )

      const selectedState = geoLib.State.getStatesOfCountry(values.country).find(
        s => s.isoCode === values.state
      )

      const location = [
        values.city,
        selectedState?.name,
        selectedCountry?.name,
      ].filter(Boolean).join(", ")

      const payload = {
        ...values,
        location,
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/suppliers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        if (data.code === "PRODUCT_LISTING_LIMIT_REACHED") {
          setShowLimitModal(true)
          return
        }
        throw new Error(data.error || "Failed to submit directory")
      }
      router.push("/recruiter/dashboard")
    } catch (err: any) {
      setStatus(err.message || "Failed to submit directory")
    } finally {
      setSubmitting(false)
    }
  }

  const countries = geo?.Country.getAllCountries() ?? []

  if (!geo) {
    return (
      <div className="max-w-3xl mx-auto p-10">
        <p className="text-gray-600">Loading form...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-10">
      <h1 className="text-2xl font-bold mb-2">
        Add Supplier Directory
      </h1>
      {listingEligibility && (
        <p className="text-sm text-gray-500 mb-6">
          {listingEligibility.isUnlimited
            ? "Your plan includes unlimited supplier directories."
            : `Directory slots: ${listingEligibility.activeListings ?? 0} of ${listingEligibility.effectiveLimit ?? 0} used · ${listingEligibility.remaining ?? 0} remaining (Free: 5 · Basic: 25 · Pro/Enterprise: Unlimited). Add as many products as you need inside each directory.`}
        </p>
      )}

      <Formik
        initialValues={{
          name: "",
          slug: "",
          phoneNumber: "",
          email: "",
          description: "",
          website: "",
          logoUrl: "",
          coverImages: [""],
          tradeNames: [""],
          videoGallery: [""],
          productSupplies: [""],

          productGallery: [""],
          companyGallery: [""],
          factoryGallery: [""],

          productCatalogues: [""],

          companyBrochure: [""],
          certifications: [""],

          brandsRepresented: [""],
          industriesServed: [""],
          exportMarkets: [""],

          manufacturingCapabilities: "",
          machineryList: "",
          qualityStandards: "",

          enableInquiryForm: true,
          socialLinks: {
            facebook: "",
            linkedin: "",
            twitter: "",
            youtube: "",
            whatsapp: "",
          },

          country: "",
          state: "",
          city: "",
          address: "",
          industryId: "",
          acceptedGuidelines: false,
        }}
        validationSchema={DirectorySchema}
        onSubmit={submit}
      >
        {({ isSubmitting, setFieldValue, values, status }) => {

          const states = values.country
            ? geo.State.getStatesOfCountry(values.country)
            : []

          const cities = values.state
            ? geo.City.getCitiesOfState(values.country, values.state)
            : []

          return (
            <Form className="space-y-6 bg-white p-6 rounded-xl shadow">

              {/* NAME + SLUG */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Company Name</label>
                  <Field
                    name="name"
                    className="input"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const val = e.target.value
                      setFieldValue("name", val)
                      setFieldValue("slug", slugify(val))
                    }}
                  />
                  <ErrorMessage name="name" component="p" className="error" />
                </div>
                <div>
                  <label className="label">Slug</label>
                  <Field name="slug" className="input" />
                  <ErrorMessage name="slug" component="p" className="error" />
                </div>
              </div>

              {/* PHONE + EMAIL */}
              <div className="grid grid-cols-2 gap-4">
                <FieldBlock label="Phone Number" name="phoneNumber" />
                <FieldBlock label="Email" name="email" />
              </div>

              {/* COUNTRY + STATE */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Country</label>
                  <Field as="select" name="country" className="input">
                    <option value="">Select Country</option>
                    {countries.map(c => (
                      <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="country" component="p" className="error" />
                </div>
                <div>
                  <label className="label">State</label>
                  <Field as="select" name="state" className="input">
                    <option value="">Select State</option>
                    {states.map(s => (
                      <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="state" component="p" className="error" />
                </div>
              </div>

              {/* CITY + ADDRESS */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">City</label>
                  <Field as="select" name="city" className="input">
                    <option value="">Select City</option>
                    {cities.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="city" component="p" className="error" />
                </div>
                <FieldBlock label="Full Address" name="address" />
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
                      onChange={(e) =>
                        handleIndustrySelect(levelIndex, Number(e.target.value), setFieldValue)
                      }
                    >
                      <option value="">Select Industry</option>
                      {levelOptions.map((industry: any) => (
                        <option key={industry.id} value={industry.id}>{industry.name}</option>
                      ))}
                    </select>
                  ))}
                  <ErrorMessage name="industryId" component="p" className="error" />
                </div>
                <FieldBlock label="Website" name="website" />
              </div>

              {/* DESCRIPTION - full width */}
              <div>
                <label className="label">Description</label>
                <RichTextEditor name="description" />
              </div>

              {/* LOGO - full width */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <UploadBox
                  label="Company Logo"
                  value={values.logoUrl}
                  onUpload={(file) =>
                    handleImageUpload(file, setFieldValue, "logoUrl", "logo")
                  }
                />
              </div>

              {/* COVER IMAGES */}
              <Section title="Cover Images">
                {maxCoverImages === 0 ? (
                  <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                    Cover images are available on the Basic plan and above. Upgrade your
                    plan to add a cover banner to your showroom page.
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-gray-400 mb-2">
                      Your plan allows up to {maxCoverImages} cover image{maxCoverImages > 1 ? "s" : ""}.
                      {maxCoverImages > 1 ? " Multiple images will display as a carousel." : ""}
                    </p>
                    <FieldArray name="coverImages">
                      {({ push, remove }) => (
                        <div className="grid grid-cols-2 gap-4">
                          {values.coverImages.map((url: string, i: number) => (
                            <div key={i} className="space-y-1">
                              <UploadBox
                                label={`Cover Image ${i + 1}`}
                                value={url}
                                onUpload={(file) =>
                                  handleCoverImageUpload(file, setFieldValue, values, i)
                                }
                              />
                              <button type="button" onClick={() => remove(i)}>
                                ✕ Remove
                              </button>
                            </div>
                          ))}
                          <div className="col-span-2">
                            <button
                              type="button"
                              disabled={values.coverImages.length >= maxCoverImages}
                              onClick={() => push("")}
                              className="disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              + Add cover image ({values.coverImages.length}/{maxCoverImages})
                            </button>
                          </div>
                        </div>
                      )}
                    </FieldArray>
                  </>
                )}
              </Section>

              {/* PRODUCT SUPPLIES */}
              <Section title="Product Supplies / Services">
                <p className="text-sm text-gray-500 mb-3">
                  List the products or services in this directory. Package limits apply to
                  how many supplier directories you can create, not how many products each
                  contains.
                </p>
                <FieldArray name="productSupplies">
                  {({ push, remove }) => (
                    <>
                      {values.productSupplies.map((_: any, i: number) => (
                        <div key={i} className="flex gap-2">
                          <Field name={`productSupplies.${i}`} className="input flex-1" />
                          {i > 0 && <button type="button" onClick={() => remove(i)}>✕</button>}
                        </div>
                      ))}
                      <button type="button" onClick={() => push("")}>
                        + Add product
                      </button>
                    </>
                  )}
                </FieldArray>
              </Section>

              {/* PRODUCT CATALOGUES - WITH FILE UPLOAD */}
              <Section title="Product Catalogues">
                <p className="text-sm text-gray-500 mb-3">
                  Upload your product catalogues (PDFs, brochures, etc.).
                </p>
                <FieldArray name="productCatalogues">
                  {({ push, remove }) => (
                    <div className="grid grid-cols-2 gap-4">
                      {values.productCatalogues.map((url: string, i: number) => (
                        <div key={i} className="space-y-1">
                          <UploadBox
                            label={`Product Catalogue ${i + 1}`}
                            value={url}
                            onUpload={(file) =>
                              handleCatalogueUpload(file, setFieldValue, values, i)
                            }
                          />
                          <button type="button" onClick={() => remove(i)}>
                            ✕ Remove
                          </button>
                        </div>
                      ))}
                      <div className="col-span-2">
                        <button
                          type="button"
                          onClick={() => push("")}
                          className="disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          + Add product catalogue
                        </button>
                      </div>
                    </div>
                  )}
                </FieldArray>
              </Section>

              {/* SOCIAL LINKS */}
              <Section title="Social Media Links">
                <div className="grid grid-cols-2 gap-4">
                  <FieldBlock label="Facebook" name="socialLinks.facebook" />
                  <FieldBlock label="LinkedIn" name="socialLinks.linkedin" />
                  <FieldBlock label="Twitter" name="socialLinks.twitter" />
                  <FieldBlock label="YouTube" name="socialLinks.youtube" />
                  {allowWhatsapp ? (
                    <FieldBlock label="WhatsApp" name="socialLinks.whatsapp" />
                  ) : (
                    <div>
                      <label className="label">WhatsApp</label>
                      <div className="rounded-lg border border-dashed border-gray-300 p-3 text-xs text-gray-500">
                        Available on Basic plan and above.
                      </div>
                    </div>
                  )}
                </div>
              </Section>

              {/* TRADE NAMES */}
              <Section title="Trade Names">
                <FieldArray name="tradeNames">
                  {({ push, remove }) => (
                    <>
                      {values.tradeNames.map((_: any, i: number) => (
                        <div key={i} className="flex gap-2">
                          <Field name={`tradeNames.${i}`} className="input flex-1" />
                          {i > 0 && <button type="button" onClick={() => remove(i)}>✕</button>}
                        </div>
                      ))}
                      <button type="button" onClick={() => push("")}>+ Add trade name</button>
                    </>
                  )}
                </FieldArray>
              </Section>

              {/* VIDEO GALLERY */}
              <Section title="YouTube Video Gallery">
                <FieldArray name="videoGallery">
                  {({ push, remove }) => (
                    <>
                      {values.videoGallery.map((_: any, i: number) => (
                        <div key={i} className="flex gap-2">
                          <Field name={`videoGallery.${i}`} className="input flex-1" />
                          {i > 0 && <button type="button" onClick={() => remove(i)}>✕</button>}
                        </div>
                      ))}
                      <button type="button" onClick={() => push("")}>+ Add video</button>
                    </>
                  )}
                </FieldArray>
              </Section>

              <Section title="Product Gallery">
                <FieldArray name="productGallery">
                  {({ push, remove }) => (
                    <>
                      {values.productGallery.map((_: any, i: number) => (
                        <div key={i} className="flex gap-2">
                          <Field
                            name={`productGallery.${i}`}
                            className="input flex-1"
                            placeholder="Image URL"
                          />
                          {i > 0 && (
                            <button type="button" onClick={() => remove(i)}>
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                      <button type="button" onClick={() => push("")}>
                        + Add Product Image
                      </button>
                    </>
                  )}
                </FieldArray>
              </Section>

              <Section title="Company Gallery">
                <FieldArray name="companyGallery">
                  {({ push, remove }) => (
                    <>
                      {values.companyGallery.map((_: any, i: number) => (
                        <div key={i} className="flex gap-2">
                          <Field
                            name={`companyGallery.${i}`}
                            className="input flex-1"
                          />
                          {i > 0 && (
                            <button type="button" onClick={() => remove(i)}>
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                      <button type="button" onClick={() => push("")}>
                        + Add Company Image
                      </button>
                    </>
                  )}
                </FieldArray>
              </Section>

              <Section title="Factory Gallery">
                <FieldArray name="factoryGallery">
                  {({ push, remove }) => (
                    <>
                      {values.factoryGallery.map((_: any, i: number) => (
                        <div key={i} className="flex gap-2">
                          <Field
                            name={`factoryGallery.${i}`}
                            className="input flex-1"
                          />
                          {i > 0 && (
                            <button type="button" onClick={() => remove(i)}>
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                      <button type="button" onClick={() => push("")}>
                        + Add Factory Image
                      </button>
                    </>
                  )}
                </FieldArray>
              </Section>

              <Section title="Company Brochure">
                <FieldArray name="companyBrochure">
                  {({ push, remove }) => (
                    <>
                      {values.companyBrochure.map((_: any, i: number) => (
                        <div key={i} className="flex gap-2">
                          <Field
                            name={`companyBrochure.${i}`}
                            className="input flex-1"
                            placeholder="PDF URL"
                          />
                          {i > 0 && (
                            <button type="button" onClick={() => remove(i)}>
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                      <button type="button" onClick={() => push("")}>
                        + Add Brochure
                      </button>
                    </>
                  )}
                </FieldArray>
              </Section>

              <Section title="Certifications">
                <FieldArray name="certifications">
                  {({ push, remove }) => (
                    <>
                      {values.certifications.map((_: any, i: number) => (
                        <div key={i} className="flex gap-2">
                          <Field
                            name={`certifications.${i}`}
                            className="input flex-1"
                          />
                          {i > 0 && (
                            <button type="button" onClick={() => remove(i)}>
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                      <button type="button" onClick={() => push("")}>
                        + Add Certification
                      </button>
                    </>
                  )}
                </FieldArray>
              </Section>

              <Section title="Brands Represented">
                <FieldArray name="brandsRepresented">
                  {({ push, remove }) => (
                    <>
                      {values.brandsRepresented.map((_: any, i: number) => (
                        <div key={i} className="flex gap-2">
                          <Field
                            name={`brandsRepresented.${i}`}
                            className="input flex-1"
                          />
                          {i > 0 && (
                            <button type="button" onClick={() => remove(i)}>
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                      <button type="button" onClick={() => push("")}>
                        + Add Brand
                      </button>
                    </>
                  )}
                </FieldArray>
              </Section>

              <Section title="Industries Served">
                <FieldArray name="industriesServed">
                  {({ push, remove }) => (
                    <>
                      {values.industriesServed.map((_: any, i: number) => (
                        <div key={i} className="flex gap-2">
                          <Field
                            name={`industriesServed.${i}`}
                            className="input flex-1"
                          />
                          {i > 0 && (
                            <button type="button" onClick={() => remove(i)}>
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                      <button type="button" onClick={() => push("")}>
                        + Add Industry
                      </button>
                    </>
                  )}
                </FieldArray>
              </Section>

              <Section title="Export Markets">
                <FieldArray name="exportMarkets">
                  {({ push, remove }) => (
                    <>
                      {values.exportMarkets.map((_: any, i: number) => (
                        <div key={i} className="flex gap-2">
                          <Field
                            name={`exportMarkets.${i}`}
                            className="input flex-1"
                          />
                          {i > 0 && (
                            <button type="button" onClick={() => remove(i)}>
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                      <button type="button" onClick={() => push("")}>
                        + Add Country
                      </button>
                    </>
                  )}
                </FieldArray>
              </Section>

              <div>
                <label className="label">Manufacturing Capabilities</label>
                <Field
                  as="textarea"
                  rows={5}
                  name="manufacturingCapabilities"
                  className="input"
                />
              </div>

              <div>
                <label className="label">Machinery List</label>
                <Field
                  as="textarea"
                  rows={5}
                  name="machineryList"
                  className="input"
                />
              </div>

              <div>
                <label className="label">Quality Standards</label>
                <Field
                  as="textarea"
                  rows={5}
                  name="qualityStandards"
                  className="input"
                />
              </div>

              <div className="flex items-center gap-3">
                <Field
                  type="checkbox"
                  name="enableInquiryForm"
                />
                <label>Enable Inquiry Form</label>
              </div>

              {status && <p className="text-red-600 text-sm">{status}</p>}
              {uploadError && <p className="text-red-600 text-sm">{uploadError}</p>}

              <div className="space-y-5 pt-2">
                <BusinessListingGuidelinesSummary />

                <label className="flex items-start gap-3 rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] p-4 text-sm text-[#0f172a]">
                  <Field
                    type="checkbox"
                    name="acceptedGuidelines"
                    className="mt-1 h-5 w-5 rounded border border-[#cbd5e1] text-[#2563eb] focus:ring-[#2563eb]"
                  />
                  <span>I have read and agree to the Business Listing Guidelines.</span>
                </label>
                <ErrorMessage
                  name="acceptedGuidelines"
                  component="p"
                  className="text-sm text-red-600"
                />

                <div className="flex justify-start">
                  <button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      uploadingLogo ||
                      uploadingCover ||
                      uploadingCatalogue ||
                      !values.acceptedGuidelines
                    }
                    className="w-full max-w-[220px] rounded-xl bg-black px-8 py-3 text-base font-semibold text-white transition hover:bg-[#111827] disabled:cursor-not-allowed disabled:bg-black/50"
                  >
                    {isSubmitting ? "Submitting..." : "Submit for Approval"}
                  </button>
                </div>
              </div>

            </Form>
          )
        }}
      </Formik>

      <PackageLimitModal
        open={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        title="Directory slot limit reached"
        eligibility={listingEligibility}
        usedLabel="Directories"
        usedValue={listingEligibility?.activeListings}
        limitValue={listingEligibility?.effectiveLimit}
      />
    </div>
  )
}

/* HELPERS */
function FieldBlock({ label, name }: any) {
  return (
    <div>
      <label className="label">{label}</label>
      <Field name={name} className="input" />
      <ErrorMessage name={name} component="p" className="error" />
    </div>
  )
}

function Section({ title, children }: any) {
  return (
    <div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  )
}