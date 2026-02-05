import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import {
    findBlockByIdentifier,
    getContentBlocks,
    resolveText,
} from "@/lib/public-content";

export const metadata: Metadata = {
    title: {
        default: "Startup Platform",
        template: "%s | Startup Platform",
    },
    description: "Public-facing startup platform website.",
};

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const blocks = await getContentBlocks();
    const siteNameBlock = findBlockByIdentifier(blocks, [
        "site-name",
        "brand",
        "company-name",
    ]);
    const navCtaBlock = findBlockByIdentifier(blocks, [
        "nav-cta",
        "header-cta",
    ]);
    const footerBlock = findBlockByIdentifier(blocks, [
        "footer",
        "footer-text",
        "footer-copy",
    ]);

    const siteName = resolveText(siteNameBlock, ["title", "name", "content"]);
    const navCtaLabel = resolveText(navCtaBlock, ["label", "title", "name"]);
    const navCtaHref =
        resolveText(navCtaBlock, ["href", "link", "url"]) ?? "/contact";
    const footerText = resolveText(footerBlock, [
        "body",
        "content",
        "description",
        "summary",
        "text",
    ]);

    return (
        <div className="min-h-screen bg-white text-slate-900">
            <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <Link href="/" className="text-lg font-semibold text-slate-900">
                        {siteName ?? <span className="sr-only">Home</span>}
                    </Link>
                    <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
                        <Link className="hover:text-slate-900" href="/">
                            Home
                        </Link>
                        <Link className="hover:text-slate-900" href="/services">
                            Services
                        </Link>
                        <Link className="hover:text-slate-900" href="/work">
                            Work
                        </Link>
                        <Link className="hover:text-slate-900" href="/about">
                            About
                        </Link>
                        <Link className="hover:text-slate-900" href="/contact">
                            Contact
                        </Link>
                    </nav>
                    {navCtaLabel ? (
                        <Button href={navCtaHref} variant="secondary" size="sm">
                            {navCtaLabel}
                        </Button>
                    ) : null}
                </div>
            </header>

            <main>{children}</main>

            <footer className="border-t border-slate-200/70 bg-slate-50">
                <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-10 text-sm text-slate-500">
                    {siteName ? (
                        <span className="font-medium text-slate-700">{siteName}</span>
                    ) : null}
                    {footerText ? <span>{footerText}</span> : null}
                </div>
            </footer>
        </div>
    );
}
