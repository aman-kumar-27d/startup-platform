"use client";

import { useState } from "react";

interface NotesSectionProps {
    notes: string | null;
    onSave: (notes: string) => Promise<void>;
    isLoading?: boolean;
    readOnly?: boolean;
}

export function NotesSection({
    notes,
    onSave,
    isLoading = false,
    readOnly = false,
}: NotesSectionProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [notesText, setNotesText] = useState(notes || "");

    const handleSave = async () => {
        await onSave(notesText);
        setIsEditing(false);
    };

    return (
        <div className="bg-white rounded-lg border p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
                {!readOnly && !isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-blue-600 text-sm hover:underline"
                    >
                        Edit
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="space-y-3">
                    <textarea
                        value={notesText}
                        onChange={(e) => setNotesText(e.target.value)}
                        disabled={isLoading}
                        className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 min-h-32"
                        placeholder="Add notes..."
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 text-sm"
                        >
                            {isLoading ? "Saving..." : "Save"}
                        </button>
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setNotesText(notes || "");
                            }}
                            disabled={isLoading}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:bg-gray-100 text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-gray-800 whitespace-pre-wrap">
                    {notesText || <span className="text-gray-500 italic">(No notes)</span>}
                </p>
            )}
        </div>
    );
}
