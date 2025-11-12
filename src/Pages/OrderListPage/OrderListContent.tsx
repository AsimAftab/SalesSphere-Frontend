import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; 
import Button from '../../components/UI/Button/Button';
import ExportActions from '../../components/UI/ExportActions';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { type Order, type OrderStatus } from '../../api/orderService'; 
import OrderStatusModal from '../../components/modals/OrderStatusModal';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'; 
import 'react-loading-skeleton/dist/skeleton.css'; 
import { Loader2 } from 'lucide-react'; 

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

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const statuses: OrderStatus[] = [
  'completed',
  'in progress',
  'in transit',
  'pending',
  'rejected'
];

const StatusBadge = ({ status, onClick }: { status: OrderStatus; onClick: () => void }) => {
  const baseClasses =
    'px-3 py-1 text-xs font-medium rounded-full cursor-pointer transition-transform hover:scale-105';
  let colorClasses = '';
  switch (status.toLowerCase()) {
    case 'completed':
      colorClasses = 'bg-green-600 text-white';
      break;
    case 'rejected':
      colorClasses = 'bg-red-600 text-white';
      break;
    case 'in transit':
      colorClasses = 'bg-orange-500 text-white';
      break;
    case 'in progress':
      colorClasses = 'bg-violet-600 text-white';
      break;
    case 'pending':
      colorClasses = 'bg-blue-600 text-white';
      break;
    default:
      colorClasses = 'bg-gray-600 text-white';
  }
  return (
    <button onClick={onClick} className={`${baseClasses} ${colorClasses}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </button>
  );
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

const isToday = (dateStr: string) => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// --- Skeleton Component ---
const OrderListSkeleton: React.FC = () => {
  const ITEMS_PER_PAGE = 10;
  return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
      <div>
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold">
            <Skeleton width={180} height={36} />
          </h1>
          <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
            <Skeleton height={40} width={256} borderRadius={999} />
            <div className="flex items-center justify-between gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <Skeleton height={40} width={100} borderRadius={8} />
                <Skeleton height={40} width={120} borderRadius={8} />
                <Skeleton height={40} width={120} borderRadius={8} />
              </div>
              <div>
                <Skeleton height={40} width={100} borderRadius={8} />
              </div>
            </div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <Skeleton height={40} borderRadius={8} className="mb-2" /> {/* Table Head */}
          {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
            <Skeleton key={i} height={50} borderRadius={4} className="mb-1" />
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex justify-between items-center pt-4 text-sm">
          <Skeleton width={150} height={18} />
          <div className="flex items-center gap-x-2">
            <Skeleton height={36} width={80} borderRadius={8} />
            <Skeleton height={36} width={80} borderRadius={8} />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};


const OrderListContent: React.FC<OrderListContentProps> = ({
  data,
  loading,
  error,
  onUpdateStatus,
  isUpdatingStatus,
  initialStatusFilter,
  initialDateFilter,
  initialMonth
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [exportingStatus, setExportingStatus] = useState<'pdf' | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const [selectedMonth, setSelectedMonth] = useState<string>(initialMonth || months[new Date().getMonth()]);
  const [selectedStatus, setSelectedStatus] = useState<string>(initialStatusFilter);
  const [selectedDate, setSelectedDate] = useState<string>(initialDateFilter);

  const ITEMS_PER_PAGE = 10;

  const filteredOrders = useMemo(() => {
    if (!data) return [];
    setCurrentPage(1);

    return data
      .filter(order => {
        const orderDate = new Date(order.dateTime);
        const monthMatch =
          selectedMonth === 'all' ||
          months[orderDate.getMonth()] === selectedMonth;
        const statusMatch =
          selectedStatus === 'all' ||
          order.status.toLowerCase() === selectedStatus.toLowerCase();
        const searchMatch =
          (order.partyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (order.invoiceNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
        const dateMatch =
          selectedDate === 'all' ||
          (selectedDate === 'today' && isToday(order.dateTime));
        return monthMatch && statusMatch && searchMatch && dateMatch;
      })
      .sort(
        (a, b) =>
          new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
      );
  }, [data, searchTerm, selectedMonth, selectedStatus, selectedDate]);

  const handleExportPdf = async () => {
    setExportingStatus('pdf');
    try {
      const { pdf } = await import('@react-pdf/renderer');
      const { saveAs } = await import('file-saver');
      const OrderListPDF = (await import('./OrderListPDF')).default;
      const doc = <OrderListPDF orders={filteredOrders} />;
      const blob = await pdf(doc).toBlob();
      saveAs(blob, 'OrderList.pdf');
    } catch (err) {
      console.error('PDF Export Error: ', err);
    } finally {
      setExportingStatus(null);
    }
  };

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  const goToPage = (pageNumber: number) => {
    const newPage = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(newPage);
  };

  const handleStatusClick = (order: Order) => {
    setEditingOrder(order);
  };

  const handleSaveStatus = (newStatus: OrderStatus) => {
    if (editingOrder) {
      onUpdateStatus(editingOrder.id || editingOrder._id, newStatus);
    }
    setEditingOrder(null);
  };

  // --- Initial Skeleton Load ---
  if (loading && !data) {
    return (
      <div>
        {/* Render modal outside skeleton */}
        <OrderStatusModal
          isOpen={!!editingOrder}
          onClose={() => setEditingOrder(null)}
          onSave={handleSaveStatus}
          currentStatus={editingOrder?.status || 'pending'}
          orderId={editingOrder?.invoiceNumber || editingOrder?.id || ''}
          isSaving={isUpdatingStatus}
        />
        <OrderListSkeleton />
      </div>
    );
  }

  // --- Initial Error/NoData Check ---
  if (error && !data) {
    return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;
  }
  if (!data && !loading) {
    return <div className="text-center p-10 text-gray-500">No orders found.</div>;
  }

  return (
    // --- Swapped main div for motion.div ---
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <OrderStatusModal
        isOpen={!!editingOrder}
        onClose={() => setEditingOrder(null)}
        onSave={handleSaveStatus}
        currentStatus={editingOrder?.status || 'pending'}
        orderId={editingOrder?.invoiceNumber || editingOrder?.id || ''}
        isSaving={isUpdatingStatus}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Overlays */}
        {error && data && (
          <div className="text-center p-2 text-sm text-red-600 bg-red-50 rounded">{error}</div>
        )}
        {exportingStatus && (
          <div className="w-full p-4 mb-4 text-center bg-blue-100 text-blue-800 rounded-lg">
            Generating PDF... Please wait.
          </div>
        )}

        {/* Item 1: Header */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
        >
          <h1 className="text-3xl font-bold text-[#202224] text-center md:text-left">
            Order List
          </h1>
          <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative">
              <MagnifyingGlassIcon className="pointer-events-none absolute inset-y-0 left-3 h-full w-5 text-gray-500" />
              <input
                type="search"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by Invoice No or Party Name"
                className="block h-10 w-full md:w-64 border-transparent bg-gray-200 py-0 pl-10 pr-3 text-gray-900 placeholder:text-gray-500 focus:ring-0 sm:text-sm rounded-full"
              />
            </div>
            {/* Filters + Export Button */}
            <div className="flex items-center justify-between gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <select
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
                >
                  <option value="all">All Dates</option>
                  <option value="today">Today</option>
                </select>
                <select
                  value={selectedMonth}
                  onChange={e => setSelectedMonth(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
                >
                  <option value="all">All Months</option>
                  {months.map(month => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
                >
                  <option value="all">All Status</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <ExportActions
                  onExportPdf={handleExportPdf}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Item 2: Table / Cards */}
        <motion.div variants={itemVariants}>
          {filteredOrders.length > 0 ? (
            <>
              {/* Mobile Card View */}
              <div className="block md:hidden space-y-4 relative">
                {/* --- Refetch overlay --- */}
                {loading && data && (
                  <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10 rounded-lg">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                )}
                {currentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
                  >
                    {/* ... (card content) ... */}
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-bold text-gray-800">
                          {order.invoiceNumber}
                        </div>
                        <div className="text-sm text-gray-600">
                          {order.partyName}
                        </div>
                      </div>
                      <StatusBadge
                        status={order.status}
                        onClick={() => handleStatusClick(order)}
                      />
                    </div>
                    <div className="border-t border-gray-100 pt-3 text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Amount:</span>
                        <span className="font-medium text-black">
                          RS {order.totalAmount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Expected Delivery:</span>
                        <span className="font-medium text-black">
                          {formatDate(order.expectedDeliveryDate)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 text-right">
                      <Link
                        to={`/order/${order.id}`}
                        className="text-blue-500 font-semibold hover:underline text-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="bg-white rounded-lg shadow-sm overflow-x-auto hidden md:block relative">
                {/* --- Refetch overlay --- */}
                {loading && data && (
                  <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10 rounded-lg">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                )}
                <table className="w-full border-collapse">
                  <thead className="bg-secondary text-white text-sm">
                    <tr>
                      <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">S.NO.</th>
                      <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Invoice Number</th>
                      <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Party Name</th>
                      <th className="px-5 py-3 text-left font-semibold whitespace-nowR.ap">Expected Delivery Date</th>
                      <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Total Amount</th>
                      <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Details</th>
                      <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {currentOrders.map((order, index) => (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-200 "
                      >
                        <td className="px-5 py-3 whitespace-nowrap text-black">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap text-black">
                          {order.invoiceNumber}
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap text-black">
                          {order.partyName}
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap text-black">
                          {formatDate(order.expectedDeliveryDate)}
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap text-black">
                          RS {order.totalAmount}
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap text-black">
                          <Link
                            to={`/order/${order.id}`}
                            className="text-blue-500 font-semibold hover:underline"
                          >
                            View Details
                          </Link>
                        </td>
                        <td className="p-5 whitespace-nowrap">
                          <StatusBadge
                            status={order.status}
                            onClick={() => handleStatusClick(order)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 text-sm text-gray-600">
                  <p>
                    Showing {startIndex + 1} -{' '}
                    {Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length}
                  </p>
                  <div className="flex items-center gap-x-2">
                    {currentPage > 1 && (
                      <Button
                        onClick={() => goToPage(currentPage - 1)}
                        variant="secondary"
                      >
                        Previous
                      </Button>
                    )}
                    <span className="font-semibold">
                      {currentPage} / {totalPages}
                    </span>
                    {currentPage < totalPages && (
                      <Button
                        onClick={() => goToPage(currentPage + 1)}
                        variant="secondary"
                      >
                        Next
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            !loading && (
              <div className="text-center p-10 text-gray-500">No orders found.</div>
            )
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OrderListContent;