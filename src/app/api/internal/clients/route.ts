import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { logClientHistory } from "@/lib/client-history";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
        return NextResponse.json(
            { error: "Only admins can create clients" },
            { status: 403 }
        );
    }

    try {
        const body = await req.json();
        const {
            name,
            companyName,
            email,
            phone,
            website,
            lifecycleStatus = "LEAD",
            weightage = "REGULAR",
            relationshipLevel = "WEAK",
            leadScore,
            expectedValue,
            source = "Other",
            notes,
            ownerId,
        } = body;

        // Validation
        if (!name || !companyName || !email) {
            return NextResponse.json(
                { error: "Missing required fields: name, companyName, email" },
                { status: 400 }
            );
        }

        if (!ownerId) {
            return NextResponse.json(
                { error: "ownerId is required" },
                { status: 400 }
            );
        }

        // Verify owner exists
        const owner = await prisma.user.findUnique({
            where: { id: ownerId },
        });

        if (!owner) {
            return NextResponse.json(
                { error: "Owner user not found" },
                { status: 404 }
            );
        }

        // Check if email already exists
        const existingClient = await prisma.client.findFirst({
            where: { email },
        });

        if (existingClient) {
            return NextResponse.json(
                { error: "Client with this email already exists" },
                { status: 409 }
            );
        }

        // Create client
        const client = await prisma.client.create({
            data: {
                name,
                companyName,
                email,
                phone: phone || null,
                website: website || null,
                lifecycleStatus,
                weightage,
                relationshipLevel,
                leadScore: leadScore || null,
                expectedValue: expectedValue || null,
                source,
                notes: notes || null,
                ownerId,
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        // Log history
        await logClientHistory(
            client.id,
            session.user.id,
            "CREATED",
            `Client created with lifecycle status: ${lifecycleStatus}, assigned to ${owner.name || owner.email}`
        );

        return NextResponse.json(client, { status: 201 });
    } catch (error) {
        console.error("Error creating client:", error);
        return NextResponse.json(
            { error: "Failed to create client" },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const url = new URL(req.url);
        const lifecycleStatus = url.searchParams.get("lifecycleStatus");
        const weightage = url.searchParams.get("weightage");
        const ownerId = url.searchParams.get("ownerId");
        const isArchived = url.searchParams.get("isArchived") === "true";

        // Build filter conditions
        const where: Record<string, unknown> = {
            isArchived,
        };

        // Role-based access control
        if (session.user.role === "EMPLOYEE") {
            where.ownerId = session.user.id;
        } else if (session.user.role === "ADMIN") {
            // Admins can filter by specific owner
            if (ownerId) {
                where.ownerId = ownerId;
            }
        }

        // Apply other filters
        if (lifecycleStatus) {
            where.lifecycleStatus = lifecycleStatus;
        }
        if (weightage) {
            where.weightage = weightage;
        }

        const clients = await prisma.client.findMany({
            where,
            include: {
                owner: {
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

        return NextResponse.json(clients);
    } catch (error) {
        console.error("Error fetching clients:", error);
        return NextResponse.json(
            { error: "Failed to fetch clients" },
            { status: 500 }
        );
    }
}
