import React from 'react';
import ErrorBoundary from '../UI/ErrorBoundary/ErrorBoundary';

interface InfoCardProps {
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    action?: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
    children: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({
    title,
    subtitle,
    action,
    footer,
    className = '',
    children,
}) => {
    return (
        <div className={`bg-white p-6 rounded-lg shadow-sm h-full flex flex-col ${className}`}>
            {(title || subtitle || action) && (
                <div className="flex justify-between items-center mb-4">
                    <div>
                        {title && (
                            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                        )}
                        {subtitle && (
                            <div className="text-sm text-gray-500 mt-0.5">{subtitle}</div>
                        )}
                    </div>
                    {action && <div className="flex-shrink-0">{action}</div>}
                </div>
            )}

            <div className="flex-1 overflow-hidden flex flex-col">
                <ErrorBoundary>
                    {children}
                </ErrorBoundary>
            </div>

            {footer && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                    {footer}
                </div>
            )}
        </div>
    );
};

export default InfoCard;
