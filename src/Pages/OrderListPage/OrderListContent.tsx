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
import OrderListPDF from './OrderListPDF'; // Assuming this is in the same directory

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

// --- Multi-Select Filter Dropdown Component ---
const FilterDropdown: React.FC<{ 
  label: string; 
  selected: string[]; 
  options: string[]; 
  onChange: (vals: string[]) => void 
}> = ({ label, selected, options, onChange }) => {
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
        <div className="flex items-center gap-2 text-sm font-semibold text-white group-hover:text-orange-300 transition-colors">
          <span>{selected.length === 0 ? `All ${label}` : `${selected.length} Selected`}</span>
          <ChevronDownIcon className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute left-0 mt-3 w-56 bg-white rounded-lg shadow-2xl py-2 z-[100] border border-gray-100 overflow-hidden">
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {options.map(opt => (
                <label key={opt} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer transition-colors group">
                  <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggleOption(opt)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                  <span className="capitalize group-hover:text-blue-700">{opt}</span>
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
    <div className="flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <Skeleton width={180} height={36} />
        <div className="flex gap-3"><Skeleton width={250} height={40} borderRadius={999} /><Skeleton width={40} height={40} borderRadius={8} /><Skeleton width={100} height={40} borderRadius={8} /></div>
      </div>
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"><Skeleton height={40} className="mb-2" />{[...Array(8)].map((_, i) => <Skeleton key={i} height={52} className="mb-1" />)}</div>
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
    date: initialDateFilter === 'today' ? new Date() : null as Date | null,
  });

  useEffect(() => {
    setFilters({
      status: initialStatusFilter !== 'all' ? [initialStatusFilter] : [],
      month: initialMonth !== 'all' && initialMonth ? [initialMonth] : [],
      creators: [],
      date: initialDateFilter === 'today' ? new Date() : null,
    });
    setCurrentPage(1);
  }, [initialStatusFilter, initialDateFilter, initialMonth]);

  const availableCreators = useMemo(() => {
    if (!data) return [];
    const names = data.map(o => o.createdBy?.name).filter(Boolean);
    return Array.from(new Set(names)).sort() as string[];
  }, [data]);

  const resetFilters = () => { setFilters({ status: [], month: [], creators: [], date: null }); setSearchTerm(''); toast.success('Filters cleared'); };

  const filteredOrders = useMemo(() => {
    if (!data) return [];
    return data.filter(order => {
      const orderDate = new Date(order.dateTime);
      const matchesSearch = (order.partyName || '').toLowerCase().includes(searchTerm.toLowerCase()) || (order.invoiceNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDate = !filters.date || toLocalDateString(order.dateTime) === toLocalDateString(filters.date);
      const matchesMonth = filters.month.length === 0 || filters.month.includes(monthsList[orderDate.getMonth()]);
      const matchesStatus = filters.status.length === 0 || filters.status.includes(order.status.toLowerCase());
      const matchesCreator = filters.creators.length === 0 || (order.createdBy?.name && filters.creators.includes(order.createdBy.name));
      return matchesSearch && matchesDate && matchesMonth && matchesStatus && matchesCreator;
    }).sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
  }, [data, searchTerm, filters]);

  const totalPages = Math.ceil(filteredOrders.length / 10);
  const currentOrders = filteredOrders.slice((currentPage - 1) * 10, currentPage * 10);

  // --- PDF Export Logic ---
  const handleExportPdf = async () => {
    if (filteredOrders.length === 0) {
      toast.error("No orders found to export");
      return;
    }

    const toastId = toast.loading("Preparing PDF view...");

    try {
      const { pdf } = await import('@react-pdf/renderer');
      
      // 1. Generate the PDF blob
      const blob = await pdf(<OrderListPDF orders={filteredOrders} />).toBlob();
      
      // 2. Create a local URL for the blob
      const url = URL.createObjectURL(blob);
      
      // 3. Open that URL in a new browser tab
      window.open(url, '_blank');

      toast.success("PDF opened in new tab!", { id: toastId });
      
      // Optional: Clean up the URL object after some time to free memory
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
    } catch (err) {
      console.error("PDF generation error:", err);
      toast.error("Failed to open PDF", { id: toastId });
    }
  };

  if (loading && !data) return <OrderListSkeleton />;
  if (error && !data) return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex-1 flex flex-col">
      <OrderStatusModal isOpen={!!editingOrder} onClose={() => setEditingOrder(null)} onSave={(s) => { if(editingOrder) onUpdateStatus(editingOrder.id || editingOrder._id, s); setEditingOrder(null); }} currentStatus={editingOrder?.status || 'pending'} orderId={editingOrder?.invoiceNumber || ''} isSaving={isUpdatingStatus} />

      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-[#202224]">Order List</h1>
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="search" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              placeholder="Search by Invoice or Party Name" 
              className="h-10 w-full bg-gray-200 border-none pl-10 pr-4 rounded-full text-sm shadow-sm outline-none focus:ring-2 focus:ring-secondary" />
          </div>
          
          <button onClick={() => setIsFilterVisible(!isFilterVisible)} className={`p-2.5 rounded-lg border transition-all ${isFilterVisible ? 'bg-secondary text-white shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}><FunnelIcon className="h-5 w-5" /></button>
          
          <ExportActions onExportPdf={handleExportPdf} />
          
          <Button className="whitespace-nowrap">
                Create New Order
          </Button>
        </div>
      </motion.div>

      <AnimatePresence>
        {isFilterVisible && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-visible mb-6">
            <div ref={filterRef} className="bg-primary rounded-xl p-5 text-white flex flex-wrap items-center gap-10 shadow-xl relative z-[60]">
              <div className="flex items-center gap-3 text-sm font-semibold border-r border-white/20 pr-6"><FunnelIcon className="h-4 w-4 text-white/70" /><span>Filter By</span></div>
              <FilterDropdown label="Created By" selected={filters.creators} options={availableCreators} onChange={(val) => setFilters({...filters, creators: val})} />
              <FilterDropdown label="Status" selected={filters.status} options={statusesList} onChange={(val) => setFilters({...filters, status: val})} />
              <FilterDropdown label="Month" selected={filters.month} options={monthsList} onChange={(val) => setFilters({...filters, month: val})} />
              <div className="flex flex-col min-w-[160px]">
                <DatePicker 
                  value={filters.date} 
                  onChange={(date) => setFilters({...filters, date})} 
                  placeholder="Select Date" isClearable 
                  className="bg-transparent border-gray-200 text-sm text-white focus:ring-0 p-0 font-semibold custom-datepicker" />
              </div>
              <button onClick={resetFilters} className="ml-auto flex items-center gap-2 text-[#FF9E66] hover:text-[#ffb285] transition-colors text-sm font-bold uppercase tracking-wider"><ArrowPathIcon className="h-4 w-4" /> Reset Filter</button>
              <button onClick={() => setIsFilterVisible(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors ml-2"><XMarkIcon className="h-4 w-4 text-white/40 hover:text-white" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden relative">
        {isUpdatingStatus && ( <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10"><Loader2 className="animate-spin text-blue-500 h-8 w-8" /></div> )}
        <div className="overflow-x-auto">
          {filteredOrders.length > 0 ? (
            <table className="w-full border-collapse">
              <thead className="bg-secondary text-white text-sm">
                <tr><th className="px-5 py-3 text-left font-semibold whitespace-nowrap">S.NO.</th>
                <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Invoice Number</th>
                <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Party Name</th>
                <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Created By</th>
                <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Expected Delivery Date</th>
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
          ) : (
            <div className="text-center p-20 text-gray-500 font-medium">No orders found.</div>
          )}
        </div>
        {/* Pagination */}
        {filteredOrders.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t text-sm text-gray-500">
            <p>
              Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, filteredOrders.length)} of {filteredOrders.length}
            </p>
            
            <div className="flex gap-2">
              {currentPage > 1 && (
                <Button onClick={() => setCurrentPage(prev => prev - 1)} variant="secondary">Previous</Button>
              )}
              <span className="flex items-center px-4 font-semibold text-black">
                {currentPage} / {totalPages}
              </span>
              {currentPage < totalPages && (
                <Button onClick={() => setCurrentPage(prev => prev + 1)} variant="secondary">Next</Button>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default OrderListContent;