import React from 'react';
import { Link } from 'react-router-dom';
import { type LucideIcon } from 'lucide-react';
import { StatusBadge } from '../StatusBadge/StatusBadge';

// Types for the MobileCard component
export interface MobileCardHeaderConfig {
  /** Show checkbox for selection */
  selectable?: boolean;
  /** Whether the item is selected */
  isSelected?: boolean;
  /** Callback when selection changes */
  onToggleSelection?: () => void;
  /** Serial number to display (e.g., #1, #2) */
  serialNumber?: number;
  /** Main title text */
  title: string;
  /** Optional subtitle text */
  subtitle?: string;
  /** Optional label above the title */
  titleLabel?: string;
  /** Avatar configuration */
  avatar?: {
    imageUrl?: string;
    initials?: string;
    bgColor?: string;
    textColor?: string;
    onClick?: () => void;
  };
  /** Badge configuration (status or custom) */
  badge?: {
    type: 'status' | 'custom';
    /** For status type - the status value */
    status?: string;
    /** For custom type - label and className */
    label?: string;
    className?: string;
    onClick?: () => void;
  };
  /** Additional action button in header (e.g., delete) */
  headerAction?: {
    icon: LucideIcon;
    onClick: () => void;
    className?: string;
    ariaLabel?: string;
  };
  /** Whether selection is disabled (e.g. for approved items) */
  selectionDisabled?: boolean;
}

export interface MobileCardDetailRow {
  /** Lucide icon component */
  icon?: LucideIcon;
  /** Icon color class (e.g., 'text-secondary', 'text-green-600') */
  iconColor?: string;
  /** Label for the detail (e.g., 'Date', 'Amount') */
  label?: string;
  /** Value to display */
  value: React.ReactNode;
  /** Additional CSS classes for the value */
  valueClassName?: string;
  /** Whether to show as a two-column grid item */
  fullWidth?: boolean;
}

export interface MobileCardAction {
  /** Button label */
  label: string;
  /** Click handler */
  onClick?: () => void;
  /** Link URL (if action is a link) */
  href?: string;
  /** State to pass to the Link component */
  linkState?: Record<string, unknown>;
  /** Lucide icon component */
  icon?: LucideIcon;
  /** Variant styling */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  /** Whether to show the action */
  visible?: boolean;
  /** Additional class name for the action button */
  className?: string;
}

export interface MobileCardProps {
  /** Unique identifier */
  id: string;
  /** Header configuration */
  header: MobileCardHeaderConfig;
  /** Array of detail rows to display */
  details?: MobileCardDetailRow[];
  /** Layout for details: 'single' (1 col) or 'grid' (2 cols) */
  detailsLayout?: 'single' | 'grid';
  /** Footer content (custom) */
  footerContent?: React.ReactNode;
  /** Action buttons at the bottom */
  actions?: MobileCardAction[];
  /** Whether actions should be full width */
  actionsFullWidth?: boolean;
  /** Custom content to render inside the card */
  children?: React.ReactNode;
  /** Additional card className */
  className?: string;
  /** Click handler for the entire card */
  onClick?: () => void;
}

// Subcomponents
const CardHeader: React.FC<{ config: MobileCardHeaderConfig }> = ({ config }) => {
  const {
    selectable,
    isSelected,
    onToggleSelection,
    serialNumber,
    title,
    subtitle,
    titleLabel,
    avatar,
    badge,
    headerAction,
    selectionDisabled
  } = config;

  return (
    <div className="flex justify-between items-start gap-3">
      <div className="flex gap-3 items-center flex-1 min-w-0">
        {/* Checkbox */}
        {selectable && (
          <div className="shrink-0">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={selectionDisabled ? undefined : onToggleSelection}
              disabled={selectionDisabled}
              className={`w-5 h-5 border-gray-300 rounded focus:ring-secondary ${selectionDisabled
                ? 'cursor-not-allowed opacity-50 bg-gray-100 text-gray-400'
                : 'cursor-pointer text-secondary'
                }`}
            />
          </div>
        )}

        {/* Avatar */}
        {avatar && (
          avatar.onClick ? (
            <button
              type="button"
              onClick={avatar.onClick}
              className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 border border-gray-100 overflow-hidden shadow-sm cursor-pointer hover:ring-2 hover:ring-secondary/30 transition-all ${avatar.bgColor || 'bg-gradient-to-br from-blue-50 to-blue-100'
                } ${avatar.textColor || 'text-blue-600'}`}
              aria-label="View image"
            >
              {avatar.imageUrl ? (
                <img
                  src={avatar.imageUrl}
                  alt={title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="font-bold text-sm">{avatar.initials || title.charAt(0).toUpperCase()}</span>
              )}
            </button>
          ) : (
            <div
              className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 border border-gray-100 overflow-hidden shadow-sm ${avatar.bgColor || 'bg-gradient-to-br from-blue-50 to-blue-100'
                } ${avatar.textColor || 'text-blue-600'}`}
            >
              {avatar.imageUrl ? (
                <img
                  src={avatar.imageUrl}
                  alt={title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="font-bold text-sm">{avatar.initials || title.charAt(0).toUpperCase()}</span>
              )}
            </div>
          )
        )}

        {/* Title Section */}
        <div className="min-w-0 flex-1 overflow-hidden">
          {(serialNumber !== undefined || titleLabel) && (
            <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">
              {serialNumber !== undefined && `#${serialNumber}`}
              {serialNumber !== undefined && titleLabel && ' · '}
              {titleLabel}
            </div>
          )}
          <h3 className="text-sm font-bold text-gray-900 leading-tight truncate">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[11px] text-gray-500 truncate mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right Side: Badge and/or Action */}
      <div className="flex items-center gap-2 shrink-0">
        {badge && (
          badge.type === 'status' && badge.status ? (
            <StatusBadge status={badge.status} onClick={badge.onClick} />
          ) : (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <span
              className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${badge.className || 'bg-gray-100 text-gray-700'
                }`}
              onClick={badge.onClick}
              onKeyDown={badge.onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') badge.onClick?.(); } : undefined}
              role={badge.onClick ? 'button' : undefined}
              tabIndex={badge.onClick ? 0 : undefined}
            >
              {badge.label}
            </span>
          )
        )}
        {headerAction && (
          <button
            onClick={headerAction.onClick}
            className={headerAction.className || 'p-2 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors'}
            aria-label={headerAction.ariaLabel}
          >
            <headerAction.icon size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

const CardDetails: React.FC<{
  details: MobileCardDetailRow[];
  layout: 'single' | 'grid';
}> = ({ details, layout }) => {
  const gridClass = layout === 'grid'
    ? 'grid grid-cols-2 gap-y-3 gap-x-4'
    : 'space-y-2.5';

  return (
    <div className={gridClass}>
      {details.map((detail, index) => (
        <div
          key={index}
          className={`flex items-start gap-2.5 ${detail.fullWidth ? 'col-span-2' : ''}`}
        >
          {detail.icon && (
            <div className="shrink-0 mt-0.5">
              <detail.icon
                size={14}
                className={detail.iconColor || 'text-gray-400'}
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            {detail.label && (
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block mb-0.5">
                {detail.label}
              </span>
            )}
            <span className={`text-xs text-gray-700 block ${detail.valueClassName || ''}`}>
              {detail.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

const CardActions: React.FC<{
  actions: MobileCardAction[];
  fullWidth: boolean;
}> = ({ actions, fullWidth }) => {
  const visibleActions = actions.filter((a) => a.visible !== false);

  if (visibleActions.length === 0) return null;

  const getVariantClasses = (variant: MobileCardAction['variant']) => {
    switch (variant) {
      case 'primary':
        return 'bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20';
      case 'secondary':
        return 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100';
      case 'danger':
        return 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100';
      case 'ghost':
        return 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100';
      default:
        return 'bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20';
    }
  };

  if (fullWidth && visibleActions.length === 1) {
    const action = visibleActions[0];
    const baseClasses = `w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl border transition-all active:scale-[0.98] ${getVariantClasses(action.variant)}`;

    if (action.href) {
      return (
        <Link to={action.href} state={action.linkState} className={baseClasses}>
          {action.icon && <action.icon size={14} />}
          {action.label}
        </Link>
      );
    }

    return (
      <button onClick={action.onClick} className={baseClasses}>
        {action.icon && <action.icon size={14} />}
        {action.label}
      </button>
    );
  }

  // Multiple actions - grid layout
  return (
    <div className={`grid gap-2 ${visibleActions.length === 2 ? 'grid-cols-2' : visibleActions.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
      {visibleActions.map((action, index) => {
        const baseClasses = `flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-bold rounded-xl border transition-all active:scale-[0.98] ${getVariantClasses(action.variant)} ${action.className || ''}`;

        if (action.href) {
          return (
            <Link key={index} to={action.href} state={action.linkState} className={baseClasses}>
              {action.icon && <action.icon size={14} />}
              {action.label}
            </Link>
          );
        }

        return (
          <button key={index} onClick={action.onClick} className={baseClasses}>
            {action.icon && <action.icon size={14} />}
            {action.label}
          </button>
        );
      })}
    </div>
  );
};

// Main MobileCard Component
export const MobileCard: React.FC<MobileCardProps> = ({
  id,
  header,
  details,
  detailsLayout = 'single',
  footerContent,
  actions,
  actionsFullWidth = true,
  children,
  className = '',
  onClick,
}) => {
  const isSelected = header.isSelected;

  const cardClasses = `
    p-4 rounded-2xl border shadow-sm relative overflow-hidden transition-all duration-200
    ${isSelected ? 'bg-secondary/5 border-secondary/30 ring-1 ring-secondary/20' : 'bg-white border-gray-100'}
    ${onClick ? 'cursor-pointer hover:shadow-md active:scale-[0.99]' : ''}
    ${className}
  `.trim();

  const hasDetails = details && details.length > 0;
  const hasActions = actions && actions.length > 0;
  const hasFooter = !!footerContent;

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={cardClasses}
      onClick={onClick}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      data-id={id}
    >
      {/* Header */}
      <CardHeader config={header} />

      {/* Divider - only show if there's content below */}
      {(hasDetails || children || hasFooter || hasActions) && (
        <div className="border-t border-gray-100 my-3" />
      )}

      {/* Details */}
      {hasDetails && (
        <div className="mb-3">
          <CardDetails details={details} layout={detailsLayout} />
        </div>
      )}

      {/* Custom Children */}
      {children}

      {/* Footer Content */}
      {hasFooter && <div className="mb-3">{footerContent}</div>}

      {/* Actions */}
      {hasActions && (
        <CardActions actions={actions} fullWidth={actionsFullWidth} />
      )}
    </div>
  );
};

// MobileCardList Wrapper Component
export interface MobileCardListProps {
  children?: React.ReactNode;
  emptyMessage?: string;
  isEmpty?: boolean;
  className?: string;
}

export const MobileCardList: React.FC<MobileCardListProps> = ({
  children,
  emptyMessage = 'No items found',
  isEmpty = false,
  className = '',
}) => {
  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 md:hidden">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <p className="text-sm font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`w-full space-y-3 pb-6 md:hidden ${className}`}>
      {children}
    </div>
  );
};

export default MobileCard;
