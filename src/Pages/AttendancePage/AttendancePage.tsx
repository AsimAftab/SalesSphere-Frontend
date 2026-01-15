import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import { useAttendanceData } from './hooks/useAttendanceData';
import { useAttendanceFilters } from './hooks/useAttendanceFilters';
import { useAttendanceActions } from './hooks/useAttendanceActions';
import { useAuth } from '../../api/authService';
import { toast } from 'react-hot-toast';
import AttendanceSkeleton from './components/AttendanceSkeleton';
import AttendanceHeader from './components/AttendanceHeader';
import AttendanceControls from './components/AttendanceControls';
import AttendanceTable from './components/AttendanceTable';
import AttendanceStatusModal from '../../components/modals/Attendance/AttendanceStatusModal';
import AttendanceBulkUpdateModal from '../../components/modals/Attendance/AttendanceBulkUpdateModal'; // Use existing modal
import Pagination from '../../components/UI/Page/Pagination';
import type { FilteredEmployee, EditingCell } from './types';
import { getFullDateString } from './utils/attendanceHelpers';
import { ExportAttendanceService } from './utils/ExportAttendanceService';

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

const AttendancePage: React.FC = () => {
  // 1. Initial State for Hooks
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);

  // New State for Bulk Update (Use existing modal state)
  const [bulkUpdateInfo, setBulkUpdateInfo] = useState<{
    dateString: string;
    day: number;
    weekday: string;
    isWeeklyOff: boolean;
  } | null>(null);

  // --- ORCHESTRATION ---
  const now = new Date();
  // A. Month/Year State (Source of Truth)
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [currentYear] = useState(now.getFullYear());

  // B. Fetch Data
  const { data: fetchedData, isLoading, error } = useAttendanceData(selectedMonth, currentYear);

  // C. Actions (Mutations)
  const { singleUpdateMutation, bulkUpdateMutation } = useAttendanceActions(selectedMonth, currentYear);

  // D. Filters & Pagination (Logic)
  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    calendarDays,
    paginatedEmployees,
    paginationInfo
  } = useAttendanceFilters({
    employees: fetchedData?.employees || [],
    weeklyOffDay: fetchedData?.weeklyOffDay || 'Saturday',
    selectedMonth,
    currentYear
  });

  // --- Authorization ---
  const { hasPermission } = useAuth();
  const canExportPdf = hasPermission('attendance', 'exportPdf');
  // const canExportExcel = hasPermission('attendance', 'exportExcel');
  const canUpdateAttendance = hasPermission('attendance', 'updateAttendance');
  const canMarkLeave = hasPermission('attendance', 'markLeave');

  // --- HANDLERS ---
  const handleCellClick = (employee: FilteredEmployee, dayIndex: number) => {
    if (!canUpdateAttendance) {
      toast.error('You do not have permission to update attendance.');
      return;
    }

    const day = dayIndex + 1;
    setEditingCell({
      employeeId: employee.id,
      employeeName: employee.name,
      day: day,
      dateString: getFullDateString(day, selectedMonth, currentYear),
    });
  };

  const handleDayClick = (dayIndex: number) => {
    // Permission check for bulk update / mark leave
    if (!canMarkLeave) {
      toast.error('You do not have permission to perform bulk updates.');
      return;
    }

    const day = dayIndex + 1;
    const calendarDay = calendarDays[dayIndex];
    if (calendarDay) {
      setBulkUpdateInfo({
        day,
        dateString: getFullDateString(day, selectedMonth, currentYear),
        weekday: calendarDay.weekday,
        isWeeklyOff: calendarDay.isWeeklyOff
      });
    }
  };

  const handleStatusUpdate = (newStatus: string, note: string) => {
    if (!editingCell) return;

    singleUpdateMutation.mutate({
      employeeId: editingCell.employeeId,
      date: editingCell.dateString,
      status: newStatus,
      notes: note,
    }, {
      onSettled: () => setEditingCell(null)
    });
  };

  const handleBulkUpdate = (_status: string, note: string) => {
    if (!bulkUpdateInfo) return;

    bulkUpdateMutation.mutate({
      date: bulkUpdateInfo.dateString,
      occasionName: note,
    }, {
      onSettled: () => setBulkUpdateInfo(null)
    });
  };



  // ...

  const handleExportPdf = async () => {
    await ExportAttendanceService.exportToPdf(paginatedEmployees, selectedMonth, currentYear, calendarDays);
  };

  // const handleExportExcel = async () => {
  //   await ExportAttendanceService.exportToExcel(
  //     paginatedEmployees,
  //     selectedMonth,
  //     currentYear,
  //     calendarDays
  //   );
  // };

  // --- RENDER ---
  if (isLoading && !fetchedData) {
    return (
      <Sidebar>
        <AttendanceSkeleton />
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      {(singleUpdateMutation.isPending || bulkUpdateMutation.isPending) && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-40">
          <p className="text-gray-600 text-lg">Updating...</p>
        </div>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <AttendanceHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onExportPdf={canExportPdf ? handleExportPdf : undefined}
        //onExportExcel={handleExportExcel}
        />

        <AttendanceControls
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          currentYear={currentYear}
        />

        <AttendanceTable
          days={calendarDays}
          employees={paginatedEmployees}
          isLoading={isLoading}
          error={error}
          isSearchActive={searchTerm.length > 0}
          selectedMonth={selectedMonth}
          currentYear={currentYear}
          onCellClick={handleCellClick}
          onDayClick={handleDayClick}
        />

        <Pagination
          currentPage={currentPage}
          totalItems={paginationInfo.totalEntries}
          itemsPerPage={10}
          onPageChange={setCurrentPage}
        />
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
        organizationWeeklyOffDay={fetchedData?.weeklyOffDay || 'Saturday'}
        isWeeklyOffDay={editingCell ? calendarDays[editingCell.day - 1]?.isWeeklyOff : false}
      />

      <AttendanceBulkUpdateModal
        isOpen={!!bulkUpdateInfo}
        onClose={() => setBulkUpdateInfo(null)}
        onConfirm={handleBulkUpdate}
        day={bulkUpdateInfo?.day || 0}
        weekday={bulkUpdateInfo?.weekday || ''}
        month={selectedMonth}
        isWeeklyOffDay={bulkUpdateInfo?.isWeeklyOff || false}
      />
    </Sidebar>
  );
};

export default AttendancePage;