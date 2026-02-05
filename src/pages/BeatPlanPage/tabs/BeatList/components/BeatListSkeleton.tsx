import React from 'react';
import { ListPageSkeleton } from '@/components/ui';
import type { TableColumnSkeleton } from '@/components/ui';
import type { BeatPlanPermissions } from '../../../hooks/useBeatPlanPermissions';

interface BeatListSkeletonProps {
    permissions?: BeatPlanPermissions;
}

const BeatListSkeleton: React.FC<BeatListSkeletonProps> = ({ permissions }) => {
    const showViewDetails = permissions?.canViewTemplateDetails ?? true;
    const showAssign = permissions?.canAssign ?? true;
    const showActions = (permissions?.canUpdateTemplate || permissions?.canDeleteTemplate) ?? true;
    const showCreate = permissions?.canCreateTemplate ?? true;
    const showExport = permissions?.canExportPdf ?? true;

    const tableColumns: TableColumnSkeleton[] = [
        { width: 180, type: 'text' }, // Beat Plan Name
        { width: 60, type: 'text' },  // Total Stops
        { width: 100, type: 'text' }, // Created By
        ...(showViewDetails ? [{ width: 120, type: 'text' as const }] : []),
        ...(showAssign ? [{ width: 100, type: 'text' as const }] : []),
        { width: 90, type: 'badge' as const }, // Created Date
        ...(showActions ? [{ width: 60, type: 'actions' as const }] : []),
    ];

    return (
        <ListPageSkeleton
            header={{
                titleWidth: 190,
                subtitleWidth: 150,
                showSearch: true,
                searchWidth: 280,
                showFilter: true,
                showExportPdf: showExport,
                showExportExcel: false,
                showCreate: showCreate,
                createWidth: 160,
            }}
            table={{
                rows: 8,
                columns: tableColumns,
                showCheckbox: false,
                showSerialNumber: true,
            }}
            mobileCards={{
                cards: 4,
                config: {
                    showCheckbox: false,
                    showAvatar: false,
                    detailRows: 3,
                    detailColumns: 2,
                    showAction: true,
                    actionCount: 3,
                    showBadge: true,
                    badgeCount: 1,
                },
            }}
        />
    );
};

export default BeatListSkeleton;
