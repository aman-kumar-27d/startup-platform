import Link from "next/link";
import { PageKey } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { SEOForm } from "../components/SEOForm";

const PAGE_KEY_LABELS: Record<PageKey, string> = {
    HOME: "Home",
    SERVICES: "Services",
    WORK: "Work / Portfolio",
    ABOUT: "About",
    CONTACT: "Contact",
};

interface SEOPageProps {
    params: Promise<{ pageKey: string }>;
}

export default async function SEOEditorPage({ params }: SEOPageProps) {
    const { pageKey } = await params;
    // Fetch existing PageSEO data if it exists
    const existingPageSEO = await prisma.pageSEO.findUnique({
        where: { pageKey: pageKey as PageKey },
    });

    return (
        <div className="max-w-2xl">
            <Link
                href="/internal/seo"
                className="text-blue-600 hover:text-blue-800 font-medium inline-block mb-6"
            >
                ← Back to SEO Management
            </Link>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Edit {PAGE_KEY_LABELS[pageKey as PageKey]} SEO
            </h1>
            <p className="text-gray-600 mb-6">
                Update the SEO metadata for this page. All changes take effect immediately.
            </p>

            <SEOForm
                pageKey={pageKey as PageKey}
                initialData={existingPageSEO}
                onSuccess={() => {
                    // Page will remain the same, form will show success message
                }}
            />
        </div>
    );
}
