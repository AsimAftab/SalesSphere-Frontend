// src/pages/Attendance/AttendancePage.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

// --- SERVICE & COMPONENT IMPORTS ---
import { fetchAttendanceData } from '../../api/attendanceService';
import type { Employee } from '../../api/attendanceService';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Button from '../../components/UI/Button/Button';
import ExportActions from '../../components/UI/ExportActions';
import AttendanceStatusModal from '../../components/modals/AttendanceStatusModal';
import BulkUpdateModal from '../../components/modals/AttendanceBulkUpdateModal';
import AttendancePDF from './AttendancePDF';

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

// FIX: Default 'W' only applies if the day is a weekend (Saturday)
const applyDefaultAttendance = (calendarDays: CalendarDay[], attendanceString?: string): string => {
  let result = (attendanceString || '').split('');
  const daysInMonth = calendarDays.length;
  for (let i = 0; i < daysInMonth; i++) {
    const day = calendarDays[i];
    if (day.isWeekend && (!result[i] || result[i] === ' ')) {
      result[i] = 'W';
    }
    if (!result[i]) {
      result[i] = 'A';
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
    
    // FIX: Updated isWeekend to only be true for Saturday
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
        return employees.map(employee => {
            const rawAttendance = employee.attendance?.[monthYearKey];
            const finalAttendanceString = applyDefaultAttendance(calendarDays, rawAttendance);
            return { ...employee, attendanceString: finalAttendanceString };
        });
    }, [employees, selectedMonth, selectedYear, calendarDays]);

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
    
    const handleExportExcel = () => {
        setExportingStatus('excel');
        setTimeout(() => {
            try {
                const titleRow = [`Attendance for ${selectedMonth} ${selectedYear}`];
                const dayHeader = ["S.No.", "Employee Name", ...calendarDays.map(d => d.day.toString()), "Working Days"];
                const weekdayHeader = ["", "", ...calendarDays.map(d => d.weekday), ""];
                const body = filteredEmployees.map((emp, index) => [
                    index + 1, emp.name, ...emp.attendanceString.split(''), getWorkingDays(emp.attendanceString)
                ]);
                const dataForSheet = [titleRow, [], dayHeader, weekdayHeader, ...body];
                const worksheet = XLSX.utils.aoa_to_sheet(dataForSheet);
                const merges = [
                    { s: { r: 0, c: 0 }, e: { r: 0, c: dayHeader.length - 1 } },
                    { s: { r: 2, c: 0 }, e: { r: 3, c: 0 } },
                    { s: { r: 2, c: 1 }, e: { r: 3, c: 1 } },
                    { s: { r: 2, c: dayHeader.length - 1 }, e: { r: 3, c: dayHeader.length - 1 } }
                ];
                worksheet['!merges'] = merges;
                worksheet['!cols'] = dayHeader.map((_, colIndex) => {
                    if (colIndex === 1) return { wch: 25 };
                    if (colIndex === dayHeader.length - 1) return { wch: 15 };
                    return { wch: 5 };
                });
                const range = XLSX.utils.decode_range(worksheet['!ref']!);
                for (let R = 2; R <= range.e.r; ++R) {
                    for (let C = 0; C <= range.e.c; ++C) {
                        const cellRef = XLSX.utils.encode_cell({ c: C, r: R });
                        if (!worksheet[cellRef]) continue;
                        worksheet[cellRef].s = {
                            alignment: { vertical: "center", horizontal: (C > 1 && C < dayHeader.length - 1) ? "center" : "left" },
                        };
                    }
                }
                worksheet['A1'].s = { font: { sz: 14, bold: true }, alignment: { horizontal: "center", vertical: "center" } };
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
                XLSX.writeFile(workbook, `Attendance_${selectedMonth}_${selectedYear}.xlsx`);
            } catch (error) { console.error("Failed to generate Excel", error);
            } finally { setExportingStatus(null); }
        }, 100);
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
                    <div className="mb-6">
                      <h1 className="text-3xl font-bold text-black">Attendance for Employees</h1>
                      <h1 className="text-xl  text-black">Total Attendance for a Month</h1>
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
                            <ExportActions onExportPdf={handleExportPdf} onExportExcel={handleExportExcel} />
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
                            ) : totalEntries === 0 ? ( <div className="text-center p-10 text-gray-500">No attendance records found for {selectedMonth} {selectedYear}.</div>
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