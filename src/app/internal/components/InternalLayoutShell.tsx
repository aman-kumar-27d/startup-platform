"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

type InternalLayoutShellProps = {
  children: ReactNode;
};

export function InternalLayoutShell({ children }: InternalLayoutShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Redirect to change-password if mustChangePassword is true
  // But allow access to change-password and API routes
  useEffect(() => {
    if (session.status === "authenticated") {
      const user = session.data?.user;
      const isChangePasswordPage = pathname === "/internal/change-password";
      const isApiRoute = pathname.startsWith("/api");

      // If user must change password and is not already on the change-password page
      if (user?.mustChangePassword && !isChangePasswordPage && !isApiRoute) {
        router.push("/internal/change-password");
      }
    }
  }, [session.status, session.data?.user, pathname, router]);

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <div
        className={`fixed inset-0 z-40 bg-slate-900/40 transition-opacity lg:hidden ${sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        aria-hidden="true"
        onClick={() => setSidebarOpen(false)}
      />

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-screen flex-1 flex-col">
        <Header onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto px-4 pb-8 pt-4 lg:px-8 lg:pb-12">
          <div className="flex w-full flex-col gap-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
