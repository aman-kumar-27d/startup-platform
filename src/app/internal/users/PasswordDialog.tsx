"use client";

import { useState } from "react";

interface PasswordDialogProps {
  email: string;
  tempPassword: string;
  onClose: () => void;
}

export function PasswordDialog({
  email,
  tempPassword,
  onClose,
}: PasswordDialogProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-2 text-lg font-semibold text-slate-900">
          Password Reset
        </h2>
        <p className="mb-4 text-sm text-slate-600">
          Temporary password for <strong>{email}</strong>:
        </p>

        <div className="mb-6 flex items-center gap-2 rounded bg-slate-100 p-3">
          <code className="flex-1 font-mono text-sm font-bold text-slate-900">
            {tempPassword}
          </code>
          <button
            onClick={copyToClipboard}
            className="rounded px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <div className="mb-6 rounded bg-amber-50 p-3 text-xs text-amber-800">
          <p className="font-semibold">Important:</p>
          <p>This password is shown only once. Share it securely with the user.</p>
        </div>

        <button
          onClick={onClose}
          className="w-full rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Done
        </button>
      </div>
    </div>
  );
}
