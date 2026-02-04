"use client";

import { useState } from "react";
import { ConfirmDialog } from "./ConfirmDialog";
import { PasswordDialog } from "./PasswordDialog";

interface User {
  id: string;
  email: string;
  role: "ADMIN" | "EMPLOYEE";
  isActive: boolean;
  createdAt: string;
}

interface UserActionsProps {
  user: User;
  currentUserId?: string;
  activeAdminCount?: number;
  onUserUpdated: () => void;
}

export function UserActions({
  user,
  currentUserId,
  activeAdminCount = 0,
  onUserUpdated,
}: UserActionsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: "role" | "disable";
    value?: string;
    label: string;
  } | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  const isCurrentUser = user.id === currentUserId;
  const isAdmin = user.role === "ADMIN";
  const isLastActiveAdmin =
    isAdmin && user.isActive && activeAdminCount <= 1;

  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    try {
      setLoading(true);
      setError(null);

      const updateData: { role?: string; isActive?: boolean } = {};

      if (confirmAction.type === "role") {
        updateData.role = confirmAction.value;
      } else if (confirmAction.type === "disable") {
        updateData.isActive = false;
      }

      const res = await fetch(`/api/internal/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Action failed");
      }

      setShowConfirmDialog(false);
      setConfirmAction(null);
      onUserUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/internal/users/${user.id}/reset-password`, {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Reset failed");
      }

      const data = await res.json();
      setTempPassword(data.tempPassword);
      setShowPasswordDialog(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const canChangeRole = !isCurrentUser;
  const canDisable = !isCurrentUser && user.isActive;
  const canEnable = !isCurrentUser && !user.isActive;
  const canResetPassword = true;

  // Determine disable reasons
  const getRoleChangeReason = (): string | null => {
    if (isCurrentUser) return "Cannot change your own role";
    if (isLastActiveAdmin) return "Cannot demote the last active admin";
    return null;
  };

  const getDisableReason = (): string | null => {
    if (isCurrentUser) return "Cannot disable your own account";
    if (isLastActiveAdmin) return "Cannot disable the last active admin";
    return null;
  };

  return (
    <>
      <div className="flex justify-end gap-2">
        {canChangeRole && (
          <button
            onClick={() => {
              setConfirmAction({
                type: "role",
                value: isAdmin ? "EMPLOYEE" : "ADMIN",
                label: isAdmin ? "demote to Employee" : "promote to Admin",
              });
              setShowConfirmDialog(true);
            }}
            disabled={loading || getRoleChangeReason() !== null}
            title={getRoleChangeReason() || ""}
            className="rounded px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-transparent"
          >
            {isAdmin ? "Demote" : "Promote"}
          </button>
        )}

        {canDisable && (
          <button
            onClick={() => {
              setConfirmAction({
                type: "disable",
                label: "disable",
              });
              setShowConfirmDialog(true);
            }}
            disabled={loading || getDisableReason() !== null}
            title={getDisableReason() || ""}
            className="rounded px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-transparent"
          >
            Disable
          </button>
        )}

        {canEnable && (
          <button
            onClick={async () => {
              try {
                setLoading(true);
                const res = await fetch(`/api/internal/users/${user.id}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ isActive: true }),
                });

                if (!res.ok) {
                  const data = await res.json();
                  throw new Error(data.error || "Action failed");
                }

                onUserUpdated();
              } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
            className="rounded px-3 py-1 text-sm font-medium text-green-600 hover:bg-green-50 disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-transparent"
          >
            Enable
          </button>
        )}

        {canResetPassword && (
          <button
            onClick={handleResetPassword}
            disabled={loading}
            className="rounded px-3 py-1 text-sm font-medium text-orange-600 hover:bg-orange-50 disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-transparent"
          >
            Reset Pass
          </button>
        )}
      </div>

      {error && (
        <div className="mt-2 rounded bg-red-50 p-2 text-xs text-red-700">
          {error}
        </div>
      )}

      {showConfirmDialog && confirmAction && (
        <ConfirmDialog
          title={`Confirm Action`}
          message={`Are you sure you want to ${confirmAction.label} this user?`}
          onConfirm={handleConfirmAction}
          onCancel={() => {
            setShowConfirmDialog(false);
            setConfirmAction(null);
          }}
          loading={loading}
        />
      )}

      {showPasswordDialog && tempPassword && (
        <PasswordDialog
          email={user.email}
          tempPassword={tempPassword}
          onClose={() => {
            setShowPasswordDialog(false);
            setTempPassword(null);
          }}
        />
      )}
    </>
  );
}
