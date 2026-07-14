"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Subscriber = {
  id: number;
  name: string;
  email: string;
  phone?: string;

  source:
    | "FORM"
    | "COMPANY"
    | "MANUAL";

  frequency:
    | "WEEKLY"
    | "MONTHLY"
    | "YEARLY"
    | "CUSTOM";

  receiveEmail: boolean;
  receiveWhatsapp: boolean;
  receiveSMS: boolean;

  status:
    | "ACTIVE"
    | "UNSUBSCRIBED";

  createdAt: string;
};

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadSubscribers();
  }, []);

  async function loadSubscribers() {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/newsletter/subscribers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed");
      }

      setSubscribers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteSubscriber(id: number) {
    if (!confirm("Delete subscriber?")) return;

    try {
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

      setSubscribers((prev) =>
        prev.filter((item) => item.id !== id)
      );
    } catch {
      alert("Something went wrong");
    }
  }

  const filtered = useMemo(() => {
    return subscribers.filter((item) => {
      return (
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [search, subscribers]);

  if (loading)
    return (
      <div className="p-8">
        Loading subscribers...
      </div>
    );

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Newsletter Subscribers
          </h1>

          <p className="text-gray-500 mt-1">
            {subscribers.length} subscribers
          </p>
        </div>

        <div className="flex gap-3">

          <Link
            href="/admin/newsletter/subscribers/import"
            className="border px-5 py-2 rounded-lg"
          >
            Import CSV
          </Link>

          <Link
            href="/admin/newsletter/subscribers/add"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            + Add Subscriber
          </Link>

        </div>

      </div>

      <input
        className="border rounded-lg px-4 h-11 w-full"
        placeholder="Search name or email..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="overflow-auto rounded-xl border">

        <table className="w-full text-sm">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-3 text-left">Name</th>

              <th className="p-3 text-left">Email</th>

              <th className="p-3 text-left">Phone</th>

              <th className="p-3 text-left">Source</th>

              <th className="p-3 text-left">Frequency</th>

              <th className="p-3 text-left">Status</th>

              <th className="p-3 text-left">Actions</th>

            </tr>

          </thead>

          <tbody>

            {filtered.map((item) => (

              <tr
                key={item.id}
                className="border-t"
              >

                <td className="p-3">
                  {item.name}
                </td>

                <td className="p-3">
                  {item.email}
                </td>

                <td className="p-3">
                  {item.phone || "-"}
                </td>

                <td className="p-3">
                  {item.source}
                </td>

                <td className="p-3">
                  {item.frequency}
                </td>

                <td className="p-3">

                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      item.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status}
                  </span>

                </td>

                <td className="p-3">

                  <div className="flex gap-2">

                    <Link
                      href={`/admin/newsletter/subscribers/${item.id}`}
                      className="text-blue-600"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() =>
                        deleteSubscriber(item.id)
                      }
                      className="text-red-600"
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>

            ))}

            {filtered.length === 0 && (
              <tr>

                <td
                  colSpan={7}
                  className="text-center p-10 text-gray-500"
                >
                  No subscribers found
                </td>

              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}