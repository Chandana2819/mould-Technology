"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EditTemplatePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "Monthly Newsletter",
    subject: "Latest Industry Updates",
    content: "<h2>Hello Subscriber</h2>",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function updateTemplate() {
    setLoading(true);

    setTimeout(() => {
      alert("Template Updated");
      setLoading(false);
    }, 1000);
  }

  function deleteTemplate() {
    if (!confirm("Delete template?")) return;

    alert("Template Deleted");

    router.push("/admin/newsletter/templates");
  }

  return (
    <div className="max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">
        Edit Template
      </h1>

      <div className="space-y-6">

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded-lg h-11 px-4"
        />

        <input
          name="subject"
          value={form.subject}
          onChange={handleChange}
          className="w-full border rounded-lg h-11 px-4"
        />

        <textarea
          rows={14}
          name="content"
          value={form.content}
          onChange={handleChange}
          className="w-full border rounded-lg p-4"
        />

        <div className="flex gap-3">

          <button
            onClick={updateTemplate}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            {loading ? "Saving..." : "Update"}
          </button>

          <button
            onClick={deleteTemplate}
            className="bg-red-600 text-white px-6 py-3 rounded-lg"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}