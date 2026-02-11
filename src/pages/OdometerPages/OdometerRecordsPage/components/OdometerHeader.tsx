import React from 'react';
import { useOdometerPermissions } from '../../hooks/useOdometerPermissions';
import { PageHeader } from '@/components/ui';

interface OdometerHeaderProps {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    onExportPdf: () => void;
}

const OdometerHeader: React.FC<OdometerHeaderProps> = ({
    searchQuery, setSearchQuery,
    onExportPdf
}) => {
    const { canExport } = useOdometerPermissions();

    return (
        <PageHeader
            title="Odometer Records"
            subtitle="Track odometer readings"
            searchTerm={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search By Employee"
            onExportPdf={onExportPdf}
            showFilter={false}
            permissions={{
                canExportPdf: canExport,
                canExportExcel: false,
                canCreate: false,
            }}
        />
    );
};

export default OdometerHeader;
