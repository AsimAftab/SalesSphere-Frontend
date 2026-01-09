import React from 'react';
import ProfileHeaderCard from '../../../../components/cards/EmployeeDetails_cards/ProfileHeaderCard';
import EmployeeInfoCard from '../../../../components/cards/EmployeeDetails_cards/EmployeeInfoCard';
import AttendanceSummaryCard from '../../../../components/cards/EmployeeDetails_cards/AttendanceSummaryCard';
import { useProfileLogic } from '../types/useProfileLogic';
import { type Employee, type AttendanceSummaryData } from '../../../../api/employeeService';

interface ProfileSectionProps {
    employee: Employee | null;
    attendanceSummary: AttendanceSummaryData | null;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ employee, attendanceSummary }) => {
    const { roleName, formattedAttendance } = useProfileLogic(employee, attendanceSummary);

    if (!employee) return null;

    const isAdmin = employee.role?.toLowerCase() === 'admin';

    const infoDetails = [
        { label: 'Gender', value: employee.gender || 'N/A' },
        { label: 'Age', value: employee.age ? `${employee.age} years` : 'N/A' },
        { label: 'Date of Birth', value: employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A' },
        { label: 'Phone Number', value: employee.phone || 'N/A' },
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
        <div className="space-y-6">
            <ProfileHeaderCard
                name={employee.name || 'Unknown Employee'}
                title={roleName}
                imageUrl={employee.avatarUrl || `https://placehold.co/150x150/e0e0e0/ffffff?text=${employee.name ? employee.name.charAt(0) : 'E'}`}
            />
            <EmployeeInfoCard details={infoDetails} />
            {isAdmin ? (
                <div className="bg-white p-6 rounded-lg shadow-md ">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                        Administrative Profile: Attendance Exempt
                    </h3>
                    <p className="text-red-600">
                        Attendance data is not tracked or recorded for roles designated as Administrative (Admin).
                    </p>
                </div>
            ) : (
                <AttendanceSummaryCard
                    percentage={formattedAttendance?.percentage ?? 0}
                    stats={formattedAttendance?.stats ?? []}
                    monthYear={formattedAttendance?.monthYear ?? 'Current Month'}
                    totalWorkingDays={formattedAttendance?.totalWorkingDays ?? 0}
                />
            )}
        </div>
    );
};

export default ProfileSection;
