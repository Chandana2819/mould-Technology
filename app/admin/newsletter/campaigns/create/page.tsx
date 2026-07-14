"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateCampaignPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    subject: "",
    previewText: "",
    content: "",
    audience: "ALL",
    status: "DRAFT",
    scheduleType: "NOW",
    scheduledAt: "",
    channels: {
      email: true,
      whatsapp: false,
      sms: false,
    },
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleChannel(name: string) {
    setForm({
      ...form,
      channels: {
        ...form.channels,
        [name]: !form.channels[name as keyof typeof form.channels],
      },
    });
  }

  async function createCampaign(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/admin/login");
        return;
      }

      const payload = {
        title: form.title,
        subject: form.subject,
        previewText: form.previewText,
        content: form.content,
        audience: form.audience,
        status: form.status,
        emailEnabled: form.channels.email,
        whatsappEnabled: form.channels.whatsapp,
        smsEnabled: form.channels.sms,
        scheduledAt: form.scheduleType === "LATER" ? form.scheduledAt : null,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/newsletter/campaigns`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create campaign");
      }

      alert("Campaign created successfully");
      router.push("/admin/newsletter/campaigns");
    } catch (err: any) {
      setError(err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Create Campaign</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={createCampaign} className="space-y-6">
        <div>
          <label className="font-medium block mb-2">Campaign Title</label>
          <input
            name="title"
            placeholder="e.g., Weekly Industry Newsletter"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded-lg h-11 px-4"
            required
          />
        </div>

        <div>
          <label className="font-medium block mb-2">Email Subject</label>
          <input
            name="subject"
            placeholder="e.g., Latest Manufacturing Updates"
            value={form.subject}
            onChange={handleChange}
            className="w-full border rounded-lg h-11 px-4"
            required
          />
        </div>

        <div>
          <label className="font-medium block mb-2">Preview Text</label>
          <input
            name="previewText"
            placeholder="Brief preview of the email"
            value={form.previewText}
            onChange={handleChange}
            className="w-full border rounded-lg h-11 px-4"
          />
        </div>

        <div>
          <label className="font-medium block mb-2">Campaign Content</label>
          <textarea
            rows={12}
            name="content"
            placeholder="<h2>Hello Subscriber</h2><p>Your content here...</p>"
            value={form.content}
            onChange={handleChange}
            className="w-full border rounded-lg p-4 font-mono text-sm"
            required
          />
        </div>

        <div>
          <label className="font-medium block mb-3">Delivery Channels</label>
          <div className="flex gap-8">
            <label className="flex gap-2">
              <input
                type="checkbox"
                checked={form.channels.email}
                onChange={() => handleChannel("email")}
              />
              Email
            </label>
            <label className="flex gap-2">
              <input
                type="checkbox"
                checked={form.channels.whatsapp}
                onChange={() => handleChannel("whatsapp")}
              />
              WhatsApp
            </label>
            <label className="flex gap-2">
              <input
                type="checkbox"
                checked={form.channels.sms}
                onChange={() => handleChannel("sms")}
              />
              SMS
            </label>
          </div>
        </div>

        <div>
          <label className="font-medium block mb-2">Audience</label>
          <select
            name="audience"
            value={form.audience}
            onChange={handleChange}
            className="w-full border rounded-lg h-11 px-4"
          >
            <option value="ALL">All Subscribers</option>
            <option value="ACTIVE">Active Only</option>
            <option value="EMAIL">Email Subscribers</option>
            <option value="WHATSAPP">WhatsApp Subscribers</option>
            <option value="SMS">SMS Subscribers</option>
          </select>
        </div>

        <div>
          <label className="font-medium block mb-2">Schedule</label>
          <select
            name="scheduleType"
            value={form.scheduleType}
            onChange={handleChange}
            className="w-full border rounded-lg h-11 px-4"
          >
            <option value="NOW">Send Immediately</option>
            <option value="LATER">Schedule</option>
          </select>
        </div>

        {form.scheduleType === "LATER" && (
          <div>
            <label className="font-medium block mb-2">Schedule Date</label>
            <input
              type="datetime-local"
              className="w-full border rounded-lg h-11 px-4"
              name="scheduledAt"
              value={form.scheduledAt}
              onChange={handleChange}
            />
          </div>
        )}

        <div>
          <label className="font-medium block mb-2">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border rounded-lg h-11 px-4"
          >
            <option value="DRAFT">DRAFT</option>
            <option value="SCHEDULED">SCHEDULED</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Campaign"}
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