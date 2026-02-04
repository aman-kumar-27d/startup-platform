"use client";

import { useRouter } from "next/navigation";
import { ChangePasswordForm } from "../components/ChangePasswordForm";

export default function ChangePasswordPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/internal/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="px-6 py-8">
          <div className="mb-6 space-y-2">
            <h1 className="text-xl font-semibold text-slate-900">
              Change Your Password
            </h1>
            <p className="text-sm text-slate-500">
              You must change your password before you can continue.
            </p>
          </div>

          <ChangePasswordForm
            isForced={true}
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </div>
  );
}
