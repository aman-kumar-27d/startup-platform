import Link from "next/link";
import { PageKey } from "@prisma/client";
import { Card } from "@/components/ui/Card";

const PAGES: Array<{ key: PageKey; label: string; description: string }> = [
    { key: "HOME", label: "Home", description: "Landing page and main entry point" },
    { key: "SERVICES", label: "Services", description: "Services offered by the company" },
    { key: "WORK", label: "Work / Portfolio", description: "Project showcase and portfolio" },
    { key: "ABOUT", label: "About", description: "Company mission and team information" },
    { key: "CONTACT", label: "Contact", description: "Contact form and information" },
];

export default async function SEOPage() {
    return (
        <div className="max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">SEO Management</h1>
                <p className="text-gray-600 mt-2">
                    Manage the SEO metadata for all public pages. Changes are applied immediately without requiring a redeploy.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {PAGES.map((page) => (
                    <Link key={page.key} href={`/internal/seo/${page.key}`}>
                        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">{page.label}</h2>
                                    <p className="text-gray-600 text-sm mt-2">{page.description}</p>
                                </div>
                                <span className="text-gray-400 text-2xl">→</span>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
