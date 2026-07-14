"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditCampaignPage() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    subject: "",
    previewText: "",
    content: "",
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

  useEffect(() => {
    if (id) {
      loadCampaign();
    }
  }, [id]);

  async function loadCampaign() {
    try {
      setError(null);
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/admin/login");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/newsletter/campaigns/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("token");
          router.push("/admin/login");
          return;
        }
        const data = await res.json();
        throw new Error(data.error || "Campaign not found");
      }

      const data = await res.json();

      setForm({
        title: data.title || "",
        subject: data.subject || "",
        previewText: data.previewText || "",
        content: data.content || "",
        status: data.status || "DRAFT",
        channels: {
          email: data.emailEnabled ?? true,
          whatsapp: data.whatsappEnabled ?? false,
          sms: data.smsEnabled ?? false,
        },
        audience: data.audience || "ALL",
        scheduleType: data.scheduledAt ? "LATER" : "NOW",
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt).toISOString().slice(0, 16) : "",
      });
    } catch (err: any) {
      setError(err.message);
      alert(err.message);
      router.push("/admin/newsletter/campaigns");
    } finally {
      setLoading(false);
    }
  }

  function handleInput(
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

  async function saveCampaign(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      setSaving(true);
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
        status: form.status,
        emailEnabled: form.channels.email,
        whatsappEnabled: form.channels.whatsapp,
        smsEnabled: form.channels.sms,
        audience: form.audience,
        scheduledAt: form.scheduleType === "LATER" ? form.scheduledAt : null,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/newsletter/campaigns/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Update failed");
      }

      alert("Campaign updated successfully");
      router.push("/admin/newsletter/campaigns");
    } catch (err: any) {
      setError(err.message);
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function sendCampaign() {
    if (!confirm("Send this campaign now?")) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/admin/login");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/newsletter/campaigns/${id}/send`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send campaign");
      }

      alert(`Campaign sent successfully! ${data.totalRecipients || 0} recipients`);
      router.push("/admin/newsletter/campaigns");
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function deleteCampaign() {
    if (!confirm("Are you sure you want to delete this campaign?")) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/admin/login");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/newsletter/campaigns/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Delete failed");
      }

      alert("Campaign deleted successfully");
      router.push("/admin/newsletter/campaigns");
    } catch (err: any) {
      alert(err.message);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Loading campaign...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Edit Campaign</h1>
        <button
          onClick={() => router.back()}
          className="border px-5 py-2 rounded-lg hover:bg-gray-50"
        >
          Back
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={saveCampaign} className="space-y-6">
        <div>
          <label className="font-medium block mb-2">Campaign Title</label>
          <input
            className="w-full border rounded-lg h-11 px-4"
            name="title"
            value={form.title}
            onChange={handleInput}
            required
          />
        </div>

        <div>
          <label className="font-medium block mb-2">Email Subject</label>
          <input
            className="w-full border rounded-lg h-11 px-4"
            name="subject"
            value={form.subject}
            onChange={handleInput}
            required
          />
        </div>

        <div>
          <label className="font-medium block mb-2">Preview Text</label>
          <input
            className="w-full border rounded-lg h-11 px-4"
            name="previewText"
            value={form.previewText}
            onChange={handleInput}
          />
        </div>

        <div>
          <label className="font-medium block mb-2">Newsletter Content</label>
          <textarea
            rows={12}
            className="w-full border rounded-lg p-4 font-mono text-sm"
            name="content"
            value={form.content}
            onChange={handleInput}
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
            className="w-full border rounded-lg h-11 px-4"
            name="audience"
            value={form.audience}
            onChange={handleInput}
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
            className="w-full border rounded-lg h-11 px-4"
            name="scheduleType"
            value={form.scheduleType}
            onChange={handleInput}
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
              onChange={handleInput}
            />
          </div>
        )}

        <div>
          <label className="font-medium block mb-2">Status</label>
          <select
            className="w-full border rounded-lg h-11 px-4"
            name="status"
            value={form.status}
            onChange={handleInput}
          >
            <option value="DRAFT">DRAFT</option>
            <option value="SCHEDULED">SCHEDULED</option>
            <option value="SENT">SENT</option>
          </select>
        </div>

        <div className="flex gap-3 pt-6">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>

          <button
            type="button"
            onClick={sendCampaign}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            disabled={form.status === "SENT"}
          >
            Send
          </button>

          <button
            type="button"
            onClick={deleteCampaign}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}