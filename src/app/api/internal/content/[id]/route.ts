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

        const { id } = await context.params;
        const body = await request.json();
        const { title, subtitle, description, ctaText, ctaLink, order, isPublished } = body;

        // Check if content block exists
        const existing = await prisma.contentBlock.findUnique({
            where: { id },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Content block not found" },
                { status: 404 }
            );
        }

        // Update content block (key is immutable)
        const contentBlock = await prisma.contentBlock.update({
            where: { id },
            data: {
                ...(title !== undefined && { title }),
                ...(subtitle !== undefined && { subtitle: subtitle || null }),
                ...(description !== undefined && { description: description || null }),
                ...(ctaText !== undefined && { ctaText: ctaText || null }),
                ...(ctaLink !== undefined && { ctaLink: ctaLink || null }),
                ...(order !== undefined && { order }),
                ...(isPublished !== undefined && { isPublished }),
            },
        });

        return NextResponse.json({ contentBlock }, { status: 200 });
    } catch (error) {
        console.error("Error updating content block:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
