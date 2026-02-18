import type { Metadata } from "next";
// import Link from "next/link";

// import { Button } from "@/components/ui/Button";
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
    description: "A modern platform for startup management and growth.",
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
    // const navCtaBlock = findBlockByIdentifier(blocks, [
    //     "nav-cta",
    //     "header-cta",
    // ]);
    const footerBlock = findBlockByIdentifier(blocks, [
        "footer",
        "footer-text",
        "footer-copy",
    ]);

    const siteName = resolveText(siteNameBlock, ["title", "name", "content"]);
    // const navCtaLabel = resolveText(navCtaBlock, ["label", "title", "name"]);
    // const navCtaHref =
    //     resolveText(navCtaBlock, ["href", "link", "url"]) ?? "/contact";
    const footerText = resolveText(footerBlock, [
        "body",
        "content",
        "description",
        "summary",
        "text",
    ]);

    return (
        <div className="min-h-screen bg-white text-slate-900">
            {/* Glass Header */}
            {/* {
             <header className="sticky top-0 z-40 border-b border-white/10 bg-white/20 backdrop-blur-2xl transition-all duration-300">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12 py-4">
                   
                    <Link
                        href="/"
                        className="flex items-center gap-3 transition-all duration-300 group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-orange-500 to-orange-600 group-hover:shadow-lg group-hover:shadow-orange-500/40 transition-all duration-300" />
                        <span className="font-bold text-lg text-slate-900">
                            {siteName ?? <span className="sr-only">Home</span>}
                        </span>
                    </Link>

                   
                    <nav className="hidden items-center gap-8 text-sm md:flex">
                        {[
                            { href: "/", label: "Home" },
                            { href: "/services", label: "Services" },
                            { href: "/work", label: "Work" },
                            { href: "/about", label: "About" },
                            { href: "/contact", label: "Contact" },
                        ].map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="font-medium text-slate-600 transition-colors duration-200 hover:text-orange-600"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    
                    {navCtaLabel ? (
                        <Button href={navCtaHref} variant="primary" size="sm">
                            {navCtaLabel}
                        </Button>
                    ) : null}
                </div>
            </header>
           } */}

            <main>{children}</main>

            {/* Premium Footer */}
            <footer className="bg-neutral-900 pt-32 pb-12 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-32">
                        <div className="md:col-span-2">
                            <h4 className="text-white text-3xl font-bold mb-6">{siteName} Local</h4>
                            {footerText ? (
                            <p className="text-neutral-400 max-w-sm mb-8">
                                {footerText}
                            </p>
                                ) : null}
                            <div className="flex gap-4">
                                <div
                                    className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white cursor-pointer transition-all">
                                    <span className="material-symbols-outlined text-xl">share</span>
                                </div>
                                <div
                                    className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white cursor-pointer transition-all">
                                    <span className="material-symbols-outlined text-xl">hub</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h5 className="text-white font-semibold mb-6">Platform</h5>
                            <ul className="space-y-4 text-neutral-400 text-sm">
                                <li><a className="hover:text-white transition-colors" href="#">Pricing</a></li>
                                <li><a className="hover:text-white transition-colors" href="#">Integrations</a></li>
                                <li><a className="hover:text-white transition-colors" href="#">Changelog</a></li>
                                <li><a className="hover:text-white transition-colors" href="#">Roadmap</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="text-white font-semibold mb-6">Company</h5>
                            <ul className="space-y-4 text-neutral-400 text-sm">
                                <li><a className="hover:text-white transition-colors" href="#">About</a></li>
                                <li><a className="hover:text-white transition-colors" href="#">Careers</a></li>
                                <li><a className="hover:text-white transition-colors" href="#">Blog</a></li>
                                <li><a className="hover:text-white transition-colors" href="#">Privacy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-neutral-800 pt-12">
                        <h2
                            className="text-[12rem] md:text-[20rem] font-black text-neutral-800/70 select-none leading-none tracking-tighter whitespace-nowrap text-center -mb-20">
                            BrandNAME
                        </h2>
                        <div className="flex flex-col md:flex-row justify-between items-center text-neutral-500 text-xs mt-10">
                            <p>© {new Date().getFullYear()} All rights reserved.</p>
                            <div className="flex gap-8 mt-4 md:mt-0">
                                <a className="hover:text-white" href="#">Status</a>
                                <a className="hover:text-white" href="#">API Reference</a>
                                <a className="hover:text-white" href="#">Contact Sales</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
