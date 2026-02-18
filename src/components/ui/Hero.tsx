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

/**
 * Hero component - Main header section for landing pages
 * Responsive design: mobile-first approach with breakpoints for tablets and desktops
 * - Mobile: Optimized font sizes, single column CTA buttons
 * - Tablet (md): Increased sizing, side-by-side CTA buttons
 * - Desktop (lg): Full-size typography, enhanced animations
 */
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
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-tr from-amber-50 via-white to-orange-50 pt-20 sm:pt-4 scroll-smooth">
            {/* Decorative gradient orbs - hidden on mobile for performance */}
            <div className="absolute top-1/4 -left-20 w-80 sm:w-96 h-80 sm:h-96 md:w-150 md:h-150 bg-amber-200/20 blur-[80px] sm:blur-[100px] md:blur-[120px] rounded-full"></div>
            <div className="absolute bottom-1/4 -right-20 w-80 sm:w-96 h-80 sm:h-96 md:w-150 md:h-150 bg-orange-200/20 blur-[80px] sm:blur-[100px] md:blur-[120px] rounded-full"></div>
            {/* Light streak effect - reduced on mobile */}
            <div className="absolute inset-0 light-streak blur-3xl opacity-30 sm:opacity-40 md:opacity-50 transform -rotate-12 translate-y-20"></div>

            {/* Main content container */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
                {/* Main heading - responsive typography */}
                <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-neutral-900 tracking-tighter mb-6 sm:mb-8 leading-[1.1] word-break">
                    {title && (
                        <>
                            {title}
                            <br className="hidden sm:block" />
                        </>
                    )}
                    {highlightedText && (
                        <span className="bg-clip-text text-transparent bg-linear-to-r from-orange-600 to-amber-500">
                            {highlightedText}
                        </span>
                    )}
                </h1>

                {/* Subtitle - responsive sizing */}
                {subtitle && (
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-neutral-600 max-w-2xl mx-auto mb-8 sm:mb-12 font-light leading-relaxed">
                        {subtitle}
                    </p>
                )}

                {/* CTA buttons - stacked on mobile, side-by-side on larger screens */}
                {(primaryCtaText || secondaryCtaText) && (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                        {primaryCtaText && (
                            <a
                                href={primaryCtaHref}
                                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-neutral-900 text-white rounded-lg sm:rounded-2xl font-semibold hover:bg-neutral-800 active:scale-95 transition-all duration-300 ease-out">
                                {primaryCtaText}
                            </a>
                        )}
                        {secondaryCtaText && (
                            <a
                                href={secondaryCtaHref}
                                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/50 backdrop-blur-md border border-neutral-200 text-neutral-900 rounded-lg sm:rounded-2xl font-semibold hover:bg-white/80 active:scale-95 transition-all duration-300 ease-out">
                                {secondaryCtaText}
                            </a>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}
