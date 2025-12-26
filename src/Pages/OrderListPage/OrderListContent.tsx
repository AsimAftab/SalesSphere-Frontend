import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; 
import Button from '../../components/UI/Button/Button';
import ExportActions from '../../components/UI/ExportActions';
import DatePicker from "../../components/UI/DatePicker/DatePicker"; 
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ArrowPathIcon, 
  ChevronDownIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { type Order, type OrderStatus } from '../../api/orderService'; 
import OrderStatusModal from '../../components/modals/OrderStatusModal';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'; 
import 'react-loading-skeleton/dist/skeleton.css'; 
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import OrderListPDF from './OrderListPDF';

interface OrderListContentProps {
  data: Order[] | null;
  loading: boolean;
  error: string | null;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
  isUpdatingStatus: boolean;
  initialStatusFilter: string;
  initialDateFilter: string;
  initialMonth: string | undefined;
}

// --- Updated Multi-Select Filter Dropdown Component ---
const FilterDropdown: React.FC<{ 
  label: string; 
  selected: string[]; 
  options: string[]; 
  onChange: (vals: string[]) => void;
  align?: 'left' | 'right'; // Added alignment prop
}> = ({ label, selected, options, onChange, align = 'left' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggleOption = (opt: string) => {
    const newSelected = selected.includes(opt) ? selected.filter(i => i !== opt) : [...selected, opt];
    onChange(newSelected);
  };

  return (
    <div className="relative" ref={ref}>
      <div className="flex flex-col cursor-pointer group" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 group-hover:text-secondary transition-colors">
          <span className="whitespace-nowrap">{selected.length === 0 ? `${label}` : `${selected.length} Selected`}</span>
          <ChevronDownIcon className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 10 }} 
            // Dynamic alignment: Created By uses left-0, others use right-0 for mobile safety
            className={`absolute ${align === 'left' ? 'left-0' : 'right-0'} mt-3 w-52 sm:w-56 bg-white rounded-lg shadow-2xl py-2 z-[100] border border-gray-100 overflow-hidden`}
          >
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {options.map(opt => (
                <label key={opt} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer transition-colors group">
                  <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggleOption(opt)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                  <span className="capitalize group-hover:text-secondary">{opt}</span>
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const containerVariants = { hidden: { opacity: 1 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const StatusBadge = ({ status, onClick }: { status: OrderStatus; onClick: () => void }) => {
  const baseClasses = 'px-3 py-1 text-[10px] font-bold rounded-full cursor-pointer transition-transform hover:scale-105 uppercase tracking-wider text-white';
  const colorMap: Record<string, string> = { completed: 'bg-green-600', rejected: 'bg-red-600', 'in transit': 'bg-orange-500', 'in progress': 'bg-violet-600', pending: 'bg-blue-600' };
  return <button onClick={onClick} className={`${baseClasses} ${colorMap[status.toLowerCase()] || 'bg-gray-600'}`}>{status}</button>;
};

const OrderListSkeleton: React.FC = () => (
  <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
    <div className="flex-1 flex flex-col p-4 w-full">
      {/* Header Skeleton: Title and Left-Aligned Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-6 mb-8 px-1">
        <div className="flex-shrink-0">
          <Skeleton width={180} height={36} />
        </div>
        
        <div className="flex flex-row flex-wrap items-center justify-start gap-6 w-full lg:w-auto">
          {/* Search bar skeleton */}
          <Skeleton height={40} width={280} borderRadius={999} />
          
          {/* Action buttons group skeleton */}
          <div className="flex items-center gap-6">
            <Skeleton height={40} width={40} borderRadius={8} />
            <Skeleton height={40} width={40} borderRadius={8} />
            <Skeleton height={40} width={130} borderRadius={8} />
          </div>
        </div>
      </div>

      {/* Desktop Table Skeleton (Hidden on mobile) */}
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

      {/* Mobile Card Skeleton (Hidden on desktop) */}
      <div className="md:hidden space-y-4 px-1">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
            {/* Invoice and Status row */}
            <div className="flex justify-between items-start">
              <div>
                <Skeleton width={80} height={10} className="mb-1" />
                <Skeleton width={120} height={16} />
              </div>
              <Skeleton width={60} height={24} borderRadius={999} />
          0 </div>
            
            {/* Details Grid */}
            <div className="space-y-3 border-t border-gray-50 pt-3">
               <div>
                <Skeleton width={70} height={10} className="mb-1" />
                <Skeleton width="90%" height={14} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Skeleton width={60} height={10} className="mb-1" />
                  <Skeleton width={100} height={14} />
                </div>
                <div>
                  <Skeleton width={60} height={10} className="mb-1" />
                  <Skeleton width={80} height={14} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </SkeletonTheme>
);

const monthsList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const statusesList: OrderStatus[] = ['completed', 'in progress', 'in transit', 'pending', 'rejected'];
const toLocalDateString = (date: string | Date) => {
  const d = new Date(date);
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
};

const OrderListContent: React.FC<OrderListContentProps> = ({
  data, loading, error, onUpdateStatus, isUpdatingStatus,
  initialStatusFilter, initialDateFilter, initialMonth
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState({
    status: initialStatusFilter !== 'all' ? [initialStatusFilter] : [] as string[],
    month: initialMonth !== 'all' && initialMonth ? [initialMonth] : [] as string[],
    creators: [] as string[],
    parties: [] as string[], // NEW: Party filter state
    date: initialDateFilter === 'today' ? new Date() : null as Date | null,
  });

  useEffect(() => {
    setFilters({
      status: initialStatusFilter !== 'all' ? [initialStatusFilter] : [],
      month: initialMonth !== 'all' && initialMonth ? [initialMonth] : [],
      creators: [],
      parties: [], // Reset parties on prop change
      date: initialDateFilter === 'today' ? new Date() : null,
    });
    setCurrentPage(1);
  }, [initialStatusFilter, initialDateFilter, initialMonth]);

  const availableCreators = useMemo(() => {
    if (!data) return [];
    const names = data.map(o => o.createdBy?.name).filter(Boolean);
    return Array.from(new Set(names)).sort() as string[];
  }, [data]);

  // NEW: Extract unique parties from data
  const availableParties = useMemo(() => {
    if (!data) return [];
    const names = data.map(o => o.partyName).filter(Boolean);
    return Array.from(new Set(names)).sort() as string[];
  }, [data]);

  const resetFilters = () => { 
    setFilters({ status: [], month: [], creators: [], date: null, parties: [] }); 
    setSearchTerm(''); 
    toast.success('Filters cleared'); 
  };

  // Logic to determine which month the DatePicker should open to
  const calendarOpenToDate = useMemo(() => {
    if (filters.month.length > 0) {
      const monthIdx = monthsList.indexOf(filters.month[0]);
      if (monthIdx !== -1) {
        // Return first day of the selected month in the current year
        return new Date(new Date().getFullYear(), monthIdx, 1);
      }
    }
    return undefined; // Falls back to current month if no filter
  }, [filters.month]);

  const filteredOrders = useMemo(() => {
    if (!data) return [];
    return data.filter(order => {
      const orderDate = new Date(order.dateTime);
      const matchesSearch = (order.partyName || '').toLowerCase().includes(searchTerm.toLowerCase()) || (order.invoiceNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDate = !filters.date || toLocalDateString(order.dateTime) === toLocalDateString(filters.date);
      const matchesMonth = filters.month.length === 0 || filters.month.includes(monthsList[orderDate.getMonth()]);
      const matchesStatus = filters.status.length === 0 || filters.status.includes(order.status.toLowerCase());
      const matchesCreator = filters.creators.length === 0 || (order.createdBy?.name && filters.creators.includes(order.createdBy.name));
      const matchesParty = filters.parties.length === 0 || (order.partyName && filters.parties.includes(order.partyName)); // NEW: Party match logic
      return matchesSearch && matchesDate && matchesMonth && matchesStatus && matchesCreator && matchesParty;
    }).sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
  }, [data, searchTerm, filters]);

  const totalPages = Math.ceil(filteredOrders.length / 10);
  const currentOrders = filteredOrders.slice((currentPage - 1) * 10, currentPage * 10);

  const handleExportPdf = async () => {
    if (filteredOrders.length === 0) { toast.error("No orders found to export"); return; }
    const toastId = toast.loading("Preparing PDF view...");
    try {
      const { pdf } = await import('@react-pdf/renderer');
      const blob = await pdf(<OrderListPDF orders={filteredOrders} />).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      toast.success("PDF opened in new tab!", { id: toastId });
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (err) { toast.error("Failed to open PDF", { id: toastId }); }
  };

  if (loading && !data) return <OrderListSkeleton />;
  if (error && !data) return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show" 
      className="flex-1 flex flex-col" // Prevents horizontal scroll
    >
      <OrderStatusModal isOpen={!!editingOrder} onClose={() => setEditingOrder(null)} onSave={(s) => { if(editingOrder) onUpdateStatus(editingOrder.id || editingOrder._id, s); setEditingOrder(null); }} currentStatus={editingOrder?.status || 'pending'} orderId={editingOrder?.invoiceNumber || ''} isSaving={isUpdatingStatus} />

    
        {/* Header Section */}
        <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center gap-6 mb-8 px-1">
          {/* Left Side: Title */}
          <h1 className="text-3xl font-bold text-[#202224] whitespace-nowrap">Order List</h1>
          
          {/* Right Side Container: justify-start on mobile, justify-end on desktop (lg) */}
          <div className="flex flex-row flex-wrap items-center justify-start lg:justify-end gap-6 w-full">
            
            {/* Search Bar */}
            <div className="relative w-full sm:w-64 lg:w-80">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="search" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                placeholder="Search Invoice/Party" 
                className="h-10 w-full bg-gray-200 border-none pl-10 pr-4 rounded-full text-sm shadow-sm outline-none focus:ring-2 focus:ring-secondary transition-all" 
              />
            </div>

            {/* Action Buttons Group */}
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsFilterVisible(!isFilterVisible)} 
                className={`p-2.5 rounded-lg border transition-all ${isFilterVisible ? 'bg-secondary text-white shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
              >
                <FunnelIcon className="h-5 w-5" />
              </button>
              
              <ExportActions onExportPdf={handleExportPdf} />
              
              <Button className="whitespace-nowrap text-sm px-4">
                Create Order
              </Button>
            </div>
          </div>
        </motion.div>

      {/* Updated Filter Section */}
      <AnimatePresence>
      {isFilterVisible && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }} 
          animate={{ height: 'auto', opacity: 1 }} 
          exit={{ height: 0, opacity: 0 }} 
          // Ensure overflow is visible so dropdowns can "break out"
          className="overflow-visible mb-6 px-1 z-[70]" 
        >
          <div ref={filterRef} className="bg-white rounded-xl p-4 sm:p-5 text-gray-900 flex flex-wrap items-center gap-x-6 gap-y-4 shadow-xl relative z-[70]">
            <div className="flex items-center gap-2 text-sm font-semibold border-b sm:border-b-0 sm:border-r border-gray-100 pb-2 sm:pb-0 sm:pr-6 w-full sm:w-auto">
              <FunnelIcon className="h-4 w-4 text-gray-900" />
              <span>Filter By</span>
            </div>
            
            {/* Left-aligned dropdowns */}
            <FilterDropdown label="Party" selected={filters.parties} options={availableParties} onChange={(val) => setFilters({...filters, parties: val})} align="left" />
            <FilterDropdown label="Created By" selected={filters.creators} options={availableCreators} onChange={(val) => setFilters({...filters, creators: val})} align="left" />
            
            {/* Right-aligned dropdowns (prevents cutting on small screens) */}
            <FilterDropdown label="Status" selected={filters.status} options={statusesList} onChange={(val) => setFilters({...filters, status: val})} align="right" />
            <FilterDropdown label="Month" selected={filters.month} options={monthsList} onChange={(val) => setFilters({...filters, month: val})} align="left" />
            
            <div className="flex flex-col min-w-[140px] flex-1 sm:flex-none border-b sm:border-none pb-1 sm:pb-0">
              <DatePicker 
                value={filters.date} 
                onChange={(date) => setFilters({...filters, date})} 
                openToDate={calendarOpenToDate}
                placeholder="Select Date" isClearable 
                className="bg-none border-gray-100 text-sm text-gray-900 font-semibold placeholder:text-gray-900" 
              />
            </div>

            <div className="flex items-center justify-between w-full sm:w-auto sm:ml-auto gap-4">
              <button onClick={resetFilters} className="flex items-center gap-2 text-orange-500 hover:text-orange-700 transition-colors text-sm font-bold uppercase tracking-wider">
                <ArrowPathIcon className="h-4 w-4" /> Reset Filter
              </button>
              <button onClick={() => setIsFilterVisible(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <XMarkIcon className="h-5 w-5 text-gray-900 hover:text-red-600" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

      {/* Rest of the component remains the same */}
      <motion.div variants={itemVariants} className="relative w-full">
        {isUpdatingStatus && ( <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10"><Loader2 className="animate-spin text-blue-500 h-8 w-8" /></div> )}
        
        {filteredOrders.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-secondary text-white text-sm">
                    <tr><th className="px-5 py-3 text-left font-semibold whitespace-nowrap">S.NO.</th>
                    <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Invoice Number</th>
                    <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Party Name</th>
                    <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Created By</th>
                    <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Delivery Date</th>
                    <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Total Amount</th>
                    <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Details</th>
                    <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Status</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {currentOrders.map((order, index) => (
                      <tr key={order.id || order._id} className="hover:bg-gray-200 transition-colors">
                        <td className="px-5 py-3 text-black text-sm">{(currentPage - 1) * 10 + index + 1}</td>
                        <td className="px-5 py-3 text-black text-sm">{order.invoiceNumber}</td>
                        <td className="px-5 py-3 text-black text-sm">{order.partyName}</td>
                        <td className="px-5 py-3 text-black text-sm">{order.createdBy?.name || '-'}</td>
                        <td className="px-5 py-3 text-black text-sm">{order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</td>
                        <td className="px-5 py-3 text-black text-sm">RS {order.totalAmount}</td>
                        <td className="px-5 py-4 text-sm"><Link to={`/order/${order.id || order._id}`} className="text-blue-500 hover:underline font-semibold">View Details</Link></td>
                        <td className="px-5 py-4"><StatusBadge status={order.status} onClick={() => setEditingOrder(order)} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 px-1">
              {currentOrders.map((order) => (
                <div key={order.id || order._id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Invoice Number</span>
                      <span className="text-sm font-bold text-gray-900">{order.invoiceNumber}</span>
                    </div>
                    <StatusBadge status={order.status} onClick={() => setEditingOrder(order)} />
                  </div>

                  <div className="grid grid-cols-2 gap-y-3">
                    <div className="col-span-2">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Party Name</span>
                      <span className="text-sm text-gray-800 font-medium">{order.partyName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Created By</span>
                      <span className="text-xs text-gray-600">{order.createdBy?.name || '-'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Delivery Date</span>
                      <span className="text-xs text-gray-600">
                        {order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '-'}
                      </span>
                    </div>
                  <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Amount</span>
                      <span className="text-sm font-bold text-secondary">RS {order.totalAmount}</span>
                    </div>
                    <div className="flex items-end justify-end">
                      <Link to={`/order/${order.id || order._id}`} className="text-blue-500 text-xs font-bold hover:underline">View Details →</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center p-20 text-gray-500 font-medium bg-white rounded-lg border">No orders found.</div>
        )}

        
        {/* Pagination Section */}
        {filteredOrders.length > 0 && totalPages > 1 && (
          <div className="flex flex-row items-center justify-between p-4 sm:p-6 gap-2 text-sm text-gray-500">
            <p className="whitespace-nowrap text-xs sm:text-sm">
              Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, filteredOrders.length)} of {filteredOrders.length}
            </p>
            <div className="flex items-center gap-1 sm:gap-2">
              {currentPage > 1 && <Button onClick={() => setCurrentPage(prev => prev - 1)} variant="secondary" className="px-2 py-1 text-xs">Prev</Button>}
              <span className="flex items-center px-2 font-semibold text-black whitespace-nowrap text-xs sm:text-sm">{currentPage} / {totalPages}</span>
              {currentPage < totalPages && <Button onClick={() => setCurrentPage(prev => prev + 1)} variant="secondary" className="px-2 py-1 text-xs">Next</Button>}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default OrderListContent;