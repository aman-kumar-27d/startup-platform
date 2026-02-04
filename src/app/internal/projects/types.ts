import type { ProjectStatus } from "@prisma/client";

export interface Project {
    id: string;
    name: string;
    description: string | null;
    status: ProjectStatus;
    isPublic: boolean;
    createdById: string;
    createdBy: { id: string; name: string | null; email: string };
    assignedUsers: { id: string; name: string | null; email: string }[];
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: string;
    name: string | null;
    email: string;
}
