import React from 'react';
import { motion } from 'framer-motion';
import SearchBar from '../../../components/UI/SearchBar/SearchBar';
import ExportActions from '../../../components/UI/Export/ExportActions';

interface AttendanceHeaderProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onExportPdf: () => void;
    //ExportExcel: () => void;
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

const AttendanceHeader: React.FC<AttendanceHeaderProps> = ({
    searchTerm,
    onSearchChange,
    onExportPdf,
    //ExportExcel,
}) => {
    return (
        <motion.div
            variants={itemVariants}
            className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
        >
            {/* LEFT: Title */}
            <div>
                <h1 className="text-3xl font-bold text-black">
                    Attendance for Employees
                </h1>
                <h2 className="text-xl text-black">Total Attendance for a Month</h2>
            </div>

            {/* RIGHT: Search Bar and Export Actions */}
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                <SearchBar
                    value={searchTerm}
                    onChange={onSearchChange}
                    placeholder="Search by Employee Name"
                    className="w-full md:w-64"
                />
                {/* Export Buttons */}
                <div className="flex gap-2">
                    <ExportActions
                        onExportPdf={onExportPdf}
                    // onExportExcel={onExportExcel}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default AttendanceHeader;
