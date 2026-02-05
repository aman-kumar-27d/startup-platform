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

const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-60";

const sizeStyles: Record<NonNullable<ButtonBaseProps["size"]>, string> = {
    sm: "h-9 px-4",
    md: "h-11 px-5",
    lg: "h-12 px-6 text-base",
};

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        "bg-slate-900 text-white hover:bg-slate-800 shadow-sm shadow-slate-900/20",
    secondary:
        "bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-200",
    ghost: "bg-transparent text-slate-900 hover:bg-slate-100",
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
