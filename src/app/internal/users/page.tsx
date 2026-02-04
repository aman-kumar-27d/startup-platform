"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { UserActions } from "./UserActions";

interface User {
  id: string;
  email: string;
  role: "ADMIN" | "EMPLOYEE";
  isActive: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentUserId = session?.user?.id;
  const isAdmin = session?.user?.role === "ADMIN";

  useEffect(() => {
    if (status === "unauthenticated" || !isAdmin) {
      return;
    }

    fetchUsers();
  }, [status, isAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/internal/users");

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await res.json();
      setUsers(data.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleUserUpdated = () => {
    fetchUsers();
  };

  if (status === "loading") {
    return <div className="p-6">Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="p-6 text-red-600">
        Access denied. Admin users only.
      </div>
    );
  }

  if (loading) {
    return <div className="p-6">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-slate-500">Users</p>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        </div>
        <Link
          href="/internal/users/create"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Create User
        </Link>
      </div>

      {error && (
        <div className="rounded bg-red-50 p-4 text-red-700">
          Error: {error}
        </div>
      )}

      {users.length === 0 ? (
        <div className="rounded border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
          No users found
        </div>
      ) : (
        <div className="overflow-x-auto rounded border border-slate-200 bg-white">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3 text-sm text-slate-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-900">
                    <span className="inline-block rounded bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-900">
                    <span
                      className={`inline-block rounded px-2.5 py-0.5 text-xs font-medium ${
                        user.isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {user.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <UserActions
                      user={user}
                      currentUserId={currentUserId}
                      onUserUpdated={handleUserUpdated}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
