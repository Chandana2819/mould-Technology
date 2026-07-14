"use client";

import { useEffect, useState } from "react";

type Analytics = {
  totalSubscribers: number;
  activeSubscribers: number;
  unsubscribed: number;

  totalCampaigns: number;
  draftCampaigns: number;
  scheduledCampaigns: number;
  sentCampaigns: number;

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

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/newsletter/analytics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      const data = await res.json();
      setAnalytics(data);
    } catch {
      // Temporary dummy values
      setAnalytics({
        totalSubscribers: 0,
        activeSubscribers: 0,
        unsubscribed: 0,

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
      <div className="p-10">
        Loading analytics...
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold">
          Newsletter Analytics
        </h1>

        <p className="text-gray-500 mt-2">
          Overview of subscribers and campaigns.
        </p>
      </div>

      {/* Subscribers */}

      <div>

        <h2 className="text-xl font-semibold mb-4">
          Subscribers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">

          <Card
            title="Total Subscribers"
            value={analytics.totalSubscribers}
          />

          <Card
            title="Active"
            value={analytics.activeSubscribers}
          />

          <Card
            title="Unsubscribed"
            value={analytics.unsubscribed}
          />

        </div>

      </div>

      {/* Campaigns */}

      <div>

        <h2 className="text-xl font-semibold mb-4">
          Campaigns
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

          <Card
            title="Total"
            value={analytics.totalCampaigns}
          />

          <Card
            title="Draft"
            value={analytics.draftCampaigns}
          />

          <Card
            title="Scheduled"
            value={analytics.scheduledCampaigns}
          />

          <Card
            title="Sent"
            value={analytics.sentCampaigns}
          />

        </div>

      </div>

      {/* Delivery */}

      <div>

        <h2 className="text-xl font-semibold mb-4">
          Delivery Preferences
        </h2>

        <div className="grid grid-cols-3 gap-5">

          <Card
            title="Email"
            value={analytics.emailSubscribers}
          />

          <Card
            title="WhatsApp"
            value={analytics.whatsappSubscribers}
          />

          <Card
            title="SMS"
            value={analytics.smsSubscribers}
          />

        </div>

      </div>

      {/* Sources */}

      <div>

        <h2 className="text-xl font-semibold mb-4">
          Subscriber Sources
        </h2>

        <div className="grid grid-cols-3 gap-5">

          <Card
            title="Newsletter Form"
            value={analytics.formSubscribers}
          />

          <Card
            title="Company Profile"
            value={analytics.companySubscribers}
          />

          <Card
            title="Manual"
            value={analytics.manualSubscribers}
          />

        </div>

      </div>

    </div>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <div className="text-gray-500 text-sm">
        {title}
      </div>

      <div className="mt-3 text-3xl font-bold">
        {value}
      </div>

    </div>
  );
}