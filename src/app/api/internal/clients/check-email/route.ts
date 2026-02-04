import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
        return NextResponse.json(
            { error: "Email parameter is required" },
            { status: 400 }
        );
    }

    try {
        const existingClient = await prisma.client.findFirst({
            where: { email: email.toLowerCase() },
        });

        if (existingClient) {
            return NextResponse.json(
                { error: "Email already in use" },
                { status: 409 }
            );
        }

        return NextResponse.json({ available: true }, { status: 200 });
    } catch (error) {
        console.error("Error checking email:", error);
        return NextResponse.json(
            { error: "Failed to check email" },
            { status: 500 }
        );
    }
}
