/**
 * Modal Sub-Components
 *
 * Reusable building blocks for modal dialogs following consistent patterns.
 * These components eliminate duplication across 30+ modal implementations.
 */

import type { ReactNode } from 'react';
import { X, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// =============================================================================
// ModalCloseButton
// =============================================================================

export interface ModalCloseButtonProps {
  /** Close handler */
  onClose: () => void;
  /** Additional classes */
  className?: string;
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Disable the button */
  disabled?: boolean;
}

/**
 * Standardized close button with hover animation.
 * Features red hover state and rotation animation on hover.
 */
export const ModalCloseButton: React.FC<ModalCloseButtonProps> = ({
  onClose,
  className,
  size = 'md',
  disabled = false,
}) => {
  const sizeClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-2.5',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      type="button"
      onClick={onClose}
      disabled={disabled}
      className={cn(
        'rounded-full text-gray-400 transition-all duration-200',
        'hover:bg-red-50 hover:text-red-500 hover:rotate-90',
        'focus:outline-none focus:ring-2 focus:ring-red-200',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:rotate-0',
        sizeClasses[size],
        className
      )}
      aria-label="Close modal"
    >
      <X className={iconSizes[size]} />
    </button>
  );
};

// =============================================================================
// ModalHeader
// =============================================================================

export interface ModalHeaderProps {
  /** Modal title */
  title: string;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Optional icon component */
  icon?: LucideIcon;
  /** Icon background color class */
  iconBgClass?: string;
  /** Icon color class */
  iconColorClass?: string;
  /** Close handler (shows close button if provided) */
  onClose?: () => void;
  /** Hide close button even if onClose is provided */
  hideCloseButton?: boolean;
  /** Additional content after title */
  children?: ReactNode;
  /** Additional classes for the header container */
  className?: string;
  /** Disable close button during operations */
  isClosingDisabled?: boolean;
}

/**
 * Enhanced modal header with icon support, title, subtitle, and close button.
 * Matches the pattern used across ChangePasswordModal, ProductEntityModal, etc.
 */
export const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  iconBgClass = 'bg-blue-50',
  iconColorClass = 'text-blue-600',
  onClose,
  hideCloseButton = false,
  children,
  className,
  isClosingDisabled = false,
}) => {
  return (
    <div
      className={cn(
        'px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex-shrink-0',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={cn('p-2 rounded-lg', iconBgClass)}>
              <Icon className={cn('h-5 w-5', iconColorClass)} />
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        {onClose && !hideCloseButton && (
          <ModalCloseButton onClose={onClose} disabled={isClosingDisabled} />
        )}
      </div>
      {children}
    </div>
  );
};

// =============================================================================
// ModalBody
// =============================================================================

export interface ModalBodyProps {
  /** Modal body content */
  children: ReactNode;
  /** Additional classes */
  className?: string;
  /** Enable scrolling with max height */
  scrollable?: boolean;
  /** Max height when scrollable (default: 85vh) */
  maxHeight?: string;
  /** Remove default padding */
  noPadding?: boolean;
}

/**
 * Modal body container with optional scrolling support.
 */
export const ModalBody: React.FC<ModalBodyProps> = ({
  children,
  className,
  scrollable = false,
  maxHeight = '85vh',
  noPadding = false,
}) => {
  return (
    <div
      className={cn(
        'flex-1',
        !noPadding && 'px-6 py-6',
        scrollable && 'overflow-y-auto custom-scrollbar',
        className
      )}
      style={scrollable ? { maxHeight } : undefined}
    >
      {children}
    </div>
  );
};

// =============================================================================
// ModalFooter
// =============================================================================

export interface ModalFooterProps {
  /** Footer content (usually buttons) */
  children: ReactNode;
  /** Additional classes */
  className?: string;
  /** Alignment of footer content */
  align?: 'left' | 'center' | 'right' | 'between';
  /** Remove background styling */
  transparent?: boolean;
}

/**
 * Modal footer for action buttons.
 */
export const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  className,
  align = 'right',
  transparent = false,
}) => {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div
      className={cn(
        'px-6 py-4 flex items-center gap-3 flex-shrink-0',
        !transparent && 'bg-gray-50 border-t border-gray-100',
        alignClasses[align],
        className
      )}
    >
      {children}
    </div>
  );
};

// =============================================================================
// ModalBackdrop
// =============================================================================

export interface ModalBackdropProps {
  /** Click handler for backdrop */
  onClick?: () => void;
  /** Backdrop style variant */
  variant?: 'default' | 'blur' | 'dark' | 'light';
  /** Additional classes */
  className?: string;
  /** Children (the modal content) */
  children?: ReactNode;
  /** Z-index level */
  zIndex?: 50 | 60 | 70 | 100 | 9999;
}

/**
 * Modal backdrop/overlay component.
 * Note: For animated backdrops, use with framer-motion directly.
 */
export const ModalBackdrop: React.FC<ModalBackdropProps> = ({
  onClick,
  variant = 'default',
  className,
  children,
  zIndex = 50,
}) => {
  const variantClasses = {
    default: 'bg-black/50',
    blur: 'bg-black/30 backdrop-blur-sm',
    dark: 'bg-black/80',
    light: 'bg-black/20',
  };

  const zIndexClasses = {
    50: 'z-50',
    60: 'z-60',
    70: 'z-70',
    100: 'z-[100]',
    9999: 'z-[9999]',
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={cn(
        'fixed inset-0 flex items-center justify-center p-4',
        variantClasses[variant],
        zIndexClasses[zIndex],
        className
      )}
      onClick={onClick}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};

// =============================================================================
// ModalContainer
// =============================================================================

export interface ModalContainerProps {
  /** Modal content */
  children: ReactNode;
  /** Size preset */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';
  /** Custom max-width class (overrides size) */
  maxWidth?: string;
  /** Additional classes */
  className?: string;
  /** Stop click propagation */
  stopPropagation?: boolean;
}

/**
 * Modal content container with size presets.
 */
export const ModalContainer: React.FC<ModalContainerProps> = ({
  children,
  size = 'md',
  maxWidth,
  className,
  stopPropagation = true,
}) => {
  const sizeClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-[95vw] md:max-w-[90vw]',
  };

  return (
    <div
      className={cn(
        'relative w-full bg-white rounded-xl shadow-2xl overflow-hidden',
        'flex flex-col max-h-[90vh]',
        maxWidth || sizeClasses[size],
        className
      )}
      onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}
      onKeyDown={stopPropagation ? (e) => e.stopPropagation() : undefined}
      role="dialog"
      tabIndex={-1}
    >
      {children}
    </div>
  );
};
