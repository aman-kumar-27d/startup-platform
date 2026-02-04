"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import type { ClientData } from "./types";
import { ClientTable } from "./components/ClientTable";

interface FilterOptions {
    lifecycleStatus: string;
    weightage: string;
    ownerId: string;
}

interface User {
    id: string;
    email: string;
    role: string;
}

export default function ClientsPage() {
    const { data: session, status } = useSession();
    const [clients, setClients] = useState<ClientData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [activeTab, setActiveTab] = useState<"active" | "leads" | "archived">(
        "active"
    );
    const [filters, setFilters] = useState<FilterOptions>({
        lifecycleStatus: "",
        weightage: "",
        ownerId: "",
    });
    const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [createFormData, setCreateFormData] = useState({
        name: "",
        companyName: "",
        email: "",
        phone: "",
        website: "",
        lifecycleStatus: "LEAD",
        weightage: "REGULAR",
        relationshipLevel: "WEAK",
        leadScore: "",
        expectedValue: "",
        source: "Other",
        ownerId: "",
    });

    // Fetch clients
    useEffect(() => {
        if (status === "unauthenticated") {
            return;
        }

        const fetchClients = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams();

                // Add tab-based filters
                if (activeTab === "leads") {
                    params.append("lifecycleStatus", "LEAD");
                } else if (activeTab === "active") {
                    params.append("lifecycleStatus", "ACTIVE");
                } else if (activeTab === "archived") {
                    params.append("isArchived", "true");
                } else {
                    params.append("isArchived", "false");
                }

                // Add user filters
                if (filters.lifecycleStatus) {
                    params.set("lifecycleStatus", filters.lifecycleStatus);
                }
                if (filters.weightage) {
                    params.append("weightage", filters.weightage);
                }
                if (filters.ownerId && session?.user.role === "ADMIN") {
                    params.append("ownerId", filters.ownerId);
                }

                const response = await fetch(`/api/internal/clients?${params}`);
                if (!response.ok) throw new Error("Failed to fetch clients");

                const data = await response.json();
                setClients(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch clients");
            } finally {
                setIsLoading(false);
            }
        };

        fetchClients();
    }, [session, status, activeTab, filters]);

    // Fetch users for assign/create form
    useEffect(() => {
        if (session?.user.role === "ADMIN") {
            const fetchUsers = async () => {
                try {
                    const response = await fetch("/api/internal/users/assignable");
                    if (response.ok) {
                        const data = await response.json();
                        setUsers(Array.isArray(data) ? data : []);
                    }
                } catch (err) {
                    console.error("Failed to fetch users:", err);
                }
            };

            fetchUsers();
        }
    }, [session]);

    const handleCreateClient = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...createFormData,
                name: createFormData.name.trim(),
                companyName: createFormData.companyName.trim(),
                email: createFormData.email.trim().toLowerCase(),
                phone: createFormData.phone.trim(),
                website: createFormData.website.trim(),
            };
            const response = await fetch("/api/internal/clients", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorBody = await response
                    .json()
                    .catch(() => null as { error?: string } | null);
                throw new Error(
                    errorBody?.error || "Failed to create client"
                );
            }

            setShowCreateForm(false);
            setCreateFormData({
                name: "",
                companyName: "",
                email: "",
                phone: "",
                website: "",
                lifecycleStatus: "LEAD",
                weightage: "REGULAR",
                relationshipLevel: "WEAK",
                leadScore: "",
                expectedValue: "",
                source: "Other",
                ownerId: "",
            });

            // Refetch clients
            const params = new URLSearchParams();
            if (activeTab === "leads") {
                params.append("lifecycleStatus", "LEAD");
            } else if (activeTab === "active") {
                params.append("lifecycleStatus", "ACTIVE");
            }

            const fetchResponse = await fetch(`/api/internal/clients?${params}`);
            if (fetchResponse.ok) {
                const data = await fetchResponse.json();
                setClients(data);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create client");
        }
    };

    if (status === "loading") {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
                <p className="text-gray-700">Manage your client relationships</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {session?.user.role === "ADMIN" && (
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    {showCreateForm ? "Cancel" : "+ New Client"}
                </button>
            )}

            {showCreateForm && session?.user.role === "ADMIN" && (
                <div className="bg-white rounded-lg border p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Client</h2>
                    <form onSubmit={handleCreateClient} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-1">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    value={createFormData.name}
                                    onChange={(e) =>
                                        setCreateFormData({
                                            ...createFormData,
                                            name: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-1">
                                    Company Name *
                                </label>
                                <input
                                    type="text"
                                    value={createFormData.companyName}
                                    onChange={(e) =>
                                        setCreateFormData({
                                            ...createFormData,
                                            companyName: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-1">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    value={createFormData.email}
                                    onChange={(e) =>
                                        setCreateFormData({
                                            ...createFormData,
                                            email: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-1">
                                    Owner *
                                </label>
                                <select
                                    value={createFormData.ownerId}
                                    onChange={(e) =>
                                        setCreateFormData({
                                            ...createFormData,
                                            ownerId: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
                                    required
                                >
                                    <option value="">Select an owner</option>
                                    {(users || []).map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.email} ({user.role})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    value={createFormData.phone}
                                    onChange={(e) =>
                                        setCreateFormData({
                                            ...createFormData,
                                            phone: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-1">
                                    Website
                                </label>
                                <input
                                    type="url"
                                    value={createFormData.website}
                                    onChange={(e) =>
                                        setCreateFormData({
                                            ...createFormData,
                                            website: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-1">Source</label>
                                <select
                                    value={createFormData.source}
                                    onChange={(e) =>
                                        setCreateFormData({
                                            ...createFormData,
                                            source: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
                                >
                                    <option value="Referral">Referral</option>
                                    <option value="Website">Website</option>
                                    <option value="Cold_outreach">Cold Outreach</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Create Client
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowCreateForm(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-4 border-b">
                {["active", "leads", "archived"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as typeof activeTab)}
                        className={`px-4 py-2 font-medium border-b-2 ${activeTab === tab
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        {tab === "active"
                            ? "Active Clients"
                            : tab === "leads"
                                ? "Potential Clients"
                                : "Archived"}
                    </button>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border p-4">
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Weightage</label>
                        <select
                            value={filters.weightage}
                            onChange={(e) =>
                                setFilters({ ...filters, weightage: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
                        >
                            <option value="">All</option>
                            <option value="VIP">VIP</option>
                            <option value="REGULAR">Regular</option>
                            <option value="ONE_TIME">One Time</option>
                            <option value="LOW_PRIORITY">Low Priority</option>
                        </select>
                    </div>

                    {session?.user.role === "ADMIN" && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Owner</label>
                            <select
                                value={filters.ownerId}
                                onChange={(e) =>
                                    setFilters({ ...filters, ownerId: e.target.value })
                                }
                                className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
                            >
                                <option value="">All Owners</option>
                                {(users || []).map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.email} ({user.role})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {/* Client Table */}
            <div className="bg-white rounded-lg border">
                {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <ClientTable
                        clients={clients}
                        userRole={session?.user.role || ""}
                    />
                )}
            </div>

            {selectedClient && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">{selectedClient.name}</h2>
                            <button
                                onClick={() => setSelectedClient(null)}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-2 text-sm">
                            <p>
                                <span className="font-medium">Company:</span>{" "}
                                {selectedClient.companyName}
                            </p>
                            <p>
                                <span className="font-medium">Email:</span> {selectedClient.email}
                            </p>
                            <p>
                                <span className="font-medium">Owner:</span>{" "}
                                {selectedClient.owner.name || selectedClient.owner.email}
                            </p>
                            <p>
                                <span className="font-medium">Status:</span>{" "}
                                {selectedClient.lifecycleStatus}
                            </p>
                            <p>
                                <span className="font-medium">Weightage:</span>{" "}
                                {selectedClient.weightage}
                            </p>
                        </div>
                        <div className="mt-4">
                            <button
                                onClick={() => setSelectedClient(null)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
