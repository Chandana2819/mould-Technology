"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type Directory = {
  id: number
  name: string
  slug: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  isLiveEditable: boolean
}

export default function RecruiterDirectoriesPage() {
  const [directories, setDirectories] = useState<Directory[]>([])
  const [loading, setLoading] = useState(true)

 useEffect(() => {
  async function loadDirectories() {
    try {
      const token = localStorage.getItem("token")
      console.log("TOKEN:", token)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/suppliers/recruiter/directories`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      console.log("STATUS:", res.status)

      const text = await res.text()
      console.log("RESPONSE:", text)

      if (!res.ok) {
        throw new Error("Failed to load directories")
      }

      const data = JSON.parse(text)
      setDirectories(data)
    } catch (err) {
      console.error("LOAD ERROR:", err)
      alert("Unable to load directories")
    } finally {
      setLoading(false)
    }
  }

  loadDirectories()
}, [])


  if (loading) {
    return <div className="p-10">Loading directories...</div>
  }

  return (
    <div className="max-w-5xl mx-auto p-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          My Directories
        </h1>

        <Link
          href="/recruiter/directories/new"
          className="bg-black text-white px-5 py-2 rounded text-sm"
        >
          + Add Directory
        </Link>
      </div>

      <div className="bg-white rounded shadow divide-y">

        {/* EMPTY STATE */}
        {directories.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            You haven’t created any directories yet.
          </div>
        )}

        {/* LIST */}
        {directories.map((dir) => (
          <div
            key={dir.id}
            className="p-4 flex items-center justify-between"
          >
            <div>
              <h3 className="font-semibold">
                {dir.name}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Status:{" "}
                <span
                  className={
                    dir.status === "APPROVED"
                      ? "text-green-600 font-semibold"
                      : dir.status === "PENDING"
                      ? "text-yellow-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {dir.status}
                </span>
              </p>
            </div>

            <div>
              {dir.isLiveEditable ? (
                <Link
                  href={`/recruiter/directories/${dir.id}/edit`}
                  className="px-4 py-2 rounded text-sm bg-black text-white"
                >
                  Edit
                </Link>
              ) : (
                <button
                  disabled
                  className="px-4 py-2 rounded text-sm border opacity-50 cursor-not-allowed"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
