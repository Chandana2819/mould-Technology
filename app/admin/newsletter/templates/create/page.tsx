"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateTemplatePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    subject: "",
    content: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function createTemplate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/admin/login");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/newsletter/templates`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create template");
      }

      alert("Template created successfully");
      router.push("/admin/newsletter/templates");
    } catch (err: any) {
      setError(err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Create Template</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={createTemplate} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium">Template Name</label>
          <input
            name="name"
            placeholder="e.g., Monthly Newsletter"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-lg h-11 px-4"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Email Subject</label>
          <input
            name="subject"
            placeholder="e.g., Latest Industry Updates"
            value={form.subject}
            onChange={handleChange}
            className="w-full border rounded-lg h-11 px-4"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Email Content (HTML)</label>
          <textarea
            rows={14}
            name="content"
            placeholder="<h2>Hello Subscriber</h2><p>Your content here...</p>"
            value={form.content}
            onChange={handleChange}
            className="w-full border rounded-lg p-4 font-mono text-sm"
            required
          />
          <p className="mt-2 text-sm text-gray-500">
            Use HTML tags for formatting. Example: &lt;h2&gt;Hello&lt;/h2&gt;, &lt;p&gt;text&lt;/p&gt;
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Create Template"}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="border px-6 py-3 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}