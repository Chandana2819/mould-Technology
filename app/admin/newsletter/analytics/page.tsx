"use client";

import { useEffect, useState } from "react";

type Analytics = {
  totalSubscribers: number;
  activeSubscribers: number;
  inactiveSubscribers: number;  // Changed from 'unsubscribed'
  totalCampaigns: number;
  draftCampaigns: number;
  scheduledCampaigns: number;
  sentCampaigns: number;
  // These will be calculated from subscribers
  emailSubscribers: number;
  whatsappSubscribers: number;
  smsSubscribers: number;
  formSubscribers: number;
  companySubscribers: number;
  manualSubscribers: number;
};

export default function NewsletterAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      setError(null);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first");
        setLoading(false);
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/newsletter/analytics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 401) {
        localStorage.removeItem("token");
        setError("Session expired. Please login again.");
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load analytics");
      }

      // Map backend fields to frontend fields
      setAnalytics({
        totalSubscribers: data.totalSubscribers || 0,
        activeSubscribers: data.activeSubscribers || 0,
        inactiveSubscribers: data.inactiveSubscribers || 0, // Backend uses this name
        totalCampaigns: data.totalCampaigns || 0,
        draftCampaigns: data.draftCampaigns || 0,
        scheduledCampaigns: data.scheduledCampaigns || 0,
        sentCampaigns: data.sentCampaigns || 0,
        // These need to be calculated from subscribers or added to backend
        emailSubscribers: data.emailSubscribers || 0,
        whatsappSubscribers: data.whatsappSubscribers || 0,
        smsSubscribers: data.smsSubscribers || 0,
        formSubscribers: data.formSubscribers || 0,
        companySubscribers: data.companySubscribers || 0,
        manualSubscribers: data.manualSubscribers || 0,
      });
    } catch (err: any) {
      setError(err.message);
      // Fallback to zeros if API fails
      setAnalytics({
        totalSubscribers: 0,
        activeSubscribers: 0,
        inactiveSubscribers: 0,
        totalCampaigns: 0,
        draftCampaigns: 0,
        scheduledCampaigns: 0,
        sentCampaigns: 0,
        emailSubscribers: 0,
        whatsappSubscribers: 0,
        smsSubscribers: 0,
        formSubscribers: 0,
        companySubscribers: 0,
        manualSubscribers: 0,
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Newsletter Analytics</h1>
        <p className="text-gray-500 mt-2">
          Overview of subscribers and campaigns.
        </p>
      </div>

      {/* Subscribers */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Subscribers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
          <Card title="Total Subscribers" value={analytics.totalSubscribers} />
          <Card title="Active" value={analytics.activeSubscribers} />
          <Card title="Inactive" value={analytics.inactiveSubscribers} />
        </div>
      </div>

      {/* Campaigns */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Campaigns</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <Card title="Total" value={analytics.totalCampaigns} />
          <Card title="Draft" value={analytics.draftCampaigns} />
          <Card title="Scheduled" value={analytics.scheduledCampaigns} />
          <Card title="Sent" value={analytics.sentCampaigns} />
        </div>
      </div>

      {/* Delivery Preferences - Optional if backend doesn't provide these */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Delivery Preferences</h2>
        <div className="grid grid-cols-3 gap-5">
          <Card title="Email" value={analytics.emailSubscribers} />
          <Card title="WhatsApp" value={analytics.whatsappSubscribers} />
          <Card title="SMS" value={analytics.smsSubscribers} />
        </div>
      </div>

      {/* Sources - Optional if backend doesn't provide these */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Subscriber Sources</h2>
        <div className="grid grid-cols-3 gap-5">
          <Card title="Newsletter Form" value={analytics.formSubscribers} />
          <Card title="Company Profile" value={analytics.companySubscribers} />
          <Card title="Manual" value={analytics.manualSubscribers} />
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="text-gray-500 text-sm font-medium">{title}</div>
      <div className="mt-3 text-3xl font-bold text-gray-900">{value.toLocaleString()}</div>
    </div>
  );
}