"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { PasswordDisplay } from "../PasswordDisplay";
import { AdminWarning } from "../AdminWarning";

export default function CreateUserPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"EMPLOYEE" | "ADMIN">("EMPLOYEE");
  const [showPasswordDisplay, setShowPasswordDisplay] = useState(false);
  const [showAdminWarning, setShowAdminWarning] = useState(false);
  const [tempPassword, setTempPassword] = useState<string>("");
  const [newUserEmail, setNewUserEmail] = useState<string>("");

  const isAdmin = session?.user?.role === "ADMIN";

  // Redirect if not admin or not authenticated
  if (status === "loading") {
    return <div className="p-6">Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="space-y-4 p-6">
        <div className="text-red-600">Access denied. Admin users only.</div>
        <Link
          href="/internal/users"
          className="text-blue-600 hover:underline"
        >
          Back to Users
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate email
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Invalid email format");
      return;
    }

    // Show warning for ADMIN creation
    if (role === "ADMIN") {
      setShowAdminWarning(true);
      return;
    }

    // Proceed with creation
    createUser();
  };

  const createUser = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/internal/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create user");
      }

      // Show password display modal
      setTempPassword(data.tempPassword);
      setNewUserEmail(data.user.email);
      setShowPasswordDisplay(true);
      setShowAdminWarning(false);

      // Reset form
      setEmail("");
      setRole("EMPLOYEE");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setShowAdminWarning(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordDismiss = () => {
    setShowPasswordDisplay(false);
    // Redirect back to users list
    router.push("/internal/users");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Users
          </p>
          <h1 className="text-2xl font-bold text-slate-900">Create User</h1>
        </div>
        <Link
          href="/internal/users"
          className="text-sm text-slate-600 hover:text-slate-900"
        >
          ← Back to Users
        </Link>
      </div>

      <div className="max-w-md rounded-lg border border-slate-200 bg-white p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-900">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
              placeholder="user@example.com"
            />
          </div>

          {/* Role dropdown */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-slate-900">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as "EMPLOYEE" | "ADMIN")}
              disabled={loading}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
            >
              <option value="EMPLOYEE">Employee</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {/* Error message */}
          {error && (
            <div className="rounded bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </form>
      </div>

      {/* Password Display Modal */}
      {showPasswordDisplay && (
        <PasswordDisplay
          password={tempPassword}
          email={newUserEmail}
          onDismiss={handlePasswordDismiss}
        />
      )}

      {/* Admin Warning Modal */}
      {showAdminWarning && (
        <AdminWarning
          onConfirm={createUser}
          onCancel={() => setShowAdminWarning(false)}
        />
      )}
    </div>
  );
}
