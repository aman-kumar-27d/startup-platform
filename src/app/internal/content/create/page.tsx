"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function CreateContentPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [key, setKey] = useState("");
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [description, setDescription] = useState("");
    const [ctaText, setCtaText] = useState("");
    const [ctaLink, setCtaLink] = useState("");
    const [order, setOrder] = useState("0");
    const [isPublished, setIsPublished] = useState(false);

    const isAdmin = session?.user?.role === "ADMIN";

    // Redirect if not admin or not authenticated
    if (status === "loading") {
        return <div className="p-6">Loading...</div>;
    }

    if (!isAdmin) {
        return (
            <div className="space-y-4 p-6">
                <div className="text-red-600">Access denied. Admin users only.</div>
                <Link
                    href="/internal/content"
                    className="text-blue-600 hover:underline"
                >
                    Back to Content Blocks
                </Link>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validate required fields
        if (!key.trim()) {
            setError("Key is required");
            return;
        }

        if (!title.trim()) {
            setError("Title is required");
            return;
        }

        // Validate key format (uppercase, underscores only)
        const keyRegex = /^[A-Z_]+$/;
        if (!keyRegex.test(key.trim())) {
            setError("Key must contain only uppercase letters and underscores (e.g., HOME_HERO)");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("/api/internal/content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    key: key.trim(),
                    title: title.trim(),
                    subtitle: subtitle.trim() || undefined,
                    description: description.trim() || undefined,
                    ctaText: ctaText.trim() || undefined,
                    ctaLink: ctaLink.trim() || undefined,
                    order: parseInt(order, 10),
                    isPublished,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to create content block");
            }

            // Redirect to content list
            router.push("/internal/content");
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
                <h1 className="text-2xl font-bold text-slate-900">Create Content Block</h1>
            </div>

            {error && (
                <div className="rounded bg-red-50 p-4 text-red-700">
                    Error: {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-slate-200 bg-white p-6 shadow">
                <div>
                    <label htmlFor="key" className="block text-sm font-medium text-slate-700">
                        Key <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-slate-500 mb-1">
                        Unique identifier (e.g., HOME_HERO, ABOUT_INTRO). Uppercase and underscores only.
                    </p>
                    <input
                        type="text"
                        id="key"
                        value={key}
                        onChange={(e) => setKey(e.target.value.toUpperCase())}
                        className="mt-1 block w-full rounded border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        placeholder="HOME_HERO"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-slate-700">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full rounded border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        placeholder="Welcome to Our Platform"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="subtitle" className="block text-sm font-medium text-slate-700">
                        Subtitle
                    </label>
                    <input
                        type="text"
                        id="subtitle"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        className="mt-1 block w-full rounded border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        placeholder="Build your next big idea"
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
                        placeholder="A longer description of this content block..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="ctaText" className="block text-sm font-medium text-slate-700">
                            CTA Text
                        </label>
                        <input
                            type="text"
                            id="ctaText"
                            value={ctaText}
                            onChange={(e) => setCtaText(e.target.value)}
                            className="mt-1 block w-full rounded border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                            placeholder="Get Started"
                        />
                    </div>

                    <div>
                        <label htmlFor="ctaLink" className="block text-sm font-medium text-slate-700">
                            CTA Link
                        </label>
                        <input
                            type="text"
                            id="ctaLink"
                            value={ctaLink}
                            onChange={(e) => setCtaLink(e.target.value)}
                            className="mt-1 block w-full rounded border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                            placeholder="/contact"
                        />
                    </div>
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
                        {loading ? "Creating..." : "Create Content Block"}
                    </button>
                    <Link
                        href="/internal/content"
                        className="rounded border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
