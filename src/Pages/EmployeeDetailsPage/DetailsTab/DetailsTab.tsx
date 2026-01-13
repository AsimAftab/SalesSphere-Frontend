import React from 'react';
import { motion } from 'framer-motion';

import HeaderActions from './components/sections/HeaderActions';

// Import Logic
import { useProfileLogic } from './hooks/useProfileLogic';
import { type Employee, type AttendanceSummaryData } from '../../../api/employeeService';
import EmployeeDetailsSkeleton from './components/skeletons/DetailsTabSkeleton';
import DocumentsSection from './components/sections/DocumentsSection';
import AttendanceSummaryCard from './components/cards/AttendanceSummaryCard';
import EmployeeInfoCard from './components/cards/EmployeeInfoCard';
import ProfileHeaderCard from './components/cards/ProfileHeaderCard';

interface DetailsTabProps {
    employee: Employee | null;
    attendanceSummary: AttendanceSummaryData | null;
    loading: boolean;
    error: string | null;
}

const containerVariants = {
    hidden: { opacity: 1 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

const DetailsTab: React.FC<DetailsTabProps> = ({
    employee,
    attendanceSummary,
    loading,
    error
}) => {
    // Lifted Logic
    const { roleName, formattedAttendance } = useProfileLogic(employee, attendanceSummary);

    if (loading) {
        return <EmployeeDetailsSkeleton />;
    }

    if (error) {
        return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;
    }
    if (!employee) {
        return <div className="text-center p-10 text-gray-500">Employee not found.</div>;
    }

    const isAdmin = employee.role?.toLowerCase() === 'admin';

    const infoDetails = [
        { label: 'Gender', value: employee.gender || 'N/A' },
        { label: 'Age', value: employee.age ? `${employee.age} years` : 'N/A' },
        { label: 'Date of Birth', value: employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A' },
        { label: 'Phone Number', value: employee.phone || 'N/A' },
        { label: 'Email Address', value: employee.email || 'N/A' },
        { label: 'Address', value: employee.address || 'N/A' },
        { label: 'PAN Number', value: employee.panNumber || 'N/A' },
        { label: 'Citizenship Number', value: employee.citizenshipNumber || 'N/A' },
        {
            label: 'Supervisor',
            value: employee.reportsTo && employee.reportsTo.length > 0
                ? employee.reportsTo.map(r => r.name).join(', ')
                : 'N/A'
        },
        { label: 'Date Joined', value: employee.dateJoined ? new Date(employee.dateJoined).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/F' },
    ];


    return (
        <motion.div
            className="relative h-full overflow-y-auto py-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {/* Header: Title + Actions (Edit/Delete) */}
            <HeaderActions employee={employee} />

            <motion.div variants={itemVariants} className="space-y-6">

                {/* Row 1: Profile Header + Documents (Side by Side) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProfileHeaderCard
                        name={employee.name || 'Unknown Employee'}
                        title={roleName}
                        imageUrl={employee.avatarUrl || `https://placehold.co/150x150/e0e0e0/ffffff?text=${employee.name ? employee.name.charAt(0) : 'E'}`}
                    />
                    <DocumentsSection employee={employee} />
                </div>

                {/* Row 2: Employee Info + Attendance (Side by side) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <EmployeeInfoCard details={infoDetails} />

                    {isAdmin ? (
                        <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 flex flex-col items-center justify-center h-full text-center">
                            <div className="p-3 bg-gray-100 rounded-full mb-3">
                                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-1">
                                Attendance Not Applicable
                            </h3>
                            <p className="text-gray-500 text-sm max-w-xs">
                                Attendance tracking is disabled for administrative profiles. This role is exempt from standard attendance monitoring.
                            </p>
                        </div>
                    ) : (
                        <div className="h-full">
                            <AttendanceSummaryCard
                                percentage={formattedAttendance?.percentage ?? 0}
                                stats={formattedAttendance?.stats ?? []}
                                monthYear={formattedAttendance?.monthYear ?? 'Current Month'}
                                totalWorkingDays={formattedAttendance?.totalWorkingDays ?? 0}
                            />
                        </div>
                    )}
                </div>

            </motion.div>
        </motion.div>
    );
};

export default DetailsTab;
