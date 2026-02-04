export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import { SetupForm } from "./SetupForm";

export default async function InternalSetupPage() {
  const setupAllowed = process.env.ALLOW_ADMIN_SETUP === "true";

  if (!setupAllowed) {
    redirect("/internal/login");
  }

  const userCount = await prisma.user.count();

  if (userCount > 0) {
    redirect("/internal/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <SetupForm />
    </div>
  );
}
