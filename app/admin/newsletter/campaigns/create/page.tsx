"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateCampaignPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    subject: "",
    previewText: "",
    content: "",
    audience: "ALL",
    status: "DRAFT",
    schedule: "NOW",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function createCampaign() {
    setLoading(true);

    setTimeout(() => {
      alert("Campaign Created (Dummy)");
      setLoading(false);
      router.push("/admin/newsletter/campaigns");
    }, 1000);
  }

  return (
    <div className="max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">
        Create Campaign
      </h1>

      <div className="space-y-6">

        <input
          name="title"
          placeholder="Campaign Title"
          value={form.title}
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

        <input
          name="previewText"
          placeholder="Preview Text"
          value={form.previewText}
          onChange={handleChange}
          className="w-full border rounded-lg h-11 px-4"
        />

        <textarea
          rows={12}
          name="content"
          placeholder="Campaign Content"
          value={form.content}
          onChange={handleChange}
          className="w-full border rounded-lg p-4"
        />

        <select
          name="audience"
          value={form.audience}
          onChange={handleChange}
          className="w-full border rounded-lg h-11 px-4"
        >
          <option>ALL</option>
          <option>ACTIVE</option>
          <option>EMAIL</option>
          <option>WHATSAPP</option>
          <option>SMS</option>
        </select>

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border rounded-lg h-11 px-4"
        >
          <option>DRAFT</option>
          <option>SCHEDULED</option>
        </select>

        <button
          onClick={createCampaign}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          {loading ? "Creating..." : "Create Campaign"}
        </button>

      </div>

    </div>
  );
}