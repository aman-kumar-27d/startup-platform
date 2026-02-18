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
        <div className="bg-white">
            {/* Hero Section */}
            <Section className={`${warmGradientLight} py-20 sm:py-28 lg:py-32`}>
                <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
                    <div className="max-w-3xl">
                        {heroTitle ? (
                            <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
                                {heroTitle}
                            </h1>
                        ) : null}
                        {heroBody ? (
                            <p className="mt-6 text-lg text-slate-600 leading-relaxed">{heroBody}</p>
                        ) : null}
                    </div>
                </div>
            </Section>

            {/* Values Asymmetric Layout */}
            {values.length > 0 && (
                <Section className={cardSectionGradient}>
                    <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
                            {values.map((block, index) => {
                                const isWide = index === 0;
                                const rowSpan = isWide ? "lg:row-span-2" : "";
                                const colSpan = isWide ? "lg:col-span-2" : "";

                                return (
                                    <Card
                                        key={block.id}
                                        index={index}
                                        floating
                                        className={`${rowSpan} ${colSpan} transition-all duration-500 ${isWide ? "p-8" : "p-6"
                                            }`}
                                    >
                                        {block.title && (
                                            <h2
                                                className={`font-semibold text-slate-900 ${isWide ? "text-xl" : "text-lg"
                                                    }`}
                                            >
                                                {block.title}
                                            </h2>
                                        )}
                                        {block.description && (
                                            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
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

            {/* CTA Section */}
            {(ctaTitle || ctaBody) && (
                <Section className={`border-t border-slate-100 ${warmGradientLight}`}>
                    <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
                        <div className="max-w-3xl">
                            {ctaTitle ? (
                                <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                                    {ctaTitle}
                                </h2>
                            ) : null}
                            {ctaBody ? (
                                <p className="mt-6 text-lg text-slate-600 leading-relaxed">{ctaBody}</p>
                            ) : null}
                        </div>
                    </div>
                </Section>
            )}
        </div>
    );
}