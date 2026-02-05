import type { Metadata } from "next";

import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import {
    getContentByKeys,
} from "@/lib/public-content";
import { sectionGradient } from "@/lib/styles/gradients";
import { cardShadow } from "@/lib/styles/shadows";

export const metadata: Metadata = {
    title: "About",
    description: "About the startup platform team and mission.",
};

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
    const values = [value1, value2, value3].filter(Boolean);

    const ctaBlock = contentMap.get("ABOUT_CTA");
    const ctaTitle = ctaBlock?.title;
    const ctaBody = ctaBlock?.description;

    return (
        <div>
            <Section className={sectionGradient}>
                <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6">
                    <div className="max-w-2xl">
                        {heroTitle ? (
                            <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                                {heroTitle}
                            </h1>
                        ) : null}
                        {heroBody ? (
                            <p className="mt-3 text-base text-slate-600">{heroBody}</p>
                        ) : null}
                    </div>
                    {values.length > 0 && (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {values.map((block) => (
                                <Card
                                    key={block.id}
                                    className={cardShadow}
                                >
                                    {block.title && (
                                        <h2 className="text-lg font-semibold text-slate-900">
                                            {block.title}
                                        </h2>
                                    )}
                                    {block.description && (
                                        <p className="mt-2 text-sm text-slate-600">
                                            {block.description}
                                        </p>
                                    )}
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </Section>

            {(ctaTitle || ctaBody) && (
                <Section className="border-t border-slate-100">
                    <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6">
                        {ctaTitle ? (
                            <h2 className="text-2xl font-semibold text-slate-900">
                                {ctaTitle}
                            </h2>
                        ) : null}
                        {ctaBody ? (
                            <p className="max-w-2xl text-base text-slate-600">{ctaBody}</p>
                        ) : null}
                    </div>
                </Section>
            )}
        </div>
    );
}
