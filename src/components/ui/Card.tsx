"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cardFloat } from "@/lib/styles/animations";

const cx = (...classes: Array<string | undefined | false>) =>
    classes.filter(Boolean).join(" ");

type CardProps = {
    className?: string;
    children: ReactNode;
    index?: number;
    floating?: boolean;
    size?: "sm" | "md" | "lg";
};

/**
 * Card component - Responsive glass morphism card with floating animation
 * Mobile-optimized with reduced animations on touch devices
 * Uses framer-motion for smooth, performant animations
 */
export function Card({ className, children, index = 0, floating = false, size = "md" }: CardProps) {
    const reduceMotion = useReducedMotion();

    // Card base styling - responsive and touch-friendly
    const baseClasses =
        "group relative rounded-xl sm:rounded-2xl border border-white/30 bg-gradient-to-br from-white/25 via-white/15 to-orange-100/10 p-4 sm:p-6 shadow-lg shadow-orange-600/5 backdrop-blur-2xl transition-all duration-300 hover:border-white/50 hover:shadow-2xl hover:shadow-orange-500/15 before:pointer-events-none before:absolute before:inset-0 before:rounded-xl sm:before:rounded-2xl before:bg-gradient-to-br before:from-orange-300/0 before:via-orange-200/0 before:to-orange-300/0 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-20 active:scale-[0.98]";

    // Floating animation card - disabled on mobile for better performance
    if (floating && !reduceMotion) {
        return (
            <motion.div
                className={cx(baseClasses, className)}
                custom={index}
                variants={cardFloat}
                initial="hidden"
                whileInView="visible"
                whileHover="whileHover"
                viewport={{ once: true, amount: 0.2 }}
            >
                <div className="relative z-10">{children}</div>
            </motion.div>
        );
    }

    // Static card with hover effect - respects reduced motion preferences
    return (
        <motion.div
            whileHover={
                reduceMotion
                    ? undefined
                    : {
                        scale: 1.02,
                        y: -4,
                    }
            }
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={cx(baseClasses, className)}
        >
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
}
