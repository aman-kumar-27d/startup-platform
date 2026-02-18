/**
 * Global Loading Component
 * Displayed while the page is loading
 * Provides visual feedback to users during navigation
 */
export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-white via-slate-50 to-slate-100 px-4">
            {/* Decorative gradient orbs */}
            <div className="absolute top-1/4 -left-20 w-80 sm:w-96 h-80 sm:h-96 bg-primary/10 blur-[80px] sm:blur-[100px] rounded-full pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-1/4 -right-20 w-80 sm:w-96 h-80 sm:h-96 bg-green-200/10 blur-[80px] sm:blur-[100px] rounded-full pointer-events-none animate-pulse"></div>

            {/* Loading indicator */}
            <div className="relative z-10 flex flex-col items-center justify-center gap-6">
                {/* Animated spinner */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                    {/* Outer ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-slate-200 border-t-primary animate-spin"></div>

                    {/* Inner content */}
                    <div className="absolute inset-2 rounded-full bg-linear-to-br from-primary/20 to-green-400/20 flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    </div>
                </div>

                {/* Loading text */}
                <div className="text-center">
                    <h2 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-2">
                        Loading
                        <span className="inline-block animate-bounce" style={{ animationDelay: "0s" }}>
                            .
                        </span>
                        <span className="inline-block animate-bounce" style={{ animationDelay: "0.1s" }}>
                            .
                        </span>
                        <span className="inline-block animate-bounce" style={{ animationDelay: "0.2s" }}>
                            .
                        </span>
                    </h2>
                    <p className="text-sm sm:text-base text-neutral-600">
                        Please wait while we prepare your content
                    </p>
                </div>
            </div>
        </div>
    );
}
