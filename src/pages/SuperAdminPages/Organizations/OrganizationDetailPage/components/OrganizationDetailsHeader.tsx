import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui';
import { ArrowLeft, ChevronDown, Receipt, Calendar, Upload } from 'lucide-react';

interface OrganizationDetailsHeaderProps {
    title: string;
    subtitle?: string;
    backPath: string;
    children?: React.ReactNode;
    // Action Props
    onViewPayments?: () => void;
    onBulkImport?: () => void;
    onEdit?: () => void;
    onDeactivate?: () => void;
    onExtendSubscription?: () => void;
    organizationStatus?: string;
}

export const OrganizationDetailsHeader: React.FC<OrganizationDetailsHeaderProps> = ({
    title,
    subtitle,
    backPath,
    children,
    onViewPayments,
    onBulkImport,
    onEdit,
    onDeactivate,
    onExtendSubscription,
    organizationStatus
}) => {
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMoreMenuOpen(false);
            }
        };

        if (isMoreMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMoreMenuOpen]);

    const moreMenuItems = [
        { label: 'Payment History', icon: Receipt, onClick: onViewPayments, show: !!onViewPayments },
        { label: 'Extend Subscription', icon: Calendar, onClick: onExtendSubscription, show: !!onExtendSubscription },
        { label: 'Bulk Import', icon: Upload, onClick: onBulkImport, show: !!onBulkImport },
    ].filter(item => item.show);

    const handleMenuItemClick = (onClick?: () => void) => {
        onClick?.();
        setIsMoreMenuOpen(false);
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 px-1">
            <div className="flex items-center gap-2">
                <Link
                    to={backPath}
                    className="p-2 -ml-2 hover:bg-gray-200 rounded-full transition-colors"
                    title="Go Back"
                >
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                </Link>
                <div className="text-left shrink-0">
                    <h1 className="text-xl sm:text-2xl font-bold text-[#202224]">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-xs sm:text-sm text-gray-500">{subtitle}</p>
                    )}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                {/* More Actions Dropdown */}
                {moreMenuItems.length > 0 && (
                    <div ref={menuRef} className="relative">
                        <Button
                            variant="secondary"
                            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                            className="w-full sm:w-auto flex items-center justify-center gap-2"
                        >
                            More
                            <ChevronDown className={`w-4 h-4 transition-transform ${isMoreMenuOpen ? 'rotate-180' : ''}`} />
                        </Button>

                        {isMoreMenuOpen && (
                            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                                {moreMenuItems.map((item) => (
                                    <button
                                        key={item.label}
                                        onClick={() => handleMenuItemClick(item.onClick)}
                                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                    >
                                        <item.icon className="w-4 h-4 text-gray-500" />
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {onEdit && (
                    <Button variant="secondary" onClick={onEdit} className="w-full sm:w-auto">
                        Edit Organization
                    </Button>
                )}
                {onDeactivate && organizationStatus && (
                    <Button
                        variant={organizationStatus === 'Active' ? 'danger' : 'success'}
                        onClick={onDeactivate}
                        className="w-full sm:w-auto"
                    >
                        {organizationStatus === 'Active' ? 'Deactivate' : 'Reactivate'}
                    </Button>
                )}
                {children}
            </div>
        </div>
    );
};
