"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

type Dashboard = {
  totalSubscribers: number
  activeSubscribers: number
  inactiveSubscribers: number

  totalCampaigns: number
  draftCampaigns: number
  scheduledCampaigns: number
  sentCampaigns: number
}

export default function NewsletterDashboard() {
  const [stats, setStats] = useState<Dashboard>({
    totalSubscribers: 0,
    activeSubscribers: 0,
    inactiveSubscribers: 0,

    totalCampaigns: 0,
    draftCampaigns: 0,
    scheduledCampaigns: 0,
    sentCampaigns: 0,
  })

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    try {
      const token = localStorage.getItem("token")

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/newsletter/analytics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!res.ok) return

      const data = await res.json()

      setStats(data)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold">
          Newsletter Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Manage subscribers, campaigns and templates.
        </p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

        <Card
          title="Subscribers"
          value={stats.totalSubscribers}
        />

        <Card
          title="Active"
          value={stats.activeSubscribers}
        />

        <Card
          title="Campaigns"
          value={stats.totalCampaigns}
        />

        <Card
          title="Sent"
          value={stats.sentCampaigns}
        />

      </div>

      <div className="grid md:grid-cols-2 gap-6">

        <QuickLink
          title="Subscribers"
          description="View all newsletter subscribers."
          href="/admin/newsletter/subscribers"
        />

        <QuickLink
          title="Campaigns"
          description="Create and manage campaigns."
          href="/admin/newsletter/campaigns"
        />

        <QuickLink
          title="Templates"
          description="Manage email templates."
          href="/admin/newsletter/templates"
        />

        <QuickLink
          title="Analytics"
          description="Delivery statistics."
          href="/admin/newsletter/analytics"
        />

      </div>

    </div>
  )
}

function Card({
  title,
  value,
}: {
  title: string
  value: number
}) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <h2 className="mt-2 text-3xl font-bold">
        {value}
      </h2>
    </div>
  )
}

function QuickLink({
  title,
  description,
  href,
}: {
  title: string
  description: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border bg-white p-6 hover:border-blue-600 transition"
    >
      <h2 className="font-semibold text-lg">
        {title}
      </h2>

      <p className="text-gray-500 mt-2">
        {description}
      </p>
    </Link>
  )
}