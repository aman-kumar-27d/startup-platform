"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function CreateServicePage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [icon, setIcon] = useState("");
    const [order, setOrder] = useState("0");
    const [isPublished, setIsPublished] = useState(false);

    const isAdmin = session?.user?.role === "ADMIN";

    if (status === "loading") {
        return <div className="p-6">Loading...</div>;
    }

    if (!isAdmin) {
        return (
            <div className="space-y-4 p-6">
                <div className="text-red-600">Access denied. Admin users only.</div>
                <Link
                    href="/internal/services"
                    className="text-blue-600 hover:underline"
                >
                    Back to Services
                </Link>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!name.trim()) {
            setError("Name is required");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("/api/internal/services", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name.trim(),
                    description: description.trim() || undefined,
                    icon: icon.trim() || undefined,
                    order: parseInt(order, 10),
                    isPublished,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to create service");
            }

            router.push("/internal/services");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-slate-500">Content Management</p>
                <h1 className="text-2xl font-bold text-slate-900">Create Service</h1>
            </div>

            {error && (
                <div className="rounded bg-red-50 p-4 text-red-700">
                    Error: {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-slate-200 bg-white p-6 shadow">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                        Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full rounded border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        placeholder="Product Strategy"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="mt-1 block w-full rounded border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        placeholder="A short description of the service..."
                    />
                </div>

                <div>
                    <label htmlFor="icon" className="block text-sm font-medium text-slate-700">
                        Icon
                    </label>
                    <input
                        type="text"
                        id="icon"
                        value={icon}
                        onChange={(e) => setIcon(e.target.value)}
                        className="mt-1 block w-full rounded border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        placeholder=":rocket:"
                    />
                </div>

                <div>
                    <label htmlFor="order" className="block text-sm font-medium text-slate-700">
                        Display Order
                    </label>
                    <p className="text-xs text-slate-500 mb-1">
                        Lower numbers appear first
                    </p>
                    <input
                        type="number"
                        id="order"
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                        className="mt-1 block w-32 rounded border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="isPublished"
                        checked={isPublished}
                        onChange={(e) => setIsPublished(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="isPublished" className="ml-2 block text-sm text-slate-700">
                        Publish immediately
                    </label>
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Create Service"}
                    </button>
                    <Link
                        href="/internal/services"
                        className="rounded border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
