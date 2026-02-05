import type { Metadata } from "next";

import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import {
    findBlockByIdentifier,
    getContentBlocks,
    getServices,
    resolveText,
} from "@/lib/public-content";
import { sectionGradient } from "@/lib/styles/gradients";
import { cardShadow } from "@/lib/styles/shadows";

export const metadata: Metadata = {
    title: "Services",
    description: "Published services offered by the startup platform.",
};

export default async function ServicesPage() {
    const [blocks, services] = await Promise.all([
        getContentBlocks(),
        getServices(),
    ]);

    const headerBlock = findBlockByIdentifier(blocks, [
        "services",
        "services-page",
        "services-hero",
    ]);
    const headerTitle = resolveText(headerBlock, ["title", "headline", "name"]);
    const headerBody = resolveText(headerBlock, [
        "description",
        "body",
        "content",
        "summary",
    ]);

    const serviceCards = services.map((service, index) => ({
        id: resolveText(service, ["id"]) ?? `service-${index}`,
        title: resolveText(service, ["title", "name", "label"]),
        description: resolveText(service, [
            "description",
            "summary",
            "body",
            "content",
        ]),
        icon: resolveText(service, ["icon", "emoji", "symbol"]),
    }));

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
                    {serviceCards.map((service) => (
                        <Card key={service.id} className={cardShadow}>
                            {service.icon ? (
                                <span className="text-2xl" aria-hidden>
                                    {service.icon}
                                </span>
                            ) : null}
                            {service.title ? (
                                <h2 className="mt-4 text-lg font-semibold text-slate-900">
                                    {service.title}
                                </h2>
                            ) : null}
                            {service.description ? (
                                <p className="mt-2 text-sm text-slate-600">
                                    {service.description}
                                </p>
                            ) : null}
                        </Card>
                    ))}
                </div>
            </div>
        </Section>
    );
}
