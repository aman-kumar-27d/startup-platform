import type { Metadata } from "next";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import {
    findBlockByIdentifier,
    getContentBlocks,
    getPublicProjects,
    resolveText,
} from "@/lib/public-content";
import { warmGradientLight, cardSectionGradient } from "@/lib/styles/gradients";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
    return generatePageMetadata("WORK");
}

/**
 * Work page - Portfolio of completed projects
 * Responsive grid layout: 1 column mobile, 2 tablet, 3 desktop
 * Simplified card design optimized for touch devices
 */
export default async function WorkPage() {
    const [blocks, projects] = await Promise.all([
        getContentBlocks(),
        getPublicProjects(),
    ]);

    const headerBlock = findBlockByIdentifier(blocks, [
        "work",
        "work-page",
        "projects",
    ]);
    const headerTitle = resolveText(headerBlock, ["title", "headline", "name"]);
    const headerBody = resolveText(headerBlock, [
        "description",
        "body",
        "content",
        "summary",
    ]);

    return (
        <div className="bg-white scroll-smooth">
            {/* Hero Section - Page introduction */}
            <Section className={`${warmGradientLight} py-16 sm:py-24 md:py-32`}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
                    <div className="max-w-3xl">
                        {headerTitle ? (
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                                {headerTitle}
                            </h1>
                        ) : null}
                        {headerBody ? (
                            <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-lg text-slate-600 leading-relaxed">
                                {headerBody}
                            </p>
                        ) : null}
                    </div>
                </div>
            </Section>

            {/* Projects Grid - Responsive layout with asymmetric cards on desktop */}
            <Section className={cardSectionGradient}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
                    {/* Grid: 1 column mobile, 2 tablet, 3 desktop with optional row/col spanning on lg */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-max">
                        {projects.map((project, index) => {
                            // Asymmetric layout for desktop only - inaccessible on mobile
                            const isWide = index % 4 === 0;
                            const isTall = index % 6 === 3;
                            const rowSpan = isTall ? "lg:row-span-2" : "";
                            const colSpan = isWide && index % 2 === 0 ? "lg:col-span-2" : "";

                            return (
                                <Card
                                    key={project.id}
                                    index={index}
                                    floating
                                    className={`${rowSpan} ${colSpan} transition-all duration-300 hover:-translate-y-1 ${isWide || isTall ? "p-6 sm:p-8" : "p-5 sm:p-6"
                                        }`}
                                >
                                    {/* Status badge */}
                                    <div className="flex items-start justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
                                        <h2
                                            className={`font-semibold text-slate-900 flex-1 ${isWide || isTall ? "text-lg sm:text-xl" : "text-base sm:text-lg"
                                                }`}
                                        >
                                            {project.name}
                                        </h2>
                                        {project.status && <Badge>{project.status}</Badge>}
                                    </div>

                                    {/* Project description */}
                                    {project.description ? (
                                        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                                            {project.description}
                                        </p>
                                    ) : null}

                                    {/* Learn more link */}
                                    <div className="mt-4 sm:mt-6">
                                        <a
                                            href={`/work/${project.id}`}
                                            className="inline-flex text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                                        >
                                            Explore Project →
                                        </a>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </Section>
        </div>
    );
}

