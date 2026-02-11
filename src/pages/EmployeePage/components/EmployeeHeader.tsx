import React from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui';

interface EmployeeHeaderProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    canExport: boolean;
    canCreate: boolean;
    onExportPdf: () => void;
    onExportExcel: () => void;
    onAddEmployee: () => void;
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

const EmployeeHeader: React.FC<EmployeeHeaderProps> = ({
    searchTerm,
    onSearchChange,
    canExport,
    canCreate,
    onExportPdf,
    onExportExcel,
    onAddEmployee,
}) => {
    return (
        <motion.div variants={itemVariants}>
            <PageHeader
                title="Employees"
                subtitle="Manage employees"
                searchTerm={searchTerm}
                onSearchChange={onSearchChange}
                searchPlaceholder="Search by Name or Role"
                showFilter={false}
                onExportPdf={onExportPdf}
                onExportExcel={onExportExcel}
                onCreate={onAddEmployee}
                createButtonLabel="Add New Employee"
                permissions={{
                    canCreate,
                    canExportPdf: canExport,
                    canExportExcel: canExport,
                }}
            />
        </motion.div>
    );
};

export default EmployeeHeader;
