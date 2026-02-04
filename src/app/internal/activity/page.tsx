"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

const activityTimeline = [
  {
    id: 1,
    title: "Escalation resolved",
    owner: "Support",
    detail: "Resolved account lockout for ACME",
    time: "09:20",
  },
  {
    id: 2,
    title: "Task reassigned",
    owner: "Delivery",
    detail: "Shifted rollout prep to Ops team",
    time: "08:10",
  },
  {
    id: 3,
    title: "Reminder posted",
    owner: "People",
    detail: "Annual compliance signoff due Friday",
    time: "Yesterday",
  },
  {
    id: 4,
    title: "Project milestone",
    owner: "Product",
    detail: "Beacon beta completed",
    time: "Yesterday",
  },
];

export default function ActivityPage() {
  const { data: session, status } = useSession();
  const role = session?.user?.role || "EMPLOYEE";
  const loading = status === "loading";
  const isAdmin = role === "ADMIN";

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-64 animate-pulse rounded-md bg-slate-200" />
        <div className="h-48 animate-pulse rounded-xl border border-slate-200 bg-white" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="space-y-4 rounded-xl border border-amber-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Activity (Admin only)</h1>
        <p className="text-sm text-slate-600">
          This feed contains sensitive workforce information. Please reach out to an administrator if
          you believe you should have access.
        </p>
        <div className="flex justify-center">
          <Link
            href="/internal/dashboard"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Return to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-slate-500">Monitoring</p>
        <h1 className="text-3xl font-semibold text-slate-900">Employee activity</h1>
        <p className="text-sm text-slate-600">
          AUDIT LOG PLACEHOLDER — connect to activity stream once telemetry is available.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <button
          type="button"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Filter by role
        </button>
        <button
          type="button"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Export log
        </button>
        <span className="text-xs text-slate-500">Actions coming soon</span>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Timeline</h2>
        <div className="mt-4 space-y-4">
          {activityTimeline.map((item, index) => (
            <div key={item.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="h-3 w-3 rounded-full bg-slate-900" />
                {index !== activityTimeline.length - 1 ? (
                  <div className="h-full w-px flex-1 bg-slate-200" />
                ) : null}
              </div>
              <div className="flex-1 rounded-lg border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-900">{item.title}</p>
                  <span className="text-xs text-slate-500">{item.time}</span>
                </div>
                <p className="text-sm text-slate-600">{item.detail}</p>
                <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">{item.owner}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
