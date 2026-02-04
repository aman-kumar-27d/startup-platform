"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ClientData, ClientHistoryEntry } from "../types";
import { ClientForm } from "../components/ClientForm";
import { HistoryTimeline } from "../components/HistoryTimeline";
import { NotesSection } from "../components/NotesSection";

interface User {
    id: string;
    email: string;
    role: string;
}

export default function ClientDetailPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const { data: session, status } = useSession();

    const [client, setClient] = useState<ClientData | null>(null);
    const [history, setHistory] = useState<ClientHistoryEntry[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    // Fetch client data
    useEffect(() => {
        if (status === "unauthenticated") return;

        const fetchClient = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/internal/clients/${id}`);
                if (!response.ok) throw new Error("Failed to fetch client");

                const data = await response.json();

                // Check access permissions
                if (
                    session?.user.role === "EMPLOYEE" &&
                    data.ownerId !== session.user.id
                ) {
                    router.push("/internal/clients");
                    return;
                }

                setClient(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch client");
            } finally {
                setIsLoading(false);
            }
        };

        fetchClient();
    }, [id, session, status, router]);

    // Fetch history
    useEffect(() => {
        if (!client) return;

        const fetchHistory = async () => {
            setHistoryLoading(true);
            try {
                const response = await fetch(
                    `/api/internal/clients/${id}/history`
                );
                if (!response.ok) throw new Error("Failed to fetch history");

                const data = await response.json();
                setHistory(data);
            } catch (err) {
                console.error("Failed to fetch history:", err);
            } finally {
                setHistoryLoading(false);
            }
        };

        fetchHistory();
    }, [client, id]);

    // Fetch users
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

    const handleUpdateClient = async (data: Partial<ClientData>) => {
        setIsSaving(true);
        try {
            const response = await fetch(`/api/internal/clients/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update client");
            }

            const updatedClient = await response.json();
            setClient(updatedClient);
            setShowEditForm(false);

            // Refetch history
            const historyResponse = await fetch(
                `/api/internal/clients/${id}/history`
            );
            if (historyResponse.ok) {
                const historyData = await historyResponse.json();
                setHistory(historyData);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update client");
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdateNotes = async (notes: string) => {
        await handleUpdateClient({ notes });
    };

    const handleArchive = async () => {
        setIsSaving(true);
        try {
            const response = await fetch(`/api/internal/clients/${id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ archive: true }),
            });

            if (!response.ok) throw new Error("Failed to archive client");

            router.push("/internal/clients?tab=archived");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to archive client");
        } finally {
            setIsSaving(false);
            setShowArchiveConfirm(false);
        }
    };

    if (status === "loading" || isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!client) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600">Client not found</p>
                <Link href="/internal/clients" className="text-blue-600 hover:underline">
                    Back to clients
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <Link
                        href="/internal/clients"
                        className="text-blue-600 hover:underline text-sm"
                    >
                        ← Back to Clients
                    </Link>
                    <h1 className="text-3xl font-bold mt-2">{client.name}</h1>
                    <p className="text-gray-600">{client.companyName}</p>
                </div>
                <div className="flex gap-2">
                    {session?.user.role === "ADMIN" && (
                        <>
                            <button
                                onClick={() => setShowEditForm(!showEditForm)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                {showEditForm ? "Cancel" : "Edit"}
                            </button>
                            <button
                                onClick={() => setShowArchiveConfirm(true)}
                                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                            >
                                Archive
                            </button>
                        </>
                    )}
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* Client Info Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border p-4">
                    <h3 className="font-semibold text-gray-700 mb-3">Contact Info</h3>
                    <div className="space-y-2 text-sm">
                        <p>
                            <span className="text-gray-600">Email:</span> {client.email}
                        </p>
                        {client.phone && (
                            <p>
                                <span className="text-gray-600">Phone:</span> {client.phone}
                            </p>
                        )}
                        {client.website && (
                            <p>
                                <span className="text-gray-600">Website:</span>{" "}
                                <a
                                    href={client.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    {client.website}
                                </a>
                            </p>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg border p-4">
                    <h3 className="font-semibold text-gray-700 mb-3">
                        Relationship Details
                    </h3>
                    <div className="space-y-2 text-sm">
                        <p>
                            <span className="text-gray-600">Status:</span>{" "}
                            {client.lifecycleStatus}
                        </p>
                        <p>
                            <span className="text-gray-600">Weightage:</span>{" "}
                            {client.weightage}
                        </p>
                        <p>
                            <span className="text-gray-600">Relationship Level:</span>{" "}
                            {client.relationshipLevel}
                        </p>
                        {client.isHighRisk && (
                            <p className="text-red-600 font-medium">
                                ⚠️ Marked as High Risk
                            </p>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg border p-4">
                    <h3 className="font-semibold text-gray-700 mb-3">Lead Metrics</h3>
                    <div className="space-y-2 text-sm">
                        <p>
                            <span className="text-gray-600">Source:</span> {client.source}
                        </p>
                        {client.leadScore !== null && (
                            <p>
                                <span className="text-gray-600">Lead Score:</span>{" "}
                                {client.leadScore}
                            </p>
                        )}
                        {client.expectedValue !== null && (
                            <p>
                                <span className="text-gray-600">Expected Value:</span> $
                                {client.expectedValue.toLocaleString()}
                            </p>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg border p-4">
                    <h3 className="font-semibold text-gray-700 mb-3">Assignment</h3>
                    <div className="space-y-2 text-sm">
                        <p>
                            <span className="text-gray-600">Owner:</span>{" "}
                            {client.owner ? client.owner.email : "Unassigned"}
                        </p>
                        <p>
                            <span className="text-gray-600">Created:</span>{" "}
                            {new Date(client.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Notes Section */}
            {!showEditForm && (
                <NotesSection
                    notes={client.notes}
                    onSave={handleUpdateNotes}
                    isLoading={isSaving}
                    readOnly={
                        session?.user.role === "ADMIN" ? false : client.ownerId !== session?.user.id
                    }
                />
            )}

            {/* Edit Form */}
            {showEditForm && session?.user.role === "ADMIN" && (
                <div className="bg-white rounded-lg border p-6">
                    <h2 className="text-xl font-semibold mb-4">Edit Client</h2>
                    <ClientForm
                        initialData={client}
                        onSubmit={handleUpdateClient}
                        users={users}
                        isLoading={isSaving}
                        canEditStatus={true}
                        canEditOwner={true}
                    />
                </div>
            )}

            {/* History Timeline */}
            <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Activity History</h2>
                <HistoryTimeline history={history} isLoading={historyLoading} />
            </div>

            {/* Archive Confirmation */}
            {showArchiveConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h2 className="text-lg font-semibold mb-4">Archive Client?</h2>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to archive {client.name}? This action can be
                            reversed.
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={handleArchive}
                                disabled={isSaving}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
                            >
                                {isSaving ? "Archiving..." : "Archive"}
                            </button>
                            <button
                                onClick={() => setShowArchiveConfirm(false)}
                                disabled={isSaving}
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
