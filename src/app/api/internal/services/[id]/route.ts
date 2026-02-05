import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Forbidden: Admin access required" },
                { status: 403 }
            );
        }

        const { id } = await context.params;
        const body = await request.json();
        const { name, description, icon, order, isPublished } = body;

        const existing = await prisma.service.findUnique({
            where: { id },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Service not found" },
                { status: 404 }
            );
        }

        const service = await prisma.service.update({
            where: { id },
            data: {
                ...(name !== undefined && { name }),
                ...(description !== undefined && { description: description || null }),
                ...(icon !== undefined && { icon: icon || null }),
                ...(order !== undefined && { order }),
                ...(isPublished !== undefined && { isPublished }),
            },
        });

        return NextResponse.json({ service }, { status: 200 });
    } catch (error) {
        console.error("Error updating service:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
