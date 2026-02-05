import { PageKey } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * DELETE /api/internal/seo/[pageKey]
 * Delete a PageSEO record
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ pageKey: string }> }
) {
    try {
        const { pageKey } = await params;

        // Validate pageKey is valid enum value
        if (!Object.values(PageKey).includes(pageKey as PageKey)) {
            return NextResponse.json(
                { error: `Invalid pageKey. Must be one of: ${Object.values(PageKey).join(", ")}` },
                { status: 400 }
            );
        }

        const pageSEO = await prisma.pageSEO.delete({
            where: { pageKey: pageKey as PageKey },
        });

        return NextResponse.json(pageSEO);
    } catch (error: unknown) {
        if (error instanceof Object && "code" in error && error.code === "P2025") {
            return NextResponse.json(
                { error: "PageSEO not found" },
                { status: 404 }
            );
        }
        console.error("Error deleting PageSEO:", error);
        return NextResponse.json(
            { error: "Failed to delete PageSEO" },
            { status: 500 }
        );
    }
}
