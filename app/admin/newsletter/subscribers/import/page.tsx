"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function ImportSubscribersPage() {
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  async function upload() {
    if (!file) {
      alert("Please select a CSV file.");
      return;
    }

    try {
      setUploading(true);

      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/newsletter/subscribers/import`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Import failed");
        return;
      }

      alert(`${data.imported} subscribers imported successfully.`);

      router.push("/admin/newsletter/subscribers");
    } catch {
      alert("Something went wrong.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-3xl">

      <h1 className="text-3xl font-bold mb-8">
        Import Subscribers
      </h1>

      <div className="border rounded-xl p-6 bg-white space-y-6">

        <div>

          <p className="font-semibold">
            CSV Format
          </p>

          <div className="mt-3 rounded-lg bg-gray-100 p-4 text-sm">

            name,email,phone,frequency

            <br />

            John Doe,john@gmail.com,9876543210,MONTHLY

            <br />

            Jane,jane@gmail.com,,WEEKLY

          </div>

        </div>

        <div>

          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            onChange={(e) =>
              setFile(e.target.files?.[0] || null)
            }
          />

        </div>

        {file && (
          <div className="rounded-lg border p-4">

            <p className="font-medium">
              Selected File
            </p>

            <p className="text-gray-500">
              {file.name}
            </p>

          </div>
        )}

        <div className="flex gap-3">

          <button
            onClick={upload}
            disabled={uploading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            {uploading
              ? "Importing..."
              : "Import Subscribers"}
          </button>

          <button
            onClick={() => router.back()}
            className="border px-6 py-3 rounded-lg"
          >
            Cancel
          </button>

        </div>

      </div>

    </div>
  );
}