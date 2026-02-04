"use client";

import type { ProjectStatus } from "@prisma/client";
import type { Project } from "../types";

interface EmployeeProjectCardProps {
    project: Project;
}

const statusColors: Record<ProjectStatus, string> = {
    PLANNED: "bg-gray-100 text-gray-800",
    ACTIVE: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
    ON_HOLD: "bg-yellow-100 text-yellow-800",
};

export function EmployeeProjectCard({ project }: EmployeeProjectCardProps) {
    const formatDate = (date: string) => {
        return new Intl.DateTimeFormat("en-US", {
            timeZone: "UTC",
            year: "numeric",
            month: "short",
            day: "2-digit",
        }).format(new Date(date));
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{project.name}</h3>
                <span
                    className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusColors[project.status]
                        }`}
                >
                    {project.status.replace(/_/g, " ")}
                </span>
            </div>

            {project.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {project.description}
                </p>
            )}

            <div className="space-y-2 text-sm text-gray-600">
                <div>
                    <span className="font-medium">Created by:</span> {project.createdBy.name || project.createdBy.email}
                </div>
                <div>
                    <span className="font-medium">Created:</span> {formatDate(project.createdAt)}
                </div>
                {project.isPublic && (
                    <div>
                        <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                            Public Project
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
