"use client";

import { PageKey } from "@prisma/client";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";

interface PageSEOData {
    pageKey: PageKey;
    title: string;
    description: string;
    keywords?: string | null;
    ogTitle?: string | null;
    ogDescription?: string | null;
    ogImage?: string | null;
    noIndex: boolean;
}

interface SEOFormProps {
    initialData?: PageSEOData | null;
    pageKey: PageKey;
    onSuccess?: () => void;
}

const PAGE_KEY_LABELS: Record<PageKey, string> = {
    HOME: "Home",
    SERVICES: "Services",
    WORK: "Work / Portfolio",
    ABOUT: "About",
    CONTACT: "Contact",
};

export function SEOForm({ initialData, pageKey, onSuccess }: SEOFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState<PageSEOData>(
        initialData || {
            pageKey,
            title: "",
            description: "",
            keywords: "",
            ogTitle: "",
            ogDescription: "",
            ogImage: "",
            noIndex: false,
        }
    );

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, type } = e.target;
        const value =
            type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch("/api/internal/seo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to save SEO");
            }

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            onSuccess?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">
                    {PAGE_KEY_LABELS[pageKey]}
                </h3>
                <p className="text-sm text-blue-800">
                    Edit SEO metadata for this page. All changes are applied immediately without requiring a redeploy.
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm">
                    SEO settings saved successfully!
                </div>
            )}

            {/* Title */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Page Title *
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Services | Startup Platform"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                    This appears in browser tabs and search results
                </p>
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Description *
                </label>
                <textarea
                    id="description"
                    name="description"
                    required
                    rows={2}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="A brief description of this page content (50-160 characters recommended)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                    {formData.description.length} characters (optimal: 50-160)
                </p>
            </div>

            {/* Keywords */}
            <div>
                <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-1">
                    Keywords (Optional)
                </label>
                <input
                    type="text"
                    id="keywords"
                    name="keywords"
                    value={formData.keywords || ""}
                    onChange={handleChange}
                    placeholder="e.g., startup, services, platform"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Comma-separated keywords. Less important for modern SEO but still useful
                </p>
            </div>

            {/* OG Title */}
            <div>
                <label htmlFor="ogTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Open Graph Title (Optional)
                </label>
                <input
                    type="text"
                    id="ogTitle"
                    name="ogTitle"
                    value={formData.ogTitle || ""}
                    onChange={handleChange}
                    placeholder="Title for social media sharing"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Used when shared on social media (like Facebook, LinkedIn)
                </p>
            </div>

            {/* OG Description */}
            <div>
                <label htmlFor="ogDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Open Graph Description (Optional)
                </label>
                <textarea
                    id="ogDescription"
                    name="ogDescription"
                    rows={2}
                    value={formData.ogDescription || ""}
                    onChange={handleChange}
                    placeholder="Description for social media sharing"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Used when shared on social media (if left empty, meta description is used)
                </p>
            </div>

            {/* OG Image */}
            <div>
                <label htmlFor="ogImage" className="block text-sm font-medium text-gray-700 mb-1">
                    Open Graph Image URL (Optional)
                </label>
                <input
                    type="url"
                    id="ogImage"
                    name="ogImage"
                    value={formData.ogImage || ""}
                    onChange={handleChange}
                    placeholder="e.g., https://example.com/og-image.png"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Image displayed when shared on social media (recommended: 1200x630px)
                </p>
            </div>

            {/* No Index */}
            <div>
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="noIndex"
                        checked={formData.noIndex}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                        Hide from Search Engines (No Index)
                    </span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                    Enable this to prevent search engines from indexing this page
                </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
                >
                    {isLoading ? "Saving..." : "Save SEO Settings"}
                </Button>
            </div>
        </form>
    );
}
