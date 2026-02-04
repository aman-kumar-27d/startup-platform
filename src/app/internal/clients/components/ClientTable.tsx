"use client";

import Link from "next/link";
import type { ClientData } from "../types";

interface ClientTableProps {
    clients: ClientData[];
    userRole: string;
}

const lifecycleColors: Record<string, string> = {
    LEAD: "bg-blue-100 text-blue-800",
    ACTIVE: "bg-green-100 text-green-800",
    PAST: "bg-gray-100 text-gray-800",
    LOST: "bg-red-100 text-red-800",
};

const weightageColors: Record<string, string> = {
    VIP: "bg-purple-100 text-purple-800",
    REGULAR: "bg-slate-100 text-slate-800",
    ONE_TIME: "bg-orange-100 text-orange-800",
    LOW_PRIORITY: "bg-neutral-100 text-neutral-800",
};

export function ClientTable({
    clients,
    userRole,
}: ClientTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b">
                    <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900">Name</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900">Company</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900">Status</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900">Weightage</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900 text-gray-900">Owner</th>
                        {userRole === "ADMIN" && (
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Risk</th>
                        )}
                        <th className="px-4 py-3 text-center font-semibold text-gray-900">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map((client) => (
                        <tr
                            key={client.id}
                            className="border-b hover:bg-gray-50 cursor-pointer"
                        >
                            <td className="px-4 py-3 font-semibold text-gray-900">{client.name}</td>
                            <td className="px-4 py-3 text-gray-800">{client.companyName}</td>
                            <td className="px-4 py-3">
                                <span
                                    className={`px-2 py-1 rounded text-xs font-medium ${lifecycleColors[client.lifecycleStatus]
                                        }`}
                                >
                                    {client.lifecycleStatus}
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <span
                                    className={`px-2 py-1 rounded text-xs font-medium ${weightageColors[client.weightage]
                                        }`}
                                >
                                    {client.weightage}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-gray-800">
                                {client.owner.name || client.owner.email}
                            </td>
                            {userRole === "ADMIN" && (
                                <td className="px-4 py-3">
                                    {client.isHighRisk && (
                                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                                            ⚠️ High Risk
                                        </span>
                                    )}
                                </td>
                            )}
                            <td className="px-4 py-3 text-center">
                                <Link
                                    href={`/internal/clients/${client.id}`}
                                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 text-xs font-medium inline-block"
                                >
                                    View
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {clients.length === 0 && (
                <div className="text-center py-8 text-gray-700 font-medium">
                    No clients found
                </div>
            )}
        </div>
    );
}
