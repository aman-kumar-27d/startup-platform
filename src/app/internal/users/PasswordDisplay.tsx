"use client";

import { useState } from "react";

interface PasswordDisplayProps {
  password: string;
  email: string;
  onDismiss: () => void;
}

export function PasswordDisplay({
  password,
  email,
  onDismiss,
}: PasswordDisplayProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy password:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          User Created Successfully
        </h2>

        <div className="mb-6 space-y-4">
          <div>
            <p className="text-sm text-slate-600">Email</p>
            <p className="font-mono text-sm text-slate-900">{email}</p>
          </div>

          <div className="rounded-lg border-2 border-amber-200 bg-amber-50 p-4">
            <p className="mb-2 text-sm font-semibold text-amber-900">
              ⚠️ Temporary Password
            </p>
            <p className="font-mono text-lg font-bold text-amber-900">
              {password}
            </p>
            <p className="mt-2 text-xs text-amber-800">
              Save this password now. It won&apos;t be shown again.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={copyToClipboard}
            className={`flex-1 rounded-lg px-4 py-2 font-medium text-white transition-colors ${
              copied
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {copied ? "✓ Copied" : "Copy Password"}
          </button>
          <button
            onClick={onDismiss}
            className="flex-1 rounded-lg bg-slate-200 px-4 py-2 font-medium text-slate-900 hover:bg-slate-300"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
