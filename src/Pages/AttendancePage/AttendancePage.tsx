import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar/Sidebar'; 
import Header from '../../components/layout/Header/Header';
import Button from '../../components/UI/Button/Button';
import ExportActions from '../../components/UI/ExportActions'; 


// --- Mock Data and Constants ---
const mockEmployees = [
    { name: 'Leslie Alexander', attendanceString: 'PWAWWPWPPLWPPPPAWPLWPPPPWAPPPWAP' },
    { name: 'Helen Henderson', attendanceString: 'PAWAWAPPPPWPPPPPPPWLPPPPAWPLAAW' },
    { name: 'Marcus Johnson', attendanceString: 'WWAPPPPAPWPPPWLPPPPWWAAAPWPPPPWL' },
    { name: 'Marcos Junior', attendanceString: 'PWAWAAPAWPPPAPAPWWPPPLPLAWWAAP' },
    { name: 'Benjamin Davis', attendanceString: 'PLPWPWAWAPPPWWPPPAPPAPAPWPLWPA' },
    { name: 'Hannah Pael', attendanceString: 'WAPWAPPPPPPLPWAPWPPPPPALWPWWAP' },
    { name: 'George Albert', attendanceString: 'APWPPPWWPPPPWPLPPALWPPAPPLPPAP' },
    { name: 'Kensh Wilson', attendanceString: 'PWPWAPWWPPPAPWPPPLPAWPPPPPWWALP' },
    { name: 'James Martinez', attendanceString: 'PPWWPPPPPPPWPPPAPLPPPPWPPWWAAPP' },
];

const daysInMonth = 30; 

const mockDays = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    weekday: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i % 7],
    isWeekend: (i % 7 === 5 || i % 7 === 6), 
}));

const statusColors = {
    P: 'text-green-500', // Present
    W: 'text-blue-500',   // Weekly Off
    A: 'text-red-500',    // Absent
    L: 'text-yellow-500', // Leave
    H: 'text-purple-500', // Half Day
    ' ': 'text-gray-300', // Empty/Future
};

const getWorkingDays = (attendanceString: string): number => {
    // Count 'P' (Present) + 'L' (Leave) + 'H' (Half Day)
    return (attendanceString.match(/[P L H]/g) || []).length;
};

// --- Main Component ---

const AttendancePage: React.FC = () => {
    const [selectedMonth, setSelectedMonth] = useState('June');
    const [selectedYear, setSelectedYear] = useState('2025');
    const [page, setPage] = useState(1);
    const entriesPerPage = 10;
    const totalEntries = mockEmployees.length;

    // --- Action Handlers (Mocks) ---
    // These handlers must remain defined, but they are now simple arrow functions
    // instead of multi-line console.logs, keeping the function definition minimal.
    const handleExportPdf = () => console.log('Exporting Attendance to PDF...');
    const handleExportExcel = () => console.log('Exporting Attendance to Excel...');
    const handlePrint = () => window.print();


    // Slice data for pagination
    const paginatedEmployees = useMemo(() => {
        const start = (page - 1) * entriesPerPage;
        return mockEmployees.slice(start, start + entriesPerPage);
    }, [page]);
    
    const maxPage = Math.ceil(totalEntries / entriesPerPage);


    // Function to render the attendance cells for one employee
    const renderAttendanceRow = (attendanceString: string) => {
        const paddedString = (attendanceString + ' '.repeat(daysInMonth)).slice(0, daysInMonth);
        
        return Array.from(paddedString).map((status, index) => {
            const dayData = mockDays[index];
            const cellStatus = status.trim() as keyof typeof statusColors;
            const isWeekend = dayData.isWeekend;
            
            return (
                <div 
                    key={index} 
                    className={`h-full w-8 p-1 text-center font-bold text-xs ${isWeekend ? 'bg-gray-100' : 'bg-white'} border-r border-gray-100 flex items-center justify-center`}
                    title={`Day ${dayData.day}, ${dayData.weekday}: ${cellStatus || 'N/A'}`}
                >
                    <span className={statusColors[cellStatus] || 'text-gray-600'}>
                        {cellStatus}
                    </span>
                </div>
            );
        });
    };

    // Calculate pagination display text
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
                        
                        {/* Title Section */}
                        <div className="mb-4">
                            <h1 className="text-2xl font-bold text-gray-800">Employee Attendance</h1>
                            <p className="text-gray-500">Monthly attendance report. Track and manage employee attendance.</p>
                        </div>
                        
                        {/* Filters and Actions Bar */}
                        <div className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center flex-wrap gap-4">
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
                            
                            {/* Export Actions Component */}
                            <ExportActions 
                                onExportPdf={handleExportPdf}
                                onExportExcel={handleExportExcel}
                                onPrint={handlePrint}
                            />
                        </div>

                        {/* Legend (IMPROVED STYLING) */}
                        <div className="flex items-center space-x-6 text-sm text-gray-700 bg-white p-3 rounded-xl shadow-md">
                            <span className="font-medium">Legend:</span>
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

                        {/* Attendance Table Container */}
                        <div className="bg-white rounded-xl shadow-md overflow-x-auto border border-gray-200">
                            {/* Table container now allows shrinking without horizontal scroll on large screens */}
                            <div className="flex flex-col"> 
                                
                                {/* Table Header (Days) */}
                                <div className="flex border-b bg-primary text-white sticky top-0 z-10">
                                    {/* Employee Name column */}
                                    <div className="w-40 p-3 font-bold text-left flex-shrink-0 text-sm">Employee Name</div> 
                                    
                                    {/* Days of the Month */}
                                    <div className="flex flex-1 border-l border-r border-gray-200">
                                        {mockDays.map(dayData => (
                                            <div 
                                                key={dayData.day} 
                                                className={`w-8 p-1 text-center text-xs font-medium ${
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
                                    {/* Working Days column */}
                                    <div className="w-20 p-2 font-bold text-center flex-shrink-0 text-sm">Working Days</div>
                                </div>

                                {/* Table Body (Employee Rows) */}
                                {paginatedEmployees.map((employee, index) => (
                                    <div key={index} className="flex border-b border-gray-100 hover:bg-indigo-50/5 transition-colors">
                                        <div className="w-40 p-3 text-sm text-gray-800 font-medium flex-shrink-0 truncate">{employee.name}</div>
                                        <div className="flex flex-1">
                                            {renderAttendanceRow(employee.attendanceString)}
                                        </div>
                                        <div className="w-20 p-3 text-sm text-gray-600 font-medium text-center flex-shrink-0">{getWorkingDays(employee.attendanceString)}</div>
                                    </div>
                                ))}

                                {/* Pagination */}
                                <div className="rounded-lg px-6 py-2.5 flex justify-between items-center gap-2 bg-white border-t border-gray-200">
                                    {/* Pagination Display Text */}
                                    <span className="text-sm text-gray-600">{showingText}</span>
                                    {/* Pagination Controls */}
                                    <div className="flex items-center space-x-2">
                                        {/* Prev Button */}
                                        <Button 
                                            variant="outline" 
                                            disabled={page === 1}
                                            onClick={() => setPage(page - 1)}
                                            className="h-8 w-8 rounded-lg px-4 py-2.5 items-center gap-2"
                                        >
                                            <ChevronLeft size={16} />
                                        </Button>
                                        
                                        {/* Page Numbers */}
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
                                        
                                        {/* Next Button */}
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
                </main>
            </div>
        </div>
    );
};

export default AttendancePage;

