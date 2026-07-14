"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditSubscriberPage() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",

    source: "MANUAL",

    frequency: "MONTHLY",

    receiveEmail: true,
    receiveWhatsapp: false,
    receiveSMS: false,

    status: "ACTIVE",
  });

  useEffect(() => {
    loadSubscriber();
  }, []);

  async function loadSubscriber() {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/newsletter/subscribers/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Subscriber not found");
        router.push("/admin/newsletter/subscribers");
        return;
      }

      setForm({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",

        source: data.source || "MANUAL",

        frequency: data.frequency || "MONTHLY",

        receiveEmail: data.receiveEmail,
        receiveWhatsapp: data.receiveWhatsapp,
        receiveSMS: data.receiveSMS,

        status: data.status || "ACTIVE",
      });
    } catch {
      alert("Unable to load subscriber");
    } finally {
      setLoading(false);
    }
  }

  function updateField(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function updateSubscriber(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/newsletter/subscribers/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Update failed");
        return;
      }

      alert("Subscriber updated");

      router.push("/admin/newsletter/subscribers");
    } catch {
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function deleteSubscriber() {
    if (!confirm("Delete subscriber?")) return;

    const token = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/newsletter/subscribers/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      alert("Delete failed");
      return;
    }

    alert("Deleted");

    router.push("/admin/newsletter/subscribers");
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-3xl">

      <h1 className="text-3xl font-bold mb-8">
        Edit Subscriber
      </h1>

      <form
        onSubmit={updateSubscriber}
        className="space-y-6"
      >

        <div>
          <label>Name</label>

          <input
            name="name"
            value={form.name}
            onChange={updateField}
            className="border w-full h-11 px-4 rounded-lg"
          />
        </div>

        <div>
          <label>Email</label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={updateField}
            className="border w-full h-11 px-4 rounded-lg"
          />
        </div>

        <div>
          <label>Phone</label>

          <input
            name="phone"
            value={form.phone}
            onChange={updateField}
            className="border w-full h-11 px-4 rounded-lg"
          />
        </div>

        <div>
          <label>Source</label>

          <select
            name="source"
            value={form.source}
            onChange={updateField}
            className="border w-full h-11 px-4 rounded-lg"
          >
            <option value="MANUAL">Manual</option>
            <option value="FORM">Newsletter Form</option>
            <option value="COMPANY">Company Profile</option>
          </select>
        </div>

        <div>
          <label>Frequency</label>

          <select
            name="frequency"
            value={form.frequency}
            onChange={updateField}
            className="border w-full h-11 px-4 rounded-lg"
          >
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
            <option value="YEARLY">Yearly</option>
            <option value="CUSTOM">Custom</option>
          </select>
        </div>

        <div>

          <label className="font-medium block mb-3">
            Delivery Channels
          </label>

          <label className="flex gap-3 mb-3">
            <input
              type="checkbox"
              name="receiveEmail"
              checked={form.receiveEmail}
              onChange={updateField}
            />
            Email
          </label>

          <label className="flex gap-3 mb-3">
            <input
              type="checkbox"
              name="receiveWhatsapp"
              checked={form.receiveWhatsapp}
              onChange={updateField}
            />
            WhatsApp
          </label>

          <label className="flex gap-3">
            <input
              type="checkbox"
              name="receiveSMS"
              checked={form.receiveSMS}
              onChange={updateField}
            />
            SMS
          </label>

        </div>

        <div>

          <label>Status</label>

          <select
            name="status"
            value={form.status}
            onChange={updateField}
            className="border w-full h-11 px-4 rounded-lg"
          >
            <option value="ACTIVE">Active</option>
            <option value="UNSUBSCRIBED">
              Unsubscribed
            </option>
          </select>

        </div>

        <div className="flex gap-3 pt-4">

          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            {saving ? "Saving..." : "Update Subscriber"}
          </button>

          <button
            type="button"
            onClick={deleteSubscriber}
            className="bg-red-600 text-white px-6 py-3 rounded-lg"
          >
            Delete
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="border px-6 py-3 rounded-lg"
          >
            Cancel
          </button>

        </div>

      </form>

    </div>
  );
}