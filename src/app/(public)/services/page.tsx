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

/**
 * Services page - Showcase of all available services
 * Responsive grid layout: 1 column mobile, 2 tablet, 3 desktop
 * Asymmetric card sizing on desktop for visual interest
 */
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

            {/* Services Grid - Responsive layout with asymmetric cards on desktop */}
            <Section className={cardSectionGradient}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
                    {/* Grid: 1 column mobile, 2 tablet, 3 desktop with optional row/col spanning on lg */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-max">
                        {serviceCards.map((service, index) => {
                            // Asymmetric layout for desktop only
                            const isWide = index % 5 === 0;
                            const isTall = index % 7 === 2;
                            const rowSpan = isTall ? "lg:row-span-2" : "";
                            const colSpan = isWide && index % 2 === 0 ? "lg:col-span-2" : "";

                            return (
                                <Card
                                    key={service.id}
                                    index={index}
                                    floating
                                    className={`${rowSpan} ${colSpan} transition-all duration-300 hover:-translate-y-1 ${isWide || isTall ? "p-6 sm:p-8" : "p-5 sm:p-6"
                                        }`}
                                >
                                    {/* Icon section - responsive sizing */}
                                    {service.icon ? (
                                        <span
                                            className={`block ${isWide || isTall ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl"
                                                }`}
                                            aria-hidden
                                        >
                                            {service.icon}
                                        </span>
                                    ) : null}

                                    {/* Title - responsive sizing */}
                                    {service.title ? (
                                        <h2
                                            className={`mt-3 sm:mt-5 font-semibold text-slate-900 ${isWide || isTall
                                                    ? "text-lg sm:text-xl"
                                                    : "text-base sm:text-lg"
                                                }`}
                                        >
                                            {service.title}
                                        </h2>
                                    ) : null}

                                    {/* Description - responsive typography */}
                                    {service.description ? (
                                        <p className="mt-2 sm:mt-3 text-sm text-slate-600 leading-relaxed">
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
