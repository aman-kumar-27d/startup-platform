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
import { sectionGradient } from "@/lib/styles/gradients";
import { cardShadow } from "@/lib/styles/shadows";
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
                    {contactCards.length ? (
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
                                        className={cardShadow}
                                    >
                                        {title ? (
                                            <h2 className="text-lg font-semibold text-slate-900">
                                                {title}
                                            </h2>
                                        ) : null}
                                        {body ? (
                                            <p className="mt-2 text-sm text-slate-600">{body}</p>
                                        ) : null}
                                        {href && title ? (
                                            <Link
                                                href={href}
                                                className="mt-4 inline-flex text-sm font-medium text-slate-900 underline-offset-4 hover:underline"
                                            >
                                                {title}
                                            </Link>
                                        ) : null}
                                    </Card>
                                );
                            })}
                        </div>
                    ) : null}
                    {ctaLabel && ctaHref ? (
                        <div>
                            <Link
                                href={ctaHref}
                                className="inline-flex items-center text-sm font-semibold text-slate-900 underline-offset-4 hover:underline"
                            >
                                {ctaLabel}
                            </Link>
                        </div>
                    ) : null}
                </div>
            </Section>
        </div>
    );
}
