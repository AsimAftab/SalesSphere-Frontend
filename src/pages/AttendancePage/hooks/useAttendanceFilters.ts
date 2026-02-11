import { useState, useMemo } from 'react';
import type { Employee } from '@/api/attendanceService';
import type { CalendarDay, FilteredEmployee } from '../types';
import { getDaysInMonth, applyDefaultAttendance } from '../utils/attendanceHelpers';
import { MONTH_NAMES } from '../utils/attendanceConstants';

interface UseAttendanceFiltersProps {
    employees: Employee[];
    weeklyOffDay: string;
    selectedMonth: string;
    currentYear: number;
}

export const useAttendanceFilters = ({ employees, weeklyOffDay, selectedMonth, currentYear }: UseAttendanceFiltersProps) => {
    // State
    const [searchTerm, setSearchTermInternal] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const setSearchTerm = (value: string) => {
        setSearchTermInternal(value);
        setCurrentPage(1);
    };
    const entriesPerPage = 10;

    // 1. Calculate Calendar Days
    const daysInMonth = useMemo(
        () => getDaysInMonth(selectedMonth, currentYear),
        [selectedMonth, currentYear]
    );

    const calendarDays = useMemo((): CalendarDay[] => {
        const monthIndex = MONTH_NAMES.indexOf(selectedMonth);
        const dayOfWeekNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        // Map full day name (e.g. "Sunday") to short name ("Sun")
        // Assuming backend returns full name like 'Sunday'
        const shortWeeklyOff = weeklyOffDay.slice(0, 3);

        return Array.from({ length: daysInMonth }, (_, i) => {
            const date = new Date(currentYear, monthIndex, i + 1);
            const weekday = dayOfWeekNamesShort[date.getDay()];
            return {
                day: i + 1,
                weekday,
                isWeeklyOff: weekday === shortWeeklyOff || weekday === weeklyOffDay.slice(0, 3) // simple match
            };
        });
    }, [daysInMonth, selectedMonth, currentYear, weeklyOffDay]);

    // 2. Filter Employees & Process Attendance Strings
    const filteredEmployees = useMemo((): FilteredEmployee[] => {
        const monthYearKey = `${selectedMonth}-${currentYear}`;
        return employees
            .map(employee => {
                const rawAttendance = employee.attendance?.[monthYearKey];
                const finalAttendanceString = applyDefaultAttendance(calendarDays, rawAttendance);
                return { ...employee, attendanceString: finalAttendanceString };
            })
            .filter(emp =>
                emp.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [employees, selectedMonth, currentYear, calendarDays, searchTerm]);

    // 3. Pagination Logic
    const paginatedEmployees = useMemo(() => {
        const startIndex = (currentPage - 1) * entriesPerPage;
        return filteredEmployees.slice(startIndex, startIndex + entriesPerPage);
    }, [filteredEmployees, currentPage]);

    const paginationInfo = useMemo(() => {
        const total = filteredEmployees.length;
        const pages = Math.ceil(total / entriesPerPage) || 1;
        const start = total > 0 ? (currentPage - 1) * entriesPerPage + 1 : 0;
        const end = Math.min(start + entriesPerPage - 1, total);
        return {
            totalPages: pages,
            showingStart: start,
            showingEnd: end,
            totalEntries: total
        };
    }, [filteredEmployees, currentPage]);

    return {
        searchTerm,
        setSearchTerm,
        currentPage,
        setCurrentPage,
        calendarDays,
        filteredEmployees,
        paginatedEmployees,
        paginationInfo,
        daysInMonth
    };
};
