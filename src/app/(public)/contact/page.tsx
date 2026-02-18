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
        <div className="bg-white">
            {/* Hero Section */}
            <Section className={`${warmGradientLight} py-20 sm:py-28 lg:py-32`}>
                <div className="mx-auto max-w-6xl px-6">
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

            {/* Contact Methods Grid */}
            {contactCards.length ? (
                <Section className={cardSectionGradient}>
                    <div className="mx-auto max-w-6xl px-6">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                                    >
                                        {title ? (
                                            <h2 className="text-lg font-semibold text-slate-900">
                                                {title}
                                            </h2>
                                        ) : null}
                                        {body ? (
                                            <p className="mt-3 text-sm text-slate-600 leading-relaxed">{body}</p>
                                        ) : null}
                                        {href && title ? (
                                            <Link
                                                href={href}
                                                className="mt-4 inline-flex text-sm font-medium text-orange-600 hover:text-orange-700 underline-offset-4 hover:underline"
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

            {/* CTA Section */}
            {ctaLabel && ctaHref ? (
                <Section className={`border-t border-slate-100 ${warmGradientLight}`}>
                    <div className="mx-auto max-w-6xl px-6">
                        <div className="max-w-3xl">
                            <p className="text-lg text-slate-600 mb-6">Ready to get started?</p>
                            <Link
                                href={ctaHref}
                                className="inline-flex items-center text-lg font-semibold text-slate-900 underline-offset-4 hover:underline"
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
