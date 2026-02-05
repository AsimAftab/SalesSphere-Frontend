import React from 'react';

import { ChevronsDown } from 'lucide-react';
import { ErrorBoundary } from '@/components/ui';

interface InfoCardProps {
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    action?: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
    children: React.ReactNode;
    // New optional props for scroll handling
    scrollableRef?: React.RefObject<HTMLDivElement | null>;
    showScrollIndicator?: boolean;
}

const InfoCard: React.FC<InfoCardProps> = ({
    title,
    subtitle,
    action,
    footer,
    className = '',
    children,
    scrollableRef,
    showScrollIndicator = false,
}) => {
    const handleScroll = () => {
        if (scrollableRef?.current) {
            scrollableRef.current.scrollBy({ top: 60, behavior: 'smooth' });
        }
    };

    return (
        <div className={`bg-white p-6 rounded-lg shadow-sm h-full flex flex-col relative ${className}`}>
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

            {/* Scroll Indicator Icon */}
            {showScrollIndicator && (
                <div
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 cursor-pointer"
                    onClick={handleScroll}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleScroll(); }}
                    role="button"
                    tabIndex={0}
                >
                    <div className="bg-white/90 backdrop-blur-sm shadow-sm border border-gray-300 rounded-full p-1.5">
                        <ChevronsDown className="w-4 h-4 text-gray-400" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default InfoCard;
