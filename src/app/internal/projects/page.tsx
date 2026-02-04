import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import AdminProjectsContent from "./AdminProjectsContent";
import EmployeeProjectsContent from "./EmployeeProjectsContent";
import type { Project } from "./types";

export const metadata = {
    title: "Projects | Dashboard",
};

export default async function ProjectsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/internal/login");
    }

    const userRole = session.user.role as Role;

    if (userRole === "ADMIN") {
        // Fetch all users for employee assignment
        const users = await prisma.user.findMany({
            where: { role: "EMPLOYEE", isActive: true },
            select: { id: true, name: true, email: true },
            orderBy: { name: "asc" },
        });

        // Fetch all projects
        const projectsRaw = await prisma.project.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                createdBy: {
                    select: { id: true, name: true, email: true },
                },
                assignedUsers: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        const projects = projectsRaw.map((p) => ({
            ...p,
            createdAt: p.createdAt.toISOString(),
            updatedAt: p.updatedAt.toISOString(),
        })) as Project[];

        return (
            <AdminProjectsContent
                initialProjects={projects}
                availableUsers={users}
            />
        );
    }

    // EMPLOYEE view
    const projectsRaw = await prisma.project.findMany({
        where: {
            assignedUsers: {
                some: {
                    id: session.user.id,
                },
            },
        },
        orderBy: { createdAt: "desc" },
        include: {
            createdBy: {
                select: { id: true, name: true, email: true },
            },
            assignedUsers: {
                select: { id: true, name: true, email: true },
            },
        },
    });

    const projects = projectsRaw.map((p) => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
    })) as Project[];

    return <EmployeeProjectsContent initialProjects={projects} />;
}
