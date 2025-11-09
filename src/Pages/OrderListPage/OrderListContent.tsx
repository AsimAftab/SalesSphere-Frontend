import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/UI/Button/Button';
import ExportActions from '../../components/UI/ExportActions';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
// DELETED: import { pdf } from '@react-pdf/renderer';
// DELETED: import { saveAs } from 'file-saver';
// DELETED: import OrderListPDF from './OrderListPDF';
import { type Order, type OrderStatus } from '../../api/orderService';
import OrderStatusModal from '../../components/modals/OrderStatusModal';

interface OrderListContentProps {
  data: Order[] | null;
  loading: boolean;
  error: string | null;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
  isUpdatingStatus: boolean;
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const statuses: OrderStatus[] = [
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

// ✅ Helper to format date (remove time)
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

const OrderListContent: React.FC<OrderListContentProps> = ({
  data,
  loading,
  error,
  onUpdateStatus,
  isUpdatingStatus
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [exportingStatus, setExportingStatus] = useState<'pdf' | null>(null); // MODIFIED: Removed unused setter
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  // ✅ Filters
  const [selectedMonth, setSelectedMonth] = useState<string>(months[new Date().getMonth()]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const ITEMS_PER_PAGE = 10;

  // ✅ Filter Logic
  const filteredOrders = useMemo(() => {
    if (!data) return [];
    setCurrentPage(1);

    return data
      .filter(order => {
        const orderDate = new Date(order.dateTime);
        const monthMatch = months[orderDate.getMonth()] === selectedMonth;

        const statusMatch =
          selectedStatus === 'all' ||
          order.status.toLowerCase() === selectedStatus.toLowerCase();

        const searchMatch =
          (order.partyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (order.invoiceNumber || '').toLowerCase().includes(searchTerm.toLowerCase());

        return monthMatch && statusMatch && searchMatch;
      })
      .sort(
        (a, b) =>
          new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
      );
  }, [data, searchTerm, selectedMonth, selectedStatus]);

  // ✅ MODIFIED: Export to PDF with Lazy Loading
  const handleExportPdf = async () => {
    setExportingStatus('pdf');
    try {
      // --- LAZY LOADING ---
      const { pdf } = await import('@react-pdf/renderer');
      const { saveAs } = await import('file-saver');
      const OrderListPDF = (await import('./OrderListPDF')).default;
      // --- END LAZY LOADING ---

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

  return (
    <div>
      <OrderStatusModal
        isOpen={!!editingOrder}
        onClose={() => setEditingOrder(null)}
        onSave={handleSaveStatus}
        currentStatus={editingOrder?.status || 'pending'}
        orderId={editingOrder?.invoiceNumber || editingOrder?.id || ''}
        isSaving={isUpdatingStatus}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {loading && data && (
          <div className="text-center p-2 text-sm text-blue-500">Refreshing...</div>
        )}
        {error && data && (
          <div className="text-center p-2 text-sm text-red-600 bg-red-50 rounded">{error}</div>
        )}
        
        {/* MODIFIED: Added exportingStatus check */}
        {exportingStatus && (
          <div className="w-full p-4 mb-4 text-center bg-blue-100 text-blue-800 rounded-lg">
            Generating PDF... Please wait.
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-[#202224] text-center md:text-left">
            Order List
          </h1>

          <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">

            {/* Search Bar (Stays on its own row on mobile) */}
            <div className="relative">
              <MagnifyingGlassIcon className="pointer-events-none absolute inset-y-0 left-3 h-full w-5 text-gray-500" />
              <input
                type="search"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by Invoice # or Party"
                className="block h-10 w-full md:w-64 border-transparent bg-gray-200 py-0 pl-10 pr-3 text-gray-900 placeholder:text-gray-500 focus:ring-0 sm:text-sm rounded-full"
              />
            </div>

            {/* NEW: Wrapper for Filters + Export Button */}
            <div className="flex items-center justify-between gap-4 w-full md:w-auto">

              {/* Item 1: Month & Status Filters */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedMonth}
                  onChange={e => setSelectedMonth(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
                >
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

              {/* Item 2: Export PDF (now on the same line) */}
              <div>
                {/* MODIFIED: Passed exportingStatus to disable button */}
                <ExportActions 
                  onExportPdf={handleExportPdf} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table / Cards */}
        {filteredOrders.length > 0 && !loading ? (
          <>
            {/* Mobile Card View */}
            <div className="block md:hidden space-y-4">
              {currentOrders.map((order) => (
                <div 
                  key={order.id} 
                  className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
                >
                  {/* Card Header */}
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

                  {/* Card Body */}
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

                  {/* Card Footer */}
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
            <div className="bg-white rounded-lg shadow-sm overflow-x-auto hidden md:block">
              <table className="w-full border-collapse">
                <thead className="bg-secondary text-white text-sm">
                  <tr>
                    <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">S.NO.</th>
                    <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Invoice Number</th>
                    <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Party Name</th>
                    <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Expected Delivery Date</th>
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
      </div>
    </div>
  );
};

export default OrderListContent;