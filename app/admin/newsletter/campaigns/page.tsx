"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Campaign = {
  id: number;
  title: string;
  subject: string;

  status:
    | "DRAFT"
    | "SCHEDULED"
    | "SENDING"
    | "SENT";

  sendChannels: string[];

  recipientsCount: number;

  createdAt: string;
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadCampaigns();
  }, []);

  async function loadCampaigns() {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/newsletter/campaigns`,
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

      setCampaigns(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteCampaign(id: number) {
    if (!confirm("Delete this campaign?")) return;

    const token = localStorage.getItem("token");

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
      alert("Delete failed");
      return;
    }

    setCampaigns((prev) =>
      prev.filter((item) => item.id !== id)
    );
  }

  async function sendCampaign(id: number) {
    if (!confirm("Send campaign now?")) return;

    const token = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/newsletter/campaigns/${id}/send`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      alert("Unable to send.");
      return;
    }

    alert("Campaign queued.");

    loadCampaigns();
  }

  const filtered = useMemo(() => {
    return campaigns.filter((item) => {
      return (
        item.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.subject
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    });
  }, [campaigns, search]);

  if (loading) {
    return <div>Loading campaigns...</div>;
  }

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">
            Newsletter Campaigns
          </h1>

          <p className="text-gray-500 mt-1">
            {campaigns.length} campaigns
          </p>

        </div>

        <Link
          href="/admin/newsletter/campaigns/create"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          + New Campaign
        </Link>

      </div>

      <input
        className="border h-11 rounded-lg px-4 w-full"
        placeholder="Search campaign..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-600">
          {error}
        </div>
      )}

      <div className="border rounded-xl overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-3 text-left">
                Campaign
              </th>

              <th className="p-3 text-left">
                Subject
              </th>

              <th className="p-3 text-left">
                Channels
              </th>

              <th className="p-3 text-left">
                Recipients
              </th>

              <th className="p-3 text-left">
                Status
              </th>

              <th className="p-3 text-left">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filtered.map((item) => (

              <tr
                key={item.id}
                className="border-t"
              >

                <td className="p-3 font-medium">
                  {item.title}
                </td>

                <td className="p-3">
                  {item.subject}
                </td>

                <td className="p-3">
                  {item.sendChannels.join(", ")}
                </td>

                <td className="p-3">
                  {item.recipientsCount}
                </td>

                <td className="p-3">

                  <span
                    className={`px-3 py-1 rounded-full text-xs
                    ${
                      item.status === "SENT"
                        ? "bg-green-100 text-green-700"
                        : item.status === "DRAFT"
                        ? "bg-gray-200 text-gray-700"
                        : item.status === "SCHEDULED"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {item.status}
                  </span>

                </td>

                <td className="p-3">

                  <div className="flex gap-3">

                    <Link
                      href={`/admin/newsletter/campaigns/${item.id}`}
                      className="text-blue-600"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() =>
                        sendCampaign(item.id)
                      }
                      className="text-green-600"
                    >
                      Send
                    </button>

                    <button
                      onClick={() =>
                        deleteCampaign(item.id)
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
                  colSpan={6}
                  className="text-center p-8 text-gray-500"
                >
                  No campaigns found.
                </td>

              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}