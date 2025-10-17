import React, { useState, useMemo } from 'react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
//import Header from '../../components/layout/Header/Header';
import Button from '../../components/UI/Button/Button';
import ExportActions from '../../components/UI/ExportActions';

// --- IMPORTS FOR EXPORT ---
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import AttendancePDF from './AttendancePDF'; // Import the new PDF blueprint

// --- TYPE DEFINITIONS (UNCHANGED) ---
interface AttendanceRecord {
  [key: string]: string | undefined;
}

interface Employee {
  name: string;
  attendance: AttendanceRecord;
}

interface FilteredEmployee {
  name: string;
  attendance: AttendanceRecord;
  attendanceString: string;
}

// --- Utility function to get days in month (UNCHANGED) ---
const getDaysInMonth = (monthName: string, year: number): number => {
  const monthIndex = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].indexOf(monthName);
  return new Date(year, monthIndex + 1, 0).getDate();
};

// --- MOCK DATA (UNCHANGED) ---
const mockEmployees: Employee[] = [
    { name: 'Leslie Alexander', attendance: { 'October-2025': 'PWAWWPWPPLWPPPWAWWPPPWWPWAAWPHW', 'June-2025': 'PWAWWPWPPLWPPPWAWWPPPWWPWAAWPP', 'May-2025': 'PAAAPPWPPPLPPPPWWAAAWLPPWWPP' }},
    { name: 'Helen Henderson', attendance: { 'October-2025': 'PAWAWAPPPPWPPWWWWLPPPPAWPPPWPPP', 'June-2025': 'PAWAWAPPPPWPPWWWWLPPPPAWPPPWPP', 'May-2025': 'PWPWAPWWPPPAPWPPPLPAWPPPPPAWPP' }},
    { name: 'Marcus Johnson', attendance: { 'October-2025': 'WWAPPPPAPWPPPWLPPPPWWWWAAWPWPPP', 'June-2025': 'WWAPPPPAPWPPPWLPPPPWWWWAAWPWPP', 'May-2025': 'PLPWPWAWAPPPWWPPPAPPAPAWPLPWPP' }},
    { name: 'Marcos Junior', attendance: { 'October-2025': 'PWAWAAPAWPPPAPAPWWPPWLLWAWPWPPP', 'June-2025': 'PWAWAAPAWPPPAPAPWWPPWLLWAWPWPP', 'May-2025': 'PAWAWAPPPPWPPWWWWLPPPPAWPPPWPP' }},
    { name: 'Benjamin Davis', attendance: { 'October-2025': 'PLPWPWAWAPPPWWPPPAPPAPAWPLPWPPP', 'June-2025': 'PLPWPWAWAPPPWWPPPAPPAPAWPLPWPP', 'May-2025': 'WWAPPPPAPWPPPWLPPPPWWWWAAWPWPP' }},
    { name: 'Hannah Paelgrgggrg', attendance: { 'October-2025': 'WAPWAPPPPPPLPWAPWPPPPWAWPWPWPPP', 'June-2025': 'WAPWAPPPPPPLPWAPWPPPPWAWPWPWPP' }},
    { name: 'George Albert', attendance: { 'October-2025': 'APWPPPWWPPPPWPLPPALWPPWPLPPWPWW' , 'June-2025': 'APWPPPWWPPPPWPLPPALWPPWPLPPWPP' } },
    { name: 'Kensh Wilson', attendance: { 'October-2025': 'PWPWAPWWPPPAPWPPPLPAWPPPPPAWPWW' , 'June-2025': 'PWPWAPWWPPPAPWPPPLPAWPPPPPAWPP' } },
    { name: 'James Martinez', attendance: { 'October-2025': 'PPWWPPPPPPPWPPPAPLPPPPWPPAPWPWP' , 'June-2025': 'PPWWPPPPPPPWPPPAPLPPPPWPPAPWPP' } },
    { name: 'Marcos Junior', attendance: { 'October-2025': 'PWAWAAPAWPPPAPAPWWPPWLLWAWPWPPP', 'June-2025': 'PWAWAAPAWPPPAPAPWWPPWLLWAWPWPP', 'May-2025': 'PAWAWAPPPPWPPWWWWLPPPPAWPPPWPP' }},
    { name: 'Marcus Johnson', attendance: { 'October-2025': 'WWAPPPPAPWPPPWLPPPPWWWWAAWPWPPP', 'June-2025': 'WWAPPPPAPWPPPWLPPPPWWWWAAWPWPP', 'May-2025': 'PLPWPWAWAPPPWWPPPAPPAPAWPLPWPP' }},
    { name: 'Marcos Junior', attendance: { 'October-2025': 'PWAWAAPAWPPPAPAPWWPPWLLWAWPWPPP', 'June-2025': 'PWAWAAPAWPPPAPAPWWPPWLLWAWPWPP', 'May-2025': 'PAWAWAPPPPWPPWWWWLPPPPAWPPPWPP' }},
    { name: 'Benjamin Davis', attendance: { 'October-2025': 'PLPWPWAWAPPPWWPPPAPPAPAWPLPWPPP', 'June-2025': 'PLPWPWAWAPPPWWPPPAPPAPAWPLPWPP', 'May-2025': 'WWAPPPPAPWPPPWLPPPPWWWWAAWPWPP' }},
    { name: 'Hannah Paelgrgggrg', attendance: { 'October-2025': 'WAPWAPPPPPPLPWAPWPPPPWAWPWPWPPP', 'June-2025': 'WAPWAPPPPPPLPWAPWPPPPWAWPWPWPP' }},
    { name: 'George Albert', attendance: { 'October-2025': 'APWPPPWWPPPPWPLPPALWPPWPLPPWPWW' , 'June-2025': 'APWPPPWWPPPPWPLPPALWPPWPLPPWPP' } },
    { name: 'Kensh Wilson', attendance: { 'October-2025': 'PWPWAPWWPPPAPWPPPLPAWPPPPPAWPWW' , 'June-2025': 'PWPWAPWWPPPAPWPPPLPAWPPPPPAWPP' } },
    { name: 'James Martinez', attendance: { 'October-2025': 'PPWWPPPPPPPWPPPAPLPPPPWPPAPWPWP' , 'June-2025': 'PPWWPPPPPPPWPPPAPLPPPPWPPAPWPP' } },
    { name: 'Marcos Junior', attendance: { 'October-2025': 'PWAWAAPAWPPPAPAPWWPPWLLWAWPWPPP', 'June-2025': 'PWAWAAPAWPPPAPAPWWPPWLLWAWPWPP', 'May-2025': 'PAWAWAPPPPWPPWWWWLPPPPAWPPPWPP' }},
    { name: 'Benjamin Davis', attendance: { 'October-2025': 'PLPWPWAWAPPPWWPPPAPPAPAWPLPWPPP', 'June-2025': 'PLPWPWAWAPPPWWPPPAPPAPAWPLPWPP', 'May-2025': 'WWAPPPPAPWPPPWLPPPPWWWWAAWPWPP' }},
    { name: 'Olivia Baker', attendance: { 'October-2025': 'PWWPPPPPPPWPPPAPLPPPPWPPAPWPPPP' , 'June-2025': 'PWWPPPPPPPWPPPAPLPPPPWPPAPWPP' } }
];

const statusColors: Record<string, string> = {
  P: 'text-green-500',
  W: 'text-blue-500',
  A: 'text-red-500',
  L: 'text-yellow-500',
  H: 'text-purple-500',
};

const applyDefaultAttendance = (attendanceString: string, mockDays: { weekday: string }[]): string => {
  let result = attendanceString.split('');
  const daysInMonth = mockDays.length;
  for (let i = 0; i < daysInMonth; i++) {
    const day = mockDays[i];
    if (day.weekday === 'Sat' && (!result[i] || result[i] === ' ')) {
      result[i] = 'W';
    }
    if (!result[i]) {
      result[i] = 'A';
    }
  }
  return result.join('');
};

const getWorkingDays = (attendanceString: string): number => {
  return (attendanceString.match(/[PLH]/g) || []).length;
};

// --- Main Component ---
const AttendancePage: React.FC = () => {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const now = new Date();
  const currentMonthName = monthNames[now.getMonth()];
  const currentYear = now.getFullYear().toString();

  const [selectedMonth, setSelectedMonth] = useState(currentMonthName);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [currentPage, setCurrentPage] = useState(1);
  const [exportingStatus, setExportingStatus] = useState<'pdf' | 'excel' | null>(null);
  const entriesPerPage = 10;

  const daysInMonth = useMemo(() => getDaysInMonth(selectedMonth, parseInt(selectedYear)), [selectedMonth, selectedYear]);

  const mockDays = useMemo(() => {
    const monthIndex = monthNames.indexOf(selectedMonth);
    const dayOfWeekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(parseInt(selectedYear), monthIndex, i + 1);
      const weekday = dayOfWeekNames[date.getDay()];
      return { day: i + 1, weekday, isWeekend: date.getDay() === 6 }; // Assuming Saturday is the weekend
    });
  }, [daysInMonth, selectedMonth, selectedYear, monthNames]);

  const filteredEmployees = useMemo(() => {
    const monthYearKey = `${selectedMonth}-${selectedYear}`;
    return mockEmployees.map(employee => {
      const rawAttendance = employee.attendance[monthYearKey] || '';
      const finalAttendanceString = applyDefaultAttendance(rawAttendance, mockDays);
      return { ...employee, attendanceString: finalAttendanceString };
    }) as FilteredEmployee[];
  }, [selectedMonth, selectedYear, mockDays]);

  // --- PDF EXPORT LOGIC ---
  const handleExportPdf = async () => {
    setExportingStatus('pdf');
    try {
      const doc = <AttendancePDF employees={filteredEmployees} days={mockDays} month={selectedMonth} year={selectedYear} />;
      const pdfPromise = pdf(doc).toBlob();
      const timerPromise = new Promise(resolve => setTimeout(resolve, 1000));
      const [blob] = await Promise.all([pdfPromise, timerPromise]);
      saveAs(blob, `Attendance_${selectedMonth}_${selectedYear}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF", error);
    } finally {
      setExportingStatus(null);
    }
  };

  // --- EXCEL EXPORT LOGIC ---
  const handleExportExcel = () => {
        setExportingStatus('excel');
        setTimeout(() => {
            try {
                // --- 1. PREPARE DATA ---
                const titleRow = [`Attendance for ${selectedMonth} ${selectedYear}`];
                const legendRow = ["Legend: P=Present, A=Absent, W=Weekly Off, L=Leave, H=Half Day"];
                const dayHeader = ["S.No.", "Employee Name", ...mockDays.map(d => d.day.toString()), "Working Days"];
                const weekdayHeader = ["", "", ...mockDays.map(d => d.weekday), ""];
                const body = filteredEmployees.map((emp, index) => [index + 1, emp.name, ...emp.attendanceString.split(''), getWorkingDays(emp.attendanceString)]);
                
                // --- 2. CREATE WORKSHEET ---
                const dataForSheet = [titleRow, legendRow, [], dayHeader, weekdayHeader, ...body];
                const worksheet = XLSX.utils.aoa_to_sheet(dataForSheet);

                // --- 3. MERGE CELLS ---
                if (!worksheet['!merges']) worksheet['!merges'] = [];
                worksheet['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: dayHeader.length - 1 } });
                worksheet['!merges'].push({ s: { r: 1, c: 0 }, e: { r: 1, c: dayHeader.length - 1 } });
                worksheet['!merges'].push({ s: { r: 3, c: 0 }, e: { r: 4, c: 0 } });
                worksheet['!merges'].push({ s: { r: 3, c: 1 }, e: { r: 4, c: 1 } });
                worksheet['!merges'].push({ s: { r: 3, c: dayHeader.length - 1 }, e: { r: 4, c: dayHeader.length - 1 } });

                // --- 4. SET COLUMN WIDTHS ---
                const tableDataForWidth = [dayHeader, weekdayHeader, ...body];
                const columnWidths = dayHeader.map((_, colIndex) => {
                    const maxLength = Math.max(...tableDataForWidth.map(row => String(row[colIndex] || "").length));
                    if (colIndex === 0) return { wch: 5 }; // S.No.
                    if (colIndex === 1) return { wch: Math.max(maxLength, 20) }; // Employee Name
                    if (colIndex === dayHeader.length - 1) return { wch: Math.max(maxLength, 15) }; // Working Days
                    return { wch: 5 }; // Day columns
                });
                worksheet['!cols'] = columnWidths;

                // --- 5. APPLY ALIGNMENT STYLES (SIMPLIFIED) ---
                const range = XLSX.utils.decode_range(worksheet['!ref']!);
                for (let R = 3; R <= range.e.r; ++R) { // Start from the table header
                    for (let C = 0; C <= range.e.c; ++C) {
                        const cellRef = XLSX.utils.encode_cell({ c: C, r: R });
                        if (!worksheet[cellRef]) continue;
                        if (!worksheet[cellRef].s) worksheet[cellRef].s = {};
                        
                        // FIX: Left align S.No (0), Employee Name (1), and Working Days (last). Center everything else.
                        const isLeftAligned = C === 0 || C === 1 || C === dayHeader.length - 1;
                        worksheet[cellRef].s.alignment = { 
                            horizontal: isLeftAligned ? "left" : "center", 
                            vertical: "center" 
                        };
                    }
                }
                // --- 6. STYLE TITLE AND LEGEND ---
                worksheet['A1'].s = { font: { bold: true, sz: 16 }, alignment: { horizontal: "center" } };
                worksheet['A2'].s = { font: { italic: true }, alignment: { horizontal: "center" } };
                // --- 7. CREATE AND DOWNLOAD FILE ---
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
                XLSX.writeFile(workbook, `Attendance_${selectedMonth}_${selectedYear}.xlsx`);

            } catch (error) {
                console.error("Failed to generate Excel", error);
            } finally {
                setExportingStatus(null);
            }
        }, 100);
    };


  const totalEntries = filteredEmployees.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const paginatedEmployees = useMemo(() => filteredEmployees.slice(startIndex, endIndex), [startIndex, endIndex, filteredEmployees]);

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };

  const employeeNameWidth = useMemo(() => {
    const longestNameLength = Math.max('Employee Name'.length, ...paginatedEmployees.map(e => e.name.length));
    return `${Math.min(250, Math.max(120, longestNameLength * 7 + 32))}px`;
  }, [paginatedEmployees]);

  const workingDaysWidth = '90px';
  const minDayCellWidth = 30;
  const minDayContainerWidth = daysInMonth * minDayCellWidth;
  const requiredMinWidth = parseInt(employeeNameWidth) + parseInt(workingDaysWidth) + minDayContainerWidth;

  const renderAttendanceRow = (employee: FilteredEmployee) => {
    const finalAttendanceChars = employee.attendanceString.slice(0, daysInMonth).split('');
    const gridStyle = { gridTemplateColumns: `repeat(${daysInMonth}, 1fr)`, minWidth: `${minDayContainerWidth}px` };
    return (
      <div className="flex-1 grid" style={gridStyle}>
        {finalAttendanceChars.map((status, index) => {
          const dayData = mockDays[index];
          const cellStatus = status as keyof typeof statusColors;
          const bg = dayData.isWeekend ? 'bg-gray-100' : 'bg-white'; 
          const border = index < daysInMonth - 1 ? 'border-r border-gray-200' : '';
          return (
            <div key={index} className={`h-12 text-center text-sm ${bg} ${border} flex items-center justify-center`} title={`Day ${dayData.day}, ${dayData.weekday}`}>
              <span className={`font-bold ${statusColors[cellStatus] || 'text-gray-600'}`}>{cellStatus}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const showingStart = totalEntries > 0 ? startIndex + 1 : 0;
  const showingEnd = Math.min(endIndex, totalEntries);
  
  return (
    <Sidebar> 
          <div className="w-full space-y-6">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-800">Employee Attendance</h1>
              <p className="text-gray-500">Track and manage employee attendance.</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <select value={selectedMonth} onChange={(e) => { setSelectedMonth(e.target.value); setCurrentPage(1); }} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm w-full">
                  {monthNames.map(month => <option key={month}>{month}</option>)}
                </select>
                <select value={selectedYear} onChange={(e) => { setSelectedYear(e.target.value); setCurrentPage(1); }} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm w-full">
                  {[2025, 2024, 2023].map(year => <option key={year}>{year}</option>)}
                </select>
              </div>
              <ExportActions onExportPdf={handleExportPdf} onExportExcel={handleExportExcel} />
            </div>

            {/* LOADING INDICATOR */}
            {exportingStatus && (
                <div className="w-full p-4 text-center bg-blue-100 text-blue-800 rounded-lg">
                    {exportingStatus === 'pdf' ? 'Generating PDF... Please wait.' : 'Generating EXCEL... Please wait.'}
                </div>
            )}

            <div className="flex items-start flex-wrap gap-x-6 gap-y-3 text-sm text-gray-700 bg-white p-3 rounded-xl shadow-md">
                <span className="font-medium flex-shrink-0 mt-1">Legend:</span>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 lg:flex lg:flex-wrap lg:gap-x-6 lg:gap-y-3">
                    <div className="flex items-center space-x-2"><span className={`font-bold border border-green-500 bg-green-50 px-2 py-0.5 rounded ${statusColors.P}`}>P</span><span>Present</span></div>
                    <div className="flex items-center space-x-2"><span className={`font-bold border border-red-500 bg-red-50 px-2 py-0.5 rounded ${statusColors.A}`}>A</span><span>Absent</span></div>
                    <div className="flex items-center space-x-2"><span className={`font-bold border border-blue-500 bg-blue-50 px-2 py-0.5 rounded ${statusColors.W}`}>W</span><span>Weekly Off</span></div>
                    <div className="flex items-center space-x-2"><span className={`font-bold border border-yellow-500 bg-yellow-50 px-2 py-0.5 rounded ${statusColors.L}`}>L</span><span>Leave</span></div>
                    <div className="flex items-center space-x-2"><span className={`font-bold border border-purple-500 bg-purple-50 px-2 py-0.5 rounded ${statusColors.H}`}>H</span><span>Half Day</span></div>
                </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto">
              <div style={{ minWidth: `${requiredMinWidth}px` }}>
                <div className="flex border-b-2 border-gray-200 sticky top-0 z-10">
                  <div className="p-3 font-semibold text-left text-sm text-white bg-primary border-r-2 border-gray-200" style={{ width: employeeNameWidth, flexShrink: 0 }}>
                    Employee Name
                  </div>
                  <div className="flex-1 grid" style={{ gridTemplateColumns: `repeat(${daysInMonth}, 1fr)`, minWidth: `${minDayContainerWidth}px` }}>
                    {mockDays.map((dayData) => (
                      <div key={dayData.day} className={`p-1 text-center font-semibold text-white ${dayData.isWeekend ? 'bg-secondary' : 'bg-primary'} border-l border-gray-200`}>
                        <div className="text-sm">{dayData.day}</div>
                        <div className="text-xs">{dayData.weekday}</div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 font-semibold text-sm text-center text-white bg-primary border-l border-gray-200" style={{ width: workingDaysWidth, flexShrink: 0 }}>
                    Working Days
                  </div>
                </div>

                {paginatedEmployees.map((employee, index) => (
                  <div key={`${employee.name}-${index}`} className="flex border-b border-gray-200 items-center">
                    <div className="p-3 text-sm text-gray-800 font-medium truncate border-r-2 border-gray-200" style={{ width: employeeNameWidth, flexShrink: 0 }}>{employee.name}</div>
                    {renderAttendanceRow(employee)}
                    <div className="p-3 text-sm text-gray-700 font-medium text-center border-l border-gray-200" style={{ width: workingDaysWidth, flexShrink: 0 }}>{getWorkingDays(employee.attendanceString)}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* FIX: Pagination updated to your requested format with correct logic */}
            <div className="flex items-center justify-between mt-6 text-sm text-gray-600">
              <p className="text-xs sm:text-sm">
                Showing {showingStart} - {showingEnd} of {totalEntries}
              </p>
              <div className="flex items-center gap-x-2">
                <Button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} variant="secondary">Previous</Button>
                <span className="font-semibold">{currentPage} of {totalPages}</span>
                <Button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} variant="secondary">Next</Button>
              </div>
            </div>
          </div>
    </Sidebar>
  );
};

export default AttendancePage;