import type { Variants } from 'framer-motion';

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export const headerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export const ctaBannerVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 0.3, duration: 0.4 },
  },
};

export const numberBadgeVariants: Variants = {
  hidden: { scale: 0, rotate: -180 },
  visible: (index: number) => ({
    scale: 1,
    rotate: 0,
    transition: {
      delay: 0.2 + index * 0.08,
      duration: 0.4,
      type: 'spring' as const,
      stiffness: 250,
    },
  }),
};
