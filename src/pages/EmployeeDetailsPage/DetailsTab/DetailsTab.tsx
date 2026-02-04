import React from 'react';
import { motion } from 'framer-motion';

import HeaderActions from './components/sections/HeaderActions';
import { useProfileLogic } from './hooks/useProfileLogic';
import { type Employee, type AttendanceSummaryData } from '@/api/employeeService';
import EmployeeDetailsSkeleton from './components/skeletons/DetailsTabSkeleton';
import DocumentsSection from './components/sections/DocumentsSection';
import AttendanceSummaryCard from './components/cards/AttendanceSummaryCard';
import { InfoBlock } from '@/components/ui';
import { formatDisplayDate, getAge } from '@/utils/dateUtils';
import {
    Briefcase,
    CalendarDays,
    CircleUser,
    IdCard,
    Mail,
    MapPin,
    Phone,
    User,
    Users,
} from 'lucide-react';


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

    const imageUrl = employee.avatarUrl || `https://placehold.co/150x150/197ADC/ffffff?text=${(employee.name || 'U').charAt(0)}`;

    const age = employee.age ?? getAge(employee.dateOfBirth);

    const dobDisplay = employee.dateOfBirth
        ? `${formatDisplayDate(employee.dateOfBirth)}${age !== null && age !== undefined ? ` (${age} years)` : ''}`
        : 'N/A';

    const infoItems: { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; label: string; value: string }[] = [
        // Row 1: Email and Phone
        { icon: Mail, label: 'Email', value: employee.email || 'N/A' },
        { icon: Phone, label: 'Phone', value: employee.phone || 'N/A' },
        // Row 2: Gender and Date of Birth
        { icon: CircleUser, label: 'Gender', value: employee.gender || 'N/A' },
        { icon: CalendarDays, label: 'Date of Birth', value: dobDisplay },
        // Row 3: Role and Supervisor
        { icon: Briefcase, label: 'Role', value: roleName },
        {
            icon: Users,
            label: 'Supervisor',
            value: employee.reportsTo && employee.reportsTo.length > 0
                ? employee.reportsTo.map(r => r.name).join(', ')
                : 'N/A'
        },
        // Row 4: Citizenship Number and PAN Number
        { icon: IdCard, label: 'Citizenship Number', value: employee.citizenshipNumber || 'N/A' },
        { icon: IdCard, label: 'PAN Number', value: employee.panNumber || 'N/A' },
        // Row 5: Date Joined and Address
        { icon: CalendarDays, label: 'Date Joined', value: employee.dateJoined ? formatDisplayDate(employee.dateJoined) : 'N/A' },
        { icon: MapPin, label: 'Address', value: employee.address || 'N/A' },
    ];

    return (
        <motion.div
            className="relative h-full overflow-y-auto py-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            <HeaderActions employee={employee} />

            <motion.div variants={itemVariants}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Combined Profile + Info Card (takes 2 cols) */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        {/* Avatar + Name Row */}
                        <div className="flex items-center gap-6 mb-6">
                            <img
                                src={imageUrl}
                                alt={employee.name}
                                className="h-24 w-24 rounded-full object-cover ring-2 ring-offset-2 ring-blue-500 flex-shrink-0"
                            />
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">{employee.name || 'Unknown Employee'}</h2>
                                <p className="text-md font-semibold text-gray-500">{roleName}</p>
                            </div>
                        </div>

                        <hr className="border-gray-200 mb-6" />

                        {/* Section Header */}
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
                        </div>

                        {/* InfoBlock Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8">
                            {infoItems.map((item) => (
                                <InfoBlock
                                    key={item.label}
                                    icon={item.icon}
                                    label={item.label}
                                    value={item.value}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right: Documents + Attendance stacked */}
                    <div className="flex flex-col gap-6">
                        <DocumentsSection employee={employee} />

                        {isAdmin ? (
                            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 flex flex-col items-center justify-center text-center flex-1">
                                <div className="p-3 bg-gray-100 rounded-full mb-3">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-1">
                                    Attendance Not Applicable
                                </h3>
                                <p className="text-gray-500 text-sm max-w-xs">
                                    Attendance tracking is disabled for administrative profiles.
                                </p>
                            </div>
                        ) : (
                            <div className="flex-1">
                                <AttendanceSummaryCard
                                    percentage={formattedAttendance?.percentage ?? 0}
                                    stats={formattedAttendance?.stats ?? []}
                                    monthYear={formattedAttendance?.monthYear ?? 'Current Month'}
                                    totalWorkingDays={formattedAttendance?.totalWorkingDays ?? 0}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

        </motion.div>
    );
};

export default DetailsTab;
