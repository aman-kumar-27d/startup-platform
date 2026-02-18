"use client";

type HeroProps = {
    title?: string;
    highlightedText?: string;
    subtitle?: string;
    primaryCtaText?: string;
    primaryCtaHref?: string;
    secondaryCtaText?: string;
    secondaryCtaHref?: string;
    className?: string;
};

export function Hero({
    title,
    highlightedText,
    subtitle,
    primaryCtaText,
    primaryCtaHref = "/contact",
    secondaryCtaText,
    secondaryCtaHref = "#",
}: HeroProps) {
    return (
        <header
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-tr from-amber-50 via-white to-orange-50 pt-20">
            <div className="absolute top-1/4 -left-20 w-150 h-150 bg-amber-200/20 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-1/4 -right-20 w-150 h-150 bg-orange-200/20 blur-[120px] rounded-full"></div>
            <div className="absolute inset-0 light-streak blur-3xl opacity-50 transform -rotate-12 translate-y-20"></div>
            <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                <h1 className="text-7xl md:text-8xl font-bold text-neutral-900 tracking-tighter mb-8 leading-[1.1]">
                    {title && (
                        <>
                            {title}
                            <br />
                        </>
                    )}
                    {highlightedText && (
                        <span className="bg-clip-text text-transparent bg-linear-to-r from-orange-600 to-amber-500">{highlightedText}</span>
                    )}
                </h1>
                {subtitle && (
                    <p className="text-xl md:text-2xl text-neutral-600 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
                        {subtitle}
                    </p>
                )}
                {(primaryCtaText || secondaryCtaText) && (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        {primaryCtaText && (
                            <a
                                href={primaryCtaHref}
                                className="px-8 py-4 bg-neutral-900 text-white rounded-2xl font-semibold hover:bg-neutral-800 transition-all hover:scale-105">
                                {primaryCtaText}
                            </a>
                        )}
                        {secondaryCtaText && (
                            <a
                                href={secondaryCtaHref}
                                className="px-8 py-4 bg-white/50 backdrop-blur-md border border-neutral-200 text-neutral-900 rounded-2xl font-semibold hover:bg-white/80 transition-all">
                                {secondaryCtaText}
                            </a>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}
