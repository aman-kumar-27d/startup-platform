import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import type { Role } from "@prisma/client";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

// PATCH /api/internal/projects/:id - Update a project (ADMIN only)
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: projectId } = await params;
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
                { error: "Forbidden - Only admins can update projects" },
                { status: 403 }
            );
        }

        // Verify project exists
        const existingProject = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!existingProject) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            );
        }

        const body = await req.json();
        const { name, description, status, isPublic, assignedUserIds } = body;

        // Validation - only validate fields that are being updated
        if (name !== undefined) {
            if (typeof name !== "string" || name.trim().length === 0) {
                return NextResponse.json(
                    { error: "Project name must be a non-empty string" },
                    { status: 400 }
                );
            }
        }

        if (status !== undefined) {
            if (!["PLANNED", "ACTIVE", "COMPLETED", "ON_HOLD"].includes(status)) {
                return NextResponse.json(
                    { error: "Invalid status" },
                    { status: 400 }
                );
            }
        }

        if (isPublic !== undefined) {
            if (typeof isPublic !== "boolean") {
                return NextResponse.json(
                    { error: "isPublic must be a boolean" },
                    { status: 400 }
                );
            }
        }

        if (assignedUserIds !== undefined) {
            if (!Array.isArray(assignedUserIds)) {
                return NextResponse.json(
                    { error: "assignedUserIds must be an array" },
                    { status: 400 }
                );
            }

            // Verify all assigned users exist
            if (assignedUserIds.length > 0) {
                const users = await prisma.user.findMany({
                    where: { id: { in: assignedUserIds } },
                });

                if (users.length !== assignedUserIds.length) {
                    return NextResponse.json(
                        { error: "One or more users do not exist" },
                        { status: 400 }
                    );
                }
            }
        }

        // Build update data
        const updateData: any = {};
        if (name !== undefined) updateData.name = name.trim();
        if (description !== undefined) updateData.description = description?.trim() || null;
        if (status !== undefined) updateData.status = status;
        if (isPublic !== undefined) updateData.isPublic = isPublic;

        if (assignedUserIds !== undefined) {
            updateData.assignedUsers = {
                set: assignedUserIds.map((id: string) => ({ id })),
            };
        }

        const project = await prisma.project.update({
            where: { id: projectId },
            data: updateData,
            include: {
                createdBy: {
                    select: { id: true, name: true, email: true },
                },
                assignedUsers: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        return NextResponse.json(project);
    } catch (error) {
        console.error("Error updating project:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
