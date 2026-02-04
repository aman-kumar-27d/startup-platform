"use client";

import { signOut, useSession } from "next-auth/react";

type HeaderProps = {
  onOpenSidebar: () => void;
};

export function Header({ onOpenSidebar }: HeaderProps) {
  const { data: session, status } = useSession();
  const user = session?.user;
  const displayName = user?.name || user?.email || "User";
  const role = user?.role;
  const email = user?.email;

  return (
    <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-md border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 lg:hidden"
            onClick={onOpenSidebar}
            aria-label="Open sidebar"
          >
            Menu
          </button>
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wide text-gray-500">
              Internal dashboard
            </span>
            <span className="text-sm font-semibold text-gray-900">
              {status === "loading" ? "Loading user" : displayName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden text-right text-sm lg:block">
            <p className="font-semibold text-gray-900">
              {status === "loading" ? "Authenticating..." : displayName}
            </p>
            {email ? (
              <p className="text-xs text-gray-500">{email}</p>
            ) : null}
          </div>
          {role ? (
            <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-700">
              {role}
            </span>
          ) : null}
          <button
            type="button"
            className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
            onClick={() => signOut({ callbackUrl: "/internal/login" })}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
