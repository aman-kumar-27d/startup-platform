"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

const cx = (...classes: Array<string | undefined | false>) =>
    classes.filter(Boolean).join(" ");

type CardProps = {
    className?: string;
    children: ReactNode;
};

export function Card({ className, children }: CardProps) {
    const reduceMotion = useReducedMotion();

    return (
        <motion.div
            whileHover={
                reduceMotion
                    ? undefined
                    : {
                        scale: 1.02,
                    }
            }
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={cx(
                "group rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-sm shadow-slate-200/40 backdrop-blur",
                className
            )}
        >
            {children}
        </motion.div>
    );
}
