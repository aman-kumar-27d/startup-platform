import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

interface Params {
    id: string;
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<Params> }
) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;

        // Verify client exists and user has access
        const client = await prisma.client.findUnique({
            where: { id },
            select: { id: true, ownerId: true },
        });

        if (!client) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        // Employees can only view history for their assigned clients
        if (
            session.user.role === "EMPLOYEE" &&
            client.ownerId !== session.user.id
        ) {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            );
        }

        const history = await prisma.clientHistory.findMany({
            where: { clientId: id },
            include: {
                actor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(history);
    } catch (error) {
        console.error("Error fetching client history:", error);
        return NextResponse.json(
            { error: "Failed to fetch history" },
            { status: 500 }
        );
    }
}
