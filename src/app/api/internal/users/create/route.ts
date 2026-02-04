import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { generateTempPassword } from "@/lib/password";

// Valid roles for new users
const VALID_ROLES = ["ADMIN", "EMPLOYEE"] as const;

interface CreateUserRequest {
  email?: string;
  role?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

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

    // Parse request body
    let body: CreateUserRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { email, role } = body;

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const sanitizedEmail = email.trim().toLowerCase();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate role
    if (!role || !VALID_ROLES.includes(role as any)) {
      return NextResponse.json(
        { error: "Invalid role. Must be ADMIN or EMPLOYEE" },
        { status: 400 }
      );
    }

    // Check for duplicate email
    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    // Generate temporary password
    const tempPassword = generateTempPassword();

    // Hash password
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        email: sanitizedEmail,
        password: hashedPassword,
        role: role as "ADMIN" | "EMPLOYEE",
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Return success with temporary password (ONLY THIS TIME)
    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        user: newUser,
        tempPassword, // Only returned once, never logged or stored
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
