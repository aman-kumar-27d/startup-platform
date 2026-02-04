import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        // Check authentication
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check admin role
        if (session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Forbidden: Admin access required" },
                { status: 403 }
            );
        }

        // Fetch assignable users (active ADMIN and EMPLOYEE only)
        const users = await prisma.user.findMany({
            where: {
                isActive: true,
                role: {
                    in: ["ADMIN", "EMPLOYEE"],
                },
            },
            select: {
                id: true,
                email: true,
                role: true,
            },
            orderBy: { email: "asc" },
        });

        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error("Error fetching assignable users:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
