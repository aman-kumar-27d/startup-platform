"use client";

import { EmployeeProjectCard } from "./components/EmployeeProjectCard";
import type { Project } from "./types";

interface EmployeeProjectsContentProps {
    initialProjects: Project[];
}

export default function EmployeeProjectsContent({
    initialProjects,
}: EmployeeProjectsContentProps) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
                <p className="text-gray-600 mt-1">
                    Projects assigned to you
                </p>
            </div>

            {initialProjects.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                    <p className="text-gray-500">No projects assigned to you yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {initialProjects.map((project) => (
                        <EmployeeProjectCard key={project.id} project={project} />
                    ))}
                </div>
            )}
        </div>
    );
}
