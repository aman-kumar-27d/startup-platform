import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { TaskPriority, TaskStatus } from "@prisma/client";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

const TASK_STATUSES: TaskStatus[] = [
  "TODO",
  "IN_PROGRESS",
  "COMPLETED",
  "OVERDUE",
];

const TASK_PRIORITIES: TaskPriority[] = ["LOW", "MEDIUM", "HIGH"];

type RouteParams = {
  params: Promise<{ id: string }>;
};

type UpdateTaskRequest = {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
  assignedToId?: string;
};

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingTask = await prisma.task.findUnique({
      where: { id },
      include: {
        assignedTo: { select: { id: true, role: true, isActive: true } },
        createdBy: { select: { id: true } },
      },
    });

    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const isAdmin = session.user.role === "ADMIN";
    const isAssignee = existingTask.assignedToId === session.user.id;

    if (!isAdmin && !isAssignee) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let body: UpdateTaskRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { title, description, status, priority, dueDate, assignedToId } = body;

    if (!isAdmin) {
      const keys = Object.keys(body ?? {});
      const onlyStatus = keys.length === 1 && keys[0] === "status";
      if (!onlyStatus) {
        return NextResponse.json(
          { error: "Employees may only update status" },
          { status: 403 }
        );
      }
    }

    const updates: Record<string, unknown> = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return NextResponse.json({ error: "Invalid title" }, { status: 400 });
      }
      updates.title = title.trim();
    }

    if (description !== undefined) {
      if (typeof description !== "string" || !description.trim()) {
        return NextResponse.json({ error: "Invalid description" }, { status: 400 });
      }
      updates.description = description.trim();
    }

    if (status !== undefined) {
      if (!TASK_STATUSES.includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      if (!isAdmin && !isAssignee) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      updates.status = status;
    }

    if (priority !== undefined) {
      if (!TASK_PRIORITIES.includes(priority)) {
        return NextResponse.json({ error: "Invalid priority" }, { status: 400 });
      }
      updates.priority = priority;
    }

    if (dueDate !== undefined) {
      if (dueDate === null) {
        updates.dueDate = null;
      } else {
        const parsed = new Date(dueDate);
        if (Number.isNaN(parsed.getTime())) {
          return NextResponse.json({ error: "Invalid dueDate" }, { status: 400 });
        }
        updates.dueDate = parsed;
      }
    }

    if (assignedToId !== undefined) {
      if (!isAdmin) {
        return NextResponse.json(
          { error: "Only admins can reassign tasks" },
          { status: 403 }
        );
      }

      if (!assignedToId || typeof assignedToId !== "string") {
        return NextResponse.json({ error: "Invalid assignee" }, { status: 400 });
      }

      const assignee = await prisma.user.findUnique({
        where: { id: assignedToId },
        select: { id: true, role: true, isActive: true },
      });

      if (!assignee) {
        return NextResponse.json({ error: "Assignee not found" }, { status: 404 });
      }

      if (assignee.role !== "EMPLOYEE" || !assignee.isActive) {
        return NextResponse.json({ error: "Assignee must be an active employee" }, { status: 400 });
      }

      updates.assignedToId = assignedToId;
      // Event hook for TASK_ASSIGNED can be inserted here later.
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: updates,
      include: {
        assignedTo: { select: { id: true, email: true, name: true } },
        createdBy: { select: { id: true, email: true, name: true } },
      },
    });

    // Event hook for TASK_STATUS_CHANGED can be inserted here later.
    return NextResponse.json({ task: updatedTask }, { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
