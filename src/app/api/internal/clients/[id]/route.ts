import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { logClientHistory } from "@/lib/client-history";

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

        const client = await prisma.client.findUnique({
            where: { id },
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

        if (!client) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        if (
            session.user.role === "EMPLOYEE" &&
            client.ownerId !== session.user.id
        ) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json(client);
    } catch (error) {
        console.error("Error fetching client:", error);
        return NextResponse.json(
            { error: "Failed to fetch client" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<Params> }
) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await req.json();

        // Fetch existing client
        const client = await prisma.client.findUnique({
            where: { id },
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

        if (!client) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        // Check permissions based on role
        if (session.user.role === "EMPLOYEE") {
            // Employees can only update notes and only if they own the client
            if (client.ownerId !== session.user.id) {
                return NextResponse.json(
                    { error: "You can only update your assigned clients" },
                    { status: 403 }
                );
            }

            // Employees can only update notes
            const allowedFields = ["notes"];
            const requestedFields = Object.keys(body);
            const hasDisallowedFields = requestedFields.some(
                (field) => !allowedFields.includes(field)
            );

            if (hasDisallowedFields) {
                return NextResponse.json(
                    {
                        error: "Employees can only update notes",
                    },
                    { status: 403 }
                );
            }
        } else if (session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Insufficient permissions" },
                { status: 403 }
            );
        }

        // Build update data
        const updateData: Record<string, unknown> = {};
        const changes: string[] = [];

        // Handle field updates with validation
        if (session.user.role === "ADMIN") {
            if (body.lifecycleStatus !== undefined) {
                if (client.lifecycleStatus !== body.lifecycleStatus) {
                    updateData.lifecycleStatus = body.lifecycleStatus;
                    changes.push(
                        `Status changed from ${client.lifecycleStatus} to ${body.lifecycleStatus}`
                    );
                }
            }

            if (body.weightage !== undefined) {
                if (client.weightage !== body.weightage) {
                    updateData.weightage = body.weightage;
                    changes.push(`Weightage changed from ${client.weightage} to ${body.weightage}`);
                }
            }

            if (body.isHighRisk !== undefined) {
                if (client.isHighRisk !== body.isHighRisk) {
                    updateData.isHighRisk = body.isHighRisk;
                    changes.push(
                        `High risk status changed to ${body.isHighRisk}`
                    );
                }
            }

            if (body.ownerId !== undefined) {
                if (client.ownerId !== body.ownerId) {
                    // Verify new owner exists
                    const newOwner = await prisma.user.findUnique({
                        where: { id: body.ownerId },
                    });
                    if (!newOwner) {
                        return NextResponse.json(
                            { error: "New owner not found" },
                            { status: 404 }
                        );
                    }
                    updateData.ownerId = body.ownerId;
                    changes.push(
                        `Owner changed from ${client.owner.name || client.owner.email} to ${newOwner.name || newOwner.email}`
                    );
                }
            }

            if (body.relationshipLevel !== undefined) {
                if (client.relationshipLevel !== body.relationshipLevel) {
                    updateData.relationshipLevel = body.relationshipLevel;
                    changes.push(
                        `Relationship level changed to ${body.relationshipLevel}`
                    );
                }
            }

            if (body.leadScore !== undefined) {
                if (client.leadScore !== body.leadScore) {
                    updateData.leadScore = body.leadScore;
                    changes.push(`Lead score changed to ${body.leadScore}`);
                }
            }

            if (body.expectedValue !== undefined) {
                if (client.expectedValue !== body.expectedValue) {
                    updateData.expectedValue = body.expectedValue;
                    changes.push(`Expected value changed to ${body.expectedValue}`);
                }
            }
        }

        // Both admin and employee can update notes
        if (body.notes !== undefined) {
            if (client.notes !== body.notes) {
                updateData.notes = body.notes;
                if (session.user.role === "ADMIN") {
                    changes.push(`Notes updated`);
                }
            }
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { error: "No valid fields to update" },
                { status: 400 }
            );
        }

        // Update client
        const updatedClient = await prisma.client.update({
            where: { id },
            data: updateData,
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

        // Log important changes (ADMIN only)
        if (session.user.role === "ADMIN" && changes.length > 0) {
            await logClientHistory(
                id,
                session.user.id,
                "NOTES_UPDATED", // Generic type for mixed changes
                changes.join("; ")
            );
        } else if (session.user.role === "EMPLOYEE" && "notes" in updateData) {
            await logClientHistory(
                id,
                session.user.id,
                "NOTES_UPDATED",
                "Notes updated by assigned employee"
            );
        }

        return NextResponse.json(updatedClient);
    } catch (error) {
        console.error("Error updating client:", error);
        return NextResponse.json(
            { error: "Failed to update client" },
            { status: 500 }
        );
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<Params> }
) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
        return NextResponse.json(
            { error: "Only admins can archive clients" },
            { status: 403 }
        );
    }

    try {
        const { id } = await params;
        const body = await req.json();
        const { archive, unarchive } = body;

        const client = await prisma.client.findUnique({
            where: { id },
        });

        if (!client) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        if (archive === true) {
            if (client.isArchived) {
                return NextResponse.json(
                    { error: "Client is already archived" },
                    { status: 400 }
                );
            }

            // Archive client
            const archivedClient = await prisma.client.update({
                where: { id },
                data: { isArchived: true },
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
                id,
                session.user.id,
                "ARCHIVED",
                "Client archived"
            );

            return NextResponse.json(archivedClient);
        } else if (unarchive === true) {
            if (!client.isArchived) {
                return NextResponse.json(
                    { error: "Client is not archived" },
                    { status: 400 }
                );
            }

            // Unarchive client
            const unarchivedClient = await prisma.client.update({
                where: { id },
                data: { isArchived: false },
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
                id,
                session.user.id,
                "ARCHIVED",
                "Client unarchived"
            );

            return NextResponse.json(unarchivedClient);
        } else {
            return NextResponse.json(
                { error: "Invalid request - specify either archive or unarchive" },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Error archiving/unarchiving client:", error);
        return NextResponse.json(
            { error: "Failed to archive/unarchive client" },
            { status: 500 }
        );
    }
}
