import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar/Sidebar'; 
import Header from '../../components/layout/Header/Header';
import Button from '../../components/UI/Button/Button';
import ExportActions from '../../components/UI/ExportActions'; 

// --- Mock Data and Constants ---
const mockEmployees = [
    { name: 'Leslie Alexander', attendanceString: 'PWAWWPWPPLWPPPWAWWPPPWWPWAAWPP' },
    { name: 'Helen Henderson', attendanceString: 'PAWAWAPPPPWPPWWWWLPPPPAWPPPWPP' },
    { name: 'Marcus Johnson', attendanceString: 'WWAPPPPAPWPPPWLPPPPWWWWAAWPWPP' },
    { name: 'Marcos Junior', attendanceString: 'PWAWAAPAWPPPAPAPWWPPWLLWAWPWPP' },
    { name: 'Benjamin Davis', attendanceString: 'PLPWPWAWAPPPWWPPPAPPAPAWPLPWPP' },
    { name: 'Hannah Pael', attendanceString: 'WAPWAPPPPPPLPWAPWPPPPWAWPWPWPP' },
    { name: 'George Albert', attendanceString: 'APWPPPWWPPPPWPLPPALWPPWPLPPWPP' },
    { name: 'Kensh Wilson', attendanceString: 'PWPWAPWWPPPAPWPPPLPAWPPPPPAWPP' },
    { name: 'James Martinez', attendanceString: 'PPWWPPPPPPPWPPPAPLPPPPWPPAPWPP' }
];

const daysInMonth = 30; 

const mockDays = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    weekday: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i % 7],
    isWeekend: (i % 7 === 5 || i % 7 === 6), 
}));

const statusColors: Record<string, string> = {
    P: 'text-green-500', 
    W: 'text-blue-500',   
    A: 'text-red-500',    
    L: 'text-yellow-500', 
    H: 'text-purple-500', 
    ' ': 'text-gray-300', 
};

const getWorkingDays = (attendanceString: string): number => {
    return (attendanceString.match(/[PLH]/g) || []).length;
};

// --- Main Component ---
const AttendancePage: React.FC = () => {
    const [selectedMonth, setSelectedMonth] = useState('June');
    const [selectedYear, setSelectedYear] = useState('2025');
    const [page, setPage] = useState(1);
    const entriesPerPage = 10;
    const totalEntries = mockEmployees.length;

    const handleExportPdf = () => console.log('Exporting Attendance to PDF...');
    const handleExportExcel = () => console.log('Exporting Attendance to Excel...');
    const handlePrint = () => window.print();

    const paginatedEmployees = useMemo(() => {
        const start = (page - 1) * entriesPerPage;
        return mockEmployees.slice(start, start + entriesPerPage);
    }, [page]);

    const maxPage = Math.ceil(totalEntries / entriesPerPage);

    const renderAttendanceRow = (attendanceString: string) => {
        const paddedString = (attendanceString + ' '.repeat(daysInMonth)).slice(0, daysInMonth);
        
        return Array.from(paddedString).map((status, index) => {
            const dayData = mockDays[index];
            const cellStatus = status as keyof typeof statusColors;

            return (
                <div 
                    key={index} 
                    className={`w-[28px] h-8 p-1 text-center font-bold text-xs ${
                        dayData.weekday === 'Sat' ? 'bg-gray-200' : 'bg-white'
                    } border-r border-gray-100 flex items-center justify-center`}
                    title={`Day ${dayData.day}, ${dayData.weekday}: ${cellStatus || 'N/A'}`}
                >
                    <span className={statusColors[cellStatus] || 'text-gray-600'}>
                        {cellStatus}
                    </span>
                </div>
            );
        });
    };

    const showingStart = (page - 1) * entriesPerPage + 1;
    const showingEnd = Math.min(page * entriesPerPage, totalEntries);
    const showingText = `Showing ${showingStart} to ${showingEnd} of ${totalEntries} Entries`;

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <Sidebar /> 
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 p-6 overflow-y-auto bg-[#F5F6FA]">
                    <div className="max-w-full mx-auto space-y-6">
                        {/* Title */}
                        <div className="mb-4">
                            <h1 className="text-2xl font-bold text-gray-800">Employee Attendance</h1>
                            <p className="text-gray-500">Monthly attendance report. Track and manage employee attendance.</p>
                        </div>
                        
                        {/* Filters and Export */}
                        <div className="bg-white p-4 rounded-xl shadow-md flex flex-wrap gap-4 justify-end sm:justify-between items-center">
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-700 text-sm font-medium">Select Month and Year</span>
                                <select 
                                    value={selectedMonth} 
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                >
                                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
                                        <option key={month}>{month}</option>
                                    ))}
                                </select>
                                <select 
                                    value={selectedYear} 
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                >
                                    {[2025, 2024, 2023].map(year => (
                                        <option key={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                            <ExportActions 
                                onExportPdf={handleExportPdf}
                                onExportExcel={handleExportExcel}
                                onPrint={handlePrint}
                            />
                        </div>

                        {/* Legend */}
                        <div className="flex items-start flex-wrap gap-x-6 gap-y-3 text-sm text-gray-700 bg-white p-3 rounded-xl shadow-md">
                            <span className="font-medium flex-shrink-0 mt-1">Legend:</span>

                            {/* This container is a grid on mobile and a flexbox on large screens */}
                            <div className="grid grid-cols-2 gap-x-6 gap-y-3 lg:flex lg:flex-wrap lg:gap-x-6 lg:gap-y-3">
                                {/* Present */}
                                <div className="flex items-center space-x-2">
                                    <span className={`font-bold border border-green-500 bg-green-50 px-2 py-0.5 rounded ${statusColors.P}`}>P</span>
                                    <span>Present</span>
                                </div>
                                {/* Absent */}
                                <div className="flex items-center space-x-2">
                                    <span className={`font-bold border border-red-500 bg-red-50 px-2 py-0.5 rounded ${statusColors.A}`}>A</span>
                                    <span>Absent</span>
                                </div>
                                {/* Weekly Off */}
                                <div className="flex items-center space-x-2">
                                    <span className={`font-bold border border-blue-500 bg-blue-50 px-2 py-0.5 rounded ${statusColors.W}`}>W</span>
                                    <span>Weekly Off</span>
                                </div>
                                {/* Leave */}
                                <div className="flex items-center space-x-2">
                                    <span className={`font-bold border border-yellow-500 bg-yellow-50 px-2 py-0.5 rounded ${statusColors.L}`}>L</span>
                                    <span>Leave</span>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto">
                            <div className="min-w-[800px] xl:min-w-full">
                                <div>
                                    {/* Header Row */}
                                    <div className="flex border-b bg-primary text-white sticky top-0 z-10">
                                        <div className="w-[160px] p-3 font-bold text-left text-sm">Employee Name</div> 
                                        <div className="flex flex-1 border-l border-r border-gray-200">
                                            {mockDays.map(dayData => (
                                                <div 
                                                    key={dayData.day} 
                                                    className={`w-[28px] px-1 py-0.5 text-center text-xs font-medium ${
                                                        dayData.weekday === 'Sat' 
                                                            ? 'bg-secondary text-white' 
                                                            : 'bg-primary text-white'
                                                    } border-r border-gray-200`}
                                                >
                                                    <div className="font-bold">{dayData.day}</div>
                                                    <div className="text-[10px]">{dayData.weekday}</div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="w-16 py-3 px-1 font-bold text-center text-sm">Working Days</div>
                                    </div>

                                    {/* Data Rows */}
                                    {paginatedEmployees.map((employee, index) => (
                                        <div key={index} className="flex border-b border-gray-100 hover:bg-indigo-50/5 transition-colors">
                                            <div className="w-[160px] p-3 text-sm text-gray-800 font-medium truncate">{employee.name}</div>
                                            <div className="flex flex-1">
                                                {renderAttendanceRow(employee.attendanceString)}
                                            </div>
                                            <div className="w-16 py-3 px-1 text-sm text-gray-600 font-medium text-center">
                                                {getWorkingDays(employee.attendanceString)}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Pagination */}
                                    <div className="rounded-lg px-6 py-2.5 flex justify-between items-center gap-2 bg-white border-t border-gray-200">
                                        <span className="text-sm text-gray-600">{showingText}</span>
                                        <div className="flex items-center space-x-2">
                                            <Button 
                                                variant="outline" 
                                                disabled={page === 1}
                                                onClick={() => setPage(page - 1)}
                                                className="h-8 w-8 rounded-lg px-4 py-2.5 items-center gap-2"
                                            >
                                                <ChevronLeft size={16} />
                                            </Button>
                                            <div className="flex space-x-1">
                                                {Array.from({ length: maxPage }, (_, i) => i + 1).map(p => (
                                                    <button
                                                        key={p}
                                                        onClick={() => setPage(p)}
                                                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                                            p === page 
                                                                ? 'bg-secondary text-white shadow-md' 
                                                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                                        }`}
                                                    >
                                                        {p}
                                                    </button>
                                                ))}
                                            </div>
                                            <Button 
                                                variant="outline" 
                                                disabled={page === maxPage || totalEntries === 0}
                                                onClick={() => setPage(page + 1)}
                                                className="h-8 w-8 rounded-lg px-4 py-2.5 items-center gap-2"
                                            >
                                                <ChevronRight size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AttendancePage;
