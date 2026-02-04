"use client";

import type { ProjectStatus } from "@prisma/client";
import type { Project } from "../types";

interface ProjectTableProps {
    projects: Project[];
    onEdit: (project: Project) => void;
}

const statusColors: Record<ProjectStatus, string> = {
    PLANNED: "bg-gray-100 text-gray-800",
    ACTIVE: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
    ON_HOLD: "bg-yellow-100 text-yellow-800",
};

export function ProjectTable({ projects, onEdit }: ProjectTableProps) {
    const formatDate = (date: string) => {
        return new Intl.DateTimeFormat("en-US", {
            timeZone: "UTC",
            year: "numeric",
            month: "short",
            day: "2-digit",
        }).format(new Date(date));
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">
                            Name
                        </th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">
                            Status
                        </th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">
                            Public
                        </th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">
                            Assigned To
                        </th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">
                            Created By
                        </th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">
                            Created
                        </th>
                        <th className="text-center px-4 py-3 font-semibold text-gray-700">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {projects.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="text-center px-4 py-8 text-gray-500">
                                No projects found
                            </td>
                        </tr>
                    ) : (
                        projects.map((project) => (
                            <tr key={project.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <div className="font-medium text-gray-900">{project.name}</div>
                                    {project.description && (
                                        <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                                            {project.description}
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusColors[project.status]
                                            }`}
                                    >
                                        {project.status.replace(/_/g, " ")}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="text-xs font-medium text-gray-700">
                                        {project.isPublic ? "✓ Yes" : "✗ No"}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="text-xs space-y-1">
                                        {project.assignedUsers.length === 0 ? (
                                            <span className="text-gray-500">Unassigned</span>
                                        ) : (
                                            project.assignedUsers.map((user) => (
                                                <div key={user.id} className="text-gray-700">
                                                    {user.name || user.email}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="text-xs text-gray-700">
                                        {project.createdBy.name || project.createdBy.email}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="text-xs text-gray-600">
                                        {formatDate(project.createdAt)}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <button
                                        onClick={() => onEdit(project)}
                                        className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
