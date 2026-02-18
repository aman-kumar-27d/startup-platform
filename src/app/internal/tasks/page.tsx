"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";

type TaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE";
type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  assignedTo: {
    id: string;
    name: string | null;
    email: string;
  };
  createdBy: {
    id: string;
    name: string | null;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
};

type UserOption = {
  id: string;
  label: string;
};

type User = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  isActive: boolean;
};

type TaskFormState = {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  assignedToId: string;
};

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "TODO", label: "To do" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "OVERDUE", label: "Overdue" },
];

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
];

const initialFormState: TaskFormState = {
  title: "",
  description: "",
  priority: "MEDIUM",
  status: "TODO",
  dueDate: "",
  assignedToId: "",
};

const statusStyles: Record<TaskStatus, string> = {
  TODO: "bg-slate-100 text-slate-700",
  IN_PROGRESS: "bg-amber-100 text-amber-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  OVERDUE: "bg-rose-100 text-rose-700",
};

const priorityStyles: Record<TaskPriority, string> = {
  LOW: "bg-slate-100 text-slate-700",
  MEDIUM: "bg-sky-100 text-sky-700",
  HIGH: "bg-orange-100 text-orange-700",
};

export default function TasksPage() {
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    status: "ALL" as TaskStatus | "ALL",
    assignedToId: "ALL" as string | "ALL",
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState<TaskFormState>(initialFormState);
  const [submittingCreate, setSubmittingCreate] = useState(false);

  const [editForm, setEditForm] = useState<TaskFormState>(initialFormState);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [submittingEdit, setSubmittingEdit] = useState(false);

  const loadingSession = status === "loading";

  const visibleTasks = useMemo(() => tasks, [tasks]);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.status !== "ALL") {
        params.set("status", filters.status);
      }
      if (isAdmin && filters.assignedToId !== "ALL") {
        params.set("assignedToId", filters.assignedToId);
      }

      const query = params.toString();
      const res = await fetch(`/api/internal/tasks${query ? `?${query}` : ""}`);

      if (!res.ok) {
        throw new Error("Failed to load tasks");
      }

      const data = await res.json();
      setTasks(data.tasks ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [filters, isAdmin]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetchTasks();
  }, [status, fetchTasks]);

  useEffect(() => {
    if (!isAdmin || status !== "authenticated") return;
    fetchEmployees();
  }, [isAdmin, status]);

  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/internal/users");
      if (!res.ok) {
        throw new Error("Failed to load employees");
      }
      const data = await res.json();
      const options = (data.users as User[])
        .filter((user) => user.role === "EMPLOYEE" && user.isActive)
        .map((user) => ({
          id: user.id,
          label: user.name ? `${user.name} (${user.email})` : user.email,
        }));
      setEmployees(options);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async () => {
    try {
      setSubmittingCreate(true);
      setError(null);

      type CreateTaskPayload = {
        title: string;
        description: string;
        priority: TaskPriority;
        status: TaskStatus;
        assignedToId: string;
        dueDate?: string;
      };

      const payload: CreateTaskPayload = {
        title: createForm.title.trim(),
        description: createForm.description.trim(),
        priority: createForm.priority,
        status: createForm.status,
        assignedToId: createForm.assignedToId,
      };

      if (createForm.dueDate) {
        payload.dueDate = createForm.dueDate;
      }

      const res = await fetch("/api/internal/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to create task");
      }

      setShowCreateModal(false);
      setCreateForm(initialFormState);
      fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSubmittingCreate(false);
    }
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setEditForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
      assignedToId: task.assignedTo?.id || "",
    });
  };

  const handleEditTask = async () => {
    if (!editingTask) return;

    try {
      setSubmittingEdit(true);
      setError(null);

      type EditTaskPayload = {
        title: string;
        description: string;
        priority: TaskPriority;
        status: TaskStatus;
        assignedToId: string;
        dueDate: string | null;
      };

      const payload: EditTaskPayload = {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        priority: editForm.priority,
        status: editForm.status,
        assignedToId: editForm.assignedToId,
        dueDate: editForm.dueDate ? editForm.dueDate : null,
      };

      const res = await fetch(`/api/internal/tasks/${editingTask.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to update task");
      }

      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSubmittingEdit(false);
    }
  };

  const handleStatusChange = async (taskId: string, statusValue: TaskStatus) => {
    try {
      setError(null);
      const res = await fetch(`/api/internal/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: statusValue }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to update status");
      }

      fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const formatDueDate = (value: string | null) => {
    if (!value) return "No due date";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "No due date";
    return date.toLocaleDateString();
  };

  if (loadingSession) {
    return <div className="p-6 text-sm text-slate-600">Loading session...</div>;
  }

  if (!session?.user) {
    return <div className="p-6 text-sm text-rose-600">You must be signed in to view tasks.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-slate-500">Workflows</p>
        <h1 className="text-3xl font-semibold text-slate-900">Tasks</h1>
        <p className="text-sm text-slate-600">
          Assign work, track status, and keep delivery on schedule.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {isAdmin ? (
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            Create task
          </button>
        ) : null}
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <span className="font-medium text-slate-700">Filters:</span>
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value as TaskStatus | "ALL" }))
            }
            className="rounded border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 shadow-sm focus:outline-none"
          >
            <option value="ALL">All statuses</option>
            {STATUS_OPTIONS.map((statusOption) => (
              <option key={statusOption.value} value={statusOption.value}>
                {statusOption.label}
              </option>
            ))}
          </select>
          {isAdmin ? (
            <select
              value={filters.assignedToId}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, assignedToId: e.target.value }))
              }
              className="rounded border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 shadow-sm focus:outline-none"
            >
              <option value="ALL">All employees</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.label}
                </option>
              ))}
            </select>
          ) : null}
        </div>
      </div>

      {error ? (
        <div className="rounded-md border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Loading tasks...
        </div>
      ) : visibleTasks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-sm text-slate-600">
          No tasks found.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-12 border-b border-slate-100 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
            <div className="col-span-4">Task</div>
            <div className="col-span-2">Assignee</div>
            <div className="col-span-2">Priority</div>
            <div className="col-span-2">Due</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
          <div className="divide-y divide-slate-100">
            {visibleTasks.map((task) => (
              <div key={task.id} className="grid grid-cols-12 items-center px-4 py-4">
                <div className="col-span-4 space-y-1 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">{task.title}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusStyles[task.status]}`}>
                      {task.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{task.description}</p>
                  <p className="text-xs text-slate-500">
                    Created by {task.createdBy.name || task.createdBy.email}
                  </p>
                </div>
                <div className="col-span-2 text-sm text-slate-800">
                  {task.assignedTo?.name || task.assignedTo?.email || "Unassigned"}
                </div>
                <div className="col-span-2 text-sm text-slate-800">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${priorityStyles[task.priority]}`}>
                    {task.priority}
                  </span>
                </div>
                <div className="col-span-2 text-sm text-slate-800">
                  {formatDueDate(task.dueDate)}
                </div>
                <div className="col-span-2 text-right">
                  {isAdmin ? (
                    <button
                      type="button"
                      onClick={() => openEditModal(task)}
                      className="rounded border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Edit
                    </button>
                  ) : (
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                      className="rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:outline-none"
                    >
                      {STATUS_OPTIONS.map((statusOption) => (
                        <option key={statusOption.value} value={statusOption.value}>
                          {statusOption.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showCreateModal ? (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Create</p>
                <h2 className="text-xl font-semibold text-slate-900">New task</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <label className="col-span-2 space-y-1 text-sm text-slate-700">
                <span>Title</span>
                <input
                  value={createForm.title}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full rounded border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="What needs to be done?"
                />
              </label>
              <label className="col-span-2 space-y-1 text-sm text-slate-700">
                <span>Description</span>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full rounded border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                  rows={3}
                  placeholder="Add context, links, acceptance criteria..."
                />
              </label>
              <label className="space-y-1 text-sm text-slate-700">
                <span>Status</span>
                <select
                  value={createForm.status}
                  onChange={(e) =>
                    setCreateForm((prev) => ({ ...prev, status: e.target.value as TaskStatus }))
                  }
                  className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-sm text-slate-700">
                <span>Priority</span>
                <select
                  value={createForm.priority}
                  onChange={(e) =>
                    setCreateForm((prev) => ({ ...prev, priority: e.target.value as TaskPriority }))
                  }
                  className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none"
                >
                  {PRIORITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-sm text-slate-700">
                <span>Due date</span>
                <input
                  type="date"
                  value={createForm.dueDate}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full rounded border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </label>
              <label className="space-y-1 text-sm text-slate-700">
                <span>Assign to</span>
                <select
                  value={createForm.assignedToId}
                  onChange={(e) =>
                    setCreateForm((prev) => ({ ...prev, assignedToId: e.target.value }))
                  }
                  className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none"
                >
                  <option value="">Select employee</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="rounded border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateTask}
                disabled={submittingCreate}
                className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submittingCreate ? "Saving..." : "Create task"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {editingTask ? (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Edit</p>
                <h2 className="text-xl font-semibold text-slate-900">Update task</h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingTask(null)}
                className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <label className="col-span-2 space-y-1 text-sm text-slate-700">
                <span>Title</span>
                <input
                  value={editForm.title}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full rounded border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </label>
              <label className="col-span-2 space-y-1 text-sm text-slate-700">
                <span>Description</span>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full rounded border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                  rows={3}
                />
              </label>
              <label className="space-y-1 text-sm text-slate-700">
                <span>Status</span>
                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, status: e.target.value as TaskStatus }))
                  }
                  className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-sm text-slate-700">
                <span>Priority</span>
                <select
                  value={editForm.priority}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, priority: e.target.value as TaskPriority }))
                  }
                  className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none"
                >
                  {PRIORITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-sm text-slate-700">
                <span>Due date</span>
                <input
                  type="date"
                  value={editForm.dueDate}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full rounded border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </label>
              <label className="space-y-1 text-sm text-slate-700">
                <span>Assign to</span>
                <select
                  value={editForm.assignedToId}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, assignedToId: e.target.value }))
                  }
                  className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none"
                >
                  <option value="">Select employee</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingTask(null)}
                className="rounded border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEditTask}
                disabled={submittingEdit}
                className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submittingEdit ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
