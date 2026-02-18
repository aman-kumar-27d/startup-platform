"use client";

import { ChangePasswordForm } from "../../components/ChangePasswordForm";

export default function SecuritySettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Security Settings</h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage your account security and password
        </p>
      </div>

      {/* Change Password Section */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Change Password
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Update your password to keep your account secure.
          </p>
        </div>

        <ChangePasswordForm
          isForced={false}
          onSuccess={() => { }}
        />
      </div>

      {/* Other Security Info */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
        <h3 className="font-semibold text-slate-900">Security Tips</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li>• Use a strong, unique password</li>
          <li>• Change your password regularly</li>
          <li>• Do not share your password with anyone</li>
          <li>• Use a password manager to store your credentials safely</li>
        </ul>
      </div>
    </div>
  );
}
