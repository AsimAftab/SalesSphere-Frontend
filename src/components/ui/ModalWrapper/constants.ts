/**
 * Modal Animation Constants
 *
 * Shared animation variants for consistent modal animations across the codebase.
 * Eliminates duplication of animation definitions in individual modal components.
 */

import type { Variants } from 'framer-motion';

/**
 * Backdrop fade animation - used for modal overlays
 */
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

/**
 * Scale animation - default modal entrance/exit animation
 */
export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 25 },
  },
  exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.15 } },
};

/**
 * Slide up animation - alternative modal entrance/exit
 */
export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  exit: { opacity: 0, y: 50, transition: { duration: 0.2 } },
};

/**
 * Slide from right animation - for side panels/drawers
 */
export const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: '100%' },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  exit: { opacity: 0, x: '100%', transition: { duration: 0.2 } },
};

/**
 * Modal size presets
 */
export const sizeClasses = {
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  full: 'max-w-[95vw] md:max-w-[90vw]',
} as const;

/**
 * Backdrop style presets
 */
export const backdropClasses = {
  default: 'bg-black/50',
  blur: 'bg-black/30 backdrop-blur-sm',
  dark: 'bg-black/80',
  light: 'bg-black/20',
} as const;

/**
 * Z-index presets for modal layering
 */
export const zIndexClasses = {
  50: 'z-50',
  60: 'z-60',
  70: 'z-70',
  100: 'z-[100]',
  9999: 'z-[9999]',
} as const;

export type ModalSize = keyof typeof sizeClasses;
export type BackdropStyle = keyof typeof backdropClasses;
export type ModalZIndex = keyof typeof zIndexClasses;
