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
import { sectionGradient } from "@/lib/styles/gradients";
import { cardShadow } from "@/lib/styles/shadows";
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
        <Section className={sectionGradient}>
            <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6">
                <div className="max-w-2xl">
                    {headerTitle ? (
                        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                            {headerTitle}
                        </h1>
                    ) : null}
                    {headerBody ? (
                        <p className="mt-3 text-base text-slate-600">{headerBody}</p>
                    ) : null}
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <Card key={project.id} className={cardShadow}>
                            <div className="flex items-center justify-between gap-3">
                                <h2 className="text-lg font-semibold text-slate-900">
                                    {project.name}
                                </h2>
                                <Badge>{project.status}</Badge>
                            </div>
                            {project.description ? (
                                <p className="mt-3 text-sm text-slate-600">
                                    {project.description}
                                </p>
                            ) : null}
                        </Card>
                    ))}
                </div>
            </div>
        </Section>
    );
}
