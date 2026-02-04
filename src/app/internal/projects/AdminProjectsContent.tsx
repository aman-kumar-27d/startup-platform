"use client";

import { useState } from "react";
import { CreateProjectForm } from "./components/CreateProjectForm";
import { EditProjectForm } from "./components/EditProjectForm";
import { ProjectTable } from "./components/ProjectTable";
import type { Project, User } from "./types";

interface AdminProjectsContentProps {
    initialProjects: Project[];
    availableUsers: User[];
}

export default function AdminProjectsContent({
    initialProjects,
    availableUsers,
}: AdminProjectsContentProps) {
    const [projects, setProjects] = useState(initialProjects);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const handleProjectCreated = async () => {
        const response = await fetch("/api/internal/projects");
        if (response.ok) {
            const updatedProjects = await response.json();
            setProjects(updatedProjects);
        }
    };

    const handleProjectUpdated = async () => {
        const response = await fetch("/api/internal/projects");
        if (response.ok) {
            const updatedProjects = await response.json();
            setProjects(updatedProjects);
            setEditingProject(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
                    <p className="text-gray-600 mt-1">
                        Manage and assign projects to employees
                    </p>
                </div>
                <CreateProjectForm
                    users={availableUsers}
                    onProjectCreated={handleProjectCreated}
                />
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
                <ProjectTable
                    projects={projects}
                    onEdit={setEditingProject}
                />
            </div>

            {editingProject && (
                <EditProjectForm
                    project={editingProject}
                    users={availableUsers}
                    isOpen={!!editingProject}
                    onClose={() => setEditingProject(null)}
                    onProjectUpdated={handleProjectUpdated}
                />
            )}
        </div>
    );
}
