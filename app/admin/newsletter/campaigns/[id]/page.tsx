"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EditCampaignPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "Weekly Industry Newsletter",
    subject: "Latest Manufacturing Updates",
    previewText: "Top news and supplier updates this week",

    content: `<h2>Hello Subscriber</h2><p>This is a sample newsletter.</p>`,

    status: "DRAFT",

    channels: {
      email: true,
      whatsapp: false,
      sms: false,
    },

    audience: "ALL",

    scheduleType: "NOW",
    scheduledAt: "",
  });

  function handleInput(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
        [name]:
          !form.channels[name as keyof typeof form.channels],
      },
    });
  }

  function saveCampaign() {
    setLoading(true);

    setTimeout(() => {
      alert("Campaign updated (Dummy)");
      setLoading(false);
    }, 1000);
  }

  function sendCampaign() {
    alert("Campaign Sent (Dummy)");
  }

  function deleteCampaign() {
    if (!confirm("Delete campaign?")) return;

    alert("Campaign Deleted");

    router.push("/admin/newsletter/campaigns");
  }

  return (
    <div className="max-w-5xl mx-auto">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          Edit Campaign
        </h1>

        <button
          onClick={() => router.back()}
          className="border px-5 py-2 rounded-lg"
        >
          Back
        </button>

      </div>

      <div className="space-y-6">

        <div>
          <label className="font-medium block mb-2">
            Campaign Title
          </label>

          <input
            className="w-full border rounded-lg h-11 px-4"
            name="title"
            value={form.title}
            onChange={handleInput}
          />
        </div>

        <div>
          <label className="font-medium block mb-2">
            Email Subject
          </label>

          <input
            className="w-full border rounded-lg h-11 px-4"
            name="subject"
            value={form.subject}
            onChange={handleInput}
          />
        </div>

        <div>
          <label className="font-medium block mb-2">
            Preview Text
          </label>

          <input
            className="w-full border rounded-lg h-11 px-4"
            name="previewText"
            value={form.previewText}
            onChange={handleInput}
          />
        </div>

        <div>
          <label className="font-medium block mb-2">
            Newsletter Content
          </label>

          <textarea
            rows={12}
            className="w-full border rounded-lg p-4"
            name="content"
            value={form.content}
            onChange={handleInput}
          />
        </div>

        <div>

          <label className="font-medium block mb-3">
            Delivery Channels
          </label>

          <div className="flex gap-8">

            <label className="flex gap-2">

              <input
                type="checkbox"
                checked={form.channels.email}
                onChange={() =>
                  handleChannel("email")
                }
              />

              Email

            </label>

            <label className="flex gap-2">

              <input
                type="checkbox"
                checked={form.channels.whatsapp}
                onChange={() =>
                  handleChannel("whatsapp")
                }
              />

              WhatsApp

            </label>

            <label className="flex gap-2">

              <input
                type="checkbox"
                checked={form.channels.sms}
                onChange={() =>
                  handleChannel("sms")
                }
              />

              SMS

            </label>

          </div>

        </div>

        <div>

          <label className="font-medium block mb-2">
            Audience
          </label>

          <select
            className="w-full border rounded-lg h-11 px-4"
            name="audience"
            value={form.audience}
            onChange={handleInput}
          >
            <option value="ALL">
              All Subscribers
            </option>

            <option value="ACTIVE">
              Active Only
            </option>

            <option value="EMAIL">
              Email Subscribers
            </option>

            <option value="WHATSAPP">
              WhatsApp Subscribers
            </option>

            <option value="SMS">
              SMS Subscribers
            </option>
          </select>

        </div>

        <div>

          <label className="font-medium block mb-2">
            Schedule
          </label>

          <select
            className="w-full border rounded-lg h-11 px-4"
            name="scheduleType"
            value={form.scheduleType}
            onChange={handleInput}
          >
            <option value="NOW">
              Send Immediately
            </option>

            <option value="LATER">
              Schedule
            </option>
          </select>

        </div>

        {form.scheduleType === "LATER" && (

          <div>

            <label className="font-medium block mb-2">
              Schedule Date
            </label>

            <input
              type="datetime-local"
              className="w-full border rounded-lg h-11 px-4"
              name="scheduledAt"
              value={form.scheduledAt}
              onChange={handleInput}
            />

          </div>

        )}

        <div>

          <label className="font-medium block mb-2">
            Status
          </label>

          <select
            className="w-full border rounded-lg h-11 px-4"
            name="status"
            value={form.status}
            onChange={handleInput}
          >
            <option>DRAFT</option>
            <option>SCHEDULED</option>
            <option>SENDING</option>
            <option>SENT</option>
          </select>

        </div>

        <div className="flex gap-3 pt-6">

          <button
            onClick={saveCampaign}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            {loading ? "Saving..." : "Save"}
          </button>

          <button
            onClick={sendCampaign}
            className="bg-green-600 text-white px-6 py-3 rounded-lg"
          >
            Send
          </button>

          <button
            onClick={deleteCampaign}
            className="bg-red-600 text-white px-6 py-3 rounded-lg"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}