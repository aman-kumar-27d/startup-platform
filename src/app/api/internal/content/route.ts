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

    // Fetch all content blocks
    const contentBlocks = await prisma.contentBlock.findMany({
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

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { key, title, subtitle, description, ctaText, ctaLink, order, isPublished } = body;

    // Validate required fields
    if (!key || !title) {
      return NextResponse.json(
        { error: "Key and title are required" },
        { status: 400 }
      );
    }

    // Check if key already exists
    const existing = await prisma.contentBlock.findUnique({
      where: { key },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A content block with this key already exists" },
        { status: 400 }
      );
    }

    // Create content block
    const contentBlock = await prisma.contentBlock.create({
      data: {
        key,
        title,
        subtitle: subtitle || null,
        description: description || null,
        ctaText: ctaText || null,
        ctaLink: ctaLink || null,
        order: order ?? 0,
        isPublished: isPublished ?? false,
      },
    });

    return NextResponse.json({ contentBlock }, { status: 201 });
  } catch (error) {
    console.error("Error creating content block:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
