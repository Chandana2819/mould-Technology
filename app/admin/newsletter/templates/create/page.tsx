"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateTemplatePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    subject: "",
    content: "",
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

  function createTemplate() {
    setLoading(true);

    setTimeout(() => {
      alert("Template Created (Dummy)");
      setLoading(false);
      router.push("/admin/newsletter/templates");
    }, 1000);
  }

  return (
    <div className="max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">
        Create Template
      </h1>

      <div className="space-y-6">

        <input
          name="name"
          placeholder="Template Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded-lg h-11 px-4"
        />

        <input
          name="subject"
          placeholder="Email Subject"
          value={form.subject}
          onChange={handleChange}
          className="w-full border rounded-lg h-11 px-4"
        />

        <textarea
          rows={14}
          name="content"
          placeholder="HTML / Email Template"
          value={form.content}
          onChange={handleChange}
          className="w-full border rounded-lg p-4"
        />

        <button
          onClick={createTemplate}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          {loading ? "Saving..." : "Create Template"}
        </button>

      </div>

    </div>
  );
}