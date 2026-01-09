import { useQuery } from '@tanstack/react-query';
import { getEmployeeById, fetchAttendanceSummary, type Employee, type AttendanceSummaryData } from '../../../api/employeeService';

export const useEmployee = (employeeId: string | undefined) => {
    const {
        data: employee,
        isLoading: isEmployeeLoading,
        error: employeeError,
    } = useQuery<Employee, Error>({
        queryKey: ['employee', employeeId],
        queryFn: async () => {
            if (!employeeId) throw new Error("Employee ID is missing.");
            return getEmployeeById(employeeId);
        },
        enabled: !!employeeId,
    });

    return { employee, isEmployeeLoading, employeeError };
};

export const useAttendance = (employeeId: string | undefined, month: number, year: number) => {
    const {
        data: attendanceSummary,
        isLoading: isAttendanceLoading,
        error: attendanceError,
    } = useQuery<AttendanceSummaryData, Error>({
        queryKey: ['attendanceSummary', employeeId, month, year],
        queryFn: () => {
            if (!employeeId) throw new Error("Employee ID is missing for attendance.");
            return fetchAttendanceSummary(employeeId, month, year);
        },
        enabled: !!employeeId,
        staleTime: 1000 * 60 * 5,
    });

    return { attendanceSummary, isAttendanceLoading, attendanceError };
};
