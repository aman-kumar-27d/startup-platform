import type { ReactNode } from "react";

const cx = (...classes: Array<string | undefined | false>) =>
    classes.filter(Boolean).join(" ");

type BadgeProps = {
    className?: string;
    children: ReactNode;
};

export function Badge({ className, children }: BadgeProps) {
    return (
        <span
            className={cx(
                "inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-600",
                className
            )}
        >
            {children}
        </span>
    );
}
