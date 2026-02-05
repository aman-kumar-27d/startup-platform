"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { fadeInUp } from "@/lib/styles/animations";

const cx = (...classes: Array<string | undefined | false>) =>
    classes.filter(Boolean).join(" ");

type SectionProps = {
    id?: string;
    className?: string;
    children: ReactNode;
};

export function Section({ id, className, children }: SectionProps) {
    const reduceMotion = useReducedMotion();

    return (
        <motion.section
            id={id}
            className={cx("py-16 sm:py-20", className)}
            variants={fadeInUp}
            initial={reduceMotion ? "visible" : "hidden"}
            whileInView={reduceMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.25 }}
        >
            {children}
        </motion.section>
    );
}
