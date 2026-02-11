import React from 'react';
import { PageHeader } from '@/components/ui';

interface AttendanceHeaderProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onExportPdf?: () => void;
    //ExportExcel: () => void;
}

const AttendanceHeader: React.FC<AttendanceHeaderProps> = ({
    searchTerm,
    onSearchChange,
    onExportPdf,
    //ExportExcel,
}) => {
    return (
        <PageHeader
            title="Attendance for Employees"
            subtitle="Total Attendance for a Month"
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            searchPlaceholder="Search by Employee Name"
            onExportPdf={onExportPdf}
            // onExportExcel={onExportExcel}
            showFilter={false}
            permissions={{
                canCreate: false,
                canBulkDelete: false,
                canExportPdf: true,
                // canExportExcel: true,
            }}
        />
    );
};

export default AttendanceHeader;
