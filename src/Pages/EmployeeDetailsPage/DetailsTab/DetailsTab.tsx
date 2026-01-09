import React from 'react';
import { motion } from 'framer-motion';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import HeaderActions from './components/HeaderActions';
import ProfileSection from './components/ProfileSection';
import ContactSection from './components/ContactSection';
import DocumentsSection from './components/DocumentsSection';

import { type Employee, type AttendanceSummaryData } from '../../../api/employeeService';

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

const EmployeeDetailsSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
            <div className="relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-4">
                        <Skeleton circle width={36} height={36} />
                        <Skeleton width={200} height={28} />
                    </div>
                    <div className="flex flex-col md:flex-row w-full md:w-auto gap-4 md:space-x-4">
                        <Skeleton height={40} width={180} borderRadius={8} />
                        <Skeleton height={40} width={160} borderRadius={8} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <div className="flex items-center gap-4">
                                <Skeleton circle width={80} height={80} />
                                <div className="flex-1">
                                    <Skeleton width="60%" height={24} />
                                    <Skeleton width="40%" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <Skeleton width="30%" height={20} className="mb-4" />
                            <Skeleton count={7} />
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <Skeleton width="40%" height={20} className="mb-4" />
                            <div className="flex items-center gap-6">
                                <Skeleton circle width={100} height={100} />
                                <div className="flex-1">
                                    <Skeleton count={3} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-6">

                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <Skeleton width="50%" height={20} className="mb-4" />
                            <Skeleton count={3} />
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <Skeleton width="40%" height={20} className="mb-4" />
                            <Skeleton count={4} />
                        </div>
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};


const DetailsTab: React.FC<DetailsTabProps> = ({
    employee,
    attendanceSummary,
    loading,
    error
}) => {

    if (loading) {
        return <EmployeeDetailsSkeleton />;
    }

    if (error) {
        return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;
    }
    if (!employee) {
        return <div className="text-center p-10 text-gray-500">Employee not found.</div>;
    }

    return (
        <motion.div
            className="relative"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {/* Header: Title + Actions (Edit/Delete) */}
            <HeaderActions employee={employee} />

            <motion.div
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                variants={itemVariants}
            >
                {/* Left Column: Profile, Info, Attendance */}
                <div className="lg:col-span-2 space-y-6">
                    <ProfileSection employee={employee} attendanceSummary={attendanceSummary} />
                </div>

                {/* Right Column: Contact, Documents */}
                <div className="lg:col-span-1 space-y-6">
                    <ContactSection employee={employee} />
                    <DocumentsSection employee={employee} />
                </div>
            </motion.div>
        </motion.div>
    );
};

export default DetailsTab;
