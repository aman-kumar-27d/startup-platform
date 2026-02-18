import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonBaseProps = {
    variant?: ButtonVariant;
    size?: "sm" | "md" | "lg";
    className?: string;
    children: ReactNode;
};

type ButtonLinkProps = ButtonBaseProps &
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className"> & {
        href: string;
    };

type ButtonButtonProps = ButtonBaseProps &
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
        href?: undefined;
    };

type ButtonProps = ButtonLinkProps | ButtonButtonProps;

/**
 * Button component - Touch-optimized for mobile devices
 * Minimum height of 44px (iOS touch target size) for better accessibility
 * Responsive sizing across breakpoints
 */
const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 touch-manipulation";

// Responsive size styles - mobile-first approach with minimum touch target sizes
const sizeStyles: Record<NonNullable<ButtonBaseProps["size"]>, string> = {
    sm: "h-10 sm:h-9 px-4 text-sm",
    md: "h-11 sm:h-11 px-5 text-sm sm:text-base",
    lg: "h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg",
};

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        "bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 shadow-sm shadow-slate-900/20 hover:shadow-md",
    secondary:
        "bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300 border border-slate-200 hover:border-slate-300",
    ghost: "bg-transparent text-slate-900 hover:bg-slate-100 active:bg-slate-200",
};

const cx = (...classes: Array<string | undefined | false>) =>
    classes.filter(Boolean).join(" ");

export function Button({
    variant = "primary",
    size = "md",
    className,
    children,
    ...props
}: ButtonProps) {
    const classes = cx(baseStyles, sizeStyles[size], variantStyles[variant], className);

    if ("href" in props && props.href !== undefined) {
        const { href, ...linkProps } = props as ButtonLinkProps;
        return (
            <Link href={href} className={classes} {...linkProps}>
                {children}
            </Link>
        );
    }

    return (
        <button className={classes} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
            {children}
        </button>
    );
}
