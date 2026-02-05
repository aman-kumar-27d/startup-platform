import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const keys = searchParams.get("keys")?.split(",").filter(Boolean);

        // Fetch published content blocks
        const contentBlocks = await prisma.contentBlock.findMany({
            where: {
                isPublished: true,
                ...(keys && keys.length > 0 && { key: { in: keys } }),
            },
            orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        });

        return NextResponse.json({ contentBlocks }, { status: 200 });
    } catch (error) {
        console.error("Error fetching content blocks:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
