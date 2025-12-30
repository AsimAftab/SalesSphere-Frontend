import React, { useMemo, useState } from "react"; // ✅ Added useState
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Button from "../../components/UI/Button/Button";
import DatePicker from "../../components/UI/DatePicker/DatePicker";
import FilterDropdown from '../../components/UI/FilterDropDown/FilterDropDown';
import FilterBar from "../../components/UI/FilterDropDown/FilterBar"; 
import ExportActions from "../../components/UI/ExportActions";
import StatusUpdateModal from "../../components/modals/StatusUpdateModal"; // ✅ Import Generic Modal

// Types
export interface TourPlan {
  _id: string;
  employee: { name: string; avatarUrl?: string; role?: string };
  placeOfVisit: string;
  startDate: string;
  endDate: string;
  noOfDays: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  reviewer: string;
}

interface TourPlanContentProps {
  tableData: TourPlan[];
  isFetchingList: boolean;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  ITEMS_PER_PAGE: number;
  isFilterVisible: boolean;
  setIsFilterVisible: (visible: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  selectedEmployee: string[];
  setSelectedEmployee: (names: string[]) => void;
  selectedStatus: string[];
  setSelectedStatus: (status: string[]) => void;
  selectedMonth: string[];
  setSelectedMonth: (months: string[]) => void;
  employeeOptions: string[];
  onResetFilters: () => void;
  onExportPdf: (data: TourPlan[]) => void;
  onExportExcel: (data: TourPlan[]) => void;
  // ✅ Added props for update logic
  onUpdateStatus: (id: string, newStatus: string) => void;
  isUpdatingStatus?: boolean;
}

// ✅ Config for the generic modal
const tourStatusOptions = [
  { value: 'Pending', label: 'Pending', colorClass: 'blue' },
  { value: 'Approved', label: 'Approved', colorClass: 'green' },
  { value: 'Rejected', label: 'Rejected', colorClass: 'red' },
];

const MONTH_OPTIONS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const STATUS_OPTIONS = ["Pending", "Approved", "Rejected"];

// --- SKELETON ---
const TableSkeleton: React.FC<{ rows: number }> = ({ rows }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
    <table className="w-full border-collapse">
      <thead className="bg-gray-100"><tr className="h-12">{Array(9).fill(0).map((_, i) => <th key={i} className="px-5"><Skeleton /></th>)}</tr></thead>
      <tbody>{Array(rows).fill(0).map((_, i) => <tr key={i} className="border-t border-gray-50 h-16">{Array(9).fill(0).map((_, j) => <td key={j} className="px-5"><Skeleton /></td>)}</tr>)}</tbody>
    </table>
  </div>
);

const TourPlanContent: React.FC<TourPlanContentProps> = ({
  tableData, isFetchingList, currentPage, setCurrentPage, ITEMS_PER_PAGE,
  isFilterVisible, setIsFilterVisible, searchQuery, setSearchQuery, 
  selectedDate, setSelectedDate, selectedEmployee, setSelectedEmployee,
  selectedStatus, setSelectedStatus, selectedMonth, setSelectedMonth,
  employeeOptions, onResetFilters, onExportPdf, onExportExcel,
  onUpdateStatus, isUpdatingStatus
}) => {

  const [editingTour, setEditingTour] = useState<TourPlan | null>(null); // ✅ State for modal

  const filteredData = useMemo(() => {
    return tableData.filter((item) => {
      const matchesSearch = searchQuery === "" || 
        item.employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.placeOfVisit.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(item.status);
      const matchesEmployee = selectedEmployee.length === 0 || selectedEmployee.includes(item.employee.name);
      let matchesMonth = true;
      if (selectedMonth.length > 0) {
        const monthName = MONTH_OPTIONS[new Date(item.startDate).getMonth()];
        matchesMonth = selectedMonth.includes(monthName);
      }
      let matchesDate = true;
      if (selectedDate) {
        matchesDate = new Date(item.startDate).toDateString() === selectedDate.toDateString();
      }
      return matchesSearch && matchesStatus && matchesEmployee && matchesMonth && matchesDate;
    });
  }, [tableData, searchQuery, selectedStatus, selectedEmployee, selectedMonth, selectedDate]);

  const currentItems = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col">
      
      {/* ✅ Integration of Status Update Modal */}
      <StatusUpdateModal 
        isOpen={!!editingTour}
        onClose={() => setEditingTour(null)}
        onSave={(newVal) => {
          if (editingTour) onUpdateStatus(editingTour._id, newVal);
          setEditingTour(null);
        }}
        currentValue={editingTour?.status || ''}
        entityIdValue={editingTour?.employee.name || ''}
        entityIdLabel="Employee"
        title="Update Tour Status"
        options={tourStatusOptions}
        isSaving={isUpdatingStatus}
      />

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 px-1">
        <div className="text-left shrink-0">
          <h1 className="text-3xl font-bold text-[#202224] whitespace-nowrap">Tour Plans</h1>
          <p className="text-sm text-gray-500">View and manage employee travel schedules.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-64 lg:w-80">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="search"
              placeholder="Search By Employee or Place"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="h-10 w-full bg-gray-200 border-none pl-10 pr-4 rounded-full text-sm shadow-sm outline-none focus:ring-2 focus:ring-secondary transition-all"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
            <button 
              onClick={() => setIsFilterVisible(!isFilterVisible)}
              className={`p-2.5 rounded-lg border transition-all ${isFilterVisible ? 'bg-secondary text-white shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
            >
              <FunnelIcon className="h-5 w-5" />
            </button>
            <ExportActions 
              onExportPdf={() => onExportPdf(filteredData)} 
              onExportExcel={() => onExportExcel(filteredData)} 
            />
            <Button className="w-full sm:w-auto whitespace-nowrap text-sm px-4 h-10 flex items-center justify-center gap-2" onClick={() => {}}>
              Create Tour
            </Button>
          </div>
        </div>
      </div>

      <FilterBar isVisible={isFilterVisible} onClose={() => setIsFilterVisible(false)} onReset={onResetFilters}>
        <FilterDropdown label="Employee" options={employeeOptions} selected={selectedEmployee} onChange={setSelectedEmployee} />
        <FilterDropdown label="Status" options={STATUS_OPTIONS} selected={selectedStatus} onChange={setSelectedStatus} />
        <FilterDropdown label="Month" options={MONTH_OPTIONS} selected={selectedMonth} onChange={setSelectedMonth} />
        <div className="min-w-[140px] flex-1 sm:flex-none">
          <DatePicker value={selectedDate} onChange={setSelectedDate} placeholder="Start Date" isClearable className="bg-none border-gray-100 text-sm font-semibold" />
        </div>
      </FilterBar>

      <div className="relative w-full">
        {isFetchingList && tableData.length === 0 ? (
          <TableSkeleton rows={ITEMS_PER_PAGE} />
        ) : filteredData.length > 0 ? (
          <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-secondary text-white text-sm">
                  <tr>
                    <th className="px-5 py-4 text-left font-semibold">S.NO.</th>
                    <th className="px-5 py-4 text-left font-semibold">Employee</th>
                    <th className="px-5 py-4 text-left font-semibold">Place of Visit</th>
                    <th className="px-5 py-4 text-left font-semibold">Start Date</th>
                    <th className="px-5 py-4 text-left font-semibold">End Date</th>
                    <th className="px-5 py-4 text-left font-semibold">Days</th>
                    <th className="px-5 py-4 text-left font-semibold">Details</th>
                    <th className="px-5 py-4 text-left font-semibold">Reviewer</th>
                    <th className="px-5 py-4 text-left font-semibold ">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {currentItems.map((item, index) => (
                    <tr key={item._id} className="hover:bg-gray-200 transition-colors">
                      <td className="px-5 py-3 text-black text-sm">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                      <td className="px-5 py-3 text-black text-sm">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-100">
                            {item.employee.name.charAt(0)}
                          </div>
                          <span className="text-sm  text-black">{item.employee.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-black text-sm">{item.placeOfVisit}</td>
                      <td className="px-5 py-3 text-black text-sm">{new Date(item.startDate).toLocaleDateString('en-GB')}</td>
                      <td className="px-5 py-3 text-black text-sm">{new Date(item.endDate).toLocaleDateString('en-GB')}</td>
                      <td className="px-5 py-3 text-black text-sm">{item.noOfDays}</td>
                      <td className="px-5 py-4 text-sm whitespace-nowrap">
                        <Link to={`/tour-plan/${item._id}`} className="text-blue-500 hover:underline font-semibold">View Details</Link>
                      </td>
                      <td className="px-5 py-3 text-black text-sm">{item.reviewer || '-'}</td>
                      <td className="px-5 py-3 ">
                        <button 
                          onClick={() => setEditingTour(item)} // ✅ Trigger modal
                          className={`px-3 py-1 text-xs font-bold uppercase rounded-full border shadow-sm transition-transform hover:scale-105 active:scale-95 ${getStatusStyle(item.status)}`}
                        >
                          {item.status}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center p-20 text-gray-500 font-medium bg-white rounded-lg border">No tour plans found.</div>
        )}

        {/* Pagination */}
        {filteredData.length > ITEMS_PER_PAGE && (
          <div className="flex items-center justify-between p-6 text-sm text-gray-500">
            <p className="hidden sm:block">Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} of {filteredData.length}</p>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
              <Button onClick={() => setCurrentPage(currentPage - 1)} variant="secondary" disabled={currentPage === 1} className="px-2 py-1 text-xs">Prev</Button>
              <span className="px-4 font-bold text-gray-900 text-xs">{currentPage} / {totalPages}</span>
              <Button onClick={() => setCurrentPage(currentPage + 1)} variant="secondary" disabled={currentPage >= totalPages} className="px-2 py-1 text-xs">Next</Button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TourPlanContent;