"use client";

import type { ClientHistoryEntry } from "../types";

interface HistoryTimelineProps {
    history: ClientHistoryEntry[];
    isLoading?: boolean;
}

const actionLabels: Record<string, string> = {
    CREATED: "Created",
    STATUS_CHANGED: "Status Changed",
    WEIGHTAGE_CHANGED: "Weightage Changed",
    OWNER_CHANGED: "Owner Changed",
    ARCHIVED: "Archived",
    NOTES_UPDATED: "Notes Updated",
    RISK_MARKED: "Risk Status Changed",
};

const actionColors: Record<string, string> = {
    CREATED: "bg-blue-100 text-blue-800",
    STATUS_CHANGED: "bg-purple-100 text-purple-800",
    WEIGHTAGE_CHANGED: "bg-indigo-100 text-indigo-800",
    OWNER_CHANGED: "bg-orange-100 text-orange-800",
    ARCHIVED: "bg-red-100 text-red-800",
    NOTES_UPDATED: "bg-yellow-100 text-yellow-800",
    RISK_MARKED: "bg-red-100 text-red-800",
};

export function HistoryTimeline({ history, isLoading }: HistoryTimelineProps) {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className="text-center py-8 text-gray-700 font-medium">
                No history available
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {history.map((entry) => (
                <div key={entry.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-blue-600 rounded-full mt-1"></div>
                        <div className="w-0.5 h-16 bg-gray-200"></div>
                    </div>
                    <div className="pb-4 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span
                                className={`px-2 py-1 rounded text-xs font-medium ${actionColors[entry.actionType]
                                    }`}
                            >
                                {actionLabels[entry.actionType]}
                            </span>
                            <span className="text-xs text-gray-500">
                                by {entry.actor.name || entry.actor.email}
                            </span>
                        </div>
                        <p className="text-sm text-gray-800">{entry.description}</p>
                        <p className="text-xs text-gray-600 mt-1">
                            {new Date(entry.createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
