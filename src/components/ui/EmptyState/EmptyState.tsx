import React from 'react';
import { AlertCircle, FileX } from 'lucide-react';

export interface EmptyStateProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
    variant?: 'empty' | 'error' | 'warning';
    className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    description,
    icon,
    action,
    variant = 'empty',
    className = ''
}) => {
    const getDefaultIcon = () => {
        if (icon) return icon;

        switch (variant) {
            case 'error':
                return <AlertCircle className="w-12 h-12 text-red-400" />;
            case 'warning':
                return <AlertCircle className="w-12 h-12 text-amber-400" />;
            default:
                return <FileX className="w-12 h-12 text-gray-300" />;
        }
    };

    const getContainerStyles = () => {
        switch (variant) {
            case 'error':
                return 'bg-red-50 border border-red-100 rounded-xl';
            case 'warning':
                return 'bg-amber-50 border border-amber-100 rounded-xl';
            default:
                return '';
        }
    };

    const getTitleStyles = () => {
        switch (variant) {
            case 'error':
                return 'text-red-700';
            case 'warning':
                return 'text-amber-700';
            default:
                return 'text-gray-900';
        }
    };

    const getDescriptionStyles = () => {
        switch (variant) {
            case 'error':
                return 'text-red-600';
            case 'warning':
                return 'text-amber-600';
            default:
                return 'text-gray-500';
        }
    };

    return (
        <div className={`flex flex-col items-center justify-center py-12 px-4 h-full ${getContainerStyles()} ${className}`}>
            <div className="mb-4">
                {getDefaultIcon()}
            </div>
            <h3 className={`text-lg font-semibold mb-1 ${getTitleStyles()}`}>
                {title}
            </h3>
            <p className={`text-sm text-center max-w-sm leading-relaxed ${getDescriptionStyles()}`}>
                {description}
            </p>
            {action && (
                <div className="mt-6">
                    {action}
                </div>
            )}
        </div>
    );
};
