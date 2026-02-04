"use client";

interface AdminWarningProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function AdminWarning({ onConfirm, onCancel }: AdminWarningProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-2 text-lg font-semibold text-slate-900">
          Create Admin User?
        </h2>

        <p className="mb-6 text-sm text-slate-600">
          You are about to create a new admin user. Admins have full access to
          the system. Are you sure?
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg bg-slate-200 px-4 py-2 font-medium text-slate-900 hover:bg-slate-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
          >
            Create Admin
          </button>
        </div>
      </div>
    </div>
  );
}
