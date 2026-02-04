import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const sanitizeEmail = (email: string) => email.trim().toLowerCase();

export async function POST(request: Request) {
  if (process.env.ALLOW_ADMIN_SETUP !== "true") {
    return NextResponse.json(
      { error: "Admin setup is disabled." },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => null);
  const email = body?.email as string | undefined;
  const password = body?.password as string | undefined;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  const normalizedEmail = sanitizeEmail(email);

  try {
    const user = await prisma.$transaction(async (tx) => {
      const userCount = await tx.user.count();

      if (userCount > 0) {
        throw new Error("SETUP_LOCKED");
      }

      const existingUser = await tx.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (existingUser) {
        throw new Error("EMAIL_EXISTS");
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      return tx.user.create({
        data: {
          email: normalizedEmail,
          password: hashedPassword,
          role: Role.ADMIN,
        },
        select: { id: true, email: true },
      });
    });

    return NextResponse.json(
      {
        message: "Admin account created successfully.",
        userId: user.id,
        email: user.email,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "SETUP_LOCKED") {
        return NextResponse.json(
          { error: "Admin setup is no longer available." },
          { status: 403 }
        );
      }

      if (error.message === "EMAIL_EXISTS") {
        return NextResponse.json(
          { error: "A user with this email already exists." },
          { status: 409 }
        );
      }
    }

    console.error("Admin setup failed", error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
