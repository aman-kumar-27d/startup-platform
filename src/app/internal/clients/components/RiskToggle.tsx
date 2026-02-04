"use client";

import { useState } from "react";

interface RiskToggleProps {
    clientId: string;
    isHighRisk: boolean;
    onToggle: (isHighRisk: boolean) => Promise<void>;
    isLoading?: boolean;
}

export function RiskToggle({
    clientId,
    isHighRisk,
    onToggle,
    isLoading = false,
}: RiskToggleProps) {
    const [error, setError] = useState<string | null>(null);

    const handleToggle = async () => {
        setError(null);
        try {
            await onToggle(!isHighRisk);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to update risk status"
            );
        }
    };

    return (
        <div className="flex items-center gap-3">
            <button
                onClick={handleToggle}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${isHighRisk
                    ? "bg-red-100 text-red-700 hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-500"
                    : "bg-green-100 text-green-700 hover:bg-green-200 disabled:bg-gray-100 disabled:text-gray-500"
                    }`}
            >
                {isLoading ? (
                    <span className="flex items-center gap-2">
                        <span className="animate-spin">⟳</span>
                        {isHighRisk ? "Unmarking..." : "Marking..."}
                    </span>
                ) : isHighRisk ? (
                    "⚠️ High Risk - Click to Unmark"
                ) : (
                    "✓ Safe - Click to Mark as Risk"
                )}
            </button>
            {error && (
                <span className="text-sm text-red-600">{error}</span>
            )}
        </div>
    );
}
