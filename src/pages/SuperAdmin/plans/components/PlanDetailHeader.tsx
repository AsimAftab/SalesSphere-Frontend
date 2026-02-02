import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui';

interface PlanDetailHeaderProps {
    title: string;
    isCustomPlan: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
}

const PlanDetailHeader: React.FC<PlanDetailHeaderProps> = ({
    title,
    isCustomPlan,
    onEdit,
    onDelete
}) => (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 px-1">
        <div className="flex items-center gap-2">
            <Link
                to="/system-admin/plans"
                className="p-2 -ml-2 hover:bg-gray-200 rounded-full transition-colors"
                title="Go Back"
            >
                <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
            </Link>
            <div className="text-left shrink-0">
                <h1 className="text-2xl font-bold text-[#202224]">{title}</h1>
            </div>
        </div>

        {isCustomPlan && (
            <div className="flex items-center flex-wrap gap-3 w-full lg:w-auto">
                {onEdit && (
                    <Button variant="secondary" onClick={onEdit}>
                        Edit Plan
                    </Button>
                )}
                {onDelete && (
                    <Button variant="danger" onClick={onDelete}>
                        Delete Plan
                    </Button>
                )}
            </div>
        )}
    </div>
);

export default PlanDetailHeader;
