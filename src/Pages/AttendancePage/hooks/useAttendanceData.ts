import { useQuery } from '@tanstack/react-query';
import { fetchAttendanceData, type TransformedReportData } from '../../../api/attendanceService';

export const useAttendanceData = (selectedMonth: string, currentYear: number) => {
    return useQuery<TransformedReportData, Error>({
        queryKey: ['attendance', selectedMonth, currentYear],
        queryFn: () => fetchAttendanceData(selectedMonth, currentYear),
        placeholderData: (previousData) => previousData,
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });
};
