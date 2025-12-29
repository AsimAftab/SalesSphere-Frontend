import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import {
  Images,
  Trash2,
  Search,
  Filter,
  MapPin,
  Calendar,
  User,
  Briefcase
} from "lucide-react";

import Button from "../../components/UI/Button/Button";
import DatePicker from "../../components/UI/DatePicker/DatePicker";
import FilterDropdown from '../../components/UI/FilterDropDown/FilterDropDown';
import FilterBar from "../../components/UI/FilterDropDown/FilterBar"; 
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { type MiscWork as MiscWorkType } from "../../api/miscellaneousWorkService";

interface MiscellaneousWorkContentProps {
  tableData: MiscWorkType[];
  isFetchingList: boolean;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  totalItems: number;
  ITEMS_PER_PAGE: number;
  isFilterVisible: boolean;
  setIsFilterVisible: (visible: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  selectedEmployee: string[]; 
  setSelectedEmployee: (ids: string[]) => void;
  selectedMonth: string[];
  setSelectedMonth: (months: string[]) => void;
  employeeOptions: { label: string; value: string }[];
  onResetFilters: () => void;
  handleViewImage: (images: string[]) => void;
  onDelete: (id: string) => void;
}

const MONTH_OPTIONS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// --- SKELETON COMPONENTS ---
const MobileCardSkeleton = () => (
  <div className="p-4 bg-white rounded-xl border border-gray-100 mb-4 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="flex gap-3">
        <Skeleton circle width={40} height={40} />
        <div>
          <Skeleton width={100} height={15} />
          <Skeleton width={60} height={10} />
        </div>
      </div>
      <Skeleton circle width={30} height={30} />
    </div>
    <div className="space-y-3">
      <Skeleton count={3} height={15} />
    </div>
    <div className="mt-4 pt-4 border-t border-gray-50">
      <Skeleton width={120} height={35} borderRadius={8} />
    </div>
  </div>
);

const TableSkeleton: React.FC<{ rows: number }> = ({ rows }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
    <table className="w-full border-collapse">
      <thead className="bg-gray-100 text-sm">
        <tr>
          {Array(9).fill(0).map((_, i) => (
            <th key={i} className="px-5 py-4"><Skeleton /></th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array(rows).fill(0).map((_, rowIndex) => (
          <tr key={rowIndex} className="border-t border-gray-50">
            <td className="px-4 py-4 text-center"><Skeleton circle width={18} height={18} /></td>
            <td className="px-5 py-4"><Skeleton width={20} /></td>
            <td className="px-5 py-4">
              <div className="flex items-center gap-3">
                <Skeleton circle width={40} height={40} />
                <div className="flex-1"><Skeleton width={80} /><Skeleton width={50} height={10} /></div>
              </div>
            </td>
            <td className="px-5 py-4"><Skeleton width={100} /></td>
            <td className="px-5 py-4"><Skeleton width={80} /></td>
            <td className="px-5 py-4"><Skeleton width={150} /></td>
            <td className="px-5 py-4"><Skeleton width={80} /></td>
            <td className="px-5 py-4"><Skeleton width={100} /></td>
            <td className="px-5 py-4"><Skeleton circle width={30} height={30} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const AvatarFallback: React.FC<{ name: string }> = ({ name }) => {
  const letter = name?.trim()?.charAt(0)?.toUpperCase() || "?";
  return (
    <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center border border-gray-200 shrink-0">
      {letter}
    </div>
  );
};

const MiscellaneousWorkContent: React.FC<MiscellaneousWorkContentProps> = ({
  tableData = [], isFetchingList, currentPage, setCurrentPage, ITEMS_PER_PAGE,
  isFilterVisible, setIsFilterVisible, searchQuery, setSearchQuery, selectedDate, setSelectedDate, 
  selectedEmployee, setSelectedEmployee, selectedMonth, setSelectedMonth, employeeOptions, 
  onResetFilters, handleViewImage, onDelete
}) => {

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // --- HANDLERS ---
  const openDeleteModal = (id: string) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setItemToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      onDelete(itemToDelete);
      closeDeleteModal();
    }
  };

  // --- FILTERING & PAGINATION ---
  const filteredData = useMemo(() => {
    if (!Array.isArray(tableData)) return [];

    return tableData.filter((work) => {
      const nature = (work.natureOfWork || "").toLowerCase();
      const addr = (work.address || "").toLowerCase();
      const emp = (work.employee?.name || "").toLowerCase();
      const assigner = (work.assignedBy?.name || "").toLowerCase(); 
      const term = searchQuery.toLowerCase();

      const matchesSearch = searchQuery === "" || 
        nature.includes(term) || 
        addr.includes(term) || 
        emp.includes(term) ||
        assigner.includes(term);

      let matchesMonth = true;
      if (selectedMonth.length > 0 && work.workDate) {
        const monthName = MONTH_OPTIONS[new Date(work.workDate).getMonth()];
        matchesMonth = selectedMonth.includes(monthName);
      }

      const matchesEmployee = selectedEmployee.length === 0 || 
        (work.employee?.name && selectedEmployee.includes(work.employee.name));

      let matchesDate = true;
      if (selectedDate && work.workDate) {
        matchesDate = new Date(work.workDate).toDateString() === selectedDate.toDateString();
      }

      return matchesSearch && matchesMonth && matchesEmployee && matchesDate;
    });
  }, [tableData, searchQuery, selectedMonth, selectedEmployee, selectedDate]);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage, ITEMS_PER_PAGE]);

  const totalFilteredPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(currentItems.map(item => item._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col">
      
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Work Entry"
        message="Are you sure you want to delete this work entry? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
        confirmButtonText="Delete"
        confirmButtonVariant="danger"
      />

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 px-1">
        <div className="text-left shrink-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#202224] whitespace-nowrap">Miscellaneous Work</h1>
          <p className="text-xs sm:text-sm text-gray-500">Manage tasks and staff assignments.</p>
        </div>

        <div className="flex flex-row flex-wrap items-center justify-start lg:justify-end gap-3 w-full">
          <div className="relative flex-1 sm:flex-none sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search Task, Address, or Assigner"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="h-10 w-full bg-gray-200 border-none pl-10 pr-4 rounded-full text-sm shadow-sm outline-none focus:ring-2 focus:ring-secondary transition-all"
            />
          </div>
          <button 
            onClick={() => setIsFilterVisible(!isFilterVisible)}
            className={`p-2.5 rounded-lg border transition-all ${isFilterVisible ? 'bg-secondary text-white shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      <FilterBar isVisible={isFilterVisible} onClose={() => setIsFilterVisible(false)} onReset={onResetFilters}>
        <FilterDropdown 
          label="Created By" 
          options={employeeOptions.map(opt => opt.label)} 
          selected={selectedEmployee} 
          onChange={(val) => { setSelectedEmployee(val); setCurrentPage(1); }} 
        />
        <FilterDropdown 
          label="Month" 
          options={MONTH_OPTIONS} 
          selected={selectedMonth} 
          onChange={(val) => { setSelectedMonth(val); setCurrentPage(1); }} 
        />
        <div className="flex flex-col min-w-[140px] flex-1 sm:flex-none">
          <DatePicker 
            value={selectedDate} 
            onChange={(date) => { setSelectedDate(date); setCurrentPage(1); }} 
            placeholder="Work Date"
            isClearable
            className="bg-none border-gray-100 text-sm text-gray-900 font-semibold"
          />
        </div>
      </FilterBar>

      <div className="relative w-full">
        {/* SKELETON: Only shows if fetching AND no data exists yet */}
        {isFetchingList && tableData.length === 0 ? (
          <>
            <div className="hidden md:block">
              <TableSkeleton rows={ITEMS_PER_PAGE} />
            </div>
            <div className="block md:hidden">
              {Array(3).fill(0).map((_, i) => (
                <MobileCardSkeleton key={i} />
              ))}
            </div>
          </>
        ) : currentItems.length > 0 ? (
          <>
            {/* DESKTOP TABLE VIEW */}
            <div className={`hidden md:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-opacity ${isFetchingList ? 'opacity-60' : 'opacity-100'}`}>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-secondary text-white text-sm">
                    <tr>
                      <th className="px-4 py-4 text-center w-12">
                        <input type="checkbox" className="rounded border-gray-300" onChange={handleSelectAll} checked={selectedIds.length === currentItems.length && currentItems.length > 0} />
                      </th>
                      <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">S.NO.</th>
                      <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Employee</th>
                      <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Nature of Work</th>
                      <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Work Date</th>
                      <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Address</th>
                      <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Assigner</th>
                      <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Images</th>
                      <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentItems.map((work, index) => (
                      <tr key={work._id} className={`hover:bg-gray-50 transition-colors ${selectedIds.includes(work._id) ? 'bg-blue-50' : ''}`}>
                        <td className="px-4 py-4 text-center">
                          <input type="checkbox" className="rounded border-gray-300 accent-secondary" checked={selectedIds.includes(work._id)} onChange={() => handleToggleRow(work._id)} />
                        </td>
                        <td className="px-5 py-3 text-black text-sm">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                        <td className="px-5 py-3 text-black text-sm">
                          <div className="flex items-center gap-3">
                            {work.employee?.avatarUrl ? <img src={work.employee.avatarUrl} className="h-10 w-10 rounded-full object-cover border border-gray-200" alt="" /> : <AvatarFallback name={work.employee?.name || "?"} />}
                            <div>
                              <p className="text-sm font-bold text-gray-900 leading-tight">{work.employee?.name || "N/A"}</p>
                              <p className="text-xs text-gray-500 font-bold tracking-tight">{work.employee?.role || "Staff"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-black text-sm">{work.natureOfWork || '-'}</td>
                        <td className="px-5 py-3 text-black text-sm">{work.workDate ? new Date(work.workDate).toLocaleDateString('en-GB') : '-'}</td>
                        <td className="px-5 py-3 text-black text-sm"><span className="text-xs break-words">{work.address || 'No Address'}</span></td>
                        <td className="px-5 py-3 text-black text-sm">{work.assignedBy?.name || "N/A"}</td>
                        <td className="px-5 py-3 text-sm">
                          <button onClick={() => handleViewImage(work.images)} className="flex items-center gap-1.5 text-blue-500 font-bold text-xs hover:underline" disabled={!work.images?.length}>
                            <Images size={16} /> View ({work.images?.length || 0})
                          </button>
                        </td>
                        <td className="px-5 py-3 text-black text-sm">
                          <button onClick={() => openDeleteModal(work._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"><Trash2 size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MOBILE CARD VIEW */}
            <div className={`block md:hidden space-y-4 px-1 transition-opacity ${isFetchingList ? 'opacity-60' : 'opacity-100'}`}>
              {currentItems.map((work) => (
                <div key={work._id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      {work.employee?.avatarUrl ? <img src={work.employee.avatarUrl} className="h-12 w-12 rounded-full object-cover border" alt="" /> : <AvatarFallback name={work.employee?.name || "?"} />}
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 leading-tight">{work.employee?.name || "N/A"}</h3>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">{work.employee?.role || "Staff"}</span>
                      </div>
                    </div>
                    <button onClick={() => openDeleteModal(work._id)} className="p-2 text-red-500 bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Briefcase size={14} className="text-secondary" />
                      <span className="font-semibold text-gray-900">{work.natureOfWork || 'Miscellaneous Work'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Calendar size={14} className="text-gray-400" />
                      <span>{work.workDate ? new Date(work.workDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-gray-600">
                      <MapPin size={14} className="text-gray-400 mt-0.5 shrink-0" />
                      <span className="line-clamp-2">{work.address || 'No Address Provided'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <User size={14} className="text-gray-400" />
                      <span>Assigned by: <span className="font-bold">{work.assignedBy?.name || "Admin"}</span></span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleViewImage(work.images)} 
                    disabled={!work.images?.length}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg border border-blue-100 disabled:opacity-50 active:scale-95 transition-transform"
                  >
                    <Images size={16} /> View Images ({work.images?.length || 0})
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center p-20 text-gray-500 font-medium bg-white rounded-lg border">No entries found.</div>
        )}

        {/* Pagination Section */}
        {filteredData.length > ITEMS_PER_PAGE && (
          <div className="flex flex-row items-center justify-between p-4 sm:p-6 text-sm text-gray-500">
            <p className="hidden sm:block">Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} of {filteredData.length}</p>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
              <Button onClick={() => setCurrentPage(currentPage - 1)} variant="secondary" disabled={currentPage === 1} className="px-3 py-1 text-xs">Prev</Button>
              <span className="px-2 font-bold text-gray-900 text-xs">{currentPage} / {totalFilteredPages}</span>
              <Button onClick={() => setCurrentPage(currentPage + 1)} variant="secondary" disabled={currentPage >= totalFilteredPages} className="px-3 py-1 text-xs">Next</Button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MiscellaneousWorkContent;