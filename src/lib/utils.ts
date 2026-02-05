import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names using clsx and tailwind-merge.
 * This utility allows for conditional class names and proper Tailwind CSS class merging.
 *
 * @example
 * ```tsx
 * cn('px-2 py-1', 'px-4') // => 'py-1 px-4' (px-4 overrides px-2)
 * cn('bg-red-500', condition && 'bg-blue-500') // conditional classes
 * cn({ 'hidden': isHidden, 'block': !isHidden }) // object syntax
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}
