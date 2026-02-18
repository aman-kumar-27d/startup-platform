import type { Metadata } from "next";

import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import {
    findBlockByIdentifier,
    getContentBlocks,
    getServices,
    resolveText,
} from "@/lib/public-content";
import { warmGradientLight, cardSectionGradient } from "@/lib/styles/gradients";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
    return generatePageMetadata("SERVICES");
}

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

            {/* Asymmetric Services Layout */}
            <Section className={cardSectionGradient}>
                <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
                        {serviceCards.map((service, index) => {
                            // Create asymmetric layout pattern
                            const isWide = index % 5 === 0;
                            const isTall = index % 7 === 2;
                            const rowSpan = isTall ? "lg:row-span-2" : "";
                            const colSpan = isWide && index % 2 === 0 ? "lg:col-span-2" : "";

                            return (
                                <Card
                                    key={service.id}
                                    index={index}
                                    floating
                                    className={`${rowSpan} ${colSpan} transition-all duration-500 ${isWide || isTall ? "p-8" : "p-6"
                                        }`}
                                >
                                    {service.icon ? (
                                        <span
                                            className={`${isWide || isTall ? "text-5xl" : "text-4xl"
                                                }`}
                                            aria-hidden
                                        >
                                            {service.icon}
                                        </span>
                                    ) : null}
                                    {service.title ? (
                                        <h2
                                            className={`mt-5 font-semibold text-slate-900 ${isWide || isTall
                                                    ? "text-xl"
                                                    : "text-lg"
                                                }`}
                                        >
                                            {service.title}
                                        </h2>
                                    ) : null}
                                    {service.description ? (
                                        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                                            {service.description}
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
