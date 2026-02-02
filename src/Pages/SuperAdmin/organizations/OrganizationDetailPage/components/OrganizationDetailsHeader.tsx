import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Button from '../../../../../components/ui/Button/Button';

interface OrganizationDetailsHeaderProps {
    title: string;
    subtitle?: string;
    backPath: string;
    children?: React.ReactNode;
    // Action Props
    onBulkImport?: () => void;
    onEdit?: () => void;
    onDeactivate?: () => void;
    organizationStatus?: string;
}

export const OrganizationDetailsHeader: React.FC<OrganizationDetailsHeaderProps> = ({
    title,
    subtitle,
    backPath,
    children,
    onBulkImport,
    onEdit,
    onDeactivate,
    organizationStatus
}) => (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 px-1">
        <div className="flex items-center gap-2">
            <Link
                to={backPath}
                className="p-2 -ml-2 hover:bg-gray-200 rounded-full transition-colors"
                title="Go Back"
            >
                <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
            </Link>
            <div className="text-left shrink-0">
                <h1 className="text-2xl font-bold text-[#202224]">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-xs sm:text-sm text-gray-500">{subtitle}</p>
                )}
            </div>
        </div>

        <div className="flex items-center flex-wrap gap-3 w-full lg:w-auto">
            {onBulkImport && (
                <Button variant="outline" onClick={onBulkImport}>
                    Bulk Import
                </Button>
            )}
            {onEdit && (
                <Button variant="primary" onClick={onEdit}>
                    Edit Organization
                </Button>
            )}
            {onDeactivate && organizationStatus && (
                <Button
                    variant={organizationStatus === 'Active' ? 'danger' : 'success'}
                    onClick={onDeactivate}
                >
                    {organizationStatus === 'Active' ? 'Deactivate' : 'Reactivate'}
                </Button>
            )}
            {children}
        </div>
    </div>
);
