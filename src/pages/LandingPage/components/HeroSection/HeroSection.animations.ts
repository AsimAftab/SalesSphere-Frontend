import type { Variants } from 'framer-motion';

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

export const badgeVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: EASE_OUT_EXPO,
    },
  },
};

export const headlineVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: EASE_OUT_EXPO,
    },
  },
};

export const subheadlineVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: EASE_OUT_EXPO,
    },
  },
};

export const pillContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
};

export const pillVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  },
};

export const buttonContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

export const buttonVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 15,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

export const backgroundBlobVariants = {
  initial: (custom: { x: number; delay?: number }) => ({
    opacity: 0,
    scale: 0.5,
    x: custom.x,
  }),
  animate: {
    opacity: 1,
    scale: 1,
    x: 0,
  },
  transition: (delay = 0) => ({
    duration: 1.5,
    delay,
    ease: EASE_OUT_EXPO,
  }),
};

export const floatingAnimation = (config: {
  x: number[];
  y: number[];
  duration: number;
}) => ({
  x: config.x,
  y: config.y,
  transition: {
    duration: config.duration,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  },
});

export const waveVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.5,
      ease: EASE_OUT_EXPO,
    },
  },
};
