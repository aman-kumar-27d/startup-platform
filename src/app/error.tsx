"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

/**
 * Error Boundary Component
 * Catches errors in the app and displays a user-friendly error page
 * with consistent design and color theme
 */
export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Log error for monitoring/debugging
        console.error("Application Error:", error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-white via-slate-50 to-slate-100 px-4 py-8">
            {/* Decorative gradient orbs */}
            <div className="absolute top-1/4 -left-20 w-80 sm:w-96 h-80 sm:h-96 bg-red-200/10 blur-[80px] sm:blur-[100px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-1/4 -right-20 w-80 sm:w-96 h-80 sm:h-96 bg-pink-200/10 blur-[80px] sm:blur-[100px] rounded-full pointer-events-none"></div>

            {/* Error content */}
            <div className="relative z-10 max-w-2xl w-full">
                {/* Glass morphism card */}
                <div className="backdrop-blur-lg bg-white/40 border border-white/60 rounded-2xl p-8 sm:p-12 shadow-2xl">
                    {/* Error icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-linear-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center border border-red-500/30">
                            <svg
                                className="w-8 h-8 sm:w-10 sm:h-10 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4v2m0 0v2m0-6v-2m0 6v2m6-6a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Heading */}
                    <h1 className="text-3xl sm:text-4xl font-bold text-center text-neutral-900 mb-3">
                        Something went wrong
                    </h1>

                    {/* Subheading */}
                    <p className="text-center text-neutral-600 text-base sm:text-lg mb-6">
                        We encountered an unexpected error. Our team has been notified and we&apos;re working to fix it.
                    </p>

                    {/* Error details (development only) */}
                    {process.env.NODE_ENV === "development" && error.message && (
                        <div className="mb-8 p-4 bg-red-50/50 border border-red-200 rounded-lg">
                            <p className="text-sm font-mono text-red-700 break-all">
                                {error.message}
                            </p>
                        </div>
                    )}

                    {/* Error ID for support */}
                    {error.digest && (
                        <div className="mb-8 p-3 bg-slate-100/50 border border-slate-200 rounded-lg text-center">
                            <p className="text-xs sm:text-sm text-slate-600">
                                <span className="font-semibold">Error ID:</span> {error.digest}
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={reset}
                            className="px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-primary to-green-400 text-black font-semibold rounded-full hover:shadow-lg hover:shadow-primary/30 active:scale-95 transition-all duration-300 ease-out"
                        >
                            Try Again
                        </button>
                        <Link
                            href="/"
                            className="px-6 sm:px-8 py-3 sm:py-4 bg-white/50 backdrop-blur-md border border-neutral-200 text-neutral-900 font-semibold rounded-full hover:bg-white/80 active:scale-95 transition-all duration-300 ease-out"
                        >
                            Go Home
                        </Link>
                    </div>
                </div>

                {/* Additional help text */}
                <p className="text-center text-neutral-600 text-sm mt-8">
                    Need additional help?{" "}
                    <a
                        href="/contact"
                        className="text-primary font-semibold hover:underline"
                    >
                        Contact our support team
                    </a>
                </p>
            </div>
        </div>
    );
}
