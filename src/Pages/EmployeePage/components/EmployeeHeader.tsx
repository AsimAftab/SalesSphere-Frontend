import React from 'react';
import Button from '../../../components/ui/Button/Button';
import SearchBar from '../../../components/ui/SearchBar/SearchBar';
import ExportActions from '../../../components/ui/Export/ExportActions';
import { motion } from 'framer-motion';

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
        <motion.div
            className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 flex-shrink-0"
            variants={itemVariants}
        >
            <h1 className="text-3xl font-bold text-[#202224] text-center md:text-left">
                Employees
            </h1>

            <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
                {/* Search */}
                <SearchBar
                    value={searchTerm}
                    onChange={onSearchChange}
                    placeholder="Search by Name or Role"
                    className="w-full sm:w-64"
                />

                {/* Export Buttons */}
                {canExport && (
                    <div className="flex justify-center w-full md:w-auto">
                        <ExportActions
                            onExportPdf={onExportPdf}
                            onExportExcel={onExportExcel}
                        />
                    </div>
                )}

                {/* Add Button */}
                {canCreate && (
                    <div className="flex justify-center w-full md:w-auto">
                        <Button
                            onClick={onAddEmployee}
                            className="w-full md:w-auto shadow-md hover:shadow-lg transition-all"
                        >
                            Add New Employee
                        </Button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default EmployeeHeader;
