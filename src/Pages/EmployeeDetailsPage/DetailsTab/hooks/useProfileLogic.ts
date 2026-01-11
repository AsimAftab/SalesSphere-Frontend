import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { roleService } from '../../../../api/roleService';
import { type Employee, type AttendanceSummaryData } from '../../../../api/employeeService';
import { type Role } from '../../../AdminPanelPage/PermissionTab/types/admin.types';

export const useProfileLogic = (employee: Employee | undefined | null, attendanceSummary: AttendanceSummaryData | undefined | null) => {

    // --- DATA FETCHING (Roles) ---
    const { data: rolesResponse } = useQuery({
        queryKey: ['roles'],
        queryFn: roleService.getAll
    });
    const roles = rolesResponse?.data?.data || [];

    const roleName = useMemo(() => {
        if (!employee) return '';
        if (typeof employee.customRoleId === 'object' && employee.customRoleId?.name) {
            return employee.customRoleId.name;
        }
        if (typeof employee.customRoleId === 'string') {
            const foundRole = roles.find((r: Role) => r._id === employee.customRoleId);
            if (foundRole) return foundRole.name;
        }
        return employee.role || 'User';
    }, [employee, roles]);


    // --- FORMATTERS (Attendance) ---
    const formattedAttendance = useMemo(() => {
        if (!attendanceSummary?.attendance) return null;
        const stats: any = attendanceSummary.attendance;
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June', 'July',
            'August', 'September', 'October', 'November', 'December',
        ];

        // Safe parsing of month
        let monthIndex = 0;
        if (typeof attendanceSummary.month === 'number') {
            monthIndex = attendanceSummary.month - 1;
        } else if (typeof attendanceSummary.month === 'string') {
            monthIndex = parseInt(attendanceSummary.month, 10) - 1;
        }

        const monthName = monthNames[monthIndex] || 'Month';
        const percentageValue = parseFloat(String(attendanceSummary.attendancePercentage));

        return {
            percentage: isNaN(percentageValue) ? 0 : percentageValue,
            stats: [
                { value: stats.present, label: 'Present', color: 'bg-green-500' },
                { value: stats.weeklyOff, label: 'Weekly Off', color: 'bg-blue-500' },
                { value: stats.halfday || stats.halfDay, label: 'Half Day', color: 'bg-purple-500' },
                { value: stats.leave, label: 'Leave', color: 'bg-yellow-500' },
                { value: stats.absent, label: 'Absent', color: 'bg-red-500' },
            ].filter(stat => stat.value > 0),
            monthYear: `${monthName} ${attendanceSummary.year}`,
            totalWorkingDays: stats.workingDays,
        };
    }, [attendanceSummary]);

    return {
        roleName,
        formattedAttendance
    };
};
