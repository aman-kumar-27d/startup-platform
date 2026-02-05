export const fadeInUp = {
    hidden: { opacity: 0, y: 18 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] },
    },
};

export const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] },
    },
};

export const staggerChildren = {
    visible: {
        transition: { staggerChildren: 0.08 },
    },
};
