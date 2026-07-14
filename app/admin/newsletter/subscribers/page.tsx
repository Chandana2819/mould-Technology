"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Subscriber = {
  id: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  companyName?: string;
  source: "NEWSLETTER_FORM" | "COMPANY_PROFILE" | "ADMIN" | "IMPORT" | "EVENT" | "MAGAZINE";
  frequency: "WEEKLY" | "BIWEEKLY" | "MONTHLY" | "QUARTERLY" | "HALF_YEARLY" | "YEARLY" | "TEN_TIMES_PER_YEAR" | "CUSTOM";
  emailSubscribed: boolean;
  whatsappSubscribed: boolean;
  smsSubscribed: boolean;
  status: "ACTIVE" | "UNSUBSCRIBED" | "BLOCKED";
  createdAt: string;
};

export default function SubscribersPage() {
  const searchParams = useSearchParams();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    loadSubscribers();

    // Check if redirected from subscription
    const subscribed = searchParams.get("subscribed");
    if (subscribed === "true") {
      setSuccessMessage("✅ New subscriber added successfully!");
      // Clear the URL parameter
      window.history.replaceState({}, "", "/admin/newsletter/subscribers");
    }
  }, []);

  async function loadSubscribers() {
    try {
      setLoading(true);
      setError("");
      setDebugInfo(null);

      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      console.log("📡 Fetching subscribers from:", `${apiUrl}/api/newsletter/subscribers`);
      console.log("🔑 Token present:", !!token);

      if (!token) {
        setError("❌ Authentication required. Please login.");
        return;
      }

      const res = await fetch(
        `${apiUrl}/api/newsletter/subscribers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      console.log("📊 Response status:", res.status);

      const data = await res.json();
      console.log("📦 Raw response data:", data);

      if (!res.ok) {
        throw new Error(data.error || `Failed with status: ${res.status}`);
      }

      // Handle both array and paginated response
      const subscribersData = Array.isArray(data) ? data : data.subscribers || [];

      console.log(`✅ Loaded ${subscribersData.length} subscribers`);

      setSubscribers(subscribersData);

      // Store debug info
      setDebugInfo({
        totalCount: subscribersData.length,
        firstThree: subscribersData.slice(0, 3).map((s: Subscriber) => ({
          id: s.id,
          name: s.fullName,
          email: s.email,
          status: s.status
        })),
        sampleData: subscribersData.length > 0 ? subscribersData[0] : null
      });

    } catch (err: any) {
      console.error("❌ Error loading subscribers:", err);
      setError(err.message || "Failed to load subscribers");
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

      setSubscribers((prev) => prev.filter((item) => item.id !== id));
      setSuccessMessage(`✅ Subscriber deleted successfully!`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Something went wrong");
    }
  }

  const filtered = useMemo(() => {
    return subscribers.filter((item) => {
      const searchLower = search.toLowerCase();
      return (
        item.fullName?.toLowerCase().includes(searchLower) ||
        item.email?.toLowerCase().includes(searchLower) ||
        item.companyName?.toLowerCase().includes(searchLower)
      );
    });
  }, [search, subscribers]);

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span>Loading subscribers...</span>
        </div>
        <div className="text-sm text-gray-500">
          Fetching data from {process.env.NEXT_PUBLIC_API_URL}/api/newsletter/subscribers
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center gap-2">
          <span className="text-xl">✅</span>
          {successMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg flex items-center gap-2">
          <span className="text-xl">❌</span>
          {error}
          <button
            onClick={loadSubscribers}
            className="ml-auto text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            Newsletter Subscribers
            <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {subscribers.length} total
            </span>
          </h1>
          <p className="text-gray-500 mt-1">
            {filtered.length} subscribers shown (filtered)
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={loadSubscribers}
            className="border px-4 py-2 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>

          <Link
            href="/admin/newsletter/subscribers/import"
            className="border px-5 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            Import CSV
          </Link>

          <Link
            href="/admin/newsletter/subscribers/add"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <span className="text-lg">+</span>
            Add Subscriber
          </Link>
        </div>
      </div>

      {/* Debug Info */}
      {debugInfo && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
          <details>
            <summary className="font-semibold cursor-pointer text-gray-700">
              🔍 Debug Info (Click to expand)
            </summary>
            <div className="mt-2 space-y-2">
              <p><strong>Total subscribers:</strong> {debugInfo.totalCount}</p>
              <p><strong>First 3 subscribers:</strong></p>
              <pre className="bg-white p-2 rounded border text-xs overflow-auto">
                {JSON.stringify(debugInfo.firstThree, null, 2)}
              </pre>
              {debugInfo.sampleData && (
                <>
                  <p><strong>Sample subscriber data:</strong></p>
                  <pre className="bg-white p-2 rounded border text-xs overflow-auto">
                    {JSON.stringify(debugInfo.sampleData, null, 2)}
                  </pre>
                </>
              )}
            </div>
          </details>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <input
          className="border rounded-lg px-4 h-11 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
          placeholder="Search by name, email, or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <svg className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      <div className="overflow-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Company</th>
              <th className="p-3 text-left">Source</th>
              <th className="p-3 text-left">Frequency</th>
              <th className="p-3 text-left">Channels</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center p-10 text-gray-500">
                  {subscribers.length === 0 ? (
                    <div className="space-y-2">
                      <div className="text-4xl">📭</div>
                      <p>No subscribers found</p>
                      <p className="text-xs text-gray-400">
                        Try adding a subscriber or check your API connection
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-4xl">🔍</div>
                      <p>No subscribers match your search</p>
                      <button
                        onClick={() => setSearch("")}
                        className="text-blue-600 hover:underline"
                      >
                        Clear search
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              filtered.map((item, index) => (
                <tr key={item.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3 text-gray-500 text-xs">
                    {index + 1}
                  </td>
                  <td className="p-3 font-medium">
                    {item.fullName || "N/A"}
                  </td>
                  <td className="p-3">
                    <a href={`mailto:${item.email}`} className="text-blue-600 hover:underline">
                      {item.email || "-"}
                    </a>
                  </td>
                  <td className="p-3">
                    {item.phoneNumber || "-"}
                  </td>
                  <td className="p-3">
                    {item.companyName || "-"}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                      {item.source}
                    </span>
                  </td>
                  <td className="p-3">
                    {item.frequency}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      {item.emailSubscribed && (
                        <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">📧</span>
                      )}
                      {item.whatsappSubscribed && (
                        <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs">💬</span>
                      )}
                      {item.smsSubscribed && (
                        <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">📱</span>
                      )}
                      {!item.emailSubscribed && !item.whatsappSubscribed && !item.smsSubscribed && (
                        <span className="text-xs text-gray-400">None</span>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${item.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : item.status === "UNSUBSCRIBED"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/newsletter/subscribers/${item.id}`}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteSubscriber(item.id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div>
          Showing {filtered.length} of {subscribers.length} subscribers
        </div>
        <div>
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
}