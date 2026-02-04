"use client";

import { useSession } from "next-auth/react";

const taskRows = [
  {
    id: "TK-101",
    title: "Finalize onboarding runbook",
    owner: "People Ops",
    status: "In review",
    due: "Feb 6",
  },
  {
    id: "TK-098",
    title: "Coordinate pilot training",
    owner: "Delivery",
    status: "Blocked",
    due: "Feb 8",
  },
  {
    id: "TK-087",
    title: "QA mobile release",
    owner: "Product",
    status: "In progress",
    due: "Feb 5",
  },
  {
    id: "TK-080",
    title: "Refresh pitch assets",
    owner: "Marketing",
    status: "Queued",
    due: "Feb 12",
  },
];

export default function TasksPage() {
  const { data: session, status } = useSession();
  const role = session?.user?.role || "EMPLOYEE";
  const loading = status === "loading";
  const isAdmin = role === "ADMIN";

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-slate-500">Workflows</p>
        <h1 className="text-3xl font-semibold text-slate-900">Tasks</h1>
        <p className="text-sm text-slate-600">
          Coordinate assignments, surface blockers, and keep delivery on schedule.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {isAdmin ? (
          <button
            type="button"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
            disabled={loading}
          >
            Assign task
          </button>
        ) : null}
        {!isAdmin ? (
          <button
            type="button"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
            disabled={loading}
          >
            Mark complete
          </button>
        ) : null}
        <span className="text-xs text-slate-500">UI only • wire to workflows later</span>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Open queue</h2>
            <span className="text-xs text-slate-500">{taskRows.length} records</span>
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {taskRows.map((task) => (
            <div key={task.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
              <div className="w-full flex-1 sm:w-auto">
                <p className="font-medium text-slate-900">{task.title}</p>
                <p className="text-sm text-slate-500">{task.owner}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {task.id}
                </span>
                <span className="text-sm text-slate-500">Due {task.due}</span>
              </div>
              <div className="ms-auto flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    task.status === "Blocked"
                      ? "bg-rose-100 text-rose-600"
                      : task.status === "Queued"
                        ? "bg-slate-100 text-slate-600"
                        : "bg-amber-100 text-amber-600"
                  }`}
                >
                  {task.status}
                </span>
                {!isAdmin ? (
                  <button
                    type="button"
                    className="rounded-md border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Mark complete
                  </button>
                ) : (
                  <button
                    type="button"
                    className="rounded-md border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Reassign
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
