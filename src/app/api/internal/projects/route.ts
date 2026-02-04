import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import type { Role } from "@prisma/client";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

// POST /api/internal/projects - Create a new project (ADMIN only)
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userRole = session.user.role as Role;
        if (userRole !== "ADMIN") {
            return NextResponse.json(
                { error: "Forbidden - Only admins can create projects" },
                { status: 403 }
            );
        }

        const body = await req.json();
        const { name, description, status, isPublic, assignedUserIds } = body;

        // Validation
        if (!name || typeof name !== "string" || name.trim().length === 0) {
            return NextResponse.json(
                { error: "Project name is required" },
                { status: 400 }
            );
        }

        if (!["PLANNED", "ACTIVE", "COMPLETED", "ON_HOLD"].includes(status)) {
            return NextResponse.json(
                { error: "Invalid status" },
                { status: 400 }
            );
        }

        if (typeof isPublic !== "boolean") {
            return NextResponse.json(
                { error: "isPublic must be a boolean" },
                { status: 400 }
            );
        }

        if (assignedUserIds && !Array.isArray(assignedUserIds)) {
            return NextResponse.json(
                { error: "assignedUserIds must be an array" },
                { status: 400 }
            );
        }

        // Verify all assigned users exist and are EMPLOYEE role
        if (assignedUserIds && assignedUserIds.length > 0) {
            const users = await prisma.user.findMany({
                where: { id: { in: assignedUserIds } },
            });

            if (users.length !== assignedUserIds.length) {
                return NextResponse.json(
                    { error: "One or more users do not exist" },
                    { status: 400 }
                );
            }

            // Note: We allow assigning to any user, including admins if needed
            // This can be restricted to EMPLOYEE role if desired
        }

        const project = await prisma.project.create({
            data: {
                name: name.trim(),
                description: description?.trim() || null,
                status,
                isPublic,
                createdById: session.user.id,
                assignedUsers: assignedUserIds && assignedUserIds.length > 0
                    ? {
                        connect: assignedUserIds.map((id: string) => ({ id })),
                    }
                    : undefined,
            },
            include: {
                createdBy: {
                    select: { id: true, name: true, email: true },
                },
                assignedUsers: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// GET /api/internal/projects - List projects based on role
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userRole = session.user.role as Role;

        if (userRole === "ADMIN") {
            // Admins see all projects
            const projects = await prisma.project.findMany({
                orderBy: { createdAt: "desc" },
                include: {
                    createdBy: {
                        select: { id: true, name: true, email: true },
                    },
                    assignedUsers: {
                        select: { id: true, name: true, email: true },
                    },
                },
            });

            return NextResponse.json(projects);
        } else if (userRole === "EMPLOYEE") {
            // Employees see only projects assigned to them
            const projects = await prisma.project.findMany({
                where: {
                    assignedUsers: {
                        some: {
                            id: session.user.id,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
                include: {
                    createdBy: {
                        select: { id: true, name: true, email: true },
                    },
                    assignedUsers: {
                        select: { id: true, name: true, email: true },
                    },
                },
            });

            return NextResponse.json(projects);
        }

        return NextResponse.json(
            { error: "Invalid role" },
            { status: 403 }
        );
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
