export const fadeInUp = {
    hidden: { opacity: 0, y: 18 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] as any },
    },
};

export const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] as any },
    },
};

export const staggerChildren = {
    visible: {
        transition: { staggerChildren: 0.08 },
    },
};
export const slideInLeft = {
    hidden: { opacity: 0, x: -24 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] as any },
    },
};

export const slideInRight = {
    hidden: { opacity: 0, x: 24 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] as any },
    },
};

export const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] as any },
    },
};

export const hoverLift = {
    whileHover: { y: -4 },
    transition: { duration: 0.25, ease: "easeOut" as any },
};

export const softBounce = {
    whileHover: { y: -6, scale: 1.02 },
    transition: { duration: 0.25, ease: "easeOut" as any },
};

export const cardFloat = {
    hidden: { opacity: 0, y: 24 },
    visible: (index: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            delay: index * 0.1,
            ease: [0.2, 0.8, 0.2, 1] as any,
        },
    }),
    whileHover: {
        y: -12,
        transition: { duration: 0.4, ease: "easeOut" as any },
    },
};

export const floatingAnimation = {
    animate: {
        y: [0, -12, 0],
        transition: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut" as any,
        },
    },
};

export const staggerFloatingChildren = {
    visible: {
        transition: {
            staggerChildren: 0.12,
        },
    },
};
