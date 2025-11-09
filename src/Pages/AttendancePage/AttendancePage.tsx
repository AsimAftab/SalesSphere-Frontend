import React, { useState, useMemo, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import * as ExcelJS from 'exceljs';
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

// --- UTILITY FUNCTIONS ---
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
    
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState(monthNames[now.getMonth()]);
    const [selectedYear, setSelectedYear] = useState(now.getFullYear().toString());
    const [currentPage, setCurrentPage] = useState(1);
    const [exportingStatus, setExportingStatus] = useState<'pdf' | 'excel' | null>(null);
    const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
    const [bulkUpdateDay, setBulkUpdateDay] = useState<CalendarDay | null>(null);
    const entriesPerPage = 10;
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchAttendanceData(selectedMonth, parseInt(selectedYear));
                setEmployees(data);
            } catch (err) {
                setError('Failed to fetch attendance data. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [selectedMonth, selectedYear]);

    const daysInMonth = useMemo(() => getDaysInMonth(selectedMonth, parseInt(selectedYear)), [selectedMonth, selectedYear]);
    
    const calendarDays = useMemo((): CalendarDay[] => {
        const monthIndex = monthNames.indexOf(selectedMonth);
        const dayOfWeekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return Array.from({ length: daysInMonth }, (_, i) => {
            const date = new Date(parseInt(selectedYear), monthIndex, i + 1);
            const weekday = dayOfWeekNames[date.getDay()];
            return { day: i + 1, weekday, isWeekend: date.getDay() === 6 }; // 6 = Saturday
        });
    }, [daysInMonth, selectedMonth, selectedYear, monthNames]);

    const filteredEmployees = useMemo((): FilteredEmployee[] => {
    const monthYearKey = `${selectedMonth}-${selectedYear}`;
    
    return employees
    .map(employee => {
      const rawAttendance = employee.attendance?.[monthYearKey];
      const finalAttendanceString = applyDefaultAttendance(calendarDays, rawAttendance);
      return { ...employee, attendanceString: finalAttendanceString };
    })
    .filter(emp =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    }, [employees, selectedMonth, selectedYear, calendarDays, searchTerm]);
    
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

    const handleStatusUpdate = (newStatus: string) => {
        if (!editingCell) return;
        setEmployees(prev => prev.map(emp => {
            if (emp.id === editingCell.employeeId) {
                const key = `${selectedMonth}-${selectedYear}`;
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
            const key = `${selectedMonth}-${selectedYear}`;
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

    const handleExportPdf = async () => {
        setExportingStatus('pdf');
        try {
            // --- LAZY LOADING PDF ---
            const { pdf } = await import('@react-pdf/renderer');
            const { saveAs } = await import('file-saver');
            const AttendancePDF = (await import('./AttendancePDF')).default;
            // --- END LAZY LOADING ---

            const employeesForPdf = filteredEmployees.map(({ name, attendanceString }) => ({ name, attendanceString }));
            const doc = <AttendancePDF employees={employeesForPdf} days={calendarDays} month={selectedMonth} year={selectedYear} />;
            const blob = await pdf(doc).toBlob();
            saveAs(blob, `Attendance_${selectedMonth}_${selectedYear}.pdf`);
        } catch (error) {
            console.error("Failed to generate PDF", error);
        } finally {
            setExportingStatus(null);
        }
    };
    
    // --- MODIFIED: Swapped XLSX for ExcelJS and lazy-loaded ---
    const handleExportExcel = async () => {
        setExportingStatus('excel');
        try {
            // --- LAZY LOADING EXCELJS ---
            const ExcelJS = await import('exceljs');
            const { saveAs } = await import('file-saver');
            // --- END LAZY LOADING ---

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Attendance');

            // 1. Add Title Row
            const titleCell = worksheet.getCell('A1');
            titleCell.value = `Attendance for ${selectedMonth} ${selectedYear}`;
            titleCell.font = { size: 14, bold: true };
            titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

            // 2. Add empty row
            worksheet.addRow([]); // Row 2

            // 3. Prepare Header Data
            const dayHeader = ["S.No.", "Employee Name", ...calendarDays.map(d => d.day.toString()), "Working Days"];
            const weekdayHeader = ["", "", ...calendarDays.map(d => d.weekday), ""];
            const lastCol = dayHeader.length;

            // 4. Add Header Rows
            const dayHeaderRow = worksheet.addRow(dayHeader); // Row 3
            const weekdayHeaderRow = worksheet.addRow(weekdayHeader); // Row 4
            
            // 5. Style Header Rows
            const headerStyle: Partial<ExcelJS.Style> = {
                font: { bold: true, color: { argb: 'FFFFFFFF' } },
                fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF197ADC' } }, // Using your blue color
                alignment: { horizontal: 'center', vertical: 'middle' },
                border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
            };
            [dayHeaderRow, weekdayHeaderRow].forEach(row => {
                row.eachCell(cell => {
                    cell.style = headerStyle;
                });
            });

            // 6. Set Column Widths
            worksheet.columns = [
                { width: 5 }, // S.No
                { width: 25 }, // Employee Name
                ...calendarDays.map(() => ({ width: 5 })), // Days
                { width: 15 } // Working Days
            ];

            // 7. Add Body Rows and Style them
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
                    // Center everything except the name
                    if (isNameCol) {
                        cell.alignment = { horizontal: 'left', vertical: 'middle' };
                    } else {
                        cell.alignment = { horizontal: 'center', vertical: 'middle' };
                    }
                });
            });

            // 8. Apply Merges (ExcelJS is 1-based)
            worksheet.mergeCells(1, 1, 1, lastCol); // Title: Row 1, Col 1 to Row 1, Last Col
            worksheet.mergeCells(3, 1, 4, 1);       // S.No: Row 3, Col 1 to Row 4, Col 1
            worksheet.mergeCells(3, 2, 4, 2);       // Name: Row 3, Col 2 to Row 4, Col 2
            worksheet.mergeCells(3, lastCol, 4, lastCol); // Working Days: Row 3, Last Col to Row 4, Last Col

            // 9. Save file
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, `Attendance_${selectedMonth}_${selectedYear}.xlsx`);

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

    return (
        <Sidebar>
            
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
                        <div className="bg-white p-4 rounded-xl shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <select value={selectedMonth} onChange={(e) => { setSelectedMonth(e.target.value); setCurrentPage(1); }} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm w-full sm:w-auto">
                                    {monthNames.map(month => <option key={month}>{month}</option>)}
                                </select>
                                <select value={selectedYear} onChange={(e) => { setSelectedYear(e.target.value); setCurrentPage(1); }} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm w-full sm:w-auto">
                                    {[2025, 2024, 2023].map(year => <option key={year}>{year}</option>)}
                                </select>
                            </div>

                            <ExportActions 
                              onExportPdf={handleExportPdf} 
                              onExportExcel={handleExportExcel} 
                            />
                        </div>

                        {exportingStatus && (
                            <div className="w-full p-4 text-center bg-blue-100 text-blue-800 rounded-lg">
                                Generating {exportingStatus.toUpperCase()}... Please wait.
                            </div>
                        )}

                        <div className="bg-white p-3 rounded-xl shadow-md flex items-center flex-wrap gap-x-6 gap-y-2 text-sm text-gray-700">
                            <span className="font-semibold">Legend:</span>
                            <div className="flex items-center gap-x-2"><span className="font-bold w-6 h-6 flex items-center justify-center rounded-md bg-green-500 text-white">P</span><span>Present</span></div>
                            <div className="flex items-center gap-x-2"><span className="font-bold w-6 h-6 flex items-center justify-center rounded-md bg-red-500 text-white">A</span><span>Absent</span></div>
                            <div className="flex items-center gap-x-2"><span className="font-bold w-6 h-6 flex items-center justify-center rounded-md bg-blue-500 text-white">W</span><span>Weekly Off</span></div>
                            <div className="flex items-center gap-x-2"><span className="font-bold w-6 h-6 flex items-center justify-center rounded-md bg-yellow-500 text-white">L</span><span>Leave</span></div>
                            <div className="flex items-center gap-x-2"><span className="font-bold w-6 h-6 flex items-center justify-center rounded-md bg-purple-500 text-white">H</span><span>Half Day</span></div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto">
                            {error ? ( <div className="text-center p-10 text-red-600">{error}</div>
                            ) : totalEntries === 0 ? ( 
                            <div className="text-center p-10 text-gray-500">
                                {isSearchActive
                                ? 'No employees found.'
                                : `No attendance records found for ${selectedMonth} ${selectedYear}.`}
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