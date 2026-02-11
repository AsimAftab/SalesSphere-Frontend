import type { CalendarDay } from '../types';
import { MONTH_NAMES } from './attendanceConstants';

export const getDaysInMonth = (monthName: string, year: number): number => {
    const monthIndex = MONTH_NAMES.indexOf(monthName);
    return new Date(year, monthIndex + 1, 0).getDate();
};

export const getWorkingDays = (attendanceString: string): number => {
    const presentDays = (attendanceString.match(/P/g) || []).length;
    const halfDays = (attendanceString.match(/H/g) || []).length;
    const leaveDays = (attendanceString.match(/L/g) || []).length;
    const weekDays = (attendanceString.match(/W/g) || []).length;
    return presentDays + halfDays * 0.5 + weekDays + leaveDays;
};

export const applyDefaultAttendance = (
    calendarDays: CalendarDay[],
    attendanceString?: string
): string => {
    const result = (attendanceString || '').split('');
    const daysInMonth = calendarDays.length;

    for (let i = 0; i < daysInMonth; i++) {
        const day = calendarDays[i];
        if (day.isWeeklyOff && (!result[i] || result[i] === ' ')) {
            if (!result[i]) result[i] = 'W';
        }
        if (!result[i] || result[i].trim() === '') {
            result[i] = '-';
        }
    }
    return result.slice(0, daysInMonth).join('');
};

export const getFullDateString = (day: number, monthName: string, year: number): string => {
    const monthStr = String(MONTH_NAMES.indexOf(monthName) + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${monthStr}-${dayStr}`;
};
