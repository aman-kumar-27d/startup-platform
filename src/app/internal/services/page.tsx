"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Service {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    isPublished: boolean;
    order: number;
    updatedAt: string;
}

export default function ServicesPage() {
    const { data: session, status } = useSession();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isAdmin = session?.user?.role === "ADMIN";

    useEffect(() => {
        if (status === "unauthenticated" || !isAdmin) {
            return;
        }

        fetchServices();
    }, [status, isAdmin]);

    const fetchServices = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch("/api/internal/services");

            if (!res.ok) {
                throw new Error("Failed to fetch services");
            }

            const data = await res.json();
            setServices(data.services);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    const togglePublish = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`/api/internal/services/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isPublished: !currentStatus }),
            });

            if (!res.ok) {
                throw new Error("Failed to update service");
            }

            fetchServices();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to update");
        }
    };

    if (status === "loading") {
        return <div className="p-6">Loading...</div>;
    }

    if (!isAdmin) {
        return (
            <div className="p-6 text-red-600">
                Access denied. Admin users only.
            </div>
        );
    }

    if (loading) {
        return <div className="p-6">Loading services...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Content Management</p>
                    <h1 className="text-2xl font-bold text-slate-900">Services</h1>
                </div>
                <Link
                    href="/internal/services/create"
                    className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    Create Service
                </Link>
            </div>

            {error && (
                <div className="rounded bg-red-50 p-4 text-red-700">
                    Error: {error}
                </div>
            )}

            {services.length === 0 ? (
                <div className="rounded border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
                    No services found. Create your first service to get started.
                </div>
            ) : (
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                                    Description
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                                    Order
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                                    Last Updated
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-600">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {services.map((service) => (
                                <tr key={service.id} className="hover:bg-slate-50">
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">
                                        <div className="font-medium">{service.name}</div>
                                        {service.icon ? (
                                            <div className="text-slate-500">{service.icon}</div>
                                        ) : null}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {service.description || "-"}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                                        {service.order}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <span
                                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${service.isPublished
                                                ? "bg-green-100 text-green-800"
                                                : "bg-yellow-100 text-yellow-800"
                                                }`}
                                        >
                                            {service.isPublished ? "Published" : "Draft"}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                                        {new Date(service.updatedAt).toLocaleDateString()}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/internal/services/${service.id}/edit`}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => togglePublish(service.id, service.isPublished)}
                                                className={`${service.isPublished
                                                    ? "text-yellow-600 hover:text-yellow-900"
                                                    : "text-green-600 hover:text-green-900"
                                                    }`}
                                            >
                                                {service.isPublished ? "Unpublish" : "Publish"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
