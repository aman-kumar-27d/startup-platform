import type { Metadata } from "next";
import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import {
    filterBlocksByIdentifierPrefix,
    findBlockByIdentifier,
    getContentBlocks,
    resolveIdentifier,
    resolveText,
} from "@/lib/public-content";
import { cardSectionGradient, warmGradientLight } from "@/lib/styles/gradients";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
    return generatePageMetadata("CONTACT");
}

/**
 * Contact page - Multiple contact methods and channels
 * Responsive grid: 1 column mobile, 2 tablet, 3 desktop
 * Optimized for touch interaction with larger touch targets
 */
export default async function ContactPage() {
    const blocks = await getContentBlocks();

    const heroBlock = findBlockByIdentifier(blocks, [
        "contact",
        "contact-hero",
        "contact-page",
    ]);
    const heroTitle = resolveText(heroBlock, ["title", "headline", "name"]);
    const heroBody = resolveText(heroBlock, [
        "description",
        "body",
        "content",
        "summary",
    ]);

    const ctaBlock = findBlockByIdentifier(blocks, [
        "contact-cta",
        "contact-action",
    ]);
    const ctaLabel = resolveText(ctaBlock, ["label", "title", "name"]);
    const ctaHref = resolveText(ctaBlock, ["href", "link", "url"]);

    const contactCards = filterBlocksByIdentifierPrefix(blocks, [
        "contact-item",
        "contact-method",
        "contact-channel",
    ]);

    return (
        <div className="bg-white scroll-smooth">
            {/* Hero Section - Page introduction */}
            <Section className={`${warmGradientLight} py-16 sm:py-24 md:py-32`}>
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
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

            {/* Contact Methods Grid - Responsive layout */}
            {contactCards.length ? (
                <Section className={cardSectionGradient}>
                    <div className="mx-auto max-w-6xl px-4 sm:px-6">
                        {/* Grid: 1 column mobile, 2 tablet, 3 desktop */}
                        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {contactCards.map((card, index) => {
                                const title = resolveText(card, ["title", "headline", "name"]);
                                const body = resolveText(card, [
                                    "description",
                                    "body",
                                    "content",
                                    "summary",
                                ]);
                                const href = resolveText(card, ["href", "link", "url"]);

                                return (
                                    <Card
                                        key={resolveIdentifier(card) ?? `contact-${index}`}
                                        index={index}
                                        floating
                                        className="transition-all duration-300 hover:-translate-y-1 p-5 sm:p-6"
                                    >
                                        {title ? (
                                            <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                                                {title}
                                            </h2>
                                        ) : null}
                                        {body ? (
                                            <p className="mt-2 sm:mt-3 text-sm text-slate-600 leading-relaxed">
                                                {body}
                                            </p>
                                        ) : null}
                                        {href && title ? (
                                            <Link
                                                href={href}
                                                className="mt-4 sm:mt-6 inline-flex text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                                            >
                                                {title} →
                                            </Link>
                                        ) : null}
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </Section>
            ) : null}

            {/* CTA Section - Final call to action */}
            {ctaLabel && ctaHref ? (
                <Section className={`border-t border-slate-100 ${warmGradientLight}`}>
                    <div className="mx-auto max-w-6xl px-4 sm:px-6">
                        <div className="max-w-3xl">
                            <p className="text-base sm:text-lg text-slate-600 mb-4 sm:mb-6">
                                Ready to get started?
                            </p>
                            <Link
                                href={ctaHref}
                                className="inline-flex items-center text-lg sm:text-xl font-semibold text-slate-900 underline-offset-4 hover:underline transition-all"
                            >
                                {ctaLabel} →
                            </Link>
                        </div>
                    </div>
                </Section>
            ) : null}
        </div>
    );
}
