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

type CreateTaskRequest = {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
  assignedToId?: string;
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    let body: CreateTaskRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { title, description, assignedToId } = body;
    const status = body.status ?? "TODO";
    const priority = body.priority ?? "MEDIUM";
    const dueDate = body.dueDate;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!description || typeof description !== "string" || !description.trim()) {
      return NextResponse.json({ error: "Description is required" }, { status: 400 });
    }

    if (!assignedToId || typeof assignedToId !== "string") {
      return NextResponse.json({ error: "assignedToId is required" }, { status: 400 });
    }

    if (!TASK_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    if (!TASK_PRIORITIES.includes(priority)) {
      return NextResponse.json({ error: "Invalid priority" }, { status: 400 });
    }

    let parsedDueDate: Date | null = null;
    if (dueDate !== undefined && dueDate !== null) {
      const date = new Date(dueDate);
      if (Number.isNaN(date.getTime())) {
        return NextResponse.json({ error: "Invalid dueDate" }, { status: 400 });
      }
      parsedDueDate = date;
    }

    const assignee = await prisma.user.findUnique({
      where: { id: assignedToId },
      select: { id: true, role: true, isActive: true, email: true, name: true },
    });

    if (!assignee) {
      return NextResponse.json({ error: "Assignee not found" }, { status: 404 });
    }

    if (assignee.role !== "EMPLOYEE" || !assignee.isActive) {
      return NextResponse.json({ error: "Assignee must be an active employee" }, { status: 400 });
    }

    const newTask = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        dueDate: parsedDueDate,
        assignedToId,
        createdById: session.user.id,
      },
      include: {
        assignedTo: { select: { id: true, email: true, name: true } },
        createdBy: { select: { id: true, email: true, name: true } },
      },
    });

    // Event hook can be added here later for TASK_CREATED / TASK_ASSIGNED
    return NextResponse.json({ task: newTask }, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

type TaskFilters = {
  status?: TaskStatus;
  assignedToId?: string;
};

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const status = url.searchParams.get("status") as TaskStatus | null;
    const assignedToId = url.searchParams.get("assignedToId");

    const filters: TaskFilters = {};

    if (status) {
      if (!TASK_STATUSES.includes(status)) {
        return NextResponse.json({ error: "Invalid status filter" }, { status: 400 });
      }
      filters.status = status;
    }

    if (session.user.role === "ADMIN") {
      if (assignedToId) {
        filters.assignedToId = assignedToId;
      }
    } else {
      filters.assignedToId = session.user.id;
    }

    const tasks = await prisma.task.findMany({
      where: filters,
      orderBy: { createdAt: "desc" },
      include: {
        assignedTo: { select: { id: true, email: true, name: true } },
        createdBy: { select: { id: true, email: true, name: true } },
      },
    });

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
