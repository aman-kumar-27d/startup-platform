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
        <div className="bg-white">
            {/* Hero Section */}
            <Section className={`${warmGradientLight} py-20 sm:py-28 lg:py-32`}>
                <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
                    <div className="max-w-3xl">
                        {headerTitle ? (
                            <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
                                {headerTitle}
                            </h1>
                        ) : null}
                        {headerBody ? (
                            <p className="mt-6 text-lg text-slate-600 leading-relaxed">{headerBody}</p>
                        ) : null}
                    </div>
                </div>
            </Section>

            {/* Asymmetric Projects Layout */}
            <Section className={cardSectionGradient}>
                <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
                        {projects.map((project, index) => {
                            // Create asymmetric layout pattern
                            const isWide = index % 4 === 0;
                            const isTall = index % 6 === 3;
                            const rowSpan = isTall ? "lg:row-span-2" : "";
                            const colSpan = isWide && index % 2 === 0 ? "lg:col-span-2" : "";

                            return (
                                <Card
                                    key={project.id}
                                    index={index}
                                    floating
                                    className={`${rowSpan} ${colSpan} transition-all duration-500 ${isWide || isTall ? "p-8" : "p-6"
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-3 mb-4">
                                        <h2
                                            className={`font-semibold text-slate-900 flex-1 ${isWide || isTall ? "text-xl" : "text-lg"
                                                }`}
                                        >
                                            {project.name}
                                        </h2>
                                        <Badge>{project.status}</Badge>
                                    </div>
                                    {project.description ? (
                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            {project.description}
                                        </p>
                                    ) : null}
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </Section>
        </div>
    );
}

