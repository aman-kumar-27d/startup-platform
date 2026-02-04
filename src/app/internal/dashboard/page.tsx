"use client";

import { useSession } from "next-auth/react";

const adminStats = [
  { label: "Total employees", value: "42", helper: "Last sync 2h ago" },
  { label: "Active tasks", value: "18", helper: "8 due this week" },
  { label: "Overdue tasks", value: "5", helper: "Follow up today" },
  { label: "Active projects", value: "9", helper: "Pipeline healthy" },
];

const adminActivity = [
  { id: 1, person: "Maya Patel", action: "Updated Project Beacon", time: "5m ago" },
  { id: 2, person: "Luis Gomez", action: "Closed task QA handoff", time: "22m ago" },
  { id: 3, person: "Chen Li", action: "Commented on Ops board", time: "1h ago" },
];

const attentionTasks = [
  { id: "T-204", title: "Audit onboarding checklist", owner: "Ops", priority: "High" },
  { id: "T-198", title: "Update client training deck", owner: "Success", priority: "Medium" },
  { id: "T-176", title: "Refresh risk matrix", owner: "PMO", priority: "High" },
];

const employeeTasks = [
  { id: "MY-31", title: "Prep sprint demo", status: "In progress", due: "Tomorrow" },
  { id: "MY-28", title: "Review design QA", status: "Blocked", due: "Friday" },
  { id: "MY-22", title: "Document onboarding", status: "Ready", due: "Next week" },
];

const employeeProjects = [
  { id: "PX-14", name: "Project Beacon", stage: "Execution", nextReview: "Thu" },
  { id: "PX-09", name: "Service Atlas", stage: "Discovery", nextReview: "Mon" },
];

const employeeUpdates = [
  { id: 1, detail: "Ops checklist template refreshed", time: "30m ago" },
  { id: 2, detail: "Tasks board reorganized by priority", time: "2h ago" },
  { id: 3, detail: "Reminder: quarterly retro next Tuesday", time: "Yesterday" },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const role = session?.user?.role || "EMPLOYEE";
  const loading = status === "loading";
  const isAdmin = role === "ADMIN";

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-slate-500">Overview</p>
        <h1 className="text-3xl font-semibold text-slate-900">Internal Dashboard</h1>
        <p className="text-sm text-slate-600">
          {isAdmin
            ? "Monitor workforce health, flag blockers, and plan upcoming work."
            : "Stay in sync on assigned work, timelines, and latest updates."}
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="h-32 animate-pulse rounded-xl border border-slate-200 bg-white"
            />
          ))}
        </div>
      ) : isAdmin ? (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {adminStats.map((stat) => (
              <article
                key={stat.label}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.helper}</p>
              </article>
            ))}
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  Recent employee activity
                </h2>
                <span className="text-xs text-slate-500">Live feed placeholder</span>
              </div>
              <ul className="mt-4 space-y-4">
                {adminActivity.map((entry) => (
                  <li key={entry.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{entry.person}</p>
                      <p className="text-sm text-slate-600">{entry.action}</p>
                    </div>
                    <span className="text-xs text-slate-500">{entry.time}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  Tasks requiring attention
                </h2>
                <span className="text-xs text-rose-500">Placeholder alerts</span>
              </div>
              <ul className="mt-4 space-y-3">
                {attentionTasks.map((task) => (
                  <li
                    key={task.id}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-slate-900">{task.title}</p>
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {task.id}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                      <span>Owner: {task.owner}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          task.priority === "High"
                            ? "bg-rose-100 text-rose-600"
                            : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          </section>
        </>
      ) : (
        <>
          <section className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">My tasks</h2>
                <span className="text-xs text-slate-500">Synced from tasks API</span>
              </div>
              <ul className="mt-4 space-y-3">
                {employeeTasks.map((task) => (
                  <li key={task.id} className="rounded-lg border border-slate-200 p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-slate-900">{task.title}</p>
                      <span className="text-xs text-slate-500">{task.due}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-slate-600">ID: {task.id}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          task.status === "Blocked"
                            ? "bg-rose-100 text-rose-600"
                            : task.status === "Ready"
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">My projects</h2>
                <span className="text-xs text-slate-500">Placeholder summary</span>
              </div>
              <div className="mt-4 space-y-4">
                {employeeProjects.map((project) => (
                  <div key={project.id} className="rounded-lg border border-slate-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">{project.name}</p>
                        <p className="text-sm text-slate-600">Stage: {project.stage}</p>
                      </div>
                      <span className="text-xs text-slate-500">Next review: {project.nextReview}</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Recent updates</h2>
              <span className="text-xs text-slate-500">Feed placeholder</span>
            </div>
            <ul className="mt-4 space-y-3">
              {employeeUpdates.map((update) => (
                <li key={update.id} className="flex items-center justify-between">
                  <p className="text-sm text-slate-700">{update.detail}</p>
                  <span className="text-xs text-slate-500">{update.time}</span>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
