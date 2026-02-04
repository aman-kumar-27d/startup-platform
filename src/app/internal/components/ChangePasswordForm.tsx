"use client";

import { useState } from "react";

type ChangePasswordFormProps = {
  onSuccess?: () => void;
  isForced?: boolean;
};

export function ChangePasswordForm({
  onSuccess,
  isForced = false,
}: ChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Password validation
  const passwordErrors: string[] = [];
  if (newPassword) {
    if (newPassword.length < 8) {
      passwordErrors.push("At least 8 characters");
    }
    if (!/[a-z]/.test(newPassword)) {
      passwordErrors.push("At least one lowercase letter");
    }
    if (!/[A-Z]/.test(newPassword)) {
      passwordErrors.push("At least one uppercase letter");
    }
    if (!/\d/.test(newPassword)) {
      passwordErrors.push("At least one number");
    }
  }

  const confirmPasswordMatch = newPassword && confirmPassword === newPassword;
  const confirmPasswordMismatch =
    confirmPassword && confirmPassword !== newPassword;

  const isFormValid =
    currentPassword &&
    newPassword &&
    confirmPassword &&
    passwordErrors.length === 0 &&
    confirmPasswordMatch;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid) {
      setError("Please fix all validation errors");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/internal/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to change password");
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Redirect after 2 seconds if forced password change
      if (isForced) {
        setTimeout(() => {
          onSuccess?.();
        }, 1500);
      } else {
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      }
    } catch (err) {
      console.error("Error changing password:", err);
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Current Password */}
      <div className="space-y-2">
        <label
          htmlFor="currentPassword"
          className="text-sm font-medium text-slate-700"
        >
          Current Password
        </label>
        <input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          disabled={isLoading}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:bg-slate-50 disabled:text-slate-500"
          placeholder="Enter your current password"
        />
      </div>

      {/* New Password */}
      <div className="space-y-2">
        <label
          htmlFor="newPassword"
          className="text-sm font-medium text-slate-700"
        >
          New Password
        </label>
        <input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={isLoading}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:bg-slate-50 disabled:text-slate-500"
          placeholder="Enter a new password"
        />
        {/* Password requirements */}
        {newPassword && (
          <div className="mt-2 space-y-1 rounded-md bg-slate-50 p-3">
            <p className="text-xs font-medium text-slate-600">
              Password must include:
            </p>
            <ul className="space-y-1">
              {[
                { check: newPassword.length >= 8, label: "At least 8 characters" },
                { check: /[a-z]/.test(newPassword), label: "At least one lowercase letter" },
                { check: /[A-Z]/.test(newPassword), label: "At least one uppercase letter" },
                { check: /\d/.test(newPassword), label: "At least one number" },
              ].map((req, idx) => (
                <li
                  key={idx}
                  className={`text-xs ${
                    req.check ? "text-emerald-600" : "text-slate-500"
                  }`}
                >
                  {req.check ? "✓" : "○"} {req.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-slate-700"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
          className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-500 ${
            confirmPasswordMismatch
              ? "border-rose-300 bg-rose-50 text-slate-900 focus:border-rose-400 focus:ring-rose-200"
              : "border-slate-300 bg-white text-slate-900 focus:border-slate-400 focus:ring-slate-200"
          }`}
          placeholder="Confirm your new password"
        />
        {confirmPasswordMismatch && (
          <p className="text-xs text-rose-600">Passwords do not match</p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div
          role="alert"
          className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
        >
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div
          role="alert"
          className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
        >
          Password changed successfully!
          {isForced && " Redirecting to dashboard..."}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isFormValid || isLoading || success}
        className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:bg-slate-400 disabled:cursor-not-allowed"
      >
        {isLoading ? "Changing password..." : "Change Password"}
      </button>
    </form>
  );
}
