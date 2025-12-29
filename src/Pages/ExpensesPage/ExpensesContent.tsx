import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, 
  Trash2 
} from "lucide-react";
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import "react-loading-skeleton/dist/skeleton.css";

import Button from "../../components/UI/Button/Button";
import DatePicker from "../../components/UI/DatePicker/DatePicker";
import FilterBar from '../../components/UI/FilterDropDown/FilterBar';
import FilterDropdown from '../../components/UI/FilterDropDown/FilterDropDown';
import { type Expense } from "../../api/expensesService";

interface ExpensesContentProps {
  tableData: Expense[];
  isFetchingList: boolean;
  selectedDateFilter: Date | null;
  setSelectedDateFilter: (date: Date | null) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  totalItems: number;
  ITEMS_PER_PAGE: number;
  handleCreate: () => void;
  handleBulkDelete: (ids: string[]) => void;
}

const containerVariants = { hidden: { opacity: 1 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const StatusBadge: React.FC<{ status: Expense["status"] }> = ({ status }) => {
  const colorMap: Record<string, string> = { 
    approved: 'bg-green-600', 
    rejected: 'bg-red-600', 
    pending: 'bg-blue-600' 
  };
  return (
    <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider text-white ${colorMap[status.toLowerCase()]}`}>
      {status}
    </span>
  );
};

// --- ADDED BACK: SKELETON COMPONENT ---
export const ExpensesSkeleton: React.FC = () => (
  <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
    <div className="flex-1 flex flex-col p-4 w-full">
      <div className="flex flex-col lg:flex-row lg:items-center gap-6 mb-8 px-1">
        <div className="flex-shrink-0">
          <Skeleton width={180} height={36} />
        </div>
        <div className="flex flex-row flex-wrap items-center justify-start gap-6 w-full lg:w-auto">
          <Skeleton height={40} width={280} borderRadius={999} />
          <div className="flex items-center gap-6">
            <Skeleton height={40} width={40} borderRadius={8} />
            <Skeleton height={40} width={130} borderRadius={8} />
          </div>
        </div>
      </div>
      <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 bg-gray-50">
          <Skeleton height={20} width="100%" />
        </div>
        <div className="divide-y divide-gray-100 p-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="px-5 py-4">
              <Skeleton height={30} borderRadius={4} />
            </div>
          ))}
        </div>
      </div>
      <div className="md:hidden space-y-4 px-1">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
            <div className="flex justify-between items-start">
              <Skeleton width={120} height={20} />
              <Skeleton width={60} height={24} borderRadius={999} />
            </div>
            <Skeleton width="90%" height={14} />
          </div>
        ))}
      </div>
    </div>
  </SkeletonTheme>
);

const ExpensesContent: React.FC<ExpensesContentProps> = ({
  tableData, isFetchingList, 
  selectedDateFilter, setSelectedDateFilter,
  selectedMonth, setSelectedMonth,
  currentPage, setCurrentPage, totalPages, totalItems, ITEMS_PER_PAGE,
  handleCreate, handleBulkDelete
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const monthsList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const filteredData = useMemo(() => {
    return tableData.filter(exp => 
      exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tableData, searchTerm]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredData.map(exp => exp._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex-1 flex flex-col">
      
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center gap-6 mb-8 px-1">
        <h1 className="text-3xl font-bold text-[#202224] whitespace-nowrap">Expenses List</h1>
        
        <div className="flex flex-row flex-wrap items-center justify-start lg:justify-end gap-6 w-full">
          <AnimatePresence>
            {selectedIds.length > 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <Button 
                  variant="secondary" 
                  className="bg-red-50 text-red-600 border-red-200 hover:bg-red-600 hover:text-white flex items-center gap-2 h-10 px-4"
                  onClick={() => {
                    handleBulkDelete(selectedIds);
                    setSelectedIds([]);
                  }}
                >
                  <Trash2 size={16} /> Delete ({selectedIds.length})
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative w-full sm:w-64 lg:w-80">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="search" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              placeholder="Search Title or Category" 
              className="h-10 w-full bg-gray-200 border-none pl-10 pr-4 rounded-full text-sm shadow-sm outline-none focus:ring-2 focus:ring-secondary transition-all" 
            />
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsFilterVisible(!isFilterVisible)} 
              className={`p-2.5 rounded-lg border transition-all ${isFilterVisible ? 'bg-secondary text-white shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
            >
              <FunnelIcon className="h-5 w-5" />
            </button>
            <Button className="whitespace-nowrap text-sm px-4 h-10" onClick={handleCreate}>
               Create Expense
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Filter Bar */}
      <FilterBar isVisible={isFilterVisible} onClose={() => setIsFilterVisible(false)} onReset={() => { setSelectedDateFilter(null); setSelectedMonth(""); setSearchTerm(""); setSelectedIds([]); }}>
        <FilterDropdown label="Month" selected={selectedMonth ? [selectedMonth] : []} options={monthsList} onChange={(val) => setSelectedMonth(val[0] || "")} align="left" />
        <div className="flex flex-col min-w-[140px]">
          <DatePicker value={selectedDateFilter} onChange={setSelectedDateFilter} placeholder="Select Date" isClearable className="bg-none border-gray-100 text-sm text-gray-900 font-semibold" />
        </div>
      </FilterBar>

      {/* Content Area */}
      <motion.div variants={itemVariants} className="relative w-full">
        {isFetchingList && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10"><Loader2 className="animate-spin text-blue-500 h-8 w-8" /></div>
        )}

        {filteredData.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-secondary text-white text-sm">
                    <tr>
                      <th className="px-5 py-3 text-left">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-gray-300 text-secondary focus:ring-secondary cursor-pointer"
                          checked={selectedIds.length === filteredData.length && filteredData.length > 0}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th className="px-5 py-3 text-left font-semibold">S.NO.</th>
                      <th className="px-5 py-3 text-left font-semibold">Title</th>
                      <th className="px-5 py-3 text-left font-semibold">Amount</th>
                      <th className="px-5 py-3 text-left font-semibold">Incurred Date</th>
                      <th className="px-5 py-3 text-left font-semibold">Category</th>
                      <th className="px-5 py-3 text-left font-semibold">Reviewer</th>
                      <th className="px-5 py-3 text-left font-semibold">Details</th>
                      <th className="px-5 py-3 text-left font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredData.map((exp, index) => (
                      <tr key={exp._id} className={`transition-colors ${selectedIds.includes(exp._id) ? 'bg-blue-50' : 'hover:bg-gray-200'}`}>
                        <td className="px-5 py-4">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-gray-300 text-secondary focus:ring-secondary cursor-pointer"
                            checked={selectedIds.includes(exp._id)}
                            onChange={() => handleToggleRow(exp._id)}
                          />
                        </td>
                        <td className="px-5 py-4 text-black text-sm">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                        <td className="px-5 py-4 text-black text-sm font-medium">{exp.title}</td>
                        <td className="px-5 py-4 text-black text-sm font-bold">₹{exp.amount.toLocaleString()}</td>
                        <td className="px-5 py-4 text-black text-sm whitespace-nowrap">{exp.incurredDate}</td>
                        <td className="px-5 py-4 text-black text-sm">
                          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[11px] font-medium">{exp.category}</span>
                        </td>
                        <td className="px-5 py-4 text-black text-sm italic">{exp.reviewedBy?.name || "---"}</td>
                        <td className="px-5 py-4 text-sm whitespace-nowrap">
                          <Link to={`/expenses/${exp._id}`} className="text-blue-500 hover:underline font-semibold">View Details</Link>
                        </td>
                        <td className="px-5 py-4"><StatusBadge status={exp.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 px-1">
              {filteredData.map((exp) => (
                <div key={exp._id} className={`rounded-xl p-4 shadow-sm border space-y-3 transition-colors ${selectedIds.includes(exp._id) ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100'}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 mt-1 rounded border-gray-300 text-secondary focus:ring-secondary cursor-pointer"
                        checked={selectedIds.includes(exp._id)}
                        onChange={() => handleToggleRow(exp._id)}
                      />
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Title</span>
                        <span className="text-sm font-bold text-gray-900">{exp.title}</span>
                      </div>
                    </div>
                    <StatusBadge status={exp.status} />
                  </div>
                  <div className="grid grid-cols-2 gap-y-3 pl-8">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">Amount</span>
                      <span className="text-sm font-bold text-secondary">₹{exp.amount}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">Incurred Date</span>
                      <span className="text-xs text-gray-600">{exp.incurredDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-50 pl-8">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{exp.category}</span>
                    <Link to={`/expenses/${exp._id}`} className="text-blue-500 text-xs font-bold hover:underline">View Details →</Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center p-20 text-gray-500 font-medium bg-white rounded-lg border">No expenses found.</div>
        )}

        {/* Pagination Section */}
        {filteredData.length > 0 && totalPages > 1 && (
          <div className="flex flex-row items-center justify-between p-4 sm:p-6 text-sm text-gray-500">
            <p className="whitespace-nowrap text-xs">Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of {totalItems}</p>
            <div className="flex items-center gap-2">
              <Button onClick={() => setCurrentPage(currentPage - 1)} variant="secondary" disabled={currentPage === 1} className="px-2 py-1 text-xs">Prev</Button>
              <span className="font-semibold text-black text-xs">{currentPage} / {totalPages}</span>
              <Button onClick={() => setCurrentPage(currentPage + 1)} variant="secondary" disabled={currentPage === totalPages} className="px-2 py-1 text-xs">Next</Button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ExpensesContent;