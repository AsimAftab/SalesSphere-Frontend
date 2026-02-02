import React from 'react';
import { Card, CardHeader, CardDescription, CardTitle } from '../../ui/SuperAdminComponents/Card';

/**
 * Props interface for SuperAdminStatCard component
 * Designed to be highly modular and reusable across different contexts
 */
interface SuperAdminStatCardProps {
  /** The label/description text displayed above the value */
  title: string;

  /** The main statistic value (number or string) */
  value: string | number;

  /** Optional icon component (Lucide React icon or any React node) */
  icon?: React.ReactNode;

  /** Color class for the value text (e.g., "text-green-600", "text-red-600") */
  valueColor?: string;

  /** Optional custom CSS classes for the card container */
  className?: string;

  /** Animation delay for staggered entrance animations (e.g., "0.1s", "0.2s") */
  animationDelay?: string;

  /** Enable/disable hover effects (shadow and translate) */
  enableHoverEffect?: boolean;

  /** Optional click handler for interactive cards */
  onClick?: () => void;

  /** Optional icon color/background class (e.g., "text-blue-600") */
  iconColor?: string;

  /** Size variant for the card */
  size?: 'small' | 'medium' | 'large';
}

/**
 * SuperAdminStatCard Component
 *
 * A centered, vertical stat card designed for dashboard statistics.
 * Features:
 * - Centered layout with optional icon
 * - Large, prominent value display
 * - Hover animations
 * - Highly customizable through props
 * - Responsive design
 *
 * @example
 * ```tsx
 * <SuperAdminStatCard
 *   title="Total Organizations"
 *   value={125}
 *   valueColor="text-slate-900"
 *   animationDelay="0.1s"
 * />
 * ```
 */
const SuperAdminStatCard: React.FC<SuperAdminStatCardProps> = ({
  title,
  value,
  icon,
  valueColor = "text-slate-900",
  className = "",
  animationDelay = "0s",
  enableHoverEffect = true,
  onClick,
  iconColor = "text-slate-600",
  size = 'large'
}) => {
  // Determine text size based on size variant
  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 'text-2xl';
      case 'medium':
        return 'text-3xl';
      case 'large':
      default:
        return 'text-4xl';
    }
  };

  // Determine padding based on size variant
  const getPadding = () => {
    switch (size) {
      case 'small':
        return 'pb-2';
      case 'medium':
        return 'pb-2.5';
      case 'large':
      default:
        return 'pb-3';
    }
  };

  return (
    <Card
      className={`
        ${enableHoverEffect ? 'hover:shadow-lg transition-all duration-300 hover:-translate-y-1' : ''}
        animate-fade-in
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{ animationDelay }}
      onClick={onClick}
    >
      <CardHeader className={`${getPadding()} flex flex-col items-center justify-center text-center`}>
        {/* Optional Icon */}
        {icon && (
          <div className={`mb-2 ${iconColor}`}>
            {typeof icon === 'function' ?
              React.createElement(icon as React.ComponentType<{ className?: string }>, { className: 'w-8 h-8' }) :
              icon
            }
          </div>
        )}

        {/* Title/Description */}
        <CardDescription className="mb-2">
          {title}
        </CardDescription>

        {/* Main Value */}
        <CardTitle className={`${getTextSize()} ${valueColor}`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </CardTitle>
      </CardHeader>
    </Card>
  );
};

export default SuperAdminStatCard;
