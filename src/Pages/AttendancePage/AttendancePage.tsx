import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import type * as ExcelJS from 'exceljs';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import {
  fetchAttendanceData,
  updateSingleAttendance,
  updateBulkAttendance,
  type TransformedReportData,
} from '../../api/attendanceService';
import type {
  Employee,
} from '../../api/attendanceService';

import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Button from '../../components/UI/Button/Button';
import ExportActions from '../../components/UI/Export/ExportActions';
import BulkUpdateModal from '../../components/modals/AttendanceBulkUpdateModal';
import AttendanceStatusModal from '../../components/modals/AttendanceStatusModal';

// --- TYPE DEFINITIONS ---
interface FilteredEmployee extends Employee {
  attendanceString: string;
}
interface CalendarDay {
  day: number;
  weekday: string;
  isWeeklyOff: boolean;
}
interface EditingCell {
  employeeId: string;
  employeeName: string;
  day: number;
  dateString: string;
}

// --- UTILITY FUNCTIONS ---
const getDaysInMonth = (monthName: string, year: number): number => {
  const monthIndex = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December',
  ].indexOf(monthName);
  return new Date(year, monthIndex + 1, 0).getDate();
};

const getWorkingDays = (attendanceString: string): number => {
  const presentDays = (attendanceString.match(/P/g) || []).length;
  const halfDays = (attendanceString.match(/H/g) || []).length;
  const leaveDays = (attendanceString.match(/L/g) || []).length;
  const weekDays = (attendanceString.match(/W/g) || []).length;
  return presentDays + halfDays * 0.5 + weekDays + leaveDays;
};

const statusColors: Record<string, string> = {
  P: 'text-green-500', W: 'text-blue-500', A: 'text-red-500',
  L: 'text-yellow-500', H: 'text-purple-500', '-': 'text-gray-400',
};

const applyDefaultAttendance = (
  calendarDays: CalendarDay[],
  attendanceString?: string
): string => {
  let result = (attendanceString || '').split('');
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

// --- Animation Variants ---
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

// --- Skeleton Component ---
const AttendancePageSkeleton: React.FC = () => {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const employeeNameWidth = '200px';
  const workingDaysWidth = '110px';
  const minDayCellWidth = 35;
  const minDayContainerWidth = days.length * minDayCellWidth;
  const requiredMinWidth =
    parseInt(employeeNameWidth) +
    parseInt(workingDaysWidth) +
    minDayContainerWidth;

  return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
      <div className="p-6">
        {/* Header Skeleton */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">
              <Skeleton width={300} height={36} />
            </h1>
            <h2 className="text-xl">
              <Skeleton width={250} />
            </h2>
          </div>
          <div className="w-full md:w-72">
            <Skeleton height={40} borderRadius={999} />
          </div>
        </div>

        <div className="w-full space-y-6">
          {/* Desktop Controls Skeleton */}
          <div className="bg-white p-4 rounded-xl shadow-md hidden md:flex items-center justify-between gap-4">
            <div className="flex items-center flex-wrap gap-x-4 gap-y-2">
              <Skeleton width={300} height={24} />
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Skeleton width={120} height={38} borderRadius={8} />
                <Skeleton width={70} height={38} borderRadius={8} />
              </div>
              <Skeleton width={100} height={38} borderRadius={8} />
            </div>
          </div>

          {/* Table Skeleton */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto">
            <div style={{ minWidth: `${requiredMinWidth}px` }}>
              {/* Table Header */}
              <div className="flex border-b-2 border-gray-200 sticky top-0 z-10">
                <div
                  className="p-3 bg-gray-200"
                  style={{ width: employeeNameWidth, flexShrink: 0 }}
                >
                  <Skeleton />
                </div>
                <div
                  className="flex-1 grid"
                  style={{
                    gridTemplateColumns: `repeat(${days.length}, 1fr)`,
                    minWidth: `${minDayContainerWidth}px`,
                  }}
                >
                  {days.map((day) => (
                    <div
                      key={day}
                      className="p-1 text-center bg-gray-200 border-l border-white/20"
                    >
                      <Skeleton count={2} />
                    </div>
                  ))}
                </div>
                <div
                  className="p-3 bg-gray-200 border-l border-white/20"
                  style={{ width: workingDaysWidth, flexShrink: 0 }}
                >
                  <Skeleton />
                </div>
              </div>
              {/* Table Body */}
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="flex border-b border-gray-200 items-stretch"
                >
                  <div
                    className="p-3 border-r border-gray-200 flex items-center"
                    style={{ width: employeeNameWidth, flexShrink: 0 }}
                  >
                    <Skeleton />
                  </div>
                  <div
                    className="flex-1 grid"
                    style={{
                      gridTemplateColumns: `repeat(${days.length}, 1fr)`,
                      minWidth: `${minDayContainerWidth}px`,
                    }}
                  >
                    {days.map((day) => (
                      <div
                        key={day}
                        className="h-12 border-l border-gray-200 p-2"
                      >
                        <Skeleton height="100%" />
                      </div>
                    ))}
                  </div>
                  <div
                    className="p-3 border-l border-gray-200 flex items-center justify-center"
                    style={{ width: workingDaysWidth, flexShrink: 0 }}
                  >
                    <Skeleton />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Skeleton */}
          <div className="flex items-center justify-between mt-4">
            <Skeleton width={200} />
            <div className="flex items-center gap-x-2">
              <Skeleton width={80} height={38} borderRadius={8} />
              <Skeleton width={80} height={38} borderRadius={8} />
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

// --- MAIN COMPONENT ---
const AttendancePage: React.FC = () => {
  // --- All state and logic ---
  const queryClient = useQueryClient();
  const monthNames = useMemo(
    () => [
      'January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December',
    ],
    []
  );
  const now = new Date();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(monthNames[now.getMonth()]);
  const currentYear = now.getFullYear();
  const [weeklyOffDay, setWeeklyOffDay] = useState('Saturday');
  const [currentPage, setCurrentPage] = useState(1);
  const [exportingStatus, setExportingStatus] = useState<'pdf' | 'excel' | null>(
    null
  );
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [bulkUpdateDay, setBulkUpdateDay] = useState<CalendarDay | null>(null);
  const entriesPerPage = 10;
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: fetchedData,
    isLoading,
    error,
  } = useQuery<TransformedReportData, Error>({
    queryKey: ['attendance', selectedMonth, currentYear],
    queryFn: () => fetchAttendanceData(selectedMonth, currentYear),
    placeholderData: (previousData) => previousData,
  });


  useEffect(() => {
    if (fetchedData) {
      setEmployees(fetchedData.employees);
      setWeeklyOffDay(fetchedData.weeklyOffDay || 'Saturday');
    }
  }, [fetchedData]);


  const daysInMonth = useMemo(
    () => getDaysInMonth(selectedMonth, currentYear),
    [selectedMonth, currentYear]
  );

  const calendarDays = useMemo((): CalendarDay[] => {
    const monthIndex = monthNames.indexOf(selectedMonth);
    const dayOfWeekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeekNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyOffDayShort = dayOfWeekNamesShort[dayOfWeekNames.indexOf(weeklyOffDay)];

    return Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(currentYear, monthIndex, i + 1);
      const weekday = dayOfWeekNamesShort[date.getDay()];
      return {
        day: i + 1,
        weekday,
        isWeeklyOff: weekday === weeklyOffDayShort
      };
    });
  }, [daysInMonth, selectedMonth, currentYear, monthNames, weeklyOffDay]);

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

  const isSearchActive = searchTerm.trim().length > 0;

  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * entriesPerPage;
    return filteredEmployees.slice(startIndex, startIndex + entriesPerPage);
  }, [filteredEmployees, currentPage]);

  const { totalPages, showingStart, showingEnd, totalEntries } = useMemo(() => {
    const total = filteredEmployees.length;
    const pages = Math.ceil(total / entriesPerPage) || 1;
    const start = total > 0 ? (currentPage - 1) * entriesPerPage + 1 : 0;
    const end = Math.min(start + entriesPerPage - 1, total);
    return { totalPages: pages, showingStart: start, showingEnd: end, totalEntries: total };
  }, [filteredEmployees, currentPage, entriesPerPage]);

  const singleUpdateMutation = useMutation({
    mutationFn: updateSingleAttendance,
    onSuccess: () => {
      toast.success('Attendance updated successfully!');
      queryClient.invalidateQueries({
        queryKey: ['attendance', selectedMonth, currentYear],
      });
      if (editingCell) {
        queryClient.invalidateQueries({
          queryKey: ['attendanceDetail', editingCell.employeeId, editingCell.dateString]
        });
      }
    },
    onError: (err: any) => {
      toast.error(`Update failed: ${err.response?.data?.message || err.message}`);
    },
    onSettled: () => {
      setEditingCell(null);
    },
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: updateBulkAttendance,
    onSuccess: () => {
      toast.success('Bulk update successful!');
      queryClient.invalidateQueries({
        queryKey: ['attendance', selectedMonth, currentYear],
      });
    },
    onError: (err: any) => {
      toast.error(`Update failed: ${err.response?.data?.message || err.message}`);
    },
    onSettled: () => {
      setBulkUpdateDay(null);
    },
  });

  const getFullDateString = (day: number): string => {
    const monthStr = String(monthNames.indexOf(selectedMonth) + 1).padStart(
      2,
      '0'
    );
    const dayStr = String(day).padStart(2, '0');
    return `${currentYear}-${monthStr}-${dayStr}`;
  };

  const handleStatusUpdate = (newStatus: string, note: string) => {
    if (!editingCell) {
      toast.error("Error: No cell selected.");
      return;
    }
    const payload = {
      employeeId: editingCell.employeeId,
      date: editingCell.dateString,
      status: newStatus,
      notes: note,
    };
    singleUpdateMutation.mutate(payload);
  };

  const handleBulkUpdate = (newStatus: string, note: string) => {
    if (!bulkUpdateDay) return;

    if (newStatus === 'L') {
      const payload = {
        date: getFullDateString(bulkUpdateDay.day),
        occasionName: note,
      };
      bulkUpdateMutation.mutate(payload);
    } else {
      toast.error('This bulk action is not supported.');
      setBulkUpdateDay(null);
    }
  };

  const handleCellClick = (employee: FilteredEmployee, dayIndex: number) => {
    const day = dayIndex + 1;
    setEditingCell({
      employeeId: employee.id,
      employeeName: employee.name,
      day: day,
      dateString: getFullDateString(day),
    });
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleExportPdf = async () => {
    setExportingStatus('pdf');
    try {
      const { pdf } = await import('@react-pdf/renderer');
      const { saveAs } = await import('file-saver');
      const AttendancePDF = (await import('./AttendancePDF')).default;

      const employeesForPdf = filteredEmployees.map(
        ({ name, attendanceString }) => ({ name, attendanceString })
      );
      const doc = (
        <AttendancePDF
          employees={employeesForPdf}
          days={calendarDays}
          month={selectedMonth}
          year={String(currentYear)}
        />
      );
      const blob = await pdf(doc).toBlob();
      saveAs(blob, `Attendance_${selectedMonth}_${currentYear}.pdf`);
      toast.success('PDF exported successfully!');
    } catch (error) {
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setExportingStatus(null);
    }
  };

  const handleExportExcel = async () => {
    setExportingStatus('excel');
    try {
      const ExcelJS = await import('exceljs');
      const { saveAs } = await import('file-saver');

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Attendance');

      const titleCell = worksheet.getCell('A1');
      titleCell.value = `Attendance for ${selectedMonth} ${currentYear}`;
      titleCell.font = { size: 14, bold: true };
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.addRow([]); // Row 2

      const dayHeader = [
        'S.No.',
        'Employee Name',
        ...calendarDays.map((d) => d.day.toString()),
        'Working Days',
      ];
      const weekdayHeader = ['', '', ...calendarDays.map((d) => d.weekday), ''];

      const dayHeaderRow = worksheet.addRow(dayHeader); // Row 3
      const weekdayHeaderRow = worksheet.addRow(weekdayHeader); // Row 4

      const headerStyle: Partial<ExcelJS.Style> = {
        font: { bold: true, color: { argb: 'FFFFFFFF' } },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF197ADC' } },
        alignment: { horizontal: 'center', vertical: 'middle' },
        border: {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        },
      };
      [dayHeaderRow, weekdayHeaderRow].forEach((row) => {
        row.eachCell((cell) => {
          cell.style = headerStyle;
        });
      });

      worksheet.columns = [
        { width: 5 }, // S.No
        { width: 25 }, // Employee Name
        ...calendarDays.map(() => ({ width: 5 })), // Days
        { width: 15 }, // Working Days
      ];

      const lastCol = worksheet.columns.length;

      worksheet.mergeCells(1, 1, 1, lastCol);
      worksheet.mergeCells(3, 1, 4, 1);
      worksheet.mergeCells(3, 2, 4, 2);
      worksheet.mergeCells(3, lastCol, 4, lastCol);

      filteredEmployees.forEach((emp, index) => {
        const rowData = [
          index + 1,
          emp.name,
          ...emp.attendanceString.split(''),
          getWorkingDays(emp.attendanceString),
        ];
        const row = worksheet.addRow(rowData);

        row.eachCell((cell, colNumber) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };

          const isNameCol = colNumber === 2;
          if (isNameCol) {
            cell.alignment = { horizontal: 'left', vertical: 'middle' };
          } else {
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
          }
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, `Attendance_${selectedMonth}_${currentYear}.xlsx`);
      toast.success('Excel exported successfully!');
    } catch (error) {
      toast.error('Failed to generate Excel. Please try again.');
    } finally {
      setExportingStatus(null);
    }
  };

  const employeeNameWidth = '200px';
  const workingDaysWidth = '110px';
  const minDayCellWidth = 35;
  const minDayContainerWidth = daysInMonth * minDayCellWidth;
  const requiredMinWidth =
    parseInt(employeeNameWidth) +
    parseInt(workingDaysWidth) +
    minDayContainerWidth;

  const isUpdating =
    singleUpdateMutation.isPending || bulkUpdateMutation.isPending;

  // --- Render Logic ---
  if (isLoading && !fetchedData) {
    return (
      <Sidebar>
        <AttendancePageSkeleton />
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      {isUpdating && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-40">
          <p className="text-gray-600 text-lg">
            Updating attendance...
          </p>
        </div>
      )}

      {/* --- Main Motion Container --- */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* --- Item 1: Header --- */}
        <motion.div
          variants={itemVariants}
          className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
        >
          <div>
            <h1 className="text-3xl font-bold text-black">
              Attendance for Employees
            </h1>
            <h2 className="text-xl text-black">Total Attendance for a Month</h2>
          </div>
          <div className="relative w-full sm:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Employee Name"
              className="h-10 w-full bg-gray-200 border border-gray-200 pl-10 pr-4 rounded-full text-sm shadow-sm outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

        </motion.div>

        {/* Modals */}
        <AttendanceStatusModal
          isOpen={!!editingCell}
          onClose={() => setEditingCell(null)}
          onSave={handleStatusUpdate}
          employeeName={editingCell?.employeeName || ''}
          day={editingCell?.day || 0}
          month={selectedMonth}
          employeeId={editingCell?.employeeId || null}
          dateString={editingCell?.dateString || null}
          organizationWeeklyOffDay={weeklyOffDay}
          isWeeklyOffDay={
            (editingCell && calendarDays[editingCell.day - 1]?.isWeeklyOff) || false
          }
        />


        <BulkUpdateModal
          isOpen={!!bulkUpdateDay}
          onClose={() => setBulkUpdateDay(null)}
          onConfirm={handleBulkUpdate}
          day={bulkUpdateDay?.day || 0}
          weekday={bulkUpdateDay?.weekday || ''}
          month={selectedMonth}
          // ✅ ADD THIS LINE:
          // The 'bulkUpdateDay' object already has the boolean we need.
          isWeeklyOffDay={bulkUpdateDay?.isWeeklyOff || false}
        />

        {/* This div contains all the content blocks that will be animated */}
        <div className="w-full space-y-6">
          {exportingStatus && (
            <div className="w-full p-4 text-center bg-blue-100 text-blue-800 rounded-lg">
              Generating {exportingStatus.toUpperCase()}... Please wait.
            </div>
          )}

          {/* --- Item 2: Mobile Controls --- */}
          <motion.div
            variants={itemVariants}
            className="bg-white p-4 rounded-xl shadow-md space-y-4 md:hidden"
          >
            <div className="flex flex-row gap-4">
              <select
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm flex-1"
              >
                {monthNames.map((month) => (
                  <option key={month}>{month}</option>
                ))}
              </select>
              <span className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700 flex-1 text-center">
                {currentYear}
              </span>
            </div>
            <div className="flex justify-center gap-4">
              <ExportActions
                onExportPdf={handleExportPdf}
                onExportExcel={handleExportExcel}
              />
            </div>
            <div className="pt-4 border-t border-gray-100">
              <span className="font-semibold text-sm text-gray-700">
                Legend:
              </span>
              <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-sm text-gray-700 mt-2">
                <div className="flex items-center gap-x-2">
                  <span className="font-bold w-5 h-5 flex items-center justify-center rounded-md bg-green-500 text-white text-xs">
                    P
                  </span>
                  <span>Present</span>
                </div>
                <div className="flex items-center gap-x-2">
                  <span className="font-bold w-5 h-5 flex items-center justify-center rounded-md bg-red-500 text-white text-xs">
                    A
                  </span>
                  <span>Absent</span>
                </div>
                <div className="flex items-center gap-x-2">
                  <span className="font-bold w-5 h-5 flex items-center justify-center rounded-md bg-blue-500 text-white text-xs">
                    W
                  </span>
                  <span>Weekly Off</span>
                </div>
                <div className="flex items-center gap-x-2">
                  <span className="font-bold w-5 h-5 flex items-center justify-center rounded-md bg-yellow-500 text-white text-xs">
                    L
                  </span>
                  <span>Leave</span>
                </div>
                <div className="flex items-center gap-x-2">
                  <span className="font-bold w-5 h-5 flex items-center justify-center rounded-md bg-purple-500 text-white text-xs">
                    H
                  </span>
                  <span>Half Day</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* --- Item 3: Desktop Controls --- */}
          <motion.div
            variants={itemVariants}
            className="bg-white p-4 rounded-xl shadow-md hidden md:flex items-center justify-between gap-4"
          >
            <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-gray-700">
              <span className="font-semibold">Legend:</span>
              <div className="flex items-center gap-x-2">
                <span className="font-bold w-5 h-5 flex items-center justify-center rounded-md bg-green-500 text-white text-xs">
                  P
                </span>
                <span>Present</span>
              </div>
              <div className="flex items-center gap-x-2">
                <span className="font-bold w-5 h-5 flex items-center justify-center rounded-md bg-red-500 text-white text-xs">
                  A
                </span>
                <span>Absent</span>
              </div>
              <div className="flex items-center gap-x-2">
                <span className="font-bold w-5 h-5 flex items-center justify-center rounded-md bg-blue-500 text-white text-xs">
                  W
                </span>
                <span>Weekly Off</span>
              </div>
              <div className="flex items-center gap-x-2">
                <span className="font-bold w-5 h-5 flex items-center justify-center rounded-md bg-yellow-500 text-white text-xs">
                  L
                </span>
                <span>Leave</span>
              </div>
              <div className="flex items-center gap-x-2">
                <span className="font-bold w-5 h-5 flex items-center justify-center rounded-md bg-purple-500 text-white text-xs">
                  H
                </span>
                <span>Half Day</span>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="flex items-center gap-2">
                <select
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm w-auto"
                >
                  {monthNames.map((month) => (
                    <option key={month}>{month}</option>
                  ))}
                </select>
                <span className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700">
                  {currentYear}
                </span>
              </div>
              <ExportActions
                onExportPdf={handleExportPdf}
                onExportExcel={handleExportExcel}
              />
            </div>
          </motion.div>

          {/* --- Item 4: Attendance Grid --- */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto"
          >
            {error ? (
              <div className="text-center p-10 text-red-600">
                {(error as Error).message}
              </div>
            ) : totalEntries === 0 && !isLoading ? (
              <div className="text-center p-10 text-gray-500">
                {isSearchActive
                  ? 'No employees found.'
                  : `No attendance records found for ${selectedMonth} ${currentYear}.`}
              </div>
            ) : (
              <div style={{ minWidth: `${requiredMinWidth}px` }}>
                {/* Grid Header */}
                <div className="flex border-b-2 border-gray-200 sticky top-0 z-10">
                  <div
                    className="p-3 font-semibold text-left text-sm text-white bg-secondary"
                    style={{ width: employeeNameWidth, flexShrink: 0 }}
                  >
                    Employee Name
                  </div>
                  <div
                    className="flex-1 grid"
                    style={{
                      gridTemplateColumns: `repeat(${daysInMonth}, 1fr)`,
                      minWidth: `${minDayContainerWidth}px`,
                      width: `${minDayContainerWidth}px`,
                    }}
                  >
                    {calendarDays.map((dayData) => (
                      <button
                        key={dayData.day}
                        onClick={() => setBulkUpdateDay(dayData)}
                        className={`p-1 text-center font-semibold text-white ${dayData.isWeeklyOff ? 'bg-primary' : 'bg-secondary'
                          } border-l border-white/20 hover:opacity-90`}
                      >
                        <div className="text-xs">{dayData.weekday}</div>
                        <div className="text-sm">{dayData.day}</div>
                      </button>
                    ))}
                  </div>
                  <div
                    className="p-3 font-semibold text-sm text-center text-white bg-secondary border-l border-white/20"
                    style={{ width: workingDaysWidth, flexShrink: 0 }}
                  >
                    Working Days
                  </div>
                </div>
                {/* Grid Body */}
                {paginatedEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className="flex border-b border-gray-200 items-stretch"
                  >
                    <div
                      className="p-3 text-sm text-gray-800 font-medium truncate border-r border-gray-200 flex items-center"
                      style={{ width: employeeNameWidth, flexShrink: 0 }}
                    >
                      {employee.name}
                    </div>
                    <div
                      className="flex-1 grid"
                      style={{
                        gridTemplateColumns: `repeat(${daysInMonth}, 1fr)`,
                        minWidth: `${minDayContainerWidth}px`,
                      }}
                    >
                      {employee.attendanceString.split('').map((status, index) => (
                        <button
                          key={index}
                          onClick={() => handleCellClick(employee, index)}
                          className={`h-12 text-center text-sm ${calendarDays[index].isWeeklyOff
                              ? 'bg-gray-50'
                              : 'bg-white'
                            } border-l border-gray-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 z-0`}
                        >
                          <span
                            className={`font-bold ${statusColors[status] || 'text-gray-600'
                              }`}
                          >
                            {status}
                          </span>
                        </button>
                      ))}
                    </div>
                    <div
                      className="p-3 text-sm text-gray-700 font-medium text-center border-l border-gray-200 flex items-center justify-center"
                      style={{ width: workingDaysWidth, flexShrink: 0 }}
                    >
                      {getWorkingDays(employee.attendanceString)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* --- Item 5: Pagination --- */}
          {totalEntries > 0 && totalPages > 1 && (
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between mt-4 text-sm text-gray-600"
            >
              <p>
                Showing {showingStart} to {showingEnd} of {totalEntries} results
              </p>
              <div className="flex items-center gap-x-2">
                {currentPage > 1 && (
                  <Button
                    onClick={() => goToPage(currentPage - 1)}
                    variant="secondary"
                  >
                    Previous
                  </Button>
                )}
                {currentPage < totalPages && (
                  <Button
                    onClick={() => goToPage(currentPage + 1)}
                    variant="secondary"
                  >
                    Next
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </Sidebar>
  );
};

export default AttendancePage;