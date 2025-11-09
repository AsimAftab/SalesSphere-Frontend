import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query'; // 1. IMPORTED useQuery
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import type * as ExcelJS from 'exceljs';
import { fetchAttendanceData } from '../../api/attendanceService';
import type { Employee } from '../../api/attendanceService';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Button from '../../components/UI/Button/Button';
import ExportActions from '../../components/UI/ExportActions';
import AttendanceStatusModal from '../../components/modals/AttendanceStatusModal';
import BulkUpdateModal from '../../components/modals/AttendanceBulkUpdateModal';

// --- TYPE DEFINITIONS ---
interface FilteredEmployee extends Employee {
  attendanceString: string;
}

interface CalendarDay {
  day: number;
  weekday: string;
  isWeekend: boolean;
}

interface EditingCell {
  employeeId: number;
  employeeName: string;
  day: number;
  dayIndex: number;
}

// --- UTILITY FUNCTIONS (Unchanged) ---
const getDaysInMonth = (monthName: string, year: number): number => {
  const monthIndex = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].indexOf(monthName);
  return new Date(year, monthIndex + 1, 0).getDate();
};

const getWorkingDays = (attendanceString: string): number => {
    const presentDays = (attendanceString.match(/P/g) || []).length;
    const halfDays = (attendanceString.match(/H/g) || []).length;
    return presentDays + (halfDays * 0.5);
};

const statusColors: Record<string, string> = {
  P: 'text-green-500', W: 'text-blue-500', A: 'text-red-500',
  L: 'text-yellow-500', H: 'text-purple-500',
};

const applyDefaultAttendance = (calendarDays: CalendarDay[], attendanceString?: string): string => {
  let result = (attendanceString || '').split('');
  const daysInMonth = calendarDays.length;
  for (let i = 0; i < daysInMonth; i++) {
    const day = calendarDays[i];
    if (day.isWeekend && (!result[i] || result[i] === ' ')) {
      result[i] = 'W';
    }
    if (!result[i]) {
      result[i] = '-';
    }
  }
  return result.slice(0, daysInMonth).join('');
};

  
// --- MAIN COMPONENT ---
const AttendancePage: React.FC = () => {
    const monthNames = useMemo(() => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], []);
    const now = new Date();
    
    // 2. MODIFIED: This state is now for local mutations. Data is fetched by useQuery.
    const [employees, setEmployees] = useState<Employee[]>([]);
    
    // 3. MODIFIED: Removed year state, made it a constant.
    const [selectedMonth, setSelectedMonth] = useState(monthNames[now.getMonth()]);
    const currentYear = now.getFullYear().toString(); // Year is now fixed to current
    
    // 4. REMOVED: useState for isLoading and error
    
    // --- (Other state is unchanged) ---
    const [currentPage, setCurrentPage] = useState(1);
    const [exportingStatus, setExportingStatus] = useState<'pdf' | 'excel' | null>(null);
    const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
    const [bulkUpdateDay, setBulkUpdateDay] = useState<CalendarDay | null>(null);
    const entriesPerPage = 10;
    const [searchTerm, setSearchTerm] = useState('');

    // 5. REPLACED useEffect with useQuery
    const { 
      data: fetchedData, 
      isLoading, // useQuery provides this
      error      // useQuery provides this
    } = useQuery<Employee[], Error>({
        // Query key changes when month or year changes, triggering a refetch
        queryKey: ['attendance', selectedMonth, currentYear],
        queryFn: () => fetchAttendanceData(selectedMonth, parseInt(currentYear)),
    });

    // 6. ADDED: useEffect to sync query data to our local mutable state
    useEffect(() => {
        if (fetchedData) {
            setEmployees(fetchedData);
        }
    }, [fetchedData]);

    // 7. MODIFIED: useMemo dependencies updated to use currentYear
    const daysInMonth = useMemo(() => getDaysInMonth(selectedMonth, parseInt(currentYear)), [selectedMonth, currentYear]);
    
    const calendarDays = useMemo((): CalendarDay[] => {
        const monthIndex = monthNames.indexOf(selectedMonth);
        const dayOfWeekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return Array.from({ length: daysInMonth }, (_, i) => {
            const date = new Date(parseInt(currentYear), monthIndex, i + 1);
            const weekday = dayOfWeekNames[date.getDay()];
            return { day: i + 1, weekday, isWeekend: date.getDay() === 6 }; // 6 = Saturday
        });
    }, [daysInMonth, selectedMonth, currentYear, monthNames]);

    const filteredEmployees = useMemo((): FilteredEmployee[] => {
      // 8. MODIFIED: key updated to use currentYear
      const monthYearKey = `${selectedMonth}-${currentYear}`;
    
      return employees // This uses the local 'employees' state, so mutations are visible
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

    // 9. MODIFIED: Local mutation functions updated to use currentYear
    const handleStatusUpdate = (newStatus: string) => {
        if (!editingCell) return;
        setEmployees(prev => prev.map(emp => {
            if (emp.id === editingCell.employeeId) {
                const key = `${selectedMonth}-${currentYear}`;
                const attArr = applyDefaultAttendance(calendarDays, emp.attendance[key]).split('');
                attArr[editingCell.dayIndex] = newStatus;
                return { ...emp, attendance: { ...emp.attendance, [key]: attArr.join('') } };
            }
            return emp;
        }));
        setEditingCell(null);
    };
    
    const handleBulkUpdate = (newStatus: string) => {
        if (!bulkUpdateDay) return;
        const dayIndex = bulkUpdateDay.day - 1;
        setEmployees(prev => prev.map(emp => {
            const key = `${selectedMonth}-${currentYear}`;
            const attArr = applyDefaultAttendance(calendarDays, emp.attendance[key]).split('');
            attArr[dayIndex] = newStatus;
            return { ...emp, attendance: { ...emp.attendance, [key]: attArr.join('') } };
        }));
        setBulkUpdateDay(null);
    };

    const handleCellClick = (employee: FilteredEmployee, dayIndex: number) => {
        setEditingCell({ employeeId: employee.id, employeeName: employee.name, day: dayIndex + 1, dayIndex: dayIndex });
    };

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    // --- (Export functions are unchanged, lazy loading is correct) ---
    const handleExportPdf = async () => {
        setExportingStatus('pdf');
        try {
            const { pdf } = await import('@react-pdf/renderer');
            const { saveAs } = await import('file-saver');
            const AttendancePDF = (await import('./AttendancePDF')).default;

            const employeesForPdf = filteredEmployees.map(({ name, attendanceString }) => ({ name, attendanceString }));
            const doc = <AttendancePDF employees={employeesForPdf} days={calendarDays} month={selectedMonth} year={currentYear} />;
            const blob = await pdf(doc).toBlob();
            saveAs(blob, `Attendance_${selectedMonth}_${currentYear}.pdf`);
        } catch (error) {
            console.error("Failed to generate PDF", error);
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

            const dayHeader = ["S.No.", "Employee Name", ...calendarDays.map(d => d.day.toString()), "Working Days"];
            const weekdayHeader = ["", "", ...calendarDays.map(d => d.weekday), ""];
            const lastCol = dayHeader.length;

            const dayHeaderRow = worksheet.addRow(dayHeader); // Row 3
            const weekdayHeaderRow = worksheet.addRow(weekdayHeader); // Row 4
            
            const headerStyle: Partial<ExcelJS.Style> = {
                font: { bold: true, color: { argb: 'FFFFFFFF' } },
                fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF197ADC' } },
                alignment: { horizontal: 'center', vertical: 'middle' },
                border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
            };
            [dayHeaderRow, weekdayHeaderRow].forEach(row => {
                row.eachCell(cell => {
                    cell.style = headerStyle;
                });
            });

            worksheet.columns = [
                { width: 5 }, // S.No
                { width: 25 }, // Employee Name
                ...calendarDays.map(() => ({ width: 5 })), // Days
                { width: 15 } // Working Days
            ];

            filteredEmployees.forEach((emp, index) => {
                const rowData = [
                    index + 1, 
                    emp.name, 
                    ...emp.attendanceString.split(''), 
                    getWorkingDays(emp.attendanceString)
                ];
                const row = worksheet.addRow(rowData);
                
                row.eachCell((cell, colNumber) => {
                    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    
                    const isNameCol = colNumber === 2;
                    if (isNameCol) {
                        cell.alignment = { horizontal: 'left', vertical: 'middle' };
                    } else {
                        cell.alignment = { horizontal: 'center', vertical: 'middle' };
                    }
                });
            });

            worksheet.mergeCells(1, 1, 1, lastCol); 
            worksheet.mergeCells(3, 1, 4, 1);       
            worksheet.mergeCells(3, 2, 4, 2);       
            worksheet.mergeCells(3, lastCol, 4, lastCol); 

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, `Attendance_${selectedMonth}_${currentYear}.xlsx`);

        } catch (error) { 
            console.error("Failed to generate Excel", error);
        } finally { 
            setExportingStatus(null); 
        }
    };
    
    const employeeNameWidth = '200px';
    const workingDaysWidth = '110px';
    const minDayCellWidth = 35;
    const minDayContainerWidth = daysInMonth * minDayCellWidth;
    const requiredMinWidth = parseInt(employeeNameWidth) + parseInt(workingDaysWidth) + minDayContainerWidth;
    
    // 10. REMOVED: Dynamic Year List
    
    return (
        <Sidebar>
            
            {/* 11. MODIFIED: Using useQuery's isLoading state */}
            {isLoading ? (
                <div className="flex items-center justify-center w-full h-96">
                    <p className="text-gray-500">Loading attendance data...</p>
                </div>
            ) : (
                <>
                    {/* --- Page Header Section --- */}
                    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    {/* Left side: Titles */}
                    <div>
                        <h1 className="text-3xl font-bold text-black">Attendance for Employees</h1>
                        <h2 className="text-xl text-black">Total Attendance for a Month</h2>
                    </div>

                    {/* Right side: Search bar */}
                    <div className="relative w-full md:w-72">
                        <MagnifyingGlassIcon className="pointer-events-none absolute inset-y-0 left-3 h-full w-5 text-gray-500" />
                        <input
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by Employee Name"
                        className="block h-10 w-full border-transparent bg-gray-200 py-0 pl-10 pr-3 text-gray-900 placeholder:text-gray-500 focus:ring-0 sm:text-sm rounded-full"
                        />
                    </div>
                    </div>

                    <AttendanceStatusModal isOpen={!!editingCell} onClose={() => setEditingCell(null)} onSave={handleStatusUpdate} employeeName={editingCell?.employeeName || ''} day={editingCell?.day || 0} month={selectedMonth}/>
                    <BulkUpdateModal isOpen={!!bulkUpdateDay} onClose={() => setBulkUpdateDay(null)} onConfirm={handleBulkUpdate} day={bulkUpdateDay?.day || 0} weekday={bulkUpdateDay?.weekday || ''} month={selectedMonth}/>

                    <div className="w-full space-y-6">

                        {exportingStatus && (
                            <div className="w-full p-4 text-center bg-blue-100 text-blue-800 rounded-lg">
                                Generating {exportingStatus.toUpperCase()}... Please wait.
                            </div>
                        )}

                        {/* --- MODIFIED: This entire block is now responsive --- */}

                        {/* 1. Mobile Controls (Stacked) */}
                        <div className="bg-white p-4 rounded-xl shadow-md space-y-4 md:hidden">
                            
                            {/* Row 1: Filters (MODIFIED for side-by-side) */}
                            <div className="flex flex-row gap-4">
                                <select 
                                    value={selectedMonth} 
                                    onChange={(e) => { setSelectedMonth(e.target.value); setCurrentPage(1); }} 
                                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm flex-1"
                                >
                                    {monthNames.map(month => <option key={month}>{month}</option>)}
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

                            {/* Row 3: Legend (FIX: Grid layout) */}
                            <div className="pt-4 border-t border-gray-100">
                                <span className="font-semibold text-sm text-gray-700">Legend:</span>
                                <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-sm text-gray-700 mt-2">
                                    <div className="flex items-center gap-x-2"><span className="font-bold w-5 h-5 flex items-center justify-center rounded-md bg-green-500 text-white text-xs">P</span><span>Present</span></div>
                                    <div className="flex items-center gap-x-2"><span className="font-bold w-5 h-5 flex items-center justify-center rounded-md bg-red-500 text-white text-xs">A</span><span>Absent</span></div>
                                    <div className="flex items-center gap-x-2"><span className="font-bold w-5 h-5 flex items-center justify-center rounded-md bg-blue-500 text-white text-xs">W</span><span>Weekly Off</span></div>
                                    <div className="flex items-center gap-x-2"><span className="font-bold w-5 h-5 flex items-center justify-center rounded-md bg-yellow-500 text-white text-xs">L</span><span>Leave</span></div>
                                    <div className="flex items-center gap-x-2"><span className="font-bold w-5 h-5 flex items-center justify-center rounded-md bg-purple-500 text-white text-xs">H</span><span>Half Day</span></div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Desktop Controls (Single Bar - as in your image) */}
                        <div className="bg-white p-4 rounded-xl shadow-md hidden md:flex items-center justify-between gap-4">
                            
                            {/* Left Side: Legend */}
                            <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-gray-700">
                                <span className="font-semibold">Legend:</span>
                                <div className="flex items-center gap-x-2"><span className="font-bold w-5 h-5 flex items-center justify-center rounded-md bg-green-500 text-white text-xs">P</span><span>Present</span></div>
                                <div className="flex items-center gap-x-2"><span className="font-bold w-5 h-5 flex items-center justify-center rounded-md bg-red-500 text-white text-xs">A</span><span>Absent</span></div>
                                <div className="flex items-center gap-x-2"><span className="font-bold w-5 h-5 flex items-center justify-center rounded-md bg-blue-500 text-white text-xs">W</span><span>Weekly Off</span></div>
                                <div className="flex items-center gap-x-2"><span className="font-bold w-5 h-5 flex items-center justify-center rounded-md bg-yellow-500 text-white text-xs">L</span><span>Leave</span></div>
                                <div className="flex items-center gap-x-2"><span className="font-bold w-5 h-5 flex items-center justify-center rounded-md bg-purple-500 text-white text-xs">H</span><span>Half Day</span></div>
                            </div>
                            
                            {/* Right Side: Controls (Filters + Export) */}
                            <div className="flex items-center gap-4 flex-shrink-0">
                                <div className="flex items-center gap-2">
                                    <select value={selectedMonth} onChange={(e) => { setSelectedMonth(e.target.value); setCurrentPage(1); }} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm w-auto">
                                        {monthNames.map(month => <option key={month}>{month}</option>)}
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
                        </div>

                        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto">
                            {error ? ( <div className="text-center p-10 text-red-600">{(error as Error).message}</div>
                            ) : totalEntries === 0 ? ( 
                            <div className="text-center p-10 text-gray-500">
                                {isSearchActive
                                ? 'No employees found.'
                                : `No attendance records found for ${selectedMonth} ${currentYear}.`}
                            </div>
                            ) : (
                                <div style={{ minWidth: `${requiredMinWidth}px` }}>
                                    <div className="flex border-b-2 border-gray-200 sticky top-0 z-10">
                                        <div className="p-3 font-semibold text-left text-sm text-white bg-secondary" style={{ width: employeeNameWidth, flexShrink: 0 }}>Employee Name</div>
                                        <div className="flex-1 grid" style={{ gridTemplateColumns: `repeat(${daysInMonth}, 1fr)`, minWidth: `${minDayContainerWidth}px` }}>
                                            {calendarDays.map((dayData) => (
                                                <button key={dayData.day} onClick={() => setBulkUpdateDay(dayData)} className={`p-1 text-center font-semibold text-white ${dayData.isWeekend ? 'bg-primary' : 'bg-secondary'} border-l border-white/20 hover:opacity-90`}>
                                                    <div className="text-xs">{dayData.weekday}</div>
                                                    <div className="text-sm">{dayData.day}</div>
                                                </button>
                                            ))}
                                        </div>
                                        <div className="p-3 font-semibold text-sm text-center text-white bg-secondary border-l border-white/20" style={{ width: workingDaysWidth, flexShrink: 0 }}>Working Days</div>
                                    </div>
                                    {paginatedEmployees.map((employee) => (
                                        <div key={employee.id} className="flex border-b border-gray-200 items-stretch">
                                            <div className="p-3 text-sm text-gray-800 font-medium truncate border-r border-gray-200 flex items-center" style={{ width: employeeNameWidth, flexShrink: 0 }}>{employee.name}</div>
                                            <div className="flex-1 grid" style={{ gridTemplateColumns: `repeat(${daysInMonth}, 1fr)`, minWidth: `${minDayContainerWidth}px` }}>
                                                {employee.attendanceString.split('').map((status, index) => (
                                                    <button key={index} onClick={() => handleCellClick(employee, index)} className={`h-12 text-center text-sm ${calendarDays[index].isWeekend ? 'bg-gray-50' : 'bg-white'} border-l border-gray-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 z-0`}>
                                                        <span className={`font-bold ${statusColors[status] || 'text-gray-600'}`}>{status}</span>
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="p-3 text-sm text-gray-700 font-medium text-center border-l border-gray-200 flex items-center justify-center" style={{ width: workingDaysWidth, flexShrink: 0 }}>{getWorkingDays(employee.attendanceString)}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {totalEntries > 0 && totalPages > 1 && (
                             <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                                <p>Showing {showingStart} to {showingEnd} of {totalEntries} results</p>
                                <div className="flex items-center gap-x-2">
                                    {currentPage > 1 && (
                                        <Button onClick={() => goToPage(currentPage - 1)} variant="secondary">Previous</Button>
                                    )}
                                    {currentPage < totalPages && (
                                        <Button onClick={() => goToPage(currentPage + 1)} variant="secondary">Next</Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </Sidebar>
    );
};

export default AttendancePage;