import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Page Not Found",
    description: "The page you're looking for doesn't exist.",
};

/**
 * Not Found (404) Page for Public Section
 * Displayed when no matching route is found in the public area
 */
export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-white via-slate-50 to-slate-100 px-4 py-8">
            {/* Decorative gradient orbs */}
            <div className="absolute top-1/4 -left-20 w-80 sm:w-96 h-80 sm:h-96 bg-yellow-200/10 blur-[80px] sm:blur-[100px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-1/4 -right-20 w-80 sm:w-96 h-80 sm:h-96 bg-amber-200/10 blur-[80px] sm:blur-[100px] rounded-full pointer-events-none"></div>

            {/* Content */}
            <div className="relative z-10 max-w-2xl w-full">
                {/* Glass morphism card */}
                <div className="backdrop-blur-lg bg-white/40 border border-white/60 rounded-2xl p-8 sm:p-12 shadow-2xl">
                    {/* 404 icon */}
                    <div className="flex justify-center mb-6">
                        <div className="text-6xl sm:text-8xl font-bold text-transparent bg-clip-text bg-linear-to-r from-yellow-500 to-amber-600">
                            404
                        </div>
                    </div>

                    {/* Heading */}
                    <h1 className="text-3xl sm:text-4xl font-bold text-center text-neutral-900 mb-3">
                        Page Not Found
                    </h1>

                    {/* Description */}
                    <p className="text-center text-neutral-600 text-base sm:text-lg mb-8">
                        The page you&apos;re looking for doesn&apos;t exist. It might have been moved or deleted.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/"
                            className="px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-primary to-green-400 text-black font-semibold rounded-full hover:shadow-lg hover:shadow-primary/30 active:scale-95 transition-all duration-300 ease-out text-center"
                        >
                            Back to Home
                        </Link>
                        <Link
                            href="/contact"
                            className="px-6 sm:px-8 py-3 sm:py-4 bg-white/50 backdrop-blur-md border border-neutral-200 text-neutral-900 font-semibold rounded-full hover:bg-white/80 active:scale-95 transition-all duration-300 ease-out text-center"
                        >
                            Contact Support
                        </Link>
                    </div>

                    {/* Navigation links */}
                    <div className="mt-8 pt-8 border-t border-white/40">
                        <p className="text-center text-neutral-600 text-sm mb-4 font-medium">
                            Explore other pages
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            <Link
                                href="/services"
                                className="px-4 py-2 text-center text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors duration-200"
                            >
                                Services
                            </Link>
                            <Link
                                href="/work"
                                className="px-4 py-2 text-center text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors duration-200"
                            >
                                Portfolio
                            </Link>
                            <Link
                                href="/about"
                                className="px-4 py-2 text-center text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors duration-200"
                            >
                                About
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
