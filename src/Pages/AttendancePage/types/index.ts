import type { Employee } from '../../../api/attendanceService';

export interface FilteredEmployee extends Employee {
    attendanceString: string;
}

export interface CalendarDay {
    day: number;
    weekday: string;
    isWeeklyOff: boolean;
}

export interface EditingCell {
    employeeId: string;
    employeeName: string;
    day: number;
    dateString: string;
}

export interface AttendanceStats {
    present: number;
    absent: number;
    weeklyOff: number;
    leave: number;
    halfDay: number;
}
