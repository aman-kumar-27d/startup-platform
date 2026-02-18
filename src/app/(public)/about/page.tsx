import type { Metadata } from "next";

import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import {
    getContentByKeys,
} from "@/lib/public-content";
import { warmGradientLight, cardSectionGradient } from "@/lib/styles/gradients";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
    return generatePageMetadata("ABOUT");
}

/**
 * About page - Company story and value proposition
 * Responsive design optimized for mobile, tablet, and desktop
 * Uses Card components with responsive grid layout
 */
export default async function AboutPage() {
    const contentMap = await getContentByKeys([
        "ABOUT_HERO",
        "ABOUT_VALUE_1",
        "ABOUT_VALUE_2",
        "ABOUT_VALUE_3",
        "ABOUT_CTA",
    ]);

    const heroBlock = contentMap.get("ABOUT_HERO");
    const heroTitle = heroBlock?.title;
    const heroBody = heroBlock?.description;

    const value1 = contentMap.get("ABOUT_VALUE_1");
    const value2 = contentMap.get("ABOUT_VALUE_2");
    const value3 = contentMap.get("ABOUT_VALUE_3");
    const values = [value1, value2, value3].filter((v) => v !== undefined && v !== null);

    const ctaBlock = contentMap.get("ABOUT_CTA");
    const ctaTitle = ctaBlock?.title;
    const ctaBody = ctaBlock?.description;

    return (
        <div className="bg-white scroll-smooth">
            {/* Hero Section - Page introduction with brand story */}
            <Section className={`${warmGradientLight} py-16 sm:py-24 md:py-32`}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
                    <div className="max-w-3xl">
                        {heroTitle ? (
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                                {heroTitle}
                            </h1>
                        ) : null}
                        {heroBody ? (
                            <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-lg text-slate-600 leading-relaxed">
                                {heroBody}
                            </p>
                        ) : null}
                    </div>
                </div>
            </Section>

            {/* Values Grid - Asymmetric card layout with responsive columns */}
            {values.length > 0 && (
                <Section className={cardSectionGradient}>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
                        {/* Grid: 1 column mobile, 2 tablet, 3 desktop with auto-row spanning on lg */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-max">
                            {values.map((block, index) => {
                                // First card spans wider on desktop for visual hierarchy
                                const isWide = index === 0;
                                const rowSpan = isWide ? "lg:row-span-2" : "";
                                const colSpan = isWide ? "lg:col-span-2" : "";

                                return (
                                    <Card
                                        key={block.id}
                                        index={index}
                                        floating
                                        className={`${rowSpan} ${colSpan} transition-all duration-500 ${isWide ? "p-6 sm:p-8" : "p-5 sm:p-6"
                                            }`}
                                    >
                                        {block.title && (
                                            <h2
                                                className={`font-semibold text-slate-900 ${isWide ? "text-lg sm:text-xl" : "text-base sm:text-lg"
                                                    }`}
                                            >
                                                {block.title}
                                            </h2>
                                        )}
                                        {block.description && (
                                            <p className="mt-2 sm:mt-3 text-sm text-slate-600 leading-relaxed">
                                                {block.description}
                                            </p>
                                        )}
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </Section>
            )}

            {/* CTA Section - Call to action for engagement */}
            {(ctaTitle || ctaBody) && (
                <Section className={`border-t border-slate-100 ${warmGradientLight}`}>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
                        <div className="max-w-3xl">
                            {ctaTitle ? (
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                                    {ctaTitle}
                                </h2>
                            ) : null}
                            {ctaBody ? (
                                <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-600 leading-relaxed">
                                    {ctaBody}
                                </p>
                            ) : null}
                        </div>
                    </div>
                </Section>
            )}
        </div>
    );
}